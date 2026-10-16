// Add real contact details before publishing.
const businessEmail = "";
const businessPhone = "";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const quickQuote = document.querySelector("#quick-quote");
const quoteForm = document.querySelector("#quote-form");
const formMessage = document.querySelector("#form-message");
const contactPrompt = document.querySelector("#contact-prompt");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

if (quickQuote && quoteForm) {
  quickQuote.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quickQuote.reportValidity()) return;

    const locations = new FormData(quickQuote);
    quoteForm.elements.namedItem("pickup").value = locations.get("pickup");
    quoteForm.elements.namedItem("dropoff").value = locations.get("dropoff");
    document.querySelector("#move-type").value = "Home move";
    quoteForm.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelector("#customer-name").focus({ preventScroll: true });
  });
}

if (contactPrompt && (businessEmail || businessPhone)) {
  contactPrompt.replaceChildren();
  const contacts = [];

  if (businessPhone) {
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${businessPhone.replace(/[^\d+]/g, "")}`;
    phoneLink.textContent = businessPhone;
    contacts.push(phoneLink);
  }

  if (businessEmail) {
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${businessEmail}`;
    emailLink.textContent = businessEmail;
    contacts.push(emailLink);
  }

  contacts.forEach((contact, index) => {
    if (index) contactPrompt.append(" · ");
    contactPrompt.append(contact);
  });
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.querySelector(".sr-only").textContent = isOpen ? "Open menu" : "Close menu";
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".sr-only").textContent = "Open menu";
      siteNav.classList.remove("is-open");
    }
  });
}

if (quoteForm && formMessage) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    if (!businessEmail) {
      formMessage.textContent = "Quote requests aren't connected yet. Big Al's contact email needs to be added before the site goes live.";
      return;
    }

    const fields = new FormData(quoteForm);
    const subject = `Quote request from ${fields.get("name")}`;
    const body = [
      `Name: ${fields.get("name")}`,
      `Best contact: ${fields.get("contact")}`,
      `Collection: ${fields.get("pickup") || "Not specified"}`,
      `Delivery: ${fields.get("dropoff") || "Not specified"}`,
      `Preferred date: ${fields.get("date") || "Not specified"}`,
      `Job type: ${fields.get("type")}`,
      "",
      "Move details:",
      fields.get("details") || "Not specified",
    ].join("\n");

    window.location.href = `mailto:${encodeURI(businessEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formMessage.textContent = "Your email app should open with the quote request ready to send.";
  });
}
