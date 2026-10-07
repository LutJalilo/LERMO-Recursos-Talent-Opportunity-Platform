'use strict';
/* Perfil da empresa (Fase 11): identidade, sobre, visão e valores, contactos, localização e identificação fiscal.
   Começa VAZIO (sem dados de exemplo); só mostra as secções preenchidas, com «Adicionar» para as restantes.
   Depende de dashboard-empresa.js: MOCK/api, wait, t, esc, crumbs, Views, Actions, Modal, toast, Session, D, lang, route, $, lmLoader.
   Tabela SQL: empresas (v5.8 + v5.10: ano_fundacao, tamanho, redes_sociais). A identificação fiscal fica em empresas.nuit (qualquer país). */
(()=>{
const KEY=()=>'lermo-empresa-perfil:'+(((Session.get()||{}).email)||'demo');
const SECT=[['tecnologia','Tecnologia e TI','Technology and IT'],['financas','Finanças e banca','Finance and banking'],['saude','Saúde','Healthcare'],['educacao','Educação e formação','Education and training'],['agro','Agricultura e agronegócio','Agriculture and agribusiness'],['energia','Energia e recursos naturais','Energy and natural resources'],['construcao','Construção e imobiliário','Construction and real estate'],['comercio','Comércio e retalho','Trade and retail'],['industria','Indústria e manufactura','Industry and manufacturing'],['transportes','Transportes e logística','Transport and logistics'],['turismo','Turismo e hotelaria','Tourism and hospitality'],['telecom','Telecomunicações','Telecommunications'],['media','Media e comunicação','Media and communication'],['consultoria','Consultoria e serviços profissionais','Consulting and professional services'],['ong','ONG e desenvolvimento','NGO and development'],['publico','Administração pública','Public administration'],['outro','Outro','Other']];
const TAM=['1-10','11-50','51-200','201-500','501-1000','1000+'];
const REDES=[['linkedin','fa-linkedin','LinkedIn'],['facebook','fa-facebook','Facebook'],['instagram','fa-instagram','Instagram'],['x','fa-x-twitter','X'],['youtube','fa-youtube','YouTube']];
const SEC={info:{ic:'fa-building',f:['sector','tamanho','ano']},sobre:{ic:'fa-circle-info',f:['descricao']},visao:{ic:'fa-eye',f:['visao','valores']},
 cont:{ic:'fa-address-book',f:['email','telefone','website','redes']},local:{ic:'fa-location-dot',f:['pais','provincia','distrito','endereco']},fiscal:{ic:'fa-file-invoice',f:['idfiscal']}};
const PCT=['logotipo','sector','tamanho','descricao','visao','email','telefone','website','pais','idfiscal'];   /* cada campo vale 10% */

Object.assign(D.pt,{
 'ep.h':'Perfil da empresa','ep.sub':'Estes dados aparecem nas suas vagas e publicações. Preencha apenas o que quiser mostrar.',
 'ep.pct':'Perfil da empresa','ep.pct.n':'{n}%','ep.unv':'Por verificar','ep.ver':'Verificada','ep.ver.h':'O estado de verificação é atribuído pela equipa da plataforma.',
 'ep.logo.add':'Adicionar logótipo','ep.logo.chg':'Alterar logótipo','ep.logo.rm':'Remover logótipo','ep.logo.h':'PNG, JPG ou WebP até 5 MB. Ajustamos o tamanho automaticamente.','ep.logo.rmq':'Remover o logótipo da empresa?','ep.logo.rmd':'Logótipo removido','ep.logo.ok':'Logótipo actualizado',
 'ep.add':'Adicionar','ep.edit':'Editar','ep.more':'Ver mais','ep.close':'Fechar','ep.cancel':'Cancelar','ep.save':'Guardar','ep.saving':'A guardar…','ep.saved':'Alterações guardadas','ep.fail':'Não foi possível guardar. Tente novamente.','ep.na':'Não indicado','ep.sel':'Seleccionar','ep.cm':'Completar o perfil',
 'ep.s.info':'Informações da empresa','ep.s.sobre':'Sobre a empresa','ep.s.visao':'Visão e valores','ep.s.cont':'Contactos','ep.s.local':'Localização','ep.s.fiscal':'Identificação fiscal',
 'ep.a.info':'Informações','ep.a.sobre':'Sobre','ep.a.visao':'Visão e valores','ep.a.cont':'Contactos','ep.a.local':'Localização','ep.a.fiscal':'Identificação fiscal',
 'ep.l.nome':'Nome da empresa','ep.l.sector':'Sector de actividade','ep.l.tam':'Número de colaboradores','ep.l.ano':'Ano de fundação','ep.l.desc':'Descrição','ep.l.visao':'Visão','ep.l.val':'Valores',
 'ep.l.email':'E-mail de contacto','ep.l.tel':'Telefone','ep.l.web':'Website','ep.l.redes':'Redes sociais','ep.l.pais':'País','ep.l.prov':'Província / região','ep.l.dist':'Distrito / cidade','ep.l.end':'Morada','ep.l.nuit':'NUIT','ep.l.fiscal':'Número de identificação fiscal',
 'ep.h.sobre':'Apresente a empresa a quem procura trabalho: o que faz, a quem serve e como trabalha.','ep.h.tel':'Com indicativo, por exemplo +258 84 000 0000.','ep.h.web':'Por exemplo www.suaempresa.com.','ep.h.reg':'Escreva a região, se não existir na lista.','ep.h.nuit':'9 dígitos.','ep.h.fiscal':'Usamos o número só para identificar a empresa. É mostrado parcialmente.','ep.h.fiscal0':'Indique primeiro o país em Localização para ver o nome correcto do documento.',
 'ep.v.req':'Campo obrigatório.','ep.v.email':'Indique um e-mail válido.','ep.v.url':'Indique um endereço válido (https://…).','ep.v.tel':'Indique um telefone válido, com 7 a 20 caracteres.','ep.v.ano':'Indique um ano entre 1800 e {y}.','ep.v.nuit':'O NUIT tem 9 dígitos.','ep.v.fiscal':'Use 3 a 20 letras, números, pontos, hífenes ou barras.','ep.v.file':'Escolha uma imagem PNG, JPG ou WebP.','ep.v.size':'A imagem tem mais de 5 MB.','ep.v.read':'Não foi possível ler a imagem.',
 'ep.e.info':'Sector, dimensão e ano de fundação.','ep.e.sobre':'Conte o que a empresa faz.','ep.e.visao':'Diga para onde vai a empresa e no que acredita.','ep.e.cont':'E-mail, telefone, website e redes sociais.','ep.e.local':'País, região e morada.','ep.e.fiscal':'NUIT ou número fiscal do seu país.',
 'ep.tam.u':'colaboradores'});
Object.assign(D.en,{
 'ep.h':'Company profile','ep.sub':'This information appears on your jobs and publications. Fill in only what you want to show.',
 'ep.pct':'Company profile','ep.pct.n':'{n}%','ep.unv':'Not verified','ep.ver':'Verified','ep.ver.h':'The verification status is set by the platform team.',
 'ep.logo.add':'Add logo','ep.logo.chg':'Change logo','ep.logo.rm':'Remove logo','ep.logo.h':'PNG, JPG or WebP up to 5 MB. We resize it automatically.','ep.logo.rmq':'Remove the company logo?','ep.logo.rmd':'Logo removed','ep.logo.ok':'Logo updated',
 'ep.add':'Add','ep.edit':'Edit','ep.more':'See more','ep.close':'Close','ep.cancel':'Cancel','ep.save':'Save','ep.saving':'Saving…','ep.saved':'Changes saved','ep.fail':'Could not save. Please try again.','ep.na':'Not provided','ep.sel':'Select','ep.cm':'Complete the profile',
 'ep.s.info':'Company information','ep.s.sobre':'About the company','ep.s.visao':'Vision and values','ep.s.cont':'Contacts','ep.s.local':'Location','ep.s.fiscal':'Tax identification',
 'ep.a.info':'Information','ep.a.sobre':'About','ep.a.visao':'Vision and values','ep.a.cont':'Contacts','ep.a.local':'Location','ep.a.fiscal':'Tax identification',
 'ep.l.nome':'Company name','ep.l.sector':'Industry','ep.l.tam':'Number of employees','ep.l.ano':'Year founded','ep.l.desc':'Description','ep.l.visao':'Vision','ep.l.val':'Values',
 'ep.l.email':'Contact email','ep.l.tel':'Phone','ep.l.web':'Website','ep.l.redes':'Social media','ep.l.pais':'Country','ep.l.prov':'Province / region','ep.l.dist':'District / city','ep.l.end':'Address','ep.l.nuit':'NUIT','ep.l.fiscal':'Tax identification number',
 'ep.h.sobre':'Introduce the company to job seekers: what it does, who it serves and how it works.','ep.h.tel':'With country code, for example +258 84 000 0000.','ep.h.web':'For example www.yourcompany.com.','ep.h.reg':'Type the region if it is not in the list.','ep.h.nuit':'9 digits.','ep.h.fiscal':'We only use the number to identify the company. It is shown partially.','ep.h.fiscal0':'Choose the country under Location first to see the correct document name.',
 'ep.v.req':'Required field.','ep.v.email':'Enter a valid email.','ep.v.url':'Enter a valid address (https://…).','ep.v.tel':'Enter a valid phone number, 7 to 20 characters.','ep.v.ano':'Enter a year between 1800 and {y}.','ep.v.nuit':'The NUIT has 9 digits.','ep.v.fiscal':'Use 3 to 20 letters, numbers, dots, hyphens or slashes.','ep.v.file':'Choose a PNG, JPG or WebP image.','ep.v.size':'The image is larger than 5 MB.','ep.v.read':'Could not read the image.',
 'ep.e.info':'Industry, size and year founded.','ep.e.sobre':'Tell what the company does.','ep.e.visao':'Say where the company is heading and what it believes in.','ep.e.cont':'Email, phone, website and social media.','ep.e.local':'Country, region and address.','ep.e.fiscal':'NUIT or your country tax number.',
 'ep.tam.u':'employees'});

/* ---------- dados: MOCK.empresa começa vazio e guarda-se no navegador (substituir por GET/PUT /api/empresa/perfil) ---------- */
try{Object.assign(MOCK.empresa,JSON.parse(localStorage.getItem(KEY()))||{})}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY(),JSON.stringify(MOCK.empresa))}catch(e){}};
const A={get:()=>wait(MOCK.empresa,200),set:p=>wait((()=>{Object.assign(MOCK.empresa,p);persist();return MOCK.empresa})(),400)};
window.LermoEmpresaPct=()=>Math.round(PCT.filter(k=>MOCK.empresa[k]).length/PCT.length*100);   /* usado pelo Dashboard */

