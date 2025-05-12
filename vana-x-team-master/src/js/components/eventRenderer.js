export function renderEvents(events) {
  // Get both list wrappers
  const upcomingWrap = document.querySelector(
    '[data-event="list-wrap"][data-event-upcoming]'
  );
  const pastWrap = document.querySelector(
    '[data-event="list-wrap"][data-event-past]'
  );

  if (!upcomingWrap || !pastWrap) {
    console.error("One or both list wrappers not found!");
    return;
  }

  const cardTemplate = document.querySelector('[data-event="main-card"]');
  if (!cardTemplate) {
    console.error("Card template not found!");
    return;
  }

  // Clear existing dynamic events from both wrappers
  [upcomingWrap, pastWrap].forEach((wrapper) => {
    Array.from(wrapper.children).forEach((child) => {
      if (child.hasAttribute("data-dynamic-event")) {
        child.remove();
      }
    });
  });

  // Helper function to render a single event card
  const renderEventCard = (event) => {
    const eventCard = cardTemplate.cloneNode(true);
    eventCard.style.display = "block";
    eventCard.setAttribute("data-dynamic-event", "true");

    if (event.isPast) {
      eventCard.classList.add("is--past");
    }

    // Helper function to safely set text content
    const setTextContent = (selector, content) => {
      const elements = eventCard.querySelectorAll(`[data-event="${selector}"]`);
      elements.forEach((element) => {
        element.textContent = content;
      });
    };

    // Populate event details
    setTextContent("event-name", event.name);
    setTextContent(
      "event-date",
      event.isPast ? `${event.date} (Past Event)` : event.date
    );
    setTextContent("location", event.location);
    setTextContent("event-start-time", event.startTime);
    setTextContent("event-end-time", event.endTime);

    const linkElements = eventCard.querySelectorAll(
      '[data-event="event-link-url"]'
    );
    linkElements.forEach((linkElement) => {
      linkElement.href = event.url;
    });

    const imageElement = eventCard.querySelector('[data-event="event-image"]');
    if (imageElement) {
      imageElement.src = event.imageUrl;
      imageElement.alt = event.name;
    }

    return eventCard;
  };

  // Render upcoming events
  events.upcoming.forEach((event) => {
    const eventCard = renderEventCard(event);
    upcomingWrap.appendChild(eventCard);
  });

  // Render past events
  events.past.forEach((event) => {
    const eventCard = renderEventCard(event);
    pastWrap.appendChild(eventCard);
  });
}
