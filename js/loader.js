/* Loader comum (css/loader.css). Sem código inline (compatível com a CSP estrita).
   - Ao abrir qualquer página: mostra o loader até a página carregar (salvo se a página já tiver o seu: #loader do index e dos painéis).
   - Ao clicar numa ligação para outra página: mostra o loader até a nova página abrir.
   - LermoLoader.logout(destino, fim, mensagem): loader «A terminar sessão…» → fim() (apaga a sessão) → destino. */
(function () {
  if (window.LermoLoader) return;
  var D = document, H = D.documentElement, el = null, hideT = null, busy = false;
  var TX = {
    pt: { load: 'A carregar…', go: 'A abrir…', out: 'A terminar sessão…', aria: 'A carregar' },
    en: { load: 'Loading…', go: 'Opening…', out: 'Logging out…', aria: 'Loading' }
  };
  /* Mensagem própria de cada página (chave = nome do ficheiro sem .html). Serve ao abrir a página e ao navegar para ela. */
  var PG = {
    'index': ['A preparar oportunidades…', 'Preparing opportunities…'],
    'login': ['A abrir o acesso à sua conta…', 'Opening your account access…'],
    'registo': ['A preparar o registo…', 'Preparing sign-up…'],
    'recuperar-senha': ['A preparar a recuperação de senha…', 'Preparing password recovery…'],
    'redefinir-senha': ['A preparar a nova senha…', 'Preparing your new password…'],
    'verificar': ['A preparar a verificação de certificados…', 'Preparing certificate verification…'],
    'legal': ['A carregar os termos e a privacidade…', 'Loading terms and privacy…'],
    'oportunidades': ['A procurar oportunidades…', 'Searching opportunities…'],
    'detalhe': ['A carregar os detalhes da oportunidade…', 'Loading opportunity details…'],
    'dashboard-candidato': ['A preparar o seu painel…', 'Preparing your dashboard…'],
    'dashboard-empresa': ['A preparar o painel da empresa…', 'Preparing the company dashboard…']
  };
  function lang() {
    try { if (localStorage.getItem('lermo-lang') === 'en') return 'en'; } catch (e) {}
    return 'pt';
  }
  function tx(k) { return TX[lang()][k]; }
  function pagina(path) {
    var n = String(path || '').split('/').pop().replace(/\.html?$/, '');
    return n || 'index';
  }
  function msgDe(path) {
    var m = PG[pagina(path)];
    return m ? m[lang() === 'en' ? 1 : 0] : null;
  }
  function build() {
    if (el) return el;
    el = D.createElement('div');
    el.id = 'lmGlobalLoader';
    el.className = 'lmgl hidden';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="lgo"><svg viewBox="0 0 300 300" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="150" cy="144" r="82" stroke-width="9"/><line x1="42" y1="144" x2="58" y2="144" stroke-width="7"/>' +
      '<line x1="242" y1="144" x2="258" y2="144" stroke-width="7"/><g class="orb"><circle cx="185" cy="106" r="32" stroke-width="7"/>' +
      '<circle cx="193" cy="82" r="5" fill="currentColor" stroke="none"/></g><circle cx="150" cy="144" r="2.6" fill="currentColor" stroke="none"/></svg>' +
      'LERMO <span>Recursos</span></div><p><span class="sp" aria-hidden="true"></span><span data-lmgl></span></p><div class="bar" aria-hidden="true"><i></i></div>';
    (D.body || H).appendChild(el);
    return el;
  }
  function show(msg, failsafe) {
    var e = build();
    clearTimeout(hideT);
    e.querySelector('[data-lmgl]').textContent = msg || tx('load');
    e.setAttribute('aria-label', msg || tx('aria'));
    e.classList.remove('hidden');
    H.classList.add('lm-busy');
    if (failsafe) hideT = setTimeout(hide, failsafe); /* se a navegação não acontecer, não fica preso */
  }
  function hide() {
    clearTimeout(hideT);
    if (!el || busy) return;
    el.classList.add('hidden');
    H.classList.remove('lm-busy');
  }
  function logout(dest, fim, msg) {
    if (busy) return;
    busy = true;
    show(msg || tx('out'));
    try { if (fim) fim(); } catch (e) {}
    setTimeout(function () { location.replace(dest || 'login.html'); }, 900);
  }
  window.LermoLoader = { show: show, hide: hide, logout: logout };

  /* 1) Carregamento da página */
  if (!D.getElementById('loader')) {
    var t0 = Date.now();
    var arranca = function () {
      show(msgDe(location.pathname) || tx('load'));
      var fim = function () { setTimeout(hide, Math.max(0, 350 - (Date.now() - t0))); };
      if (D.readyState === 'complete') fim(); else addEventListener('load', fim);
      setTimeout(hide, 10000);
    };
    if (D.body) arranca(); else D.addEventListener('DOMContentLoaded', arranca);
  }

  /* 2) Mudança de página: ligações internas */
  D.addEventListener('click', function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download')) return;
    if (a.target && a.target !== '_self') return;
    if (!/^(https?|file):$/.test(a.protocol)) return;
    if (a.protocol !== location.protocol || a.host !== location.host) return;
    if (a.pathname === location.pathname && a.search === location.search) return; /* só muda o #: não recarrega */
    setTimeout(function () { if (!e.defaultPrevented) show(msgDe(a.pathname) || tx('go'), 8000); }, 0);
  });

  /* Voltar atrás (cache do navegador): não deixar o loader preso */
  addEventListener('pageshow', function (e) { if (e.persisted) { busy = false; hide(); } });
})();
