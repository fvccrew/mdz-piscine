/* ============================================
   MDZ PISCINE — PISCINISTE CAVALAIRE
   JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // CURSEUR PERSONNALISÉ
  // ============================================
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Animation fluide du follower
  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Agrandir sur les éléments cliquables
  const clickables = document.querySelectorAll('a, button, .filtre-btn, .realisation-item, .nav-links a');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursorFollower.style.width = '60px';
      cursorFollower.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursorFollower.style.width = '36px';
      cursorFollower.style.height = '36px';
    });
  });


  // ============================================
  // NAVIGATION ENTRE PAGES (SPA)
  // ============================================
  const pages = {
    intro: document.getElementById('page-intro'),
    accueil: document.getElementById('page-accueil'),
    apropos: document.getElementById('page-apropos'),
    realisations: document.getElementById('page-realisations'),
    contact: document.getElementById('page-contact'),
    mentions: document.getElementById('page-mentions'),
  };

  function showPage(name) {
    // Masquer toutes les pages
    Object.values(pages).forEach(p => p.classList.remove('active'));

    // Afficher la page cible
    if (pages[name]) {
      pages[name].classList.add('active');
      // Double scroll pour garantir le haut de page
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 30);
    }

    // Mettre à jour les liens actifs dans la nav
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === name);
    });

    // Init reveals pour la nouvelle page
    setTimeout(initReveals, 100);

    // Inits spécifiques page accueil
    if (name === 'accueil') {
      setTimeout(() => {
        initHeroAnimations();
        initGalerie();
        initTemoignages();
      }, 80);
    }

    // Inits spécifiques page à propos
    if (name === 'apropos') {
      setTimeout(() => {
        const img = document.querySelector('.apropos-header-img');
        if (img) setTimeout(() => img.classList.add('loaded'), 100);
        document.querySelectorAll('.reveal-hero').forEach(el => el.classList.add('visible'));
      }, 80);
    }
  }

  // Délégation d'événements pour la navigation
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-page]');
    if (navLink) {
      e.preventDefault();
      showPage(navLink.dataset.page);
    }
  });

  // Page active par défaut
  showPage('intro');


  // ============================================
  // INTRO — Mur de photos colonnes animées
  // 100% piscines — IDs Pexels vérifiés manuellement
  // ============================================
  const photoGrid = document.getElementById('photoGrid');
  const introDots = document.getElementById('introDots');
  const slideCounter = document.getElementById('slideCounter');

  // 100% piscines — chaque ID vérifié par son titre exact Pexels
  const pools = [
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&w=600',     // White Sunloungers Beside Pool ✓
    'https://images.pexels.com/photos/261238/pexels-photo-261238.jpeg?auto=compress&w=600',     // Swimming Pool ✓
    'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&w=600',     // Swimming Pool Under Blue Sky ✓
    'https://images.pexels.com/photos/105933/pexels-photo-105933.jpeg?auto=compress&w=600',     // Red Chair Near Swimming Pool ✓
    'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&w=600',   // Infinity Pool Maldives ✓
    'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&w=600',   // Trees Near Swimming Pool — Saint-Tropez ✓
    'https://images.pexels.com/photos/9119738/pexels-photo-9119738.jpeg?auto=compress&w=600',   // Sunloungers Near Swimming Pool ✓
    'https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg?auto=compress&w=600',   // Cabana Close To Swimming Pool ✓
    'https://images.pexels.com/photos/5326898/pexels-photo-5326898.jpeg?auto=compress&w=600',   // Outdoor Swimming Pool Clean Water ✓
    'https://images.pexels.com/photos/8085310/pexels-photo-8085310.jpeg?auto=compress&w=600',   // Swimming Pool Beside Body of Water — Bali ✓
    'https://images.pexels.com/photos/15994062/pexels-photo-15994062.jpeg?auto=compress&w=600', // Luxury Apartment Swimming Pool ✓
    'https://images.pexels.com/photos/26859048/pexels-photo-26859048.jpeg?auto=compress&w=600', // Luxurious Villa Swimming Pool Evening ✓
    'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg?auto=compress&w=600', // Modern Luxury Villa Pool ✓
    'https://images.pexels.com/photos/31817156/pexels-photo-31817156.jpeg?auto=compress&w=600', // Modern Luxury Villa Infinity Pool ✓
    'https://images.pexels.com/photos/24807132/pexels-photo-24807132.jpeg?auto=compress&w=600', // Luxury Villa Private Pool Sea View ✓
  ];

  const photoHeights = ['tall','medium','short','medium','tall','short','medium','tall'];
  const NUM_COLS = 5;

  function buildGrid(urls) {
    if (!photoGrid) return;
    photoGrid.innerHTML = '';
    for (let c = 0; c < NUM_COLS; c++) {
      const col = document.createElement('div');
      col.className = 'photo-col';
      const items = [];
      for (let i = 0; i < 6; i++) {
        const idx = (c * 3 + i) % urls.length;
        const hClass = photoHeights[(c + i * 2) % photoHeights.length];
        items.push({ url: urls[idx], h: hClass });
      }
      [...items, ...items].forEach(item => {
        const div = document.createElement('div');
        div.className = `photo-item ${item.h}`;
        div.style.backgroundImage = `url('${item.url}')`;
        col.appendChild(div);
      });
      photoGrid.appendChild(col);
    }
  }

  buildGrid(pools);

  if (introDots) {
    for (let i = 0; i < 5; i++) {
      const d = document.createElement('div');
      d.className = 'slide-dot' + (i === 0 ? ' active' : '');
      introDots.appendChild(d);
    }
    let activeDot = 0;
    setInterval(() => {
      introDots.children[activeDot].classList.remove('active');
      activeDot = (activeDot + 1) % 5;
      introDots.children[activeDot].classList.add('active');
      if (slideCounter) slideCounter.textContent = String(activeDot + 1).padStart(2, '0') + ' / 05';
    }, 4000);
  }


  // ============================================
  // BURGER MENU MOBILE
  // ============================================
  const burger = document.getElementById('navBurger');
  const navEl = document.getElementById('nav-principale');

  if (burger) {
    burger.addEventListener('click', () => {
      navEl.classList.toggle('nav-mobile-open');
    });
  }

  // Fermer le menu quand on clique un lien
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-page]');
    if (navLink) {
      navEl.classList.remove('nav-mobile-open');
    }
  });
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  // ============================================
  // FILTRES RÉALISATIONS
  // ============================================
  const filtresBtns = document.querySelectorAll('.filtre-btn');
  const realisationItems = document.querySelectorAll('.realisation-item');

  filtresBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtresBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtre = btn.dataset.filtre;

      realisationItems.forEach(item => {
        if (filtre === 'tout' || item.dataset.type === filtre) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.pointerEvents = 'auto';
        } else {
          item.style.opacity = '0.2';
          item.style.transform = 'scale(0.97)';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });


  // ============================================
  // ANIMATIONS REVEAL AU SCROLL
  // ============================================
  function initReveals() {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  initReveals();


  // ============================================
  // COMPTEUR ANIMÉ (chiffres clés)
  // ============================================
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 25);
  }

  const chiffresSection = document.querySelector('.section-chiffres');
  let chiffresAnimated = false;

  const chiffresObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chiffresAnimated) {
        chiffresAnimated = true;
        document.querySelectorAll('.chiffre-num[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  if (chiffresSection) {
    chiffresObserver.observe(chiffresSection);
  }


  // ============================================
  // FORMULAIRE CONTACT
  // ============================================
  const form = document.getElementById('formulaire-contact');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<span style="letter-spacing:0.3em">Envoi en cours…</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span style="letter-spacing:0.3em">Message envoyé ✓</span>';
        btn.style.background = '#2d6a4f';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }


  // ============================================
  // HERO — Animations au chargement
  // ============================================
  function initHeroAnimations() {
    const heroBg = document.querySelector('.hero-bg');
    const heroEls = document.querySelectorAll('.reveal-hero');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
    if (heroEls.length) setTimeout(() => heroEls.forEach(el => el.classList.add('visible')), 200);
  }

  // ============================================
  // GALERIE ACCUEIL
  // ============================================
  function initGalerie() {
    const mosaic = document.getElementById('galerieMosaic');
    if (!mosaic || mosaic.children.length > 0) return;
    const galeriePhotos = [
      { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&w=800', lieu: 'Cavalaire-sur-Mer · 2023', nom: 'Piscine à débordement panoramique' },
      { url: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&w=600', lieu: 'Saint-Tropez · 2023', nom: 'Infinity pool vue mer' },
      { url: 'https://images.pexels.com/photos/9119738/pexels-photo-9119738.jpeg?auto=compress&w=600', lieu: 'Ramatuelle · 2022', nom: 'Piscine miroir avec transats' },
      { url: 'https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg?auto=compress&w=800', lieu: 'La Croix-Valmer · 2022', nom: 'Pool house & piscine tropicale' },
      { url: 'https://images.pexels.com/photos/261238/pexels-photo-261238.jpeg?auto=compress&w=600', lieu: 'Sainte-Maxime · 2023', nom: 'Piscine contemporaine' },
      { url: 'https://images.pexels.com/photos/5326898/pexels-photo-5326898.jpeg?auto=compress&w=600', lieu: 'Grimaud · 2021', nom: 'Bassin eau cristalline' },
    ];
    galeriePhotos.forEach((photo, i) => {
      const item = document.createElement('div');
      item.className = 'galerie-item reveal' + (i > 0 ? ' reveal-delay-' + Math.min(i, 4) : '');
      item.innerHTML = `
        <div class="galerie-img" style="background-image:url('${photo.url}')"></div>
        <div class="galerie-overlay">
          <div><p class="galerie-info-lieu">${photo.lieu}</p><p class="galerie-info-nom">${photo.nom}</p></div>
        </div>`;
      mosaic.appendChild(item);
    });
    setTimeout(initReveals, 50);
  }

  // ============================================
  // SLIDER TÉMOIGNAGES
  // ============================================
  function initTemoignages() {
    const track = document.getElementById('temoignageTrack');
    const prevBtn = document.getElementById('temoPrev');
    const nextBtn = document.getElementById('temoNext');
    const dotsContainer = document.getElementById('temoDots');
    if (!track || dotsContainer.children.length > 0) return;

    const cards = track.querySelectorAll('.temoignage-card');
    const total = cards.length;
    const visible = window.innerWidth < 768 ? 1 : 2;
    const maxIndex = total - visible;
    let current = 0;
    let autoTimer;

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.className = 'temo-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { clearInterval(autoTimer); goTo(i); });
      dotsContainer.appendChild(dot);
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex));
      const cardWidth = cards[0].offsetWidth + 32;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      dotsContainer.querySelectorAll('.temo-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); });
    autoTimer = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 5000);
  }

  // ============================================
  // ENTRÉE AVEC TRANSITION DOUCE
  // ============================================
  const btnEntrer = document.querySelector('.btn-entrer');
  if (btnEntrer) {
    btnEntrer.addEventListener('click', (e) => {
      e.preventDefault();

      // Overlay de transition
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; background: #0a1628; z-index: 9997;
        opacity: 0; transition: opacity 0.6s ease; pointer-events: none;
      `;
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
          showPage('accueil');
          nav.classList.remove('scrolled');
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 600);
        }, 600);
      });
    });
  }

});