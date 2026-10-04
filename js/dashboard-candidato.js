'use strict';
/* ===== 1. Sessão simulada (substituir por JWT/cookie do Spring Security) ===== */
const Session={
 KEY:'lermo-session',
 get(){try{const s=JSON.parse(localStorage.getItem(this.KEY));return s&&s.exp>Date.now()?s:null}catch(e){return null}},
 start(u){localStorage.setItem(this.KEY,JSON.stringify({...u,exp:Date.now()+864e5}))},
 end(){localStorage.removeItem(this.KEY)}
};
/* utilizador demo: campos de utilizadores (tipo='candidato') */
const DEMO={utilizador_id:'u-demo',nome_completo:'Ana Macuácua',email:'ana@exemplo.mz',tipo:'candidato'};
if(new URLSearchParams(location.search).get('demo')==='1'&&!Session.get())Session.start(DEMO);
if(!Session.get()){location.replace('login.html')}  /* sem sessão: único caso em que se volta ao login */

/* ===== 2. Camada de dados (mock). Cada método -> futuro GET /api/... ===== */
const MOCK={
 perfil:{resumo_pessoal:'Estudante de Informática.',foto_url:null,data_nascimento:'2001-05-14',provincia_id:11,experiencias:1,formacoes:1,competencias:4,idiomas:2},
 /* estados_candidatura: candidatou_se | em_analise | entrevista | contratado | rejeitado */
 candidaturas:[
  {id:'c1',vaga_id:'v5',t:'Estagiário(a) de Engenharia Informática',en:'Computer Engineering Intern',emp:'Tecnologias Índico',estado:'em_analise',match:82,criado_em:'2026-09-28'},
  {id:'c2',vaga_id:'v1',t:'Estagiário(a) de Contabilidade',en:'Accounting Intern',emp:'Kilimanjaro Auditores',estado:'candidatou_se',match:64,criado_em:'2026-10-02'}],
 /* historico_estados_candidatura */
 historico:[{cand:'c1',estado:'em_analise',em:'2026-10-01'},{cand:'c2',estado:'candidatou_se',em:'2026-10-02'},{cand:'c1',estado:'candidatou_se',em:'2026-09-28'}],
 oportunidades:{abertas:14,sugeridas:[ /* subconjunto de js/dados.js */
  {id:'v3',t:'Programa Trainee — Gestão Comercial',en:'Trainee Programme — Commercial Management',emp:'Vodacom Moçambique',prov:'Maputo-Cidade',tipo:'trainee',lim:'2026-11-05'},
  {id:'v4',t:'Designer Gráfico (projecto)',en:'Graphic Designer (project)',emp:'Estúdio Maré',prov:'Nampula',tipo:'freelance',lim:'2026-10-10'},
  {id:'v2',t:'Técnico(a) de Recursos Humanos',en:'Human Resources Technician',emp:'Cornelder de Moçambique',prov:'Sofala',tipo:'emprego_efectivo',lim:'2026-10-15'}]},
 financiamento:{linha:'Linha de Financiamento Jovem Empreendedor',estado:'submetido',valor_solicitado:150000,moeda:'MZN',data_submissao:'2026-10-03'},
 /* inscricoes_projetos + mentorias_projetos */
 projetos:[{id:'p1',titulo:'Jovens Empreendedores 2026',estado:'inscrito',mentoria:'Plano de negócio'}],
 /* eventos (data_inicio, local, estado) */
 eventos:[{id:'e1',t:'Feira de Emprego e Estágios 2026',en:'Jobs and Internships Fair 2026',local:'Maputo-Cidade',inicio:'2026-10-22',estado:'agendado'}],
 /* inscricoes_formacao + turmas_formacao + programas_formacao */
 formacao:{abertas:3,certificados:[],inscricoes:[{id:'i1',t:'Competências Digitais para Jovens',en:'Digital Skills for Young People',local:'Zambézia',estado:'inscrito',presenca:60,inicio:'2026-10-18'}]}
};
const wait=(v,ms=350)=>new Promise(r=>setTimeout(()=>r(structuredClone(v)),ms));
const api={
 me:()=>wait(Session.get(),0),                       /* GET /api/me */
 resumo:()=>wait({                                    /* GET /api/candidato/resumo */
  perfil:MOCK.perfil,candidaturas:MOCK.candidaturas,historico:MOCK.historico,
  oportunidades:MOCK.oportunidades,financiamento:MOCK.financiamento,projetos:MOCK.projetos,eventos:MOCK.eventos,formacao:MOCK.formacao})
};

