'use strict';
/* Área Oportunidades (tabela vagas): lista, filtros, detalhe e candidatura.
   Depende de dashboard-candidato.js: MOCK/api, t, esc, crumbs, fmtD, fmtM, L, Views, Actions, Modal, toast, invalidate, vAberta. */
Object.assign(D.pt,{
 'op.sub':'Oportunidades de estágio, emprego efectivo, trainee e freelance.','op.search':'Pesquisar por título, empresa ou local','op.f.tipo':'Tipo','op.f.reg':'Regime','op.f.pais':'País','op.f.regiao':'Região','op.f.pickc':'Escolha um país','op.f.allp':'Todos','op.f.sort':'Ordenar',
 'op.f.all':'Todos','op.f.allf':'Todas','op.f.open':'Só abertas','op.f.clear':'Limpar filtros','op.f.toggle':'Filtros','op.sort.new':'Mais recentes','op.sort.dl':'Prazo mais próximo',
 'op.count':'{n} oportunidades','op.count.1':'1 oportunidade','reg.presencial':'Presencial','reg.hibrido':'Híbrido','reg.remoto':'Remoto',
 'op.view':'Ver detalhe','op.applied':'Candidatura enviada','op.closed':'Encerrada','op.dl.until':'Até {d}','op.dl.today':'Termina hoje','op.dl.day':'Falta 1 dia','op.dl.days':'Faltam {n} dias',
 'op.empty':'Ainda não há oportunidades publicadas.','op.nores':'Nenhuma oportunidade corresponde aos filtros.','op.back':'Voltar às oportunidades','op.nf':'Vaga não encontrada.','op.nf.p':'Pode ter sido removida ou o endereço está incorrecto.',
 'op.desc':'Descrição','op.req':'Requisitos','op.loc':'Localização','op.regime':'Regime','op.tipo':'Tipo','op.rem':'Remuneração','op.prazo':'Prazo de candidatura','op.pub':'Publicada em',
 'op.apply':'Candidatar-me','op.apply.h':'Esta vaga pode ser a sua oportunidade!','op.apply.ctx':'Candidate-se agora: a sua candidatura segue directamente para o recrutador e pode acompanhar o estado a qualquer momento em «Candidaturas». Não deixe passar o prazo.','op.applied.p':'Já enviou candidatura a esta vaga.','op.seeapp':'Ver candidatura','op.closed.p':'O prazo de candidatura terminou.',
 'op.open':'Aberta','op.menu':'Opções','op.mn.det':'Ver detalhe','op.mn.apply':'Candidatar-me','op.mn.closed':'Candidaturas encerradas','op.mn.seeapp':'Ver candidatura',
 'ap.title':'Candidatar-me','ap.vaga':'Vaga','ap.msg':'Mensagem de apresentação (opcional)','ap.msg.h':'Diga em poucas palavras porque é a pessoa certa para esta vaga.','ap.err.len':'Escreva pelo menos 20 caracteres ou deixe o campo em branco.',
 'ap.send':'Enviar candidatura','ap.prof':'O que a empresa vai ver','ap.prof.p':'{e} experiência(s) · {f} formação(ões) · {c} competência(s) · {i} idioma(s)','ap.prof.pct':'Perfil {v}% completo','ap.prof.edit':'Rever perfil','ap.prof.empty':'O seu perfil ainda não tem experiência, formação nem competências. Complete-o antes de se candidatar para ter mais hipóteses.','ap.cancel':'Cancelar','ap.sending':'A enviar…','ap.ok':'Candidatura enviada com sucesso.','ap.fail':'Não foi possível enviar a candidatura. Tente novamente.','ap.dup':'Já se candidatou a esta vaga.','ap.closed':'As candidaturas a esta vaga já terminaram.'});
