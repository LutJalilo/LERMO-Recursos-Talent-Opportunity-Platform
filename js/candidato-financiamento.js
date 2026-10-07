'use strict';
/* Área Financiamento (tabelas linhas_financiamento, solicitacoes_financiamento e solicitacao_anexos, ver lermo_database_v5_6.sql): linhas de vários países, filtros,
   detalhe e solicitação. Depende de dashboard-candidato.js: MOCK/api, wait, norm, t, esc, crumbs, fmtD, fmtM, L, paisN, Views, Actions, Modal, toast, invalidate, $, lang, D. */
(()=>{
const PG=4,MAXA=5,MAXB=5242880,EXTS=['pdf','doc','docx','jpg','jpeg','png'];
Object.assign(D.pt,{'est.aprovado':'Aprovado','fi.sub':'Linhas de apoio ao empreendedorismo e acompanhamento das suas solicitações.','fi.search':'Pesquisar por nome, entidade ou país','fi.search.a':'Pesquisar linhas de financiamento','fi.toggle':'Filtros','fi.pais':'País','fi.pais.all':'Todos','fi.sort':'Ordenar','fi.sort.new':'Mais recentes','fi.sort.dl':'Prazo mais próximo','fi.open':'Só abertas','fi.clear':'Limpar filtros','fi.count':'{n} linhas','fi.count.1':'1 linha','fi.empty':'Ainda não há linhas de financiamento publicadas.','fi.none':'Nenhuma linha corresponde aos filtros.','fi.more':'Mostrar mais','fi.view':'Ver linha','fi.back':'Voltar ao financiamento','fi.nf':'Linha não encontrada','fi.nf.p':'Pode ter sido removida ou o endereço está errado.',
 'fi.mine':'As minhas solicitações','fi.notreq':'Ainda não solicitado','fi.canreq':'Por solicitar','fi.seereq':'Ver solicitação','fi.st.h':'Estado da solicitação','fi.requested':'Solicitado','fi.entity':'Entidade','fi.loc':'País','fi.val':'Valor','fi.prazo':'Prazo para solicitar','fi.desc':'Descrição','fi.req':'Requisitos',
 'fi.cta.h':'Pretende solicitar este financiamento?','fi.go':'Solicitar financiamento','fi.closed.p':'O prazo para solicitar esta linha terminou.',
 'fi.s.val':'Valor solicitado','fi.s.date':'Submetido em {d}','fi.s.proj':'O seu projecto','fi.s.p':'A sua solicitação foi submetida e aguarda análise.',
 'fi.m.title':'Solicitar financiamento','fi.m.linha':'Linha','fi.m.val':'Valor solicitado ({m})','fi.m.val.h':'Entre {a} e {b}','fi.m.val.h1':'Valor máximo: {b}','fi.m.val.h0':'Indique o valor de que precisa.','fi.m.val.err':'Indique um valor válido dentro do intervalo permitido.','fi.m.desc':'Descrição do projecto','fi.m.desc.h':'Explique em poucas linhas o projecto e como vai usar o financiamento (mínimo 20 caracteres).','fi.m.desc.err':'Escreva pelo menos 20 caracteres.','fi.m.send':'Submeter solicitação','fi.m.sending':'A submeter…','fi.m.cancel':'Cancelar','fi.m.ok':'Solicitação submetida com sucesso.','fi.m.fail':'Não foi possível submeter a solicitação. Tente novamente.','fi.m.dup':'Já solicitou esta linha de financiamento.','fi.m.closed':'O prazo para solicitar esta linha terminou.'});
Object.assign(D.en,{'est.aprovado':'Approved','fi.sub':'Entrepreneurship support lines and the follow-up of your requests.','fi.search':'Search by name, organisation or country','fi.search.a':'Search funding lines','fi.toggle':'Filters','fi.pais':'Country','fi.pais.all':'All','fi.sort':'Sort by','fi.sort.new':'Newest','fi.sort.dl':'Closest deadline','fi.open':'Open only','fi.clear':'Clear filters','fi.count':'{n} lines','fi.count.1':'1 line','fi.empty':'There are no published funding lines yet.','fi.none':'No line matches the filters.','fi.more':'Show more','fi.view':'View line','fi.back':'Back to funding','fi.nf':'Line not found','fi.nf.p':'It may have been removed or the address is wrong.',
 'fi.mine':'My requests','fi.notreq':'Not requested yet','fi.canreq':'Not requested','fi.seereq':'View request','fi.st.h':'Request status','fi.requested':'Requested','fi.entity':'Organisation','fi.loc':'Country','fi.val':'Amount','fi.prazo':'Deadline to apply','fi.desc':'Description','fi.req':'Requirements',
 'fi.cta.h':'Do you want to apply for this funding?','fi.go':'Request funding','fi.closed.p':'The deadline to apply for this line has passed.',
 'fi.s.val':'Amount requested','fi.s.date':'Submitted on {d}','fi.s.proj':'Your project','fi.s.p':'Your request has been submitted and is waiting for review.',
 'fi.m.title':'Request funding','fi.m.linha':'Line','fi.m.val':'Amount requested ({m})','fi.m.val.h':'Between {a} and {b}','fi.m.val.h1':'Maximum amount: {b}','fi.m.val.h0':'Enter the amount you need.','fi.m.val.err':'Enter a valid amount within the allowed range.','fi.m.desc':'Project description','fi.m.desc.h':'Briefly explain the project and how you will use the funding (at least 20 characters).','fi.m.desc.err':'Write at least 20 characters.','fi.m.send':'Submit request','fi.m.sending':'Submitting…','fi.m.cancel':'Cancel','fi.m.ok':'Request submitted successfully.','fi.m.fail':'Could not submit the request. Please try again.','fi.m.dup':'You have already requested this funding line.','fi.m.closed':'The deadline to apply for this line has passed.'});

/* v19: menu de três pontos, anexos, retirar solicitação, moeda e estado */
Object.assign(D.pt,{"fi.vd": "Ver detalhe", "fi.s.more": "Ver mais", "fi.menu": "Opções", "fi.mn.sol": "Solicitar financiamento", "fi.mn.ver": "Ver solicitação", "fi.mn.det": "Ver detalhes", "fi.mn.ret": "Retirar solicitação", "fi.mn.lock": "Já em análise: não pode retirar", "fi.mn.closed": "Prazo terminado", "fi.cta.p": "Indique o valor e o projecto e junte pelo menos um documento ou ligação (por exemplo, o plano de negócio). A solicitação segue para análise e pode acompanhá-la nesta página.", "fi.cur": "Moeda", "fi.est": "Estado", "fi.est.all": "Todas", "fi.est.req": "Solicitadas", "fi.est.nreq": "Não solicitadas", "fi.st.dec": "Decisão", "fi.s.dt": "Submetido em", "fi.s.p.submetido": "A sua solicitação foi submetida e aguarda análise.", "fi.s.p.em_analise": "A sua solicitação está a ser analisada.", "fi.s.p.aprovado": "A sua solicitação foi aprovada.", "fi.s.p.rejeitado": "A sua solicitação não foi aprovada.", "fi.r.title": "Retirar solicitação", "fi.r.p": "Vai retirar a sua solicitação de {l}. Os anexos também serão removidos e, enquanto o prazo estiver aberto, poderá solicitar de novo.", "fi.r.go": "Retirar solicitação", "fi.r.ok": "Solicitação retirada.", "fi.r.fail": "Não foi possível retirar a solicitação. Tente novamente.", "fi.r.lock": "Só pode retirar uma solicitação que ainda não está em análise.", "fi.a.h": "Anexos", "fi.a.n": "{n} anexo(s)", "fi.a.hint": "Obrigatório: pelo menos um ficheiro ou ligação (até {n}). PDF, Word, JPG ou PNG, máximo 5 MB cada.", "fi.a.drop": "Arraste ficheiros para aqui", "fi.a.file": "Escolher ficheiro", "fi.a.mine": "Dos meus documentos", "fi.a.mine.h": "Documentos do seu perfil", "fi.a.link": "Adicionar ligação", "fi.a.link.l": "Endereço da ligação", "fi.a.link.err": "Indique um endereço válido (http:// ou https://).", "fi.a.add": "Juntar", "fi.a.added": "Junto", "fi.a.rm": "Remover anexo", "fi.a.open": "Abrir ligação", "fi.a.lk": "Ligação", "fi.a.dl": "Descarregar", "fi.a.err": "Junte pelo menos um ficheiro ou ligação.", "fi.a.max": "Atingiu o limite de {n} anexos.", "fi.a.dup": "Esse anexo já foi adicionado.", "fi.a.fmt": "Formato não suportado", "fi.a.size": "O ficheiro excede 5 MB", "fi.a.empty": "Ficheiro vazio"});
Object.assign(D.en,{"fi.vd": "View details", "fi.s.more": "Read more", "fi.menu": "Options", "fi.mn.sol": "Request funding", "fi.mn.ver": "View request", "fi.mn.det": "View details", "fi.mn.ret": "Withdraw request", "fi.mn.lock": "Already under review: cannot withdraw", "fi.mn.closed": "Deadline passed", "fi.cta.p": "Enter the amount and your project and attach at least one document or link (for example, your business plan). The request goes to review and you can follow it on this page.", "fi.cur": "Currency", "fi.est": "Status", "fi.est.all": "All", "fi.est.req": "Requested", "fi.est.nreq": "Not requested", "fi.st.dec": "Decision", "fi.s.dt": "Submitted on", "fi.s.p.submetido": "Your request has been submitted and is waiting for review.", "fi.s.p.em_analise": "Your request is being reviewed.", "fi.s.p.aprovado": "Your request was approved.", "fi.s.p.rejeitado": "Your request was not approved.", "fi.r.title": "Withdraw request", "fi.r.p": "You are about to withdraw your request for {l}. The attachments will be removed too and, while the deadline is open, you can request again.", "fi.r.go": "Withdraw request", "fi.r.ok": "Request withdrawn.", "fi.r.fail": "Could not withdraw the request. Please try again.", "fi.r.lock": "You can only withdraw a request that is not under review yet.", "fi.a.h": "Attachments", "fi.a.n": "{n} attachment(s)", "fi.a.hint": "Required: at least one file or link (up to {n}). PDF, Word, JPG or PNG, 5 MB maximum each.", "fi.a.drop": "Drag files here", "fi.a.file": "Choose file", "fi.a.mine": "From my documents", "fi.a.mine.h": "Documents from your profile", "fi.a.link": "Add link", "fi.a.link.l": "Link address", "fi.a.link.err": "Enter a valid address (http:// or https://).", "fi.a.add": "Attach", "fi.a.added": "Attached", "fi.a.rm": "Remove attachment", "fi.a.open": "Open link", "fi.a.lk": "Link", "fi.a.dl": "Download", "fi.a.err": "Attach at least one file or link.", "fi.a.max": "You have reached the limit of {n} attachments.", "fi.a.dup": "That attachment was already added.", "fi.a.fmt": "Unsupported format", "fi.a.size": "The file exceeds 5 MB", "fi.a.empty": "Empty file"});

/* dados de teste (linhas de vários países). Em produção: GET /api/financiamento/linhas */
MOCK.finLinhas=MOCK.finLinhas||[
 {id:'l1',pais:'MZ',nome:'Linha de Financiamento Jovem Empreendedor',en:'Young Entrepreneur Funding Line',ent:'Fundo de Apoio ao Empreendedorismo',min:50000,max:200000,moeda:'MZN',cri:'2026-09-20',lim:'2026-11-30',desc:'Apoio financeiro a jovens com ideias de negócio em fase inicial.',descEn:'Financial support for young people with early-stage business ideas.',req:['Idade entre 18 e 35 anos','Plano de negócio simples','Residência no país'],reqEn:['Aged 18 to 35','Simple business plan','Resident in the country']},
 {id:'l2',pais:'MZ',nome:'Apoio a Microempresas Rurais',en:'Support for Rural Microenterprises',ent:'Programa de Desenvolvimento Rural',min:20000,max:100000,moeda:'MZN',cri:'2026-09-10',lim:'2026-10-20',desc:'Financiamento de pequenos negócios agrícolas e de transformação local.',descEn:'Funding for small agricultural and local processing businesses.',req:['Negócio em zona rural','Declaração da comunidade'],reqEn:['Business in a rural area','Community statement']},
 {id:'l3',pais:'AO',nome:'Programa Jovem Empreendedor Angola',en:'Angola Young Entrepreneur Programme',ent:'Entidade de Fomento Empresarial',min:500000,max:2000000,moeda:'AOA',cri:'2026-09-25',lim:'2026-12-15',desc:'Crédito de arranque e mentoria para novos negócios.',descEn:'Start-up credit and mentoring for new businesses.',req:['Maior de 18 anos','Ideia de negócio validada'],reqEn:['Over 18 years old','Validated business idea']},
 {id:'l4',pais:'PT',nome:'Linha Startup Lusófona',en:'Lusophone Startup Line',ent:'Associação de Apoio a Startups',min:5000,max:25000,moeda:'EUR',cri:'2026-09-27',lim:'2026-10-08',desc:'Capital inicial para startups de fundadores de países lusófonos.',descEn:'Seed capital for startups founded by people from Portuguese-speaking countries.',req:['Equipa com pelo menos dois fundadores','Protótipo ou produto mínimo'],reqEn:['Team of at least two founders','Prototype or minimum product']},
 {id:'l5',pais:'ZA',nome:'Fundo de Pequenos Negócios',en:'Small Business Fund',ent:'Small Business Development Agency',min:10000,max:60000,moeda:'ZAR',cri:'2026-08-30',lim:'2026-09-30',desc:'Apoio a pequenos negócios com menos de dois anos de actividade.',descEn:'Support for small businesses under two years old.',req:['Registo da empresa'],reqEn:['Company registration']}];
MOCK.finSol=MOCK.finSol||[];   /* solicitacoes_financiamento (+ anexos = solicitacao_anexos) do candidato: começa vazio; só existe depois de submeter */
const hoje=()=>new Date().toISOString().slice(0,10);
const aberta=l=>new Date(l.lim+'T23:59:59')>=new Date();
const solDe=id=>MOCK.finSol.find(s=>s.linha_id===id)||null;
const linhaDe=id=>MOCK.finLinhas.find(x=>x.id===id);
const resumo=()=>{const s=MOCK.finSol[0],l=s&&linhaDe(s.linha_id);   /* resumo do Dashboard: última solicitação ou null */
 MOCK.financiamento=s?{linha:l.nome,estado:s.estado,valor_solicitado:s.valor,moeda:s.moeda,data_submissao:s.data}:null};
api.finLinhas=()=>wait(MOCK.finLinhas.map(l=>({...l,sol:solDe(l.id)})),200);                          /* GET /api/financiamento/linhas */
api.finLinha=id=>wait((l=>l?{...l,sol:solDe(l.id)}:null)(linhaDe(id)),200);                            /* GET /api/financiamento/linhas/{id} */
/* POST /api/financiamento/solicitacoes (multipart: valor, descricao + 1 a 5 anexos -> solicitacao_anexos: tipo, nome, url, tipo_mime, tamanho_bytes) */
api.finSolicitar=(id,valor,descricao,anexos)=>new Promise((ok,no)=>setTimeout(()=>{
 const l=linhaDe(id);
 if(!l)return no(new Error('nf'));if(!aberta(l))return no(new Error('closed'));if(solDe(id))return no(new Error('dup'));
 if(!(valor>0)||(l.min!=null&&valor<l.min)||(l.max!=null&&valor>l.max))return no(new Error('range'));
 if(!anexos||!anexos.length||anexos.length>MAXA)return no(new Error('anx'));
 const s={id:'s'+Date.now().toString(36),linha_id:id,valor,moeda:l.moeda,descricao,estado:'submetido',data:hoje(),
  anexos:anexos.map(a=>({tipo:a.tipo,nome:a.nome,url:a.file?URL.createObjectURL(a.file):a.url,tipo_mime:a.tipo_mime||'',tamanho_bytes:a.tamanho_bytes||null,own:!!a.file}))};
 MOCK.finSol.unshift(s);resumo();ok(s)},600));
/* DELETE /api/financiamento/solicitacoes/{id}: só com estado 'submetido'; apaga também os solicitacao_anexos (ON DELETE CASCADE) e permite solicitar de novo */
api.finRetirar=id=>new Promise((ok,no)=>setTimeout(()=>{
 const i=MOCK.finSol.findIndex(s=>s.linha_id===id);
 if(i<0)return no(new Error('nf'));if(MOCK.finSol[i].estado!=='submetido')return no(new Error('lock'));
 MOCK.finSol[i].anexos.forEach(a=>a.own&&a.url&&URL.revokeObjectURL(a.url));
 MOCK.finSol.splice(i,1);resumo();ok()},500));

const FI={q:'',pais:'',est:'',sort:'new',abertas:true,n:PG,list:[],det:null,cur:null,anx:[],tm:0};
const loc=()=>lang==='en'?'en-GB':'pt-PT';
const nf=n=>new Intl.NumberFormat(loc()).format(n);
const money=(v,c)=>{try{return fmtM(v,c)}catch(_){return nf(v)+' '+c}};                                   /* qualquer moeda ISO 4217 (linhas_financiamento.moeda) */
const moedaN=c=>{try{return new Intl.DisplayNames(loc(),{type:'currency'}).of(c)||c}catch(_){return c}};
const ld=(l,f)=>lang==='en'&&l[f+'En']?l[f+'En']:l[f];
const faixa=l=>l.min==null?'':l.max&&l.max!==l.min?`${nf(l.min)} – ${money(l.max,l.moeda)}`:money(l.min,l.moeda);
function prazo(l){const ms=new Date(l.lim+'T23:59:59')-new Date();if(ms<0)return[t('op.closed'),'no'];const d=Math.ceil(ms/864e5);
 if(d<=1)return[t('op.dl.today'),'warn'];if(d<=8)return[t(d-1===1?'op.dl.day':'op.dl.days',{n:d-1}),'warn'];return[t('op.dl.until',{d:fmtD(l.lim)}),'']}
const tom=e=>({aprovado:'ok',rejeitado:'no',em_analise:'in'}[e]||'in');
const nome=l=>lang==='en'&&l.en?l.en:l.nome;
const lineById=id=>FI.det&&FI.det.id===id?FI.det:FI.list.find(x=>x.id===id)||null;
const go=id=>{const h='#/financiamento/'+id;if(location.hash===h)dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=h};
const refresh=()=>dispatchEvent(new HashChangeEvent('hashchange'));

/* ---------- ficheiros e ligações ---------- */
const extOf=n=>(String(n).split('.').pop()||'').toLowerCase();
const ico=n=>({pdf:'fa-file-pdf',doc:'fa-file-word',docx:'fa-file-word',jpg:'fa-file-image',jpeg:'fa-file-image',png:'fa-file-image'}[extOf(n)]||'fa-file');
const fsz=b=>b<1048576?Math.max(1,Math.round(b/1024))+' KB':new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(b/1048576)+' MB';
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(_){return String(u)}};
const safeHref=u=>/^(https?:|blob:)/i.test(u)?u:'#';
const aIco=a=>a.tipo==='link'?'fa-link':ico(a.nome);
const aMeta=a=>a.tipo==='link'?t('fi.a.lk'):[extOf(a.nome).toUpperCase(),a.tamanho_bytes?fsz(a.tamanho_bytes):''].filter(Boolean).join(' · ');
const docsPerfil=()=>((MOCK.pf&&MOCK.pf.documentos)||[]).filter(d=>d.url);       /* candidato_documentos já anexados no Perfil */
const anxRow=(a,act)=>`<li class="fx-ai"><span class="pfic" aria-hidden="true"><i class="fas ${aIco(a)}"></i></span><div class="rb"><div class="rt">${esc(a.nome)}</div><div class="rs">${esc(aMeta(a))}</div></div>${act}</li>`;
const anxList=arr=>`<ul class="fx-al">${arr.map(a=>anxRow(a,a.tipo==='link'
 ?`<a class="ib sm" href="${esc(safeHref(a.url))}" target="_blank" rel="noopener noreferrer" aria-label="${t('fi.a.open')}: ${esc(a.nome)}"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>`
 :`<a class="ib sm" href="${esc(safeHref(a.url))}" download="${esc(a.nome)}" aria-label="${t('fi.a.dl')}: ${esc(a.nome)}"><i class="fas fa-download" aria-hidden="true"></i></a>`)).join('')}</ul>`;

/* ---------- menu de três pontos (solicitar / ver / retirar) ---------- */
function menuHtml(l,det){
 const s=l.sol,ab=aberta(l);
 const it=(a,i,k,o={})=>`<button class="fx-mi${o.d?' d':''}" type="button" role="menuitem" data-a="${a}:${esc(l.id)}"${o.off?' disabled':''}><i class="fas ${i}" aria-hidden="true"></i><span>${t(k)}${o.sub?`<small>${t(o.sub)}</small>`:''}</span></button>`;
 const items=s
  ?[det?'':it('fi-ver','fa-eye','fi.mn.ver'),it('fi-ret','fa-rotate-left','fi.mn.ret',{d:1,off:s.estado!=='submetido',sub:s.estado!=='submetido'?'fi.mn.lock':''})]
  :[it('fi-sol','fa-paper-plane','fi.mn.sol',{off:!ab,sub:ab?'':'fi.mn.closed'}),det?'':it('fi-ver','fa-eye','fi.mn.det')];
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="fi-menu:${esc(l.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${t('fi.menu')}: ${esc(nome(l))}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.join('')}</div></div>`;
}
const closeFx=focus=>document.querySelectorAll('.fx-menu.on').forEach(m=>{m.classList.remove('on');const k=m.previousElementSibling;k.setAttribute('aria-expanded','false');const c=m.closest('.vc');c&&c.classList.remove('fx-open');if(focus)k.focus()});
const fxMenu=(pre,id,label,items)=>{
 const it=([a,i,k,o={}])=>`<button class="fx-mi${o.d?' d':''}" type="button" role="menuitem" data-a="${a}:${esc(id)}"${o.off?' disabled':''}><i class="fas ${i}" aria-hidden="true"></i><span>${t(k)}${o.sub?`<small>${t(o.sub)}</small>`:''}</span></button>`;
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="${pre}-menu:${esc(id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${esc(label)}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.filter(Boolean).map(it).join('')}</div></div>`};
window.LRM_FX={close:closeFx,menu:fxMenu};   /* partilhado com Eventos e Candidaturas (abrir/fechar, Esc e setas já são globais) */
Actions['fi-menu']=b=>{const m=b.nextElementSibling,on=!m.classList.contains('on');closeFx();
 if(on){m.classList.add('on');b.setAttribute('aria-expanded','true');const c=b.closest('.vc');c&&c.classList.add('fx-open');const f=m.querySelector('button:not([disabled])');f&&f.focus()}};
Actions['fi-ver']=(b,id)=>{closeFx();go(id)};

/* ---------- lista ---------- */
function filtrar(est=FI.est){
 const q=norm(FI.q.trim());
 const r=FI.list.filter(l=>(!FI.pais||l.pais===FI.pais)&&(!FI.abertas||aberta(l)||l.sol)&&(est!=='req'||l.sol)&&(est!=='nreq'||!l.sol)&&(!q||norm([l.nome,l.en||'',l.ent,paisN(l.pais),l.moeda].join(' ')).includes(q)));
 return r.sort(FI.sort==='dl'?(a,b)=>a.lim.localeCompare(b.lim):(a,b)=>b.cri.localeCompare(a.cri));
}
function card(l){
 const pz=prazo(l),r=faixa(l),s=l.sol;
 const sinal=s?`<span class="tag ${tom(s.estado)}"><i class="fas fa-check" aria-hidden="true"></i> ${t('est.'+s.estado)}</span>`:aberta(l)?`<span class="tag">${t('fi.canreq')}</span>`:'';
 return `<article class="vc${s?' req':''}"><div class="vh"><span class="ic"><i class="fas fa-seedling" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/financiamento/${esc(l.id)}">${esc(nome(l))}</a></h2><div class="rs">${esc(l.ent)}</div></div>${menuHtml(l)}</div>
 <div class="chips"><span class="tag in">${esc(paisN(l.pais))}</span>${sinal}</div>
 <ul class="meta"><li class="${pz[1]}"><i class="fas fa-clock" aria-hidden="true"></i>${esc(pz[0])}</li>${r?`<li title="${esc(moedaN(l.moeda))}"><i class="fas fa-coins" aria-hidden="true"></i>${esc(r)}</li>`:''}</ul>
 <a class="btn btn-l" href="#/financiamento/${esc(l.id)}">${t('fi.vd')}</a></article>`;
}
const nFiltros=()=>(FI.pais?1:0)+(FI.abertas?0:1)+(FI.sort!=='new'?1:0);
function updFiltros(){const n=nFiltros(),tg=$('#fiTog'),cl=$('#fiClr');if(!tg)return;tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!FI.q&&!FI.est}
const opts=(arr,sel,lbl)=>arr.map(x=>`<option value="${esc(x)}"${x===sel?' selected':''}>${esc(lbl(x))}</option>`).join('');
let pReady=null;
const loadPaises=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
function updSeg(){
 document.querySelectorAll('#fiSeg button').forEach(b=>{const v=b.dataset.a.split(':')[1];b.setAttribute('aria-pressed',String(FI.est===v));b.querySelector('b').textContent=filtrar(v).length})}
function renderRes(){
 const box=$('#fiRes');if(!box)return;updSeg();
 const r=filtrar(),c=$('#fiCount');
 c.textContent=t(r.length===1?'fi.count.1':'fi.count',{n:r.length});
 if(!FI.list.length){box.innerHTML=`<div class="state card"><i class="fas fa-seedling" aria-hidden="true"></i>${t('fi.empty')}</div>`;c.textContent='';return}
 if(!r.length){box.innerHTML=`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('fi.none')}</p><br><button class="btn btn-l" type="button" data-a="fi-clear">${t('fi.clear')}</button></div>`;return}
 const show=r.slice(0,FI.n);
 box.innerHTML=`<div class="vgrid">${show.map(card).join('')}</div>`+(r.length>show.length?`<div class="more"><button class="btn btn-l" type="button" data-a="fi-more">${t('fi.more')} (${r.length-show.length})</button></div>`:'');
}
async function lista(){
 await loadPaises();FI.list=await api.finLinhas();FI.det=null;
 return{title:t('n.fin'),after:()=>{renderRes();updFiltros()},html:
  crumbs([[t('n.dash'),'#/dashboard'],[t('n.fin')]])+
  `<div class="ph"><div><h1>${t('n.fin')}</h1><p class="rs wrap">${t('fi.sub')}</p></div><p class="rs" id="fiCount" aria-live="polite"></p></div>
  <form class="flt${nFiltros()?' open':''}" id="fiF" role="search" aria-label="${t('n.fin')}">
   <div class="fld fq"><label class="sr" for="fiQ">${t('fi.search.a')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="fiQ" type="search" value="${esc(FI.q)}" placeholder="${t('fi.search')}" autocomplete="off" maxlength="80"></div></div>
   <button class="btn btn-l" id="fiTog" type="button" data-a="fi-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="fiSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('fi.toggle')} <b class="bd" hidden></b></button>
   <div class="fsec" id="fiSec">
    <div class="fld"><label for="fiPais">${t('fi.pais')}</label><select id="fiPais" data-f="pais"><option value="">${t('fi.pais.all')}</option>${opts(paisesOrd(),FI.pais,paisN)}</select></div>
    <div class="fld"><label for="fiSort">${t('fi.sort')}</label><select id="fiSort" data-f="sort"><option value="new"${FI.sort==='new'?' selected':''}>${t('fi.sort.new')}</option><option value="dl"${FI.sort==='dl'?' selected':''}>${t('fi.sort.dl')}</option></select></div>
    <label class="chk"><input type="checkbox" id="fiAb" data-f="abertas"${FI.abertas?' checked':''}> ${t('fi.open')}</label>
    <button class="btn btn-l" id="fiClr" type="button" data-a="fi-clear">${t('fi.clear')}</button>
   </div></form>
  <div class="fx-seg" id="fiSeg" role="group" aria-label="${t('fi.est')}">${[['','fi.est.all'],['req','fi.est.req'],['nreq','fi.est.nreq']].map(([v,k])=>`<button type="button" data-a="fi-est:${v}" aria-pressed="${FI.est===v}">${t(k)} <b></b></button>`).join('')}</div>
  <div id="fiRes" aria-live="polite"></div>`};
}

/* ---------- detalhe ---------- */
function passos(s){
 const e=s.estado,idx={submetido:0,em_analise:1,aprovado:2,rejeitado:2}[e]??0;
 const lab=[t('est.submetido'),t('est.em_analise'),e==='aprovado'||e==='rejeitado'?t('est.'+e):t('fi.st.dec')];
 return `<ol class="fx-steps" aria-label="${t('fi.st.h')}">${lab.map((x,i)=>`<li class="${i<idx?'done':i===idx?'cur'+(i===2?(e==='aprovado'?' ok':' no'):''):''}"${i===idx?' aria-current="step"':''}><span class="dot" aria-hidden="true"></span><span>${x}</span></li>`).join('')}</ol>`;
}
function barra(l){
 const a=new Date(l.cri+'T00:00:00'),b=new Date(l.lim+'T23:59:59'),p=Math.max(0,Math.min(100,Math.round((Date.now()-a)/(b-a)*100)));
 return isNaN(p)?'':`<div class="fx-bar" role="img" aria-label="${esc(prazo(l)[0])}"><span><i style="width:${p}%"></i></span></div>`;
}
function detalheHtml(l){
 const pz=prazo(l),ab=aberta(l),s=l.sol,r=faixa(l);
 const fact=(i,k,v)=>v?`<div><dt><i class="fas ${i}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(v)}</dd></div>`:'';
 const rq=ld(l,'req');
 const top=h=>`<div class="fx-top"><h2 class="fx-h">${h}</h2>${menuHtml(l,true)}</div>`;
 const cta=s
  ?top(t('fi.st.h'))+passos(s)+`<span class="tag ${tom(s.estado)}">${t('est.'+s.estado)}</span><dl class="facts" style="margin:.2rem 0;width:100%"><div><dt>${t('fi.s.val')}</dt><dd>${esc(money(s.valor,s.moeda))}</dd></div><div><dt>${t('fi.s.dt')}</dt><dd>${fmtD(s.data)}</dd></div></dl><div class="fx-box"><h3>${t('fi.s.proj')}</h3><p class="fx-prev">${esc(s.descricao.length>140?s.descricao.slice(0,140).trimEnd()+'…':s.descricao)}</p>${s.descricao.length>140?`<button class="btn btn-l btn-s" type="button" data-a="fi-proj:${esc(l.id)}"><i class="fas fa-expand" aria-hidden="true"></i> ${t('fi.s.more')}</button>`:''}</div><div class="fx-box"><h3>${t('fi.a.h')} <span>(${s.anexos.length})</span></h3>${anxList(s.anexos)}</div><p class="rs wrap">${t('fi.s.p.'+s.estado)}</p>`
  :ab?top(t('fi.go'))+`<span class="tag">${t('fi.notreq')}</span><div class="apx"><strong>${t('fi.cta.h')}</strong><p>${t('fi.cta.p')}</p></div>${barra(l)}<button class="btn btn-g" type="button" data-a="fi-sol:${esc(l.id)}"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('fi.go')}</button>`
  :top(t('fi.go'))+`<p class="rs wrap">${t('fi.closed.p')}</p><button class="btn btn-g" type="button" disabled>${t('fi.go')}</button>`;
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.fin'),'#/financiamento'],[nome(l)]])+
 `<div class="vtop"><a class="btn btn-l" href="#/financiamento"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('fi.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det fxd"><article class="card"><header><h1>${esc(nome(l))}</h1><p class="rs wrap">${esc(l.ent)}</p>
  <div class="chips"><span class="tag in">${esc(paisN(l.pais))}</span><span class="tag in" title="${esc(moedaN(l.moeda))}">${esc(l.moeda)}</span><span class="tag ${pz[1]==='no'?'no':''}">${esc(pz[0])}</span>${s?`<span class="tag ${tom(s.estado)}">${t('fi.requested')}</span>`:''}</div></header>
  <dl class="facts">${fact('fa-building-columns','fi.entity',l.ent)}${fact('fa-location-dot','fi.loc',paisN(l.pais))}${fact('fa-coins','fi.val',r)}${fact('fa-money-bill-wave','fi.cur',`${moedaN(l.moeda)} (${l.moeda})`)}${fact('fa-clock','fi.prazo',fmtD(l.lim))}</dl>
  <h2>${t('fi.desc')}</h2><p>${esc(ld(l,'desc'))}</p>
  ${rq&&rq.length?`<h2>${t('fi.req')}</h2><ul class="reqs">${rq.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</article>
 <aside class="card cta" aria-label="${t('fi.go')}">${cta}</aside></div>`;
}
async function detalhe(id){
 const l=await api.finLinha(id);FI.det=l;
 if(!l)return{title:t('n.fin'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.fin'),'#/financiamento'],[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('fi.nf')}</h1><p>${t('fi.nf.p')}</p><br><a class="btn btn-g" href="#/financiamento"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('fi.back')}</a></div>`};
 return{title:nome(l),html:detalheHtml(l)};
}
Views.financiamento=id=>id?detalhe(id):lista();

/* ---------- solicitação (modal): valor, descrição e anexos ---------- */
const say=(k,x)=>{const ae=$('#fiAE');if(!ae)return;ae.textContent=k?t(k,{n:MAXA})+(x?' ('+x+')':''):'';ae.hidden=!k};
const put=a=>FI.anx.length>=MAXA?'fi.a.max':FI.anx.some(x=>x.key===a.key)?'fi.a.dup':(FI.anx.push(a),'');
function renderMine(){
 const mp=$('#fiMine');if(!mp)return;
 mp.innerHTML=`<p class="rs" style="margin-bottom:.2rem">${t('fi.a.mine.h')}</p><ul class="fx-al">`+docsPerfil().map(d=>{const on=FI.anx.some(a=>a.src===d.id);
  return anxRow({tipo:'ficheiro',nome:d.nome_ficheiro,tamanho_bytes:d.tamanho_bytes},`<button class="btn btn-l btn-s" type="button" data-a="fi-a-doc:${esc(d.id)}"${on?' disabled':''}>${t(on?'fi.a.added':'fi.a.add')}</button>`)}).join('')+'</ul>';
}
function renderAnx(){
 const al=$('#fiAl');if(!al)return;
 al.innerHTML=FI.anx.map((a,i)=>anxRow(a,`<button class="ib sm" type="button" data-a="fi-a-rm:${i}" aria-label="${t('fi.a.rm')}: ${esc(a.nome)}"><i class="fas fa-xmark" aria-hidden="true"></i></button>`)).join('');
 $('#fiAc').textContent=FI.anx.length?`${FI.anx.length}/${MAXA}`:'';
 $('#fiAx').classList.remove('invalid');
 const mp=$('#fiMine');if(mp&&!mp.hidden)renderMine();
}
function addFiles(list){
 let k='',x='';
 for(const f of list){
  const e=!f.size?'fi.a.empty':(!EXTS.includes(extOf(f.name))||f.name.length>255)?'fi.a.fmt':f.size>MAXB?'fi.a.size':'';
  if(e){k=k||e;x=x||f.name;continue}
  const r=put({tipo:'ficheiro',nome:f.name,tipo_mime:f.type||'',tamanho_bytes:f.size,file:f,key:'f:'+f.name+':'+f.size});
  if(r){k=k||r;x=x||f.name;if(r==='fi.a.max')break}}
 renderAnx();say(k,x);
}
function addLink(){
 const i=$('#fiLnk'),le=$('#fiLE');let v=i.value.trim();
 if(v&&!/^[a-z][a-z0-9+.-]*:/i.test(v))v='https://'+v;
 let ok=false;try{const u=new URL(v);ok=/^https?:$/.test(u.protocol)&&u.hostname.includes('.')&&v.length<=2048}catch(_){}
 i.closest('.fld').classList.toggle('invalid',!ok);le.hidden=ok;
 if(!ok){i.focus();return}
 const r=put({tipo:'link',nome:v.replace(/^https?:\/\//i,'').slice(0,255),url:v,key:'l:'+v});
 if(r){say(r);return}
 i.value='';renderAnx();say('');i.focus();
}
const anxBox=()=>`<fieldset class="fxs" id="fiAx"><legend>${t('fi.a.h')} <span class="rs" id="fiAc"></span></legend>
 <p class="fh" style="margin-bottom:.5rem"><span>${t('fi.a.hint',{n:MAXA})}</span></p>
 <div class="fx-drop" id="fiDrop"><p><i class="fas fa-cloud-arrow-up" aria-hidden="true"></i>${t('fi.a.drop')}</p>
  <div class="fx-acts"><button class="btn btn-l btn-s" type="button" data-a="fi-a-pick"><i class="fas fa-paperclip" aria-hidden="true"></i> ${t('fi.a.file')}</button>${docsPerfil().length?`<button class="btn btn-l btn-s" type="button" data-a="fi-a-mine" aria-expanded="false" aria-controls="fiMine"><i class="fas fa-folder-open" aria-hidden="true"></i> ${t('fi.a.mine')}</button>`:''}<button class="btn btn-l btn-s" type="button" data-a="fi-a-link" aria-expanded="false" aria-controls="fiLnkP"><i class="fas fa-link" aria-hidden="true"></i> ${t('fi.a.link')}</button></div>
  <input class="sr" id="fiFile" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" tabindex="-1" aria-hidden="true"></div>
 <div class="fx-pan" id="fiLnkP" hidden><div class="fld"><label for="fiLnk">${t('fi.a.link.l')}</label><div class="fx-lr"><input id="fiLnk" type="text" inputmode="url" maxlength="2048" placeholder="https://" autocomplete="off"><button class="btn btn-g btn-s" type="button" data-a="fi-a-ladd">${t('fi.a.add')}</button></div><p class="ferr" id="fiLE" role="alert" hidden>${t('fi.a.link.err')}</p></div></div>
 <div class="fx-pan" id="fiMine" hidden></div>
 <ul class="fx-al" id="fiAl"></ul><p class="ferr" id="fiAE" role="alert" hidden></p></fieldset>`;
Actions['fi-a-pick']=()=>$('#fiFile').click();
Actions['fi-a-mine']=b=>{const p=$('#fiMine'),on=p.hidden;p.hidden=!on;b.setAttribute('aria-expanded',on);if(on)renderMine()};
Actions['fi-a-link']=b=>{const p=$('#fiLnkP'),on=p.hidden;p.hidden=!on;b.setAttribute('aria-expanded',on);if(on)$('#fiLnk').focus()};
Actions['fi-a-ladd']=addLink;
Actions['fi-a-doc']=(b,id)=>{const d=docsPerfil().find(x=>x.id===id);if(!d)return;
 const r=put({tipo:'ficheiro',nome:d.nome_ficheiro,tipo_mime:d.tipo_mime,tamanho_bytes:d.tamanho_bytes,url:d.url,src:d.id,key:'d:'+d.id});renderAnx();say(r)};
Actions['fi-a-rm']=(b,i)=>{FI.anx.splice(Number(i),1);renderAnx();say('')};

Actions['fi-sol']=(b,id)=>{
 closeFx(true);
 const l=lineById(id);if(!l||l.sol||!aberta(l))return;
 FI.cur=l;FI.anx=[];
 const h=l.min!=null&&l.max!=null&&l.max!==l.min?t('fi.m.val.h',{a:money(l.min,l.moeda),b:money(l.max,l.moeda)}):l.max!=null?t('fi.m.val.h1',{b:money(l.max,l.moeda)}):t('fi.m.val.h0');
 const mb=Modal.open({title:t('fi.m.title'),body:`<form id="fiS" novalidate>
  <p class="rs wrap" style="margin-bottom:1rem"><strong>${t('fi.m.linha')}:</strong> ${esc(nome(l))} · ${esc(l.ent)}</p>
  <div class="fld"><label for="fiV">${t('fi.m.val',{m:l.moeda})}</label><div class="fx-amt"><span class="fx-cur" aria-hidden="true">${esc(l.moeda)}</span><input id="fiV" type="number" inputmode="numeric" min="${l.min??1}"${l.max!=null?` max="${l.max}"`:''} step="1" aria-describedby="fiVH fiVE"></div><div class="fh"><span id="fiVH">${h}</span><span>${esc(moedaN(l.moeda))}</span></div><p class="ferr" id="fiVE" role="alert" hidden>${t('fi.m.val.err')}</p></div>
  <div class="fld" style="margin-top:.9rem"><label for="fiD">${t('fi.m.desc')}</label><textarea id="fiD" rows="4" maxlength="1000" aria-describedby="fiDH fiDE"></textarea><div class="fh"><span id="fiDH">${t('fi.m.desc.h')}</span><span id="fiDC">0/1000</span></div><p class="ferr" id="fiDE" role="alert" hidden>${t('fi.m.desc.err')}</p></div>
  ${anxBox()}
  <p class="ferr box" id="fiFail" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('fi.m.cancel')}</button><button class="btn btn-g" id="fiGo" type="submit"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('fi.m.send')}</button></div></form>`});
 mb.querySelector('.mod').style.width='min(620px,100%)';renderAnx();
};
Actions['fi-proj']=(b,id)=>{
 const l=lineById(id);if(!l||!l.sol)return;
 Modal.open({title:t('fi.s.proj'),body:`<p class="rs wrap" style="margin-bottom:.7rem"><strong>${esc(nome(l))}</strong></p><div class="fx-full" tabindex="0">${esc(l.sol.descricao)}</div><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('modal.close')}</button></div>`}).querySelector('.mod').style.width='min(640px,100%)';
};
Actions['fi-ret']=(b,id)=>{
 closeFx(true);
 const l=lineById(id);if(!l||!l.sol||l.sol.estado!=='submetido')return;
 Modal.open({title:t('fi.r.title'),body:`<p class="wrap" style="line-height:1.6">${t('fi.r.p',{l:'<strong>'+esc(nome(l))+'</strong>'})}</p><p class="ferr box" id="fiRF" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('fi.m.cancel')}</button><button class="btn btn-d" type="button" data-a="fi-ret-ok:${esc(id)}"><i class="fas fa-rotate-left" aria-hidden="true"></i> ${t('fi.r.go')}</button></div>`});
};
Actions['fi-ret-ok']=async(b,id)=>{
 const f=$('#fiRF');f.hidden=true;b.disabled=true;
 try{await api.finRetirar(id);Modal.close();invalidate();toast(t('fi.r.ok'));refresh()}
 catch(x){f.textContent=t(x.message==='lock'?'fi.r.lock':'fi.r.fail');f.hidden=false;b.disabled=false}
};
document.addEventListener('submit',async e=>{
 if(e.target.id==='fiF'){e.preventDefault();return}
 if(e.target.id!=='fiS')return;
 e.preventDefault();
 const l=FI.cur,vi=$('#fiV'),di=$('#fiD'),btn=$('#fiGo'),fail=$('#fiFail');fail.hidden=true;
 const v=Number(vi.value),desc=di.value.trim();
 const vBad=!vi.value||!(v>0)||(l.min!=null&&v<l.min)||(l.max!=null&&v>l.max),dBad=desc.length<20,aBad=!FI.anx.length;
 [[vi,vBad,'fiVE'],[di,dBad,'fiDE']].forEach(([el,bad,eid])=>{el.closest('.fld').classList.toggle('invalid',bad);el.setAttribute('aria-invalid',String(bad));$('#'+eid).hidden=!bad});
 $('#fiAx').classList.toggle('invalid',aBad);if(aBad)say('fi.a.err');
 if(vBad||dBad||aBad){(vBad?vi:dBad?di:$('#fiAx .fx-acts button')).focus();return}
 btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t('fi.m.sending')}`;
 try{await api.finSolicitar(l.id,v,desc,FI.anx);Modal.close();invalidate();toast(t('fi.m.ok'));go(l.id)}
 catch(x){fail.textContent=t(x.message==='dup'?'fi.m.dup':x.message==='closed'?'fi.m.closed':x.message==='range'?'fi.m.val.err':x.message==='anx'?'fi.a.err':'fi.m.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=`<i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('fi.m.send')}`}
});

/* ---------- filtros, menu e anexos (eventos) ---------- */
document.addEventListener('input',e=>{
 if(e.target.id==='fiQ'){FI.q=e.target.value;clearTimeout(FI.tm);FI.tm=setTimeout(()=>{FI.n=PG;renderRes();updFiltros()},120)}
 else if(e.target.id==='fiD'){$('#fiDC').textContent=e.target.value.length+'/1000'}
});
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.id==='fiFile'){addFiles([...el.files]);el.value='';return}
 const k=el.dataset&&el.dataset.f;if(!k||!el.closest('#fiF'))return;
 FI[k]=el.type==='checkbox'?el.checked:el.value;FI.n=PG;renderRes();updFiltros();
});
document.addEventListener('click',e=>{if(!e.target.closest('.fx-dd'))closeFx()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.querySelector('.fx-menu.on')){e.stopPropagation();closeFx(true);return}
 const m=e.target.closest&&e.target.closest('.fx-menu');
 if(m&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();const it=[...m.querySelectorAll('button:not([disabled])')],i=it.indexOf(document.activeElement);it[(i+(e.key==='ArrowDown'?1:-1)+it.length)%it.length].focus()}
 if(e.key==='Enter'&&e.target.id==='fiLnk'){e.preventDefault();addLink()}
},true);
['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{const d=e.target.closest&&e.target.closest('#fiDrop');if(d){e.preventDefault();d.classList.add('over')}}));
document.addEventListener('dragleave',e=>{const d=e.target.closest&&e.target.closest('#fiDrop');if(d&&!d.contains(e.relatedTarget))d.classList.remove('over')});
document.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('#fiDrop');if(!d)return;e.preventDefault();d.classList.remove('over');addFiles([...e.dataTransfer.files])});
Actions['fi-est']=(b,v)=>{FI.est=v||'';FI.n=PG;renderRes();updFiltros()};
Actions['fi-more']=()=>{FI.n+=PG;renderRes()};
Actions['fi-clear']=()=>{Object.assign(FI,{q:'',pais:'',est:'',sort:'new',abertas:true,n:PG});
 const f=$('#fiF');if(f){f.reset();$('#fiQ').value='';$('#fiPais').value='';$('#fiSort').value='new';$('#fiAb').checked=true}renderRes();updFiltros();if(f)$('#fiQ').focus()};
Actions['fi-tog']=b=>{const on=!$('#fiF').classList.contains('open');$('#fiF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
})();
