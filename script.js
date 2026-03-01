const body = document.body;

const setYear = () => {
  const yearNodes = document.querySelectorAll("[data-year]");
  const year = new Date().getFullYear();
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
};

const setActiveNav = () => {
  const page = body.dataset.page;
  const links = document.querySelectorAll(".nav a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if ((page === "home" && href === "index.html") || href === `${page}.html`) {
      link.classList.add("active");
    }
  });
};

const setupMobileNav = () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!menuButton || !nav) return;

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
};

const setupRevealAnimations = () => {
  const revealTargets = document.querySelectorAll(".reveal");
  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => observer.observe(target));
};

const setupPlanPrefill = () => {
  const planSelect = document.querySelector("#plan-select");
  if (!planSelect) return;

  const plan = new URLSearchParams(window.location.search).get("plan");
  if (plan) {
    const option = [...planSelect.options].find((item) => item.value === plan);
    if (option) {
      planSelect.value = plan;
    }
  }
};

const setupContactForm = () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const statusNode = document.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const plan = String(data.get("plan") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (statusNode) {
      statusNode.textContent = "";
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/simpletaxcan@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New Client Callback Request - ${plan || "General"}`,
          full_name: name,
          email_address: email,
          phone_number: phone,
          interested_plan: plan || "Not selected",
          message: message || "No additional details provided.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      form.reset();
      if (statusNode) {
        statusNode.textContent = "Request sent successfully. An agent will contact you soon.";
      }
    } catch (error) {
      if (statusNode) {
        statusNode.textContent =
          "Could not send right now. Please try again or email simpletaxcan@gmail.com directly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit & Reach an Agent";
      }
    }
  });
};

setYear();
setActiveNav();
setupMobileNav();
setupRevealAnimations();
setupPlanPrefill();
setupContactForm();