Object.assign(D.en,{
 'op.sub':'Internships, full-time jobs, trainee programmes and freelance work.','op.search':'Search by title, company or place','op.f.tipo':'Type','op.f.reg':'Work mode','op.f.pais':'Country','op.f.regiao':'Region','op.f.pickc':'Choose a country','op.f.allp':'All','op.f.sort':'Sort by',
 'op.f.all':'All','op.f.allf':'All','op.f.open':'Open only','op.f.clear':'Clear filters','op.f.toggle':'Filters','op.sort.new':'Newest','op.sort.dl':'Closest deadline',
 'op.count':'{n} opportunities','op.count.1':'1 opportunity','reg.presencial':'On-site','reg.hibrido':'Hybrid','reg.remoto':'Remote',
 'op.view':'View details','op.applied':'Application sent','op.closed':'Closed','op.dl.until':'Until {d}','op.dl.today':'Ends today','op.dl.day':'1 day left','op.dl.days':'{n} days left',
 'op.empty':'There are no published opportunities yet.','op.nores':'No opportunity matches the filters.','op.back':'Back to opportunities','op.nf':'Job not found.','op.nf.p':'It may have been removed or the address is wrong.',
 'op.desc':'Description','op.req':'Requirements','op.loc':'Location','op.regime':'Work mode','op.tipo':'Type','op.rem':'Salary','op.prazo':'Application deadline','op.pub':'Published on',
 'op.apply':'Apply now','op.apply.h':'This job could be your next opportunity!','op.apply.ctx':'Apply now: your application goes straight to the recruiter and you can track its status at any time under "Applications". Don\'t miss the deadline.','op.applied.p':'You have already applied to this job.','op.seeapp':'View application','op.closed.p':'The application deadline has passed.',
 'op.open':'Open','op.menu':'Options','op.mn.det':'View details','op.mn.apply':'Apply now','op.mn.closed':'Applications closed','op.mn.seeapp':'View application',
 'ap.title':'Apply now','ap.vaga':'Job','ap.msg':'Cover message (optional)','ap.msg.h':'Tell us briefly why you are the right person for this job.','ap.err.len':'Write at least 20 characters or leave the field empty.',
 'ap.send':'Send application','ap.prof':'What the company will see','ap.prof.p':'{e} experience(s) · {f} education record(s) · {c} skill(s) · {i} language(s)','ap.prof.pct':'Profile {v}% complete','ap.prof.edit':'Review profile','ap.prof.empty':'Your profile has no experience, education or skills yet. Complete it before applying to improve your chances.','ap.cancel':'Cancel','ap.sending':'Sending…','ap.ok':'Application sent successfully.','ap.fail':'Could not send the application. Please try again.','ap.dup':'You have already applied to this job.','ap.closed':'Applications for this job have closed.'});

/* estado da lista (mantido ao ir ao detalhe e voltar) */
const OP={q:'',pais:'',prov:'',tipo:'',reg:'',abertas:true,sort:'new',list:[],det:null,tm:0};
const TIPOS=['estagio','emprego_efectivo','trainee','freelance'],REGS=['presencial','hibrido','remoto'];   /* tipos_vaga, regimes_trabalho */
const fmtN=n=>new Intl.NumberFormat(lang==='en'?'en-GB':'pt-PT').format(n);
const opDesc=v=>lang==='en'&&v.descEn?v.descEn:v.desc,opReq=v=>lang==='en'&&v.reqEn?v.reqEn:v.req;
function rem(v){if(!v.visivel||v.min==null)return'';return v.max&&v.max!==v.min?`${fmtN(v.min)} – ${fmtM(v.max,v.moeda)}`:fmtM(v.min,v.moeda)}
function prazo(v){const ms=new Date(v.lim+'T23:59:59')-new Date();if(ms<0)return[t('op.closed'),'no'];const d=Math.ceil(ms/864e5);
 if(d<=1)return[t('op.dl.today'),'warn'];if(d<=8)return[t(d-1===1?'op.dl.day':'op.dl.days',{n:d-1}),'warn'];return[t('op.dl.until',{d:fmtD(v.lim)}),'']}

