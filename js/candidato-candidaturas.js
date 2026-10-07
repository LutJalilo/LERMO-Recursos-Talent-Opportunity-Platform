'use strict';
/* Área Candidaturas (tabelas candidaturas + historico_estados_candidatura): lista com filtro por estado e detalhe com o percurso.
   Depende de dashboard-candidato.js: MOCK/api, wait, t, esc, crumbs, fmtD, L, locL, est, Views, Actions, D, vAberta, $. */
(()=>{
const FLOW=['candidatou_se','em_analise','entrevista','contratado'];   /* percurso normal */
const ESTADOS=[...FLOW,'rejeitado'];                                  /* estados_candidatura */
const CD={f:'all',q:'',tipo:'',sort:'new',list:[],tm:0};

Object.assign(D.pt,{
 'cd.menu':'Opções',
 'cd.sub':'Acompanhe o estado de cada candidatura que enviou.','cd.count':'{n} candidaturas','cd.count.1':'1 candidatura','cd.all':'Todas','cd.f':'Filtrar por estado',
 'cd.sent':'Enviada em {d}','cd.view':'Ver candidatura','cd.back':'Voltar às candidaturas','cd.prog':'Progresso da candidatura','cd.hist':'Histórico','cd.msg':'A sua mensagem',
 'cd.f.sent':'Enviada em','cd.f.upd':'Última actualização','cd.f.match':'Compatibilidade','cd.f.seen':'Visto pelo recrutador','cd.seen.y':'Sim','cd.seen.n':'Ainda não',
 'cd.h.candidatou_se':'Candidatura enviada','cd.p.candidatou_se':'A sua candidatura foi enviada e aguarda análise. Quando o estado mudar, verá a actualização aqui.',
 'cd.h.em_analise':'Em análise','cd.p.em_analise':'O recrutador está a analisar a sua candidatura. Volte a consultar esta página para ver novidades.',
 'cd.h.entrevista':'Convite para entrevista','cd.p.entrevista':'A sua candidatura avançou para a fase de entrevista. Prepare-se e reveja os requisitos da vaga.',
 'cd.h.contratado':'Parabéns!','cd.p.contratado':'A sua candidatura foi aceite para esta vaga.',
 'cd.h.rejeitado':'Desta vez não avançou','cd.p.rejeitado':'A sua candidatura não foi seleccionada para esta vaga. Continue a explorar outras oportunidades.',
 'cd.vaga':'Vaga','cd.seevaga':'Ver vaga','cd.open':'Aberta até {d}','cd.vaga.na':'Esta vaga já não está disponível.','cd.nf':'Candidatura não encontrada','cd.nf.p':'Esta candidatura não existe ou não lhe pertence.',
 'cd.search':'Pesquisar por vaga ou empresa','cd.search.a':'Pesquisar candidaturas','cd.toggle':'Filtros','cd.tipo':'Tipo de vaga','cd.tipo.all':'Todos','cd.sort':'Ordenar','cd.sort.new':'Mais recentes','cd.sort.old':'Mais antigas','cd.clear':'Limpar filtros','cd.none':'Nenhuma candidatura corresponde aos filtros.'});
Object.assign(D.en,{
 'cd.menu':'Options',
 'cd.sub':'Follow the status of every application you have sent.','cd.count':'{n} applications','cd.count.1':'1 application','cd.all':'All','cd.f':'Filter by status',
 'cd.sent':'Sent on {d}','cd.view':'View application','cd.back':'Back to applications','cd.prog':'Application progress','cd.hist':'History','cd.msg':'Your message',
 'cd.f.sent':'Sent on','cd.f.upd':'Last update','cd.f.match':'Match','cd.f.seen':'Seen by the recruiter','cd.seen.y':'Yes','cd.seen.n':'Not yet',
 'cd.h.candidatou_se':'Application sent','cd.p.candidatou_se':'Your application has been sent and is waiting to be reviewed. When the status changes, you will see the update here.',
 'cd.h.em_analise':'Under review','cd.p.em_analise':'The recruiter is reviewing your application. Check back on this page for news.',
 'cd.h.entrevista':'Interview invitation','cd.p.entrevista':'Your application has moved on to the interview stage. Get ready and review the job requirements.',
 'cd.h.contratado':'Congratulations!','cd.p.contratado':'Your application has been accepted for this job.',
 'cd.h.rejeitado':'Not this time','cd.p.rejeitado':'Your application was not selected for this job. Keep exploring other opportunities.',
 'cd.vaga':'Job','cd.seevaga':'View job','cd.open':'Open until {d}','cd.vaga.na':'This job is no longer available.','cd.nf':'Application not found','cd.nf.p':'This application does not exist or does not belong to you.',
 'cd.search':'Search by job or company','cd.search.a':'Search applications','cd.toggle':'Filters','cd.tipo':'Job type','cd.tipo.all':'All','cd.sort':'Sort by','cd.sort.new':'Newest','cd.sort.old':'Oldest','cd.clear':'Clear filters','cd.none':'No application matches the filters.'});

/* ---------- dados (mock) ---------- */
const ord=e=>ESTADOS.indexOf(e);
const hist=id=>MOCK.historico.filter(h=>h.cand===id).sort((a,b)=>a.em.localeCompare(b.em)||ord(a.estado)-ord(b.estado));
const vagaDe=c=>MOCK.vagas.find(v=>v.id===c.vaga_id)||null;
api.candidaturas=()=>wait(MOCK.candidaturas.map(c=>({...c,vaga:vagaDe(c),hist:hist(c.id)})),200);          /* GET /api/candidaturas */
api.candidatura=id=>wait((c=>c?{...c,vaga:vagaDe(c),hist:hist(c.id)}:null)(MOCK.candidaturas.find(x=>x.id===id)),200);   /* GET /api/candidaturas/{id} */

/* ---------- percurso: [estado, classe] — d=feito, c=actual, x=rejeitado, ''=por fazer ---------- */
function passos(c){
 if(c.estado==='rejeitado'){
  const ate=Math.max(0,...c.hist.map(h=>FLOW.indexOf(h.estado)));
  return[...FLOW.slice(0,ate+1).map(k=>[k,'d']),['rejeitado','x']];
 }
 const i=FLOW.indexOf(c.estado);
 return FLOW.map((k,j)=>[k,c.estado==='contratado'||j<i?'d':j===i?'c':'']);
}
const ico={d:'<i class="fas fa-check"></i>',x:'<i class="fas fa-xmark"></i>',c:'<i class="fas fa-circle" style="font-size:.45rem"></i>','':''};
const stepper=c=>`<ol class="stp" aria-label="${t('cd.prog')}">${passos(c).map(([k,s])=>`<li class="${s}"${s==='c'?' aria-current="step"':''}><span class="dot" aria-hidden="true">${ico[s]}</span><span class="lb">${t('est.'+k)}</span></li>`).join('')}</ol>`;
const mbar=c=>`<div class="mbar" role="img" aria-label="${t('est.'+c.estado)}">${passos(c).map(([,s])=>`<i class="${s}"></i>`).join('')}</div>`;

/* ---------- lista ---------- */
const cCard=c=>{const v=c.vaga;
 return `<article class="vc"><div class="vh"><span class="ic"><i class="fas fa-file-signature" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/candidaturas/${c.id}">${esc(L(c,'t'))}</a></h2><div class="rs">${esc(c.emp)}</div></div>${LRM_FX.menu('cd',c.id,t('cd.menu')+': '+L(c,'t'),[['cd-ver','fa-eye','cd.view'],['cd-vaga','fa-building','cd.seevaga',v?{}:{off:1,sub:'cd.vaga.na'}]])}</div>
 <div class="chips"><span class="tag ${est(c.estado)}">${t('est.'+c.estado)}</span>${v?`<span class="tag in">${t('tipo.'+v.tipo)}</span>`:''}</div>
 ${mbar(c)}
 <ul class="meta"><li><i class="fas fa-calendar-check" aria-hidden="true"></i>${t('cd.sent',{d:fmtD(c.criado_em)})}</li>${v?`<li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(locL(v))}</li>`:''}${c.match!=null?`<li><i class="fas fa-bullseye" aria-hidden="true"></i>${t('match',{v:c.match})}</li>`:''}</ul>
 <a class="btn btn-l" href="#/candidaturas/${c.id}">${t('cd.view')}</a></article>`};
/* filtros (pesquisa, tipo de vaga, ordem) aplicam-se por baixo da escolha de estado */
const base=()=>{const q=norm(CD.q.trim());return CD.list.filter(c=>(!CD.tipo||(c.vaga&&c.vaga.tipo===CD.tipo))&&(!q||norm([L(c,'t'),c.t||'',c.emp].join(' ')).includes(q)))};
const nEst=e=>base().filter(c=>e==='all'||c.estado===e).length;
const segHtml=()=>`<div class="seg" role="group" aria-label="${t('cd.f')}">${['all',...ESTADOS].filter(e=>e==='all'||CD.list.some(c=>c.estado===e)).map(e=>`<button type="button" data-a="cd-f:${e}" aria-pressed="${CD.f===e}">${t(e==='all'?'cd.all':'est.'+e)} <b>${nEst(e)}</b></button>`).join('')}</div>`;
const nFiltros=()=>(CD.tipo?1:0)+(CD.sort!=='new'?1:0);
function updFiltros(){const n=nFiltros(),tg=$('#cdTog'),cl=$('#cdClr');if(!tg)return;tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!CD.q&&CD.f==='all'}
function cdRender(){
 const box=$('#cdRes');if(!box)return;
 const r=base().filter(c=>CD.f==='all'||c.estado===CD.f).sort((a,b)=>CD.sort==='old'?a.criado_em.localeCompare(b.criado_em):b.criado_em.localeCompare(a.criado_em)),sg=$('#cdSeg');
 if(sg)sg.innerHTML=segHtml();updFiltros();
 $('#cdCount').textContent=CD.list.length?t(r.length===1?'cd.count.1':'cd.count',{n:r.length}):'';
 box.innerHTML=!CD.list.length
  ?`<div class="state card"><i class="fas fa-folder-open" aria-hidden="true"></i><p>${t('empty.cand')}</p><br><a class="btn btn-g" href="#/oportunidades"><i class="fas fa-magnifying-glass" aria-hidden="true"></i> ${t('hi.cta')}</a></div>`
  :!r.length?`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('cd.none')}</p><br><button class="btn btn-l" type="button" data-a="cd-clear">${t('cd.clear')}</button></div>`
  :`<div class="vgrid">${r.map(cCard).join('')}</div>`;
}
async function lista(){
 CD.list=(await api.candidaturas()).sort((a,b)=>b.criado_em.localeCompare(a.criado_em));
 if(CD.n!==CD.list.length||(CD.f!=='all'&&!CD.list.some(c=>c.estado===CD.f)))CD.f='all';   /* nova candidatura ou estado vazio: volta a mostrar todas */
 CD.n=CD.list.length;
 const tipos=[...new Set(CD.list.map(c=>c.vaga&&c.vaga.tipo).filter(Boolean))].sort();
 if(CD.tipo&&!tipos.includes(CD.tipo))CD.tipo='';
 const filtros=CD.list.length?`<form class="flt${nFiltros()?' open':''}" id="cdF" role="search" aria-label="${t('n.cand')}">
   <div class="fld fq"><label class="sr" for="cdQ">${t('cd.search.a')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="cdQ" type="search" value="${esc(CD.q)}" placeholder="${t('cd.search')}" autocomplete="off" maxlength="80"></div></div>
   <button class="btn btn-l" id="cdTog" type="button" data-a="cd-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="cdSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('cd.toggle')} <b class="bd" hidden></b></button>
   <div class="fsec" id="cdSec">
    ${tipos.length>1?`<div class="fld"><label for="cdTipo">${t('cd.tipo')}</label><select id="cdTipo" data-f="tipo"><option value="">${t('cd.tipo.all')}</option>${tipos.map(x=>`<option value="${esc(x)}"${x===CD.tipo?' selected':''}>${esc(t('tipo.'+x))}</option>`).join('')}</select></div>`:''}
    <div class="fld"><label for="cdSort">${t('cd.sort')}</label><select id="cdSort" data-f="sort"><option value="new"${CD.sort==='new'?' selected':''}>${t('cd.sort.new')}</option><option value="old"${CD.sort==='old'?' selected':''}>${t('cd.sort.old')}</option></select></div>
    <button class="btn btn-l" id="cdClr" type="button" data-a="cd-clear">${t('cd.clear')}</button>
   </div></form>`:'';
 return{title:t('n.cand'),after:cdRender,html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.cand')]])+
 `<div class="ph"><div><h1>${t('n.cand')}</h1><p class="rs wrap">${t('cd.sub')}</p></div><p class="rs" id="cdCount" aria-live="polite"></p></div>
 ${filtros}${CD.list.length?'<div id="cdSeg"></div>':''}<div id="cdRes" aria-live="polite"></div>`};
}
Actions['cd-menu']=(b,id)=>Actions['fi-menu'](b,id);
Actions['cd-ver']=(b,id)=>{LRM_FX.close();location.hash='#/candidaturas/'+id};
Actions['cd-vaga']=(b,id)=>{LRM_FX.close();const x=CD.list.find(k=>String(k.id)===String(id));if(x&&x.vaga)location.hash='#/oportunidades/'+x.vaga.id};
Actions['cd-f']=(b,e)=>{CD.f=e;cdRender();const n=document.querySelector(`#cdSeg [data-a="cd-f:${e}"]`);if(n)n.focus()};
Actions['cd-tog']=b=>{const on=!$('#cdF').classList.contains('open');$('#cdF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
Actions['cd-clear']=()=>{Object.assign(CD,{q:'',tipo:'',sort:'new',f:'all'});
 const f=$('#cdF');if(f){f.reset();$('#cdQ').value='';const x=$('#cdTipo');if(x)x.value='';$('#cdSort').value='new'}cdRender();if(f)$('#cdQ').focus()};
document.addEventListener('submit',e=>{if(e.target.id==='cdF')e.preventDefault()});
document.addEventListener('input',e=>{if(e.target.id==='cdQ'){CD.q=e.target.value;clearTimeout(CD.tm);CD.tm=setTimeout(cdRender,120)}});
document.addEventListener('change',e=>{const el=e.target,k=el.dataset&&el.dataset.f;if(!k||!el.closest('#cdF'))return;CD[k]=el.value;cdRender()});

/* ---------- detalhe ---------- */
async function detalhe(id){
 const c=await api.candidatura(id),nav=[[t('n.dash'),'#/dashboard'],[t('n.cand'),'#/candidaturas']];
 if(!c)return{title:t('n.cand'),html:crumbs([...nav,[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('cd.nf')}</h1><p>${t('cd.nf.p')}</p><br><a class="btn btn-g" href="#/candidaturas"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('cd.back')}</a></div>`};
 const v=c.vaga,upd=c.hist.length?c.hist[c.hist.length-1].em:c.criado_em,tone={contratado:'ok',rejeitado:'no'}[c.estado]||'';
 const fact=(i,k,val)=>val?`<div><dt><i class="fas ${i}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(val)}</dd></div>`:'';
 const aside=v
  ?`<strong>${t('cd.vaga')}</strong><p class="rs wrap">${esc(L(v,'t'))} · ${esc(v.emp)}</p><span class="tag ${vAberta(v)?'in':'no'}">${vAberta(v)?t('cd.open',{d:fmtD(v.lim)}):t('op.closed')}</span><a class="btn btn-g" href="#/oportunidades/${v.id}">${t('cd.seevaga')}</a>`
  :`<strong>${t('cd.vaga')}</strong><p class="rs wrap">${t('cd.vaga.na')}</p>`;
 return{title:L(c,'t'),html:crumbs([...nav,[L(c,'t')]])+
 `<div class="vtop"><a class="btn btn-l" href="#/candidaturas"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('cd.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det cd"><article class="card"><header><h1>${esc(L(c,'t'))}</h1><p class="rs wrap">${esc(c.emp)}</p>
  <div class="chips"><span class="tag ${est(c.estado)}">${t('est.'+c.estado)}</span>${v?`<span class="tag in">${t('tipo.'+v.tipo)}</span><span class="tag">${t('reg.'+v.reg)}</span>`:''}</div></header>
  ${stepper(c)}
  <div class="apx ${tone}"><strong>${t('cd.h.'+c.estado)}</strong><p>${t('cd.p.'+c.estado)}</p></div>
  <dl class="facts">${fact('fa-calendar-check','cd.f.sent',fmtD(c.criado_em))}${fact('fa-clock-rotate-left','cd.f.upd',fmtD(upd))}${c.match!=null?fact('fa-bullseye','cd.f.match',c.match+'%'):''}${fact('fa-eye','cd.f.seen',t(c.visto?'cd.seen.y':'cd.seen.n'))}${v?fact('fa-location-dot','op.loc',locL(v)):''}</dl>
  ${c.mensagem?`<h2>${t('cd.msg')}</h2><p class="wrap" style="white-space:pre-line">${esc(c.mensagem)}</p>`:''}
  <h2>${t('cd.hist')}</h2><ol class="tl">${c.hist.map(h=>`<li><time datetime="${h.em}">${fmtD(h.em)}</time><span>${t('est.'+h.estado)}</span></li>`).join('')}</ol></article>
 <aside class="card cta" aria-label="${t('cd.vaga')}">${aside}<a class="btn btn-l" href="#/oportunidades">${t('hi.cta')}</a></aside></div>`};
}
Views.candidaturas=id=>id?detalhe(id):lista();
})();
