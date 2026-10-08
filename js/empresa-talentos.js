'use strict';
/* Talentos da empresa: pesquisa de perfis de candidatos, ficha completa, guardar e convidar para uma vaga.
   Acesso conforme o plano (planos_assinatura.acesso_base_dados): Premium e Enterprise veem a base completa; Gratuito e Básico veem uma amostra.
   Depende de dashboard-empresa.js: MOCK, norm, t, esc, crumbs, Views, Actions, Modal, toast, D, lang, $.
   Tabelas SQL: perfis_candidatos, candidato_competencias, candidato_idiomas, experiencia_profissional, formacao_academica, preferencias_privacidade.
   Em produção: GET /api/empresa/talentos?q=&competencias=&pais=&disponibilidade=&exp_min= (a API aplica o limite do plano e a privacidade do candidato).
   Os perfis abaixo são de demonstração (em produção vêm da API). */
(()=>{
const SK=[[1,'Microsoft Excel','Microsoft Excel'],[2,'Microsoft Word','Microsoft Word'],[4,'JavaScript','JavaScript'],[5,'Python','Python'],[6,'SQL','SQL'],[7,'Contabilidade','Accounting'],[8,'Gestão de projectos','Project management'],[9,'Design gráfico','Graphic design'],[10,'Marketing digital','Digital marketing'],[11,'Redes sociais','Social media'],[12,'Atendimento ao cliente','Customer service'],[13,'Tradução','Translation'],[14,'Agronomia','Agronomy'],[15,'Comunicação','Communication'],[16,'Trabalho em equipa','Teamwork'],[17,'Liderança','Leadership'],[24,'Microsoft PowerPoint','Microsoft PowerPoint'],[31,'Power BI','Power BI'],[34,'Dactilografia','Typing'],[36,'Secretariado e apoio administrativo','Secretarial and administrative support'],[37,'Java','Java'],[41,'React','React'],[42,'Node.js','Node.js'],[43,'Spring Boot','Spring Boot'],[45,'Git e GitHub','Git and GitHub'],[48,'Redes de computadores','Computer networking'],[49,'Cibersegurança','Cybersecurity'],[53,'Suporte técnico e helpdesk','Technical support and helpdesk'],[55,'Análise de dados','Data analysis'],[58,'Design UX/UI','UX/UI design'],[61,'Gestão de recursos humanos','Human resources management'],[62,'Recrutamento e selecção','Recruitment and selection'],[63,'Finanças','Finance'],[64,'Auditoria','Auditing'],[67,'Análise financeira','Financial analysis']];
const skN=id=>{const x=SK.find(s=>s[0]===id);return x?(lang==='en'?x[2]:x[1]):''};
const PT='Português',EN='Inglês';
const T=[
 {id:'t1',nome:'Amélia Machava',tit:['Contabilista júnior','Junior accountant'],pais:'MZ',cid:'Maputo',sk:[7,1,63,67],lg:[[PT,'Portuguese','nat'],[EN,'English','B2']],exp:3,disp:'imediata',mail:'amelia.machava@exemplo.co.mz',
  fo:['Licenciatura em Contabilidade e Auditoria','BSc in Accounting and Auditing'],sobre:['Contabilista com experiência em fecho mensal, reconciliações bancárias e apoio à auditoria. Procuro uma equipa onde crescer na área financeira.','Accountant experienced in monthly closing, bank reconciliations and audit support. Looking for a team to grow in finance.'],
  xp:[['Assistente de contabilidade','Accounting assistant','Contas & Números, Lda','2023 – 2025'],['Estagiária','Intern','Banco Comercial','2022 – 2023']]},
 {id:'t2',nome:'Carlos Nhantumbo',tit:['Desenvolvedor full-stack','Full-stack developer'],pais:'MZ',cid:'Maputo',sk:[4,41,42,6,45],lg:[[PT,'Portuguese','nat'],[EN,'English','C1']],exp:5,disp:'1mes',mail:null,
  fo:['Licenciatura em Engenharia Informática','BSc in Computer Engineering'],sobre:['Desenvolvo aplicações web com React e Node.js, do desenho da API à publicação. Gosto de código limpo e de equipas pequenas e rápidas.','I build web apps with React and Node.js, from API design to release. I like clean code and small, fast teams.'],
  xp:[['Programador full-stack','Full-stack developer','Mozdigital','2022 – 2025'],['Programador júnior','Junior developer','Startup Índico','2020 – 2022']]},
 {id:'t3',nome:'Fátima Chongo',tit:['Designer UX/UI','UX/UI designer'],pais:'MZ',cid:'Nampula',sk:[58,9,11,15],lg:[[PT,'Portuguese','nat'],[EN,'English','B1']],exp:4,disp:'imediata',mail:'fatima.chongo@exemplo.co.mz',
  fo:['Licenciatura em Design e Comunicação','BA in Design and Communication'],sobre:['Desenho interfaces simples e acessíveis para telemóvel. Já conduzi testes com utilizadores e criei sistemas de design para pequenas empresas.','I design simple, accessible mobile interfaces. I have run user tests and built design systems for small companies.'],
  xp:[['Designer de produto','Product designer','Estúdio Mar','2022 – 2025']]},
 {id:'t4',nome:'Joaquim Sitoe',tit:['Analista de dados','Data analyst'],pais:'MZ',cid:'Beira',sk:[55,5,6,31,1],lg:[[PT,'Portuguese','nat'],[EN,'English','B2']],exp:4,disp:'aberto',mail:null,
  fo:['Licenciatura em Estatística','BSc in Statistics'],sobre:['Transformo dados em painéis claros para decisões de gestão. Trabalho com Python, SQL e Power BI.','I turn data into clear dashboards for management decisions. I work with Python, SQL and Power BI.'],
  xp:[['Analista de dados','Data analyst','Porto da Beira, EP','2022 – actualidade']]},
 {id:'t5',nome:'Neusa Mondlane',tit:['Técnica de recursos humanos','HR officer'],pais:'MZ',cid:'Matola',sk:[61,62,15,17],lg:[[PT,'Portuguese','nat'],[EN,'English','B2']],exp:6,disp:'1mes',mail:'neusa.mondlane@exemplo.co.mz',
  fo:['Licenciatura em Gestão de Recursos Humanos','BSc in Human Resources Management'],sobre:['Conduzo todo o ciclo de recrutamento: descrição da vaga, triagem, entrevistas e integração.','I run the full recruitment cycle: job description, screening, interviews and onboarding.'],
  xp:[['Técnica de RH','HR officer','Grupo Industrial Sul','2021 – 2025'],['Assistente de RH','HR assistant','Hotel Marisol','2019 – 2021']]},
 {id:'t6',nome:'Tiago Fernandes',tit:['Engenheiro de software (Java)','Software engineer (Java)'],pais:'PT',cid:'Lisboa',sk:[37,43,6,45],lg:[[PT,'Portuguese','nat'],[EN,'English','C1']],exp:7,disp:'aberto',mail:null,
  fo:['Mestrado em Engenharia Informática','MSc in Computer Engineering'],sobre:['Desenvolvo serviços Java e Spring Boot para banca e telecomunicações. Aberto a trabalho remoto com empresas em África.','I build Java and Spring Boot services for banking and telecoms. Open to remote work with companies in Africa.'],
  xp:[['Engenheiro de software','Software engineer','FinTech Atlântico','2020 – actualidade']]},
 {id:'t7',nome:'Isabel Cossa',tit:['Gestora de projectos','Project manager'],pais:'MZ',cid:'Maputo',sk:[8,24,17,15],lg:[[PT,'Portuguese','nat'],[EN,'English','C1']],exp:8,disp:'1mes',mail:'isabel.cossa@exemplo.co.mz',
  fo:['Pós-graduação em Gestão de Projectos','Postgraduate in Project Management'],sobre:['Coordeno equipas e orçamentos em projectos de desenvolvimento comunitário e infra-estruturas.','I coordinate teams and budgets in community development and infrastructure projects.'],
  xp:[['Gestora de projectos','Project manager','ONG Futuro Verde','2019 – 2025']]},
 {id:'t8',nome:'Hélio Banze',tit:['Especialista em marketing digital','Digital marketing specialist'],pais:'MZ',cid:'Pemba',sk:[10,11,9,15],lg:[[PT,'Portuguese','nat'],[EN,'English','B1']],exp:3,disp:'imediata',mail:null,
  fo:['Licenciatura em Marketing','BA in Marketing'],sobre:['Crio campanhas em redes sociais para pequenos negócios e acompanho os resultados semana a semana.','I create social media campaigns for small businesses and track results week by week.'],
  xp:[['Gestor de redes sociais','Social media manager','Agência Costa','2022 – 2025']]},
 {id:'t9',nome:'Graça Tembe',tit:['Engenheira agrónoma','Agronomist'],pais:'MZ',cid:'Chimoio',sk:[14,55,8],lg:[[PT,'Portuguese','nat'],[EN,'English','B2']],exp:5,disp:'1mes',mail:'graca.tembe@exemplo.co.mz',
  fo:['Licenciatura em Engenharia Agronómica','BSc in Agronomy'],sobre:['Apoio produtores com planeamento de culturas, irrigação e análise de produtividade.','I support farmers with crop planning, irrigation and yield analysis.'],
  xp:[['Técnica agrónoma','Agronomy officer','Cooperativa Planalto','2020 – 2025']]},
 {id:'t10',nome:'Samuel Uamusse',tit:['Técnico de suporte informático','IT support technician'],pais:'MZ',cid:'Quelimane',sk:[53,48,49],lg:[[PT,'Portuguese','nat'],[EN,'English','B1']],exp:2,disp:'imediata',mail:null,
  fo:['Técnico médio em Informática','Technical diploma in IT'],sobre:['Resolvo problemas de computadores e redes e formo utilizadores. Procuro a primeira oportunidade numa equipa de TI.','I fix computer and network issues and train users. Looking for a first opportunity in an IT team.'],
  xp:[['Técnico de helpdesk','Helpdesk technician','Cibernet Zambézia','2023 – 2025']]},
 {id:'t11',nome:'Lúcia Zandamela',tit:['Tradutora português–inglês','Portuguese–English translator'],pais:'MZ',cid:'Maputo',sk:[13,15,2],lg:[[PT,'Portuguese','nat'],[EN,'English','C2']],exp:7,disp:'aberto',mail:'lucia.zandamela@exemplo.co.mz',
  fo:['Licenciatura em Línguas e Tradução','BA in Languages and Translation'],sobre:['Traduzo documentos técnicos, jurídicos e institucionais, com revisão e controlo de terminologia.','I translate technical, legal and institutional documents, with proofreading and terminology control.'],
  xp:[['Tradutora freelancer','Freelance translator','Trabalho por conta própria','2019 – actualidade']]},
 {id:'t12',nome:'Paulo Ngovene',tit:['Auditor financeiro','Financial auditor'],pais:'ZA',cid:'Joanesburgo',sk:[64,63,1,67],lg:[[PT,'Portuguese','nat'],[EN,'English','C1']],exp:9,disp:'aberto',mail:null,
  fo:['Mestrado em Finanças','MSc in Finance'],sobre:['Auditorias a empresas de média dimensão em Moçambique e na África do Sul. Disponível para mudar de país.','Audits of mid-sized companies in Mozambique and South Africa. Available to relocate.'],
  xp:[['Auditor sénior','Senior auditor','Auditores Associados SA','2018 – actualidade']]},
 {id:'t13',nome:'Marta Cumbe',tit:['Assistente administrativa','Administrative assistant'],pais:'MZ',cid:'Tete',sk:[36,34,2,1],lg:[[PT,'Portuguese','nat']],exp:2,disp:'imediata',mail:'marta.cumbe@exemplo.co.mz',
  fo:['Curso de Secretariado e Administração','Secretarial and Administration course'],sobre:['Organizo agendas, arquivo e correspondência, e dou apoio a direcções e equipas comerciais.','I manage schedules, filing and correspondence, and support management and sales teams.'],
  xp:[['Secretária','Secretary','Mineira do Zambeze','2023 – 2025']]},
 {id:'t14',nome:'Dércio Matsinhe',tit:['Agente de atendimento ao cliente','Customer service agent'],pais:'MZ',cid:'Xai-Xai',sk:[12,15,11,16],lg:[[PT,'Portuguese','nat'],[EN,'English','B1']],exp:3,disp:'1mes',mail:null,
  fo:['Ensino médio com curso de vendas','High school with sales course'],sobre:['Atendo clientes por telefone, presencialmente e nas redes sociais, com foco em resolver à primeira.','I serve customers by phone, in person and on social media, focused on first-contact resolution.'],
  xp:[['Agente de atendimento','Customer service agent','Loja Central','2022 – 2025']]}
];
const AMOSTRA=6;                                            /* perfis visíveis nos planos sem acesso à base completa */
const BD={gratuito:0,basico:0,premium:1,enterprise:1};      /* = planos_assinatura.acesso_base_dados */
const full=()=>!!BD[MOCK.plano];
const pool=()=>full()?T:T.slice(0,AMOSTRA);
const hoje=()=>new Date().toISOString().slice(0,10);
const DISP={imediata:'ok','1mes':'in',aberto:''};
const tit=p=>p.tit[lang==='en'?1:0];
const lgN=a=>lang==='en'?a[1]:a[0];
const paisN=c=>{try{const n=new Intl.DisplayNames(lang==='en'?'en':'pt-PT',{type:'region'}).of(c);if(n&&n!==c)return n}catch(e){}return c};
const loc=p=>[p.cid,paisN(p.pais)].join(', ');
const ini=p=>p.nome.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const vTit=v=>lang==='en'&&v.titulo_en?v.titulo_en:v.titulo;
if(!Array.isArray(MOCK.guardados))MOCK.guardados=[];
if(!Array.isArray(MOCK.convites))MOCK.convites=[];
const S={q:'',sk:[],pais:'',disp:'',exp:0,o:'rel',tab:'todos',p:0};
Object.assign(D.pt,{'tl.pg':'Paginação','tl.pg.prev':'Anterior','tl.pg.next':'Próximo','tl.pg.of':'{a}–{b} de {n}'});

Object.assign(D.pt,{'tl.h':'Talentos','tl.p':'Encontre candidatos pelas competências, país e disponibilidade, e convide-os para as suas vagas.',
 'tl.k.all':'Perfis disponíveis','tl.k.now':'Disponíveis já','tl.k.sav':'Guardados','tl.k.inv':'Convites enviados',
 'tl.q':'Nome, cargo ou competência…','tl.q.l':'Pesquisar','tl.sk':'Competência','tl.sk.add':'Escolher…','tl.pais':'País','tl.pais.all':'Todos os países','tl.disp':'Disponibilidade','tl.disp.all':'Qualquer','tl.exp':'Experiência','tl.exp.0':'Qualquer','tl.exp.n':'{n} ano(s) de experiência','tl.exp.m':'{n}+ anos',
 'tl.o':'Ordenar','tl.o.rel':'Mais compatíveis','tl.o.exp':'Mais experiência','tl.o.nome':'Nome (A–Z)','tl.clear':'Limpar filtros','tl.rm':'Remover {s}',
 'tl.d.imediata':'Disponível já','tl.d.1mes':'Disponível em 1 mês','tl.d.aberto':'Aberto a propostas',
 'tl.tab.todos':'Todos','tl.tab.guardados':'Guardados','tl.n':'{n} perfil(is)','tl.none':'Nenhum perfil corresponde aos filtros.','tl.none.s':'Ainda não guardou perfis. Use o marcador nos cartões para os guardar aqui.',
 'tl.view':'Ver perfil','tl.inv':'Convidar','tl.sent':'Convidado','tl.save':'Guardar perfil','tl.unsave':'Remover dos guardados','tl.saved':'Perfil guardado.','tl.unsaved':'Perfil removido dos guardados.',
 'tl.match':'{n}% de compatibilidade','tl.match.t':'Compatibilidade com a vaga «{v}»',
 'tl.lock.k':'Plano {p}','tl.lock.t':'Está a ver uma amostra da base de talentos.','tl.lock.p':'Faltam {n} perfis. O acesso à base completa está nos planos Premium e Enterprise.','tl.lock.go':'Ver planos',
 'tl.m.about':'Sobre','tl.m.sk':'Competências','tl.m.lg':'Idiomas','tl.m.xp':'Experiência profissional','tl.m.fo':'Formação','tl.m.ct':'Contacto','tl.m.ct.no':'Este candidato não partilha o contacto directo. Convide-o para uma vaga e ele receberá a mensagem na plataforma.',
 'tl.lv.nat':'Nativo','tl.lv.B1':'Intermédio (B1)','tl.lv.B2':'Intermédio superior (B2)','tl.lv.C1':'Avançado (C1)','tl.lv.C2':'Fluente (C2)',
 'tl.i.t':'Convidar para uma vaga','tl.i.v':'Vaga','tl.i.m':'Mensagem','tl.i.msg':'Olá {n}, o seu perfil chamou-nos a atenção e gostaríamos de o convidar a candidatar-se à vaga «{v}».\n\nCom os melhores cumprimentos,\n{e}','tl.i.send':'Enviar convite','tl.i.ok':'Convite enviado a {n}.','tl.i.none':'Para convidar candidatos precisa de pelo menos uma vaga aberta.','tl.i.new':'Criar vaga','tl.i.dup':'Já convidou este candidato para esta vaga.','tl.cancel':'Cancelar','tl.pf.nf':'Perfil não encontrado.','tl.pf.lock':'Este perfil só está disponível nos planos Premium e Enterprise.','tl.back':'Voltar aos talentos','tl.prev':'Talento anterior','tl.next':'Talento seguinte','tl.of':'{i} de {n} nesta pesquisa',
 'tl.cv':'Ver CV','tl.dl':'Descarregar CV','tl.call':'Ligar','tl.open':'Abrir','tl.dl1':'Descarregar','tl.close':'Fechar','tl.demo':'Ficheiro de demonstração (sem anexo real).','tl.sem':'Sem ficheiro real: o candidato anexa o ficheiro e ele abre aqui.',
 'tl.mudanca':'Disponível para mudança','tl.remoto':'Disponível para trabalho remoto','tl.sim':'Sim','tl.nao':'Não','tl.s.disp':'Disponibilidade','tl.s.doc':'Documentos','tl.s.inv':'Convites enviados','tl.s.exp':'Experiência','tl.d.exp':'Experiência total',
 'tl.now':'Actual','tl.now.l':'actualidade','tl.conc':'Concluído','tl.anos':'{n} ano(s)','tl.req':'Competências exigidas pela vaga «{v}»: {a} de {b}','tl.miss':'Em falta','tl.priv':'O candidato não partilha este contacto.','tl.privE':'Email não partilhado','tl.principal':'Principal',
 'tl.none.exp':'Sem experiência profissional registada.','tl.none.fo':'Sem formação registada.','tl.none.doc':'Nenhum documento anexado.','tl.none.sk':'Sem competências registadas.','tl.none.inv':'Ainda não convidou este talento para nenhuma vaga.','tl.inv.on':'Convidado em {d}','tl.mensagem':'Mensagem enviada',
 'tl.nv.b':'Básico','tl.nv.i':'Intermédio','tl.nv.a':'Avançado','tl.doc.cv':'Currículo','tl.sob':'Resumo','tl.tag.sav':'Guardado'});
Object.assign(D.en,{'tl.h':'Talent','tl.p':'Find candidates by skills, country and availability, and invite them to your jobs.',
 'tl.k.all':'Profiles available','tl.k.now':'Available now','tl.k.sav':'Saved','tl.k.inv':'Invitations sent',
 'tl.q':'Name, role or skill…','tl.q.l':'Search','tl.sk':'Skill','tl.sk.add':'Choose…','tl.pais':'Country','tl.pais.all':'All countries','tl.disp':'Availability','tl.disp.all':'Any','tl.exp':'Experience','tl.exp.0':'Any','tl.exp.n':'{n} year(s) of experience','tl.exp.m':'{n}+ years',
 'tl.o':'Sort','tl.o.rel':'Best match','tl.o.exp':'Most experience','tl.o.nome':'Name (A–Z)','tl.clear':'Clear filters','tl.rm':'Remove {s}',
 'tl.d.imediata':'Available now','tl.d.1mes':'Available in 1 month','tl.d.aberto':'Open to offers',
 'tl.tab.todos':'All','tl.tab.guardados':'Saved','tl.n':'{n} profile(s)','tl.none':'No profile matches the filters.','tl.none.s':'You have not saved any profiles yet. Use the bookmark on the cards to save them here.',
 'tl.view':'View profile','tl.inv':'Invite','tl.sent':'Invited','tl.save':'Save profile','tl.unsave':'Remove from saved','tl.saved':'Profile saved.','tl.unsaved':'Profile removed from saved.',
 'tl.match':'{n}% match','tl.match.t':'Match with the job «{v}»',
 'tl.lock.k':'{p} plan','tl.lock.t':'You are viewing a sample of the talent database.','tl.lock.p':'{n} more profiles are hidden. Full database access comes with the Premium and Enterprise plans.','tl.lock.go':'See plans',
 'tl.m.about':'About','tl.m.sk':'Skills','tl.m.lg':'Languages','tl.m.xp':'Work experience','tl.m.fo':'Education','tl.m.ct':'Contact','tl.m.ct.no':'This candidate does not share direct contact details. Invite them to a job and they will get the message on the platform.',
 'tl.lv.nat':'Native','tl.lv.B1':'Intermediate (B1)','tl.lv.B2':'Upper intermediate (B2)','tl.lv.C1':'Advanced (C1)','tl.lv.C2':'Fluent (C2)',
 'tl.i.t':'Invite to a job','tl.i.v':'Job','tl.i.m':'Message','tl.i.msg':'Hello {n}, your profile caught our attention and we would like to invite you to apply for the job «{v}».\n\nKind regards,\n{e}','tl.i.send':'Send invitation','tl.i.ok':'Invitation sent to {n}.','tl.i.none':'To invite candidates you need at least one open job.','tl.i.new':'Create job','tl.i.dup':'You have already invited this candidate to this job.','tl.cancel':'Cancel','tl.pf.nf':'Profile not found.','tl.pf.lock':'This profile is only available on the Premium and Enterprise plans.','tl.back':'Back to talent','tl.prev':'Previous talent','tl.next':'Next talent','tl.of':'{i} of {n} in this search',
 'tl.pg':'Pagination','tl.pg.prev':'Previous','tl.pg.next':'Next','tl.pg.of':'{a}–{b} of {n}',
 'tl.cv':'View CV','tl.dl':'Download CV','tl.call':'Call','tl.open':'Open','tl.dl1':'Download','tl.close':'Close','tl.demo':'Demo file (no real attachment).','tl.sem':'No real file: the candidate attaches the file and it opens here.',
 'tl.mudanca':'Open to relocation','tl.remoto':'Open to remote work','tl.sim':'Yes','tl.nao':'No','tl.s.disp':'Availability','tl.s.doc':'Documents','tl.s.inv':'Invitations sent','tl.s.exp':'Experience','tl.d.exp':'Total experience',
 'tl.now':'Current','tl.now.l':'present','tl.conc':'Completed','tl.anos':'{n} year(s)','tl.req':'Skills required by the job «{v}»: {a} of {b}','tl.miss':'Missing','tl.priv':'The candidate does not share this contact.','tl.privE':'Email not shared','tl.principal':'Main',
 'tl.none.exp':'No work experience recorded.','tl.none.fo':'No education recorded.','tl.none.doc':'No documents attached.','tl.none.sk':'No skills recorded.','tl.none.inv':'You have not invited this talent to any job yet.','tl.inv.on':'Invited on {d}','tl.mensagem':'Message sent',
 'tl.nv.b':'Basic','tl.nv.i':'Intermediate','tl.nv.a':'Advanced','tl.doc.cv':'Résumé','tl.sob':'Summary','tl.tag.sav':'Saved'});

/* vagas abertas com competências: servem para calcular a compatibilidade de cada perfil */
const abertas=()=>(MOCK.vagas||[]).filter(v=>v.estado==='aberta'&&v.data_limite>=hoje());
const compat=p=>{let b=null;abertas().forEach(v=>{const c=(v.competencias||[]).map(Number);if(!c.length)return;const pc=Math.round(c.filter(x=>p.sk.includes(x)).length/c.length*100);if(!b||pc>b.pc)b={pc,v}});return b&&b.pc>0?b:null};

function filtrar(){
 const q=norm(S.q).trim().split(/\s+/).filter(Boolean);
 const L=pool().filter(p=>{
  if(S.tab==='guardados'&&!MOCK.guardados.includes(p.id))return false;
  if(S.pais&&p.pais!==S.pais)return false;
  if(S.disp&&p.disp!==S.disp)return false;
  if(p.exp<S.exp)return false;
  if(S.sk.length&&!S.sk.every(k=>p.sk.includes(k)))return false;
  if(q.length){const h=norm([p.nome,p.tit[0],p.tit[1],p.cid,...p.sk.map(k=>skN(k))].join(' '));if(!q.every(w=>h.includes(w)))return false}
  return true}).map(p=>({p,c:compat(p)}));
 L.sort(S.o==='exp'?(a,b)=>b.p.exp-a.p.exp:S.o==='nome'?(a,b)=>a.p.nome.localeCompare(b.p.nome):(a,b)=>(b.c?b.c.pc:-1)-(a.c?a.c.pc:-1)||b.p.exp-a.p.exp);
 return L}

function card({p,c}){
 const fav=MOCK.guardados.includes(p.id),inv=MOCK.convites.some(x=>x.tid===p.id);
 return `<article class="card tl-c"><div class="tl-h"><span class="tl-av" aria-hidden="true">${esc(ini(p))}</span><div class="tl-id"><h3><a href="#/talentos/perfil/${esc(p.id)}">${esc(p.nome)}</a></h3><p>${esc(tit(p))}</p></div>
  <button class="ib tl-fv${fav?' on':''}" type="button" data-a="tl-fav:${p.id}" aria-pressed="${fav}" aria-label="${t(fav?'tl.unsave':'tl.save')}"><i class="${fav?'fas':'far'} fa-bookmark" aria-hidden="true"></i></button></div>
  <ul class="tl-m"><li><i class="fas fa-location-dot" aria-hidden="true"></i><span>${esc(loc(p))}</span></li><li><i class="fas fa-briefcase" aria-hidden="true"></i><span>${t('tl.exp.n',{n:p.exp})}</span></li></ul>
  <div class="tl-t"><span class="tag ${DISP[p.disp]}">${t('tl.d.'+p.disp)}</span>${c?`<span class="tag tl-mt" title="${esc(t('tl.match.t',{v:vTit(c.v)}))}"><i class="fas fa-bullseye" aria-hidden="true"></i> ${t('tl.match',{n:c.pc})}</span>`:''}${inv?`<span class="tag in"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('tl.sent')}</span>`:''}</div>
  <div class="tl-s">${p.sk.slice(0,4).map(k=>`<span>${esc(skN(k))}</span>`).join('')}${p.sk.length>4?`<span class="more">+${p.sk.length-4}</span>`:''}</div>
  <div class="tl-b"><a class="btn btn-l" href="#/talentos/perfil/${esc(p.id)}">${t('tl.view')}</a><button class="btn btn-g" type="button" data-a="tl-inv:${p.id}"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('tl.inv')}</button></div></article>`}

function lock(){
 if(full())return '';
 return `<section class="card pn-rec tl-lock" aria-label="${t('tl.lock.t')}"><span class="pn-rec-i"><i class="fas fa-lock" aria-hidden="true"></i></span><div class="pn-rec-b"><span class="pn-rec-k">${t('tl.lock.k',{p:t('plano.'+MOCK.plano)})}</span><p><strong>${t('tl.lock.t')}</strong> ${t('tl.lock.p',{n:T.length-AMOSTRA})}</p></div><a class="btn btn-g" href="#/plano">${t('tl.lock.go')}</a></section>`}

function kpis(){
 const P=pool(),k=[['fa-users-viewfinder','tl.k.all',P.length],['fa-bolt','tl.k.now',P.filter(p=>p.disp==='imediata').length],['fa-bookmark','tl.k.sav',P.filter(p=>MOCK.guardados.includes(p.id)).length],['fa-paper-plane','tl.k.inv',MOCK.convites.length]];
 return `<div class="stats" id="tlK">${k.map(([i,l,n])=>`<div class="stat"><span class="ic"><i class="fas ${i}" aria-hidden="true"></i></span><div><b>${n}</b><span>${t(l)}</span></div></div>`).join('')}</div>`}

function chips(){
 return S.sk.map(k=>`<button type="button" class="tl-chip" data-a="tl-rsk:${k}" aria-label="${esc(t('tl.rm',{s:skN(k)}))}">${esc(skN(k))} <i class="fas fa-xmark" aria-hidden="true"></i></button>`).join('')}

/* Carrossel de talentos: desliza com o dedo (telemóvel); no computador, com 3 ou mais cartões, tem Anterior/Próximo e barra de rolagem */
function carrossel(L){const n=L.length;
 return `<div class="tl-carw"><div class="tl-row" id="tlRow" tabindex="0" role="region" aria-label="${esc(t('n.tal'))}">${L.map(card).join('')}</div>`+
  (n<3?'':`<nav class="pg in tl-car" aria-label="${t('tl.pg')}"><span class="pg-b"><button class="btn btn-l btn-s" type="button" data-a="tl-car:-1" disabled><i class="fas fa-chevron-left" aria-hidden="true"></i> ${t('tl.pg.prev')}</button><button class="btn btn-l btn-s" type="button" data-a="tl-car:1">${t('tl.pg.next')} <i class="fas fa-chevron-right" aria-hidden="true"></i></button></span></nav>`)+`</div>`}
function carSync(){const w=document.querySelector('.tl-carw'),r=w&&w.querySelector('.tl-row');if(!r)return;
 const p=w.querySelector('[data-a="tl-car:-1"]'),n=w.querySelector('[data-a="tl-car:1"]');
 if(p)p.disabled=r.scrollLeft<=2;if(n)n.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-2}
function resultado(){
 const L=filtrar();
 const vazio=`<div class="state card"><i class="fas ${S.tab==='guardados'&&!MOCK.guardados.length?'fa-bookmark':'fa-magnifying-glass'}" aria-hidden="true"></i><p>${t(S.tab==='guardados'&&!MOCK.guardados.length?'tl.none.s':'tl.none')}</p></div>`;
 setTimeout(carSync,60);
 return `<p class="tl-cnt" aria-live="polite">${t('tl.n',{n:L.length})}</p>`+(L.length?carrossel(L):vazio)}
Actions['tl-car']=(b,d)=>{const w=b.closest('.tl-carw'),r=w&&w.querySelector('.tl-row'),c=r&&r.querySelector('.tl-c');if(!c)return;
 const w1=c.getBoundingClientRect().width+(parseFloat(getComputedStyle(r).columnGap)||16);
 const k=Math.max(1,Math.floor((r.clientWidth+1)/w1)); /* uma página = os cartões visíveis (3 no computador) */
 r.scrollBy({left:(+d)*w1*k,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
document.addEventListener('scroll',e=>{const r=e.target;if(r&&r.classList&&r.classList.contains('tl-row'))carSync()},{capture:true,passive:true});
addEventListener('resize',carSync);

function filtros(){
 const P=pool(),paises=(window.LERMO_PAISES?window.LERMO_PAISES.map(x=>x[0]):[...new Set(P.map(p=>p.pais))]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang)); /* lista completa (js/paises.js, 249 países), como em Eventos, Perfil e Registo */
 const sk=[...new Set(P.flatMap(p=>p.sk))].filter(k=>!S.sk.includes(k)).sort((a,b)=>skN(a).localeCompare(skN(b)));
 const op=(v,l,c)=>`<option value="${v}"${String(c)===String(v)?' selected':''}>${esc(l)}</option>`;
 return `<section class="card tl-f" aria-label="${t('tl.q.l')}"><div class="tl-fg">
  <label class="tl-q"><span class="sr">${t('tl.q.l')}</span><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="tlQ" type="search" value="${esc(S.q)}" placeholder="${esc(t('tl.q'))}" autocomplete="off" maxlength="80"></label>
  <label><span>${t('tl.sk')}</span><select id="tlSk"><option value="">${t('tl.sk.add')}</option>${sk.map(k=>op(k,skN(k),'')).join('')}</select></label>
  <label><span>${t('tl.pais')}</span><select id="tlPa">${op('',t('tl.pais.all'),S.pais)}${paises.map(c=>op(c,paisN(c),S.pais)).join('')}</select></label>
  <label><span>${t('tl.disp')}</span><select id="tlDi">${op('',t('tl.disp.all'),S.disp)}${Object.keys(DISP).map(d=>op(d,t('tl.d.'+d),S.disp)).join('')}</select></label>
  <label><span>${t('tl.exp')}</span><select id="tlEx">${[0,1,3,5,8].map(n=>op(n,n?t('tl.exp.m',{n}):t('tl.exp.0'),S.exp)).join('')}</select></label>
  <label><span>${t('tl.o')}</span><select id="tlOr">${[['rel','tl.o.rel'],['exp','tl.o.exp'],['nome','tl.o.nome']].map(([v,l])=>op(v,t(l),S.o)).join('')}</select></label></div>
  <div class="tl-fb"><div class="tl-chips" id="tlC">${chips()}</div><button class="btn btn-l btn-s" type="button" data-a="tl-clear"><i class="fas fa-rotate-left" aria-hidden="true"></i> ${t('tl.clear')}</button></div></section>`}

function pagina(){
 return `<h1 class="sr">${t('tl.h')}</h1>`+crumbs([[t('n.dash'),'#/dashboard'],[t('n.tal')]])+
  `<section class="hello"><div><h1>${t('n.tal')}</h1><p>${t('tl.p')}</p></div></section>`+kpis()+lock()+filtros()+
  `<div class="seg tl-tabs" role="group" aria-label="${t('n.tal')}">${['todos','guardados'].map(k=>`<button type="button" data-a="tl-tab:${k}" aria-pressed="${S.tab===k}"><i class="fas ${k==='todos'?'fa-users':'fa-bookmark'}" aria-hidden="true"></i> ${t('tl.tab.'+k)}</button>`).join('')}</div><div id="tlR">${resultado()}</div>`}

/* actualiza só o que muda (mantém o foco na caixa de pesquisa) */
function upd(){
 const r=$('#tlR');if(!r)return;r.innerHTML=resultado();
 const c=$('#tlC');if(c)c.innerHTML=chips();
 const k=$('#tlK');if(k)k.outerHTML=kpis();
 document.querySelectorAll('.tl-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.a==='tl-tab:'+S.tab)));
 const s=$('#tlSk');if(s){const P=pool(),sk=[...new Set(P.flatMap(p=>p.sk))].filter(k=>!S.sk.includes(k)).sort((a,b)=>skN(a).localeCompare(skN(b)));s.innerHTML=`<option value="">${t('tl.sk.add')}</option>`+sk.map(k=>`<option value="${k}">${esc(skN(k))}</option>`).join('')}}
const refresh=()=>{if(/^#\/talentos/.test(location.hash)){$('#main').innerHTML=pagina();ligar()}};

function ligar(){
 const on=(id,ev,fn)=>{const e=$('#'+id);e&&e.addEventListener(ev,fn)};
 on('tlQ','input',e=>{S.q=e.target.value;S.p=0;upd()});
 on('tlSk','change',e=>{const v=+e.target.value;if(v&&!S.sk.includes(v))S.sk.push(v);S.p=0;upd()});
 on('tlPa','change',e=>{S.pais=e.target.value;S.p=0;upd()});
 on('tlDi','change',e=>{S.disp=e.target.value;S.p=0;upd()});
 on('tlEx','change',e=>{S.exp=+e.target.value;S.p=0;upd()});
 on('tlOr','change',e=>{S.o=e.target.value;S.p=0;upd()});
}
const acha=id=>{const p=T.find(x=>x.id===id);return p&&pool().includes(p)?p:null};
Views.talentos=async(id,sub)=>{await new Promise(r=>setTimeout(r,150));
 if(id==='perfil')return paginaPerfil(sub);
 if(!full()&&S.tab==='guardados'&&!MOCK.guardados.length)S.tab='todos';return{title:t('n.tal'),html:pagina(),after:ligar}};

/* ======================================================================
   PERFIL COMPLETO DO TALENTO — página #/talentos/perfil/<id>
   Mesmo molde do perfil da candidatura (#/candidaturas/perfil/<id>): cabeçalho, acções, anterior/seguinte e secções completas.
   Em produção: GET /api/empresa/talentos/{id} devolve o perfil com: resumo_pessoal, foto_url, telefone, mostrar_email, mostrar_telefone,
   disponivel_para_mudanca, disponivel_para_remoto, experiencias[], formacoes[], competencias[{id,nivel,anos}], idiomas[], documentos[].
   A API só devolve os contactos que o candidato partilha (preferencias_privacidade) e respeita o limite do plano.
   Os dados abaixo são de demonstração: derivados dos perfis acima (as instituições são fictícias).
   ====================================================================== */
const INST={MZ:['Universidade do Índico','Instituto Superior do Limpopo','Universidade Zambeze Nova','Instituto Politécnico de Nacala'],PT:['Universidade de Lisboa','Universidade do Porto'],ZA:['University of the Witwatersrand','University of Cape Town']};
const NV=['b','i','a'];
const slug=n=>n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z]+/g,'_').replace(/^_|_$/g,'');
const fD=d=>{try{return new Intl.DateTimeFormat(lang==='en'?'en-GB':'pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(String(d).slice(0,10)+'T00:00:00'))}catch(e){return d}};
const kb=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const PRE={MZ:n=>'+258 8'+(2+n%5)+' '+String(100+(n*37)%900)+' '+String(1000+(n*911)%9000),PT:n=>'+351 9'+(1+n%4)+' '+String(100+(n*53)%900)+' '+String(100+(n*71)%900),ZA:n=>'+27 8'+(1+n%4)+' '+String(100+(n*41)%900)+' '+String(1000+(n*613)%9000)};
function perfil(p){
 if(p.pf)return p.pf;
 const n=parseInt(String(p.id).replace(/\D/g,''),10)||0,ins=INST[p.pais]||INST.MZ;
 return p.pf={
  telefone:(PRE[p.pais]||PRE.MZ)(n),mostrar_email:!!p.mail,mostrar_telefone:!!p.mail,
  disponivel_para_mudanca:p.disp==='aberto'||p.pais!=='MZ',disponivel_para_remoto:n%3!==0||p.pais!=='MZ',
  competencias:p.sk.map((id,i)=>({id,nivel:NV[(n+i)%3],anos:Math.max(1,Math.min(p.exp,1+(n+i)%4))})),
  idiomas:p.lg.map((a,i)=>({nome:a,nivel:a[2],principal:i===0})),
  experiencias:p.xp.map(x=>({cargo:[x[0],x[1]],empresa:x[2],periodo:x[3],actual:/actualidade/.test(x[3])})),
  formacoes:[{curso:p.fo,instituicao:ins[n%ins.length],concluido:true}],
  documentos:[{id:'cv'+p.id,tipo:'CV',nome_ficheiro:'CV_'+slug(p.nome)+'.pdf',tipo_mime:'application/pdf',tamanho_bytes:160000+n*8100,criado_em:hoje(),url:null}]}}

const sec2=(k,ti,body,extra)=>`<section class="card cp-sec" aria-labelledby="tp-${k}"><div class="ch"><h2 id="tp-${k}">${ti}</h2>${extra||''}</div>${body}</section>`;
const vz=m=>`<p class="cp-empty">${t(m)}</p>`;
const lista=()=>{const L=filtrar().map(x=>x.p);return L};
function docRow(p,d){
 return `<li class="cp-doc"><span class="ic" aria-hidden="true"><i class="fas fa-file-lines"></i></span><div class="cp-dn"><b>${esc(d.nome_ficheiro)}</b><small>${t('tl.doc.cv')} · ${kb(d.tamanho_bytes)} · ${fD(d.criado_em)}${d.url?'':' · '+t('tl.demo')}</small></div><div class="cp-da"><button class="btn btn-l btn-s" type="button" data-a="tl-open:${p.id}"><i class="fas fa-eye" aria-hidden="true"></i> ${t('tl.open')}</button><button class="btn btn-l btn-s" type="button" data-a="tl-dl:${p.id}" aria-label="${t('tl.dl1')}: ${esc(d.nome_ficheiro)}"><i class="fas fa-download" aria-hidden="true"></i></button></div></li>`}

function paginaPerfil(id){
 const back0=crumbs([[t('n.dash'),'#/dashboard'],[t('n.tal'),'#/talentos'],[t('tl.pf.nf')]]);
 const p=acha(id);
 if(!p){const lk=T.some(x=>x.id===id);
  return{title:t('n.tal'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.tal'),'#/talentos'],[lk?t('tl.lock.k',{p:t('plano.'+MOCK.plano)}):t('tl.pf.nf')]])+`<div class="state card"><i class="fas ${lk?'fa-lock':'fa-user-slash'}" aria-hidden="true"></i><p>${t(lk?'tl.pf.lock':'tl.pf.nf')}</p><br>${lk?`<a class="btn btn-g" href="#/plano">${t('tl.lock.go')}</a> `:''}<a class="btn btn-l" href="#/talentos">${t('tl.back')}</a></div>`}}
 const L=lang==='en'?1:0,pf=perfil(p),cm=compat(p),fav=MOCK.guardados.includes(p.id),inv=MOCK.convites.filter(x=>x.tid===p.id);
 let irm=lista();if(!irm.some(x=>x.id===p.id))irm=pool();
 const i=irm.findIndex(x=>x.id===p.id),ant=irm[i-1],seg=irm[i+1];
 const lk=(x,ic,l)=>x?`<a class="ib" href="#/talentos/perfil/${esc(x.id)}" aria-label="${t(l)}: ${esc(x.nome)}" title="${t(l)}"><i class="fas ${ic}" aria-hidden="true"></i></a>`:`<span class="ib cp-off" aria-hidden="true"><i class="fas ${ic}"></i></span>`;
 const facts=[['fa-location-dot',loc(p)],['fa-briefcase',t('tl.exp.n',{n:p.exp})],pf.disponivel_para_mudanca&&['fa-suitcase-rolling',t('tl.mudanca')],pf.disponivel_para_remoto&&['fa-house-laptop',t('tl.remoto')]].filter(Boolean).map(([ic,x])=>`<span><i class="fas ${ic}" aria-hidden="true"></i>${esc(x)}</span>`).join('');
 const cv=pf.documentos.find(d=>d.tipo==='CV'),tel=pf.mostrar_telefone?pf.telefone:'';
 const head=`<section class="card cp-hd"><div class="cp-id"><span class="vgc-ic cd-av cp-av" aria-hidden="true">${esc(ini(p))}</span><div><h1>${esc(p.nome)}</h1><p>${esc(tit(p))}</p><div class="vg-tags"><span class="tag ${DISP[p.disp]}">${t('tl.d.'+p.disp)}</span>${cm?`<span class="tag in" title="${esc(t('tl.match.t',{v:vTit(cm.v)}))}">${t('tl.match',{n:cm.pc})}</span>`:''}${fav?`<span class="tag ok"><i class="fas fa-bookmark" aria-hidden="true"></i> ${t('tl.tag.sav')}</span>`:''}${inv.length?`<span class="tag in"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('tl.sent')}</span>`:''}</div><div class="vg-m2">${facts}</div></div></div>
  <div class="cp-act">${cv?`<button class="btn btn-g" type="button" data-a="tl-open:${p.id}"><i class="fas fa-file-lines" aria-hidden="true"></i> ${t('tl.cv')}</button><button class="btn btn-l" type="button" data-a="tl-dl:${p.id}"><i class="fas fa-download" aria-hidden="true"></i> ${t('tl.dl')}</button>`:''}<button class="btn btn-l" type="button" data-a="tl-inv:${p.id}"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('tl.inv')}</button>${tel?`<a class="btn btn-l" href="tel:${esc(tel.replace(/\s/g,''))}"><i class="fas fa-phone" aria-hidden="true"></i> ${t('tl.call')}</a>`:''}<button class="btn btn-l" type="button" data-a="tl-fav:${p.id}" aria-pressed="${fav}"><i class="${fav?'fas':'far'} fa-bookmark" aria-hidden="true"></i> ${t(fav?'tl.unsave':'tl.save')}</button></div>
  <div class="cp-nav"><a class="btn btn-l btn-s" href="#/talentos"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('tl.back')}</a><span>${t('tl.of',{i:i+1,n:irm.length})}</span>${lk(ant,'fa-chevron-left','tl.prev')}${lk(seg,'fa-chevron-right','tl.next')}</div></section>`;
 const res=sec2('res',t('tl.sob'),`<p class="cp-txt">${esc(p.sobre[L])}</p>`);
 const disp=sec2('disp',t('tl.s.disp'),`<ul class="vgc-l cd-fl"><li><i class="fas fa-bolt" aria-hidden="true"></i><span><b>${t('tl.disp')}:</b> ${t('tl.d.'+p.disp)}</span></li><li><i class="fas fa-briefcase" aria-hidden="true"></i><span><b>${t('tl.d.exp')}:</b> ${t('tl.anos',{n:p.exp})}</span></li><li><i class="fas fa-suitcase-rolling" aria-hidden="true"></i><span><b>${t('tl.mudanca')}:</b> ${t(pf.disponivel_para_mudanca?'tl.sim':'tl.nao')}</span></li><li><i class="fas fa-house-laptop" aria-hidden="true"></i><span><b>${t('tl.remoto')}:</b> ${t(pf.disponivel_para_remoto?'tl.sim':'tl.nao')}</span></li>${cm?`<li><i class="fas fa-bullseye" aria-hidden="true"></i><span><b>${t('tl.match.t',{v:esc(vTit(cm.v))})}:</b> <span class="cd-m"><i style="width:${cm.pc}%"></i></span>${cm.pc}%</span></li>`:''}</ul>`);
 const per=x=>x.replace('actualidade',t('tl.now.l'));
 const exp=sec2('exp',t('tl.m.xp'),pf.experiencias.length?`<div id="pl-exp"><ul class="cp-tl">${pf.experiencias.map(e=>`<li><b>${esc(e.cargo[L])}</b><span>${esc(e.empresa)} · ${esc(per(e.periodo))}</span>${e.actual?`<span class="tag ok">${t('tl.now')}</span>`:''}</li>`).join('')}</ul></div>`:vz('tl.none.exp'));
 const form=sec2('form',t('tl.m.fo'),pf.formacoes.length?`<div id="pl-form"><ul class="cp-tl">${pf.formacoes.map(f=>`<li><b>${esc(f.curso[L])}</b><span>${esc(f.instituicao)}</span><span class="tag ${f.concluido?'ok':''}">${t(f.concluido?'tl.conc':'tl.d.aberto')}</span></li>`).join('')}</ul></div>`:vz('tl.none.fo'));
 const req=cm?(cm.v.competencias||[]).map(Number):[],tem=req.filter(x=>p.sk.includes(x)),falta=req.filter(x=>!tem.includes(x));
 const sk=sec2('sk',t('tl.m.sk'),(req.length?`<p class="cp-req"><b>${t('tl.req',{v:esc(vTit(cm.v)),a:tem.length,b:req.length})}</b></p>`:'')+(pf.competencias.length||falta.length?`<ul class="cp-chips">${pf.competencias.map(k=>`<li class="cp-chip${req.includes(k.id)?' ok':''}">${req.includes(k.id)?'<i class="fas fa-check" aria-hidden="true"></i> ':''}${esc(skN(k.id))}<small>${t('tl.nv.'+k.nivel)} · ${t('tl.anos',{n:k.anos})}</small></li>`).join('')}${falta.map(x=>`<li class="cp-chip miss"><i class="fas fa-xmark" aria-hidden="true"></i> ${esc(skN(x)||'#'+x)}<small>${t('tl.miss')}</small></li>`).join('')}</ul>`:vz('tl.none.sk')));
 const idi=sec2('idi',t('tl.m.lg'),pf.idiomas.length?`<ul class="cp-lg">${pf.idiomas.map(l=>`<li><span>${esc(lgN(l.nome))}${l.principal?` <span class="tag in">${t('tl.principal')}</span>`:''}</span><b>${t('tl.lv.'+l.nivel)}</b></li>`).join('')}</ul>`:vz('tl.none.sk'));
 const docs=sec2('doc',t('tl.s.doc'),pf.documentos.length?`<ul class="cp-docs">${pf.documentos.map(d=>docRow(p,d)).join('')}</ul>`:vz('tl.none.doc'));
 const ctc=sec2('ct',t('tl.m.ct'),`<ul class="vgc-l cd-fl"><li><i class="fas fa-envelope" aria-hidden="true"></i><span>${p.mail&&pf.mostrar_email?`<a href="mailto:${esc(p.mail)}">${esc(p.mail)}</a>`:`<em>${t('tl.privE')}</em>`}</span></li><li><i class="fas fa-phone" aria-hidden="true"></i><span>${tel?`<a href="tel:${esc(tel.replace(/\s/g,''))}">${esc(tel)}</a>`:`<em>${t('tl.priv')}</em>`}</span></li><li><i class="fas fa-location-dot" aria-hidden="true"></i><span>${esc(loc(p))}</span></li></ul>`);
 const vgN=vid=>{const v=(MOCK.vagas||[]).find(x=>x.vaga_id===vid);return v?vTit(v):'—'};
 const inx=sec2('inv',t('tl.s.inv'),inv.length?`<ul class="ms-l">${inv.slice().reverse().map(c=>`<li><details><summary><b>${esc(vgN(c.vaga_id))}</b><small>${t('tl.inv.on',{d:fD(c.data)})}</small></summary><p class="cp-txt">${esc(c.mensagem)}</p></details></li>`).join('')}</ul>`:vz('tl.none.inv'),`<button class="btn btn-l btn-s" type="button" data-a="tl-inv:${p.id}"><i class="fas fa-plus" aria-hidden="true"></i> ${t('tl.inv')}</button>`);
 return{title:p.nome,html:`<h1 class="sr">${esc(p.nome)}</h1>`+crumbs([[t('n.dash'),'#/dashboard'],[t('n.tal'),'#/talentos'],[p.nome]])+head+[[res,disp],[exp,form],[sk,idi],[docs,ctc],[inx]].map(r=>`<div class="cp-row">${r.join('')}</div>`).join('')}}

/* repinta a ficha aberta (depois de guardar ou convidar) sem perder o sítio */
const noPerfil=()=>{const m=location.hash.match(/^#\/talentos\/perfil\/([^/?]+)/);return m?decodeURIComponent(m[1]):null};
function repintar(foco){const id=noPerfil();if(!id)return;const o=paginaPerfil(id);$('#main').innerHTML=o.html;if(foco){const b=document.querySelector(foco);b&&b.focus({preventScroll:true})}}

/* CV (montado com os dados do perfil) e documentos: abrir e descarregar. Reaproveita o gerador de PDF da candidatura (window.LERMO_PDF). */
function pdfCV(p,d){
 const K=window.LERMO_PDF;if(!K)return null;
 const {pdfMk,pdfSec,pdfEntry,PD}=K,pf=perfil(p),L=lang==='en'?1:0,S=pdfMk(595,842,54);S.nova();
 const {W,H,M}=S,ct=[pf.mostrar_email?p.mail:'',pf.mostrar_telefone?pf.telefone:'',loc(p)].filter(Boolean).join('   |   ');
 S.rect(PD.g,0,H-118,W,118);S.rect(PD.o,0,H-121,W,3);
 S.y=H-52;S.put(p.nome,23,1,'1 1 1',M);S.y=H-72;S.put(tit(p),11.5,0,PD.c,M);S.y=H-95;S.put(ct,9.5,0,'0.86 0.91 0.88',M);S.y=H-150;
 pdfSec(S,t('tl.sob'));S.para(p.sobre[L],10,PD.t);
 pdfSec(S,t('tl.m.xp'));pf.experiencias.forEach(e=>pdfEntry(S,e.cargo[L],e.periodo.replace('actualidade',t('tl.now.l')),e.empresa,''));
 pdfSec(S,t('tl.m.fo'));pf.formacoes.forEach(f=>pdfEntry(S,f.curso[L],'',f.instituicao,''));
 pdfSec(S,t('tl.m.sk'));S.para(pf.competencias.map(k=>skN(k.id)).join('  \u2022  '),10,PD.t);
 pdfSec(S,t('tl.m.lg'));S.para(pf.idiomas.map(l=>lgN(l.nome)+' ('+t('tl.lv.'+l.nivel)+')').join('  \u2022  '),10,PD.t);
 const n=S.pages.length;S.pages.forEach((q,i)=>{S.pg=q;S.y=28;S.put(p.nome+'   |   '+(i+1)+'/'+n,8,0,'0.5 0.5 0.5',M)});
 return S.out(d.nome_ficheiro,p.nome)}
Actions['tl-open']=(b,id)=>{const p=acha(id);if(!p)return;const d=perfil(p).documentos[0],bl=pdfCV(p,d);if(!bl){toast(t('tl.sem'));return}
 const u=URL.createObjectURL(bl),m=Modal.open({title:d.nome_ficheiro,body:`<p class="cp-cvh">${t('tl.demo')}</p><iframe class="cp-pdf" src="${esc(u)}" title="${esc(d.nome_ficheiro)}"></iframe><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('tl.close')}</button><button class="btn btn-g" type="button" data-a="tl-dl:${p.id}"><i class="fas fa-download" aria-hidden="true"></i> ${t('tl.dl1')}</button></div>`});
 m.firstElementChild.classList.add('cp-mod')};
Actions['tl-dl']=(b,id)=>{const p=acha(id);if(!p)return;const d=perfil(p).documentos[0],bl=pdfCV(p,d);if(!bl){toast(t('tl.sem'));return}
 const u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download=d.nome_ficheiro;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)};

Actions['tl-ver']=(b,id)=>{location.hash='#/talentos/perfil/'+id};
Actions['tl-fav']=(b,id)=>{
 const p=acha(id);if(!p)return;const i=MOCK.guardados.indexOf(id);
 if(i<0){MOCK.guardados.push(id);toast(t('tl.saved'))}else{MOCK.guardados.splice(i,1);toast(t('tl.unsaved'))}
 upd();repintar('[data-a^="tl-fav:"]')};

/* ---------- convite para uma vaga ----------
   Três modos (como as mensagens das candidaturas): Automática (modelo pronto), Personalizar (parte do modelo e edita) e Manual (de raiz).
   O convite é enviado pela plataforma e uma cópia por email; a empresa nunca vê o email do candidato.
   Em produção: POST /api/empresa/vagas/{id}/convites {candidato_id,modo,assunto,mensagem} -> tabela convites_talento (SQL v5.14);
   o servidor envia a notificação e o email ao candidato (utilizadores.email) sem o expor ao navegador.
   Demo: o convite também fica em localStorage['lermo-convites-demo'] para a área Convites do painel do candidato o mostrar. */
const TIPOS=[[1,'Estágio','Internship'],[2,'Emprego efectivo','Full-time job'],[3,'Trainee','Trainee'],[4,'Freelance','Freelance']],REGS=[[1,'Presencial','On-site'],[2,'Híbrido','Hybrid'],[3,'Remoto','Remote']];
const cNm=(L,id)=>{const x=L.find(y=>y[0]===+id);return x?x[lang==='en'?2:1]:''};
const IV={p:null,V:[],modo:'auto',vaga:null,last:''};
Object.assign(D.pt,{'tl.i.info':'O convite é enviado pela plataforma e o candidato recebe também uma cópia por email. Não precisa de ver nem de escrever o email dele.',
 'tl.i.m.auto':'Automática','tl.i.m.custom':'Personalizar','tl.i.m.manual':'Manual','tl.i.d.auto':'Usa o modelo pronto, sem alterações.','tl.i.d.custom':'Parte do modelo e pode editar o texto.','tl.i.d.manual':'Escreva o convite de raiz.',
 'tl.i.sub':'Assunto','tl.i.subj':'Convite para a vaga «{v}» — {e}','tl.i.sum':'Resumo da vaga','tl.i.lim':'Candidaturas até {d}','tl.i.vg1':'{n} lugar','tl.i.vgn':'{n} lugares','tl.i.cnt':'{n}/3000','tl.i.err.sub':'Escreva o assunto e a mensagem.','tl.i.sentc':'Convite enviado a {n}. Receberá a notificação na plataforma e uma cópia por email.'});
Object.assign(D.en,{'tl.i.info':'The invitation is sent through the platform and the candidate also gets a copy by email. You do not need to see or type their email.',
 'tl.i.m.auto':'Automatic','tl.i.m.custom':'Customise','tl.i.m.manual':'Manual','tl.i.d.auto':'Uses the ready-made template, unchanged.','tl.i.d.custom':'Starts from the template and you can edit the text.','tl.i.d.manual':'Write the invitation from scratch.',
 'tl.i.sub':'Subject','tl.i.subj':'Invitation to the job «{v}» — {e}','tl.i.sum':'Job summary','tl.i.lim':'Applications until {d}','tl.i.vg1':'{n} opening','tl.i.vgn':'{n} openings','tl.i.cnt':'{n}/3000','tl.i.err.sub':'Write the subject and the message.','tl.i.sentc':'Invitation sent to {n}. They will get the notification on the platform and a copy by email.'});
const empN=()=>(MOCK.empresa&&MOCK.empresa.nome)||(Session.get()||{}).nome_completo||'';
const vagaLoc=v=>[v.cidade,v.provincia,v.pais_id&&paisN(v.pais_id)].filter(Boolean).join(', ');
function resumoVaga(v){
 const n=Math.max(1,+v.vagas_disponiveis||1);
 return `<ul class="tl-vs"><li><i class="fas fa-tag" aria-hidden="true"></i><span>${esc(cNm(TIPOS,v.tipo_id))}${cNm(REGS,v.regime_id)?' · '+esc(cNm(REGS,v.regime_id)):''}</span></li>${vagaLoc(v)?`<li><i class="fas fa-location-dot" aria-hidden="true"></i><span>${esc(vagaLoc(v))}</span></li>`:''}<li><i class="fas fa-clock" aria-hidden="true"></i><span>${t('tl.i.lim',{d:fD(v.data_limite)})}</span></li><li><i class="fas fa-users" aria-hidden="true"></i><span>${t(n===1?'tl.i.vg1':'tl.i.vgn',{n})}</span></li></ul>`}
const ivTpl=()=>{const v=IV.vaga,u=Session.get()||{};return{s:t('tl.i.subj',{v:vTit(v),e:empN()}),b:t('tl.i.msg',{n:IV.p.nome.split(' ')[0],v:vTit(v),e:u.nome_completo||empN()})}};
function ivSync(refill){
 const S_=$('#tlIs'),B=$('#tlIm'),man=IV.modo==='manual',aut=IV.modo==='auto',v=IV.vaga,dup=MOCK.convites.some(c=>c.tid===IV.p.id&&c.vaga_id===v.vaga_id);
 S_.readOnly=B.readOnly=aut;$('#tlId').textContent=t('tl.i.d.'+IV.modo);
 document.querySelectorAll('#tlIM button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a.split(':')[1]===IV.modo));
 if(refill){if(man){S_.value='';B.value=''}else{const x=ivTpl();S_.value=x.s;B.value=x.b}IV.last=B.value}
 $('#tlIsum').innerHTML=resumoVaga(v);$('#tlIc').textContent=t('tl.i.cnt',{n:B.value.length});
 const er=$('#tlIE');if(dup){er.textContent=t('tl.i.dup');er.hidden=false}else er.hidden=true;$('#tlIb').disabled=dup}
Actions['tl-inv']=(b,id)=>{
 const p=acha(id);if(!p)return;const V=abertas();
 if(!V.length){Modal.open({title:t('tl.i.t'),body:`<div class="state"><i class="fas fa-briefcase" aria-hidden="true"></i><p>${t('tl.i.none')}</p><br><a class="btn btn-g" href="#/vagas" data-a="modal-close">${t('tl.i.new')}</a></div>`});return}
 IV.p=p;IV.V=V;IV.modo='auto';IV.vaga=(compat(p)||{}).v||V[0];
 const seg=['auto','custom','manual'].map(m=>`<button type="button" data-a="tl-i-mode:${m}" aria-pressed="${m==='auto'}">${t('tl.i.m.'+m)}</button>`).join('');
 const m=Modal.open({title:t('tl.i.t')+' — '+p.nome,body:`<p class="ms-info"><i class="fas fa-shield-halved" aria-hidden="true"></i> <span>${t('tl.i.info')}</span></p>
  <form id="tlIF" novalidate><div class="fld"><label for="tlIv">${t('tl.i.v')}</label><select id="tlIv">${V.map(v=>`<option value="${v.vaga_id}"${v===IV.vaga?' selected':''}>${esc(vTit(v))}</option>`).join('')}</select></div>
  <div class="tl-sm"><b>${t('tl.i.sum')}</b><div id="tlIsum"></div></div>
  <div class="seg ms-seg" role="group" aria-label="${t('tl.i.m')}" id="tlIM">${seg}</div><p class="ms-d" id="tlId"></p>
  <div class="fld"><label for="tlIs">${t('tl.i.sub')}</label><input id="tlIs" type="text" maxlength="200"></div>
  <div class="fld" style="margin-top:.7rem"><label for="tlIm">${t('tl.i.m')}</label><textarea id="tlIm" rows="8" maxlength="3000"></textarea><small class="tl-cn" id="tlIc"></small></div>
  <p class="ferr box" id="tlIE" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('tl.cancel')}</button><button class="btn btn-g" type="submit" id="tlIb"><i class="fas fa-paper-plane" aria-hidden="true"></i> ${t('tl.i.send')}</button></div></form>`});
 m.firstElementChild.classList.add('cp-mod');ivSync(true);
 $('#tlIv').addEventListener('change',e=>{IV.vaga=IV.V.find(x=>x.vaga_id===e.target.value)||IV.vaga;ivSync(IV.modo==='auto'||(IV.modo==='custom'&&$('#tlIm').value===IV.last))});
 $('#tlIm').addEventListener('input',()=>{$('#tlIc').textContent=t('tl.i.cnt',{n:$('#tlIm').value.length})});
 $('#tlIF').addEventListener('submit',ev=>{
  ev.preventDefault();const v=IV.vaga,s=$('#tlIs').value.trim(),tx=$('#tlIm').value.trim(),er=$('#tlIE');
  if(MOCK.convites.some(c=>c.tid===p.id&&c.vaga_id===v.vaga_id)){er.textContent=t('tl.i.dup');er.hidden=false;return}
  if(!s||!tx){er.textContent=t('tl.i.err.sub');er.hidden=false;(s?$('#tlIm'):$('#tlIs')).focus();return}
  const modo=IV.modo,agora=new Date().toISOString();
  MOCK.convites.push({tid:p.id,vaga_id:v.vaga_id,assunto:s,mensagem:tx,modo,data:agora.slice(0,10)});
  try{const k='lermo-convites-demo',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({id:'cv-'+Date.now(),tid:p.id,empresa:empN(),vaga:{id:v.vaga_id,titulo:v.titulo,titulo_en:v.titulo_en||'',tipo:cNm(TIPOS,v.tipo_id),tipo_en:TIPOS.find(x=>x[0]===+v.tipo_id)?.[2]||'',regime:cNm(REGS,v.regime_id),local:vagaLoc(v),data_limite:v.data_limite,vagas:Math.max(1,+v.vagas_disponiveis||1)},assunto:s,mensagem:tx,modo,estado:'enviado',criado_em:agora});localStorage.setItem(k,JSON.stringify(a))}catch(e){}
  Modal.close(true);upd();repintar();toast(t('tl.i.sentc',{n:p.nome}))})};
Actions['tl-i-mode']=(b,m)=>{const antes=IV.modo;IV.modo=m;ivSync(!(antes==='auto'&&m==='custom'));if(m!=='auto')$('#tlIm').focus()};

/* ---------- filtros ---------- */
Actions['tl-rsk']=(b,id)=>{S.sk=S.sk.filter(k=>k!==+id);S.p=0;upd()};
Actions['tl-tab']=(b,k)=>{S.tab=k;S.p=0;upd()};
Actions['tl-clear']=()=>{Object.assign(S,{q:'',sk:[],pais:'',disp:'',exp:0,o:'rel',p:0});refresh()};
})();
