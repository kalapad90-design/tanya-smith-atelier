

document.addEventListener('DOMContentLoaded', () => {

  const bookingModal = document.getElementById('bookingModal');
  const serviceSelect = document.getElementById('serviceSelect');

  function openModal(modal) {
    if (modal && typeof modal.showModal === 'function' && !modal.open) {
      modal.showModal();
    }
  }

  function closeModal(modal) {
    if (modal && typeof modal.close === 'function' && modal.open) {
      modal.close();
    }
  }

  document.querySelectorAll('[command="show-modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('commandfor');
      const targetDialog = document.getElementById(targetId);
      if (targetDialog) openModal(targetDialog);
    });
  });

  document.querySelectorAll('[command="close"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('commandfor');
      const targetDialog = document.getElementById(targetId);
      if (targetDialog) closeModal(targetDialog);
    });
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (event) => {
      const rect = bookingModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal(bookingModal);
      }
    });
  }

  document.querySelectorAll('.select-item-btn, .select-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        for (let opt of serviceSelect.options) {
          if (opt.value.includes(serviceName) || serviceName.includes(opt.value)) {
            opt.selected = true;
            break;
          }
        }
      }
      openModal(bookingModal);
    });
  });

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-animate');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px 0px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });
  }

  const calcTypeSelect = document.getElementById('calcTypeSelect');
  const calcUrgentCheck = document.getElementById('calcUrgentCheck');
  const calcResultDisplay = document.getElementById('calcResultDisplay');
  const calcTelegramBtn = document.getElementById('calcTelegramBtn');

  function updateCompactCalc() {
    if (!calcTypeSelect || !calcResultDisplay) return;

    const base = parseInt(calcTypeSelect.value, 10) || 4500;
    const isUrgent = calcUrgentCheck && calcUrgentCheck.checked;
    const extra = isUrgent ? 2500 : 0;

    const minPrice = base + extra;
    const maxPrice = Math.round(minPrice * 1.35 / 500) * 500;

    calcResultDisplay.textContent = `${minPrice.toLocaleString('ru-RU')} — ${maxPrice.toLocaleString('ru-RU')} ₽`;

    return {
      name: calcTypeSelect.options[calcTypeSelect.selectedIndex]?.getAttribute('data-name') || 'Пошив изделия',
      min: minPrice,
      max: maxPrice,
      urgent: isUrgent
    };
  }

  if (calcTypeSelect) {
    calcTypeSelect.addEventListener('change', updateCompactCalc);
  }
  if (calcUrgentCheck) {
    calcUrgentCheck.addEventListener('change', updateCompactCalc);
  }

  if (calcTelegramBtn) {
    calcTelegramBtn.addEventListener('click', () => {
      const data = updateCompactCalc();
      if (!data) return;

      let text = `Здравствуйте, Татьяна! Хочу рассчитать пошив в ателье TANYA SMITH:%0A`;
      text += `• Изделие: ${data.name}%0A`;
      if (data.urgent) text += `• Срочный пошив: Да (до 4-5 дней)%0A`;
      text += `• Ориентир: ${data.min.toLocaleString('ru-RU')} — ${data.max.toLocaleString('ru-RU')} руб.%0A`;
      text += `Когда можно подойти на примерку на Крупской, 61?`;

      const tgUrl = 'https:' + '/' + '/t.me/tatyana_creation?text=' + text;
      window.open(tgUrl, '_blank');
    });
  }

  updateCompactCalc();

  const portTrack = document.getElementById('portfolioTrack');
  const portPrevBtn = document.getElementById('portPrevBtn');
  const portNextBtn = document.getElementById('portNextBtn');

  if (portTrack && portPrevBtn && portNextBtn) {
    portPrevBtn.addEventListener('click', () => {
      const slide = portTrack.querySelector('.port-slide');
      const step = slide ? slide.offsetWidth + 16 : 260;
      portTrack.scrollBy({ left: -step, behavior: 'smooth' });
    });

    portNextBtn.addEventListener('click', () => {
      const slide = portTrack.querySelector('.port-slide');
      const step = slide ? slide.offsetWidth + 16 : 260;
      portTrack.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  const syncAria = (el) => {
    if (el && typeof el.setAttribute === 'function') {
      try {
        const isInvalid = el.matches(':user-invalid');
        el.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
      } catch (e) {
        if (el.checkValidity) {
          el.setAttribute('aria-invalid', !el.checkValidity() ? 'true' : 'false');
        }
      }
    }
  };

  document.addEventListener('blur', (e) => {
    if (e.target.matches('input, select, textarea')) {
      syncAria(e.target);
    }
  }, true);

  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
      syncAria(e.target);
    }
  });

  const phoneInput = document.getElementById('clientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x) return;
      if (x[1] === '7' || x[1] === '8') {
        e.target.value = !x[3] ? '+7 (' + x[2] : '+7 (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
      }
    });
  }

  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccessScreen = document.getElementById('bookingSuccessScreen');
  const successMessageText = document.getElementById('successMessageText');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const service = document.getElementById('serviceSelect')?.value;

      bookingForm.style.display = 'none';
      if (bookingSuccessScreen) {
        bookingSuccessScreen.hidden = false;
        if (successMessageText) {
          successMessageText.textContent = `Спасибо, ${name}! Заявка на ${service} принята. Татьяна свяжется с вами по номеру ${phone}.`;
        }
      }
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('close', () => {
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.style.display = 'flex';
      }
      if (bookingSuccessScreen) {
        bookingSuccessScreen.hidden = true;
      }
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