/* ---------- utilitários ---------- */
let pReady=null;
const loadPaises=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
const paisN=c=>{try{const n=new Intl.DisplayNames(lang==='en'?'en':'pt-PT',{type:'region'}).of(c);if(n&&n!==c)return n}catch(e){}return((window.LERMO_PAISES||[]).find(p=>p[0]===c)||[])[2]||c};
const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
const regioes=p=>(window.LERMO_REGIOES&&window.LERMO_REGIOES[p]||'').split('|').filter(Boolean);
const flag=c=>c?`<img class="ep-flag" src="https://flagcdn.com/w40/${c.toLowerCase()}.png" srcset="https://flagcdn.com/w80/${c.toLowerCase()}.png 2x" width="24" height="18" alt="" loading="lazy">`:'';
const sectN=k=>{const s=SECT.find(x=>x[0]===k);return s?(lang==='en'?s[2]:s[1]):''};
const ini=n=>String(n||'').split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const nome=()=>(Session.get()||{}).nome_completo||'';
const fiscalL=p=>p==='MZ'?t('ep.l.nuit'):t('ep.l.fiscal');
const mask=s=>'•'.repeat(Math.max(0,s.length-3))+s.slice(-3);
const hrefOk=u=>/^https?:\/\/[^\s]+$/i.test(u||'');
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return u}};
const filled=k=>SEC[k].f.some(f=>f==='redes'?Object.values(MOCK.empresa.redes||{}).some(Boolean):MOCK.empresa[f]);
const clamp=(x,h)=>{const long=x.length>200||x.split('\n').length>3;return long?`<div class="ep-cw"><p class="ep-d ep-cl">${esc(x)}</p><button class="ep-l2" type="button" data-a="ep-more"${h?` data-h="${esc(h)}"`:''} aria-haspopup="dialog">${t('ep.more')}</button></div>`:`<p class="ep-d">${esc(x)}</p>`};
const isLong=x=>!!x&&(x.length>200||x.split('\n').length>3);
const dd=(k,v)=>`<div><dt>${t(k)}</dt><dd>${v?v:`<span class="n0">${t('ep.na')}</span>`}</dd></div>`;