/* ---------- lista ---------- */
function filtrar(){
 const q=norm(OP.q.trim());
 const r=OP.list.filter(v=>(!OP.pais||v.pais===OP.pais)&&(!OP.tipo||v.tipo===OP.tipo)&&(!OP.reg||v.reg===OP.reg)&&(!OP.prov||v.prov===OP.prov)&&(!OP.abertas||vAberta(v))
  &&(!q||norm([L(v,'t'),v.emp,locL(v),t('tipo.'+v.tipo),t('reg.'+v.reg)].join(' ')).includes(q)));
 return r.sort(OP.sort==='dl'?(a,b)=>a.lim.localeCompare(b.lim):(a,b)=>b.cri.localeCompare(a.cri));
}
/* ---------- menu de três pontos (ver detalhe / candidatar / ver candidatura) ---------- */
function menuHtml(v){
 const ab=vAberta(v);
 const it=(a,i,k,o={})=>`<button class="fx-mi" type="button" role="menuitem" data-a="${a}:${esc(v.id)}"${o.off?' disabled':''}><i class="fas ${i}" aria-hidden="true"></i><span>${t(k)}${o.sub?`<small>${t(o.sub)}</small>`:''}</span></button>`;
 const items=[it('op-ver','fa-eye','op.mn.det'),
  v.candidatura?it('op-vc','fa-file-lines','op.mn.seeapp'):it('op-apply-m','fa-paper-plane','op.mn.apply',{off:!ab,sub:ab?'':'op.mn.closed'})];
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="op-menu:${esc(v.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${t('op.menu')}: ${esc(L(v,'t'))}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.join('')}</div></div>`;
}
const closeOp=focus=>document.querySelectorAll('.fx-menu.on').forEach(m=>{m.classList.remove('on');const k=m.previousElementSibling;k.setAttribute('aria-expanded','false');const c=m.closest('.vc');c&&c.classList.remove('fx-open');if(focus)k.focus()});
Actions['op-menu']=b=>{const m=b.nextElementSibling,on=!m.classList.contains('on');closeOp();
 if(on){m.classList.add('on');b.setAttribute('aria-expanded','true');const c=b.closest('.vc');c&&c.classList.add('fx-open');const f=m.querySelector('button:not([disabled])');f&&f.focus()}};
Actions['op-ver']=(b,id)=>{closeOp();location.hash='#/oportunidades/'+id};
Actions['op-vc']=(b,id)=>{closeOp();const v=OP.list.find(x=>x.id===id);if(v&&v.candidatura)location.hash='#/candidaturas/'+v.candidatura};
Actions['op-apply-m']=(b,id)=>{closeOp();const v=OP.list.find(x=>x.id===id);if(!v||!vAberta(v)||v.candidatura)return;OP.det=v;Actions['op-apply'](b,id)};
document.addEventListener('click',e=>{if(!e.target.closest('.fx-dd'))closeOp()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.querySelector('.fx-menu.on')){e.stopPropagation();closeOp(true);return}
 const m=e.target.closest&&e.target.closest('.fx-menu');
 if(m&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();const it=[...m.querySelectorAll('button:not([disabled])')],i=it.indexOf(document.activeElement);it[(i+(e.key==='ArrowDown'?1:-1)+it.length)%it.length].focus()}
},true);

