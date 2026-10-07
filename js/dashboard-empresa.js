'use strict';
/* Painel da Empresa — Etapa 1: estrutura e todos os menus.
   Usa o mesmo motor do painel do candidato (js/dashboard-candidato.js): router por hash, Views, Actions, Modal, pesquisa, idioma, loader.
   Cada área nova regista-se com Views.<area>=async(id)=>({html,after}) num ficheiro js/empresa-<area>.js (próximas etapas). */

/* ===== 1. Sessão simulada (substituir por JWT/cookie do Spring Security). utilizadores.tipo = 'empresa' ===== */
const Session={KEY:'lermo-session',
 raw(){try{const s=JSON.parse(localStorage.getItem(this.KEY));return s&&s.exp>Date.now()?s:null}catch(e){return null}},
 get(){const s=this.raw();return s&&s.tipo!=='candidato'?s:null},      /* conta de candidato não entra aqui */
 start(u){localStorage.setItem(this.KEY,JSON.stringify({...u,exp:Date.now()+864e5}))},
 end(){localStorage.removeItem(this.KEY)}};
/* empresa demo: utilizadores (tipo='empresa'); nome_completo = nome da empresa (como no registo) */
const DEMO={utilizador_id:'u-demo-emp',nome_completo:'Tecnologias Índico',email:'rh@indico.co.mz',telefone:'+258840000001',pais:'MZ',tipo:'empresa'};
if(new URLSearchParams(location.search).get('demo')==='1'&&!Session.get())Session.start(DEMO);
{const r=Session.raw();if(!r)location.replace('login.html');else if(r.tipo==='candidato')location.replace('dashboard-candidato.html')}

/* ===== 2. Camada de dados (mock). Cada método -> futuro GET /api/... ===== */
const MOCK={plano:'premium'};   /* assinaturas_empresas.plano_id -> planos_assinatura.nome: gratuito | basico | premium | enterprise */
const wait=(v,ms=350)=>new Promise(r=>setTimeout(()=>r(structuredClone(v)),ms));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
/* Pesquisa global (por agora só as áreas do menu). Em produção: GET /api/empresa/pesquisa?q=... (vagas, candidaturas, talentos, anúncios) */
function pesquisar(q){
 const n=norm(q).trim(),hit=(...f)=>f.some(x=>norm(x).includes(n));
 const it=NAV.filter(a=>hit(t(a.k),AREAS[a.id][lang].d)).map(a=>({t:t(a.k),s:AREAS[a.id][lang].d,h:'#/'+a.id}));
 return it.length?[{g:'q.areas',i:'fa-compass',items:it.slice(0,6)}]:[];
}
const api={
 pesquisar:q=>wait(pesquisar(q),120),
 me:()=>wait(Session.get(),0)      /* GET /api/me */
};