/* ---------- vista ---------- */
function bEdit(k,add){return `<button class="btn btn-l btn-s" type="button" id="ep-b-${k}" data-a="ep-go:${k}"><i class="fas ${add?'fa-plus':'fa-pen'}" aria-hidden="true"></i> ${t(add?'ep.add':'ep.edit')}</button>`}
const card=(k,body,full)=>`<section class="card ep-c${full?' full':''}" id="ep-${k}" aria-labelledby="ep-${k}-h"><div class="ch"><h2 id="ep-${k}-h"><span class="ep-hi" aria-hidden="true"><i class="fas ${SEC[k].ic}"></i></span>${t('ep.s.'+k)}</h2>${bEdit(k)}</div>${body}</section>`;
function secHtml(k,E){
 if(k==='info')return card(k,`<dl class="ep-dl">${dd('ep.l.sector',sectN(E.sector)&&esc(sectN(E.sector)))}${dd('ep.l.tam',E.tamanho&&esc(E.tamanho+' '+t('ep.tam.u')))}${dd('ep.l.ano',E.ano&&esc(E.ano))}</dl>`);
 if(k==='sobre')return card(k,clamp(E.descricao||'',t('ep.s.sobre')),isLong(E.descricao));
 if(k==='visao'){const b=[['ep.l.visao',E.visao],['ep.l.val',E.valores]].filter(x=>x[1]).map(([l,v])=>`<div class="ep-blk"><h3>${t(l)}</h3>${clamp(v,t(l))}</div>`).join('');return card(k,b,isLong(E.visao)||isLong(E.valores))}
 if(k==='cont'){const rs=REDES.filter(r=>hrefOk((E.redes||{})[r[0]])).map(r=>`<li><a href="${esc(E.redes[r[0]])}" target="_blank" rel="noopener noreferrer"><i class="fab ${r[1]}" aria-hidden="true"></i><span>${r[2]}</span></a></li>`).join('');
  return card(k,`<dl class="ep-dl">${dd('ep.l.email',E.email&&`<a href="mailto:${esc(E.email)}">${esc(E.email)}</a>`)}${dd('ep.l.tel',E.telefone&&`<a href="tel:${esc(E.telefone.replace(/[^+\d]/g,''))}">${esc(E.telefone)}</a>`)}${dd('ep.l.web',E.website&&hrefOk(E.website)&&`<a href="${esc(E.website)}" target="_blank" rel="noopener noreferrer">${esc(host(E.website))}</a>`)}</dl>${rs?`<ul class="ep-soc" aria-label="${t('ep.l.redes')}">${rs}</ul>`:''}`)}
 if(k==='local')return card(k,`<dl class="ep-dl">${dd('ep.l.pais',E.pais&&`<span class="ep-fl">${flag(E.pais)}${esc(paisN(E.pais))}</span>`)}${dd('ep.l.prov',E.provincia&&esc(E.provincia))}${dd('ep.l.dist',E.distrito&&esc(E.distrito))}${dd('ep.l.end',E.endereco&&esc(E.endereco))}</dl>`);
 return card(k,`<dl class="ep-dl"><div><dt>${esc(fiscalL(E.pais))}</dt><dd>${E.idfiscal?`<span class="ep-mask">${esc(mask(E.idfiscal))}</span>`:`<span class="n0">${t('ep.na')}</span>`}</dd></div></dl><p class="ep-note">${t('ep.h.fiscal')}</p>`);
}
function perfilHtml(E){
 const n=nome(),pct=window.LermoEmpresaPct(),ver=!!E.verificado,vazias=Object.keys(SEC).filter(k=>!filled(k));
 const meta=[E.sector&&sectN(E.sector),E.tamanho&&E.tamanho+' '+t('ep.tam.u')].filter(Boolean).map(x=>`<span class="tag in">${esc(x)}</span>`).join('');
 const logo=E.logotipo?`<img src="${esc(E.logotipo)}" alt="">`:`<span aria-hidden="true">${esc(ini(n)||'?')}</span>`;
 const head=`<section class="card ep-hd" aria-labelledby="ep-name"><div class="ep-logo">${logo}</div>
  <div class="ep-id"><div class="ep-top"><h1 id="ep-name">${esc(n)}</h1><span class="tag ${ver?'ok':''}"><i class="fas ${ver?'fa-circle-check':'fa-hourglass-half'}" aria-hidden="true"></i> ${t(ver?'ep.ver':'ep.unv')}</span></div>
   <div class="ep-meta">${meta}${E.pais?`<span class="ep-fl">${flag(E.pais)}${esc(paisN(E.pais))}</span>`:''}</div>
   <p class="rs wrap">${t('ep.ver.h')}</p>
   <div class="ep-pct"><div class="pb" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${t('ep.pct')}: ${pct}%"><i style="width:${pct}%"></i></div><b>${t('ep.pct.n',{n:pct})}</b></div></div>
  <div class="ep-act"><button class="btn btn-g btn-s" type="button" id="ep-b-logo" data-a="ep-logo"><i class="fas fa-image" aria-hidden="true"></i> ${t(E.logotipo?'ep.logo.chg':'ep.logo.add')}</button>
   ${E.logotipo?`<button class="btn btn-l btn-s" type="button" data-a="ep-logo-rm"><i class="fas fa-trash" aria-hidden="true"></i> ${t('ep.logo.rm')}</button>`:''}
   <button class="btn btn-l btn-s" type="button" id="ep-b-name" data-a="ep-go:info"><i class="fas fa-pen" aria-hidden="true"></i> ${t('ep.edit')}</button>
   <input id="ep-file" type="file" accept="image/png,image/jpeg,image/webp" hidden></div></section>`;
 const add=vazias.length?`<section class="card ep-addc" aria-labelledby="ep-addh"><div class="ch"><h2 id="ep-addh">${t('ep.cm')}</h2></div><div class="ep-adds">${vazias.map(k=>`<button class="ep-chip" type="button" id="ep-b-${k}" data-a="ep-go:${k}"><i class="fas ${SEC[k].ic}" aria-hidden="true"></i><span><b>${t('ep.a.'+k)}</b><small>${t('ep.e.'+k)}</small></span><i class="fas fa-plus" aria-hidden="true"></i></button>`).join('')}</div></section>`:'';
 const cards=Object.keys(SEC).filter(filled).map(k=>secHtml(k,E)).join('');
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.perfil')]])+`<p class="sr" role="status"></p>`+head+add+(cards?`<div class="ep-g">${cards}</div>`:'');
}
const setAv=()=>{const a=$('#av');if(!a)return;const l=MOCK.empresa.logotipo;if(l){a.innerHTML=`<img src="${esc(l)}" alt="">`;a.classList.add('ph')}else{a.classList.remove('ph');a.textContent=ini(nome())}};
Views.perfil=async()=>{await loadPaises().catch(()=>{});const E=await A.get();return{title:t('n.perfil'),html:perfilHtml(E),after:setAv}};
async function refresh(fid){const o=await Views.perfil();$('#main').innerHTML=o.html;setAv();if(fid){const e=document.getElementById(fid);e&&e.focus()}}

