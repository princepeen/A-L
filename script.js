(() => {
  "use strict";

  /* =========================================================
     CONFIG — edit these two things freely
     ========================================================= */
  // Target: 11 July 2026, 3:30 PM IST (India Standard Time = UTC+5:30)
  const TARGET_DATE = new Date("2026-07-11T15:30:00+05:30");

  // Where the letter lives — must sit next to index.html
  const LETTER_PDF_PATH = "letter.pdf";

  /* =========================================================
     Elements
     ========================================================= */
  const countdownView = document.getElementById("countdownView");
  const envelopeView = document.getElementById("envelopeView");

  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMinutes = document.getElementById("cdMinutes");
  const elSeconds = document.getElementById("cdSeconds");

  const envelopeButton = document.getElementById("envelopeButton");
  const envelopeHint = document.getElementById("envelopeHint");
  const openLetterBtn = document.getElementById("openLetterBtn");

  let unlocked = false;
  let countdownTimer = null;

  /* =========================================================
     Countdown
     ========================================================= */
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      unlock();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  function startCountdown() {
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (countdownTimer) clearInterval(countdownTimer);

    countdownView.hidden = true;
    envelopeView.hidden = false;
  }

  /* =========================================================
     Envelope interaction
     ========================================================= */
  function openEnvelope() {
    if (envelopeButton.classList.contains("is-open")) return;
    envelopeButton.classList.add("is-open");
    envelopeButton.setAttribute("aria-expanded", "true");
    if (envelopeHint) envelopeHint.style.display = "none";
  }

  envelopeButton.addEventListener("click", (e) => {
    // If the click landed on the "Open My Letter" button, let its own
    // handler manage the PDF — otherwise this first tap just opens the flap.
    if (e.target.closest("#openLetterBtn")) return;
    openEnvelope();
  });

  envelopeButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (document.activeElement === envelopeButton) {
        e.preventDefault();
        openEnvelope();
      }
    }
  });

  function goToLetter() {
    window.open(LETTER_PDF_PATH, "_blank", "noopener");
  }

  openLetterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goToLetter();
  });

  openLetterBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      goToLetter();
    }
  });

  /* =========================================================
     Ambient falling petals
     ========================================================= */
  function spawnPetals() {
    const container = document.getElementById("petals");
    if (!container) return;
    const count = window.innerWidth < 500 ? 10 : 18;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDuration = 10 + Math.random() * 14 + "s";
      petal.style.animationDelay = Math.random() * -20 + "s";
      petal.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      const scale = 0.6 + Math.random() * 1.1;
      petal.style.width = `${8 * scale}px`;
      petal.style.height = `${8 * scale}px`;
      container.appendChild(petal);
    }
  }

  /* =========================================================
     Init
     ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    spawnPetals();

    if (TARGET_DATE.getTime() - Date.now() <= 0) {
      unlock();
    } else {
      startCountdown();
    }
  });
})();

