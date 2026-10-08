'use strict';
/* Candidaturas da empresa: lista com filtros (vaga, estado, pesquisa), ficha do candidato e mudança de estado com observação e histórico.
   Depende de dashboard-empresa.js (MOCK, t, esc, crumbs, Views, Actions, Modal, toast, D, lang, wait, $) e de empresa-vagas.js (opcional).
   Tabelas SQL: candidaturas, historico_estados_candidatura, perfis_candidatos, candidato_documentos.
   Cada candidatura no mock: {id,vaga_id,estado,em,nome,email,local,curso,match,historico:[{estado,em,nota}]} (os dados do candidato vêm de perfis_candidatos). */
(()=>{
const EST=['candidatou_se','em_analise','entrevista','contratado','rejeitado'];
const ICO={candidatou_se:'fa-inbox',em_analise:'fa-magnifying-glass',entrevista:'fa-comments',contratado:'fa-handshake',rejeitado:'fa-circle-xmark'};
Object.assign(D.pt,{'cd.h':'Candidaturas','cd.col.cand':'Candidato','cd.col.perfil':'Perfil','cd.col.match':'Compat.','cd.col.data':'Data','cd.col.estado':'Estado','cd.p':'Acompanhe quem se candidatou a cada vaga e faça avançar o processo.','cd.n1':'1 candidatura','cd.nn':'{n} candidaturas',
 'cd.gv1':'{n} vaga disponível','cd.gvn':'{n} vagas disponíveis','cd.in':'Dentro das vagas','cd.sela':'Selecionar todos ({n})','cd.selp':'Selecionar esta página','cd.mvh':'Mover para','cd.cut':'Abaixo do limite de vagas · não passa','cd.out':'Não passa','cd.rk':'Posição {n} por compatibilidade','cd.k.tot':'Total','cd.k.new':'Por analisar','cd.k.int':'Em entrevista','cd.k.hire':'Contratados','cd.f.all':'Todas','cd.vaga.all':'Todas as vagas','cd.q':'Pesquisar candidatos…','cd.sort':'Ordenar',
 'cd.s.rec':'Mais recentes','cd.s.match':'Maior compatibilidade','cd.s.nome':'Nome (A–Z)','cd.m':'Acções','cd.ver':'Ver ficha','cd.mv':'Marcar como {e}','cd.match':'Compat. {n}%','cd.em':'Candidatou-se a {d}',
 'cd.none':'Ainda não recebeu candidaturas.','cd.none.p':'Quando alguém se candidatar a uma das suas vagas, aparece aqui.','cd.nores':'Nenhum candidato corresponde aos filtros.','cd.vagas':'Ver vagas',
 'cd.moved':'Candidatura movida para «{e}».','cd.saved':'Estado actualizado.','cd.ct':'Contacto','cd.hist':'Histórico','cd.novo':'Novo estado','cd.nota':'Observação (opcional)','cd.save':'Guardar estado','cd.close':'Fechar','cd.vaga':'Vaga','cd.cand':'Candidatura','cd.sem':'Sem observação.','cd.back':'Voltar às vagas','cd.fv':'Vaga:','cd.clr':'Limpar filtro'});
Object.assign(D.en,{'cd.h':'Applications','cd.col.cand':'Candidate','cd.col.perfil':'Profile','cd.col.match':'Match','cd.col.data':'Date','cd.col.estado':'Status','cd.p':'See who applied to each job and move the process forward.','cd.n1':'1 application','cd.nn':'{n} applications',
 'cd.gv1':'{n} opening','cd.gvn':'{n} openings','cd.in':'Within openings','cd.sela':'Select all ({n})','cd.selp':'Select this page','cd.mvh':'Move to','cd.cut':'Below the opening limit · not selected','cd.out':'Not selected','cd.rk':'Rank {n} by match','cd.k.tot':'Total','cd.k.new':'To review','cd.k.int':'In interview','cd.k.hire':'Hired','cd.f.all':'All','cd.vaga.all':'All jobs','cd.q':'Search candidates…','cd.sort':'Sort',
 'cd.s.rec':'Most recent','cd.s.match':'Best match','cd.s.nome':'Name (A–Z)','cd.m':'Actions','cd.ver':'View profile','cd.mv':'Mark as {e}','cd.match':'Match {n}%','cd.em':'Applied on {d}',
 'cd.none':'You have not received applications yet.','cd.none.p':'When someone applies to one of your jobs, they appear here.','cd.nores':'No candidate matches the filters.','cd.vagas':'View jobs',
 'cd.moved':'Application moved to “{e}”.','cd.saved':'Status updated.','cd.ct':'Contact','cd.hist':'History','cd.novo':'New status','cd.nota':'Note (optional)','cd.save':'Save status','cd.close':'Close','cd.vaga':'Job','cd.cand':'Application','cd.sem':'No note.','cd.back':'Back to jobs','cd.fv':'Job:','cd.clr':'Clear filter'});

/* Dados de demonstração dos candidatos (em produção: perfis_candidatos). Atribuídos por ordem às candidaturas que ainda não os têm. */
const P=[['Ana Machava','Maputo','Contabilidade e Auditoria',88],['Carlos Mondlane','Matola','Gestão de Empresas',74],['Beatriz Sitoe','Maputo','Economia',91],['Délcio Cumbe','Beira','Gestão de RH',67],['Elisa Nhaca','Maputo','Psicologia',82],['Fernando Tembe','Nampula','Design Gráfico',79],['Graça Muianga','Matola','Eng. Informática',93],['Hélder Chivambo','Maputo','Marketing',71],['Isabel Langa','Xai-Xai','Administração Pública',64],['João Bila','Maputo','Eng. Informática',86],['Kátia Guambe','Quelimane','Gestão Comercial',77],['Lúcio Macamo','Maputo','Estatística',89],['Maria Zimba','Tete','Ciências da Computação',72],['Nelson Cossa','Lisboa','Matemática Aplicada',84],['Olívia Mabunda','Cidade do Cabo','Tradução e Interpretação',95],['Paulo Uamusse','Maputo','Línguas e Literatura',58]];
const ini=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const slug=n=>n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'');
function pessoa(c){
 if(!c.nome){const n=parseInt(String(c.id).replace(/\D/g,''),10)||0,p=P[n%P.length];
  Object.assign(c,{nome:p[0],local:p[1],curso:p[2],match:p[3],email:slug(p[0])+'@exemplo.co.mz'})}
 if(!Array.isArray(c.historico))c.historico=[{estado:c.estado==='candidatou_se'?'candidatou_se':'candidatou_se',em:c.em,nota:''}].concat(c.estado==='candidatou_se'?[]:[{estado:c.estado,em:c.em,nota:''}]);
 return c}
const lista=()=>(MOCK.candidaturas||[]).map(pessoa);
const vaga=id=>(MOCK.vagas||[]).find(v=>v.vaga_id===id)||{};
const vt=id=>{const v=vaga(id);return lang==='en'&&v.titulo_en?v.titulo_en:(v.titulo||'—')};
const fD=d=>{try{return new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(String(d).slice(0,10)+'T00:00:00'))}catch(e){return d}};
const hoje=()=>new Date().toISOString().slice(0,10);
const S={f:'todas',q:'',v:'',sel:new Set(),pg:0};
/* Vagas disponíveis (vagas.vagas_disponiveis) e classificação: quem tem maior compatibilidade fica primeiro; só os N primeiros passam, os restantes não. */
const nVagas=id=>Math.max(1,+vaga(id).vagas_disponiveis||1);
function ranking(){const g={},m={};lista().forEach(c=>(g[c.vaga_id]=g[c.vaga_id]||[]).push(c));Object.values(g).forEach(a=>a.sort((x,y)=>y.match-x.match||String(x.em).localeCompare(String(y.em))).forEach((c,i)=>m[c.id]=i+1));return m}
const sel=()=>{const R=ranking();return lista().filter(c=>R[c.id]<=nVagas(c.vaga_id))};
const tag=e=>e==='contratado'?'ok':e==='rejeitado'?'no':'in';

/* Paginação: 3 itens por página com Anterior/Próximo; os cartões nunca crescem além de 3 itens. */
const PGS=3;let PL={};
Object.assign(D.pt,{'pg.prev':'Anterior','pg.next':'Próximo','pg.of':'{a}–{b} de {n}','pg.nav':'Paginação'});
Object.assign(D.en,{'pg.prev':'Previous','pg.next':'Next','pg.of':'{a}–{b} of {n}','pg.nav':'Pagination'});
const PGC=4; /* candidaturas: 4 linhas por página (tabela) */
function pager(n,p,act,cls,sz){sz=sz||PGS;const pg=Math.ceil(n/sz),a=p*sz+1,b=Math.min(n,(p+1)*sz);
 return `<nav class="pg${cls||''}" aria-label="${t('pg.nav')}"><span class="pg-n" aria-live="polite">${t('pg.of',{a,b,n})}</span><span class="pg-b"><button class="btn btn-l btn-s" type="button" data-a="${act}-1"${p<=0?' disabled':''}><i class="fas fa-chevron-left" aria-hidden="true"></i> ${t('pg.prev')}</button><button class="btn btn-l btn-s" type="button" data-a="${act}1"${p>=pg-1?' disabled':''}>${t('pg.next')} <i class="fas fa-chevron-right" aria-hidden="true"></i></button></span></nav>`}
