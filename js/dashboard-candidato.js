'use strict';
/* ===== 1. Sessão simulada (substituir por JWT/cookie do Spring Security) ===== */
const Session={
 KEY:'lermo-session',
 get(){try{const s=JSON.parse(localStorage.getItem(this.KEY));if(!(s&&s.exp>Date.now()))return null;
  /* sessões antigas guardadas no navegador com o nome/email de demonstração anterior passam a usar o novo */
  if(/^ana\s+macu[aá]cua$/i.test((s.nome_completo||'').normalize('NFC').trim())||s.email==='ana@exemplo.mz'){if(/^ana\s+macu/i.test(s.nome_completo||''))s.nome_completo='Lut Jalilo';if(s.email==='ana@exemplo.mz')s.email='lut@exemplo.mz';localStorage.setItem(this.KEY,JSON.stringify(s))}
  return s}catch(e){return null}},
 start(u){localStorage.setItem(this.KEY,JSON.stringify({...u,exp:Date.now()+864e5}))},
 end(){localStorage.removeItem(this.KEY)}
};
/* utilizador demo: campos de utilizadores (tipo='candidato') */
const DEMO={utilizador_id:'u-demo',nome_completo:'Lut Jalilo',email:'lut@exemplo.mz',telefone:'+258840000000',pais:'MZ',tipo:'candidato'};
if(new URLSearchParams(location.search).get('demo')==='1'&&!Session.get())Session.start(DEMO);
if(!Session.get()){location.replace('login.html')}  /* sem sessão: único caso em que se volta ao login */

