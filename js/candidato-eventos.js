'use strict';
/* Área Eventos (tabela eventos: data_inicio, local, estado — únicos campos confirmados; sem inscrição até haver esquema SQL).
   Eventos de vários países: pais (como vagas.pais_id) + local (região). Pesquisa e filtros usam só estes campos. Depende de dashboard-candidato.js: MOCK/api, wait, norm, t, esc, crumbs, fmtD, L, Views, Actions, D, $. */
(()=>{
Object.assign(D.pt,{'ev.menu':'Opções','ev.mn.done':'O evento já se realizou','ev.insc':'Inscrever-me','ev.insc.h':'Quer participar neste evento?','ev.insc.ctx':'Inscreva-se para confirmar a sua participação. Pode cancelar a inscrição a qualquer momento.','ev.inscrito':'Inscrito','ev.inscrito.p':'Está inscrito neste evento.','ev.closed.p':'Este evento já se realizou. As inscrições estão encerradas.','ev.m.title':'Inscrição no evento','ev.m.ev':'Evento','ev.m.who':'Os seus dados','ev.m.send':'Confirmar inscrição','ev.m.sending':'A inscrever…','ev.m.ok':'Inscrição realizada com sucesso.','ev.m.fail':'Não foi possível concluir a inscrição. Tente novamente.','ev.m.dup':'Já está inscrito neste evento.','ev.m.closed':'As inscrições para este evento estão encerradas.','ev.m.cancel':'Cancelar','ev.cancel':'Cancelar inscrição','ev.c.title':'Cancelar inscrição','ev.c.q':'Tem a certeza de que quer cancelar a sua inscrição neste evento?','ev.c.yes':'Sim, cancelar inscrição','ev.c.no':'Manter inscrição','ev.c.ok':'Inscrição cancelada.','ev.sort':'Ordenar','ev.sort.n':'Data mais próxima','ev.sort.f':'Data mais distante','ev.only':'Só próximos','ev.more':'Mostrar mais','ev.empty':'Ainda não há eventos publicados.','ev.today':'Hoje','ev.tom':'Amanhã','ev.days':'Em {n} dias','ev.done':'Já realizado','ev.d.next':'Este evento realiza-se em {d}.','ev.d.done':'Este evento já se realizou.','ev.d.today':'Este evento realiza-se hoje.','ev.cta':'Informação do evento','ev.seeall':'Ver todos os eventos','ev.sub':'Pesquise e consulte os eventos organizados pela plataforma.','ev.search':'Pesquisar por título, país ou região','ev.search.a':'Pesquisar eventos','ev.pais':'País','ev.pais.all':'Todos','ev.pick':'Escolha um país','ev.loc':'Região','ev.loc.all':'Todas','ev.per':'Período','ev.all':'Todos','ev.upc':'Próximos','ev.past':'Anteriores','ev.st':'Estado','ev.st.all':'Todos os estados','ev.clear':'Limpar filtros','ev.toggle':'Filtros','ev.count':'{n} eventos','ev.count.1':'1 evento','ev.none':'Nenhum evento corresponde à pesquisa.','ev.view':'Ver evento','ev.back':'Voltar aos eventos','ev.f.date':'Data de início','ev.f.loc':'Local','ev.f.st':'Estado','ev.nf':'Evento não encontrado','ev.nf.p':'Este evento não existe ou já não está disponível.'});
Object.assign(D.en,{'ev.menu':'Options','ev.mn.done':'This event has already taken place','ev.insc':'Register','ev.insc.h':'Would you like to attend this event?','ev.insc.ctx':'Register to confirm your attendance. You can cancel your registration at any time.','ev.inscrito':'Registered','ev.inscrito.p':'You are registered for this event.','ev.closed.p':'This event has already taken place. Registration is closed.','ev.m.title':'Event registration','ev.m.ev':'Event','ev.m.who':'Your details','ev.m.send':'Confirm registration','ev.m.sending':'Registering…','ev.m.ok':'Registration completed successfully.','ev.m.fail':'Could not complete the registration. Please try again.','ev.m.dup':'You are already registered for this event.','ev.m.closed':'Registration for this event is closed.','ev.m.cancel':'Cancel','ev.cancel':'Cancel registration','ev.c.title':'Cancel registration','ev.c.q':'Are you sure you want to cancel your registration for this event?','ev.c.yes':'Yes, cancel registration','ev.c.no':'Keep registration','ev.c.ok':'Registration cancelled.','ev.sort':'Sort by','ev.sort.n':'Closest date','ev.sort.f':'Furthest date','ev.only':'Upcoming only','ev.more':'Show more','ev.empty':'There are no published events yet.','ev.today':'Today','ev.tom':'Tomorrow','ev.days':'In {n} days','ev.done':'Already held','ev.d.next':'This event takes place on {d}.','ev.d.done':'This event has already taken place.','ev.d.today':'This event takes place today.','ev.cta':'Event information','ev.seeall':'View all events','ev.sub':'Search and browse the events organised by the platform.','ev.search':'Search by title, country or region','ev.search.a':'Search events','ev.pais':'Country','ev.pais.all':'All','ev.pick':'Choose a country','ev.loc':'Region','ev.loc.all':'All','ev.per':'Period','ev.all':'All','ev.upc':'Upcoming','ev.past':'Past','ev.st':'Status','ev.st.all':'All statuses','ev.clear':'Clear filters','ev.toggle':'Filters','ev.count':'{n} events','ev.count.1':'1 event','ev.none':'No events match your search.','ev.view':'View event','ev.back':'Back to events','ev.f.date':'Start date','ev.f.loc':'Location','ev.f.st':'Status','ev.nf':'Event not found','ev.nf.p':'This event does not exist or is no longer available.'});

/* dados de teste (mesmos 3 campos + id/título): só para demonstrar pesquisa e filtros; em produção vêm de GET /api/eventos */
[['e2','Workshop de Currículo e Entrevistas','CV and Interview Workshop','MZ','Sofala','2026-10-29'],
 ['e3','Feira de Emprego de Luanda','Luanda Jobs Fair','AO','Luanda','2026-11-12'],
 ['e4','Encontro de Talento Lusófono','Lusophone Talent Meetup','PT','Lisboa','2026-11-20'],
 ['e5','Semana de Estágios Remotos','Remote Internships Week','BR','São Paulo','2026-11-25'],
 ['e6','Conferência de Carreiras Tech','Tech Careers Conference','ZA','Western Cape','2026-12-03']]
 .forEach(([id,t,en,pais,local,inicio])=>{if(!MOCK.eventos.some(e=>e.id===id))MOCK.eventos.push({id,t,en,pais,local,inicio,estado:'agendado'})});

MOCK.evInsc=MOCK.evInsc||[];                               /* inscrições do candidato em eventos (mock) */
const comInsc=e=>({...e,inscrito:MOCK.evInsc.some(i=>i.evento_id===e.id)});
api.eventos=()=>wait(MOCK.eventos.map(comInsc),200);                                   /* GET /api/eventos */
api.evento=id=>wait((e=>e?comInsc(e):null)(MOCK.eventos.find(e=>e.id===id)),200);      /* GET /api/eventos/{id} */
api.inscreverEvento=id=>new Promise((ok,no)=>setTimeout(()=>{                         /* POST /api/eventos/{id}/inscricao */
 const e=MOCK.eventos.find(x=>x.id===id);
 if(!e)return no(new Error('nf'));if(passou(e))return no(new Error('closed'));
 if(MOCK.evInsc.some(i=>i.evento_id===id))return no(new Error('dup'));
 MOCK.evInsc.push({evento_id:id,criado_em:new Date().toISOString().slice(0,10)});ok()},500));
api.cancelarInscricaoEvento=id=>new Promise(ok=>setTimeout(()=>{                      /* DELETE /api/eventos/{id}/inscricao */
 MOCK.evInsc=MOCK.evInsc.filter(i=>i.evento_id!==id);ok()},400));

const EPAGE=4;                                            /* mesma paginação das Oportunidades */
const EV={det:null,q:'',pais:'',loc:'',st:'',prox:true,sort:'n',n:EPAGE,list:[],tm:0};
const locE=e=>locL({prov:e.local,pais:e.pais});            /* região, país (mesmo padrão das vagas) */
const stL=e=>{const k='est.'+e;return D.pt[k]!==undefined?t(k):e};
const fim=e=>new Date(e.inicio+'T23:59:59');
const passou=e=>fim(e)<new Date();
function quando(e){const ms=fim(e)-new Date();if(ms<0)return[t('ev.done'),'no'];const d=Math.ceil(ms/864e5);
 if(d<=1)return[t('ev.today'),'warn'];if(d<=2)return[t('ev.tom'),'warn'];if(d<=8)return[t('ev.days',{n:d-1}),'warn'];return[fmtD(e.inicio),'']}

/* ---------- lista ---------- */
function filtrar(){
 const q=norm(EV.q.trim());
 const r=EV.list.filter(e=>(!EV.pais||e.pais===EV.pais)&&(!EV.loc||e.local===EV.loc)&&(!EV.st||e.estado===EV.st)&&(!EV.prox||!passou(e))
  &&(!q||norm([L(e,'t'),locE(e),e.local,stL(e.estado)].join(' ')).includes(q)));
 return r.sort(EV.sort==='f'?(a,b)=>b.inicio.localeCompare(a.inicio):(a,b)=>a.inicio.localeCompare(b.inicio));
}
const evById=id=>EV.det&&EV.det.id===id?EV.det:EV.list.find(x=>x.id===id)||null;
const noDet=()=>!/#\/eventos\/./.test(location.hash);
function menuHtml(e){
 const f=passou(e),off=f?{off:1,sub:'ev.mn.done'}:{};
 return LRM_FX.menu('ev',e.id,t('ev.menu')+': '+L(e,'t'),[
  ['ev-ver','fa-eye','ev.view'],
  e.inscrito?['ev-cancel','fa-rotate-left','ev.cancel',{d:1,...off}]:['ev-insc','fa-user-plus','ev.insc',off]]);
}
Actions['ev-menu']=(b,id)=>Actions['fi-menu'](b,id);
Actions['ev-ver']=(b,id)=>{LRM_FX.close();location.hash='#/eventos/'+id};
function card(e){
 const w=quando(e);
 return `<article class="vc"><div class="vh"><span class="ic"><i class="fas fa-calendar-days" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/eventos/${esc(e.id)}">${esc(L(e,'t'))}</a></h2><div class="rs">${esc(locE(e))}</div></div>${menuHtml(e)}</div>
 <div class="chips"><span class="tag in">${esc(stL(e.estado))}</span>${e.inscrito?`<span class="tag ok">${t('ev.inscrito')}</span>`:''}</div>
 <ul class="meta"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(locE(e))}</li><li class="${w[1]}"><i class="fas fa-clock" aria-hidden="true"></i>${esc(w[0])}</li>${w[0]!==fmtD(e.inicio)?`<li><i class="fas fa-calendar-check" aria-hidden="true"></i>${fmtD(e.inicio)}</li>`:''}</ul>
 <a class="btn btn-l" href="#/eventos/${esc(e.id)}">${t('ev.view')}</a></article>`;
}
const nFiltros=()=>(EV.pais?1:0)+(EV.loc?1:0)+(EV.st?1:0)+(EV.prox?0:1)+(EV.sort!=='n'?1:0);
function updFiltros(){
 const n=nFiltros(),tg=$('#evTog'),cl=$('#evClr');if(!tg)return;
 tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!EV.q;
}
const opts=(arr,sel,lbl)=>arr.map(x=>`<option value="${esc(x)}"${x===sel?' selected':''}>${esc(lbl(x))}</option>`).join('');
/* lista completa de países e regiões (js/paises.js: 249 países + LERMO_REGIOES), carregada só quando se abre Eventos */
let pReady=null;
const loadPaises=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
const regs=p=>(window.LERMO_REGIOES&&window.LERMO_REGIOES[p]||'').split('|').filter(Boolean);
function fillReg(){
 const s=$('#evLoc');if(!s)return;
 s.disabled=!EV.pais;
 s.innerHTML=`<option value="">${t(EV.pais?'ev.loc.all':'ev.pick')}</option>`+(EV.pais?opts(regs(EV.pais),EV.loc,provL):'');
}
function renderRes(){
 const box=$('#evRes');if(!box)return;
 const r=filtrar(),c=$('#evCount');
 c.textContent=t(r.length===1?'ev.count.1':'ev.count',{n:r.length});
 if(!EV.list.length){box.innerHTML=`<div class="state card"><i class="fas fa-calendar-days" aria-hidden="true"></i>${t('ev.empty')}</div>`;c.textContent='';return}
 if(!r.length){box.innerHTML=`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('ev.none')}</p><br><button class="btn btn-l" type="button" data-a="ev-clear">${t('ev.clear')}</button></div>`;return}
 const show=r.slice(0,EV.n);
 box.innerHTML=`<div class="vgrid">${show.map(card).join('')}</div>`+(r.length>show.length?`<div class="more"><button class="btn btn-l" type="button" data-a="ev-more">${t('ev.more')} (${r.length-show.length})</button></div>`:'');
}
async function lista(){
 await loadPaises();EV.list=await api.eventos();
 const sts=[...new Set(EV.list.map(e=>e.estado))].sort();
 return{title:t('n.ev'),after:()=>{fillReg();renderRes();updFiltros()},html:
  crumbs([[t('n.dash'),'#/dashboard'],[t('n.ev')]])+
  `<div class="ph"><div><h1>${t('n.ev')}</h1><p class="rs wrap">${t('ev.sub')}</p></div><p class="rs" id="evCount" aria-live="polite"></p></div>
  <form class="flt${nFiltros()?' open':''}" id="evF" role="search" aria-label="${t('n.ev')}">
   <div class="fld fq"><label class="sr" for="evQ">${t('ev.search.a')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="evQ" type="search" value="${esc(EV.q)}" placeholder="${t('ev.search')}" autocomplete="off" maxlength="80"></div></div>
   <button class="btn btn-l" id="evTog" type="button" data-a="ev-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="evSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('ev.toggle')} <b class="bd" hidden></b></button>
   <div class="fsec" id="evSec">
    <div class="fld"><label for="evPais">${t('ev.pais')}</label><select id="evPais" data-f="pais"><option value="">${t('ev.pais.all')}</option>${opts(paisesOrd(),EV.pais,paisN)}</select></div>
    <div class="fld"><label for="evLoc">${t('ev.loc')}</label><select id="evLoc" data-f="loc"></select></div>
    ${sts.length>1?`<div class="fld"><label for="evSt">${t('ev.st')}</label><select id="evSt" data-f="st"><option value="">${t('ev.st.all')}</option>${opts(sts,EV.st,stL)}</select></div>`:''}
    <div class="fld"><label for="evSort">${t('ev.sort')}</label><select id="evSort" data-f="sort"><option value="n"${EV.sort==='n'?' selected':''}>${t('ev.sort.n')}</option><option value="f"${EV.sort==='f'?' selected':''}>${t('ev.sort.f')}</option></select></div>
    <label class="chk"><input type="checkbox" id="evProx" data-f="prox"${EV.prox?' checked':''}> ${t('ev.only')}</label>
    <button class="btn btn-l" id="evClr" type="button" data-a="ev-clear">${t('ev.clear')}</button>
   </div>
  </form>
  <div id="evRes" aria-live="polite"></div>`};
}

/* ---------- detalhe ---------- */
function detalheHtml(e){
 const w=quando(e),feito=passou(e);
 const fact=(i,k,v)=>v?`<div><dt><i class="fas ${i}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(v)}</dd></div>`:'';
 const msg=feito?t('ev.d.done'):w[0]===t('ev.today')?t('ev.d.today'):t('ev.d.next',{d:fmtD(e.inicio)});
 const cta=e.inscrito
  ?`<span class="tag ok">${t('ev.inscrito')}</span><p class="rs wrap">${t('ev.inscrito.p')} ${esc(msg)}</p>${feito?'':`<button class="btn btn-l" type="button" data-a="ev-cancel:${esc(e.id)}">${t('ev.cancel')}</button>`}`
  :!feito?`<div class="apx"><strong>${t('ev.insc.h')}</strong><p>${esc(msg)} ${t('ev.insc.ctx')}</p></div><button class="btn btn-g" type="button" data-a="ev-insc:${esc(e.id)}"><i class="fas fa-user-plus" aria-hidden="true"></i> ${t('ev.insc')}</button>`
  :`<p class="rs wrap">${t('ev.closed.p')}</p><button class="btn btn-g" type="button" disabled>${t('ev.insc')}</button>`;
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.ev'),'#/eventos'],[L(e,'t')]])+
 `<div class="vtop"><a class="btn btn-l" href="#/eventos"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('ev.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det"><article class="card"><header><h1>${esc(L(e,'t'))}</h1><p class="rs wrap">${esc(locE(e))}</p>
  <div class="chips"><span class="tag in">${esc(stL(e.estado))}</span><span class="tag ${w[1]==='no'?'no':''}">${esc(w[0])}</span>${e.inscrito?`<span class="tag ok">${t('ev.inscrito')}</span>`:''}</div></header>
  <dl class="facts">${fact('fa-location-dot','ev.f.loc',locE(e))}${fact('fa-calendar-check','ev.f.date',fmtD(e.inicio))}${fact('fa-circle-info','ev.f.st',stL(e.estado))}</dl></article>
 <aside class="card cta" aria-label="${t('ev.cta')}">${cta}<a class="btn btn-l" href="#/eventos">${t('ev.seeall')}</a></aside></div>`;
}
async function detalhe(id){
 const e=await api.evento(id);EV.det=e;
 if(!e)return{title:t('n.ev'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.ev'),'#/eventos'],[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('ev.nf')}</h1><p>${t('ev.nf.p')}</p><br><a class="btn btn-g" href="#/eventos"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('ev.back')}</a></div>`};
 return{title:L(e,'t'),html:detalheHtml(e)};
}
Views.eventos=id=>id?detalhe(id):lista();

/* ---------- filtros ---------- */
document.addEventListener('submit',e=>{if(e.target.id==='evF')e.preventDefault()});
document.addEventListener('input',e=>{
 if(e.target.id==='evQ'){EV.q=e.target.value;clearTimeout(EV.tm);EV.tm=setTimeout(()=>{EV.n=EPAGE;renderRes();updFiltros()},120)}
});
document.addEventListener('change',e=>{
 const el=e.target,k=el.dataset&&el.dataset.f;if(!k||!el.closest('#evF'))return;
 EV[k]=el.type==='checkbox'?el.checked:el.value;if(k==='pais'){EV.loc='';fillReg()}EV.n=EPAGE;renderRes();updFiltros();
});
Actions['ev-more']=()=>{EV.n+=EPAGE;renderRes()};
Actions['ev-clear']=()=>{Object.assign(EV,{q:'',pais:'',loc:'',st:'',prox:true,sort:'n',n:EPAGE});
 const f=$('#evF');if(f){f.reset();$('#evQ').value='';$('#evPais').value='';const s=$('#evSt');if(s)s.value='';$('#evSort').value='n';$('#evProx').checked=true;fillReg()}renderRes();updFiltros();if(f)$('#evQ').focus()};
Actions['ev-tog']=b=>{const on=!$('#evF').classList.contains('open');$('#evF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};

/* ---------- inscrição ---------- */
Actions['ev-insc']=(b,id)=>{
 LRM_FX.close();const e=evById(id);if(!e||passou(e)||e.inscrito)return;EV.cur=id;
 const u=Session.get()||{};
 Modal.open({title:t('ev.m.title'),body:`<form id="evI" novalidate>
  <p class="rs wrap" style="margin-bottom:1rem"><strong>${t('ev.m.ev')}:</strong> ${esc(L(e,'t'))} · ${esc(locE(e))} · ${fmtD(e.inicio)}</p>
  <div class="prf"><h3>${t('ev.m.who')}</h3><p>${esc(u.nome_completo||'')}${u.email?' · '+esc(u.email):''}</p></div>
  <p class="ferr box" id="evFail" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ev.m.cancel')}</button><button class="btn btn-g" id="evGo" type="submit"><i class="fas fa-check" aria-hidden="true"></i> ${t('ev.m.send')}</button></div></form>`});
};
Actions['ev-cancel']=(b,id)=>{
 LRM_FX.close();const e=evById(id);if(!e||passou(e))return;EV.cur=id;
 Modal.open({title:t('ev.c.title'),body:`<form id="evC" novalidate><p class="wrap" style="margin-bottom:1rem">${t('ev.c.q')}</p>
  <p class="rs wrap"><strong>${esc(L(e,'t'))}</strong> · ${fmtD(e.inicio)}</p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ev.c.no')}</button><button class="btn btn-g" id="evCGo" type="submit">${t('ev.c.yes')}</button></div></form>`});
};
async function voltar(id){if(noDet()){EV.list=await api.eventos();renderRes();return}await reabrir(id)}
async function reabrir(id){const o=await detalhe(id),m=$('#main');m.innerHTML=o.html;m.focus({preventScroll:true})}
document.addEventListener('submit',async e=>{
 const f=e.target;if(f.id!=='evI'&&f.id!=='evC')return;
 e.preventDefault();const id=EV.cur;
 if(f.id==='evI'){
  const btn=$('#evGo'),fail=$('#evFail');fail.hidden=true;btn.disabled=true;
  btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t('ev.m.sending')}`;
  try{await api.inscreverEvento(id);Modal.close();toast(t('ev.m.ok'));await voltar(id)}
  catch(x){fail.textContent=t(x.message==='dup'?'ev.m.dup':x.message==='closed'?'ev.m.closed':'ev.m.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=`<i class="fas fa-check" aria-hidden="true"></i> ${t('ev.m.send')}`}
 }else{
  $('#evCGo').disabled=true;await api.cancelarInscricaoEvento(id);Modal.close();toast(t('ev.c.ok'));await voltar(id)
 }
});
})();
