'use strict';
/* Área Definições (#/definicoes[/secção]): conta, segurança, idioma e aparência, notificações, privacidade e eliminar conta.
   Secções com rota própria: #/definicoes/conta | seguranca | idioma | notificacoes | privacidade | eliminar.
   Sem dados de exemplo: tudo parte da sessão (Session) e das preferências guardadas pelo próprio utilizador.
   Depende de dashboard-candidato.js: Session, MOCK, api, wait, norm, t, esc, crumbs, fmtD, paisN, lang, Views, Actions, Modal, toast, D, $. */
(()=>{
 const SEC=[['conta','fa-user-gear'],['seguranca','fa-shield-halved'],['idioma','fa-palette'],['notificacoes','fa-bell'],['privacidade','fa-user-lock'],['eliminar','fa-user-slash']];
 const AREAS=[['candidaturas','fa-file-signature','n.cand'],['oportunidades','fa-briefcase','n.op'],['eventos','fa-calendar-days','n.ev'],['formacao','fa-graduation-cap','n.form'],['financiamento','fa-seedling','n.fin'],['empreendedorismo','fa-lightbulb','n.proj']];

 Object.assign(D.pt,{
  'df.ss.dev':'Dispositivo','df.ss.st':'Estado','df.ss.on':'Activa','df.ss.fim':'Termina em','df.c.none':'Seleccione',
  'df.s.eliminar':'Eliminar conta','df.s.eliminar.p':'Apagar a conta de forma permanente','df.c.a.h':'Dados pessoais','df.c.a.p':'O nome e o país que associamos à sua conta.','df.c.b.h':'Contactos','df.c.b.p':'O email para entrar e o telefone para o contacto.','df.p.p':'Use uma senha forte que não utilize noutros sítios.','df.ss.s':'Termine a sessão se estiver num computador partilhado.','df.v.p':'Escolha quem pode ver o seu perfil.','df.m.p':'Para quem prefere menos movimento no ecrã.',
  'df.h':'Definições','df.back':'Definições','df.err':'Não foi possível guardar. Tente novamente.','df.saved':'Preferências guardadas.',
  'df.s.conta':'Conta','df.s.conta.p':'Nome, email, telefone e país','df.s.seguranca':'Segurança','df.s.seguranca.p':'Senha e sessão',
  'df.s.idioma':'Idioma e aparência','df.s.idioma.p':'Idioma e animações','df.s.notificacoes':'Notificações','df.s.notificacoes.p':'O que recebe e onde',
  'df.s.privacidade':'Privacidade','df.s.privacidade.p':'Quem vê o seu perfil',
  'df.c.h':'Dados da conta','df.c.nome':'Nome completo','df.c.email':'Email','df.c.email.h':'É com este email que entra na plataforma.','df.c.tel':'Telefone','df.c.cc':'Indicativo do país','df.c.pais':'País de residência','df.c.sel':'Seleccione',
  'df.c.save':'Guardar alterações','df.c.saving':'A guardar…','df.c.ok':'Alterações guardadas.',
  'df.e.nome':'Indique o seu nome completo.','df.e.email':'Indique um email válido.','df.e.tel':'Indique um número de telefone válido (6 a 14 dígitos).',
  
  'df.p.h':'Alterar senha','df.p.atual':'Senha actual','df.p.nova':'Nova senha','df.p.conf':'Confirmar nova senha','df.p.show':'Mostrar senha','df.p.hide':'Esconder senha',
  'df.p.r1':'Pelo menos 8 caracteres','df.p.r2':'Letras maiúsculas e minúsculas','df.p.r3':'Pelo menos um número','df.p.f1':'Fraca','df.p.f2':'Média','df.p.f3':'Forte','df.p.f':'Força da senha: {x}',
  'df.p.go':'Alterar senha','df.p.ok':'Senha alterada.','df.e.atual':'Indique a senha actual.','df.e.nova':'A nova senha não cumpre os requisitos.','df.e.igual':'A nova senha tem de ser diferente da actual.','df.e.conf':'As senhas não coincidem.',
  'df.ss.h':'Sessão neste dispositivo','df.ss.p':'Sessão iniciada neste navegador. Termina automaticamente em {d}.',
  'df.l.h':'Idioma','df.l.p':'Escolha o idioma da plataforma. Aplica-se de imediato.','df.l.pt':'Português','df.l.en':'English',
  'df.m.h':'Animações','df.m.l':'Reduzir animações','df.m.s':'Desliga a órbita do logótipo e as transições.',
  'df.n.h':'Notificações por área','df.n.p':'Escolha, para cada área, se quer receber por email e/ou dentro da plataforma.','df.n.email':'Email','df.n.plat':'Na plataforma',
  'df.n.candidaturas':'Mudanças de estado das suas candidaturas','df.n.oportunidades':'Novas vagas que lhe podem interessar','df.n.eventos':'Eventos e lembretes de inscrição','df.n.formacao':'Turmas, presenças e certificados','df.n.financiamento':'Estado dos seus pedidos de financiamento','df.n.empreendedorismo':'Programas, mentoria e inscrições',
  'df.v.h':'Visibilidade do perfil','df.v.publico':'Público','df.v.publico.s':'Qualquer pessoa com a ligação vê o seu perfil.','df.v.empresas':'Só empresas','df.v.empresas.s':'Apenas empresas registadas na plataforma.','df.v.privado':'Privado','df.v.privado.s':'Só você. As empresas vêem apenas o que enviar numa candidatura.',
  'df.v.c.h':'Contactos visíveis','df.v.c.p':'Aplica-se a quem pode ver o seu perfil.','df.v.c.email':'Mostrar o meu email','df.v.c.tel':'Mostrar o meu telefone','df.v.c.off':'Com o perfil privado, os contactos não são mostrados.',
  
  'df.d.e.h':'Eliminar a conta','df.d.e.p':'Elimina de forma permanente a sua conta e todos os dados associados: perfil, candidaturas, inscrições e documentos. Esta acção não se pode desfazer.','df.d.e.go':'Eliminar a minha conta',
  'df.d.m.h':'Eliminar a conta?','df.d.m.p':'Para confirmar, escreva o seu email ({e}).','df.d.m.l':'Email da conta','df.d.m.go':'Eliminar definitivamente','df.d.m.no':'Cancelar'});
 Object.assign(D.en,{
  'df.ss.dev':'Device','df.ss.st':'Status','df.ss.on':'Active','df.ss.fim':'Ends on','df.c.none':'Select',
  'df.s.eliminar':'Delete account','df.s.eliminar.p':'Permanently delete your account','df.c.a.h':'Personal details','df.c.a.p':'The name and country linked to your account.','df.c.b.h':'Contacts','df.c.b.p':'The email you sign in with and a phone for contact.','df.p.p':'Use a strong password you do not use anywhere else.','df.ss.s':'End the session if you are on a shared computer.','df.v.p':'Choose who can see your profile.','df.m.p':'For those who prefer less motion on screen.',
  'df.h':'Settings','df.back':'Settings','df.err':'Could not save. Please try again.','df.saved':'Preferences saved.',
  'df.s.conta':'Account','df.s.conta.p':'Name, email, phone and country','df.s.seguranca':'Security','df.s.seguranca.p':'Password and session',
  'df.s.idioma':'Language and appearance','df.s.idioma.p':'Language and animations','df.s.notificacoes':'Notifications','df.s.notificacoes.p':'What you receive and where',
  'df.s.privacidade':'Privacy','df.s.privacidade.p':'Who sees your profile',
  'df.c.h':'Account details','df.c.nome':'Full name','df.c.email':'Email','df.c.email.h':'You use this email to sign in.','df.c.tel':'Phone','df.c.cc':'Country dialling code','df.c.pais':'Country of residence','df.c.sel':'Select',
  'df.c.save':'Save changes','df.c.saving':'Saving…','df.c.ok':'Changes saved.',
  'df.e.nome':'Enter your full name.','df.e.email':'Enter a valid email.','df.e.tel':'Enter a valid phone number (6 to 14 digits).',
  
  'df.p.h':'Change password','df.p.atual':'Current password','df.p.nova':'New password','df.p.conf':'Confirm new password','df.p.show':'Show password','df.p.hide':'Hide password',
  'df.p.r1':'At least 8 characters','df.p.r2':'Upper and lower case letters','df.p.r3':'At least one number','df.p.f1':'Weak','df.p.f2':'Fair','df.p.f3':'Strong','df.p.f':'Password strength: {x}',
  'df.p.go':'Change password','df.p.ok':'Password changed.','df.e.atual':'Enter your current password.','df.e.nova':'The new password does not meet the requirements.','df.e.igual':'The new password must be different from the current one.','df.e.conf':'The passwords do not match.',
  'df.ss.h':'Session on this device','df.ss.p':'Signed in on this browser. It ends automatically on {d}.',
  'df.l.h':'Language','df.l.p':'Choose the platform language. It applies immediately.','df.l.pt':'Português','df.l.en':'English',
  'df.m.h':'Animations','df.m.l':'Reduce animations','df.m.s':'Turns off the logo orbit and transitions.',
  'df.n.h':'Notifications by area','df.n.p':'For each area, choose whether you want to receive them by email and/or inside the platform.','df.n.email':'Email','df.n.plat':'In the platform',
  'df.n.candidaturas':'Status changes on your applications','df.n.oportunidades':'New jobs that may interest you','df.n.eventos':'Events and registration reminders','df.n.formacao':'Classes, attendance and certificates','df.n.financiamento':'Status of your funding requests','df.n.empreendedorismo':'Programmes, mentoring and registrations',
  'df.v.h':'Profile visibility','df.v.publico':'Public','df.v.publico.s':'Anyone with the link can see your profile.','df.v.empresas':'Companies only','df.v.empresas.s':'Only companies registered on the platform.','df.v.privado':'Private','df.v.privado.s':'Only you. Companies see only what you send in an application.',
  'df.v.c.h':'Visible contacts','df.v.c.p':'Applies to whoever can see your profile.','df.v.c.email':'Show my email','df.v.c.tel':'Show my phone','df.v.c.off':'With a private profile, contacts are not shown.',
  
  'df.d.e.h':'Delete account','df.d.e.p':'Permanently deletes your account and all associated data: profile, applications, registrations and documents. This cannot be undone.','df.d.e.go':'Delete my account',
  'df.d.m.h':'Delete the account?','df.d.m.p':'To confirm, type your email ({e}).','df.d.m.l':'Account email','df.d.m.go':'Delete permanently','df.d.m.no':'Cancel'});

 /* ---------- preferências locais (futuro: GET/PUT /api/conta/preferencias) ---------- */
 const KEY='lermo-def';
 const DEF0=()=>({rm:false,notif:Object.fromEntries(AREAS.map(a=>[a[0],{email:true,plat:true}])),priv:{vis:'empresas',email:false,tel:false}});
 const load=()=>{const d=DEF0();try{const s=JSON.parse(localStorage.getItem(KEY));return s?{...d,...s,notif:{...d.notif,...(s.notif||{})},priv:{...d.priv,...(s.priv||{})}}:d}catch(e){return d}};
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(MOCK.def))}catch(e){}toast(t('df.saved'))};
 MOCK.def=load();
 document.body.classList.toggle('rm',MOCK.def.rm);

 /* ---------- API (mock) ---------- */
 const hdr=u=>{$('#wn').textContent=u.nome_completo;$('#av').textContent=u.nome_completo.split(' ').map(w=>w[0]).slice(0,2).join('')};
 api.guardarConta=d=>new Promise(ok=>setTimeout(()=>{const s=Session.get();Session.start({...s,...d});hdr(Session.get());ok()},500));   /* PUT /api/conta (409 se o email já existir) */
 api.alterarSenha=(atual,nova)=>new Promise(ok=>setTimeout(ok,600));                                                               /* POST /api/conta/senha (o servidor valida a senha actual) */
 api.eliminarConta=()=>new Promise(ok=>setTimeout(ok,700));                                                                         /* DELETE /api/conta (ON DELETE CASCADE) */

 /* ---------- países e telefone ---------- */
 let pReady=null;
 const loadP=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
 const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
 const dial=c=>(window.LERMO_PAISES.find(p=>p[0]===c)||[])[1]||'';
 function splitTel(tel,pais){
  const n=String(tel||'').replace(/[\s-]/g,'');let best=null;
  window.LERMO_PAISES.forEach(p=>{if(!n.startsWith(p[1]))return;if(!best||p[1].length>best[1].length||(p[1].length===best[1].length&&p[0]===pais))best=p});
  return best?{iso:best[0],num:n.slice(best[1].length).replace(/\D/g,'')}:{iso:pais||'MZ',num:n.replace(/\D/g,'')};
 }
 /* seletor de país/indicativo com bandeira + código ISO (mesmo padrão do módulo Formação) */
 const flag=c=>`<img class="fm-flag" src="https://flagcdn.com/w40/${c.toLowerCase()}.png" srcset="https://flagcdn.com/w80/${c.toLowerCase()}.png 2x" width="24" height="18" alt="" loading="lazy">`;
 const ccBtn=(iso,k)=>(iso?`${flag(iso)}<span class="fm-iso">${iso}</span>${k==='tel'?`<span>${esc(dial(iso))}</span>`:`<span class="dfnm">${esc(paisN(iso))}</span>`}`:`<span class="dfph">${t('df.c.none')}</span>`)+'<i class="fas fa-chevron-down" aria-hidden="true"></i>';
 function picker(id,k,iso,label){
  const li=paisesOrd().map(c=>`<li role="option" tabindex="-1" data-a="df-cc-pick" data-id="${id}" data-iso="${c}" aria-selected="${c===iso}">${flag(c)}<span class="fm-iso">${c}</span><span class="n">${esc(paisN(c))}</span>${k==='tel'?`<span class="d">${esc(dial(c))}</span>`:''}</li>`).join('');
  return `<div class="fm-cc dfcc"><button type="button" class="fm-ccb" id="${id}" data-a="df-cc" data-k="${k}" data-iso="${iso||''}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}L" aria-label="${label}"${iso?` title="${esc(paisN(iso))}"`:''}>${ccBtn(iso,k)}</button><ul class="fm-ccl" id="${id}L" role="listbox" aria-label="${label}" hidden>${li}</ul></div>`;
 }
 const ccOpen=(b,on)=>{const l=$('#'+b.id+'L');if(!l)return;l.hidden=!on;b.setAttribute('aria-expanded',String(on));if(on){const x=l.querySelector('[aria-selected="true"]')||l.firstElementChild;x.scrollIntoView({block:'nearest'});x.focus()}};
 const ccCloseAll=()=>document.querySelectorAll('.dfcc .fm-ccb[aria-expanded="true"]').forEach(b=>ccOpen(b,false));

 /* ---------- erros de campo ---------- */
 function setErr(el,msg){
  const f=el.closest('.fld');if(!f)return;let e=f.querySelector('.ferr');
  if(!msg){f.classList.remove('invalid');el.removeAttribute('aria-invalid');if(e)e.remove();return}
  if(!e){e=document.createElement('div');e.className='ferr';e.id=el.id+'-e';e.setAttribute('role','alert');f.append(e)}
  e.textContent=msg;f.classList.add('invalid');el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',e.id);
 }
 const fld=(id,k,inner,hint)=>`<div class="fld"><label for="${id}">${t(k)}</label>${inner}${hint?`<div class="fh"><span>${t(hint)}</span></div>`:''}</div>`;

 /* ---------- secções ---------- */
 const head=k=>`<header class="dfhd"><h2>${t('df.s.'+k)}</h2><p>${t('df.s.'+k+'.p')}</p></header>`;
 const ch=(ic,h,p)=>`<div class="dfc-h"><span class="dfi"><i class="fas ${ic}" aria-hidden="true"></i></span><div><h3>${t(h)}</h3><p>${t(p)}</p></div></div>`;
 const EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

 async function sConta(){
  await loadP();const u=Session.get(),tl=splitTel(u.telefone,u.pais);
    return `<form id="dfConta" novalidate autocomplete="on"><div class="dfg">
   <section class="card dfc">${ch('fa-id-card','df.c.a.h','df.c.a.p')}
    ${fld('dfNome','df.c.nome',`<input id="dfNome" type="text" autocomplete="name" maxlength="150" value="${esc(u.nome_completo||'')}">`)}
    ${fld('dfPais','df.c.pais',picker('dfPais','pais',u.pais||'',t('df.c.pais')))}
    <div class="dfbar"><button class="btn btn-g dfContaGo" type="submit" disabled>${t('df.c.save')}</button></div></section>
   <section class="card dfc">${ch('fa-address-book','df.c.b.h','df.c.b.p')}
    ${fld('dfEmail','df.c.email',`<input id="dfEmail" type="email" autocomplete="email" maxlength="150" inputmode="email" value="${esc(u.email||'')}">`)}
    <div class="fld"><label for="dfTel">${t('df.c.tel')}</label><div class="dftel">${picker('dfCC','tel',tl.iso,t('df.c.cc'))}<input id="dfTel" type="tel" autocomplete="tel-national" inputmode="tel" maxlength="20" value="${esc(tl.num)}"></div></div>
    <div class="dfbar"><button class="btn btn-g dfContaGo" type="submit" disabled>${t('df.c.save')}</button></div></section></div></form>`;
 }
 const eye=id=>`<button class="dfeye" type="button" data-a="df-eye:${id}" aria-label="${t('df.p.show')}" aria-pressed="false"><i class="fas fa-eye" aria-hidden="true"></i></button>`;
 const pw=(id,k,ac)=>fld(id,k,`<div class="dfpw"><input id="${id}" type="password" autocomplete="${ac}" maxlength="128">${eye(id)}</div>`);
 function dispositivo(){
  const u=navigator.userAgent,b=/Edg\//.test(u)?'Edge':/OPR\/|Opera/.test(u)?'Opera':/Firefox\//.test(u)?'Firefox':/Chrome\//.test(u)?'Chrome':/Safari\//.test(u)?'Safari':'',
   o=/Windows/.test(u)?'Windows':/Android/.test(u)?'Android':/iPhone|iPad/.test(u)?'iOS':/Mac OS/.test(u)?'macOS':/Linux/.test(u)?'Linux':'';
  return [b,o].filter(Boolean).join(' · ')||'—';
 }
 function sSeguranca(){
  const u=Session.get(),ex=new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{dateStyle:'medium',timeStyle:'short'}).format(new Date(u&&u.exp||Date.now()));
  const ir=(k,v)=>`<div class="dfir"><span>${t(k)}</span><b>${esc(v)}</b></div>`;
  return `<div class="dfg"><form class="card dfc" id="dfSenha" novalidate>${ch('fa-key','df.p.h','df.p.p')}
   <input type="text" autocomplete="username" value="${esc(u.email||'')}" hidden>
   ${pw('dfAtual','df.p.atual','current-password')}${pw('dfNova','df.p.nova','new-password')}${pw('dfConf','df.p.conf','new-password')}
   <div class="dfm" id="dfM" aria-live="polite"><div class="dfb" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span id="dfMt"></span></div>
   <ul class="dfrl" id="dfRl"><li data-r="1"><i class="fas fa-circle" aria-hidden="true"></i>${t('df.p.r1')}</li><li data-r="2"><i class="fas fa-circle" aria-hidden="true"></i>${t('df.p.r2')}</li><li data-r="3"><i class="fas fa-circle" aria-hidden="true"></i>${t('df.p.r3')}</li></ul>
   <div class="dfbar"><button class="btn btn-g" id="dfSenhaGo" type="submit">${t('df.p.go')}</button></div></form>
   <section class="card dfc">${ch('fa-laptop','df.ss.h','df.ss.s')}
    <div class="dfinfo">${ir('df.ss.dev',dispositivo())}${ir('df.ss.st',t('df.ss.on'))}${ir('df.ss.fim',ex)}</div>
    <div class="dfbar"><button class="btn btn-l" type="button" data-a="logout"><i class="fas fa-right-from-bracket" aria-hidden="true"></i> ${t('logout')}</button></div></section></div>`;
 }
 function sIdioma(){
  const lg=['pt','en'].map(c=>`<button type="button" role="radio" aria-checked="${c===lang}" class="${c===lang?'on':''}" data-a="df-lang:${c}"><i class="fas fa-globe" aria-hidden="true"></i> ${t('df.l.'+c)}</button>`).join('');
  return `<div class="dfg"><section class="card dfc">${ch('fa-language','df.l.h','df.l.p')}<div class="dfseg" role="radiogroup" aria-label="${t('df.l.h')}">${lg}</div></section>
   <section class="card dfc">${ch('fa-wind','df.m.h','df.m.p')}<label class="sw dfr first"><span class="dft"><b>${t('df.m.l')}</b><small>${t('df.m.s')}</small></span><input id="dfRm" type="checkbox"${MOCK.def.rm?' checked':''}></label></section></div>`;
 }
 function sNotif(){
  const rows=AREAS.map(([a,ic,k],i)=>{const n=MOCK.def.notif[a];
   return `<div class="dfr dfn${i?'':' first'}"><span class="dfic"><i class="fas ${ic}" aria-hidden="true"></i></span><span class="dft"><b>${t(k)}</b><small>${t('df.n.'+a)}</small></span>
    <span class="dfsws"><label class="sw"><span>${t('df.n.email')}</span><input type="checkbox" data-n="${a}.email" aria-label="${t(k)} — ${t('df.n.email')}"${n.email?' checked':''}></label>
    <label class="sw"><span>${t('df.n.plat')}</span><input type="checkbox" data-n="${a}.plat" aria-label="${t(k)} — ${t('df.n.plat')}"${n.plat?' checked':''}></label></span></div>`}).join('');
  return `<section class="card dfc">${ch('fa-bell','df.n.h','df.n.p')}${rows}</section>`;
 }
 function sPriv(){
  const p=MOCK.def.priv,off=p.vis==='privado';
  const vis=[['publico','fa-globe'],['empresas','fa-building'],['privado','fa-lock']].map(([v,ic])=>`<label class="dfo${p.vis===v?' on':''}"><input type="radio" name="dfVis" value="${v}"${p.vis===v?' checked':''}><i class="fas ${ic}" aria-hidden="true"></i><span><b>${t('df.v.'+v)}</b><small>${t('df.v.'+v+'.s')}</small></span></label>`).join('');
  return `<div class="dfg"><section class="card dfc">${ch('fa-eye','df.v.h','df.v.p')}<div class="dfos" role="radiogroup" aria-label="${t('df.v.h')}">${vis}</div></section>
   <section class="card dfc" id="dfPriv">${ch('fa-address-card','df.v.c.h','df.v.c.p')}
    <div class="dfrs"><label class="sw dfr first"><span class="dft"><b>${t('df.v.c.email')}</b></span><input type="checkbox" data-p="email"${p.email?' checked':''}${off?' disabled':''}></label>
    <label class="sw dfr"><span class="dft"><b>${t('df.v.c.tel')}</b></span><input type="checkbox" data-p="tel"${p.tel?' checked':''}${off?' disabled':''}></label></div>
    <p class="wrap dfoff" id="dfOff"${off?'':' hidden'}>${t('df.v.c.off')}</p></section></div>`;
 }
 function sEliminar(){
  return `<section class="card dfc dfdanger">${ch('fa-triangle-exclamation','df.d.e.h','df.d.e.p')}
   <div class="dfbar"><button class="btn btn-d" type="button" data-a="df-del"><i class="fas fa-trash" aria-hidden="true"></i> ${t('df.d.e.go')}</button></div></section>`;
 }
 const BODY={conta:sConta,seguranca:sSeguranca,idioma:sIdioma,notificacoes:sNotif,privacidade:sPriv,eliminar:sEliminar};

 Views.definicoes=async id=>{
  let sec=SEC.some(s=>s[0]===id)?id:null;
  if(!sec&&matchMedia('(min-width:900px)').matches){sec='conta';history.replaceState(null,'','#/definicoes/conta')}
  const nav=SEC.map(([k,i])=>`<a href="#/definicoes/${k}"${k===sec?' aria-current="page"':''}><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><span class="rb"><span class="rt" style="display:block">${t('df.s.'+k)}</span><span class="rs" style="display:block">${t('df.s.'+k+'.p')}</span></span><i class="fas fa-chevron-right dfch" aria-hidden="true"></i></a>`).join('');
  const c=[[t('n.dash'),'#/dashboard'],sec?[t('df.h'),'#/definicoes']:[t('df.h')]];if(sec)c.push([t('df.s.'+sec)]);
  const pane=sec?`<section class="df-pane" aria-labelledby="dfT"><a class="btn btn-l btn-s df-back" href="#/definicoes"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('df.back')}</a>${head(sec).replace('<h2>','<h2 id="dfT">')}${await BODY[sec]()}</section>`:'';
  return{title:t('df.h'),html:crumbs(c)+`<div class="df${sec?' has-sec':''}"><aside class="df-nav card"><h1>${t('df.h')}</h1><nav aria-label="${t('df.h')}">${nav}</nav></aside>${pane}</div>`};
 };

 /* ---------- Conta: alterações e validação ---------- */
 const val=i=>{const e=$('#'+i);return e.dataset.k?e.dataset.iso:e.value};
 const snap=()=>['dfNome','dfEmail','dfCC','dfTel','dfPais'].map(val).join('|');
 let base='';
 function contaDirty(){const d=snap()===base;document.querySelectorAll('.dfContaGo').forEach(b=>b.disabled=d)}
 new MutationObserver(()=>{if($('#dfConta')&&!$('#dfConta').dataset.s){$('#dfConta').dataset.s='1';base=snap()}}).observe($('#main'),{childList:true,subtree:true});

 /* ---------- Segurança: força da senha ---------- */
 const rules=v=>[v.length>=8,/[a-z]/.test(v)&&/[A-Z]/.test(v),/\d/.test(v)];
 function strength(v){
  const r=rules(v),sc=r.filter(Boolean).length+(v.length>=12||/[^A-Za-z0-9]/.test(v)?1:0),m=$('#dfM');if(!m)return;
  m.dataset.l=v?(sc<=2?1:sc===3?2:3):0;$('#dfMt').textContent=v?t('df.p.f',{x:t('df.p.f'+m.dataset.l)}):'';
  m.querySelectorAll('.dfb i').forEach((e,i)=>e.classList.toggle('on',v&&i<sc));
  document.querySelectorAll('#dfRl li').forEach((li,i)=>{li.classList.toggle('ok',r[i]);li.querySelector('i').className='fas '+(r[i]?'fa-circle-check':'fa-circle')});
 }

 /* ---------- Eventos ---------- */
 document.addEventListener('input',e=>{
  const el=e.target,f=el.closest&&el.closest('#dfConta,#dfSenha,#dfDel');if(!f)return;
  if(f.id==='dfDel'){$('#dfDelGo').disabled=el.value.trim().toLowerCase()!==String(Session.get().email).toLowerCase();return}
  setErr(el,'');if(f.id==='dfConta')contaDirty();else if(el.id==='dfNova')strength(el.value);
 });
 document.addEventListener('change',e=>{
  const el=e.target;if(!el.closest)return;
  if(el.closest('#dfConta'))return contaDirty();
  const d=el.dataset||{};
  if(d.n){const [a,c]=d.n.split('.');MOCK.def.notif[a][c]=el.checked;persist()}
  else if(el.name==='dfVis'){MOCK.def.priv.vis=el.value;document.querySelectorAll('.dfo').forEach(l=>l.classList.toggle('on',l.contains(el)&&el.checked));
   const off=el.value==='privado';document.querySelectorAll('#dfPriv input').forEach(i=>i.disabled=off);$('#dfOff').hidden=!off;persist()}
  else if(d.p){MOCK.def.priv[d.p]=el.checked;persist()}
  else if(el.id==='dfRm'){MOCK.def.rm=el.checked;document.body.classList.toggle('rm',el.checked);persist()}
 });
 document.addEventListener('submit',async e=>{
  const id=e.target.id;if(!['dfConta','dfSenha','dfDel'].includes(id))return;e.preventDefault();
  if(id==='dfConta'){
   const nome=$('#dfNome'),em=$('#dfEmail'),tel=$('#dfTel'),dg=tel.value.replace(/\D/g,'');let bad=null;
   const chk=(el,ok,k)=>{setErr(el,ok?'':t(k));if(!ok&&!bad)bad=el};
   chk(nome,nome.value.trim().length>=2,'df.e.nome');chk(em,EM.test(em.value.trim()),'df.e.email');chk(tel,!dg||(dg.length>=6&&dg.length<=14),'df.e.tel');
   if(bad)return bad.focus();
   const bs=[...document.querySelectorAll('.dfContaGo')];bs.forEach(b=>{b.disabled=true;b.textContent=t('df.c.saving')});
   try{await api.guardarConta({nome_completo:nome.value.trim().replace(/\s+/g,' '),email:em.value.trim(),telefone:dg?dial($('#dfCC').dataset.iso)+dg:'',pais:$('#dfPais').dataset.iso});base=snap();toast(t('df.c.ok'))}
   catch(x){toast(t('df.err'))}
   bs.forEach(b=>b.textContent=t('df.c.save'));contaDirty();
  }else if(id==='dfSenha'){
   const a=$('#dfAtual'),n=$('#dfNova'),c=$('#dfConf');let bad=null;
   const chk=(el,ok,k)=>{setErr(el,ok?'':t(k));if(!ok&&!bad)bad=el};
   chk(a,!!a.value,'df.e.atual');chk(n,rules(n.value).every(Boolean),'df.e.nova');
   if(!bad&&n.value===a.value)chk(n,false,'df.e.igual');chk(c,c.value===n.value,'df.e.conf');
   if(bad)return bad.focus();
   const b=$('#dfSenhaGo');b.disabled=true;
   try{await api.alterarSenha(a.value,n.value);e.target.reset();strength('');toast(t('df.p.ok'))}catch(x){toast(t('df.err'))}
   b.disabled=false;
  }else{
   const b=$('#dfDelGo');b.disabled=true;
   try{await api.eliminarConta();try{localStorage.removeItem(KEY)}catch(x){}if(window.LermoLoader)LermoLoader.logout('login.html',()=>Session.end(),t('ld.out'));else{Session.end();location.replace('login.html')}}
   catch(x){b.disabled=false;toast(t('df.err'))}
  }
 });

 /* ---------- Acções ---------- */
 Actions['df-cc']=b=>{const on=b.getAttribute('aria-expanded')!=='true';ccCloseAll();ccOpen(b,on)};
 Actions['df-cc-pick']=li=>{
  const b=$('#'+li.dataset.id),iso=li.dataset.iso;b.dataset.iso=iso;b.innerHTML=ccBtn(iso,b.dataset.k);b.title=paisN(iso);
  $('#'+b.id+'L').querySelectorAll('li').forEach(x=>x.setAttribute('aria-selected',String(x===li)));ccOpen(b,false);b.focus();contaDirty();
 };
 document.addEventListener('click',e=>{if(!e.target.closest('.dfcc'))ccCloseAll()});
 document.addEventListener('keydown',e=>{
  const li=e.target.closest&&e.target.closest('.dfcc li'),bt=e.target.closest&&e.target.closest('.dfcc .fm-ccb');
  if(bt){if(e.key==='ArrowDown'){e.preventDefault();ccOpen(bt,true)}else if(e.key==='Escape'&&bt.getAttribute('aria-expanded')==='true'){e.preventDefault();ccOpen(bt,false)}return}
  if(!li)return;const b=$('#'+li.parentElement.id.slice(0,-1));
  if(e.key==='ArrowDown'){e.preventDefault();(li.nextElementSibling||li).focus()}
  else if(e.key==='ArrowUp'){e.preventDefault();(li.previousElementSibling||li).focus()}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();Actions['df-cc-pick'](li)}
  else if(e.key==='Escape'){e.preventDefault();ccOpen(b,false);b.focus()}
 },true);
 Actions['df-eye']=(b,id)=>{const i=$('#'+id),on=i.type==='password';i.type=on?'text':'password';b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',t(on?'df.p.hide':'df.p.show'));b.firstElementChild.className='fas fa-eye'+(on?'-slash':'')};
 Actions['df-lang']=(b,c)=>{if(c!==lang)document.querySelector('.lang').click()};
 Actions['df-del']=()=>{
  const em=Session.get().email;
  Modal.open({title:t('df.d.m.h'),body:`<form id="dfDel" novalidate><p class="wrap">${t('df.d.e.p')}</p><p class="wrap" style="margin-top:.8rem">${t('df.d.m.p',{e:'<strong>'+esc(em)+'</strong>'})}</p>
   <div class="fld" style="margin-top:.8rem"><label for="dfDelIn">${t('df.d.m.l')}</label><input id="dfDelIn" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="email"></div>
   <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('df.d.m.no')}</button><button class="btn btn-d" id="dfDelGo" type="submit" disabled>${t('df.d.m.go')}</button></div></form>`});
 };
})();
