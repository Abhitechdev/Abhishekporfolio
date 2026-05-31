// ===== VIDEO REEL TOGGLE =====
function toggleReel(card) {
  const video = card.querySelector('video');
  const playBtn = card.querySelector('.reel-play');
  
  if (!video) return;

  // Pause all other playing reels
  document.querySelectorAll('.reel-card.playing').forEach(otherCard => {
    if (otherCard !== card) {
      const otherVideo = otherCard.querySelector('video');
      if (otherVideo) {
        otherVideo.pause();
        otherVideo.muted = true;
      }
      otherCard.classList.remove('playing');
      // Reset play icon
      const otherBtn = otherCard.querySelector('.reel-play');
      if (otherBtn) {
        otherBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      }
    }
  });

  if (video.paused) {
    video.muted = false;
    video.play();
    card.classList.add('playing');
    playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  } else {
    video.pause();
    card.classList.remove('playing');
    playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
}

// Pause all reels when switching tabs
function pauseAllReels() {
  document.querySelectorAll('.reel-card.playing').forEach(card => {
    const video = card.querySelector('video');
    if (video) {
      video.pause();
      video.muted = true;
    }
    card.classList.remove('playing');
    const btn = card.querySelector('.reel-play');
    if (btn) {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
  });
}

// ===== TAB NAVIGATION =====
function switchTab(tabName) {
  // Pause any playing reels when switching tabs
  pauseAllReels();

  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });

  // Update sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(`section-${tabName}`);
  if (targetSection) {
    targetSection.classList.add('active');
    // Re-trigger animations
    setTimeout(() => {
      triggerAnimations(targetSection);
    }, 100);
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach click listeners to nav tabs
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
  });
});


// ===== SCROLL ANIMATIONS =====
function triggerAnimations(container) {
  const elements = container.querySelectorAll('.animate-in');
  elements.forEach((el, i) => {
    el.classList.remove('visible');
    setTimeout(() => {
      el.classList.add('visible');
    }, 50 + i * 80);
  });
}

// Intersection Observer for scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

// Observe all animate-in elements
document.querySelectorAll('.animate-in').forEach(el => {
  observer.observe(el);
});

// Initial animation for home section
setTimeout(() => {
  triggerAnimations(document.getElementById('section-home'));
}, 300);


// ===== ANIMATED STAT COUNTERS =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const text = counter.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    let current = 0;
    const increment = Math.ceil(target / 40);
    const duration = 1500;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current + suffix;
    }, stepTime);
  });
}

// Trigger counter animation when home section loads
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  statObserver.observe(statsRow);
}


// ===== CONTACT FORM HANDLER =====
function handleSubmit(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-send-message');
  const originalHTML = btn.innerHTML;
  
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
    Sending...
  `;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      Message Sent! ✨
    `;
    btn.style.background = '#22c55e';
    btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.boxShadow = '';
      document.getElementById('contactForm').reset();
    }, 2500);
  }, 1500);
}


// ===== SMOOTH PARALLAX ON HERO =====
const heroCard = document.querySelector('.hero-card');
const heroImg = document.querySelector('.hero-img');

if (heroCard && heroImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const rect = heroCard.getBoundingClientRect();
    if (rect.bottom > 0) {
      heroImg.style.transform = `translateY(${scrollY * 0.1}px) scale(1.04)`;
    }
  });
}


// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  const tabs = ['home', 'skills', 'reels', 'contact'];
  const currentTab = document.querySelector('.nav-tab.active')?.dataset.tab;
  const currentIndex = tabs.indexOf(currentTab);

  if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
    switchTab(tabs[currentIndex + 1]);
  } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
    switchTab(tabs[currentIndex - 1]);
  }
});


// ===== ADD CSS ANIMATION KEYFRAME FOR SPIN =====
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);


// ===== CUSTOM CURSOR LOGIC =====
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }
});

// Spring-based interpolation for cursor ring (smoothest feel)
function updateRing() {
  const dx = mouseX - ringX;
  const dy = mouseY - ringY;
  
  ringX += dx * 0.15;
  ringY += dy * 0.15;
  
  if (ring) {
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
  }
  
  requestAnimationFrame(updateRing);
}
updateRing();

// Hover effect states for interactive elements
const hoverTargets = 'a, button, .nav-tab, .card, .skill-card, .reel-card, .contact-link';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverTargets)) {
    dot?.classList.add('hovered');
    ring?.classList.add('hovered');
  }
});

document.addEventListener('mouseout', (e) => {
  if (!e.target.closest(hoverTargets) || (e.relatedTarget && !e.relatedTarget.closest(hoverTargets))) {
    dot?.classList.remove('hovered');
    ring?.classList.remove('hovered');
  }
});

// Click active states
document.addEventListener('mousedown', () => {
  ring?.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
  ring?.classList.remove('clicking');
});

// ===== LIGHT TRACKING HOVER EFFECT (SPOTLIGHT) =====
function setupSpotlight() {
  const spotlightElements = document.querySelectorAll('.card, .skill-card, .contact-link');

  spotlightElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

setupSpotlight();