/* ===== 3. i18n PT/EN (chave partilhada com o resto do site) ===== */
const D={pt:{
 'logout':'Terminar sessão','n.dash':'Dashboard','n.op':'Oportunidades','n.cand':'Candidaturas','n.fin':'Financiamento','n.form':'Formação','n.ev':'Eventos','n.perfil':'Perfil','n.proj':'Empreendedorismo','n.def':'Definições',
 'g.menu':'Menu','g.conta':'Conta','hi':'Olá, {n}','hi.p':'Aqui tem um resumo da sua actividade. Escolha uma área no menu para ver os detalhes.','hi.cta':'Ver oportunidades',
 'st.cand':'Candidaturas','st.op':'Oportunidades abertas','st.fin':'Solicitações de financiamento','st.form':'Formações em curso','c.form':'Formação','c.ev':'Próximos eventos','c.proj':'Empreendedorismo','cert':'{n} certificado(s) emitido(s)','mento':'Mentoria: {a}','est.agendado':'Agendado','empty.ev':'Sem eventos agendados.','empty.proj':'Ainda não está inscrito em nenhum programa de empreendedorismo.','empty.form':'Ainda não está inscrito em nenhuma formação.','pres':'Presença {v}%','inicio':'Início {d}',
 'c.cand':'Candidaturas recentes','c.op':'Oportunidades para si','c.perfil':'Perfil','c.fin':'Financiamento','all':'Ver todas','open':'Abrir',
 'perf.p':'Perfil {v}% completo','perf.h':'Faltam: {x}','perf.ok':'Perfil completo.','perf.go':'Completar perfil',
 'f.resumo':'resumo pessoal','f.foto':'fotografia','f.nasc':'data de nascimento','f.prov':'província','f.exp':'experiência','f.form':'formação','f.comp':'competências','f.id':'idiomas',
 'est.candidatou_se':'Candidatou-se','est.em_analise':'Em análise','est.entrevista':'Entrevista','est.contratado':'Contratado','est.rejeitado':'Rejeitado','est.submetido':'Submetido','est.inscrito':'Inscrito',
 'tipo.estagio':'Estágio','tipo.emprego_efectivo':'Emprego efectivo','tipo.trainee':'Trainee','tipo.freelance':'Freelance',
 'lim':'Até {d}','match':'Compatibilidade {v}%','sub':'Submetido em {d}','act.t':'{x}: {e}',
 'empty.cand':'Ainda não se candidatou a nenhuma oportunidade.','empty.fin':'Ainda não tem solicitações de financiamento.',
 'err':'Não foi possível carregar os dados.','retry':'Tentar novamente',
 'stub.h':'Em desenvolvimento','stub.p':'Esta área tem interface própria e será construída na próxima fase. Continua dentro da sua sessão.','stub.back':'Voltar ao Dashboard',
 'top':'Voltar ao topo','menuOpen':'Abrir menu','menuClose':'Fechar menu','rail':'Recolher ou expandir menu','userAria':'Conta do utilizador','langAria':'Alternar idioma'},
en:{
 'logout':'Log out','n.dash':'Dashboard','n.op':'Opportunities','n.cand':'Applications','n.fin':'Funding','n.form':'Training','n.ev':'Events','n.perfil':'Profile','n.proj':'Entrepreneurship','n.def':'Settings',
 'g.menu':'Menu','g.conta':'Account','hi':'Hello, {n}','hi.p':'Here is a summary of your activity. Pick an area in the menu to see the details.','hi.cta':'Browse opportunities',
 'st.cand':'Applications','st.op':'Open opportunities','st.fin':'Funding requests','st.form':'Training in progress','c.form':'Training','c.ev':'Upcoming events','c.proj':'Entrepreneurship','cert':'{n} certificate(s) issued','mento':'Mentoring: {a}','est.agendado':'Scheduled','empty.ev':'No scheduled events.','empty.proj':'You have not joined any entrepreneurship programme yet.','empty.form':'You are not enrolled in any training yet.','pres':'Attendance {v}%','inicio':'Starts {d}',
 'c.cand':'Recent applications','c.op':'Opportunities for you','c.perfil':'Profile','c.fin':'Funding','all':'View all','open':'Open',
 'perf.p':'Profile {v}% complete','perf.h':'Missing: {x}','perf.ok':'Profile complete.','perf.go':'Complete profile',
 'f.resumo':'personal summary','f.foto':'photo','f.nasc':'date of birth','f.prov':'province','f.exp':'experience','f.form':'education','f.comp':'skills','f.id':'languages',
 'est.candidatou_se':'Applied','est.em_analise':'Under review','est.entrevista':'Interview','est.contratado':'Hired','est.rejeitado':'Rejected','est.submetido':'Submitted','est.inscrito':'Registered',
 'tipo.estagio':'Internship','tipo.emprego_efectivo':'Full-time job','tipo.trainee':'Trainee','tipo.freelance':'Freelance',
 'lim':'Until {d}','match':'Match {v}%','sub':'Submitted on {d}','act.t':'{x}: {e}',
 'empty.cand':'You have not applied to any opportunity yet.','empty.fin':'You have no funding requests yet.',
 'err':'Could not load the data.','retry':'Try again',
 'stub.h':'Under development','stub.p':'This area has its own interface and will be built in the next phase. You stay signed in.','stub.back':'Back to Dashboard',
 'top':'Back to top','menuOpen':'Open menu','menuClose':'Close menu','rail':'Collapse or expand menu','userAria':'User account','langAria':'Switch language'}};