/* ===== 2. Camada de dados (mock). Cada método -> futuro GET /api/... ===== */
const MOCK={
 perfil:{resumo_pessoal:'',foto_url:null,data_nascimento:'',pais_id:'',provincia:'',experiencias:0,formacoes:0,competencias:0,idiomas:0},
 /* estados_candidatura: candidatou_se | em_analise | entrevista | contratado | rejeitado */
 candidaturas:[
  {id:'c1',vaga_id:'v5',t:'Estagiário(a) de Engenharia Informática',en:'Computer Engineering Intern',emp:'Tecnologias Índico',estado:'em_analise',match:82,visto:true,mensagem:'Sou estudante de Informática e gostaria de aplicar os meus conhecimentos de desenvolvimento web num ambiente profissional.',criado_em:'2026-09-28'},
  {id:'c2',vaga_id:'v1',t:'Estagiário(a) de Contabilidade',en:'Accounting Intern',emp:'Kilimanjaro Auditores',estado:'candidatou_se',match:64,visto:false,criado_em:'2026-10-02'}],
 /* historico_estados_candidatura */
 historico:[{cand:'c1',estado:'em_analise',em:'2026-10-01'},{cand:'c2',estado:'candidatou_se',em:'2026-10-02'},{cand:'c1',estado:'candidatou_se',em:'2026-09-28'}],
 /* vagas (+ tipos_vaga, regimes_trabalho, provincias) — subconjunto de js/dados.js; remuneração: remuneracao_minima/maxima/visivel/moeda */
 vagas:[
  {id:'v1',t:'Estagiário(a) de Contabilidade',en:'Accounting Intern',emp:'Kilimanjaro Auditores',pais:'MZ',tipo:'estagio',reg:'presencial',prov:'Maputo-Cidade',min:15000,max:20000,visivel:true,moeda:'MZN',cri:'2026-09-20',lim:'2026-10-25',desc:'Apoio à equipa de auditoria e contabilidade, com acompanhamento de um mentor.',descEn:'Support for the audit and accounting team, with mentor guidance.',req:['Estudante finalista ou recém-licenciado em Contabilidade','Domínio de Excel','Vontade de aprender'],reqEn:['Final-year student or recent graduate in Accounting','Excel proficiency','Willingness to learn']},
  {id:'v2',t:'Técnico(a) de Recursos Humanos',en:'Human Resources Technician',emp:'Cornelder de Moçambique',pais:'MZ',tipo:'emprego_efectivo',reg:'presencial',prov:'Sofala',visivel:false,moeda:'MZN',cri:'2026-09-18',lim:'2026-10-15',desc:'Gestão de processos de recrutamento, admissões e formação interna.',descEn:'Recruitment, onboarding and internal training management.',req:['Licenciatura em Gestão de RH ou similar','2 anos de experiência','Inglês intermédio'],reqEn:['Degree in HR Management or similar','2 years of experience','Intermediate English']},
  {id:'v3',t:'Programa Trainee — Gestão Comercial',en:'Trainee Programme — Commercial Management',emp:'Vodacom Moçambique',pais:'MZ',tipo:'trainee',reg:'hibrido',prov:'Maputo-Cidade',min:25000,max:25000,visivel:true,moeda:'MZN',cri:'2026-09-25',lim:'2026-11-05',desc:'Programa de 12 meses com rotação por várias áreas comerciais.',descEn:'A 12-month programme rotating through several commercial areas.',req:['Licenciatura concluída há menos de 2 anos','Boa comunicação','Disponibilidade para viajar'],reqEn:['Degree completed less than 2 years ago','Good communication skills','Willingness to travel']},
  {id:'v4',t:'Designer Gráfico (projecto)',en:'Graphic Designer (project)',emp:'Estúdio Maré',pais:'MZ',tipo:'freelance',reg:'remoto',prov:'Nampula',visivel:false,moeda:'MZN',cri:'2026-09-22',lim:'2026-10-10',desc:'Criação de identidade visual e materiais de campanha para cliente do sector agrícola.',descEn:'Visual identity and campaign materials for a client in the agricultural sector.',req:['Portefólio actualizado','Figma / Illustrator','Entrega dentro de prazos'],reqEn:['Up-to-date portfolio','Figma / Illustrator','Delivery within deadlines']},
  {id:'v5',t:'Estagiário(a) de Engenharia Informática',en:'Computer Engineering Intern',emp:'Tecnologias Índico',pais:'MZ',tipo:'estagio',reg:'hibrido',prov:'Maputo-Província',min:12000,max:12000,visivel:true,moeda:'MZN',cri:'2026-09-15',lim:'2026-10-30',desc:'Desenvolvimento web, suporte técnico e documentação.',descEn:'Web development, technical support and documentation.',req:['Frequência de Eng. Informática','HTML, CSS e JavaScript','Trabalho em equipa'],reqEn:['Enrolled in Computer Engineering','HTML, CSS and JavaScript','Teamwork']},
  {id:'v6',t:'Agrónomo(a) de Campo',en:'Field Agronomist',emp:'AgroZambézia',pais:'MZ',tipo:'emprego_efectivo',reg:'presencial',prov:'Zambézia',visivel:false,moeda:'MZN',cri:'2026-09-10',lim:'2026-10-20',desc:'Acompanhamento técnico de produtores e monitorização de culturas.',descEn:'Technical support for farmers and crop monitoring.',req:['Licenciatura em Agronomia','Carta de condução','Residência em Quelimane'],reqEn:['Degree in Agronomy','Driving licence','Residence in Quelimane']},
  {id:'v7',t:'Analista de Dados Júnior',en:'Junior Data Analyst',emp:'Atlântico Analytics',pais:'PT',tipo:'emprego_efectivo',reg:'hibrido',prov:'Lisboa',min:1100,max:1400,visivel:true,moeda:'EUR',cri:'2026-09-27',lim:'2026-11-10',desc:'Preparação de relatórios e dashboards para clientes de vários sectores.',descEn:'Preparing reports and dashboards for clients across several sectors.',req:['Licenciatura em áreas quantitativas','SQL e Excel','Inglês intermédio'],reqEn:['Degree in a quantitative field','SQL and Excel','Intermediate English']},
  {id:'v8',t:'Estagiário(a) de Marketing Digital',en:'Digital Marketing Intern',emp:'Estúdio Recife',pais:'BR',tipo:'estagio',reg:'remoto',prov:'São Paulo',min:1800,max:1800,visivel:true,moeda:'BRL',cri:'2026-09-26',lim:'2026-10-28',desc:'Apoio à gestão de redes sociais, conteúdo e campanhas pagas.',descEn:'Support for social media management, content and paid campaigns.',req:['Estudante de Marketing ou Comunicação','Boa escrita','Conhecimentos de redes sociais'],reqEn:['Marketing or Communication student','Good writing skills','Knowledge of social media']},
  {id:'v9',t:'Programa Trainee — Engenharia Civil',en:'Trainee Programme — Civil Engineering',emp:'Construções do Kwanza',pais:'AO',tipo:'trainee',reg:'presencial',prov:'Luanda',visivel:false,moeda:'AOA',cri:'2026-09-24',lim:'2026-11-02',desc:'Acompanhamento de obra e fiscalização com rotação por vários projectos.',descEn:'Site supervision and inspection, rotating through several projects.',req:['Licenciatura em Engenharia Civil','Disponibilidade para obra','Carta de condução'],reqEn:['Degree in Civil Engineering','Availability for site work','Driving licence']},
  {id:'v10',t:'Tradutor(a) Português–Inglês',en:'Portuguese–English Translator',emp:'Cape Linguistics',pais:'ZA',tipo:'freelance',reg:'remoto',prov:'Western Cape',dist:'Cidade do Cabo',visivel:false,moeda:'ZAR',cri:'2026-09-23',lim:'2026-10-26',desc:'Tradução de documentos técnicos e comerciais, por projecto.',descEn:'Translation of technical and commercial documents, per project.',req:['Fluência em português e inglês','Experiência comprovada em tradução','Cumprimento de prazos'],reqEn:['Fluency in Portuguese and English','Proven translation experience','Meeting deadlines']}],
 financiamento:null,   /* resumo da última solicitação; null enquanto não houver nenhuma (solicitacoes_financiamento) */
 /* inscricoes_projetos + mentorias_projetos */
 projetos:[{id:'p1',titulo:'Jovens Empreendedores 2026',estado:'inscrito',mentoria:'Plano de negócio'}],
 /* eventos (data_inicio, local, estado) + país (como vagas.pais_id) */
 eventos:[{id:'e1',t:'Feira de Emprego e Estágios 2026',en:'Jobs and Internships Fair 2026',local:'Maputo-Cidade',pais:'MZ',inicio:'2026-10-22',estado:'agendado'}],
 /* inscricoes_formacao + turmas_formacao + programas_formacao */
 formacao:{abertas:3,certificados:[],inscricoes:[{id:'i1',t:'Competências Digitais para Jovens',en:'Digital Skills for Young People',local:'Zambézia',estado:'inscrito',presenca:60,inicio:'2026-10-18'}]}
};
const wait=(v,ms=350)=>new Promise(r=>setTimeout(()=>r(structuredClone(v)),ms));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
/* Pesquisa global. Em produção: GET /api/pesquisa?q=... (vagas, candidaturas, programas_formacao, eventos, linhas_financiamento, projetos_empreendedorismo) */
function pesquisar(q){
 const n=norm(q).trim(),hit=(...f)=>f.some(x=>norm(x).includes(n)),out=[];
 const add=(g,i,items)=>items.length&&out.push({g,i,items:items.slice(0,5)});
 add('n.op','fa-briefcase',MOCK.vagas.filter(o=>hit(o.t,o.en,o.emp,locL(o),o.prov,t('tipo.'+o.tipo))).map(o=>({t:L(o,'t'),s:o.emp+' · '+locL(o),h:'#/oportunidades/'+o.id})));
 add('n.cand','fa-file-signature',MOCK.candidaturas.filter(c=>hit(c.t,c.en,c.emp,t('est.'+c.estado))).map(c=>({t:L(c,'t'),s:c.emp+' · '+t('est.'+c.estado),h:'#/candidaturas/'+c.id})));
 add('n.form','fa-graduation-cap',MOCK.formacao.inscricoes.filter(f=>hit(f.t,f.en,f.local)).map(f=>({t:L(f,'t'),s:f.local+' · '+t('est.'+f.estado),h:'#/formacao/'+f.id})));
 add('n.ev','fa-calendar-days',MOCK.eventos.filter(e=>hit(e.t,e.en,e.local,locL({prov:e.local,pais:e.pais}))).map(e=>({t:L(e,'t'),s:locL({prov:e.local,pais:e.pais})+' · '+fmtD(e.inicio),h:'#/eventos/'+e.id})));
 add('n.fin','fa-seedling',MOCK.financiamento&&hit(MOCK.financiamento.linha)?[{t:MOCK.financiamento.linha,s:t('est.'+MOCK.financiamento.estado),h:'#/financiamento'}]:[]);
 add('n.proj','fa-lightbulb',MOCK.projetos.filter(p=>hit(p.titulo,p.mentoria)).map(p=>({t:p.titulo,s:t('est.'+p.estado),h:'#/empreendedorismo/'+p.id})));
 add('q.areas','fa-compass',NAV.filter(a=>hit(t(a.k))).map(a=>({t:t(a.k),s:'',h:'#/'+a.id})));
 return out;
}
const vAberta=v=>new Date(v.lim+'T23:59:59')>=new Date();
function resumoOp(){const ap=new Set(MOCK.candidaturas.map(c=>c.vaga_id)),ab=MOCK.vagas.filter(vAberta);
 return{abertas:ab.length,sugeridas:ab.filter(v=>!ap.has(v.id)).sort((a,b)=>b.cri.localeCompare(a.cri)).slice(0,3)}}