function card(v){
 const pz=prazo(v),r=rem(v),ab=vAberta(v),cl=v.candidatura?' ap':ab?'':' vx';
 return `<article class="vc${cl}"><div class="vh"><span class="ic"><i class="fas fa-building" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/oportunidades/${v.id}">${esc(L(v,'t'))}</a></h2><div class="rs">${esc(v.emp)}</div></div>${menuHtml(v)}</div>
 <div class="chips">${v.candidatura?`<span class="tag ok">${t('op.applied')}</span>`:`<span class="tag ${ab?'ok':'no'}">${t(ab?'op.open':'op.closed')}</span>`}<span class="tag in">${t('tipo.'+v.tipo)}</span><span class="tag in">${t('reg.'+v.reg)}</span></div>
 <ul class="meta m0"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(locL(v))}</li><li class="${pz[1]}"><i class="fas fa-clock" aria-hidden="true"></i>${esc(pz[0])}</li>${r?`<li><i class="fas fa-coins" aria-hidden="true"></i>${esc(r)}</li>`:''}</ul>
 <p class="vcs"><span><i class="fas fa-calendar" aria-hidden="true"></i>${t('op.pub')} ${fmtD(v.cri)}</span></p>
 <a class="btn btn-l" href="#/oportunidades/${v.id}">${t('op.view')}</a></article>`;
}
window.LRM_OP={card,seed:l=>{OP.list=l.map(v=>({...v,candidatura:v.candidatura||null}))}};
function nFiltros(){return(OP.pais?1:0)+(OP.prov?1:0)+(OP.tipo?1:0)+(OP.reg?1:0)+(OP.abertas?0:1)+(OP.sort!=='new'?1:0)}
function updFiltros(){
 const n=nFiltros(),tg=$('#opTog'),cl=$('#opClr');if(!tg)return;
 tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!OP.q;
}
function fillProv(){
 const s=$('#opProv');if(!s)return;
 /* regiões completas do país (js/paises.js: LERMO_REGIOES), mais qualquer região já usada por uma vaga desse país */
 const F=window.LRM_FRM,rs=[...new Set([...(OP.pais&&F?F.regs(OP.pais):[]),...OP.list.filter(v=>v.pais===OP.pais).map(v=>v.prov)].filter(Boolean))].sort((a,b)=>provL(a).localeCompare(provL(b),lang));
 s.disabled=!OP.pais;
 s.innerHTML=`<option value="">${t(OP.pais?'op.f.allf':'op.f.pickc')}</option>`+opts(rs,OP.prov,provL);
}
function renderRes(){
 const box=$('#opRes');if(!box)return;
 const r=filtrar(),c=$('#opCount');
 c.textContent=t(r.length===1?'op.count.1':'op.count',{n:r.length});
 if(!OP.list.length){box.innerHTML=`<div class="state card"><i class="fas fa-briefcase" aria-hidden="true"></i>${t('op.empty')}</div>`;c.textContent='';return}
 if(!r.length){box.innerHTML=`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('op.nores')}</p><br><button class="btn btn-l" type="button" data-a="op-clear">${t('op.f.clear')}</button></div>`;return}
 box.innerHTML=LRM_CAR.html(r.map(card).join(''),r.length,t('n.op'));LRM_CAR.later();
}
const opts=(arr,sel,lbl)=>arr.map(x=>`<option value="${esc(x)}"${x===sel?' selected':''}>${esc(lbl(x))}</option>`).join('');
async function lista(){
 const F=window.LRM_FRM;await F.loadPaises();OP.list=await api.vagas();
 /* lista completa de países (249, js/paises.js), Moçambique primeiro — igual a Eventos, Formação, Financiamento e Perfil */
 const paises=F.paisesOrd();
 const sel=(k,id,lbl,all,arr,fn)=>`<div class="fld"><label for="${id}">${t(lbl)}</label><select id="${id}" data-f="${k}"><option value="">${t(all)}</option>${opts(arr,OP[k],fn)}</select></div>`;
 return{title:t('n.op'),after:()=>{fillProv();renderRes();updFiltros()},html:
 crumbs([[t('n.dash'),'#/dashboard'],[t('n.op')]])+
 `<div class="ph"><div><h1>${t('n.op')}</h1><p class="rs wrap">${t('op.sub')}</p></div><p class="rs" id="opCount" aria-live="polite"></p></div>
 <form class="flt${nFiltros()?' open':''}" id="opF" role="search" aria-label="${t('n.op')}">
  <div class="fld fq"><label class="sr" for="opQ">${t('op.search')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="opQ" type="search" value="${esc(OP.q)}" placeholder="${t('op.search')}" autocomplete="off" maxlength="80"></div></div>
  <button class="btn btn-l" id="opTog" type="button" data-a="op-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="opSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('op.f.toggle')} <b class="bd" hidden></b></button>
  <div class="fsec" id="opSec">
   ${sel('pais','opPais','op.f.pais','op.f.allp',paises,paisN)}
   <div class="fld"><label for="opProv">${t('op.f.regiao')}</label><select id="opProv" data-f="prov"></select></div>
   ${sel('tipo','opTipo','op.f.tipo','op.f.all',TIPOS,x=>t('tipo.'+x))}
   ${sel('reg','opReg','op.f.reg','op.f.all',REGS,x=>t('reg.'+x))}
   <div class="fld"><label for="opSort">${t('op.f.sort')}</label><select id="opSort" data-f="sort"><option value="new"${OP.sort==='new'?' selected':''}>${t('op.sort.new')}</option><option value="dl"${OP.sort==='dl'?' selected':''}>${t('op.sort.dl')}</option></select></div>
   <label class="chk"><input type="checkbox" id="opAb" data-f="abertas"${OP.abertas?' checked':''}> ${t('op.f.open')}</label>
   <button class="btn btn-l" id="opClr" type="button" data-a="op-clear">${t('op.f.clear')}</button>
  </div>
 </form>
 <div id="opRes" aria-live="polite"></div>`};
}

