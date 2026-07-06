/* ═══════════════════════════════════════════
   DFX STUDIO — Main JavaScript
═══════════════════════════════════════════ */

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 700);
  }, 2000);
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll to top button
  const scrollBtn = document.getElementById('scrollTop');
  if (window.scrollY > 400) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobile();
  }
});

// ── HERO SLIDESHOW ──
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
  heroSlides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

// ── COUNTER ANIMATION ──
/*function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}*/
function animateCounter(id, target) {
    const element = document.getElementById(id);

    if (!element) {
        console.error(`Element with id '${id}' not found.`);
        return;
    }

    let current = 0;
    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current;
    }, 20);
}

// ── INTERSECTION OBSERVER ──
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Process steps observer
document.querySelectorAll('.process-step').forEach(el => {
  revealObserver.observe(el);
});

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        animateCounter(num, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);

// ── GALLERY FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
let lightboxImages = [];
let currentLightboxIndex = 0;

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Update lightbox images
    buildLightboxList();
  });
});

function buildLightboxList() {
  lightboxImages = [];
  document.querySelectorAll('.gallery-item:not(.hidden) img').forEach(img => {
    lightboxImages.push({ src: img.src, alt: img.alt });
  });
}

buildLightboxList();

// ── LIGHTBOX ──
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    buildLightboxList();
    const idx = lightboxImages.findIndex(i => i.src === img.src);
    currentLightboxIndex = idx >= 0 ? idx : 0;
    openLightbox();
  });
});

function openLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  lbImg.src = lightboxImages[currentLightboxIndex].src;
  lbImg.alt = lightboxImages[currentLightboxIndex].alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function changeLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  openLightbox();
}

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightbox(-1);
  if (e.key === 'ArrowRight') changeLightbox(1);
});

// ── VIDEO PLAYER ──
function playVideo(btn) {
  const videoThumb = btn.closest('.video-thumb');
  const video = videoThumb.querySelector('video');
  const overlay = videoThumb.querySelector('.video-overlay');

  if (video) {
    video.muted = false;
    video.controls = true;
    video.play();
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }
}

// Video hover preview
document.querySelectorAll('.video-thumb').forEach(thumb => {
  const video = thumb.querySelector('video');
  if (!video) return;
  thumb.addEventListener('mouseenter', () => {
    if (!video.controls) {
      video.muted = true;
      video.play().catch(() => {});
    }
  });
  thumb.addEventListener('mouseleave', () => {
    if (!video.controls) {
      video.pause();
    }
  });
});

// ── TESTIMONIALS CAROUSEL ──
const track = document.getElementById('testimonialTrack');
//const cards = document.querySelectorAll('.testimonial-card');
let cards = [];
const dotsContainer = document.getElementById('carouselDots');
let currentCarousel = 0;
let cardsPerView = 3;
let autoplayTimer;

function getCardsPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function buildDots() {
  dotsContainer.innerHTML = '';
  const totalDots = cards.length - cardsPerView + 1;
  for (let i = 0; i <= Math.max(0, cards.length - cardsPerView); i++) {
    const dot = document.createElement('button');
    dot.className = 'dot-btn' + (i === currentCarousel ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { currentCarousel = i; updateCarousel(); });
    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  currentCarousel = Math.min(currentCarousel, maxIndex);
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
  track.style.transform = `translateX(-${currentCarousel * cardWidth}px)`;
  document.querySelectorAll('.dot-btn').forEach((d, i) => {
    d.classList.toggle('active', i === currentCarousel);
  });
}

function moveCarousel(dir) {
  cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  currentCarousel = Math.max(0, Math.min(currentCarousel + dir, maxIndex));
  updateCarousel();
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    currentCarousel = currentCarousel >= maxIndex ? 0 : currentCarousel + 1;
    updateCarousel();
  }, 4500);
}

cardsPerView = getCardsPerView();
buildDots();
updateCarousel();
resetAutoplay();
window.addEventListener('resize', () => { cardsPerView = getCardsPerView(); buildDots(); updateCarousel(); });

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');
const submitBtn = document.getElementById('submitBtn');

/*contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    eventDate: document.getElementById('eventDate').value,
    message: document.getElementById('message').value.trim(),
  };

  // Basic validation
  if (!formData.name || !formData.email || !formData.service || !formData.message) {
    showAlert('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    showAlert('Please enter a valid email address.', 'error');
    return;
  }

  // Show loading state
  setLoading(true);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      showAlert('✅ ' + data.message, 'success');
      contactForm.reset();
    } else {
      showAlert('❌ ' + data.message, 'error');
    }
  } catch (err) {
    showAlert('❌ Something went wrong. Please try again or contact us directly.', 'error');
  } finally {
    setLoading(false);
  }
});
*/

//const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", submitBooking);

async function submitBooking(e) {

    e.preventDefault();

    const booking = {

        name: document.getElementById("name").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        service: document.getElementById("service").value,

        eventDate: document.getElementById("eventDate").value
            ? new Date(document.getElementById("eventDate").value).toISOString()
            : null,

        message: document.getElementById("message").value.trim()

    };

    if (!booking.name ||
        !booking.email ||
        !booking.service ||
        !booking.message) {

        alert("Please fill all required fields.");

        return;

    }

    const result = await ApiService.postBooking(booking);

    if (result != null) {

        alert("Booking submitted successfully.");

        contactForm.reset();

    }
    else {

        alert("Unable to submit booking.");

    }

}
function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = `form-alert ${type}`;
  formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { formAlert.className = 'form-alert hidden'; }, 8000);
}