const api={
 pesquisar:q=>wait(pesquisar(q),120),
 me:()=>wait(Session.get(),0),
 vagas:()=>wait(MOCK.vagas.map(v=>({...v,candidatura:(MOCK.candidaturas.find(c=>c.vaga_id===v.id)||{}).id||null})),200),   /* GET /api/vagas */
 vaga:id=>wait((v=>v?{...v,candidatura:(MOCK.candidaturas.find(c=>c.vaga_id===v.id)||{}).id||null}:null)(MOCK.vagas.find(v=>v.id===id)),200), /* GET /api/vagas/{id} */
 candidatar:(vagaId,mensagem)=>new Promise((ok,no)=>setTimeout(()=>{   /* POST /api/candidaturas */
  const v=MOCK.vagas.find(x=>x.id===vagaId);
  if(!v||!vAberta(v))return no(new Error('closed'));
  if(MOCK.candidaturas.some(c=>c.vaga_id===vagaId))return no(new Error('dup'));   /* UNIQUE(vaga_id, candidato_id) */
  const hoje=new Date().toISOString().slice(0,10),c={id:'c'+(MOCK.candidaturas.length+1)+Date.now().toString(36),vaga_id:vagaId,t:v.t,en:v.en,emp:v.emp,estado:'candidatou_se',match:null,visto:false,mensagem:mensagem||null,criado_em:hoje};
  MOCK.candidaturas.unshift(c);MOCK.historico.unshift({cand:c.id,estado:'candidatou_se',em:hoje});ok(structuredClone(c))},600)),                       /* GET /api/me */
 resumo:()=>wait({                                    /* GET /api/candidato/resumo */
  perfil:MOCK.perfil,candidaturas:MOCK.candidaturas,historico:MOCK.historico,
  oportunidades:resumoOp(),financiamento:MOCK.financiamento,finTotal:(MOCK.finSol||[]).length,projetos:MOCK.projetos,eventos:MOCK.eventos,formacao:MOCK.formacao})
};

