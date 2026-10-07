(function() {
  'use strict';

  // ---- Textos: vêm do tradutor partilhado (js/i18n.js) ----
  const I = window.LermoI18n;

  // ---- LOGIN (painel sobreposto) ----
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPass = document.getElementById('loginPass');
  const loginToggle = document.getElementById('loginToggle');
  const loginSubmit = document.getElementById('loginSubmit');
  const loginAlert = document.getElementById('loginAlert');
  let loginOpener = null;

  function openLogin(opener) {
    document.querySelectorAll('.lm-modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
    loginOpener = opener || null;
    document.getElementById('loginOk').classList.remove('show'); document.getElementById('loginPwOk').classList.remove('show');
    loginModal.classList.add('open');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => loginEmail.focus(), 60);
  }
  function closeLogin() {
    loginModal.classList.remove('open');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (loginOpener) loginOpener.focus();
  }
  // Todos os links para /login abrem o painel (sem JS continuam a ir para /login)
  document.querySelectorAll('a[href="login.html"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openLogin(a); });
  });
  document.getElementById('loginClose').addEventListener('click', closeLogin);
  loginModal.addEventListener('mousedown', e => { if (e.target === loginModal) closeLogin(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && loginModal.classList.contains('open')) closeLogin(); });

  loginToggle.addEventListener('click', () => {
    const show = loginPass.type === 'password';
    loginPass.type = show ? 'text' : 'password';
    loginToggle.setAttribute('aria-pressed', String(show));
    loginToggle.setAttribute('aria-label', I.t(show ? 'login.hide' : 'login.show'));
    loginToggle.querySelector('i').className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
  });

  function markLogin(input, bad) {
    input.closest('.lm-field').classList.toggle('invalid', bad);
    input.setAttribute('aria-invalid', String(bad));
  }
  loginForm.addEventListener('submit', e => {
    const badE = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim());
    const badP = !loginPass.value;
    markLogin(loginEmail, badE); markLogin(loginPass, badP);
    if (badE || badP) { e.preventDefault(); (badE ? loginEmail : loginPass).focus(); return; }
    loginSubmit.disabled = true;
    loginSubmit.querySelector('.go i').className = 'fas fa-spinner fa-spin';
    // Pré-visualização local (file:) não submete; com Spring Security o POST /login segue normalmente.
    if (LermoConta.TEST) {
      e.preventDefault();
      LermoConta.login(loginEmail.value, loginPass.value).then(r => {
        if (r.ok) { const dest = LermoConta.startSession(r.conta); setTimeout(() => { location.href = dest; }, 300); return; }
        loginSubmit.disabled = false;
        loginSubmit.querySelector('.go i').className = 'fas fa-arrow-right';
        const sp = loginAlert.querySelector('span');
        if (r.locked) { sp.removeAttribute('data-i18n'); sp.textContent = I.t('login.locked').replace('{n}', r.wait); }
        else { sp.setAttribute('data-i18n', 'login.error'); sp.textContent = I.t('login.error'); }
        loginAlert.classList.add('show');
        loginPass.value = ''; loginPass.focus();
      });
    }
  });
  [loginEmail, loginPass].forEach(i => i.addEventListener('input', () => markLogin(i, false)));


  // ---- REGISTO (painel sobreposto) ----
  const regModal = document.getElementById('regModal');
  const regForm = document.getElementById('regForm');
  const regTipoCand = document.getElementById('regTipoCand');
  const regTipoEmp = document.getElementById('regTipoEmp');
  const regCompany = document.getElementById('regCompany');
  const regPass = document.getElementById('regPass');
  const regToggle = document.getElementById('regToggle');
  const regSubmit = document.getElementById('regSubmit');
  const regCc = document.getElementById('regCc');
  const $r = id => document.getElementById(id);
  let regOpener = null;

  // Países e indicativos (tabela paises: pais_id, codigo_telefone) — seletor personalizado com bandeiras
  const PAISES = window.LERMO_PAISES;  // lista completa (ISO 3166-1) definida acima
  const ccBtn = $r('regCcBtn'), ccList = $r('regCcList');
  const flagImg = c => '<img class="lm-flag" src="https://flagcdn.com/w40/' + c.toLowerCase() + '.png" srcset="https://flagcdn.com/w80/' + c.toLowerCase() + '.png 2x" width="24" height="18" alt="" loading="lazy">';
  PAISES.forEach(p => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option'); li.tabIndex = -1; li.dataset.code = p[0];
    li.innerHTML = flagImg(p[0]) + '<span class="lm-cc-name">' + I.country(p[0], p[2]) + '</span><span class="lm-cc-dial">' + p[1] + '</span>';
    ccList.appendChild(li);
  });
  function setCountry(code, silent) {
    const p = PAISES.find(x => x[0] === code) || PAISES[0];
    regCc.value = p[0];
    ccBtn.querySelector('.lm-flag-slot').innerHTML = flagImg(p[0]);
    ccBtn.querySelector('.lm-dial').textContent = p[1];
    ccBtn.title = I.country(p[0], p[2]);
    ccList.querySelectorAll('li').forEach(li => li.setAttribute('aria-selected', String(li.dataset.code === p[0])));
    if (!silent) regCc.dispatchEvent(new Event('change'));
  }
  function toggleCc(open) {
    ccList.classList.toggle('open', open);
    ccBtn.setAttribute('aria-expanded', String(open));
    if (open) { const sel = ccList.querySelector('[aria-selected="true"]') || ccList.firstChild; sel.scrollIntoView({ block: 'nearest' }); sel.focus(); }
  }
  ccBtn.addEventListener('click', () => toggleCc(!ccList.classList.contains('open')));
  ccBtn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); toggleCc(true); } });
  ccList.addEventListener('click', e => { const li = e.target.closest('li'); if (li) { setCountry(li.dataset.code); toggleCc(false); ccBtn.focus(); } });
  ccList.addEventListener('keydown', e => {
    if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // escrever uma letra salta para o próximo país que começa por ela
      const k = e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const items = [...ccList.querySelectorAll('li')];
      const cur = items.indexOf(e.target.closest('li'));
      const norm = li => li.querySelector('.lm-cc-name').textContent.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const hit = items.slice(cur + 1).concat(items.slice(0, cur + 1)).find(li => norm(li).startsWith(k));
      if (hit) { e.preventDefault(); hit.focus(); }
      return;
    }
  });
  ccList.addEventListener('keydown', e => {
    const li = e.target.closest('li'); if (!li) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); (li.nextElementSibling || li).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (li.previousElementSibling || li).focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCountry(li.dataset.code); toggleCc(false); ccBtn.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); toggleCc(false); ccBtn.focus(); }
  });
  document.addEventListener('mousedown', e => { if (ccList.classList.contains('open') && !e.target.closest('.lm-cc-wrap')) toggleCc(false); });
  // País por omissão: Moçambique
  setCountry('MZ', true);
  const dialCode = () => (PAISES.find(p => p[0] === regCc.value) || PAISES[0])[1];

  // Identificação fiscal conforme o país: MZ → NUIT; restantes → Tax ID / VAT
  function syncFiscal() {
    const mz = regCc.value === 'MZ';
    const lab = $r('regFiscalLabel'), err = $r('regFiscalErr'), inp = $r('regFiscal');
    lab.setAttribute('data-i18n', mz ? 'reg.nuit' : 'reg.taxId');
    err.setAttribute('data-i18n', mz ? 'reg.nuitErr' : 'reg.taxIdErr');
    lab.textContent = I.t(mz ? 'reg.nuit' : 'reg.taxId');
    err.textContent = I.t(mz ? 'reg.nuitErr' : 'reg.taxIdErr');
    inp.setAttribute('inputmode', mz ? 'numeric' : 'text');
    inp.maxLength = mz ? 9 : 20;
    $r('regTipoId').value = mz ? 'NUIT' : 'TAX_ID';
  }
  regCc.addEventListener('change', () => { syncFiscal(); markReg($r('regFiscal'), false); });
  syncFiscal();

  function syncTipo() {
    const emp = regTipoEmp.checked;
    regCompany.classList.toggle('show', emp); $r('regFiscalBlock').classList.toggle('show', emp);
    $r('regEmpresa').required = emp; $r('regFiscal').required = emp;
    $r('regNomeField').style.display = emp ? 'none' : ''; $r('regNome').required = !emp;
  }
  function openReg(opener, tipo) {
    document.querySelectorAll('.lm-modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
    regOpener = opener || null;
    if (tipo === 'empresa') regTipoEmp.checked = true; else if (tipo === 'candidato') regTipoCand.checked = true;
    syncTipo();
    regModal.classList.add('open');
    regModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $r('regNome').focus(), 60);
  }
  // Redirecciona do registo para o login, com mensagem de sucesso e email preenchido
  function showRegistered(email) {
    openLogin(null);
    document.getElementById('loginOk').classList.add('show');
    if (email) loginEmail.value = email.trim();
    setTimeout(() => (email ? loginPass : loginEmail).focus(), 120);
  }
  function closeReg() {
    regModal.classList.remove('open');
    regModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (regOpener) regOpener.focus();
  }
  // Todos os links para o registo (incluindo ?tipo=) abrem o painel
  document.querySelectorAll('a[href^="registo.html"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const q = a.getAttribute('href').split('?')[1] || '';
      openReg(a, new URLSearchParams(q).get('tipo'));
    });
  });
  $r('regClose').addEventListener('click', closeReg);
  regModal.addEventListener('mousedown', e => { if (e.target === regModal) closeReg(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && regModal.classList.contains('open')) closeReg(); });
  [regTipoCand, regTipoEmp].forEach(r => r.addEventListener('change', syncTipo));

  regToggle.addEventListener('click', () => {
    const show = regPass.type === 'password';
    regPass.type = show ? 'text' : 'password';
    regToggle.setAttribute('aria-pressed', String(show));
    regToggle.setAttribute('aria-label', I.t(show ? 'login.hide' : 'login.show'));
    regToggle.querySelector('i').className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
  });

  function passScore(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
    return v ? Math.max(1, s) : 0;
  }
  function regMeter() {
    const s = passScore(regPass.value), bar = $r('regMeterBar');
    bar.style.width = (s * 25) + '%';
    bar.style.background = ['#B03A2E', '#B03A2E', '#D08A1E', '#6FA86B', '#1B4332'][s];
    $r('regPassHint').textContent = I.t('meter.' + s) || '';
  }
  regPass.addEventListener('input', regMeter);

  function markReg(el, bad) {
    el.closest('.lm-field').classList.toggle('invalid', bad);
    el.setAttribute('aria-invalid', String(bad));
  }
  const regRules = {
    regNome: v => regTipoEmp.checked || (v.trim().length >= 3 && v.trim().split(/\s+/).length >= 2),
    regEmpresa: v => !regTipoEmp.checked || v.trim().length >= 2,
    regFiscal: v => !regTipoEmp.checked || (regCc.value === 'MZ' ? /^\d{9}$/.test(v.replace(/\s/g, '')) : /^[A-Za-z0-9][A-Za-z0-9 .\-\/]{3,18}[A-Za-z0-9]$/.test(v.trim())),
    regEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    regTel: v => { const d = v.replace(/\D/g, ''); return d.length >= 6 && d.length <= 12; },
    regPass: v => v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)
  };
  Object.keys(regRules).forEach(id => {
    const el = $r(id);
    el.addEventListener('input', () => markReg(el, false));
    el.addEventListener('blur', () => { if (el.value) markReg(el, !regRules[id](el.value)); });
  });
  $r('regTerms').addEventListener('change', () => $r('regTermsWrap').classList.remove('invalid'));

  regForm.addEventListener('submit', e => {
    let firstBad = null;
    Object.keys(regRules).forEach(id => {
      const el = $r(id), bad = !regRules[id](el.value);
      markReg(el, bad); if (bad && !firstBad) firstBad = el;
    });
    const noTerms = !$r('regTerms').checked;
    $r('regTermsWrap').classList.toggle('invalid', noTerms);
    if (noTerms && !firstBad) firstBad = $r('regTerms');
    if (firstBad) { e.preventDefault(); firstBad.focus(); return; }
    // Identificação fiscal normalizada (NUIT sem espaços; Tax ID em maiúsculas)
    if (regTipoEmp.checked) $r('regNome').value = $r('regEmpresa').value.trim().slice(0, 150); // conta de empresa: nomeCompleto = nome da empresa
    $r('regFiscal').value = regCc.value === 'MZ' ? $r('regFiscal').value.replace(/\s/g, '') : $r('regFiscal').value.trim().toUpperCase();
    // Telefone completo (indicativo + número sem zeros à esquerda), ex.: +258841234567
    const digits = $r('regTel').value.replace(/\D/g, '').replace(/^0+/, '');
    $r('regTelFull').value = digits ? dialCode() + digits : '';
    regSubmit.disabled = true;
    regSubmit.querySelector('.go i').className = 'fas fa-spinner fa-spin';
    // Pré-visualização local (file:) não submete; com Spring MVC o POST /registo segue normalmente.
    if (LermoConta.TEST || location.protocol === 'file:') {
      e.preventDefault();
      const em = $r('regEmail').value;
      LermoConta.register({ email: em, password: regPass.value, nome_completo: $r('regNome').value.trim(), telefone: $r('regTelFull').value, pais: regCc.value, tipo: regTipoEmp.checked ? 'empresa' : 'candidato' }).then(r => {
        regSubmit.disabled = false; regSubmit.querySelector('.go i').className = 'fas fa-arrow-right';
        const ra = $r('regAlert'); if (!r.ok) { if (ra) ra.classList.add('show'); return; } if (ra) ra.classList.remove('show');
        regForm.reset(); syncFiscal(); syncTipo(); regMeter();
        showRegistered(em);
      });
    }
  });

  // Abre automaticamente com #registo (ou #registo-empresa)
  if (location.hash === '#registo' || location.hash === '#registo-empresa') {
    openReg(null, location.hash === '#registo-empresa' ? 'empresa' : null);
  }

  // Abre automaticamente após erro de autenticação (/?error) ou com #entrar
  if (/[?&]error\b/.test(location.search) || location.hash === '#entrar') {
    loginAlert.classList.toggle('show', /[?&]error\b/.test(location.search));
    openLogin(null);
  }
  // Depois de registar (servidor: redirect:/?registo=ok) abre o login com a mensagem de sucesso
  if (/[?&]registo=ok\b/.test(location.search)) showRegistered('');


  // ---- RECUPERAR / NOVA SENHA (painéis sobrepostos) ----
  const fpModal = $r('fpModal'), rpModal = $r('rpModal');
  const fpForm = $r('fpForm'), fpEmail = $r('fpEmail'), fpSubmit = $r('fpSubmit');
  const rpForm = $r('rpForm'), rpPass = $r('rpPass'), rpPass2 = $r('rpPass2'), rpSubmit = $r('rpSubmit'), rpToggle = $r('rpToggle');
  let pwOpener = null;
  const busy = b => { b.disabled = true; b.querySelector('.go i').className = 'fas fa-spinner fa-spin'; };
  const idle = b => { b.disabled = false; b.querySelector('.go i').className = 'fas fa-arrow-right'; };
  const markF = (el, bad) => { el.closest('.lm-field').classList.toggle('invalid', bad); el.setAttribute('aria-invalid', String(bad)); };
  function openPw(modal, focusEl, opener) {
    document.querySelectorAll('.lm-modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
    pwOpener = opener || null;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => focusEl.focus(), 60);
  }
  function closePw(modal) {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (pwOpener) pwOpener.focus();
  }
  const openFp = opener => { $r('fpSent').classList.remove('show'); openPw(fpModal, fpEmail, opener); };
  const openRp = opener => openPw(rpModal, rpPass, opener);
  document.querySelectorAll('a[href^="recuperar-senha.html"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openFp(a); }));
  document.querySelectorAll('a[href^="redefinir-senha.html"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openRp(a); }));
  [[fpModal, 'fpClose'], [rpModal, 'rpClose']].forEach(([m, id]) => {
    $r(id).addEventListener('click', () => closePw(m));
    m.addEventListener('mousedown', e => { if (e.target === m) closePw(m); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) closePw(m); });
  });
  [fpEmail, rpPass, rpPass2].forEach(i => i.addEventListener('input', () => markF(i, false)));

  fpForm.addEventListener('submit', e => {
    const bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail.value.trim());
    markF(fpEmail, bad);
    if (bad) { e.preventDefault(); fpEmail.focus(); return; }
    busy(fpSubmit);
    // Pré-visualização local (file:) não envia; com Spring o POST /recuperar-senha segue normalmente.
    if (LermoConta.TEST || location.protocol === 'file:') { e.preventDefault(); setTimeout(() => { idle(fpSubmit); $r('fpSent').classList.add('show'); }, 900); }
  });

  rpToggle.addEventListener('click', () => {
    const show = rpPass.type === 'password';
    rpPass.type = rpPass2.type = show ? 'text' : 'password';
    rpToggle.setAttribute('aria-pressed', String(show));
    rpToggle.setAttribute('aria-label', I.t(show ? 'login.hide' : 'login.show'));
    rpToggle.querySelector('i').className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
  });
  function rpMeter() {
    const s = passScore(rpPass.value), bar = $r('rpMeterBar');
    bar.style.width = (s * 25) + '%';
    bar.style.background = ['#B03A2E', '#B03A2E', '#D08A1E', '#6FA86B', '#1B4332'][s];
    $r('rpPassHint').textContent = I.t('meter.' + s) || '';
  }
  rpPass.addEventListener('input', rpMeter);

  rpForm.addEventListener('submit', e => {
    const b1 = !(rpPass.value.length >= 8 && /[A-Za-z]/.test(rpPass.value) && /\d/.test(rpPass.value));
    const b2 = !rpPass2.value || rpPass.value !== rpPass2.value;
    markF(rpPass, b1); markF(rpPass2, b2);
    if (b1 || b2) { e.preventDefault(); (b1 ? rpPass : rpPass2).focus(); return; }
    busy(rpSubmit);
    // Pré-visualização local: simula o sucesso. Com Spring o controlador faz redirect:/?senha=ok
    if (LermoConta.TEST || location.protocol === 'file:') { e.preventDefault(); setTimeout(() => { idle(rpSubmit); rpForm.reset(); rpMeter(); showPwChanged(); }, 900); }
  });
  function showPwChanged() {
    openLogin(null);
    $r('loginPwOk').classList.add('show');
    setTimeout(() => loginEmail.focus(), 120);
  }

  // Abertura automática: #recuperar-senha | #redefinir-senha ou ?token=... (link do email) | ?senha=ok
  const qsPw = new URLSearchParams(location.search);
  if (location.hash === '#recuperar-senha') openFp(null);
  if (location.hash === '#redefinir-senha' || qsPw.has('token') || qsPw.has('invalido')) {
    if (qsPw.get('token')) $r('rpToken').value = qsPw.get('token');
    if (qsPw.has('invalido') || (!qsPw.get('token') && !LermoConta.TEST && location.protocol !== 'file:')) { $r('rpInvalid').classList.add('show'); rpForm.style.display = 'none'; }
    openRp(null);
  }
  if (qsPw.get('senha') === 'ok') showPwChanged();



  // ---- Mudança de idioma: actualiza o que depende do estado ----
  I.onChange(() => {
    [[loginToggle, loginPass], [regToggle, regPass], [rpToggle, rpPass]].forEach(([b, p]) => b.setAttribute('aria-label', I.t(p.type === 'password' ? 'login.show' : 'login.hide')));
    regMeter(); rpMeter(); syncFiscal();
    const sel = ccList.querySelector('[aria-selected="true"]');
    ccList.querySelectorAll('li').forEach(li => {
      const p = PAISES.find(x => x[0] === li.dataset.code);
      li.querySelector('.lm-cc-name').textContent = I.country(p[0], p[2]);
      if (li === sel) ccBtn.title = I.country(p[0], p[2]);
    });
  });

  // ---- API para o resto da página ----
  function setNext(n) {
    [loginForm, regForm].forEach(f => {
      let i = f.querySelector('input[name="next"]');
      if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = 'next'; f.appendChild(i); }
      i.value = n || '';
    });
  }
  window.LermoAuth = { openLogin: openLogin, openReg: openReg, openFp: openFp, openRp: openRp, setNext: setNext };
})();
