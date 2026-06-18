/**
 * KASARAGOD TAXI SERVICES – SAHAS TOURS KASARAGOD
 * Main JavaScript – Lightweight, vanilla JS for interactivity
 */

(function () {
    'use strict';

    /* ── DOM References ── */
    const header      = document.getElementById('header');
    const hamburger   = document.getElementById('nav-hamburger');
    const mobileMenu  = document.getElementById('nav-mobile');
    const navLinks    = document.querySelectorAll('.nav__link');
    const mobileLinks = document.querySelectorAll('.nav__mobile-link');

    /* ── Header Scroll Effect ── */
    let lastScroll = 0;
    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Mobile Menu Toggle ── */
    function toggleMobileMenu() {
        hamburger.classList.toggle('nav__hamburger--open');
        mobileMenu.classList.toggle('nav__mobile--open');
        document.body.style.overflow = mobileMenu.classList.contains('nav__mobile--open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    function closeMobileMenu() {
        hamburger.classList.remove('nav__hamburger--open');
        mobileMenu.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
    }

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ── Active Nav Link Highlighting ── */
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightActiveLink, { passive: true });

    /* ── Scroll-Reveal Animation (IntersectionObserver) ── */
    function initScrollReveal() {
        const revealTargets = document.querySelectorAll(
            '.service-card, .fleet-card, .dest-card, .stat, .tour-highlight, .hero__card, .hero__left'
        );

        revealTargets.forEach(function (el) {
            el.classList.add('reveal');
        });

        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything immediately
            revealTargets.forEach(function (el) {
                el.classList.add('reveal--visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealTargets.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ── Smooth Scroll for Anchor Links ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header.offsetHeight;
                var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ── Stat Counter Animation ── */
    function animateCounters() {
        var counters = document.querySelectorAll('.stat__number');

        if (!('IntersectionObserver' in window)) return;

        var counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var text = el.textContent.trim();
                        var suffix = text.replace(/[\d.]/g, '');
                        var target = parseFloat(text);

                        if (isNaN(target)) return;

                        var start = 0;
                        var duration = 1500;
                        var startTime = null;

                        function step(timestamp) {
                            if (!startTime) startTime = timestamp;
                            var progress = Math.min((timestamp - startTime) / duration, 1);
                            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                            var current = Math.floor(eased * target);
                            el.textContent = current + suffix;
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            } else {
                                el.textContent = text; // Restore original text exactly
                            }
                        }

                        requestAnimationFrame(step);
                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    /* ── Initialize on DOM Ready ── */
    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveal();
        animateCounters();
        handleScroll(); // Initial check
    });

})();
