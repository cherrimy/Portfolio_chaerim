(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  const detailSections = document.querySelectorAll('.detail-section, .detail-section-light');
  const projectCards = document.querySelectorAll('.project-card[href^="#project-"]');
  const detailTabs = document.querySelectorAll('.detail-tab');
  const detailNextLinks = document.querySelectorAll('.detail-next[href^="#project-"]');
  const sectionNextLinks = document.querySelectorAll('.detail-next[href="#about"]');

  if (detailSections.length && projectCards.length) {
    document.documentElement.classList.add('tabs-enabled');

    const scrollToDetailTop = function (target) {
      const header = document.querySelector('.site-header');
      const tabs = document.querySelector('.detail-tabs');
      const offset = (header ? header.offsetHeight : 0) + (tabs ? tabs.offsetHeight : 0);
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    };

    const showDetail = function (id, shouldScroll) {
      let target = null;
      detailSections.forEach(function (section) {
        const isActive = section.id === id;
        section.classList.toggle('is-active', isActive);
        if (isActive) target = section;
      });
      if (!target) return false;
      detailTabs.forEach(function (tab) {
        const isActive = tab.getAttribute('href') === '#' + id;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        if (isActive && tab.scrollIntoView) {
          const bar = tab.parentElement;
          bar.scrollTo({ left: tab.offsetLeft - 24, behavior: 'smooth' });
        }
      });
      if (shouldScroll === 'card') {
        scrollToDetailTop(target);
      } else if (shouldScroll === 'next') {
        scrollToDetailTop(target);
      } else if (shouldScroll === 'tab') {
        scrollToDetailTop(target);
      }
      return true;
    };

    projectCards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        event.preventDefault();
        const id = card.getAttribute('href').slice(1);
        showDetail(id, 'card');
        history.replaceState(null, '', '#' + id);
      });
    });

    detailNextLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = link.getAttribute('href').slice(1);
        showDetail(id, 'next');
        history.replaceState(null, '', '#' + id);
      });
    });

    sectionNextLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const innerOffset = window.innerWidth <= 700 ? 28 : 44;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + innerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      });
    });

    detailTabs.forEach(function (tab) {
      tab.addEventListener('click', function (event) {
        event.preventDefault();
        const id = tab.getAttribute('href').slice(1);
        showDetail(id, 'tab');
        history.replaceState(null, '', '#' + id);
      });
    });

    // 스크롤 위치에 따라 활성 탭 자동 전환
    const sectionList = Array.prototype.slice.call(detailSections);
    let ticking = false;
    const syncActiveDetail = function () {
      ticking = false;
      const header = document.querySelector('.site-header');
      const tabs = document.querySelector('.detail-tabs');
      const line = (header ? header.offsetHeight : 0) + (tabs ? tabs.offsetHeight : 0) + 40;
      let current = sectionList[0];
      sectionList.forEach(function (section) {
        if (section.getBoundingClientRect().top <= line) current = section;
      });
      if (!current.classList.contains('is-active')) showDetail(current.id, false);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncActiveDetail);
      }
    }, { passive: true });

    const hashId = window.location.hash.slice(1);
    const hashEl = document.getElementById(hashId);
    const hasDetailHash = hashEl && hashEl.matches('.detail-section, .detail-section-light');
    showDetail(hasDetailHash ? hashId : detailSections[0].id, false);
    if (hasDetailHash) {
      window.addEventListener('load', function () { scrollToDetailTop(hashEl); });
    }
  }

  const sections = document.querySelectorAll('main section[id], footer[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();