function plIn(k){const o=PL[k],n=o.items.length;o.p=Math.max(0,Math.min(o.p,Math.ceil(n/PGS)-1));const a=o.p*PGS;
 return `<ul class="${o.cls}">${o.items.slice(a,a+PGS).map(o.fn).join('')}</ul>`+(n>PGS?pager(n,o.p,'cp-pg:'+k+'|',' in'):'')}
function pl(key,cls,items,fn){PL[key]={cls,items,fn,p:0};return `<div id="pl-${key}">${plIn(key)}</div>`}
Actions['cp-pg']=(b,x)=>{const [k,d]=x.split('|'),o=PL[k];if(!o)return;o.p+=+d;const w=$('#pl-'+k);w.innerHTML=plIn(k);const f=w.querySelector(`.pg button[data-a$="|${d}"]:not([disabled])`)||w.querySelector('.pg button:not([disabled])');if(f)f.focus()};
Actions['cd-pg']=(b,x)=>{S.pg+=+x;paint();const f=$(`#cdL .pg button[data-a="cd-pg:${x}"]:not([disabled])`)||$('#cdL .pg button:not([disabled])');if(f)f.focus()};

function visiveis(){
 const q=(window.norm?norm:x=>String(x).toLowerCase())(S.q);
 return sel().filter(c=>(!S.v||c.vaga_id===S.v)&&(S.f==='todas'||c.estado===S.f)&&(!q||(window.norm?norm:x=>String(x).toLowerCase())([c.nome,c.curso,c.local,vt(c.vaga_id)].join(' ')).includes(q)))
  .sort((a,b)=>{const R=ranking(),vi=id=>(MOCK.vagas||[]).findIndex(v=>v.vaga_id===id);return vi(a.vaga_id)-vi(b.vaga_id)||R[a.id]-R[b.id]});
}
function menu(c){const i='cm-'+c.id,b=(a,ic,txt)=>`<button class="mi" type="button" role="menuitem" data-a="${a}:${c.id}"><i class="fas ${ic}" aria-hidden="true"></i><span>${txt}</span></button>`;
 return `<div class="dd"><button class="ib" type="button" data-a="menu:${i}" aria-haspopup="true" aria-expanded="false" aria-label="${t('cd.m')}: ${esc(c.nome)}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="menu vg-m" id="${i}" role="menu">`+
  b('cd-ver','fa-id-card',t('cd.ver'))+b('cd-msg','fa-envelope',t('ms.nova'))+b('cd-est','fa-pen-to-square',t('cd.est'))+`<h3>${t('cd.mvh')}</h3>`+EST.filter(e=>e!==c.estado).map(e=>b('cd-to-'+e,ICO[e],t('e.'+e))).join('')+`</div></div>`}
function row(c,r,ok){
 const nova=!c.visto&&c.estado==='candidatou_se',em=contacto(c).email||t('cp.privE'),nv=c.match>=85?'hi':c.match>=70?'mid':'lo';
 return `<tr class="cdt-r e-${c.estado}"><td class="cdt-ck"><input type="checkbox" class="cd-rk" data-a="cd-sel:${c.id}" aria-label="${t('cd.selr')}: ${esc(c.nome)}"${S.sel.has(c.id)?' checked':''}></td>
 <td class="cdt-n"><span class="cdc-n r${r<4?r:0}" title="${t('cd.rk',{n:r})}" aria-label="${t('cd.rk',{n:r})}">${r}</span></td>
 <td class="cdt-c"><div class="cdt-cw"><span class="vgc-ic cd-av" aria-hidden="true">${esc(ini(c.nome))}</span><div class="cdc-id"><a href="#/candidaturas/perfil/${esc(c.id)}" title="${esc(em)}">${esc(c.nome)}${nova?`<span class="cd-dot" title="${t('cp.new')}"><span class="sr">${t('cp.new')}</span></span>`:''}</a><small>${esc(c.curso)} · ${esc(c.local)}</small></div></div></td>
 <td class="cdt-v" data-t="${esc(vt(c.vaga_id))}" tabindex="0"><span class="cdt-vp"><i class="fas fa-briefcase" aria-hidden="true"></i><span class="cdt-vt">${esc(vt(c.vaga_id))}</span></span></td>
 <td class="cdt-m"><span class="cd-m ${nv}"><i style="width:${c.match}%"></i></span><b>${c.match}%</b></td>
 <td class="cdt-s"><span class="tag ${tag(c.estado)}"><i class="fas ${ICO[c.estado]}" aria-hidden="true"></i> ${t('e.'+c.estado)}</span></td>
 <td class="cd-ac">${menu(c)}</td></tr>`}
function menuAll(n){const b=(a,ic,txt)=>`<button class="mi" type="button" role="menuitem" data-a="${a}"><i class="fas ${ic}" aria-hidden="true"></i><span>${txt}</span></button>`;
 return `<div class="dd"><button class="ib" type="button" data-a="menu:cm-all" aria-haspopup="true" aria-expanded="false" aria-label="${t('cd.m')}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="menu vg-m" id="cm-all" role="menu">`+b('cd-selall','fa-check-double',t('cd.sela',{n}))+b('cd-selpg','fa-square-check',t('cd.selp'))+b('cd-bulk-clr','fa-xmark',t('cd.clr2'))+`</div></div>`}
function seg(){const all=sel().filter(c=>!S.v||c.vaga_id===S.v),n=k=>k==='todas'?all.length:all.filter(c=>c.estado===k).length;
 return ['todas',...EST].map(k=>`<button type="button" data-a="cd-f:${k}" aria-pressed="${S.f===k}">${k==='todas'?t('cd.f.all'):t('e.'+k)} (${n(k)})</button>`).join('')}
function grid(){const L=visiveis(),n=L.length,R=ranking();S.pg=Math.max(0,Math.min(S.pg,Math.ceil(n/PGC)-1));const P=L.slice(S.pg*PGC,S.pg*PGC+PGC);
 const h=P.map(c=>row(c,R[c.id],true)).join('');
 const head=`<thead><tr><th class="cdt-ck"></th><th class="cdt-n" title="${t('cd.rk',{n:'#'})}">#</th><th>${t('cd.col.cand')}</th><th class="cdt-v">${t('cd.vaga')}</th><th>${t('cd.col.match')}</th><th>${t('cd.col.estado')}</th><th class="cd-ac">${menuAll(n)}</th></tr></thead>`;
 return n?`<div class="cdl" id="cdL"><div class="cdt-w"><table class="cdt"><caption class="sr">${t('cd.h')}</caption>${head}<tbody>${h}</tbody></table></div>${pager(n,S.pg,'cd-pg:','',PGC)}</div>`:`<div class="state card" id="cdL"><i class="fas fa-user-slash" aria-hidden="true"></i><p>${t('cd.nores')}</p></div>`}
function kpis(){const a=sel().filter(c=>!S.v||c.vaga_id===S.v),n=e=>a.filter(c=>c.estado===e).length;
 return `<div class="stats" id="cdK">${[['fa-file-signature','cd.k.tot',a.length],['fa-inbox','cd.k.new',n('candidatou_se')],['fa-comments','cd.k.int',n('entrevista')],['fa-handshake','cd.k.hire',n('contratado')]].map(([i,l,v])=>`<div class="stat"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><div><b>${v}</b><span>${t(l)}</span></div></div>`).join('')}</div>`}
function paint(){const g=$('#cdL'),s=$('#cdSeg'),k=$('#cdK');if(g)g.outerHTML=grid();if(s)s.innerHTML=seg();if(k)k.outerHTML=kpis();prune();const q=$('#cdP');if(q){const n=sel().length;q.textContent=n?t(n===1?'cd.n1':'cd.nn',{n}):t('cd.none.p')}}
function pagina(){
 const all=sel(),vs=(MOCK.vagas||[]).filter(v=>all.some(c=>c.vaga_id===v.vaga_id)||v.vaga_id===S.v);
 const body=!all.length?`<div class="state card"><i class="fas fa-file-signature" aria-hidden="true"></i><strong>${t('cd.none')}</strong><p>${t('cd.none.p')}</p><a class="btn btn-g" href="#/vagas">${t('cd.vagas')}</a></div>`
 :`${kpis()}<div class="vg-bar2"><div class="seg" role="group" id="cdSeg">${seg()}</div><div class="vg-ctl"><select id="cdV" aria-label="${t('cd.vaga')}"><option value="">${t('cd.vaga.all')}</option>${vs.map(v=>`<option value="${esc(v.vaga_id)}"${v.vaga_id===S.v?' selected':''}>${esc(vt(v.vaga_id))}</option>`).join('')}</select><input id="cdQ" class="vg-q2" type="search" value="${esc(S.q)}" placeholder="${t('cd.q')}" aria-label="${t('cd.q')}"></div></div>${bar()}${grid()}`;
 return `<h1 class="sr">${t('cd.h')}</h1>`+crumbs([[t('n.dash'),'#/dashboard'],[t('n.cand')]])+`<section class="hello vg-hello"><div><h1>${t('n.cand')}</h1><p id="cdP">${all.length?t(all.length===1?'cd.n1':'cd.nn',{n:all.length}):t('cd.none.p')}</p></div></section>`+body}
Views.candidaturas=async(id,sub)=>{await wait(0,150);if(id==='perfil')return paginaPerfil(sub);S.v=id&&vaga(id).vaga_id?id:'';S.f='todas';S.q='';S.sel.clear();S.pg=0;return{title:t('n.cand'),html:pagina()}};