let lang='pt';try{lang=localStorage.getItem('lermo-lang')==='en'?'en':'pt'}catch(e){}
const t=(k,v)=>{let s=(D[lang][k]??D.pt[k]??k);if(v)for(const x in v)s=s.replace('{'+x+'}',v[x]);return s};
const fmtD=d=>new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d));
const fmtM=(v,c)=>new Intl.NumberFormat(lang==='en'?'en-GB':'pt-PT',{style:'currency',currency:c,maximumFractionDigits:0}).format(v);
const L=(o,f)=>lang==='en'&&o.en?o.en:o[f];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ===== 4. Mapa de navegação (apenas módulos suportados pelo SQL) ===== */
const NAV=[
 {id:'dashboard',i:'fa-gauge-high',k:'n.dash',g:'g.menu'},
 {id:'oportunidades',i:'fa-briefcase',k:'n.op'},   /* vagas, tipos_vaga */
 {id:'candidaturas',i:'fa-file-signature',k:'n.cand'}, /* candidaturas */
 {id:'formacao',i:'fa-graduation-cap',k:'n.form'}, /* programas/turmas/inscricoes/certificados_formacao */
 {id:'eventos',i:'fa-calendar-days',k:'n.ev'},  /* eventos */
 {id:'financiamento',i:'fa-seedling',k:'n.fin'},  /* linhas/solicitacoes_financiamento */
 {id:'empreendedorismo',i:'fa-lightbulb',k:'n.proj'},    /* projetos_empreendedorismo */
 {id:'perfil',i:'fa-user',k:'n.perfil',g:'g.conta'}, /* perfis_candidatos + experiência/formação/competências/idiomas */
 {id:'definicoes',i:'fa-gear',k:'n.def'}
];
const $=s=>document.querySelector(s);
function renderNav(cur){
 let h='';NAV.forEach(n=>{if(n.g)h+=`<h2>${t(n.g)}</h2>`;
  h+=`<a href="#/${n.id}"${n.id===cur?' aria-current="page"':''}><i class="fas ${n.i}" aria-hidden="true"></i><span>${t(n.k)}</span></a>`});
 $('#nav').innerHTML=h;
}
function crumbs(items){
 return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((c,i)=>i===items.length-1?`<li><span aria-current="page">${esc(c[0])}</span></li>`:`<li><a href="${c[1]}">${esc(c[0])}</a></li>`).join('')}</ol></nav>`;
}

/* ===== 5. Router por hash: #/area[/id]. Nunca passa pelo login ===== */
let cache=null,seq=0;
function parse(){const p=location.hash.replace(/^#\/?/,'').split('/');return{area:NAV.some(n=>n.id===p[0])?p[0]:'dashboard',id:p[1]||null}}
async function route(){
 const {area,id}=parse(),my=++seq;closeAll();renderNav(area);
 const m=$('#main'),nv=NAV.find(n=>n.id===area);
 document.title=t(nv.k)+' — LERMO Recursos';
 if(area!=='dashboard'){m.innerHTML=stub(nv,id);m.focus({preventScroll:true});scrollTo(0,0);return}
 m.innerHTML=`<div class="skg"><div class="sk" style="height:130px"></div><div class="sk"></div><div class="sk" style="height:220px"></div></div>`;
 try{cache=cache||await api.resumo();if(my!==seq)return;m.innerHTML=dash(cache)}
 catch(e){m.innerHTML=`<div class="state card"><i class="fas fa-triangle-exclamation"></i><p>${t('err')}</p><br><button class="btn btn-l" data-a="retry">${t('retry')}</button></div>`}
 m.focus({preventScroll:true});scrollTo(0,0);
}
function stub(nv,id){
 const c=[[t('n.dash'),'#/dashboard'],[t(nv.k),`#/${nv.id}`]];if(id)c.push([id]);
 return crumbs(c)+
 `<div class="stub card"><div class="ic"><i class="fas ${nv.i}" aria-hidden="true"></i></div><h1>${t(nv.k)} — ${t('stub.h')}</h1><p>${t('stub.p')}</p><a class="btn btn-g" href="#/dashboard"><i class="fas fa-arrow-left"></i> ${t('stub.back')}</a></div>`;
}