function setLoading(loading) {
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = loading;
  if (loading) {
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
  } else {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

// ── SMOOTH SCROLL FOR NAV LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── FOOTER YEAR ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

console.log('🎬 DFX Studio — Welcome to the website!');


document.addEventListener("DOMContentLoaded", async () => {
    const stats = await ApiService.getStats();

    if (!stats) return;

    animateCounter("projectsDone", stats.projectsDone);
    animateCounter("yearsExperience", stats.yearsExperience);
    animateCounter("happyClients", stats.happyClients);
});

function animateCounter(id, target) {
    const element = document.getElementById(id);

    let current = 0;
    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current;
    }, 20);
}
async function loadServices() {
    const services = await ApiService.getServices();

    const grid = document.getElementById("servicesGrid");

    if (!grid || !services) return;

    let html = "";

    services.forEach((service, index) => {

        const points = service.points
            .map(point => `<li>${point}</li>`)
            .join("");

        html += `
            <div class="service-card reveal-up" style="--delay:${index * 0.1}s">
                <div class="service-img">
                    <img src="http://localhost:5000${service.imageUrl}"
                         alt="${service.title}"
                         loading="lazy" />
                    <div class="service-overlay"></div>
                </div>

                <div class="service-body">
                    <span class="service-icon">${service.icon}</span>

                    <h3>${service.title}</h3>

                    <p>${service.description}</p>

                    <ul class="service-list">
                        ${points}
                    </ul>

                    <a href="#contact" class="service-link">
                        Enquire →
                    </a>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // Re-run reveal animation if your site uses one
    if (typeof revealElements === "function") {
        revealElements();
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    await loadStats();
    await loadServices();
     await loadGallery();
      await loadReviews();
});

async function loadStats() {

    const stats = await ApiService.getStats();

    if (!stats) return;

    animateCounter("projectsDone", stats.projectsDone);
    animateCounter("yearsExperience", stats.yearsExperience);
    animateCounter("happyClients", stats.happyClients);

}

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let current = 0;

    const step = Math.ceil(target / 100);

    const timer = setInterval(() => {

        current += step;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current;

    }, 20);
}


async function loadServices() {

    const services = await ApiService.getServices();

    if (!services) return;

    const grid = document.getElementById("servicesGrid");

    if (!grid) {
        console.error("servicesGrid not found");
        return;
    }

    let html = "";

    services.forEach(service => {

        html += `
            <div class="service-card">

                <div class="service-img">
                    <img
                        src="http://localhost:5000${service.imageUrl}"
                        alt="${service.title}">
                </div>

                <div class="service-body">

                    <span class="service-icon">${service.icon}</span>

                    <h3>${service.title}</h3>

                    <p>${service.description}</p>

                </div>

            </div>
        `;
    });

    grid.innerHTML = html;

    console.log("Services Rendered");
}

async function loadGallery() {

    const gallery = await ApiService.getGallery();

    if (!gallery) return;

    const grid = document.getElementById("galleryGrid");

    if (!grid) {
        console.error("galleryGrid not found");
        return;
    }

    let html = "";

    gallery.forEach((item, index) => {

        let extraClass = "";

        if (index % 4 === 0)
            extraClass = "tall";
        else if (index % 3 === 0)
            extraClass = "wide";

        html += `
            <div class="gallery-item ${extraClass}" data-category="${item.category}">

                <img
                    src="${SERVER_URL}${item.imageUrl}"
                    alt="${item.category}"
                    loading="lazy">

                <div class="gallery-hover">
                    <span>${capitalize(item.category)}</span>
                </div>

            </div>
        `;
    });

    grid.innerHTML = html;

    initializeGalleryFilter();
    initializeLightbox();
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function initializeGalleryFilter() {

    const filterBtns = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterBtns.forEach(btn => {

        btn.addEventListener("click", () => {

            filterBtns.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {

                if (filter === "all" || item.dataset.category === filter)
                    item.style.display = "";
                else
                    item.style.display = "none";

            });

        });

    });

}



async function loadReviews() {

    const reviews = await ApiService.getReviews();

    if (!reviews) return;

    const track = document.getElementById("testimonialTrack");

    if (!track) {
        console.error("testimonialTrack not found");
        return;
    }

    let html = "";

    reviews.forEach(review => {

        html += `
            <div class="testimonial-card">

                <div class="stars">
                    ${getStars(review.rating)}
                </div>

                <p class="testimonial-text">
                    "${review.comment}"
                </p>

                <div class="testimonial-author">

                    <div class="author-avatar">
                        ${review.avatar}
                    </div>

                    <div>

                        <strong>
                            ${review.name}
                        </strong>

                        <span>
                            ${review.label}
                        </span>

                    </div>

                </div>

            </div>
        `;

    });

    track.innerHTML = html;

    initializeTestimonials();

}

function getStars(rating) {

    return "★".repeat(rating) + "☆".repeat(5 - rating);

}

function initializeTestimonials() {

    cards = document.querySelectorAll(".testimonial-card");

    cardsPerView = getCardsPerView();


    buildDots();

    updateCarousel();

    resetAutoplay();

}

function initializeLightbox() {

    buildLightboxList();

    document.querySelectorAll(".gallery-item").forEach(item => {

        item.addEventListener("click", () => {

            const img = item.querySelector("img");

            buildLightboxList();

            const index = lightboxImages.findIndex(i => i.src === img.src);

            currentLightboxIndex = index >= 0 ? index : 0;

            openLightbox();

        });

    });

}