/* ===== 3. i18n PT/EN (chave partilhada com o resto do site) ===== */
const D={pt:{
 'ld.boot':'A preparar o painel da empresa…','ld.out':'A terminar sessão…','logout':'Terminar sessão','modal.close':'Fechar',
 'q.ph':'Pesquisar áreas do painel…','q.aria':'Pesquisar na plataforma','q.none':'Sem resultados para "{q}".','q.areas':'Áreas','q.open':'Abrir pesquisa','q.close':'Fechar pesquisa',
 'g.menu':'Menu','g.conta':'Conta',
 'n.form':'Formação','n.fin':'Financiamento','n.emp':'Empreendedorismo','n.equipa':'Equipa','g.rec':'Recrutamento','g.pub':'Publicar e gerir','g.gest':'Gestão','st.sql':'Alterações ao SQL (v5.9)',
 'n.dash':'Dashboard','n.vagas':'Vagas','n.cand':'Candidaturas','n.tal':'Talentos','n.ev':'Eventos','n.mkt':'Marketplace','n.rel':'Relatórios','n.plano':'Plano e pagamentos','n.perfil':'Perfil da empresa','n.def':'Definições',
 'hi':'Olá, {n}','hi.p':'Este é o centro de controlo do recrutamento e dos negócios da sua empresa. Escolha uma área no menu.','hi.cta':'Gerir vagas','map.h':'Áreas do painel','open':'Abrir',
 'st.h':'Secções previstas','st.db':'Dados (SQL v5.12)','st.next':'Próxima etapa','plan':'Plano {p}',
 'plano.gratuito':'Gratuito','plano.basico':'Básico','plano.premium':'Premium','plano.enterprise':'Enterprise',
 'err':'Não foi possível carregar os dados.','retry':'Tentar novamente','top':'Voltar ao topo','menuOpen':'Abrir menu','menuClose':'Fechar menu','rail':'Recolher ou expandir menu','userAria':'Conta da empresa','langAria':'Alternar idioma'},
en:{
 'ld.boot':'Preparing the company dashboard…','ld.out':'Logging out…','logout':'Log out','modal.close':'Close',
 'q.ph':'Search dashboard areas…','q.aria':'Search the platform','q.none':'No results for "{q}".','q.areas':'Areas','q.open':'Open search','q.close':'Close search',
 'g.menu':'Menu','g.conta':'Account',
 'n.form':'Training','n.fin':'Funding','n.emp':'Entrepreneurship','n.equipa':'Team','g.rec':'Recruitment','g.pub':'Publish and manage','g.gest':'Management','st.sql':'SQL changes (v5.9)',
 'n.dash':'Dashboard','n.vagas':'Jobs','n.cand':'Applications','n.tal':'Talent','n.ev':'Events','n.mkt':'Marketplace','n.rel':'Reports','n.plano':'Plan and payments','n.perfil':'Company profile','n.def':'Settings',
 'hi':'Hello, {n}','hi.p':'This is the control centre for your company recruitment and business. Pick an area in the menu.','hi.cta':'Manage jobs','map.h':'Dashboard areas','open':'Open',
 'st.h':'Planned sections','st.db':'Data (SQL v5.12)','st.next':'Next step','plan':'{p} plan',
 'plano.gratuito':'Free','plano.basico':'Basic','plano.premium':'Premium','plano.enterprise':'Enterprise',
 'err':'Could not load the data.','retry':'Try again','top':'Back to top','menuOpen':'Open menu','menuClose':'Close menu','rail':'Collapse or expand menu','userAria':'Company account','langAria':'Switch language'}};
let lang='pt';try{lang=localStorage.getItem('lermo-lang')==='en'?'en':'pt'}catch(e){}
const t=(k,v)=>{let s=(D[lang][k]??D.pt[k]??k);if(v)for(const x in v)s=s.replace('{'+x+'}',v[x]);return s};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);

