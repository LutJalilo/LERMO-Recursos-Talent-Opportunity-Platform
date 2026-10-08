'use strict';
/* Área Convites do candidato (tabela convites_talento, SQL v5.14): convites de empresas a vagas, com aceitar ou recusar.
   Estados: enviado → visto (ao abrir) → aceite | recusado. Aceitar não cria a candidatura: leva o candidato à vaga para se candidatar.
   Em produção: GET /api/candidato/convites, GET /api/candidato/convites/{id} (marca visto) e POST /api/candidato/convites/{id}/responder {aceitar}
   (função responder_convite_talento). A empresa nunca vê o email do candidato; o candidato recebe também uma cópia por email.
   Demo: lê localStorage['lermo-convites-demo'], escrito pelo painel da empresa (js/empresa-talentos.js). Na demo, como os talentos de teste não são contas
   reais, todos os convites aparecem na conta demo; em produção cada candidato só vê os seus (RLS convites_talento_candidato).
   Depende de dashboard-candidato.js: t, esc, crumbs, fmtD, L, Views, Actions, Modal, toast, D, $. */
(()=>{
const KEY='lermo-convites-demo',FIL=['all','enviado','aceite','recusado'];
const CV={f:'all'};
Object.assign(D.pt,{'cv.sub':'Convites de empresas para se candidatar às suas vagas. Responda quando quiser.','cv.count':'{n} convites','cv.count.1':'1 convite','cv.f':'Filtrar por estado',
 'cv.f.all':'Todos','cv.f.enviado':'Pendentes','cv.f.aceite':'Aceites','cv.f.recusado':'Recusados','cv.s.enviado':'Novo','cv.s.visto':'Pendente','cv.s.aceite':'Aceite','cv.s.recusado':'Recusado',
 'cv.none':'Ainda não recebeu convites.','cv.none.p':'Quando uma empresa o convidar para uma vaga, o convite aparece aqui e também no seu email.','cv.nores':'Nenhum convite neste estado.','cv.see':'Ver oportunidades',
 'cv.from':'De {e}','cv.rec':'Recebido em {d}','cv.open':'Ver convite','cv.back':'Voltar aos convites','cv.msg':'Mensagem','cv.vaga':'Vaga','cv.emp':'Empresa','cv.lim':'Candidaturas até','cv.vg':'Lugares','cv.loc':'Local','cv.tipo':'Tipo','cv.resp':'Respondeu em {d}',
 'cv.yes':'Aceitar convite','cv.no':'Recusar','cv.apply':'Candidatar-me à vaga','cv.pend':'Aguarda a sua resposta','cv.pend.p':'Aceitar mostra-lhe a vaga para se candidatar. Recusar fecha o convite e a empresa é informada.',
 'cv.acc':'Convite aceite','cv.acc.p':'Obrigado. Falta só candidatar-se à vaga para a empresa receber a sua candidatura.','cv.dec':'Convite recusado','cv.dec.p':'A empresa foi informada. Pode continuar a ver outras oportunidades.',
 'cv.c.title':'Recusar convite','cv.c.q':'Tem a certeza de que quer recusar este convite?','cv.c.yes':'Sim, recusar','cv.c.no':'Manter convite','cv.ok.y':'Convite aceite.','cv.ok.n':'Convite recusado.','cv.nf':'Convite não encontrado.','cv.info':'A empresa não vê o seu email. Esta mensagem foi enviada pela plataforma e uma cópia foi para o seu email.','n.conv':'Convites'});
Object.assign(D.en,{'cv.sub':'Invitations from companies to apply to their jobs. Reply whenever you like.','cv.count':'{n} invitations','cv.count.1':'1 invitation','cv.f':'Filter by status',
 'cv.f.all':'All','cv.f.enviado':'Pending','cv.f.aceite':'Accepted','cv.f.recusado':'Declined','cv.s.enviado':'New','cv.s.visto':'Pending','cv.s.aceite':'Accepted','cv.s.recusado':'Declined',
 'cv.none':'You have not received invitations yet.','cv.none.p':'When a company invites you to a job, the invitation shows up here and in your email.','cv.nores':'No invitation with this status.','cv.see':'See opportunities',
 'cv.from':'From {e}','cv.rec':'Received on {d}','cv.open':'View invitation','cv.back':'Back to invitations','cv.msg':'Message','cv.vaga':'Job','cv.emp':'Company','cv.lim':'Applications until','cv.vg':'Openings','cv.loc':'Location','cv.tipo':'Type','cv.resp':'Replied on {d}',
 'cv.yes':'Accept invitation','cv.no':'Decline','cv.apply':'Apply to the job','cv.pend':'Waiting for your reply','cv.pend.p':'Accepting shows you the job so you can apply. Declining closes the invitation and the company is told.',
 'cv.acc':'Invitation accepted','cv.acc.p':'Thank you. You only need to apply to the job so the company receives your application.','cv.dec':'Invitation declined','cv.dec.p':'The company was told. You can keep looking at other opportunities.',
 'cv.c.title':'Decline invitation','cv.c.q':'Are you sure you want to decline this invitation?','cv.c.yes':'Yes, decline','cv.c.no':'Keep invitation','cv.ok.y':'Invitation accepted.','cv.ok.n':'Invitation declined.','cv.nf':'Invitation not found.','cv.info':'The company does not see your email. This message was sent through the platform and a copy went to your email.','n.conv':'Invitations'});
const ler=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};
const gravar=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
const todos=()=>ler().slice().sort((a,b)=>String(b.criado_em).localeCompare(String(a.criado_em)));
const um=id=>todos().find(c=>c.id===id);
const mudar=(id,fn)=>{const a=ler(),c=a.find(x=>x.id===id);if(c){fn(c);gravar(a)}return c};
const pend=c=>c.estado==='enviado'||c.estado==='visto';
/* Convites de demonstração: aparecem uma única vez, se ainda não houver nenhum, para ver a área preenchida. Em produção vêm da API (GET /api/candidato/convites). */
(function semear(){
 try{
  if(localStorage.getItem(KEY+'-seed')||ler().length)return;localStorage.setItem(KEY+'-seed','1');
  const V=MOCK.vagas.filter(vAberta).slice(0,3),E=['enviado','visto','recusado'],d=n=>new Date(Date.now()-n*864e5).toISOString();
  gravar(V.map((v,i)=>({id:'demo-'+(i+1),empresa:v.emp,estado:E[i],criado_em:d(1+i*2),respondido_em:E[i]==='recusado'?d(i):null,
   vaga:{id:v.id,titulo:v.t,titulo_en:v.en||'',tipo:t('tipo.'+v.tipo),tipo_en:'',regime:t('reg.'+v.reg),local:locL(v),data_limite:v.lim,vagas:1},
   assunto:'Convite para a vaga «'+v.t+'» — '+v.emp,modo:'automatica',
   mensagem:'Olá Lut, o seu perfil chamou-nos a atenção e gostaríamos de o convidar a candidatar-se à vaga «'+v.t+'».\n\nCom os melhores cumprimentos,\n'+v.emp})));
 }catch(e){}
})();
const tag=e=>({enviado:'in',visto:'',aceite:'ok',recusado:'no'}[e]??'');
const vt=v=>lang==='en'&&v.titulo_en?v.titulo_en:v.titulo;
const tip=v=>lang==='en'&&v.tipo_en?v.tipo_en:v.tipo;
/* Cartões com o mesmo desenho dos outros cartões do painel (barra de estado no topo, etiquetas, lista com ícones, menu de três pontinhos).
   Carrossel partilhado (LRM_CAR em dashboard-candidato.js): desliza com o dedo; no computador, com 3 ou mais cartões, tem Anterior/Próximo. */
Object.assign(D.pt,{'cv.menu':'Opções do convite','cv.pg':'Paginação','cv.pg.prev':'Anterior','cv.pg.next':'Próximo','cv.pg.of':'{a}–{b} de {n}','cv.nav':'Navegar entre convites','cv.nav.of':'Convite {a} de {n}'});
Object.assign(D.en,{'cv.menu':'Invitation options','cv.pg':'Pagination','cv.pg.prev':'Previous','cv.pg.next':'Next','cv.pg.of':'{a}–{b} of {n}','cv.nav':'Browse invitations','cv.nav.of':'Invitation {a} of {n}'});
const sel=()=>{const A=todos();return{A,V:A.filter(c=>CV.f==='all'||(CV.f==='enviado'?pend(c):c.estado===CV.f))}};
const cor=c=>pend(c)?' ap':c.estado==='recusado'?' vx':'';
function menuHtml(c){
 const it=(a,ic,k,o={})=>`<button class="fx-mi${o.d?' d':''}" type="button" role="menuitem" data-a="${a}:${esc(c.id)}"><i class="fas ${ic}" aria-hidden="true"></i><span>${t(k)}</span></button>`;
 const items=[it('cv-ver','fa-eye','cv.open')];
 if(pend(c)){items.push(it('cv-yes-m','fa-check','cv.yes'));items.push(it('cv-no-m','fa-xmark','cv.no',{d:1}))}
 else if(c.estado==='aceite')items.push(it('cv-apply','fa-paper-plane','cv.apply'));
 else items.push(it('cv-opp','fa-magnifying-glass','cv.see'));
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="cv-menu:${esc(c.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${t('cv.menu')}: ${esc(vt(c.vaga))}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.join('')}</div></div>`}
const closeCv=focus=>document.querySelectorAll('.fx-menu.on').forEach(m=>{m.classList.remove('on');const k=m.previousElementSibling;k.setAttribute('aria-expanded','false');const c=m.closest('.vc');c&&c.classList.remove('fx-open');if(focus)k.focus()});
Actions['cv-menu']=b=>{const m=b.nextElementSibling,on=!m.classList.contains('on');closeCv();
 if(on){m.classList.add('on');b.setAttribute('aria-expanded','true');const c=b.closest('.vc');c&&c.classList.add('fx-open');const f=m.querySelector('button:not([disabled])');f&&f.focus()}};
document.addEventListener('click',e=>{if(!e.target.closest('.fx-dd'))closeCv()});
const card=c=>{const v=c.vaga,pz=v.data_limite?fmtD(v.data_limite):'';
 return `<article class="vc${cor(c)}"><div class="vh"><span class="ic"><i class="fas ${pend(c)?'fa-envelope':c.estado==='aceite'?'fa-circle-check':'fa-circle-xmark'}" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/convites/${esc(c.id)}">${esc(vt(v))}</a></h2><div class="rs">${esc(t('cv.from',{e:c.empresa}))}</div></div>${menuHtml(c)}</div>
 <div class="chips"><span class="tag ${tag(c.estado)}">${t('cv.s.'+c.estado)}</span>${tip(v)?`<span class="tag in">${esc(tip(v))}</span>`:''}${v.regime?`<span class="tag in">${esc(v.regime)}</span>`:''}</div>
 <ul class="meta m0">${v.local?`<li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(v.local)}</li>`:''}${pz?`<li><i class="fas fa-clock" aria-hidden="true"></i>${esc(t('cv.lim'))}: ${esc(pz)}</li>`:''}</ul>
 <p class="vcs"><span><i class="fas fa-calendar" aria-hidden="true"></i>${esc(t('cv.rec',{d:fmtD(c.criado_em)}))}</span></p>
 <a class="btn btn-l" href="#/convites/${esc(c.id)}">${t('cv.open')}</a></article>`};
function resHtml(){
 const{A,V}=sel();
 if(!A.length)return `<div class="state card"><i class="fas fa-envelope-open" aria-hidden="true"></i><p><strong>${t('cv.none')}</strong></p><p>${t('cv.none.p')}</p><br><a class="btn btn-g" href="#/oportunidades">${t('cv.see')}</a></div>`;
 if(!V.length)return `<div class="state card"><i class="fas fa-filter" aria-hidden="true"></i><p>${t('cv.nores')}</p></div>`;
 LRM_CAR.later();
 return `<p class="rs cvn" aria-live="polite">${t(V.length===1?'cv.count.1':'cv.count',{n:V.length})}</p>`+LRM_CAR.html(V.map(card).join(''),V.length,t('n.conv'),true)}
function lista(){
 const A=todos();
 const seg=FIL.map(f=>`<button type="button" data-a="cv-f:${f}" aria-pressed="${CV.f===f}">${t('cv.f.'+f)}${f==='all'?` (${A.length})`:f==='enviado'?` (${A.filter(pend).length})`:''}</button>`).join('');
 return{title:t('n.conv'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.conv')]])+`<section class="hello"><div><h1>${t('n.conv')}</h1><p>${t('cv.sub')}</p></div></section>`+(A.length?`<section class="stats cvs" aria-label="${t('n.conv')}">${[['fa-envelope',A.length,'cv.f.all'],['fa-hourglass-half',A.filter(pend).length,'cv.f.enviado'],['fa-circle-check',A.filter(c=>c.estado==='aceite').length,'cv.f.aceite'],['fa-circle-xmark',A.filter(c=>c.estado==='recusado').length,'cv.f.recusado']].map(x=>`<div class="stat"><span class="ic"><i class="fas ${x[0]}" aria-hidden="true"></i></span><span><b>${x[1]}</b><span>${t(x[2])}</span></span></div>`).join('')}</section>`:'')+(A.length?`<div class="seg" role="group" aria-label="${t('cv.f')}">${seg}</div>`:'')+`<div id="cvRes">${resHtml()}</div>`}}
function navHtml(id){
 let L=sel().V;if(!L.some(c=>c.id===id))L=todos();
 const i=L.findIndex(c=>c.id===id);if(i<0||L.length<2)return'';
 const p=L[i-1],n=L[i+1];
 const b=(c,k,ic,dir)=>c?`<a class="btn btn-l btn-s" href="#/convites/${esc(c.id)}" rel="${dir}">${dir==='prev'?`<i class="fas ${ic}" aria-hidden="true"></i> ${t(k)}`:`${t(k)} <i class="fas ${ic}" aria-hidden="true"></i>`}</a>`
  :`<button class="btn btn-l btn-s" type="button" disabled>${dir==='prev'?`<i class="fas ${ic}" aria-hidden="true"></i> ${t(k)}`:`${t(k)} <i class="fas ${ic}" aria-hidden="true"></i>`}</button>`;
 return `<nav class="cvnav" aria-label="${t('cv.nav')}"><span class="cvnav-n" aria-live="polite">${t('cv.nav.of',{a:i+1,n:L.length})}</span><span class="pg-b">${b(p,'cv.pg.prev','fa-chevron-left','prev')}${b(n,'cv.pg.next','fa-chevron-right','next')}</span></nav>`}
function detalhe(id){
 const nav=[[t('n.dash'),'#/dashboard'],[t('n.conv'),'#/convites']];
 let c=um(id);
 if(!c)return{title:t('n.conv'),html:crumbs([...nav,[t('cv.nf')]])+`<div class="state card"><i class="fas fa-envelope" aria-hidden="true"></i><p>${t('cv.nf')}</p><a class="btn btn-g" href="#/convites">${t('cv.back')}</a></div>`};
 if(c.estado==='enviado')c=mudar(id,x=>{x.estado='visto';x.visto_em=new Date().toISOString()});
 const v=c.vaga,fact=(ic,k,x)=>x?`<li><i class="fas ${ic}" aria-hidden="true"></i><span><b>${t(k)}:</b> ${esc(x)}</span></li>`:'';
 const estado=pend(c)?`<div class="apx"><strong>${t('cv.pend')}</strong><p>${t('cv.pend.p')}</p></div>`
  :c.estado==='aceite'?`<div class="apx"><strong>${t('cv.acc')}</strong><p>${t('cv.acc.p')}${c.respondido_em?' '+esc(t('cv.resp',{d:fmtD(c.respondido_em)})):''}</p></div>`
  :`<div class="apx"><strong>${t('cv.dec')}</strong><p>${t('cv.dec.p')}${c.respondido_em?' '+esc(t('cv.resp',{d:fmtD(c.respondido_em)})):''}</p></div>`;
 const acts=pend(c)?`<button class="btn btn-g" type="button" data-a="cv-yes:${esc(c.id)}"><i class="fas fa-check" aria-hidden="true"></i> ${t('cv.yes')}</button><button class="btn btn-l" type="button" data-a="cv-no:${esc(c.id)}">${t('cv.no')}</button>`
  :c.estado==='aceite'?`<a class="btn btn-g" href="#/oportunidades${MOCK.vagas.some(x=>x.id===v.id)?'/'+esc(v.id):''}">${t('cv.apply')}</a>`:`<a class="btn btn-l" href="#/oportunidades">${t('cv.see')}</a>`;
 return{title:c.assunto,html:crumbs([...nav,[vt(v)]])+`<div class="vtop"><a class="btn btn-l" href="#/convites"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('cv.back')}</a>${navHtml(c.id)}</div>
 <div class="det cd"><article class="card"><header><h1>${esc(c.assunto)}</h1><p class="rs wrap">${esc(t('cv.from',{e:c.empresa}))} · ${esc(t('cv.rec',{d:fmtD(c.criado_em)}))}</p><div class="chips"><span class="tag ${tag(c.estado)}">${t('cv.s.'+(c.estado==='enviado'?'visto':c.estado))}</span></div></header>
  ${estado}<h2>${t('cv.msg')}</h2><p class="wrap" style="white-space:pre-line">${esc(c.mensagem)}</p><p class="rs" style="margin-top:1rem"><i class="fas fa-shield-halved" aria-hidden="true"></i> ${t('cv.info')}</p></article>
 <aside class="card cta" aria-label="${t('cv.vaga')}"><strong>${t('cv.vaga')}</strong><p class="rs wrap">${esc(vt(v))}</p><ul class="meta">${fact('fa-building','cv.emp',c.empresa)}${fact('fa-tag','cv.tipo',[tip(v),v.regime].filter(Boolean).join(' · '))}${fact('fa-location-dot','cv.loc',v.local)}${fact('fa-clock','cv.lim',v.data_limite?fmtD(v.data_limite):'')}${fact('fa-users','cv.vg',String(v.vagas||''))}</ul>${acts}</aside></div>`}}
Views.convites=id=>id?detalhe(id):lista();
const naLista=()=>/^#\/convites\/?$/.test(location.hash);
const repintar=foco=>{if(!naLista())return;$('#main').innerHTML=lista().html;const f=foco&&$(foco);if(f)f.focus({preventScroll:true})};
Actions['cv-f']=(b,f)=>{CV.f=f;repintar(`.seg button[data-a="cv-f:${f}"]`)};
Actions['cv-ver']=(b,id)=>{closeCv();location.hash='#/convites/'+id};
Actions['cv-apply']=(b,id)=>{closeCv();const c=um(id);if(c)location.hash='#/oportunidades'+(MOCK.vagas.some(x=>x.id===c.vaga.id)?'/'+c.vaga.id:'')};
Actions['cv-opp']=()=>{closeCv();location.hash='#/oportunidades'};
Actions['cv-yes-m']=(b,id)=>{closeCv();mudar(id,c=>{c.estado='aceite';c.respondido_em=new Date().toISOString()});repintar('#cvRes .vt a');toast(t('cv.ok.y'))};
Actions['cv-no-m']=(b,id)=>{closeCv();Modal.open({title:t('cv.c.title'),body:`<p>${t('cv.c.q')}</p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cv.c.no')}</button><button class="btn btn-g" type="button" data-a="cv-no-ok-m:${esc(id)}">${t('cv.c.yes')}</button></div>`})};
Actions['cv-no-ok-m']=(b,id)=>{mudar(id,c=>{c.estado='recusado';c.respondido_em=new Date().toISOString()});Modal.close(true);repintar('#cvRes .vt a');toast(t('cv.ok.n'))};
function resp(id,sim){mudar(id,c=>{c.estado=sim?'aceite':'recusado';c.respondido_em=new Date().toISOString()});Modal.close(true);const o=detalhe(id);$('#main').innerHTML=o.html;toast(t(sim?'cv.ok.y':'cv.ok.n'));const b=$('#main .cta .btn');b&&b.focus({preventScroll:true})}
Actions['cv-yes']=(b,id)=>resp(id,true);
Actions['cv-no']=(b,id)=>{Modal.open({title:t('cv.c.title'),body:`<p>${t('cv.c.q')}</p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cv.c.no')}</button><button class="btn btn-g" type="button" data-a="cv-no-ok:${esc(id)}">${t('cv.c.yes')}</button></div>`})};
Actions['cv-no-ok']=(b,id)=>resp(id,false);
/* Gesto de deslizar (telemóvel): esquerda = seguinte, direita = anterior. No detalhe passa de convite; na lista o carrossel desliza sozinho (scroll nativo).
   Só reage a gestos claramente horizontais (≥70px, inclinação máxima 0,6), ignora campos, menus, modais e selecção de texto, e não bloqueia o scroll vertical. */
(()=>{let T=null;
 const modo=()=>/^#\/convites\/[^/]+$/.test(location.hash)?'d':'';
 document.addEventListener('touchstart',e=>{
  if(e.touches.length!==1||!modo()||document.querySelector('.mod-b')||e.target.closest('input,textarea,select,.fx-menu,.fx-dd,[data-noswipe]')){T=null;return}
  const q=e.touches[0];T={x:q.clientX,y:q.clientY,t:Date.now()}},{passive:true});
 document.addEventListener('touchend',e=>{
  if(!T)return;const q=e.changedTouches[0],dx=q.clientX-T.x,dy=q.clientY-T.y,dt=Date.now()-T.t;T=null;
  if(Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.6||dt>700)return;
  const sel=window.getSelection&&String(window.getSelection());if(sel)return;
  const d=dx<0?1:-1,m=modo();
  if(m==='d'){const a=document.querySelector('.cvnav a[rel="'+(d>0?'next':'prev')+'"]');
   if(a){document.documentElement.style.setProperty('--cvdx',(d>0?'28px':'-28px'));location.hash=a.getAttribute('href')}}
 },{passive:true});
})();
})();