/* ---------- ficha do candidato ---------- */
const cand=id=>lista().find(c=>c.id===id);
function ficha(c){
 const sel=EST.map(e=>`<option value="${e}"${e===c.estado?' selected':''}>${t('e.'+e)}</option>`).join('');
 const hist=pl('mh','cd-hist',[...c.historico].reverse(),h=>`<li><i class="fas ${ICO[h.estado]||'fa-circle'}" aria-hidden="true"></i><div><b>${t('e.'+h.estado)}</b> · <small>${fD(h.em)}</small><p>${h.nota?esc(h.nota):'<em>'+t('cd.sem')+'</em>'}</p></div></li>`);
 return `<div class="cd-fh"><span class="vgc-ic cd-av cd-lg" aria-hidden="true">${esc(ini(c.nome))}</span><div><h3>${esc(c.nome)}</h3><p>${esc(c.curso)} · ${esc(c.local)}</p><div class="vg-tags"><span class="tag ${tag(c.estado)}">${t('e.'+c.estado)}</span><span class="tag in">${t('cd.match',{n:c.match})}</span></div></div></div>
 <ul class="vgc-l cd-fl"><li><i class="fas fa-briefcase" aria-hidden="true"></i><span><b>${t('cd.vaga')}:</b> ${esc(vt(c.vaga_id))}</span></li><li><i class="fas fa-clock" aria-hidden="true"></i><span><b>${t('cd.cand')}:</b> ${fD(c.em)}</span></li><li><i class="fas fa-envelope" aria-hidden="true"></i><span><b>${t('cd.ct')}:</b> ${esc(contacto(c).email||t('cp.privE'))}</span></li></ul>
 <h4 class="cd-h4">${t('cd.novo')}</h4><div class="fld"><select id="cdE" aria-label="${t('cd.novo')}">${sel}</select></div>
 <div class="fld" style="margin-top:.7rem"><label for="cdN">${t('cd.nota')}</label><textarea id="cdN" rows="3" maxlength="500"></textarea></div>
 <label class="ms-ck"><input type="checkbox" id="cdNot"> <span>${t('ms.not')}<small>${t('ms.notd')}</small></span></label>
 <h4 class="cd-h4">${t('cd.hist')}</h4>${hist}
 <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cd.close')}</button><button class="btn btn-g" type="button" data-a="cd-save:${c.id}">${t('cd.save')}</button></div>`}
