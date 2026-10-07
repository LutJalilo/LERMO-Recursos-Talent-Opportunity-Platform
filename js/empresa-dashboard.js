'use strict';
/* Dashboard da empresa (Fase 10): indicadores, funil, consumo do plano, série temporal, primeiros passos, publicações e actividade.
   Começa SEM dados de exemplo: tudo é calculado a partir de MOCK (vazio) e mostra estados vazios com o próximo passo.
   Depende de dashboard-empresa.js: MOCK/api, wait, t, esc, crumbs, Views, Actions, D, lang, Session, route, $.
   Tabelas SQL: vagas, candidaturas, planos_assinatura, assinaturas_empresas, empresa_membros, eventos, programas_formacao,
   linhas_financiamento, projetos_empreendedorismo, anuncios_marketplace, logs_actividade. */
(()=>{
const PLANOS={gratuito:{v:3,r:1},basico:{v:10,r:2},premium:{v:25,r:5},enterprise:{v:999,r:10}};  /* planos_assinatura.vagas_mensais / max_recrutadores */
const ESTADOS=['candidatou_se','em_analise','entrevista','contratado','rejeitado'];                /* estados_candidatura */
const PUBL=[['formacao','fa-graduation-cap'],['eventos','fa-calendar-days'],['financiamento','fa-hand-holding-dollar'],['empreendedorismo','fa-lightbulb'],['marketplace','fa-store'],['equipa','fa-user-group']];
const DC={dias:30};

Object.assign(D.pt,{
 'hi.p':'Veja o que se passa no recrutamento e nas publicações da sua empresa.','hi.cta':'Publicar vaga','hi.cta2':'Ver candidaturas',
 'dc.k.vagas':'Vagas activas','dc.k.cand':'Candidaturas recebidas','dc.k.ent':'Em entrevista','dc.k.contr':'Contratações',
 'dc.fun':'Funil de candidaturas','dc.fun.none':'Ainda não recebeu candidaturas.','dc.fun.none.p':'Publique a primeira vaga e acompanhe aqui cada candidato, da candidatura à contratação.',
 'e.candidatou_se':'Candidatou-se','e.em_analise':'Em análise','e.entrevista':'Entrevista','e.contratado':'Contratado','e.rejeitado':'Rejeitado',
 'dc.plan':'Plano e consumo','dc.plan.v':'Vagas este mês','dc.plan.of':'{u} de {l}','dc.plan.unl':'Ilimitadas','dc.plan.team':'Equipa: {u} de {l} membros','dc.plan.high':'Perto do limite','dc.plan.all':'Ver planos',
 'dc.ts':'Candidaturas recebidas','dc.ts.n':'{n} nos últimos {d} dias','dc.ts.none':'Sem candidaturas neste período.','dc.ts.aria':'Candidaturas por dia nos últimos {d} dias; total {n}','dc.d':'{d} dias','dc.per':'Período',
 'dc.go':'Primeiros passos','dc.go.p':'{n} de {m} concluídos','dc.go.all':'Tudo pronto. A sua conta está completa.',
 'dc.s.perfil':'Completar o perfil da empresa','dc.s.vaga':'Publicar a primeira vaga','dc.s.equipa':'Convidar um membro da equipa','dc.s.plano':'Escolher um plano',
 'dc.pub':'As suas publicações','dc.pub.sub':'Formação, eventos, financiamento, empreendedorismo e marketplace.',
 'dc.p.formacao':'Formação','dc.p.eventos':'Eventos','dc.p.financiamento':'Financiamento','dc.p.empreendedorismo':'Empreendedorismo','dc.p.marketplace':'Marketplace','dc.p.equipa':'Equipa',
 'dc.u.formacao':'programas','dc.u.eventos':'eventos','dc.u.financiamento':'linhas','dc.u.empreendedorismo':'programas','dc.u.marketplace':'anúncios','dc.u.equipa':'membros',
 'dc.i.formacao':'inscritos','dc.i.eventos':'inscritos','dc.i.financiamento':'pedidos','dc.i.empreendedorismo':'inscritos','dc.i.marketplace':'transacções','dc.i.equipa':'convites pendentes',
 'dc.act':'Actividade recente','dc.act.none':'Sem actividade ainda.','dc.act.none.p':'As candidaturas, inscrições e pagamentos aparecem aqui assim que acontecerem.',
 'dc.vg':'As suas vagas','dc.vg.all':'Ver todas','dc.vg.soon':'{n} vaga(s) a terminar nos próximos 7 dias','dc.vg.none':'Ainda não publicou vagas.','dc.vg.cand':'candidaturas','dc.qa':'Acções rápidas','dc.qa.vaga':'Publicar uma vaga','dc.qa.cand':'Analisar candidaturas','dc.qa.tal':'Procurar talentos','dc.qa.ev':'Publicar um evento','dc.qa.eq':'Convidar um membro','dc.qa.perfil':'Completar o perfil'});
Object.assign(D.en,{
 'hi.p':'See what is happening with your company recruitment and publications.','hi.cta':'Post a job','hi.cta2':'View applications',
 'dc.k.vagas':'Active jobs','dc.k.cand':'Applications received','dc.k.ent':'In interview','dc.k.contr':'Hires',
 'dc.fun':'Application funnel','dc.fun.none':'You have not received applications yet.','dc.fun.none.p':'Post your first job and follow every candidate here, from application to hire.',
 'e.candidatou_se':'Applied','e.em_analise':'Under review','e.entrevista':'Interview','e.contratado':'Hired','e.rejeitado':'Rejected',
 'dc.plan':'Plan and usage','dc.plan.v':'Jobs this month','dc.plan.of':'{u} of {l}','dc.plan.unl':'Unlimited','dc.plan.team':'Team: {u} of {l} members','dc.plan.high':'Near the limit','dc.plan.all':'See plans',
 'dc.ts':'Applications received','dc.ts.n':'{n} in the last {d} days','dc.ts.none':'No applications in this period.','dc.ts.aria':'Applications per day in the last {d} days; total {n}','dc.d':'{d} days','dc.per':'Period',
 'dc.go':'Getting started','dc.go.p':'{n} of {m} completed','dc.go.all':'All set. Your account is complete.',
 'dc.s.perfil':'Complete the company profile','dc.s.vaga':'Post your first job','dc.s.equipa':'Invite a team member','dc.s.plano':'Choose a plan',
 'dc.pub':'Your publications','dc.pub.sub':'Training, events, funding, entrepreneurship and marketplace.',
 'dc.p.formacao':'Training','dc.p.eventos':'Events','dc.p.financiamento':'Funding','dc.p.empreendedorismo':'Entrepreneurship','dc.p.marketplace':'Marketplace','dc.p.equipa':'Team',
 'dc.u.formacao':'programmes','dc.u.eventos':'events','dc.u.financiamento':'lines','dc.u.empreendedorismo':'programmes','dc.u.marketplace':'listings','dc.u.equipa':'members',
 'dc.i.formacao':'registrations','dc.i.eventos':'registrations','dc.i.financiamento':'requests','dc.i.empreendedorismo':'registrations','dc.i.marketplace':'transactions','dc.i.equipa':'pending invites',
 'dc.act':'Recent activity','dc.act.none':'No activity yet.','dc.act.none.p':'Applications, registrations and payments will appear here as soon as they happen.',
 'dc.vg':'Your jobs','dc.vg.all':'View all','dc.vg.soon':'{n} job(s) ending in the next 7 days','dc.vg.none':'You have not posted jobs yet.','dc.vg.cand':'applications','dc.qa':'Quick actions','dc.qa.vaga':'Post a job','dc.qa.cand':'Review applications','dc.qa.tal':'Find talent','dc.qa.ev':'Post an event','dc.qa.eq':'Invite a member','dc.qa.perfil':'Complete the profile'});

/* ---------- dados (mock vazio; cada campo vem de uma tabela do SQL) ---------- */
Object.assign(MOCK,{
 vagas:[],                 /* vagas: {id,estado:'aberta'|'rascunho'|'fechada' (vagas.estado)} */
 candidaturas:[],          /* candidaturas: {id,vaga_id,estado,em:'YYYY-MM-DD'} */
 empresa:{},               /* empresas: dados do perfil, preenchidos em js/empresa-perfil.js */
 vagasConsumidas:0,        /* vagas_mensais_consumidas do mês actual */
 membros:1,convites:0,     /* empresa_membros (o dono conta como 1) e empresa_convites pendentes */
 publicacoes:{},           /* {formacao:{n,i},eventos:{n,i},...}: publicações da empresa e inscrições/pedidos */
 actividade:[]             /* logs_actividade: {tipo:'candidatura'|'inscricao'|'pagamento'|'equipa',texto,em:ISO} */
});
const dia=d=>{const x=new Date();x.setHours(0,0,0,0);x.setDate(x.getDate()-d);return x.toISOString().slice(0,10)};
function calc(){
 const c=MOCK.candidaturas,v=MOCK.vagas,pl=PLANOS[MOCK.plano]||PLANOS.gratuito,P=MOCK.publicacoes||{};
 const funil=Object.fromEntries(ESTADOS.map(e=>[e,c.filter(x=>x.estado===e).length]));
 const serie=[];for(let i=DC.dias-1;i>=0;i--){const d=dia(i);serie.push({d,n:c.filter(x=>String(x.em).slice(0,10)===d).length})}
 const pct=window.LermoEmpresaPct?window.LermoEmpresaPct():0;   /* calculado no módulo do Perfil (10 campos, 10% cada) */
 const publ=Object.fromEntries(PUBL.map(([k])=>[k,k==='equipa'?{n:MOCK.membros,i:MOCK.convites}:{n:(P[k]||{}).n||0,i:(P[k]||{}).i||0}]));
 return{
  kpi:{vagas:v.filter(x=>x.estado==='aberta'&&x.data_limite>=new Date().toISOString().slice(0,10)).length,cand:c.length,ent:funil.entrevista,contr:funil.contratado},
  funil,serie,total:serie.reduce((s,x)=>s+x.n,0),pct,publ,actividade:[...MOCK.actividade].sort((a,b)=>b.em.localeCompare(a.em)).slice(0,6),
  plano:{nome:MOCK.plano,u:MOCK.vagasConsumidas,l:pl.v,mu:MOCK.membros,ml:pl.r},
  passos:[['perfil',pct>=80,'#/perfil','fa-building'],['vaga',v.length>0,'#/vagas','fa-briefcase'],['equipa',MOCK.membros>1,'#/equipa','fa-user-group'],['plano',MOCK.plano!=='gratuito','#/plano','fa-credit-card']]
 };
}
api.dashboard=()=>wait(calc(),250);   /* GET /api/empresa/dashboard?dias=7|30|90 */

/* ---------- apresentação ---------- */
const nf=n=>new Intl.NumberFormat(lang==='en'?'en':'pt-PT').format(n);
const fd=s=>new Date(s+'T00:00').toLocaleDateString(lang==='en'?'en-GB':'pt-PT',{day:'numeric',month:'short'});
const ft=s=>new Date(s).toLocaleString(lang==='en'?'en-GB':'pt-PT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const vazio=(ic,h,p,cta)=>`<div class="state"><i class="fas ${ic}" aria-hidden="true"></i><strong>${esc(h)}</strong>${p?`<p>${esc(p)}</p>`:''}${cta||''}</div>`;

function stats(d){
 return `<div class="stats">`+[['vagas','fa-briefcase','#/vagas',d.kpi.vagas],['cand','fa-file-signature','#/candidaturas',d.kpi.cand],['ent','fa-comments','#/candidaturas',d.kpi.ent],['contr','fa-handshake','#/candidaturas',d.kpi.contr]]
  .map(([k,i,h,n])=>`<a class="stat" href="${h}"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><div><b>${nf(n)}</b><span>${t('dc.k.'+k)}</span></div></a>`).join('')+`</div>`;
}
function funil(d){
 const tot=d.kpi.cand,max=Math.max(1,...Object.values(d.funil));
 const body=tot?ESTADOS.map(e=>`<div class="fn${e==='rejeitado'?' x':e==='contratado'?' ok':''}"><span>${t('e.'+e)}</span><div class="fb" role="presentation"><i style="width:${Math.round(d.funil[e]/max*100)}%"></i></div><b>${nf(d.funil[e])}</b></div>`).join('')
  :vazio('fa-filter',t('dc.fun.none'),t('dc.fun.none.p'),`<a class="btn btn-g" href="#/vagas"><i class="fas fa-plus" aria-hidden="true"></i> ${t('hi.cta')}</a>`);
 return `<section class="card" aria-labelledby="hF"><div class="ch"><h2 id="hF">${t('dc.fun')}</h2><a href="#/candidaturas">${t('open')}</a></div>${body}</section>`;
}
function plano(d){
 const p=d.plano,unl=p.l>=999,pct=unl?0:Math.min(100,Math.round(p.u/p.l*100));
 return `<section class="card" aria-labelledby="hP"><div class="ch"><h2 id="hP">${t('dc.plan')}</h2><span class="tag in">${t('plano.'+p.nome)}</span></div>
  <div class="pl"><div class="ring" style="--v:${pct}" role="img" aria-label="${t('dc.plan.v')}: ${unl?t('dc.plan.unl'):t('dc.plan.of',{u:p.u,l:p.l})}"><b>${unl?'∞':nf(p.u)+'/'+nf(p.l)}</b></div>
  <div><div class="rt wrap">${t('dc.plan.v')}</div><p class="rs wrap">${unl?t('dc.plan.unl'):t('dc.plan.of',{u:nf(p.u),l:nf(p.l)})}</p>${pct>=80?`<span class="tag no" style="margin-top:.4rem;display:inline-block">${t('dc.plan.high')}</span>`:''}</div></div>
  <p class="rs wrap" style="margin-top:1rem"><i class="fas fa-user-group" aria-hidden="true"></i> ${t('dc.plan.team',{u:p.mu,l:p.ml})}</p>
  <a class="btn btn-l" style="margin-top:auto;align-self:flex-start" href="#/plano"><i class="fas fa-crown" aria-hidden="true"></i> ${t('dc.plan.all')}</a></section>`;
}
function serie(d){
 const W=600,H=140,n=d.serie.length,bw=W/n,max=Math.max(1,...d.serie.map(x=>x.n));
 const seg=[7,30,90].map(x=>`<button type="button" data-a="dc-p:${x}" aria-pressed="${x===DC.dias}">${t('dc.d',{d:x})}</button>`).join('');
 const g=d.total?`<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${t('dc.ts.aria',{d:DC.dias,n:d.total})}">`+
   d.serie.map((x,i)=>{const h=x.n?Math.max(4,x.n/max*(H-8)):2;return `<rect x="${(i*bw+bw*.15).toFixed(1)}" y="${(H-h).toFixed(1)}" width="${(bw*.7).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${x.n?'var(--p)':'rgba(27,67,50,.12)'}"><title>${fd(x.d)}: ${x.n}</title></rect>`}).join('')+
   `</svg><div class="ax"><span>${fd(d.serie[0].d)}</span><span>${fd(d.serie[n-1].d)}</span></div></div>`
  :vazio('fa-chart-column',t('dc.ts.none'));
 return `<section class="card" aria-labelledby="hT"><div class="ch"><h2 id="hT">${t('dc.ts')}</h2><div class="seg" role="group" aria-label="${t('dc.per')}">${seg}</div></div>${d.total?`<p class="rs wrap" style="margin-bottom:.6rem">${t('dc.ts.n',{n:nf(d.total),d:DC.dias})}</p>`:''}${g}</section>`;
}
function passos(d){
 const f=d.passos.filter(p=>p[1]).length,m=d.passos.length;
 return `<section class="card" aria-labelledby="hG"><div class="ch"><h2 id="hG">${t('dc.go')}</h2><span class="tag ${f===m?'ok':''}">${f}/${m}</span></div>
  <div class="pb" role="progressbar" aria-valuemin="0" aria-valuemax="${m}" aria-valuenow="${f}" aria-label="${t('dc.go.p',{n:f,m})}"><i style="width:${f/m*100}%"></i></div>
  <p class="rs wrap" style="margin:.5rem 0 .3rem">${f===m?t('dc.go.all'):t('dc.go.p',{n:f,m})}</p>
  <div class="cl">${d.passos.map(([k,ok,h,i])=>`<a class="${ok?'dn':''}" href="${h}"><span class="ck"><i class="fas ${ok?'fa-check':i}" aria-hidden="true"></i></span><span class="rb"><span class="rt wrap">${t('dc.s.'+k)}</span></span>${ok?'':'<i class="fas fa-arrow-right go" aria-hidden="true"></i>'}</a>`).join('')}</div></section>`;
}
function publ(d){
 return `<div class="ch" style="margin-top:1.4rem"><div><h2>${t('dc.pub')}</h2><p class="rs wrap">${t('dc.pub.sub')}</p></div></div><div class="g3">`+PUBL.map(([k,i])=>{const x=d.publ[k];
  return `<a class="card acard" href="#/${k}"><div class="prof"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><h2>${t('dc.p.'+k)}</h2></div>
   <div class="pn"><div><b>${nf(x.n)}</b><span>${t('dc.u.'+k)}</span></div><div><b>${nf(x.i)}</b><span>${t('dc.i.'+k)}</span></div></div><span class="go">${t('open')} <i class="fas fa-arrow-right" aria-hidden="true"></i></span></a>`}).join('')+`</div>`;
}
function actividade(d){
 const IC={candidatura:'fa-file-signature',inscricao:'fa-user-plus',pagamento:'fa-credit-card',equipa:'fa-user-group'};
 const body=d.actividade.length?d.actividade.map(a=>`<div class="row"><span class="ic"><i class="fas ${IC[a.tipo]||'fa-bell'}" aria-hidden="true"></i></span><div class="rb"><div class="rt wrap">${esc(a.texto)}</div><div class="rs">${ft(a.em)}</div></div></div>`).join('')
  :vazio('fa-clock-rotate-left',t('dc.act.none'),t('dc.act.none.p'));
 return `<section class="card" aria-labelledby="hA"><div class="ch"><h2 id="hA">${t('dc.act')}</h2></div>${body}</section>`;
}
function acoes(){
 return `<section class="card" aria-labelledby="hQ"><div class="ch"><h2 id="hQ">${t('dc.qa')}</h2></div>`+[['vaga','fa-briefcase','#/vagas'],['cand','fa-file-signature','#/candidaturas'],['tal','fa-users-viewfinder','#/talentos'],['ev','fa-calendar-days','#/eventos'],['eq','fa-user-plus','#/equipa'],['perfil','fa-building','#/perfil']]
  .map(([k,i,h])=>`<a class="row" href="${h}"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><div class="rb"><div class="rt wrap">${t('dc.qa.'+k)}</div></div><i class="fas fa-arrow-right go" aria-hidden="true"></i></a>`).join('')+`</section>`;
}

function vagasR(){
 const hj=new Date().toISOString().slice(0,10),L=[...MOCK.vagas].sort((a,b)=>String(b.criado_em).localeCompare(a.criado_em)).slice(0,6);
 const dl=v=>Math.round((new Date(v.data_limite+'T00:00:00')-new Date(hj+'T00:00:00'))/864e5),soon=MOCK.vagas.filter(v=>v.estado==='aberta'&&v.data_limite>=hj&&dl(v)<=7).length;
 const card=window.VagaCard&&window.VagaCard.item;
 const arr=L.length>3?`<span class="vg-arr"><button class="ib" type="button" data-a="vg-sc:l" aria-label="←"><i class="fas fa-chevron-left" aria-hidden="true"></i></button><button class="ib" type="button" data-a="vg-sc:r" aria-label="→"><i class="fas fa-chevron-right" aria-hidden="true"></i></button></span>`:'';
 return `<section class="vg-dash" style="margin-bottom:1rem" aria-labelledby="hV"><div class="ch"><h2 id="hV">${t('dc.vg')}</h2><div style="display:flex;gap:.8rem;align-items:center">${arr}<a href="#/vagas">${t('dc.vg.all')}</a></div></div>${soon?`<p class="vg-alert"><i class="fas fa-hourglass-half" aria-hidden="true"></i> ${t('dc.vg.soon',{n:soon})}</p>`:''}${L.length&&card?`<div class="vg-row" id="vgL" tabindex="0" role="region" aria-label="${t('dc.vg')}">${L.map(card).join('')}</div>`:`<p class="rs wrap">${t('dc.vg.none')}</p>`}</section>`;
}
Views.dashboard=async()=>{
 const d=await api.dashboard(),u=Session.get();
 return{title:t('n.dash'),html:crumbs([[t('n.dash')]])+
  `<section class="hello"><div><h1>${t('hi',{n:'<em>'+esc(u.nome_completo)+'</em>'})}</h1><p>${t('hi.p')}</p></div><div class="acts"><a class="btn btn-g" href="#/vagas"><i class="fas fa-plus" aria-hidden="true"></i> ${t('hi.cta')}</a><a class="btn btn-o" href="#/candidaturas"><i class="fas fa-file-signature" aria-hidden="true"></i> ${t('hi.cta2')}</a></div></section>`+
  stats(d)+vagasR()+`<div class="g2">${funil(d)}${plano(d)}</div><div class="g2">${serie(d)}${passos(d)}</div>`+publ(d)+`<div class="g2" style="margin-top:1rem">${actividade(d)}${acoes()}</div>`};
};
Actions['dc-p']=(b,x)=>{DC.dias=+x;route()};
})();