/* ===== 4. Mapa de navegação: cada menu corresponde a tabelas do SQL v5.12 (lermo_database_v5_12.sql) ===== */
const NAV=[
 {id:'dashboard',i:'fa-gauge-high',k:'n.dash',g:'g.menu'},
 {id:'vagas',i:'fa-briefcase',k:'n.vagas',g:'g.rec'},
 {id:'candidaturas',i:'fa-file-signature',k:'n.cand'},
 {id:'talentos',i:'fa-users-viewfinder',k:'n.tal'},
 {id:'formacao',i:'fa-graduation-cap',k:'n.form',g:'g.pub'},
 {id:'eventos',i:'fa-calendar-days',k:'n.ev'},
 {id:'financiamento',i:'fa-hand-holding-dollar',k:'n.fin'},
 {id:'empreendedorismo',i:'fa-lightbulb',k:'n.emp'},
 {id:'marketplace',i:'fa-store',k:'n.mkt'},
 {id:'relatorios',i:'fa-chart-line',k:'n.rel',g:'g.gest'},
 {id:'equipa',i:'fa-user-group',k:'n.equipa'},
 {id:'plano',i:'fa-credit-card',k:'n.plano',g:'g.conta'},
 {id:'perfil',i:'fa-building',k:'n.perfil'},
 {id:'definicoes',i:'fa-gear',k:'n.def'}
];
/* db = tabelas do SQL (lermo_database_v5_12.sql) que a área usa; novo = o que a secção «v5.9 — Painel da empresa» desse ficheiro acrescenta */
const AREAS={
 dashboard:{db:['vagas','candidaturas','assinaturas_empresas','vagas_mensais_consumidas'],
  pt:{d:'Resumo da actividade de recrutamento, publicações e negócios da empresa.',s:[]},en:{d:'Summary of the recruitment, publishing and business activity of the company.',s:[]}},
 vagas:{db:['vagas','vagas_competencias','vagas_idiomas','tipos_vaga','regimes_trabalho','vagas_mensais_consumidas'],
  pt:{d:'Crie, publique e gira as vagas da empresa.',s:['Lista de vagas com filtro por estado (rascunho, aberta, fechada)','Criar e editar vaga: tipo, regime, local, remuneração, requisitos, competências e idiomas','Quota mensal de vagas do plano e número de visualizações','Duplicar, fechar e prolongar o prazo']},
  en:{d:'Create, publish and manage the jobs of the company.',s:['Job list filtered by status (draft, open, closed)','Create and edit a job: type, work mode, location, pay, requirements, skills and languages','Monthly job quota of the plan and view counts','Duplicate, close and extend the deadline']}},
 candidaturas:{db:['candidaturas','historico_estados_candidatura','perfis_candidatos','candidato_documentos'],
  pt:{d:'Receba e acompanhe as candidaturas a cada vaga.',s:['Quadro por estado: candidatou-se, em análise, entrevista, contratado e rejeitado','Ficha do candidato com compatibilidade, perfil e documentos','Mudança de estado com observação e histórico','Filtros por vaga, estado e compatibilidade']},
  en:{d:'Receive and follow the applications to each job.',s:['Board by status: applied, under review, interview, hired and rejected','Candidate sheet with match, profile and documents','Status change with a note and history','Filters by job, status and match']}},
 talentos:{db:['perfis_candidatos','candidato_competencias','candidato_idiomas','experiencia_profissional','formacao_academica','preferencias_privacidade'],
  pt:{d:'Pesquise perfis de candidatos, conforme o plano activo.',s:['Pesquisa por competências, idiomas, país e disponibilidade','Perfil completo, respeitando a privacidade definida pelo candidato','Pesquisa por texto do CV e, quando disponível, semântica','Acesso à base completa conforme o plano']},
  en:{d:'Search candidate profiles, according to the active plan.',s:['Search by skills, languages, country and availability','Full profile, respecting the privacy set by the candidate','Search by CV text and, when available, semantic search','Access to the full database according to the plan']}},
 formacao:{db:['programas_formacao','turmas_formacao','inscricoes_formacao','certificados_formacao','pagamentos'],novo:['programas_formacao.empresa_id'],
  pt:{d:'Publique programas de formação e gira turmas, inscritos e certificados.',s:['Criar programas: modalidade, carga horária, preço, requisitos e conteúdo programático','Turmas por país, região ou distrito, com instrutor, datas, vagas e prazo de inscrição','Inscritos por turma: presença, avaliação e conclusão','Emissão de certificados com código verificável']},
  en:{d:'Publish training programmes and manage classes, trainees and certificates.',s:['Create programmes: mode, hours, price, requirements and syllabus','Classes by country, region or district, with instructor, dates, seats and registration deadline','Trainees per class: attendance, assessment and completion','Certificate issuing with a verifiable code']}},
 eventos:{db:['eventos','inscricoes_eventos','participantes_eventos'],novo:['eventos.empresa_id'],
  pt:{d:'Publique eventos da empresa e participe nos da plataforma.',s:['Publicar eventos: tipo, datas, horas, local, endereço e capacidade','Inscrições dos candidatos (inscrito ou cancelado) e lotação','Participar em eventos da plataforma como empresa, com o custo de participação','Estado do evento: agendado, em curso, concluído ou cancelado']},
  en:{d:'Publish company events and take part in platform events.',s:['Publish events: type, dates, times, venue, address and capacity','Candidate registrations (registered or cancelled) and attendance','Take part in platform events as a company, with the participation cost','Event status: scheduled, ongoing, finished or cancelled']}},
 financiamento:{db:['linhas_financiamento','solicitacoes_financiamento','solicitacao_anexos','desembolsos_financiamento','reembolsos_financiamento'],novo:['linhas_financiamento.empresa_id','RLS de desembolsos e reembolsos'],
  pt:{d:'Publique linhas de financiamento e analise as solicitações recebidas.',s:['Publicar linhas: tipo, valor mínimo e máximo, moeda, taxa de juro, prazo, carência e documentos','Solicitações recebidas com descrição do projecto e anexos','Análise com parecer: em análise, aprovado ou rejeitado','Desembolsos por parcelas, reembolsos (juros e multa) e fundo disponível da linha']},
  en:{d:'Publish funding lines and review the requests received.',s:['Publish lines: type, minimum and maximum amount, currency, interest rate, term, grace period and documents','Requests received with project description and attachments','Review with opinion: under review, approved or rejected','Disbursements by instalments, repayments (interest and penalty) and available fund of the line']}},
 empreendedorismo:{db:['projetos_empreendedorismo','inscricoes_projetos','mentorias_projetos'],novo:['projetos_empreendedorismo.empresa_id'],
  pt:{d:'Publique programas e concursos de empreendedorismo e acompanhe os participantes.',s:['Publicar programas: tema, datas, vagas, prémio total, parceiros e critérios','Candidaturas com dados do negócio, plano de negócio e vídeo pitch','Pontuação, selecção e atribuição de mentores','Mentorias: área, datas e feedback']},
  en:{d:'Publish entrepreneurship programmes and contests and follow the participants.',s:['Publish programmes: theme, dates, seats, total prize, partners and criteria','Applications with business data, business plan and pitch video','Scoring, selection and mentor assignment','Mentoring: area, dates and feedback']}},
 marketplace:{db:['anuncios_marketplace','categorias_marketplace','transacoes_marketplace','configuracoes_gerais','moedas'],
  pt:{d:'Marketplace B2B: publique anúncios e acompanhe as transacções entre empresas.',s:['Os meus anúncios por categoria, tipo, preço indicativo, local e validade','Explorar anúncios de outras empresas','Transacções como comprador e vendedor, com a comissão da plataforma','Estados e histórico das transacções']},
  en:{d:'B2B marketplace: publish listings and follow transactions between companies.',s:['My listings by category, type, indicative price, location and expiry','Browse listings from other companies','Transactions as buyer and seller, with the platform commission','Transaction status and history']}},
 relatorios:{db:['vagas','candidaturas','historico_estados_candidatura','inscricoes_formacao','inscricoes_eventos','inscricoes_projetos','solicitacoes_financiamento'],
  pt:{d:'Indicadores de tudo o que a empresa publica (relatórios avançados conforme o plano).',s:['Funil de candidaturas por vaga e tempo médio até à contratação','Visualizações e candidaturas ao longo do tempo','Inscritos por formação, evento e programa; solicitações por linha de financiamento','Exportação dos dados']},
  en:{d:'Indicators for everything the company publishes (advanced reports according to the plan).',s:['Application funnel per job and average time to hire','Views and applications over time','Registrations per training, event and programme; requests per funding line','Data export']}},
 equipa:{db:['empresas','utilizadores','planos_assinatura','vagas'],novo:['empresa_membros (nova tabela)'],
  pt:{d:'Recrutadores e gestores que trabalham na conta da empresa.',s:['Convidar membros até ao limite do plano (max_recrutadores)','Papéis: administrador, recrutador e analista','Atribuir o recrutador responsável a cada vaga','Remover ou suspender acessos']},
  en:{d:'Recruiters and managers working on the company account.',s:['Invite members up to the plan limit (max_recrutadores)','Roles: administrator, recruiter and analyst','Assign the responsible recruiter to each job','Remove or suspend access']}},
 plano:{db:['planos_assinatura','assinaturas_empresas','vagas_mensais_consumidas','pagamentos','cronograma_pagamentos','metodos_pagamento','moedas'],
  pt:{d:'Plano de assinatura, consumo mensal e pagamentos.',s:['Plano actual e comparação dos planos','Vagas consumidas no mês','Pagamento por M-Pesa, e-Mola, mKesh, cartão, PayPal ou transferência','Cronograma e histórico de pagamentos']},
  en:{d:'Subscription plan, monthly usage and payments.',s:['Current plan and plan comparison','Jobs used this month','Payment by M-Pesa, e-Mola, mKesh, card, PayPal or bank transfer','Payment schedule and history']}},
 perfil:{db:['empresas','paises','provincias','distritos'],
  pt:{d:'Dados da empresa apresentados na plataforma.',s:['Identificação: nome, sector, descrição, visão e valores','Contactos, website e morada (país, província e distrito)','Logótipo e identificação fiscal opcional, conforme o país','Estado de verificação da empresa']},
  en:{d:'Company details shown on the platform.',s:['Identity: name, sector, description, vision and values','Contacts, website and address (country, province and district)','Logo and optional tax ID, depending on the country','Company verification status']}},
 definicoes:{db:['utilizadores','preferencias_utilizador','preferencias_notificacao','sessoes_utilizadores','logs_actividade'],novo:['preferencias_notificacao.area (áreas da empresa)'],
  pt:{d:'Conta, idioma, notificações e segurança.',s:['Conta: nome, e-mail, telefone e país; alterar a senha','Idioma e redução de animações','Notificações por e-mail e na plataforma','Sessões, actividade da conta e eliminação da conta']},
  en:{d:'Account, language, notifications and security.',s:['Account: name, email, phone and country; change password','Language and reduced motion','Email and in-platform notifications','Sessions, account activity and account deletion']}}
};
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
const Views={};        /* área -> async (id) => {html, after?}  (cada área tem o seu módulo js/candidato-*.js) */
const Actions={};      /* data-a="nome[:arg]" -> (botão, arg, evento) */
const invalidate=()=>{cache=null};
const Modal={prev:null,
 open({title,body}){this.close(true);this.prev=document.activeElement;const b=document.createElement('div');b.className='mod-b';b.id='modal';
  b.innerHTML=`<div class="mod" role="dialog" aria-modal="true" aria-labelledby="mT" tabindex="-1"><div class="mod-h"><h2 id="mT">${esc(title)}</h2><button class="ib" type="button" data-a="modal-close" aria-label="${t('modal.close')}"><i class="fas fa-xmark" aria-hidden="true"></i></button></div><div class="mod-c">${body}</div></div>`;
  document.body.append(b);document.body.classList.add('lock');
  requestAnimationFrame(()=>{b.classList.add('on');(b.querySelector('textarea,input,select')||b.querySelector('.mod')).focus()});return b},
 close(quiet){const b=$('#modal');if(!b)return;b.remove();document.body.classList.remove('lock');if(!quiet&&this.prev&&document.contains(this.prev))this.prev.focus()}};