/* ---------- detalhe ---------- */
function detalheHtml(v){
 const pz=prazo(v),r=rem(v),ab=vAberta(v);
 const cta=v.candidatura
  ?`<span class="tag ok">${t('op.applied')}</span><p class="rs wrap">${t('op.applied.p')}</p><a class="btn btn-g" href="#/candidaturas/${v.candidatura}">${t('op.seeapp')}</a>`
  :ab?`<div class="apx"><strong>${t('op.apply.h')}</strong><p>${t('op.apply.ctx')}</p></div><button class="btn btn-g" type="button" data-a="op-apply:${v.id}"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('op.apply')}</button>`
  :`<p class="rs wrap">${t('op.closed.p')}</p><button class="btn btn-g" type="button" disabled>${t('op.apply')}</button>`;
 const fact=(i,k,val)=>val?`<div><dt><i class="fas ${i}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(val)}</dd></div>`:'';
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.op'),'#/oportunidades'],[L(v,'t')]])+
 `<div class="vtop"><a class="btn btn-l" href="#/oportunidades"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('op.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det"><article class="card"><header><h1>${esc(L(v,'t'))}</h1><p class="rs wrap">${esc(v.emp)}</p>
  <div class="chips"><span class="tag in">${t('tipo.'+v.tipo)}</span><span class="tag">${t('reg.'+v.reg)}</span><span class="tag ${pz[1]==='no'?'no':''}">${esc(pz[0])}</span></div></header>
  <dl class="facts">${fact('fa-location-dot','op.loc',locL(v))}${fact('fa-briefcase','op.tipo',t('tipo.'+v.tipo))}${fact('fa-laptop-house','op.regime',t('reg.'+v.reg))}${fact('fa-coins','op.rem',r)}${fact('fa-clock','op.prazo',fmtD(v.lim))}${fact('fa-calendar','op.pub',fmtD(v.cri))}</dl>
  <h2>${t('op.desc')}</h2><p>${esc(opDesc(v))}</p>
  ${opReq(v)&&opReq(v).length?`<h2>${t('op.req')}</h2><ul class="reqs">${opReq(v).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</article>
 <aside class="card cta" aria-label="${t('op.apply')}">${cta}</aside></div>`;
}
async function detalhe(id){
 const v=await api.vaga(id);OP.det=v;
 if(!v)return{title:t('n.op'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.op'),'#/oportunidades'],[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('op.nf')}</h1><p>${t('op.nf.p')}</p><br><a class="btn btn-g" href="#/oportunidades"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('op.back')}</a></div>`};
 return{title:L(v,'t'),html:detalheHtml(v)};
}
Views.oportunidades=id=>id?detalhe(id):lista();