function mover(c,e,nota){if(!c||c.estado===e&&!nota)return false;const mudou=c.estado!==e;c.estado=e;c.historico.push({estado:e,em:hoje(),nota:nota||''});return mudou}
function refresh(){if(/^#\/candidaturas/.test(location.hash)&&$('#cdL'))paint();else dispatchEvent(new HashChangeEvent('hashchange'))}
Actions['cd-ver']=(b,x)=>{location.hash='#/candidaturas/perfil/'+x};
Actions['cd-est']=(b,x)=>{const c=cand(x);if(c)Modal.open({title:c.nome,body:ficha(c)})};
EST.forEach(e=>{Actions['cd-to-'+e]=(b,x)=>{const c=cand(x);if(c&&mover(c,e,'')){refresh();toast(t('cd.moved',{e:t('e.'+e)}))}}});
Actions['cd-save']=(b,x)=>{const c=cand(x);if(!c)return;const e=$('#cdE').value,n=$('#cdN').value.trim();if(e===c.estado&&!n){Modal.close();return}
 const nt=$('#cdNot')&&$('#cdNot').checked,mud=mover(c,e,n);Modal.close(true);refresh();
 if(mud&&nt&&e==='entrevista'){setTimeout(()=>abrirMsg(c,'entrevista','custom'),450);toast(t('cd.saved'));return}
 if(mud&&nt){const x=tpl(e,c);enviarMsg(c,x.s,x.b,'auto',e);toast(t('ms.sentm',{e:t('e.'+e)}))}else toast(t('cd.saved'))};
Actions['cd-f']=(b,x)=>{S.f=x;S.pg=0;paint()};
document.addEventListener('input',e=>{if(e.target.id==='cdQ'){S.q=e.target.value.trim();S.pg=0;paint()}});
document.addEventListener('change',e=>{if(e.target.id==='cdV'){S.v=e.target.value;S.pg=0;paint()}});

/* ======================================================================
   PERFIL COMPLETO DO CANDIDATO — página #/candidaturas/perfil/<candidatura_id>
   Em produção: GET /api/empresa/candidaturas/{id} devolve a candidatura com o perfil em c.pf:
   {resumo_pessoal,foto_url,telefone,mostrar_email,mostrar_telefone,disponivel_para_mudanca,disponivel_para_remoto,idioma_principal_id,
    mensagem (candidaturas.mensagem),cv_texto,experiencias[{empresa,cargo,descricao,inicio,fim,actual}],
    formacoes[{instituicao,curso,grau,inicio,fim,concluido}],competencias[{id|nome,nivel,anos}],idiomas[{id,nivel}],
    documentos[{id,tipo,nome_ficheiro,tipo_mime,tamanho_bytes,criado_em,url}]}
   Tabelas: perfis_candidatos, experiencia_profissional, formacao_academica, candidato_competencias, candidato_idiomas,
   candidato_documentos, preferencias_privacidade. Não se mostram BI nem data de nascimento (não são precisos para recrutar).
   ====================================================================== */
Object.assign(D.pt,{'cp.nf':'Candidatura não encontrada.','cp.back':'Voltar às candidaturas','cp.prev':'Candidato anterior','cp.next':'Candidato seguinte','cp.of':'{i} de {n} nesta vaga',
 'cp.sem':'Sem ficheiro real: o candidato anexa o ficheiro e ele abre aqui.','cp.cv':'Ver CV','cp.dl':'Descarregar CV','cp.open':'Abrir','cp.dl1':'Descarregar','cp.email':'Enviar email','cp.call':'Ligar','cp.est':'Alterar estado',
 'cp.msg':'Mensagem de candidatura','cp.res':'Resumo','cp.exp':'Experiência profissional','cp.form':'Formação académica','cp.doc':'Documentos','cp.sk':'Competências','cp.idi':'Idiomas','cp.ct':'Contactos','cp.app':'Candidatura','cp.dados':'Disponibilidade',
 'cp.now':'Actual','cp.conc':'Concluído','cp.curso':'A decorrer','cp.none.exp':'Sem experiência profissional registada.','cp.none.form':'Sem formação registada.','cp.none.doc':'Nenhum documento anexado.','cp.none.sk':'Sem competências registadas.','cp.none.res':'O candidato ainda não escreveu um resumo.',
 'cp.req':'Competências exigidas pela vaga: {a} de {b}','cp.miss':'Em falta','cp.have':'Tem','cp.mudanca':'Disponível para mudança','cp.remoto':'Disponível para trabalho remoto','cp.sim':'Sim','cp.nao':'Não','cp.priv':'O candidato não partilha este contacto.','cp.privE':'Email não partilhado','cp.anos':'{n} ano(s)','cp.demo':'Ficheiro de demonstração (sem anexo real).','cp.cvtxt':'Texto extraído do CV','cp.cvno':'Sem texto de CV disponível.','cp.mv':'Mover candidatura','cp.principal':'Principal','cp.new':'Nova',
 'cp.nv.Básico':'Básico','cp.nv.Intermediário':'Intermédio','cp.nv.Avançado':'Avançado','cp.nv.Fluente':'Fluente','cp.nv.Nativo':'Nativo','cp.g.Licenciatura':'Licenciatura','cp.g.Mestrado':'Mestrado','cp.g.Técnico':'Técnico','cp.g.Doutoramento':'Doutoramento','cp.g.Outro':'Outro','cp.d.CV':'Currículo','cp.d.Certificado':'Certificado','cp.d.Bilhete de Identidade':'Bilhete de Identidade','cp.d.Carta de motivação':'Carta de motivação','cp.d.Referência':'Referência','cp.d.Outro':'Outro','cd.ver':'Ver perfil completo','cd.est':'Alterar estado'});
Object.assign(D.en,{'cp.nf':'Application not found.','cp.back':'Back to applications','cp.prev':'Previous candidate','cp.next':'Next candidate','cp.of':'{i} of {n} for this job',
 'cp.sem':'No real file: the candidate attaches the file and it opens here.','cp.cv':'View CV','cp.dl':'Download CV','cp.open':'Open','cp.dl1':'Download','cp.email':'Send email','cp.call':'Call','cp.est':'Change status',
 'cp.msg':'Cover message','cp.res':'Summary','cp.exp':'Work experience','cp.form':'Education','cp.doc':'Documents','cp.sk':'Skills','cp.idi':'Languages','cp.ct':'Contact','cp.app':'Application','cp.dados':'Availability',
 'cp.now':'Current','cp.conc':'Completed','cp.curso':'In progress','cp.none.exp':'No work experience recorded.','cp.none.form':'No education recorded.','cp.none.doc':'No documents attached.','cp.none.sk':'No skills recorded.','cp.none.res':'The candidate has not written a summary yet.',
 'cp.req':'Skills required by the job: {a} of {b}','cp.miss':'Missing','cp.have':'Has','cp.mudanca':'Open to relocation','cp.remoto':'Open to remote work','cp.sim':'Yes','cp.nao':'No','cp.priv':'The candidate does not share this contact.','cp.privE':'Email not shared','cp.anos':'{n} year(s)','cp.demo':'Demo file (no real attachment).','cp.cvtxt':'Text extracted from the CV','cp.cvno':'No CV text available.','cp.mv':'Move application','cp.principal':'Main','cp.new':'New',
 'cp.nv.Básico':'Basic','cp.nv.Intermediário':'Intermediate','cp.nv.Avançado':'Advanced','cp.nv.Fluente':'Fluent','cp.nv.Nativo':'Native','cp.g.Licenciatura':'Bachelor’s','cp.g.Mestrado':'Master’s','cp.g.Técnico':'Technical','cp.g.Doutoramento':'Doctorate','cp.g.Outro':'Other','cp.d.CV':'Résumé','cp.d.Certificado':'Certificate','cp.d.Bilhete de Identidade':'ID card','cp.d.Carta de motivação':'Cover letter','cp.d.Referência':'Reference','cp.d.Outro':'Other','cd.ver':'View full profile','cd.est':'Change status'});

const CAT=()=>window.LERMO_CAT||{c:[],i:[]};
const nomeC=id=>{const x=CAT().c.find(y=>y[0]===id);return x?(lang==='en'?x[2]:x[1]):'#'+id};
const nomeI=id=>{const x=CAT().i.find(y=>y[0]===id);return x?(lang==='en'?x[2]:x[1]):'#'+id};
const fMY=d=>{if(!d)return'';try{return new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{month:'short',year:'numeric'}).format(new Date(String(d).slice(0,7)+'-01T00:00:00'))}catch(e){return d}};
const kb=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const tr=(p,v)=>{const k='cp.'+p+'.'+v;return D[lang][k]||D.pt[k]||v};

/* Dados de demonstração do perfil (em produção vêm da API em c.pf) */
const INST=['Universidade do Índico','Instituto Superior do Limpopo','Universidade Zambeze Nova','Instituto Politécnico de Nacala','Universidade Savana'];
const EMPR=['Banco Horizonte','Grupo Savana','Índico Consultores','Costa Azul, Lda','Nacala Logística','Agro Limpopo','Estúdio Marracuene','Clínica Mahotas'];
const CARGOS=['Estagiário(a)','Assistente administrativo(a)','Técnico(a) júnior','Analista júnior','Assistente de projecto'];
const MSG=['Tenho interesse nesta vaga porque encaixa na minha formação e quero crescer na área. Fico disponível para uma entrevista.','Sou uma pessoa organizada e com vontade de aprender. Gostaria de contribuir para a vossa equipa.','Junto o meu CV e certificados. Tenho experiência prática na área e disponibilidade imediata.'];
function skillsDe(curso){const k=norm(curso),m=[[/contab|audit/,[7,1,2]],[/inform|comput/,[3,4,6,5]],[/design/,[9,20,11]],[/market/,[10,11,15]],[/gest|admin|econom/,[8,1,17]],[/estat|matem/,[1,5,6]],[/tradu|lingu/,[13,15,2]],[/psicol|rh/,[15,16,12]]],r=m.find(x=>x[0].test(k));return r?r[1]:[1,2,12]}
function perfil(c){
 if(c.pf)return c.pf;
 const n=parseInt(String(c.id).replace(/\D/g,''),10)||0,y=new Date().getFullYear(),NV=['Intermediário','Avançado','Básico'];
 const comps=[...skillsDe(c.curso),16+n%4].filter((x,i,a)=>a.indexOf(x)===i).map((id,i)=>({id,nivel:NV[(n+i)%3],anos:1+(n+i)%4}));
 const exps=[{empresa:EMPR[n%EMPR.length],cargo:CARGOS[n%CARGOS.length],descricao:'Apoio diário à equipa, preparação de relatórios e acompanhamento de tarefas da área de '+c.curso.toLowerCase()+'.',inicio:(y-2)+'-03-01',fim:null,actual:true}];
 if(n%3!==1)exps.push({empresa:EMPR[(n+3)%EMPR.length],cargo:CARGOS[(n+2)%CARGOS.length],descricao:'Participação em projectos internos e atendimento a clientes.',inicio:(y-4)+'-02-01',fim:(y-2)+'-02-28',actual:false});
 const forms=[{instituicao:INST[n%INST.length],curso:c.curso,grau:n%5===4?'Mestrado':'Licenciatura',inicio:(y-7)+'-02-01',fim:(y-3)+'-12-15',concluido:true}];
 if(n%2===0)forms.push({instituicao:INST[(n+2)%INST.length],curso:'Curso técnico complementar',grau:'Técnico',inicio:(y-9)+'-02-01',fim:(y-8)+'-11-30',concluido:true});
 const idi=[{id:1,nivel:'Nativo'},{id:2,nivel:['Intermediário','Avançado','Fluente'][n%3]}];if(n%4===0)idi.push({id:4,nivel:'Básico'});
 const tel='+258 8'+(2+n%5)+' '+String(100+(n*37)%900)+' '+String(1000+(n*911)%9000);
 const resumo=c.nome.split(' ')[0]+' é '+(/^(Ana|Beatriz|Elisa|Graça|Isabel|Kátia|Maria|Olívia)/.test(c.nome)?'uma profissional':'um profissional')+' de '+c.curso+' com '+(1+n%5)+' ano(s) de experiência prática, residente em '+c.local+'. Procura uma oportunidade para aplicar e desenvolver as suas competências.';
 const cv=[c.nome.toUpperCase(),c.curso+' · '+c.local,'','RESUMO',resumo,'','EXPERIÊNCIA PROFISSIONAL',...exps.map(e=>`${e.cargo} — ${e.empresa} (${fMY(e.inicio)} – ${e.actual?'actual':fMY(e.fim)})\n  ${e.descricao}`),'','FORMAÇÃO',...forms.map(f=>`${f.curso} — ${f.instituicao} (${f.grau})`),'','COMPETÊNCIAS',comps.map(x=>nomeC(x.id)+' ('+x.nivel+')').join(', '),'','IDIOMAS',idi.map(x=>nomeI(x.id)+' — '+x.nivel).join(', ')].join('\n');
 const docs=[{id:'cv'+c.id,tipo:'CV',nome_ficheiro:'CV_'+slug(c.nome)+'.pdf',tipo_mime:'application/pdf',tamanho_bytes:180000+n*7300,criado_em:c.em+'T08:00:00',url:null}];
 if(n%2===0)docs.push({id:'ce'+c.id,tipo:'Certificado',nome_ficheiro:'Certificado_'+slug(c.curso)+'.pdf',tipo_mime:'application/pdf',tamanho_bytes:420000+n*5100,criado_em:c.em+'T08:00:00',url:null});
 if(n%3===0)docs.push({id:'cm'+c.id,tipo:'Carta de motivação',nome_ficheiro:'Carta_motivacao.pdf',tipo_mime:'application/pdf',tamanho_bytes:95000+n*2100,criado_em:c.em+'T08:00:00',url:null});
 return c.pf={resumo_pessoal:resumo,foto_url:null,telefone:tel,mostrar_email:n%5!==3,mostrar_telefone:n%2===0,disponivel_para_mudanca:n%2===0,disponivel_para_remoto:n%3!==0,idioma_principal_id:1,mensagem:MSG[n%MSG.length],cv_texto:cv,experiencias:exps,formacoes:forms,competencias:comps,idiomas:idi,documentos:docs}}
/* contactos respeitam preferencias_privacidade (mostrar_email / mostrar_telefone) */
const contacto=c=>{const p=perfil(c);return{email:p.mostrar_email!==false?c.email:'',tel:p.mostrar_telefone?p.telefone:''}};

const sec=(k,body,extra)=>`<section class="card cp-sec" aria-labelledby="cp-${k}"><div class="ch"><h2 id="cp-${k}">${t('cp.'+k)}</h2>${extra||''}</div>${body}</section>`;
const vazio=m=>`<p class="cp-empty">${t(m)}</p>`;
function docRow(c,d){
 const ic=d.tipo==='CV'?'fa-file-lines':d.tipo==='Certificado'?'fa-award':'fa-file';
 return `<li class="cp-doc"><span class="ic" aria-hidden="true"><i class="fas ${ic}"></i></span><div class="cp-dn"><b>${esc(d.nome_ficheiro)}</b><small>${esc(tr('d',d.tipo))} · ${kb(d.tamanho_bytes)} · ${fD(d.criado_em)}${d.url?'':' · '+t('cp.demo')}</small></div>${`<div class="cp-da"><button class="btn btn-l btn-s" type="button" data-a="cp-open:${c.id}|${d.id}"><i class="fas fa-eye" aria-hidden="true"></i> ${t('cp.open')}</button><button class="btn btn-l btn-s" type="button" data-a="cp-dl:${c.id}|${d.id}" aria-label="${t('cp.dl1')}: ${esc(d.nome_ficheiro)}"><i class="fas fa-download" aria-hidden="true"></i></button></div>`}</li>`}
function paginaPerfil(id){PL={};
 const c=cand(id),back=crumbs([[t('n.dash'),'#/dashboard'],[t('n.cand'),'#/candidaturas'],[c?c.nome:t('cp.nf')]]);
 if(!c)return{title:t('n.cand'),html:back+`<div class="state card"><i class="fas fa-user-slash" aria-hidden="true"></i><p>${t('cp.nf')}</p><a class="btn btn-g" href="#/candidaturas">${t('cp.back')}</a></div>`};
 c.visto=true;
 const p=perfil(c),v=vaga(c.vaga_id),ct=contacto(c),req=v.competencias||[],tem=req.filter(x=>p.competencias.some(k=>k.id===x)),falta=req.filter(x=>!tem.includes(x));
 const irm=lista().filter(x=>x.vaga_id===c.vaga_id),i=irm.findIndex(x=>x.id===c.id),ant=irm[i-1],seg=irm[i+1];
 const lk=(x,ic,l)=>x?`<a class="ib" href="#/candidaturas/perfil/${esc(x.id)}" aria-label="${t(l)}: ${esc(x.nome)}" title="${t(l)}"><i class="fas ${ic}" aria-hidden="true"></i></a>`:`<span class="ib cp-off" aria-hidden="true"><i class="fas ${ic}"></i></span>`;
 const facts=[['fa-location-dot',c.local],p.disponivel_para_mudanca&&['fa-suitcase-rolling',t('cp.mudanca')],p.disponivel_para_remoto&&['fa-house-laptop',t('cp.remoto')]].filter(Boolean).map(([ic,x])=>`<span><i class="fas ${ic}" aria-hidden="true"></i>${esc(x)}</span>`).join('');
 const cv=p.documentos.find(d=>d.tipo==='CV'),outros=p.documentos.filter(d=>d.tipo!=='CV');
 const head=`<section class="card cp-hd"><div class="cp-id"><span class="vgc-ic cd-av cp-av"${p.foto_url?` style="background-image:url('${esc(p.foto_url)}')"`:''} aria-hidden="true">${p.foto_url?'':esc(ini(c.nome))}</span><div><h1>${esc(c.nome)}</h1><p>${esc(c.curso)}</p><div class="vg-tags"><span class="tag ${tag(c.estado)}">${t('e.'+c.estado)}</span><span class="tag in">${t('cd.match',{n:c.match})}</span></div><div class="vg-m2">${facts}</div></div></div>
  <div class="cp-act">${cv?`<button class="btn btn-g" type="button" data-a="cp-open:${c.id}|${cv.id}"><i class="fas fa-file-lines" aria-hidden="true"></i> ${t('cp.cv')}</button><button class="btn btn-l" type="button" data-a="cp-dl:${c.id}|${cv.id}"><i class="fas fa-download" aria-hidden="true"></i> ${t('cp.dl')}</button>`:''}<button class="btn btn-l" type="button" data-a="cp-msg:${c.id}"><i class="fas fa-envelope" aria-hidden="true"></i> ${t('ms.nova')}</button>${ct.tel?`<a class="btn btn-l" href="tel:${esc(ct.tel.replace(/\s/g,''))}"><i class="fas fa-phone" aria-hidden="true"></i> ${t('cp.call')}</a>`:''}<button class="btn btn-l" type="button" data-a="cd-est:${c.id}"><i class="fas fa-pen-to-square" aria-hidden="true"></i> ${t('cp.est')}</button></div>
  <div class="cp-nav"><a class="btn btn-l btn-s" href="#/candidaturas/${esc(c.vaga_id)}"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('cp.back')}</a><span>${t('cp.of',{i:i+1,n:irm.length})}</span>${lk(ant,'fa-chevron-left','cp.prev')}${lk(seg,'fa-chevron-right','cp.next')}</div></section>`;
 const exp=sec('exp',p.experiencias.length?pl('exp','cp-tl',[...p.experiencias].sort((a,b)=>(b.actual-a.actual)||b.inicio.localeCompare(a.inicio)),e=>`<li><b>${esc(e.cargo)}</b><span>${esc(e.empresa)} · ${fMY(e.inicio)} – ${e.actual?t('cp.now'):fMY(e.fim)}</span>${e.descricao?`<p>${esc(e.descricao)}</p>`:''}</li>`):vazio('cp.none.exp'));
 const form=sec('form',p.formacoes.length?pl('form','cp-tl',[...p.formacoes].sort((a,b)=>b.inicio.localeCompare(a.inicio)),f=>`<li><b>${esc(f.curso)}</b><span>${esc(f.instituicao)} · ${esc(tr('g',f.grau||'Outro'))} · ${fMY(f.inicio)} – ${f.fim?fMY(f.fim):t('cp.curso')}</span><span class="tag ${f.concluido?'ok':''}">${f.concluido?t('cp.conc'):t('cp.curso')}</span></li>`):vazio('cp.none.form'));
 const sk=sec('sk',(req.length?`<p class="cp-req"><b>${t('cp.req',{a:tem.length,b:req.length})}</b></p>`:'')+(p.competencias.length||falta.length?`<ul class="cp-chips">${p.competencias.map(k=>`<li class="cp-chip${req.includes(k.id)?' ok':''}">${req.includes(k.id)?'<i class="fas fa-check" aria-hidden="true"></i> ':''}${esc(k.nome||nomeC(k.id))}<small>${esc(tr('nv',k.nivel))}${k.anos?' · '+t('cp.anos',{n:k.anos}):''}</small></li>`).join('')}${falta.map(x=>`<li class="cp-chip miss"><i class="fas fa-xmark" aria-hidden="true"></i> ${esc(nomeC(x))}<small>${t('cp.miss')}</small></li>`).join('')}</ul>`:vazio('cp.none.sk')));
 const idi=sec('idi',p.idiomas.length?`<ul class="cp-lg">${p.idiomas.map(l=>`<li><span>${esc(nomeI(l.id))}${l.id===p.idioma_principal_id?` <span class="tag in">${t('cp.principal')}</span>`:''}</span><b>${esc(tr('nv',l.nivel))}</b></li>`).join('')}</ul>`:vazio('cp.none.sk'));
 const docs=sec('doc',p.documentos.length?pl('doc','cp-docs',[...(cv?[cv]:[]),...outros],d=>docRow(c,d)):vazio('cp.none.doc'));
 const ctc=sec('ct',`<ul class="vgc-l cd-fl"><li><i class="fas fa-envelope" aria-hidden="true"></i><span>${ct.email?esc(ct.email):`<em>${t('cp.privE')}</em>`}</span></li><li><i class="fas fa-phone" aria-hidden="true"></i><span>${ct.tel?`<a href="tel:${esc(ct.tel.replace(/\s/g,''))}">${esc(ct.tel)}</a>`:`<em>${t('cp.priv')}</em>`}</span></li><li><i class="fas fa-location-dot" aria-hidden="true"></i><span>${esc(c.local)}</span></li></ul>`);
 const hist=pl('hist','cd-hist',[...c.historico].reverse(),h=>`<li><i class="fas ${ICO[h.estado]||'fa-circle'}" aria-hidden="true"></i><div><b>${t('e.'+h.estado)}</b> · <small>${fD(h.em)}</small><p>${h.nota?esc(h.nota):'<em>'+t('cd.sem')+'</em>'}</p></div></li>`);
 const mv=EST.filter(e=>e!==c.estado).map(e=>`<button class="btn btn-l btn-s" type="button" data-a="cd-to-${e}:${c.id}"><i class="fas ${ICO[e]}" aria-hidden="true"></i> ${t('e.'+e)}</button>`).join('');
 const app=sec('app',`<ul class="vgc-l cd-fl"><li><i class="fas fa-briefcase" aria-hidden="true"></i><span><b>${t('cd.vaga')}:</b> ${esc(vt(c.vaga_id))}</span></li><li><i class="fas fa-clock" aria-hidden="true"></i><span><b>${t('cd.cand')}:</b> ${fD(c.em)}</span></li><li><i class="fas fa-bullseye" aria-hidden="true"></i><span><b>${t('cd.col.match')}:</b> <span class="cd-m"><i style="width:${c.match}%"></i></span>${c.match}%</span></li></ul><h3 class="cd-h4">${t('cp.mv')}</h3><div class="cp-mv">${mv}</div><h3 class="cd-h4">${t('cd.hist')}</h3>${hist}`);
 const ml=(c.mensagens||[]).slice().reverse(),men=sec('ms',ml.length?pl('ms','ms-l',ml,m=>`<li><details><summary><b>${esc(m.assunto)}</b><small>${fD(m.em)} · ${t('ms.mo.'+m.modo)}</small></summary><p class="cp-txt">${esc(m.corpo)}</p></details></li>`):vazio('ms.none'),`<button class="btn btn-l btn-s" type="button" data-a="cp-msg:${c.id}"><i class="fas fa-plus" aria-hidden="true"></i> ${t('ms.novo')}</button>`);
 const msg=p.mensagem?sec('msg',`<p class="cp-txt">${esc(p.mensagem)}</p>`):'';
 const res=sec('res',p.resumo_pessoal?`<p class="cp-txt">${esc(p.resumo_pessoal)}</p>`:vazio('cp.none.res'));
 return{title:c.nome,html:`<h1 class="sr">${esc(c.nome)}</h1>`+back+head+`${[[msg,res],[app,men],[exp,form],[sk,idi],[docs,ctc]].map(r=>r.filter(Boolean)).filter(r=>r.length).map(r=>`<div class="cp-row">${r.join('')}</div>`).join('')}`}}

/* CV / documentos: abrir (ficheiro real ou texto extraído) e descarregar */
const docDe=x=>{const [ci,di]=String(x).split('|'),c=cand(ci);return{c,d:c&&perfil(c).documentos.find(k=>k.id===di)}};
/* PDF de demonstração (os candidatos de teste não têm ficheiro no servidor): CV, certificado e carta. Em produção d.url é o ficheiro original. */
const PD={g:'0.106 0.263 0.196',o:'0.788 0.627 0.227',c:'0.894 0.784 0.471',t:'0.1 0.14 0.12',q:'0.36 0.43 0.39',l:'0.82 0.85 0.83'};
function pdfMk(W,H,M){
 const cx=document.createElement('canvas').getContext('2d'),
  K={'\u2013':150,'\u2014':151,'\u2022':149,'\u2019':146,'\u2018':145,'\u201c':147,'\u201d':148,'\u2026':133,'\u20ac':128},
  S={pages:[],W,H,M,TW:W-2*M,y:0,pg:null};
 S.enc=x=>{let o='';for(const ch of String(x).replace(/\t/g,' ')){const n=ch.charCodeAt(0);o+=String.fromCharCode(K[ch]||((n>=32&&n<127)||(n>=160&&n<256)?n:63))}return o.replace(/[\\()]/g,'\\$&')};
 S.mw=(x,sz,b)=>{cx.font=(b?'bold ':'')+sz+'px Helvetica,Arial,sans-serif';return cx.measureText(x).width};
 S.wrap=(x,sz,b,w)=>{const o=[];let l='';String(x).split(' ').forEach(k=>{const q=l?l+' '+k:k;if(l&&S.mw(q,sz,b)>w){o.push(l);l=k}else l=q});o.push(l);return o};
 S.nova=()=>{S.pg=[];S.pages.push(S.pg);S.y=H-M};
 S.room=h=>{if(S.y-h<M+22)S.nova()};
 S.put=(x,sz,b,col,xx)=>S.pg.push(`BT /F${b?2:1} ${sz} Tf ${col} rg ${xx} ${S.y} Td (${S.enc(x)}) Tj ET`);
 S.rect=(col,x,y,w,h)=>S.pg.push(`${col} rg ${x} ${y} ${w} ${h} re f`);
 S.rule=(col,w,x1,x2,y)=>S.pg.push(`${col} RG ${w} w ${x1} ${y} m ${x2} ${y} l S`);
 S.para=(x,sz,col)=>S.wrap(x,sz,false,S.TW).forEach(l=>{S.room(14);S.y-=13.6;S.put(l,sz,0,col,M)});
 S.out=(title,author)=>{
  const n=S.pages.length,objs=[null,null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'],kids=[];
  S.pages.forEach(q=>{const c2=q.join('\n')+'\n',pi=objs.length+1;kids.push(pi+' 0 R');
   objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pi+1} 0 R >>`);
   objs.push(`<< /Length ${c2.length} >>\nstream\n${c2}endstream`)});
  objs.push(`<< /Title (${S.enc(title)}) /Author (${S.enc(author)}) /Producer (LERMO Recursos) >>`);const info=objs.length;
  objs[0]='<< /Type /Catalog /Pages 2 0 R >>';objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${n} >>`;
  let out='%PDF-1.4\n';const off=[];objs.forEach((o,k)=>{off.push(out.length);out+=`${k+1} 0 obj\n${o}\nendobj\n`});
  const xr=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objs.length+1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xr}\n%%EOF`;
  const bt=new Uint8Array(out.length);for(let k=0;k<out.length;k++)bt[k]=out.charCodeAt(k)&255;
  return new Blob([bt],{type:'application/pdf'})};
 return S}
/* faixa de topo verde com nome, curso e contacto (o contacto respeita a privacidade do candidato) */
function pdfTopo(S,c){
 const {W,H,M}=S,ct=contacto(c),lin=[ct.email,ct.tel,c.local].filter(Boolean).join('   |   ');
 S.rect(PD.g,0,H-118,W,118);S.rect(PD.o,0,H-121,W,3);
 S.y=H-52;S.put(c.nome,23,1,'1 1 1',M);S.y=H-72;S.put(c.curso,11.5,0,PD.c,M);
 if(lin){S.y=H-95;S.put(lin,9.5,0,'0.86 0.91 0.88',M)}
 S.y=H-150}
function pdfSec(S,x){S.room(48);S.y-=24;S.rect(PD.o,S.M,S.y-1,3,12);S.put(x.toUpperCase(),10.5,1,PD.g,S.M+10);S.y-=6;S.rule(PD.l,.6,S.M,S.W-S.M,S.y);S.y-=4}
function pdfEntry(S,tit,dt,sub,desc){
 const {W,M}=S,li=String(desc||'').split('\n').map(z=>z.trim()).filter(Boolean),bl=li.length>1;
 S.room(44);S.y-=17;S.put(tit,10.5,1,PD.t,M);if(dt)S.put(dt,9.5,0,PD.q,W-M-S.mw(dt,9.5));
 if(sub){S.y-=13.5;S.put(sub,10,0,PD.q,M)}
 li.forEach(z=>S.wrap(z,10,false,S.TW-(bl?12:0)).forEach((l,j)=>{S.room(14);S.y-=13.6;if(bl&&!j)S.put('\u2022',10,0,PD.t,M+2);S.put(l,10,0,PD.t,M+(bl?12:0))}));S.y-=3}
function pdfFim(S,c,d){const n=S.pages.length;S.pages.forEach((q,i)=>{S.pg=q;S.y=28;S.put(c.nome+'   |   '+(i+1)+'/'+n,8,0,'0.5 0.5 0.5',S.M)});return S.out(d.nome_ficheiro,c.nome)}
window.LERMO_PDF={pdfMk,pdfSec,pdfEntry,PD};   /* reutilizado pelo perfil dos talentos (empresa-talentos.js) */
function pdfCV(c,d){
 const p=perfil(c),S=pdfMk(595,842,54);S.nova();pdfTopo(S,c);
 const E=[...p.experiencias].sort((a,b)=>(b.actual-a.actual)||b.inicio.localeCompare(a.inicio)),F=[...p.formacoes].sort((a,b)=>b.inicio.localeCompare(a.inicio));
 if(p.resumo_pessoal){pdfSec(S,t('cp.res'));String(p.resumo_pessoal).split('\n').filter(Boolean).forEach(z=>S.para(z,10,PD.t))}
 if(E.length){pdfSec(S,t('cp.exp'));E.forEach(e=>pdfEntry(S,e.cargo,fMY(e.inicio)+' \u2013 '+(e.actual?t('cp.now'):fMY(e.fim)),e.empresa,e.descricao))}
 if(F.length){pdfSec(S,t('cp.form'));F.forEach(f=>pdfEntry(S,f.curso,fMY(f.inicio)+' \u2013 '+(f.fim?fMY(f.fim):t('cp.curso')),[f.instituicao,tr('g',f.grau||'Outro')].filter(Boolean).join(' | '),''))}
 if(p.competencias.length){pdfSec(S,t('cp.sk'));S.para(p.competencias.map(k=>k.nome||nomeC(k.id)).join('  \u2022  '),10,PD.t)}
 if(p.idiomas.length){pdfSec(S,t('cp.idi'));S.para([...p.idiomas].sort((a,b)=>(b.id===p.idioma_principal_id)-(a.id===p.idioma_principal_id)).map(l=>nomeI(l.id)+' ('+tr('nv',l.nivel)+')').join('  \u2022  '),10,PD.t)}
 return pdfFim(S,c,d)}
/* Certificados e outros documentos são anexados pelo candidato: aqui só se vê/descarrega o ficheiro real (d.url). Sem anexo não se inventa nada;
   o CV é a excepção porque é montado com os dados que o candidato preencheu no perfil. */
const temFich=d=>!!(d.url||d.tipo==='CV');
Actions['cp-open']=(b,x)=>{const {c,d}=docDe(x);if(!d)return;
 if(!temFich(d)){toast(t('cp.sem'));return}
 const u=d.url||URL.createObjectURL(pdfCV(c,d)),m=Modal.open({title:d.nome_ficheiro,body:`${d.url?'':`<p class="cp-cvh">${t('cp.demo')}</p>`}<iframe class="cp-pdf" src="${esc(u)}" title="${esc(d.nome_ficheiro)}"></iframe><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cd.close')}</button><button class="btn btn-g" type="button" data-a="cp-dl:${x}"><i class="fas fa-download" aria-hidden="true"></i> ${t('cp.dl1')}</button></div>`});
 m.firstElementChild.classList.add('cp-mod')};
Actions['cp-dl']=(b,x)=>{const {c,d}=docDe(x);if(!d)return;
 if(!temFich(d)){toast(t('cp.sem'));return}
 const a=document.createElement('a');
 if(d.url){a.href=d.url;a.download=d.nome_ficheiro}
 else{const u=URL.createObjectURL(pdfCV(c,d));a.href=u;a.download=d.nome_ficheiro.replace(/\.\w+$/,'')+'.pdf';setTimeout(()=>URL.revokeObjectURL(u),4000)}
 document.body.append(a);a.click();a.remove()};

/* ======================================================================
   MENSAGENS AO CANDIDATO (dentro da plataforma — o recrutador não escreve nem vê o email)
   Modos: automática (modelo pronto) · personalizar (parte do modelo e edita) · manual (em branco).
   Em produção: POST /api/empresa/candidaturas/{id}/mensagens {assunto,corpo,modo,mover_para?}; o servidor envia ao email do candidato
   (utilizadores.email) sem o expor ao navegador. Nesta demo as mensagens ficam em c.mensagens (memória).
   ====================================================================== */
Object.assign(D.pt,{'ms.nova':'Enviar mensagem','ms.h':'Mensagem para {n}','ms.info':'A mensagem é enviada pela plataforma. Não precisa de escrever nem de ver o email do candidato.',
 'ms.m.auto':'Automática','ms.m.custom':'Personalizar','ms.m.manual':'Manual','ms.d.auto':'Usa o modelo pronto, sem alterações.','ms.d.custom':'Parte do modelo e pode editar o texto.','ms.d.manual':'Escreva a mensagem de raiz.',
 'ms.tpl':'Modelo','ms.assunto':'Assunto','ms.corpo':'Mensagem','ms.data':'Data','ms.hora':'Hora','ms.local':'Local ou ligação','ms.mv':'Mover candidatura para «{e}» ao enviar','ms.send':'Enviar mensagem',
 'ms.sent':'Mensagem enviada a {n}.','ms.sentm':'Mensagem enviada e candidatura movida para «{e}».','ms.err.vazio':'Escreva o assunto e a mensagem.','ms.err.ent':'Preencha a data, a hora e o local da entrevista.',
 'ms.not':'Notificar o candidato com a mensagem-modelo','ms.notd':'Para entrevista, abre a mensagem para indicar data e local.','cp.ms':'Mensagens enviadas','ms.none':'Ainda não enviou mensagens a este candidato.','ms.novo':'Nova','ms.mo.auto':'Automática','ms.mo.custom':'Personalizada','ms.mo.manual':'Manual'});
Object.assign(D.en,{'ms.nova':'Send message','ms.h':'Message to {n}','ms.info':'The message is sent through the platform. You do not need to type or see the candidate’s email.',
 'ms.m.auto':'Automatic','ms.m.custom':'Customise','ms.m.manual':'Manual','ms.d.auto':'Uses the ready-made template, unchanged.','ms.d.custom':'Starts from the template and you can edit the text.','ms.d.manual':'Write the message from scratch.',
 'ms.tpl':'Template','ms.assunto':'Subject','ms.corpo':'Message','ms.data':'Date','ms.hora':'Time','ms.local':'Place or link','ms.mv':'Move application to “{e}” when sending','ms.send':'Send message',
 'ms.sent':'Message sent to {n}.','ms.sentm':'Message sent and application moved to “{e}”.','ms.err.vazio':'Write the subject and the message.','ms.err.ent':'Fill in the interview date, time and place.',
 'ms.not':'Notify the candidate with the template message','ms.notd':'For interviews, opens the message so you can set date and place.','cp.ms':'Sent messages','ms.none':'You have not sent messages to this candidate yet.','ms.novo':'New','ms.mo.auto':'Automatic','ms.mo.custom':'Customised','ms.mo.manual':'Manual'});
const SG='\n\nCom os melhores cumprimentos,\nEquipa de Recrutamento — {empresa}',SGE='\n\nKind regards,\nRecruitment team — {empresa}';
const TPL={
 candidatou_se:{pt:['Recebemos a sua candidatura — {vaga}','Olá {nome},\n\nRecebemos a sua candidatura à vaga «{vaga}» e agradecemos o interesse em trabalhar na {empresa}.\n\nVamos analisar o seu perfil e entraremos em contacto com novidades.'+SG],en:['We received your application — {vaga}','Hello {nome},\n\nWe received your application for “{vaga}” and thank you for your interest in working at {empresa}.\n\nWe will review your profile and get back to you with news.'+SGE]},
 em_analise:{pt:['A sua candidatura está em análise — {vaga}','Olá {nome},\n\nA sua candidatura à vaga «{vaga}» está agora em análise pela nossa equipa. Entraremos em contacto em breve com os próximos passos.'+SG],en:['Your application is under review — {vaga}','Hello {nome},\n\nYour application for “{vaga}” is now being reviewed by our team. We will contact you soon with the next steps.'+SGE]},
 entrevista:{pt:['Convite para entrevista — {vaga}','Olá {nome},\n\nGostaríamos de o(a) convidar para uma entrevista para a vaga «{vaga}».\n\nData: {data}\nHora: {hora}\nLocal / ligação: {local}\n\nPor favor, confirme a sua disponibilidade.'+SG],en:['Interview invitation — {vaga}','Hello {nome},\n\nWe would like to invite you to an interview for “{vaga}”.\n\nDate: {data}\nTime: {hora}\nPlace / link: {local}\n\nPlease confirm your availability.'+SGE]},
 contratado:{pt:['Parabéns — selecionado(a) para {vaga}','Olá {nome},\n\nTemos o prazer de informar que foi selecionado(a) para a vaga «{vaga}» na {empresa}. Em breve receberá os detalhes da admissão.\n\nParabéns!'+SG],en:['Congratulations — selected for {vaga}','Hello {nome},\n\nWe are pleased to tell you that you have been selected for “{vaga}” at {empresa}. You will receive the onboarding details shortly.\n\nCongratulations!'+SGE]},
 rejeitado:{pt:['Resultado da sua candidatura — {vaga}','Olá {nome},\n\nAgradecemos o tempo dedicado à candidatura à vaga «{vaga}». Após análise, decidimos avançar com outros perfis neste momento.\n\nGuardaremos o seu contacto para futuras oportunidades e desejamos-lhe muito sucesso.'+SG],en:['Update on your application — {vaga}','Hello {nome},\n\nThank you for the time you put into your application for “{vaga}”. After review, we decided to move forward with other profiles at this time.\n\nWe will keep your details for future opportunities and wish you every success.'+SGE]}};
const empNome=()=>(MOCK.empresa&&MOCK.empresa.nome)||((typeof Session!=='undefined'&&Session.get())||{}).nome_completo||'';
const subst=(s,c)=>(c?s.replace(/\{nome\}/g,c.nome.split(' ')[0]).replace(/\{vaga\}/g,vt(c.vaga_id)):s).replace(/\{empresa\}/g,empNome());
const pers=(x,c)=>x.replace(/\{nome\}/g,c.nome.split(' ')[0]).replace(/\{vaga\}/g,vt(c.vaga_id));
const tpl=(e,c)=>{const x=TPL[e][lang==='en'?'en':'pt'];return{s:subst(x[0],c),b:subst(x[1],c)}};
const MS={c:null,L:null,modo:'auto',e:'em_analise'};
const TOK=/\{(data|hora|local)\}/;
function msgHtml(){const c=MS.c,ent=['data','hora','local'];
 const opts=EST.map(e=>`<option value="${e}"${e===MS.e?' selected':''}>${t('e.'+e)}</option>`).join('');
 const seg=['auto','custom','manual'].map(m=>`<button type="button" data-a="ms-mode:${m}" aria-pressed="${MS.modo===m}">${t('ms.m.'+m)}</button>`).join('');
 return `<p class="ms-info"><i class="fas fa-shield-halved" aria-hidden="true"></i> <span>${t('ms.info')}${MS.L?'<br>'+t('ms.lote'):''}</span></p>
 <div class="seg ms-seg" role="group" aria-label="${t('ms.nova')}" id="msM">${seg}</div><p class="ms-d" id="msD">${t('ms.d.'+MS.modo)}</p>
 <div class="fld" id="msTw"><label for="msT">${t('ms.tpl')}</label><select id="msT">${opts}</select></div>
 <div class="ms-ent" id="msE" hidden>${ent.map(k=>`<div class="fld"><label for="ms-${k}">${t('ms.'+k)}</label><input id="ms-${k}" type="${k==='data'?'date':k==='hora'?'time':'text'}"${k==='local'?' maxlength="150"':''}></div>`).join('')}</div>
 <div class="fld"><label for="msS">${t('ms.assunto')}</label><input id="msS" type="text" maxlength="200"></div>
 <div class="fld" style="margin-top:.7rem"><label for="msB">${t('ms.corpo')}</label><textarea id="msB" rows="9" maxlength="3000"></textarea></div>
 <label class="ms-ck" id="msMw"><input type="checkbox" id="msMv"> <span id="msMl"></span></label>
 <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cd.close')}</button><button class="btn btn-g" type="button" data-a="ms-send"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('ms.send')}</button></div>`}
function msgSync(refill){
 const S_=$('#msS'),B=$('#msB'),man=MS.modo==='manual',aut=MS.modo==='auto';
 $('#msTw').hidden=man;S_.readOnly=B.readOnly=aut;$('#msD').textContent=t('ms.d.'+MS.modo);
 document.querySelectorAll('#msM button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a.split(':')[1]===MS.modo));
 if(refill){if(man){S_.value='';B.value=''}else{const x=tpl(MS.e,MS.L?null:MS.c);S_.value=x.s;B.value=x.b}}
 const ent=!man&&MS.e==='entrevista'||TOK.test(B.value);$('#msE').hidden=!ent;
 const mw=$('#msMw'),mv=(MS.L?true:MS.e!==MS.c.estado)&&!man;mw.hidden=!mv;if(!mv)$('#msMv').checked=false;else $('#msMl').textContent=MS.L?t('ms.mvl',{n:MS.L.length,e:t('e.'+MS.e)}):t('ms.mv',{e:t('e.'+MS.e)})}
function abrirMsg(c,e,modo){MS.c=c;MS.L=null;MS.e=e||(EST.includes(c.estado)?c.estado:'em_analise');MS.modo=modo||'auto';
 const m=Modal.open({title:t('ms.h',{n:c.nome}),body:msgHtml()});m.firstElementChild.classList.add('cp-mod');msgSync(true);
 if(MS.e!==c.estado)$('#msMv').checked=true}
function abrirMsgLote(L,e){MS.c=null;MS.L=L;MS.e=e||(L.every(c=>c.estado===L[0].estado)?L[0].estado:'em_analise');MS.modo='auto';const m=Modal.open({title:t('ms.hl',{n:L.length}),body:msgHtml()});m.firstElementChild.classList.add('cp-mod');msgSync(true);$('#msMv').checked=L.every(c=>c.estado!==MS.e)}
function enviarMsg(c,assunto,corpo,modo,e){(c.mensagens=c.mensagens||[]).push({em:new Date().toISOString(),assunto,corpo,modo,estado:e||c.estado})}
Actions['cp-msg']=(b,x)=>{const c=cand(x);if(c)abrirMsg(c)};
Actions['cd-msg']=Actions['cp-msg'];
Actions['ms-mode']=(b,m)=>{const antes=MS.modo;MS.modo=m;msgSync(!(antes==='auto'&&m==='custom'));if(m!=='auto')$('#msB').focus()};
document.addEventListener('change',e=>{if(e.target.id==='msT'){MS.e=e.target.value;msgSync(true);$('#msMv').checked=MS.L?MS.L.every(c=>c.estado!==MS.e):MS.e!==MS.c.estado}});
document.addEventListener('input',e=>{if(e.target.id==='msB')msgSync(false)});
Actions['ms-send']=()=>{const T=MS.L||(MS.c?[MS.c]:[]);if(!T.length)return;let s=$('#msS').value.trim(),b=$('#msB').value.trim();
 if(!s||!b){toast(t('ms.err.vazio'));(s?$('#msB'):$('#msS')).focus();return}
 const d=$('#ms-data').value,h=$('#ms-hora').value.trim(),l=$('#ms-local').value.trim(),rep=x=>x.replace(/\{data\}/g,d?fD(d):'{data}').replace(/\{hora\}/g,h||'{hora}').replace(/\{local\}/g,l||'{local}');
 s=rep(s);b=rep(b);if(TOK.test(s+b)){toast(t('ms.err.ent'));$('#msE').hidden=false;(!d?$('#ms-data'):!h?$('#ms-hora'):$('#ms-local')).focus();return}
 const mv=$('#msMv').checked&&!$('#msMw').hidden;T.forEach(c=>{enviarMsg(c,pers(s,c),pers(b,c),MS.modo,MS.e);if(mv)mover(c,MS.e,'')});
 const lote=!!MS.L;if(lote)S.sel.clear();Modal.close(true);refresh();
 toast(lote?t(mv?'ms.sentnm':'ms.sentn',{n:T.length,e:t('e.'+MS.e)}):mv?t('ms.sentm',{e:t('e.'+MS.e)}):t('ms.sent',{n:T[0].nome}))};

/* ======================================================================
   AÇÕES EM MASSA — selecionar vários candidatos, mover de estado e notificar de uma vez; notificação automática opcional
   ====================================================================== */
Object.assign(D.pt,{'cd.selr':'Selecionar','cd.all':'Selecionar todos os resultados ({n})','cd.sel':'{n} selecionado(s)','cd.to':'Mover para…','cd.go':'Aplicar','cd.bn':'Notificar por mensagem','cd.bm':'Enviar mensagem','cd.clr2':'Limpar seleção',
 'cd.pick':'Escolha o novo estado.','cd.same':'Todos já estão neste estado.','cd.conf':'Confirmar','cd.conf.t':'Confirmar ação',
 'cd.conf.m':'Vai mover {n} candidatura(s) para «{e}».','cd.conf.n':'Cada candidato recebe a mensagem-modelo deste estado.','cd.done':'{n} candidatura(s) movida(s) para «{e}».','cd.done.m':'{n} candidatura(s) movida(s) para «{e}» e notificada(s).',
 'ms.lote':'Cada candidato recebe a sua mensagem, com {nome} e {vaga} preenchidos automaticamente.','ms.hl':'Mensagem para {n} candidatos','ms.mvl':'Mover as {n} candidaturas para «{e}» ao enviar','ms.sentn':'{n} mensagens enviadas.','ms.sentnm':'{n} mensagens enviadas e candidaturas movidas para «{e}».'});
Object.assign(D.en,{'cd.selr':'Select','cd.all':'Select all results ({n})','cd.sel':'{n} selected','cd.to':'Move to…','cd.go':'Apply','cd.bn':'Notify by message','cd.bm':'Send message','cd.clr2':'Clear selection',
 'cd.pick':'Choose the new status.','cd.same':'All of them are already in this status.','cd.conf':'Confirm','cd.conf.t':'Confirm action',
 'cd.conf.m':'You are about to move {n} application(s) to “{e}”.','cd.conf.n':'Each candidate receives the template message for this status.','cd.done':'{n} application(s) moved to “{e}”.','cd.done.m':'{n} application(s) moved to “{e}” and notified.',
 'ms.lote':'Each candidate gets their own message, with {nome} and {vaga} filled in automatically.','ms.hl':'Message to {n} candidates','ms.mvl':'Move the {n} applications to “{e}” when sending','ms.sentn':'{n} messages sent.','ms.sentnm':'{n} messages sent and applications moved to “{e}”.'});
const bar=()=>`<div class="cd-bulk" id="cdBulk" hidden></div>`;
function bulkPaint(){const n=S.sel.size,b=$('#cdBulk'),a=$('#cdAll');if(!b)return;const vis=visiveis().length;
 if(a){a.checked=n>0&&n>=vis;a.indeterminate=n>0&&n<vis}const l=$('#cdAllL');if(l)l.textContent=t('cd.all',{n:vis});
 b.hidden=!n;if(!n){b.innerHTML='';return}
 if(!b.firstChild)b.innerHTML=`<b id="cdSelN"></b><select id="cdTo" aria-label="${t('cd.to')}"><option value="">${t('cd.to')}</option>${EST.map(e=>`<option value="${e}">${t('e.'+e)}</option>`).join('')}</select><label class="ms-ck"><input type="checkbox" id="cdBn"> <span>${t('cd.bn')}</span></label><button class="btn btn-g btn-s" type="button" data-a="cd-bulk-go">${t('cd.go')}</button><button class="btn btn-l btn-s" type="button" data-a="cd-bulk-msg"><i class="fas fa-envelope" aria-hidden="true"></i> ${t('cd.bm')}</button><button class="btn btn-l btn-s" type="button" data-a="cd-bulk-clr">${t('cd.clr2')}</button>`;
 $('#cdSelN').textContent=t('cd.sel',{n})}
function prune(){const ok=new Set(visiveis().map(c=>c.id));[...S.sel].forEach(i=>ok.has(i)||S.sel.delete(i));bulkPaint()}
const escolhidos=()=>[...S.sel].map(cand).filter(Boolean);
let sim=null;
function confirmar(msg,fn){sim=fn;Modal.open({title:t('cd.conf.t'),body:`<p class="cp-txt">${msg}</p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('cd.close')}</button><button class="btn btn-g" type="button" data-a="cd-yes">${t('cd.conf')}</button></div>`})}
Actions['cd-yes']=()=>{const f=sim;sim=null;Modal.close(true);f&&f()};
Actions['cd-sel']=(b,x)=>{b.checked?S.sel.add(x):S.sel.delete(x);bulkPaint()};
Actions['cd-all']=b=>{visiveis().forEach(c=>b.checked?S.sel.add(c.id):S.sel.delete(c.id));document.querySelectorAll('.cd-rk').forEach(i=>i.checked=b.checked);bulkPaint()};
Actions['cd-selall']=()=>{visiveis().forEach(c=>S.sel.add(c.id));document.querySelectorAll('.cd-rk').forEach(i=>i.checked=true);bulkPaint()};
Actions['cd-selpg']=()=>{document.querySelectorAll('.cd-rk').forEach(i=>{i.checked=true;S.sel.add(i.dataset.a.split(':')[1])});bulkPaint()};
Actions['cd-bulk-clr']=()=>{S.sel.clear();document.querySelectorAll('.cd-rk').forEach(i=>i.checked=false);bulkPaint()};
Actions['cd-bulk-msg']=()=>{const L=escolhidos();if(L.length)abrirMsgLote(L)};
Actions['cd-bulk-go']=()=>{const e=$('#cdTo').value,not=$('#cdBn').checked,L=escolhidos();
 if(!e){toast(t('cd.pick'));$('#cdTo').focus();return}
 if(e==='entrevista'&&not){abrirMsgLote(L,'entrevista');return}   /* a entrevista precisa de data, hora e local comuns */
 const A=L.filter(c=>c.estado!==e);if(!A.length){toast(t('cd.same'));return}
 confirmar(t('cd.conf.m',{n:A.length,e:t('e.'+e)})+(not?' '+t('cd.conf.n'):''),()=>{A.forEach(c=>{mover(c,e,'');if(not){const m=tpl(e,c);enviarMsg(c,m.s,m.b,'auto',e)}});S.sel.clear();refresh();toast(t(not?'cd.done.m':'cd.done',{n:A.length,e:t('e.'+e)}))})};
})();
