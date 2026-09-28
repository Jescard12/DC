// ==============================================
// D&C Clinics — site script
// ==============================================

// --- WhatsApp numbers per location (E.164, no + or spaces) ---
const WHATSAPP_NUMBERS = {
  dany: '96181835995',   // Byblos location
  celine: '96176949739'  // Bikfaya location
};

const LOCATION_LABELS = {
  dany: 'Byblos',
  celine: 'Bikfaya'
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
  '.about-copy, .about-stats, .team-card, .clinic-info, .clinic-book, .service-card, .tech-card, .review-card'
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

// --- Booking forms: build a WhatsApp deep link from form fields (includes chosen doctor) ---
document.querySelectorAll('.book-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const clinic = form.dataset.clinic; // 'dany' or 'celine'
    const number = WHATSAPP_NUMBERS[clinic];
    const locationLabel = LOCATION_LABELS[clinic];

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const doctor = form.doctor.value;
    const service = form.service.value;
    const date = form.date.value;
    const time = form.time.value;
    const note = form.note.value.trim();

    let message = `Hello, I'd like to book an appointment at D&C Clinics ${locationLabel}.\n`;
    message += `Preferred doctor: ${doctor}\n`;
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

// --- Doctor-choice modal (for quick WhatsApp buttons that skip the full form) ---
const doctorModal = document.getElementById('doctorModal');
const doctorModalLocation = document.getElementById('doctorModalLocation');
let modalLocationKey = null;

function openDoctorModal(locationKey) {
  modalLocationKey = locationKey;
  doctorModalLocation.textContent = `${LOCATION_LABELS[locationKey]} Location`;
  document.querySelectorAll('.doctor-option').forEach(btn => {
    const restrictedTo = btn.dataset.clinic;
    btn.style.display = (!restrictedTo || restrictedTo === locationKey) ? '' : 'none';
  });
  doctorModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeDoctorModal() {
  doctorModal.hidden = true;
  modalLocationKey = null;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openDoctorModal(el.dataset.openModal);
  });
});

document.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeDoctorModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && doctorModal && !doctorModal.hidden) closeDoctorModal();
});

document.querySelectorAll('.doctor-option').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!modalLocationKey) return;
    const number = WHATSAPP_NUMBERS[modalLocationKey];
    const locationLabel = LOCATION_LABELS[modalLocationKey];
    const doctor = btn.dataset.doctor;

    const message = `Hello, I'd like to book an appointment at D&C Clinics ${locationLabel} with ${doctor}.`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
    closeDoctorModal();
  });
});