/* ---------- candidatura (modal) ---------- */
Actions['op-apply']=(b,id)=>{
 const v=OP.det;if(!v||v.id!==id)return;
 const pf=MOCK.perfil,pc=completude(pf),vazio=!pf.experiencias&&!pf.formacoes&&!pf.competencias;
 Modal.open({title:t('ap.title'),body:`<form id="apF" novalidate>
  <p class="rs wrap" style="margin-bottom:1rem"><strong>${t('ap.vaga')}:</strong> ${esc(L(v,'t'))} · ${esc(v.emp)}</p>
  <div class="prf"><h3>${t('ap.prof')}</h3><p>${t('ap.prof.pct',{v:pc.v})} · ${t('ap.prof.p',{e:pf.experiencias,f:pf.formacoes,c:pf.competencias,i:pf.idiomas})}</p>${vazio?`<p class="ferr" style="margin:.3rem 0 0">${t('ap.prof.empty')}</p>`:''}${pc.falta.length?`<p class="rs wrap">${t('perf.h',{x:pc.falta.join(', ')})}</p>`:''}<a href="#/perfil">${t('ap.prof.edit')}</a></div>
  <div class="fld"><label for="cMsg">${t('ap.msg')}</label><textarea id="cMsg" rows="5" maxlength="1000" aria-describedby="cHelp cErr"></textarea>
   <div class="fh"><span id="cHelp">${t('ap.msg.h')}</span><span id="cCnt">0/1000</span></div><p class="ferr" id="cErr" role="alert" hidden>${t('ap.err.len')}</p></div>
  <p class="ferr box" id="apFail" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ap.cancel')}</button><button class="btn btn-g" id="apGo" type="submit"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('ap.send')}</button></div></form>`});
};
async function reabrirDetalhe(id){
 const o=await detalhe(id),m=$('#main');m.innerHTML=o.html;m.focus({preventScroll:true});
}
document.addEventListener('submit',async e=>{
 if(e.target.id==='opF'){e.preventDefault();return}
 if(e.target.id!=='apF')return;
 e.preventDefault();
 const ta=$('#cMsg'),msg=ta.value.trim(),fld=ta.closest('.fld'),btn=$('#apGo'),fail=$('#apFail');
 fail.hidden=true;
 const bad=msg.length>0&&msg.length<20;
 fld.classList.toggle('invalid',bad);ta.setAttribute('aria-invalid',String(bad));$('#cErr').hidden=!bad;
 if(bad){ta.focus();return}
 btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t('ap.sending')}`;
 const id=OP.det.id;
 try{await api.candidatar(id,msg);Modal.close();invalidate();toast(t('ap.ok'));if($('#opRes')){OP.list=await api.vagas();renderRes()}else if($('#opDash')){route()}else await reabrirDetalhe(id)}
 catch(x){fail.textContent=t(x.message==='dup'?'ap.dup':x.message==='closed'?'ap.closed':'ap.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=`<i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('ap.send')}`}
});

/* ---------- filtros ---------- */
document.addEventListener('input',e=>{
 if(e.target.id==='opQ'){OP.q=e.target.value;clearTimeout(OP.tm);OP.tm=setTimeout(()=>{renderRes();updFiltros()},120)}
 else if(e.target.id==='cMsg'){$('#cCnt').textContent=e.target.value.length+'/1000';if(e.target.closest('.fld').classList.contains('invalid')&&(!e.target.value.trim()||e.target.value.trim().length>=20)){e.target.closest('.fld').classList.remove('invalid');e.target.setAttribute('aria-invalid','false');$('#cErr').hidden=true}}
});
document.addEventListener('change',e=>{
 const el=e.target,k=el.dataset&&el.dataset.f;if(!k||!el.closest('#opF'))return;
 OP[k]=el.type==='checkbox'?el.checked:el.value;if(k==='pais'){OP.prov='';fillProv()}renderRes();updFiltros();
});
Actions['op-clear']=()=>{Object.assign(OP,{q:'',pais:'',prov:'',tipo:'',reg:'',abertas:true,sort:'new'});
 const f=$('#opF');if(f){f.reset();$('#opQ').value='';['opPais','opTipo','opReg'].forEach(i=>$('#'+i).value='');fillProv();$('#opSort').value='new';$('#opAb').checked=true}renderRes();updFiltros();if(f)$('#opQ').focus()};
Actions['op-tog']=b=>{const on=!$('#opF').classList.contains('open');$('#opF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
