type Choice = 'accepted' | 'rejected';
type Consent = { version: 1; choice: Choice; expires: number };
type Config = { measurementId: string; enabled: boolean; projects: string[] };
type GAWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
const gaWindow = window as unknown as GAWindow;
const banner = document.querySelector<HTMLElement>('#analytics-consent');
const KEY = 'portfolio-analytics-consent';
const MAX_AGE = 183 * 24 * 60 * 60 * 1000;

function initialize(root: HTMLElement, config: Config) {
  if (!config.enabled || !/^G-[A-Z0-9]+$/.test(config.measurementId) || location.protocol !== 'https:' || !['www.ascdigitalstrategy.com', 'ascdigitalstrategy.com'].includes(location.hostname)) return;
  const id = config.measurementId;
  const disableKey = `ga-disable-${id}` as const;
  const allowedPaths = new Set(['/', '/about/', '/work/', '/resume/', '/contact/', '/privacy/', ...config.projects.map(slug => `/work/${slug}/`)]);
  const currentPath = allowedPaths.has(location.pathname) ? location.pathname : '/404/';
  const settings = document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]');
  const close = root.querySelector<HTMLButtonElement>('[data-consent-close]')!;
  let memory: Consent | null = null;
  let storageAvailable = true;
  let started = false;
  let collecting = false;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;
  let returnFocus: HTMLElement | null = null;

  function read(): Consent | null {
    if (!storageAvailable) return memory && memory.expires > Date.now() ? memory : null;
    let value: unknown;
    try { value = JSON.parse(localStorage.getItem(KEY) ?? 'null'); }
    catch { storageAvailable = false; return memory && memory.expires > Date.now() ? memory : null; }
    if (!value || typeof value !== 'object') return null;
    const record = value as Consent;
    return record.version === 1 && ['accepted', 'rejected'].includes(record.choice) && Number.isFinite(record.expires) && record.expires > Date.now() && record.expires <= Date.now() + MAX_AGE + 60000 ? record : null;
  }
  function save(choice: Choice) {
    memory = { version: 1, choice, expires: Date.now() + MAX_AGE };
    try { localStorage.setItem(KEY, JSON.stringify(memory)); }
    catch { storageAvailable = false; }
  }
  function show(open: boolean) {
    root.hidden = !open;
    document.body.classList.toggle('analytics-consent-open', open);
    close.hidden = !read();
  }
  function clearCookies() {
    const names = ['_ga', `_ga_${id.slice(2)}`];
    const parts = location.hostname.split('.');
    const domains = ['', ...parts.map((_, i) => parts.slice(i).join('.')).filter(domain => domain.includes('.'))];
    const paths = new Set(['/']);
    location.pathname.split('/').filter(Boolean).reduce((path, segment) => { const next = `${path}/${segment}`; paths.add(next); paths.add(`${next}/`); return next; }, '');
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax; Secure`;
    }
  }
  function stop() {
    collecting = false;
    gaWindow[disableKey] = true;
    clearCookies();
    // A fresh document removes the already-executing tag, without denied-consent pings.
    if (started) location.reload();
  }
  function start() {
    if (started) return;
    started = true;
    collecting = true;
    gaWindow[disableKey] = false;
    gaWindow.dataLayer = gaWindow.dataLayer ?? [];
    gaWindow.gtag = function () { gaWindow.dataLayer!.push(arguments); };
    const gtag = gaWindow.gtag;
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `https://www.ascdigitalstrategy.com${currentPath}`,
      page_referrer: '',
      page_title: currentPath,
      cookie_expires: MAX_AGE / 1000,
      cookie_update: false,
    });
    gtag('event', 'page_view', { page_location: `https://www.ascdigitalstrategy.com${currentPath}`, page_title: currentPath, page_referrer: '' });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
  }
  function sync() {
    const consent = storageAvailable ? read() : memory;
    clearTimeout(expiryTimer);
    if (consent && consent.expires > Date.now()) {
      show(false);
      if (consent.choice === 'accepted') start(); else stop();
      // Recheck regularly rather than overflowing the browser's 32-bit timer limit.
      expiryTimer = setTimeout(sync, Math.min(consent.expires - Date.now() + 10, 86400000));
    } else {
      stop();
      show(true);
    }
  }
  settings.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => { returnFocus = button; show(true); root.querySelector<HTMLElement>('h2')?.focus(); });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach(button => button.addEventListener('click', () => {
    save(button.dataset.consent as Choice);
    sync();
    if (returnFocus) { returnFocus.focus(); returnFocus = null; }
    else document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true });
  }));
  close.addEventListener('click', () => { show(false); returnFocus?.focus(); returnFocus = null; });
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) sync(); });
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  document.addEventListener('click', event => {
    const consent = read();
    if (!collecting || consent?.choice !== 'accepted' || event.defaultPrevented) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href);
    const linkLocation = link.closest('header.site-header') ? 'header' : link.closest('footer') ? 'footer' : link.closest('.hero-introduction') ? 'home_intro' : link.closest('.project-card') ? 'project_card' : 'page_content';
    const internal = url.origin === location.origin;
    const slug = url.pathname.match(/^\/work\/([^/]+)\/$/)?.[1];
    if (internal && slug && config.projects.includes(slug)) {
      gaWindow.gtag?.('event', 'project_click', { project_slug: slug, link_location: linkLocation });
      return;
    }
    const action = internal && url.pathname === '/resume/' ? 'resume_page' : internal && url.pathname === '/documents/Sierra-Chacon_Ariana_Resume_Web.pdf' ? 'resume_pdf' : url.protocol === 'mailto:' ? 'email' : url.hostname === 'www.linkedin.com' && url.pathname.replace(/\/$/, '') === '/in/arianasierrachacon' ? 'linkedin' : null;
    if (action) gaWindow.gtag?.('event', 'portfolio_cta_click', { cta_action: action, link_location: linkLocation });
  });
  sync();
}
if (banner) {
  try { initialize(banner, JSON.parse(banner.dataset.config ?? '{}')); }
  catch { /* Fail closed: consent and navigation never depend on analytics. */ }
}