/* ===== 3. i18n PT/EN (chave partilhada com o resto do site) ===== */
const D={pt:{
 'ld.boot':'A preparar o seu painel…','ld.out':'A terminar sessão…','logout':'Terminar sessão','modal.close':'Fechar','q.ph':'Pesquisar oportunidades, candidaturas, formação…','q.aria':'Pesquisar na plataforma','q.none':'Sem resultados para "{q}".','q.areas':'Áreas','q.open':'Abrir pesquisa','q.close':'Fechar pesquisa','n.dash':'Dashboard','n.op':'Oportunidades','n.cand':'Candidaturas','n.fin':'Financiamento','n.form':'Formação','n.ev':'Eventos','n.perfil':'Perfil','n.proj':'Empreendedorismo','n.def':'Definições',
 'g.menu':'Menu','g.conta':'Conta','hi':'Olá, {n}','hi.p':'Aqui tem um resumo da sua actividade. Escolha uma área no menu para ver os detalhes.','hi.cta':'Ver oportunidades',
 'st.cand':'Candidaturas','st.op':'Oportunidades abertas','st.fin':'Solicitações de financiamento','st.form':'Formações em curso','c.form':'Formação','c.ev':'Próximos eventos','c.proj':'Empreendedorismo','cert':'{n} certificado(s) emitido(s)','mento':'Mentoria: {a}','est.agendado':'Agendado','empty.ev':'Sem eventos agendados.','empty.proj':'Ainda não está inscrito em nenhum programa de empreendedorismo.','empty.form':'Ainda não está inscrito em nenhuma formação.','pres':'Presença {v}%','inicio':'Início {d}',
 'c.cand':'Candidaturas recentes','c.op':'Oportunidades para si','c.perfil':'Perfil','c.fin':'Financiamento','all':'Ver todas','open':'Abrir',
 'perf.p':'Perfil {v}% completo','perf.h':'Faltam: {x}','perf.ok':'Perfil completo.','perf.go':'Completar perfil',
 'f.resumo':'resumo pessoal','f.foto':'fotografia','f.pess':'dados pessoais','f.exp':'experiência','f.form':'formação','f.comp':'competências','f.id':'idiomas',
 'est.candidatou_se':'Candidatou-se','est.em_analise':'Em análise','est.entrevista':'Entrevista','est.contratado':'Contratado','est.rejeitado':'Rejeitado','est.submetido':'Submetido','est.inscrito':'Inscrito',
 'tipo.estagio':'Estágio','tipo.emprego_efectivo':'Emprego efectivo','tipo.trainee':'Trainee','tipo.freelance':'Freelance',
 'lim':'Até {d}','match':'Compatibilidade {v}%','sub':'Submetido em {d}','act.t':'{x}: {e}',
 'empty.cand':'Ainda não se candidatou a nenhuma vaga.','empty.op':'Sem oportunidades abertas de momento.','empty.fin':'Ainda não tem solicitações de financiamento.',
 'err':'Não foi possível carregar os dados.','retry':'Tentar novamente',
 'stub.h':'Em desenvolvimento','stub.p':'Esta área tem interface própria e será construída na próxima fase. Continua dentro da sua sessão.','stub.back':'Voltar ao Dashboard',
 'top':'Voltar ao topo','menuOpen':'Abrir menu','menuClose':'Fechar menu','rail':'Recolher ou expandir menu','userAria':'Conta do utilizador','langAria':'Alternar idioma'},
en:{
 'ld.boot':'Preparing your dashboard…','ld.out':'Logging out…','logout':'Log out','modal.close':'Close','q.ph':'Search opportunities, applications, training…','q.aria':'Search the platform','q.none':'No results for "{q}".','q.areas':'Areas','q.open':'Open search','q.close':'Close search','n.dash':'Dashboard','n.op':'Opportunities','n.cand':'Applications','n.fin':'Funding','n.form':'Training','n.ev':'Events','n.perfil':'Profile','n.proj':'Entrepreneurship','n.def':'Settings',
 'g.menu':'Menu','g.conta':'Account','hi':'Hello, {n}','hi.p':'Here is a summary of your activity. Pick an area in the menu to see the details.','hi.cta':'Browse opportunities',
 'st.cand':'Applications','st.op':'Open opportunities','st.fin':'Funding requests','st.form':'Training in progress','c.form':'Training','c.ev':'Upcoming events','c.proj':'Entrepreneurship','cert':'{n} certificate(s) issued','mento':'Mentoring: {a}','est.agendado':'Scheduled','empty.ev':'No scheduled events.','empty.proj':'You have not joined any entrepreneurship programme yet.','empty.form':'You are not enrolled in any training yet.','pres':'Attendance {v}%','inicio':'Starts {d}',
 'c.cand':'Recent applications','c.op':'Opportunities for you','c.perfil':'Profile','c.fin':'Funding','all':'View all','open':'Open',
 'perf.p':'Profile {v}% complete','perf.h':'Missing: {x}','perf.ok':'Profile complete.','perf.go':'Complete profile',
 'f.resumo':'personal summary','f.foto':'photo','f.pess':'personal details','f.exp':'experience','f.form':'education','f.comp':'skills','f.id':'languages',
 'est.candidatou_se':'Applied','est.em_analise':'Under review','est.entrevista':'Interview','est.contratado':'Hired','est.rejeitado':'Rejected','est.submetido':'Submitted','est.inscrito':'Registered',
 'tipo.estagio':'Internship','tipo.emprego_efectivo':'Full-time job','tipo.trainee':'Trainee','tipo.freelance':'Freelance',
 'lim':'Until {d}','match':'Match {v}%','sub':'Submitted on {d}','act.t':'{x}: {e}',
 'empty.cand':'You have not applied to any job yet.','empty.op':'No open opportunities right now.','empty.fin':'You have no funding requests yet.',
 'err':'Could not load the data.','retry':'Try again',
 'stub.h':'Under development','stub.p':'This area has its own interface and will be built in the next phase. You stay signed in.','stub.back':'Back to Dashboard',
 'top':'Back to top','menuOpen':'Open menu','menuClose':'Close menu','rail':'Collapse or expand menu','userAria':'User account','langAria':'Switch language'}};
