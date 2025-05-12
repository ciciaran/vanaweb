import { formatDate, formatTime } from "../utils/dateUtils.js";

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "APIError";
  }
}

const CACHE_KEY = "lumaEvents";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedEvents() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, events } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return events;
    }
  }
  return null;
}

function setCachedEvents(events) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      events,
    })
  );
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "60",
          10
        );
        console.warn(`Rate limit exceeded. Retrying in ${retryAfter} seconds.`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      } else {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  throw new Error("Max retries reached");
}

async function fetchEvents() {
  const apiKey = import.meta.env.VITE_LUMA_API_KEY;

  try {
    const response = await fetchWithRetry(
      "https://api.lu.ma/public/v1/calendar/list-events",
      {
        headers: {
          "x-luma-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.entries)) {
      throw new Error("Invalid API response structure");
    }

    const now = new Date();
    const events = data.entries
      .filter((entry) => entry.event && entry.event.visibility === "public")
      .map((entry) => {
        const eventDate = new Date(entry.event.start_at);
        const isPast = eventDate < now;
        return {
          name: entry.event.name || "Unnamed Event",
          date: eventDate,
          location: entry.event.geo_address_json?.full_address || "Online",
          startTime: formatTime(entry.event.start_at),
          endTime: formatTime(entry.event.end_at),
          url: entry.event.url || "#",
          imageUrl: entry.event.cover_url || "default-image-url.jpg",
          isPast: isPast,
        };
      });

    // Separate upcoming and past events
    const upcomingEvents = events
      .filter((event) => !event.isPast)
      .sort((a, b) => a.date - b.date) // Ascending order - soonest first
      .map((event) => ({
        ...event,
        date: formatDate(event.date),
        startTime: event.startTime,
        endTime: event.endTime,
      }));

    const pastEvents = events
      .filter((event) => event.isPast)
      .sort((a, b) => b.date - a.date) // Descending order - most recent first
      .map((event) => ({
        ...event,
        date: formatDate(event.date),
        startTime: event.startTime,
        endTime: event.endTime,
      }));

    return {
      upcoming: upcomingEvents,
      past: pastEvents,
    };
  } catch (error) {
    if (error instanceof APIError && error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else {
      console.error("Error fetching events:", error);
    }
    throw error;
  }
}

export async function getEvents() {
  const cachedEvents = getCachedEvents();
  if (cachedEvents) {
    return cachedEvents;
  }

  const events = await fetchEvents();
  setCachedEvents(events);
  return events;
}
