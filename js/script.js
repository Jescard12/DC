// ==============================================
// D&C Clinics — site script
// ==============================================

// --- WhatsApp numbers (E.164, no + or spaces) ---
// IMPORTANT: replace CELINE number below once you have it.
const WHATSAPP_NUMBERS = {
  dany: '96181835995',
  celine: '96100000000' // <-- PLACEHOLDER: replace with Dr. Celine's real WhatsApp number
};

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// --- Scroll reveal ---
const revealTargets = document.querySelectorAll(
  '.about-copy, .about-stats, .clinic-info, .clinic-book, .service-card, .review-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// --- Booking forms: build a WhatsApp deep link from form fields ---
document.querySelectorAll('.book-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const clinic = form.dataset.clinic; // 'dany' or 'celine'
    const number = WHATSAPP_NUMBERS[clinic];

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const date = form.date.value;
    const time = form.time.value;
    const note = form.note.value.trim();

    const clinicLabel = clinic === 'dany' ? 'Byblos' : 'Bikfaya';

    let message = `Hello, I'd like to book an appointment at D&C Clinics ${clinicLabel}.\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Service: ${service}\n`;
    if (date) message += `Preferred day: ${date}\n`;
    if (time) message += `Preferred time: ${time}\n`;
    if (note) message += `Note: ${note}\n`;

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  });
});