/* ===== 6. Dashboard: apenas resumos e pontos de entrada ===== */
function completude(p){
 const f=[['resumo',!!p.resumo_pessoal],['foto',!!p.foto_url],['nasc',!!p.data_nascimento],['prov',!!p.provincia_id],['exp',p.experiencias>0],['form',p.formacoes>0],['comp',p.competencias>0],['id',p.idiomas>0]];
 return{v:Math.round(f.filter(x=>x[1]).length/f.length*100),falta:f.filter(x=>!x[1]).map(x=>t('f.'+x[0]))};
}
const est=e=>({em_analise:'in',entrevista:'',contratado:'ok',rejeitado:'no'}[e]??'');
function dash(d){
 const u=Session.get(),pc=completude(d.perfil),fin=d.financiamento;
 const stat=(i,n,k,h)=>`<a class="stat" href="${h}"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><span><b>${n}</b><span>${t(k)}</span></span></a>`;
 const cands=d.candidaturas.length?d.candidaturas.map(c=>`<a class="row" href="#/candidaturas/${c.id}"><div class="rb"><div class="rt">${esc(L(c,'t'))}</div><div class="rs">${esc(c.emp)} · ${t('match',{v:c.match})}</div></div><span class="tag ${est(c.estado)}">${t('est.'+c.estado)}</span></a>`).join(''):`<div class="state"><i class="fas fa-folder-open"></i>${t('empty.cand')}</div>`;
 const ops=d.oportunidades.sugeridas.map(o=>`<a class="row" href="#/oportunidades/${o.id}"><span class="ic"><i class="fas fa-briefcase" aria-hidden="true"></i></span><div class="rb"><div class="rt">${esc(L(o,'t'))}</div><div class="rs">${esc(o.emp)} · ${esc(o.prov)}</div></div><span class="tag in">${t('tipo.'+o.tipo)}</span></a>`).join('');
 const frm=d.formacao.inscricoes.length?d.formacao.inscricoes.map(i=>`<a class="row" href="#/formacao/${i.id}"><div class="rb"><div class="rt">${esc(L(i,'t'))}</div><div class="rs">${esc(i.local)} · ${t('inicio',{d:fmtD(i.inicio)})} · ${t('pres',{v:i.presenca})}</div></div><span class="tag in">${t('est.'+i.estado)}</span></a>`).join(''):`<div class="state"><i class="fas fa-graduation-cap"></i>${t('empty.form')}</div>`;
 const evs=d.eventos.length?d.eventos.map(e=>`<a class="row" href="#/eventos/${e.id}"><span class="ic"><i class="fas fa-calendar-days" aria-hidden="true"></i></span><div class="rb"><div class="rt">${esc(L(e,'t'))}</div><div class="rs">${esc(e.local)} · ${fmtD(e.inicio)}</div></div><span class="tag in">${t('est.'+e.estado)}</span></a>`).join(''):`<div class="state">${t('empty.ev')}</div>`;
 const prj=d.projetos.length?d.projetos.map(p=>`<a class="row" href="#/empreendedorismo/${p.id}"><div class="rb"><div class="rt">${esc(p.titulo)}</div><div class="rs">${p.mentoria?t('mento',{a:esc(p.mentoria)}):''}</div></div><span class="tag in">${t('est.'+p.estado)}</span></a>`).join(''):`<div class="state">${t('empty.proj')}</div>`;
 const finH=fin?`<div class="money">${fmtM(fin.valor_solicitado,fin.moeda)}</div><p class="rs" style="white-space:normal;margin:.2rem 0 .6rem">${esc(fin.linha)}</p><span class="tag">${t('est.'+fin.estado)}</span> <span class="rs">${t('sub',{d:fmtD(fin.data_submissao)})}</span>`:`<div class="state">${t('empty.fin')}</div>`;
 return `<h1 class="sr">${t('n.dash')}</h1>`+crumbs([[t('n.dash')]])+
 `<section class="hello"><div><h1>${t('hi',{n:'<em>'+esc(u.nome_completo.split(' ')[0])+'</em>'})}</h1><p>${t('hi.p')}</p></div><a class="btn btn-g" href="#/oportunidades"><i class="fas fa-magnifying-glass"></i> ${t('hi.cta')}</a></section>
 <section class="stats" aria-label="${t('n.dash')}">${stat('fa-file-signature',d.candidaturas.length,'st.cand','#/candidaturas')}${stat('fa-briefcase',d.oportunidades.abertas,'st.op','#/oportunidades')}${stat('fa-seedling',fin?1:0,'st.fin','#/financiamento')}${stat('fa-graduation-cap',d.formacao.inscricoes.length,'st.form','#/formacao')}</section>
 <div class="g2">
  <section class="card"><div class="ch"><h2>${t('c.cand')}</h2><a href="#/candidaturas">${t('all')}</a></div>${cands}</section>
  <section class="card"><div class="ch"><h2>${t('c.perfil')}</h2></div><div class="prof"><div class="ring" style="--v:${pc.v}" role="img" aria-label="${pc.v}%"><b>${pc.v}%</b></div><div><p><strong>${t('perf.p',{v:pc.v})}</strong></p><p>${pc.falta.length?t('perf.h',{x:pc.falta.join(', ')}):t('perf.ok')}</p></div></div><a class="btn btn-l" style="margin-top:auto;width:100%" href="#/perfil">${t('perf.go')}</a></section></div>
 <div class="g2">
  <section class="card"><div class="ch"><h2>${t('c.op')}</h2><a href="#/oportunidades">${t('all')}</a></div>${ops}</section>
  <section class="card"><div class="ch"><h2>${t('c.fin')}</h2><a href="#/financiamento">${t('open')}</a></div>${finH}</section></div>
 <div class="g3">
  <section class="card"><div class="ch"><h2>${t('c.form')}</h2><a href="#/formacao">${t('open')}</a></div>${frm}<p class="rs" style="margin-top:auto;padding-top:.6rem">${t('cert',{n:d.formacao.certificados.length})}</p></section>
  <section class="card"><div class="ch"><h2>${t('c.proj')}</h2><a href="#/empreendedorismo">${t('open')}</a></div>${prj}</section>
  <section class="card"><div class="ch"><h2>${t('c.ev')}</h2><a href="#/eventos">${t('all')}</a></div>${evs}</section></div>`;
}
/* ===== 7. Interacção: menu, dropdowns, idioma, sessão ===== */
const body=document.body;
function setMenu(on){body.classList.toggle('drawer',on);$('#scrim').classList.toggle('on',on);$('#menuBtn').setAttribute('aria-expanded',on);if(on)setTimeout(()=>$('#nav a[aria-current]')?.focus(),50);else if(matchMedia('(max-width:1023px)').matches&&document.activeElement.closest('#side'))$('#menuBtn').focus()}
function closeMenus(){document.querySelectorAll('.menu.on').forEach(m=>{m.classList.remove('on');m.parentElement.querySelector('button').setAttribute('aria-expanded','false')})}
function closeAll(){setMenu(false);closeMenus()}
function toast(m){const e=$('#toast');e.textContent=m;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2500)}
function logout(){Session.end();location.href='login.html'}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-a]');
 if(!b){if(!e.target.closest('.dd'))closeMenus();if(e.target.id==='scrim')setMenu(false);return}
 const [a,x]=b.dataset.a.split(':');
 if(a==='menu'){const m=$('#'+x),on=!m.classList.contains('on');closeMenus();m.classList.toggle('on',on);b.setAttribute('aria-expanded',on)}
 else if(a==='open-menu')setMenu(true);else if(a==='close-menu')setMenu(false);
 else if(a==='rail'){const on=body.classList.toggle('rail');b.setAttribute('aria-pressed',on);b.firstElementChild.className='fas fa-angles-'+(on?'right':'left')}
 else if(a==='lang'){lang=lang==='pt'?'en':'pt';try{localStorage.setItem('lermo-lang',lang)}catch(_){}applyLang();route()}
 else if(a==='top')scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 else if(a==='logout')logout();
 else if(a==='retry'){cache=null;route()}
});
$('#scrim').addEventListener('click',()=>setMenu(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const was=document.querySelector('.menu.on');closeAll();if(was)was.parentElement.querySelector('button').focus()}
 if(e.key==='Tab'&&body.classList.contains('drawer')){const f=[...$('#side').querySelectorAll('a,button')].filter(x=>x.offsetParent);const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
matchMedia('(min-width:1024px)').addEventListener('change',()=>setMenu(false));
addEventListener('hashchange',route);
addEventListener('scroll',()=>$('#top').classList.toggle('on',scrollY>200),{passive:true});
addEventListener('storage',e=>{if(e.key===Session.KEY&&!Session.get())location.replace('login.html')}); /* logout noutro separador */
function applyLang(){
 document.documentElement.lang=lang==='en'?'en':'pt-PT';$('#langL').textContent=lang.toUpperCase();
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 [['#menuBtn','menuOpen'],['#closeBtn','menuClose'],['#railBtn','rail'],['#top','top'],['#whoBtn','userAria'],['.lang','langAria']].forEach(([s,k])=>$(s).setAttribute('aria-label',t(k)));
}
/* ===== 8. Arranque ===== */
if(Session.get()){
 api.me().then(u=>{$('#wn').textContent=u.nome_completo;$('#av').textContent=u.nome_completo.split(' ').map(w=>w[0]).slice(0,2).join('')});
 applyLang();route();
}