/* ---------- formulários ---------- */
const F=(id,label,ctl,{hint,max,len,req}={})=>`<div class="fld"><label for="${id}">${label}${req?'<span aria-hidden="true"> *</span>':''}</label>${ctl}${hint||max?`<div class="fh"><span>${hint||''}</span>${max?`<span id="${id}C">${len||0}/${max}</span>`:''}</div>`:''}<p class="ferr" id="${id}E" role="alert" hidden></p></div>`;
const inp=(id,v='',{type='text',max,ex=''}={})=>`<input id="${id}" type="${type}" value="${esc(v??'')}"${max?` maxlength="${max}"`:''} autocomplete="off" ${ex}>`;
const txa=(id,v='',max,rows=5)=>`<textarea id="${id}" rows="${rows}" maxlength="${max}" data-max="${max}">${esc(v||'')}</textarea>`;
const selH=(id,opts,val,ex='')=>`<select id="${id}" ${ex}>${opts.map(([v,l])=>`<option value="${esc(v)}"${String(v)===String(val)?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
const foot=()=>`<p class="ferr box" id="epFail" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ep.cancel')}</button><button class="btn btn-g" id="epGo" type="submit"><i class="fas fa-check" aria-hidden="true"></i> ${t('ep.save')}</button></div>`;
const blank=()=>['',t('ep.sel')];
const mk=(id,msg)=>{const el=$('#'+id),w=el.closest('.fld'),e=$('#'+id+'E');w.classList.toggle('invalid',!!msg);el.setAttribute('aria-invalid',String(!!msg));if(e){e.textContent=msg||'';e.hidden=!msg;el.setAttribute('aria-describedby',id+'E')}return msg?el:null};
const val=id=>$('#'+id).value.trim();
const form=(k,inner)=>`<form id="epF-${k}" class="epf" data-k="${k}" novalidate>${inner}${foot()}</form>`;
const okUrl=u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)&&x.hostname.includes('.')&&u.length<=255}catch(e){return false}};
const normUrl=u=>u&&!/^https?:\/\//i.test(u)?'https://'+u:u;
async function guardar(fn,{btn,focus,msg}){
 const fail=$('#epFail'),html=btn.innerHTML;fail.hidden=true;btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t('ep.saving')}`;
 try{await fn();Modal.close(true);await refresh(focus);toast(t(msg||'ep.saved'))}
 catch(e){fail.textContent=t('ep.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=html}
}
const first=l=>{const f=l.filter(Boolean)[0];if(f)f.focus();return !!f};

const OPEN={
 info(){const E=MOCK.empresa;Modal.open({title:t('ep.s.info'),body:form('info',
  F('epNome',t('ep.l.nome'),inp('epNome',nome(),{max:150}),{req:1})+
  F('epSec',t('ep.l.sector'),selH('epSec',[blank(),...SECT.map(s=>[s[0],lang==='en'?s[2]:s[1]])],E.sector))+
  `<div class="epr">${F('epTam',t('ep.l.tam'),selH('epTam',[blank(),...TAM.map(x=>[x,x])],E.tamanho))}${F('epAno',t('ep.l.ano'),inp('epAno',E.ano,{type:'number',ex:`min="1800" max="${new Date().getFullYear()}" inputmode="numeric"`}))}</div>`)})},
 sobre(){Modal.open({title:t('ep.s.sobre'),body:form('sobre',F('epDesc',t('ep.l.desc'),txa('epDesc',MOCK.empresa.descricao,2000,8),{hint:t('ep.h.sobre'),max:2000,len:(MOCK.empresa.descricao||'').length}))})},
 visao(){const E=MOCK.empresa;Modal.open({title:t('ep.s.visao'),body:form('visao',F('epVis',t('ep.l.visao'),txa('epVis',E.visao,1000,4),{max:1000,len:(E.visao||'').length})+F('epVal',t('ep.l.val'),txa('epVal',E.valores,1000,4),{max:1000,len:(E.valores||'').length}))})},
 cont(){const E=MOCK.empresa,r=E.redes||{};Modal.open({title:t('ep.s.cont'),body:form('cont',
  F('epMail',t('ep.l.email'),inp('epMail',E.email,{type:'email',max:255}))+
  `<div class="epr">${F('epTel',t('ep.l.tel'),inp('epTel',E.telefone,{type:'tel',max:20}),{hint:t('ep.h.tel')})}${F('epWeb',t('ep.l.web'),inp('epWeb',E.website,{max:255}),{hint:t('ep.h.web')})}</div>`+
  `<fieldset class="eps"><legend>${t('ep.l.redes')}</legend>${REDES.map(x=>F('epR_'+x[0],x[2],inp('epR_'+x[0],r[x[0]],{max:255,ex:'placeholder="https://"'}))).join('')}</fieldset>`)})},
 local(){const E=MOCK.empresa;Modal.open({title:t('ep.s.local'),body:form('local',
  F('epPais',t('ep.l.pais'),`<div class="ep-sel"><span id="epFlag" aria-hidden="true">${flag(E.pais)}</span>${selH('epPais',[blank(),...paisesOrd().map(c=>[c,paisN(c)])],E.pais)}</div>`)+
  `<div id="epRegW">${regField(E.pais,E.provincia)}</div>`+
  F('epDist',t('ep.l.dist'),inp('epDist',E.distrito,{max:80}))+
  F('epEnd',t('ep.l.end'),txa('epEnd',E.endereco,300,3),{max:300,len:(E.endereco||'').length}))})},
 fiscal(){const E=MOCK.empresa;Modal.open({title:t('ep.s.fiscal'),body:form('fiscal',
  F('epNuit',fiscalL(E.pais),inp('epNuit',E.idfiscal,{max:20,ex:E.pais==='MZ'?'inputmode="numeric"':''}),{hint:t(E.pais==='MZ'?'ep.h.nuit':E.pais?'ep.h.fiscal':'ep.h.fiscal0')}))})}
};
function regField(pais,v){
 const rs=regioes(pais),L=t('ep.l.prov');
 if(!pais)return F('epReg',L,`<select id="epReg" disabled><option value="">${t('ep.sel')}</option></select>`);
 if(!rs.length)return F('epReg',L,inp('epReg',v,{max:80}),{hint:t('ep.h.reg')});
 const l=v&&!rs.includes(v)?[...rs,v]:rs;
 return F('epReg',L,selH('epReg',[blank(),...l.map(x=>[x,x])],v));
}
Actions['ep-go']=(b,x)=>{if(OPEN[x])loadPaises().catch(()=>{}).then(()=>OPEN[x]())};

const SUBMIT={
 info(f){const n=val('epNome'),a=val('epAno'),y=new Date().getFullYear();
  const bad=first([mk('epNome',n?'':t('ep.v.req')),mk('epAno',a&&!(/^\d{4}$/.test(a)&&+a>=1800&&+a<=y)?t('ep.v.ano',{y}):'')]);if(bad)return;
  guardar(async()=>{const ss=Session.get();if(ss){localStorage.setItem(Session.KEY,JSON.stringify({...ss,nome_completo:n}));const w=$('#wn');if(w)w.textContent=n}await A.set({sector:val('epSec'),tamanho:val('epTam'),ano:a})},{btn:$('#epGo'),focus:'ep-b-info'});},
 sobre(f){guardar(()=>A.set({descricao:val('epDesc')}),{btn:$('#epGo'),focus:'ep-b-sobre'})},
 visao(f){guardar(()=>A.set({visao:val('epVis'),valores:val('epVal')}),{btn:$('#epGo'),focus:'ep-b-visao'})},
 cont(f){const m=val('epMail'),tel=val('epTel'),w=normUrl(val('epWeb')),r={};
  const bads=[mk('epMail',m&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)?t('ep.v.email'):''),mk('epTel',tel&&!/^\+?[0-9 ()\-]{7,20}$/.test(tel)?t('ep.v.tel'):''),mk('epWeb',w&&!okUrl(w)?t('ep.v.url'):'')];
  REDES.forEach(x=>{const u=normUrl(val('epR_'+x[0]));bads.push(mk('epR_'+x[0],u&&!okUrl(u)?t('ep.v.url'):''));if(u)r[x[0]]=u});
  if(first(bads))return;
  guardar(()=>A.set({email:m,telefone:tel,website:w,redes:r}),{btn:$('#epGo'),focus:'ep-b-cont'});},
 local(f){guardar(()=>A.set({pais:val('epPais'),provincia:val('epReg'),distrito:val('epDist'),endereco:val('epEnd')}),{btn:$('#epGo'),focus:'ep-b-local'})},
 fiscal(f){const v=val('epNuit'),mz=MOCK.empresa.pais==='MZ';
  if(first([mk('epNuit',!v?'':mz?(/^\d{9}$/.test(v)?'':t('ep.v.nuit')):(/^[A-Za-z0-9 ./-]{3,20}$/.test(v)?'':t('ep.v.fiscal')))]))return;
  guardar(()=>A.set({idfiscal:v}),{btn:$('#epGo'),focus:'ep-b-fiscal'});}
};
document.addEventListener('submit',e=>{const f=e.target.closest('form.epf');if(!f)return;e.preventDefault();SUBMIT[f.dataset.k]&&SUBMIT[f.dataset.k](f)});
document.addEventListener('input',e=>{const el=e.target;if(el.matches&&el.matches('textarea[data-max]')){const c=$('#'+el.id+'C');if(c)c.textContent=el.value.length+'/'+el.dataset.max}});
document.addEventListener('change',e=>{if(e.target.id==='epPais'){const c=e.target.value;$('#epFlag').innerHTML=flag(c);$('#epRegW').innerHTML=regField(c,'')}});

/* ---------- leitura de texto longo ---------- */
Actions['ep-more']=b=>{const q=b.previousElementSibling,h=b.dataset.h||t('ep.s.sobre');
 Modal.open({title:h,body:`<div class="ep-mx">${esc(q.textContent)}</div><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ep.close')}</button></div>`})};