Actions['modal-close']=()=>Modal.close();

function parse(){const p=location.hash.replace(/^#\/?/,'').split('/');return{area:NAV.some(n=>n.id===p[0])?p[0]:'dashboard',id:p[1]||null,sub:p[2]||null}}
function setPlan(){const e=$('#planL');if(e)e.textContent=t('plan',{p:t('plano.'+MOCK.plano)})}
async function route(){
 const {area,id,sub}=parse(),my=++seq;closeAll();renderNav(area);setPlan();
 const m=$('#main'),nv=NAV.find(n=>n.id===area);
 document.title=t(nv.k)+' — LERMO Recursos';
 try{
  const o=Views[area]?await Views[area](id,sub):{html:area==='dashboard'?dash():stub(nv)};
  if(my!==seq)return;
  m.innerHTML=o.html;if(o.title)document.title=o.title+' — LERMO Recursos';o.after&&o.after();
 }catch(e){if(my!==seq)return;m.innerHTML=`<div class="state card"><i class="fas fa-triangle-exclamation"></i><p>${t('err')}</p><br><button class="btn btn-l" data-a="retry">${t('retry')}</button></div>`}
 m.focus({preventScroll:true});scrollTo(0,0);
}

/* ===== 6. Dashboard (por agora: pontos de entrada para todas as áreas; os indicadores chegam na etapa do Dashboard) ===== */
function dash(){
 const u=Session.get();let h='',open=false;
 NAV.filter(n=>n.id!=='dashboard').forEach(n=>{
  if(n.g){h+=`${open?'</div>':''}<div class="ch" style="margin-top:1.4rem"><h2>${t(n.g)}</h2></div><div class="g3">`;open=true}
  const a=AREAS[n.id][lang];
  h+=`<a class="card acard" href="#/${n.id}"><span class="ic"><i class="fas ${n.i}" aria-hidden="true"></i></span><h2>${t(n.k)}</h2><p>${esc(a.d)}</p><span class="go">${t('open')} <i class="fas fa-arrow-right" aria-hidden="true"></i></span></a>`});
 h+='</div>';
 return `<h1 class="sr">${t('n.dash')}</h1>`+crumbs([[t('n.dash')]])+
 `<section class="hello"><div><h1>${t('hi',{n:'<em>'+esc(u.nome_completo)+'</em>'})}</h1><p>${t('hi.p')}</p></div><a class="btn btn-g" href="#/vagas"><i class="fas fa-briefcase" aria-hidden="true"></i> ${t('hi.cta')}</a></section>`+h;
}
/* Área ainda sem módulo próprio: descreve o que terá e que tabelas do SQL usa */
function stub(nv){
 const a=AREAS[nv.id][lang],rows=a.s.map(s=>`<div class="row"><span class="ic"><i class="fas fa-check" aria-hidden="true"></i></span><div class="rb"><div class="rt wrap">${esc(s)}</div></div></div>`).join('');
 return crumbs([[t('n.dash'),'#/dashboard'],[t(nv.k)]])+
 `<section class="card"><div class="prof"><span class="ic"><i class="fas ${nv.i}" aria-hidden="true"></i></span><div><h1 style="font-size:1.4rem;color:var(--t)">${t(nv.k)}</h1><p>${esc(a.d)}</p></div></div></section>
 <div class="g2" style="margin-top:1rem"><section class="card"><div class="ch"><h2>${t('st.h')}</h2><span class="tag">${t('st.next')}</span></div>${rows}</section>
 <section class="card"><div class="ch"><h2>${t('st.db')}</h2></div><div style="display:flex;flex-wrap:wrap;gap:.4rem">${AREAS[nv.id].db.map(x=>`<span class="tag in db">${x}</span>`).join('')}</div>${AREAS[nv.id].novo?`<div class="ch" style="margin-top:1.1rem"><h2>${t('st.sql')}</h2></div><div style="display:flex;flex-wrap:wrap;gap:.4rem">${AREAS[nv.id].novo.map(x=>`<span class="tag db">${x}</span>`).join('')}</div>`:''}</section></div>`;
}
/* ===== 7. Interacção: menu, dropdowns, idioma, sessão ===== */
const body=document.body;
function setMenu(on){body.classList.toggle('drawer',on);$('#scrim').classList.toggle('on',on);$('#menuBtn').setAttribute('aria-expanded',on);if(on)setTimeout(()=>$('#nav a[aria-current]')?.focus(),50);else if(matchMedia('(max-width:1023px)').matches&&document.activeElement.closest('#side'))$('#menuBtn').focus()}
function closeMenus(){document.querySelectorAll('.menu.on').forEach(m=>{m.classList.remove('on');m.parentElement.querySelector('button').setAttribute('aria-expanded','false')})}
function closeAll(){setMenu(false);closeMenus();Modal.close(true)}
function toast(m){const e=$('#toast');e.textContent=m;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2500)}
/* Terminar sessão: loader «A terminar sessão…» → apaga a sessão → login.html. Em produção: POST /logout (Spring) → encerrar_sessao(sessao_id,'logout') no SQL v5.12, antes de redirecionar. */
function logout(){if(window.LermoLoader)LermoLoader.logout('login.html',()=>Session.end(),t('ld.out'));else{Session.end();location.href='login.html'}}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-a]');
 if(!b){if(e.target.id==='modal'){Modal.close();return}if(!e.target.closest('.dd'))closeMenus();if(e.target.id==='scrim')setMenu(false);return}
 const [a,x]=b.dataset.a.split(':');
 if(a==='menu'){const m=$('#'+x),on=!m.classList.contains('on');closeMenus();m.classList.toggle('on',on);b.setAttribute('aria-expanded',on)}
 else if(a==='open-menu')setMenu(true);else if(a==='close-menu')setMenu(false);
 else if(a==='rail'){const on=body.classList.toggle('rail');b.setAttribute('aria-pressed',on);b.firstElementChild.className='fas fa-angles-'+(on?'right':'left')}
 else if(a==='lang'){lang=lang==='pt'?'en':'pt';try{localStorage.setItem('lermo-lang',lang)}catch(_){}applyLang();route()}
 else if(a==='q-open')qOpen();else if(a==='q-close')qClose();
 else if(a==='top')scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 else if(a==='logout')logout();
 else if(a==='retry'){cache=null;route()}
 else if(Actions[a])Actions[a](b,x,e)
});
$('#scrim').addEventListener('click',()=>setMenu(false));
document.addEventListener('keydown',e=>{
 const md=$('#modal');
 if(md){if(e.key==='Escape'){e.preventDefault();Modal.close();return}
  if(e.key==='Tab'){const f=[...md.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter(x=>x.offsetParent);if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}return}
 if(e.key==='Escape'){const was=document.querySelector('.menu.on');closeAll();if(was)was.parentElement.querySelector('button').focus()}
 if(e.key==='Tab'&&body.classList.contains('drawer')){const f=[...$('#side').querySelectorAll('a,button')].filter(x=>x.offsetParent);const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
matchMedia('(min-width:1024px)').addEventListener('change',()=>setMenu(false));
addEventListener('hashchange',route);
addEventListener('scroll',()=>$('#top').classList.toggle('on',scrollY>200),{passive:true});
addEventListener('storage',e=>{if(e.key===Session.KEY&&!Session.get()){window.LermoLoader&&LermoLoader.show(t('ld.out'));location.replace('login.html')}}); /* logout noutro separador */
/* ===== Pesquisa (header) ===== */
let qSeq=0,qTimer=0,qAct=-1;
const qEl=()=>$('#q'),resEl=()=>$('#res');
function qItems(){return [...resEl().querySelectorAll('a')]}
function qShow(on){resEl().classList.toggle('on',on);qEl().setAttribute('aria-expanded',on);if(!on){qAct=-1;qEl().removeAttribute('aria-activedescendant')}}
function qSel(i){const it=qItems();if(!it.length)return;qAct=(i+it.length)%it.length;it.forEach((a,k)=>a.setAttribute('aria-selected',k===qAct));qEl().setAttribute('aria-activedescendant',it[qAct].id);it[qAct].scrollIntoView({block:'nearest'})}
async function qRun(){
 const v=qEl().value.trim(),my=++qSeq;
 if(!v){resEl().innerHTML='';qShow(false);return}
 let r;try{r=await api.pesquisar(v)}catch(e){r=[]}
 if(my!==qSeq)return;
 let k=0;
 resEl().innerHTML=r.length?r.map(g=>`<h3>${t(g.g)}</h3>`+g.items.map(x=>`<a id="r${k++}" role="option" aria-selected="false" href="${x.h}"><span class="ic"><i class="fas ${g.i}" aria-hidden="true"></i></span><span class="rb"><span class="rt" style="display:block">${esc(x.t)}</span>${x.s?`<span class="rs" style="display:block">${esc(x.s)}</span>`:''}</span></a>`).join('')).join(''):`<div class="none">${t('q.none',{q:esc(v)})}</div>`;
 qShow(true);qAct=-1;
}
function qClose(){qEl().value='';resEl().innerHTML='';qShow(false);$('#srch').classList.remove('open')}
function qOpen(){$('#srch').classList.add('open');qEl().focus()}
$('#q').addEventListener('input',()=>{clearTimeout(qTimer);qTimer=setTimeout(qRun,150)});
$('#q').addEventListener('focus',()=>{if(qEl().value.trim()&&resEl().innerHTML)qShow(true)});
$('#q').addEventListener('keydown',e=>{
 if(e.key==='ArrowDown'){e.preventDefault();qShow(true);qSel(qAct+1)}
 else if(e.key==='ArrowUp'){e.preventDefault();qSel(qAct-1)}
 else if(e.key==='Escape'){if(resEl().classList.contains('on'))qShow(false);else{qClose();e.target.blur()}e.stopPropagation()}
});
$('#srch').addEventListener('submit',e=>{e.preventDefault();clearTimeout(qTimer);const it=qItems(),a=it[qAct>=0?qAct:0];if(a){location.hash=a.getAttribute('href');qClose()}else qRun()});
resEl().addEventListener('click',e=>{if(e.target.closest('a'))setTimeout(qClose,0)});
document.addEventListener('click',e=>{if(!e.target.closest('#srch')&&!e.target.closest('#qBtn'))qShow(false)});
function applyLang(){
 document.documentElement.lang=lang==='en'?'en':'pt-PT';$('#langL').textContent=lang.toUpperCase();
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 $('#q').placeholder=t('q.ph');
 [['#menuBtn','menuOpen'],['#closeBtn','menuClose'],['#railBtn','rail'],['#q','q.aria'],['#qBtn','q.open'],['#qClose','q.close'],['#top','top'],['#whoBtn','userAria'],['.lang','langAria']].forEach(([s,k])=>$(s).setAttribute('aria-label',t(k)));
}
/* ===== Loader unificado (mesmo design do index): órbita do logótipo + texto + barra de progresso ===== */
const LD_LOGO='<div class="lgo"><svg viewBox="0 0 300 300" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><circle cx="150" cy="144" r="82" stroke-width="9"/><line x1="42" y1="144" x2="58" y2="144" stroke-width="7"/><line x1="242" y1="144" x2="258" y2="144" stroke-width="7"/><g class="lermo-orbit"><circle cx="185" cy="106" r="32" stroke-width="7"/><circle cx="193" cy="82" r="5" fill="currentColor" stroke="none"/></g><circle cx="150" cy="144" r="2.6" fill="currentColor" stroke="none"/></svg>LERMO <span>Recursos</span></div>';
/* anima a barra (avança até ~92% enquanto espera) e devolve finish(): completa, esmaece e remove */
function lmAttach(el,remove){
 const fill=el.querySelector('.fill');let p=0;document.body.style.overflow='hidden';
 const iv=setInterval(()=>{p=Math.min(92,p+Math.random()*6+2);fill.style.width=p+'%'},140);
 return ()=>{clearInterval(iv);fill.style.width='100%';
  setTimeout(()=>{el.classList.add('hidden');document.body.style.overflow='';if(remove)setTimeout(()=>el.remove(),650)},350)};
}
/* loader sobreposto para operações longas (ex.: ler o CV); devolve a função que o fecha */
function lmLoader(msg){
 const e=document.createElement('div');e.className='lmld';e.setAttribute('role','status');e.setAttribute('aria-live','polite');
 e.innerHTML=LD_LOGO+'<p><span class="ld-spin" aria-hidden="true"></span><span></span></p><div class="progress-bar"><div class="fill"></div></div>';
 e.querySelector('p span:last-child').textContent=msg;document.body.append(e);
 return lmAttach(e,true);
}
/* ===== 8. Arranque ===== */
document.addEventListener('DOMContentLoaded',()=>{ if(Session.get()){
 api.me().then(u=>{$('#wn').textContent=u.nome_completo;$('#av').textContent=u.nome_completo.split(' ').map(w=>w[0]).slice(0,2).join('')});
 applyLang();
 const ld=$('#loader'),fim=ld?lmAttach(ld):null;
 if(ld)ld.querySelector('[data-ld]').textContent=t('ld.boot');
 route().finally(()=>{fim&&fim()});
}else{const ld=$('#loader');ld&&ld.remove()}
});