let lang='pt';try{lang=localStorage.getItem('lermo-lang')==='en'?'en':'pt'}catch(e){}
const t=(k,v)=>{let s=(D[lang][k]??D.pt[k]??k);if(v)for(const x in v)s=s.replace('{'+x+'}',v[x]);return s};
const fmtD=d=>new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d));
const fmtM=(v,c)=>new Intl.NumberFormat(lang==='en'?'en-GB':'pt-PT',{style:'currency',currency:c,maximumFractionDigits:0}).format(v);
const PROV_EN={'Maputo-Cidade':'Maputo City','Maputo-Província':'Maputo Province','Zambézia':'Zambezia','Lisboa':'Lisbon','Cidade do Cabo':'Cape Town'};
const provL=p=>lang==='en'&&PROV_EN[p]?PROV_EN[p]:p;
function paisN(c){try{return new Intl.DisplayNames([lang==='en'?'en':'pt-PT'],{type:'region'}).of(c)||c}catch(e){return c}}   /* nome do país no idioma activo (vagas.pais_id) */
function locL(v){const a=[];if(v.dist)a.push(provL(v.dist));if(v.prov&&v.prov!==v.dist)a.push(provL(v.prov));if(v.pais)a.push(paisN(v.pais));return a.join(', ')}
const L=(o,f)=>lang==='en'&&o.en?o.en:o[f];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ===== 4. Mapa de navegação (apenas módulos suportados pelo SQL) ===== */
const NAV=[
 {id:'dashboard',i:'fa-gauge-high',k:'n.dash',g:'g.menu'},
 {id:'oportunidades',i:'fa-briefcase',k:'n.op'},   /* vagas, tipos_vaga */
 {id:'candidaturas',i:'fa-file-signature',k:'n.cand'}, /* candidaturas */
 {id:'convites',i:'fa-envelope-open-text',k:'n.conv'}, /* convites_talento (SQL v5.14) */
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
const Views={};        /* área -> async (id) => {html, after?}  (cada área tem o seu módulo js/candidato-*.js) */
const Actions={};      /* data-a="nome[:arg]" -> (botão, arg, evento) */
/* Carrossel partilhado (Convites e Oportunidades): o .vrow desliza com o dedo; no computador, com 3 ou mais cartões, mostra Anterior/Próximo.
   Uso: CAR.html(cartõesHtml, n, rótuloAcessível) devolve o bloco; depois de o inserir, CAR.sync(). */
Object.assign(D.pt,{'car.prev':'Anterior','car.next':'Próximo','car.nav':'Navegar nos cartões'});
Object.assign(D.en,{'car.prev':'Previous','car.next':'Next','car.nav':'Browse cards'});
const CAR={
 html(cards,n,label,peek){return `<div class="carw${peek&&n>=3?' peek':''}"><div class="vrow" tabindex="0" role="region" aria-label="${label}">${cards}</div>`+(n<3?'':`<nav class="pg car" aria-label="${t('car.nav')}"><span class="pg-b"><button class="btn btn-l btn-s" type="button" data-a="car:-1" disabled><i class="fas fa-chevron-left" aria-hidden="true"></i> ${t('car.prev')}</button><button class="btn btn-l btn-s" type="button" data-a="car:1">${t('car.next')} <i class="fas fa-chevron-right" aria-hidden="true"></i></button></span></nav>`)+`</div>`},
 sync(w){(w?[w]:[...document.querySelectorAll('.carw')]).forEach(w=>{const r=w.querySelector('.vrow'),p=w.querySelector('[data-a="car:-1"]'),n=w.querySelector('[data-a="car:1"]');
  if(!r)return;if(p)p.disabled=r.scrollLeft<=2;if(n)n.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-2})},
 later(){setTimeout(()=>CAR.sync(),60)}
};
Actions['car']=(b,d)=>{const w=b.closest('.carw'),r=w&&w.querySelector('.vrow'),c=r&&r.querySelector('.vc');if(!c)return;
 const w1=c.getBoundingClientRect().width+(parseFloat(getComputedStyle(r).columnGap)||16);
 r.scrollBy({left:(+d)*w1,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
document.addEventListener('scroll',e=>{const r=e.target;if(r&&r.classList&&r.classList.contains('vrow')){const w=r.closest('.carw');w&&CAR.sync(w)}},{capture:true,passive:true});
addEventListener('resize',()=>CAR.sync());
window.LRM_CAR=CAR;
const invalidate=()=>{cache=null};
const Modal={prev:null,
 open({title,body}){this.close(true);this.prev=document.activeElement;const b=document.createElement('div');b.className='mod-b';b.id='modal';
  b.innerHTML=`<div class="mod" role="dialog" aria-modal="true" aria-labelledby="mT" tabindex="-1"><div class="mod-h"><h2 id="mT">${esc(title)}</h2><button class="ib" type="button" data-a="modal-close" aria-label="${t('modal.close')}"><i class="fas fa-xmark" aria-hidden="true"></i></button></div><div class="mod-c">${body}</div></div>`;
  document.body.append(b);document.body.classList.add('lock');
  requestAnimationFrame(()=>{b.classList.add('on');(b.querySelector('textarea,input,select')||b.querySelector('.mod')).focus()});return b},
 close(quiet){const b=$('#modal');if(!b)return;b.remove();document.body.classList.remove('lock');if(!quiet&&this.prev&&document.contains(this.prev))this.prev.focus()}};
Actions['modal-close']=()=>Modal.close();
function parse(){const p=location.hash.replace(/^#\/?/,'').split('/');return{area:NAV.some(n=>n.id===p[0])?p[0]:'dashboard',id:p[1]||null}}
async function route(){
 const {area,id}=parse(),my=++seq;closeAll();renderNav(area);
 const m=$('#main'),nv=NAV.find(n=>n.id===area);
 document.title=t(nv.k)+' — LERMO Recursos';
 if(area!=='dashboard'){
  if(Views[area]){m.innerHTML=`<div class="skg"><div class="sk" style="height:90px"></div><div class="sk" style="height:70px"></div><div class="sk"></div><div class="sk"></div></div>`;
   try{const o=await Views[area](id);if(my!==seq)return;m.innerHTML=o.html;if(o.title)document.title=o.title+' — LERMO Recursos';o.after&&o.after()}
   catch(e){if(my!==seq)return;m.innerHTML=`<div class="state card"><i class="fas fa-triangle-exclamation"></i><p>${t('err')}</p><br><button class="btn btn-l" data-a="retry">${t('retry')}</button></div>`}
  }else m.innerHTML=stub(nv,id);
  m.focus({preventScroll:true});scrollTo(0,0);return}
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
 const f=[['resumo',!!p.resumo_pessoal],['foto',!!p.foto_url],['nasc',!!p.data_nascimento],['prov',!!(p.pais_id&&p.provincia)],['exp',p.experiencias>0],['form',p.formacoes>0],['comp',p.competencias>0],['id',p.idiomas>0]];
 return{v:Math.round(f.filter(x=>x[1]).length/f.length*100),falta:[...new Set(f.filter(x=>!x[1]).map(x=>t('f.'+(x[0]==='nasc'||x[0]==='prov'?'pess':x[0]))))]};   /* data de nascimento e país/região pertencem a «dados pessoais»: aparece uma só vez */
}
const est=e=>({em_analise:'in',entrevista:'',contratado:'ok',rejeitado:'no'}[e]??'');
function dash(d){
 const u=Session.get(),pc=completude(d.perfil),fin=d.financiamento;
 const stat=(i,n,k,h)=>`<a class="stat" href="${h}"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><span><b>${n}</b><span>${t(k)}</span></span></a>`;
 const cands=d.candidaturas.length?d.candidaturas.map(c=>`<a class="row" href="#/candidaturas/${c.id}"><div class="rb"><div class="rt">${esc(L(c,'t'))}</div><div class="rs">${esc(c.emp)}${c.match!=null?' · '+t('match',{v:c.match}):''}</div></div><span class="tag ${est(c.estado)}">${t('est.'+c.estado)}</span></a>`).join(''):`<div class="state"><i class="fas fa-folder-open"></i>${t('empty.cand')}</div>`;
 const sug=d.oportunidades.sugeridas,ops=sug.length&&window.LRM_OP?(window.LRM_OP.seed(sug),`<div class="vrow" id="opDash" tabindex="0" role="region" aria-label="${t('c.op')}">${sug.map(window.LRM_OP.card).join('')}</div>`):sug.length?`<div id="opDash">`+sug.map(o=>`<a class="row" href="#/oportunidades/${o.id}"><span class="ic"><i class="fas fa-briefcase" aria-hidden="true"></i></span><div class="rb"><div class="rt">${esc(L(o,'t'))}</div><div class="rs">${esc(o.emp)} · ${esc(locL(o))}</div></div><span class="tag in">${t('tipo.'+o.tipo)}</span></a>`).join('')+`</div>`:`<div class="state" id="opDash"><i class="fas fa-briefcase"></i>${t('empty.op')}</div>`;
 const frm=d.formacao.inscricoes.length?d.formacao.inscricoes.map(i=>`<a class="row" href="#/formacao/${i.id}"><div class="rb"><div class="rt">${esc(L(i,'t'))}</div><div class="rs">${esc(i.local)} · ${t('inicio',{d:fmtD(i.inicio)})} · ${t('pres',{v:i.presenca})}</div></div><span class="tag in">${t('est.'+i.estado)}</span></a>`).join(''):`<div class="state"><i class="fas fa-graduation-cap"></i>${t('empty.form')}</div>`;
 const evs=d.eventos.length?d.eventos.map(e=>`<a class="row" href="#/eventos/${e.id}"><span class="ic"><i class="fas fa-calendar-days" aria-hidden="true"></i></span><div class="rb"><div class="rt">${esc(L(e,'t'))}</div><div class="rs">${esc(locL({prov:e.local,pais:e.pais}))} · ${fmtD(e.inicio)}</div></div><span class="tag in">${t('est.'+e.estado)}</span></a>`).join(''):`<div class="state">${t('empty.ev')}</div>`;
 const prj=d.projetos.length?d.projetos.map(p=>`<a class="row" href="#/empreendedorismo/${p.id}"><div class="rb"><div class="rt">${esc(p.titulo)}</div><div class="rs">${p.mentoria?t('mento',{a:esc(p.mentoria)}):''}</div></div><span class="tag in">${t('est.'+p.estado)}</span></a>`).join(''):`<div class="state">${t('empty.proj')}</div>`;
 const finH=fin?`<div class="money">${fmtM(fin.valor_solicitado,fin.moeda)}</div><p class="rs" style="white-space:normal;margin:.2rem 0 .6rem">${esc(fin.linha)}</p><span class="tag">${t('est.'+fin.estado)}</span> <span class="rs">${t('sub',{d:fmtD(fin.data_submissao)})}</span>`:`<div class="state">${t('empty.fin')}</div>`;
 return `<h1 class="sr">${t('n.dash')}</h1>`+crumbs([[t('n.dash')]])+
 `<section class="hello"><div><h1>${t('hi',{n:'<em>'+esc(u.nome_completo.split(' ')[0])+'</em>'})}</h1><p>${t('hi.p')}</p></div><a class="btn btn-g" href="#/oportunidades"><i class="fas fa-magnifying-glass"></i> ${t('hi.cta')}</a></section>
 <section class="stats" aria-label="${t('n.dash')}">${stat('fa-file-signature',d.candidaturas.length,'st.cand','#/candidaturas')}${stat('fa-briefcase',d.oportunidades.abertas,'st.op','#/oportunidades')}${stat('fa-seedling',d.finTotal||0,'st.fin','#/financiamento')}${stat('fa-graduation-cap',d.formacao.inscricoes.length,'st.form','#/formacao')}</section>
 <div class="g2">
  <section class="card"><div class="ch"><h2>${t('c.cand')}</h2><a href="#/candidaturas">${t('all')}</a></div>${cands}</section>
  <section class="card"><div class="ch"><h2>${t('c.perfil')}</h2></div><div class="prof"><div class="ring" style="--v:${pc.v}" role="img" aria-label="${pc.v}%"><b>${pc.v}%</b></div><div><p><strong>${t('perf.p',{v:pc.v})}</strong></p><p>${pc.falta.length?t('perf.h',{x:pc.falta.join(', ')}):t('perf.ok')}</p></div></div><a class="btn btn-l" style="margin-top:auto;width:100%" href="#/perfil">${t('perf.go')}</a></section></div>
 <section class="card" style="margin-bottom:1rem"><div class="ch"><h2>${t('c.op')}</h2><a href="#/oportunidades">${t('all')}</a></div>${ops}</section>
 <div class="g3">
  <section class="card"><div class="ch"><h2>${t('c.form')}</h2><a href="#/formacao">${t('open')}</a></div>${frm}<p class="rs" style="margin-top:auto;padding-top:.6rem">${t('cert',{n:d.formacao.certificados.length})}</p></section>
  <section class="card"><div class="ch"><h2>${t('c.proj')}</h2><a href="#/empreendedorismo">${t('open')}</a></div>${prj}</section>
  <section class="card"><div class="ch"><h2>${t('c.fin')}</h2><a href="#/financiamento">${t('open')}</a></div>${finH}</section></div>
 <section class="card" style="margin-top:1rem"><div class="ch"><h2>${t('c.ev')}</h2><a href="#/eventos">${t('all')}</a></div>${evs}</section>`;
}
/* ===== 7. Interacção: menu, dropdowns, idioma, sessão ===== */
const body=document.body;
function setMenu(on){body.classList.toggle('drawer',on);$('#scrim').classList.toggle('on',on);$('#menuBtn').setAttribute('aria-expanded',on);if(on)setTimeout(()=>$('#nav a[aria-current]')?.focus(),50);else if(matchMedia('(max-width:1023px)').matches&&document.activeElement.closest('#side'))$('#menuBtn').focus()}
function closeMenus(){document.querySelectorAll('.menu.on').forEach(m=>{m.classList.remove('on');m.parentElement.querySelector('button').setAttribute('aria-expanded','false')})}
function closeAll(){setMenu(false);closeMenus();Modal.close(true)}
function toast(m){const e=$('#toast');e.textContent=m;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2500)}
/* Terminar sessão: loader «A terminar sessão…» → apaga a sessão → login.html. Em produção: POST /logout (Spring) → encerrar_sessao(sessao_id,'logout') no SQL v5.11, antes de redirecionar. */
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