/* ---------- logótipo: valida, redimensiona (máx. 320 px) e guarda ---------- */
Actions['ep-logo']=()=>{const f=$('#ep-file');f.value='';f.click()};
document.addEventListener('change',async e=>{
 if(e.target.id!=='ep-file')return;const f=e.target.files[0];if(!f)return;
 if(!/^image\/(png|jpeg|webp)$/.test(f.type))return toast(t('ep.v.file'));
 if(f.size>5*1024*1024)return toast(t('ep.v.size'));
 const fim=lmLoader(t('ep.saving'));
 try{
  const url=URL.createObjectURL(f),img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=url});URL.revokeObjectURL(url);
  const s=Math.min(1,320/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  await A.set({logotipo:c.toDataURL('image/png')});await refresh('ep-b-logo');toast(t('ep.logo.ok'));
 }catch(err){toast(t('ep.v.read'))}finally{fim()}
});
Actions['ep-logo-rm']=()=>Modal.open({title:t('ep.logo.rm'),body:`<p>${t('ep.logo.rmq')}</p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('ep.cancel')}</button><button class="btn btn-g" type="button" data-a="ep-logo-ok"><i class="fas fa-trash" aria-hidden="true"></i> ${t('ep.logo.rm')}</button></div>`});
Actions['ep-logo-ok']=async b=>{b.disabled=true;await A.set({logotipo:null});Modal.close(true);await refresh('ep-b-logo');toast(t('ep.logo.rmd'))};

/* o avatar do cabeçalho mostra o logótipo em todas as áreas */
document.addEventListener('DOMContentLoaded',()=>setTimeout(setAv,150));
addEventListener('hashchange',()=>setTimeout(setAv,400));
})();
