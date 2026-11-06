(() => {
  'use strict';

  const containerId = 'GTM-M2H234LF';
  const storageKey = 'okton-analytics-consent-v1';
  window.dataLayer = window.dataLayer || [];

  const readChoice = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch {
      return null;
    }
  };

  const saveChoice = (value) => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // The choice remains valid for this page when browser storage is unavailable.
    }
  };

  const loadTagManager = () => {
    if (document.querySelector('[data-okton-tag-manager]')) return;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(containerId);
    script.setAttribute('data-okton-tag-manager', '');
    document.head.appendChild(script);
  };

  const removeAnalyticsCookies = () => {
    document.cookie.split(';').forEach((part) => {
      const name = part.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = name + '=; Max-Age=0; Path=/okton-brasil/; SameSite=Lax';
    });
  };

  const choice = readChoice();
  if (choice === 'accepted') loadTagManager();

  const banner = document.createElement('aside');
  banner.className = 'okton-consent';
  banner.setAttribute('aria-label', 'Preferências de privacidade');
  banner.hidden = true;
  banner.innerHTML = '<div class="okton-consent-copy"><strong>Medição do site</strong><p>Podemos usar cookies de análise para entender visitas e cliques no site da OKTON. Isso nos ajuda a melhorar o conteúdo. Sua escolha não impede a navegação. <a href="privacy.html">Saiba mais</a>.</p></div><div class="okton-consent-actions"><button type="button" data-consent-reject>Recusar</button><button type="button" data-consent-accept>Aceitar análise</button></div>';
  document.body.appendChild(banner);

  const showBanner = () => { banner.hidden = false; };
  const hideBanner = () => { banner.hidden = true; };

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'okton-consent-settings';
  settingsButton.textContent = 'Preferências de privacidade';
  settingsButton.addEventListener('click', () => {
    showBanner();
    banner.querySelector('[data-consent-reject]').focus();
  });
  document.querySelector('footer')?.appendChild(settingsButton);

  banner.querySelector('[data-consent-accept]').addEventListener('click', () => {
    saveChoice('accepted');
    hideBanner();
    loadTagManager();
  });

  banner.querySelector('[data-consent-reject]').addEventListener('click', () => {
    const wasLoaded = Boolean(document.querySelector('[data-okton-tag-manager]'));
    saveChoice('rejected');
    hideBanner();
    if (wasLoaded) {
      removeAnalyticsCookies();
      window.location.reload();
    }
  });

  if (choice === null) showBanner();
})();
