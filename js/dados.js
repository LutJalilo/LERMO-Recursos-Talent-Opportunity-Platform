/* Dados e utilitários partilhados (oportunidades.html e detalhe.html).
   Em produção: substituir DATA por fetch('/api/oportunidades') (com os campos traduzidos por idioma). Requer i18n.js e paises.js. */
var I18N=window.LermoI18n;
var CATS={vaga:['','fa-briefcase'],formacao:['','fa-certificate'],evento:['','fa-calendar-days'],financiamento:['','fa-seedling']};
var TIPOS={estagio:'',emprego_efectivo:'',trainee:'',freelance:''};
var REG={presencial:'',hibrido:'',remoto:''};
function refreshLabels(){
  Object.keys(CATS).forEach(function(k){CATS[k][0]=I18N.t('op.cat.'+k)});
  Object.keys(TIPOS).forEach(function(k){TIPOS[k]=I18N.t('op.tipo.'+k)});
  Object.keys(REG).forEach(function(k){REG[k]=I18N.t('op.reg.'+k)});
}
refreshLabels();I18N.onChange(refreshLabels);
/* Listas completas (definidas em window.LERMO_PAISES / LERMO_REGIOES): 249 países e as suas regiões */
var PAIS={};LERMO_PAISES.forEach(function(p){PAIS[p[0]]=p[2]});
var REGIOES=window.LERMO_REGIOES||{};
function paisNome(c){return I18N.country(c,PAIS[c])}
var PROV_EN={'Maputo-Cidade':'Maputo City','Maputo-Província':'Maputo Province','Zambézia':'Zambezia','Lisboa':'Lisbon'};
var CID_EN={'Cidade do Cabo':'Cape Town'};
function provL(p){return I18N.lang()==='en'&&PROV_EN[p]?PROV_EN[p]:p}
function cidL(p){return I18N.lang()==='en'&&CID_EN[p]?CID_EN[p]:p}
function loc(o){var a=[];if(o.cid)a.push(cidL(o.cid));if(o.prov&&o.prov!==o.cid)a.push(provL(o.prov));if(o.pais)a.push(paisNome(o.pais));return a.join(', ')}
/* Campos traduzíveis de cada oportunidade: L(o,'t'|'desc'|'req'|'sal') */
function L(o,f){var e=o.en;return(I18N.lang()==='en'&&e&&e[f]!=null)?e[f]:o[f]}
var DATA=[
{id:'v7',pais:'PT',cat:'vaga',tipo:'emprego_efectivo',t:'Analista de Dados Júnior',emp:'Atlântico Analytics',prov:'Lisboa',reg:'hibrido',sal:'1.100 – 1.400 EUR',cri:'2026-09-27',lim:'2026-11-10',desc:'Preparação de relatórios e dashboards para clientes de vários sectores.',req:['Licenciatura em áreas quantitativas','SQL e Excel','Inglês intermédio']},
{id:'v8',pais:'BR',cat:'vaga',tipo:'estagio',t:'Estagiário(a) de Marketing Digital',emp:'Estúdio Recife',prov:'São Paulo',reg:'remoto',sal:'R$ 1.800',cri:'2026-09-26',lim:'2026-10-28',desc:'Apoio à gestão de redes sociais, conteúdo e campanhas pagas.',req:['Estudante de Marketing ou Comunicação','Boa escrita','Conhecimentos de redes sociais']},
{id:'v9',pais:'AO',cat:'vaga',tipo:'trainee',t:'Programa Trainee — Engenharia Civil',emp:'Construções do Kwanza',prov:'Luanda',reg:'presencial',sal:'',cri:'2026-09-24',lim:'2026-11-02',desc:'Acompanhamento de obra e fiscalização com rotação por vários projectos.',req:['Licenciatura em Engenharia Civil','Disponibilidade para obra','Carta de condução']},
{id:'v10',pais:'ZA',cat:'vaga',tipo:'freelance',t:'Tradutor(a) Português–Inglês',emp:'Cape Linguistics',prov:'Western Cape',cid:'Cidade do Cabo',reg:'remoto',sal:'',cri:'2026-09-23',lim:'2026-10-26',desc:'Tradução de documentos técnicos e comerciais, por projecto.',req:['Fluência em português e inglês','Experiência comprovada em tradução','Cumprimento de prazos']},
{id:'f2',pais:'BR',cat:'formacao',t:'Bootcamp de Desenvolvimento Web (online)',emp:'Academia Digital',prov:'Rio de Janeiro',reg:'remoto',sal:'',cri:'2026-09-14',lim:'2026-10-30',desc:'12 semanas de HTML, CSS, JavaScript e projectos práticos, com certificado.',req:['Computador com internet','Maiores de 18 anos']},
{id:'v1',pais:'MZ',cat:'vaga',tipo:'estagio',t:'Estagiário(a) de Contabilidade',emp:'Kilimanjaro Auditores',prov:'Maputo-Cidade',reg:'presencial',sal:'15.000 – 20.000 MZN',cri:'2026-09-20',lim:'2026-10-25',desc:'Apoio à equipa de auditoria e contabilidade, com acompanhamento de um mentor.',req:['Estudante finalista ou recém-licenciado em Contabilidade','Domínio de Excel','Vontade de aprender']},
{id:'v2',pais:'MZ',cat:'vaga',tipo:'emprego_efectivo',t:'Técnico(a) de Recursos Humanos',emp:'Cornelder de Moçambique',prov:'Sofala',reg:'presencial',sal:'',cri:'2026-09-18',lim:'2026-10-15',desc:'Gestão de processos de recrutamento, admissões e formação interna.',req:['Licenciatura em Gestão de RH ou similar','2 anos de experiência','Inglês intermédio']},
{id:'v3',pais:'MZ',cat:'vaga',tipo:'trainee',t:'Programa Trainee — Gestão Comercial',emp:'Vodacom Moçambique',prov:'Maputo-Cidade',reg:'hibrido',sal:'25.000 MZN',cri:'2026-09-25',lim:'2026-11-05',desc:'Programa de 12 meses com rotação por várias áreas comerciais.',req:['Licenciatura concluída há menos de 2 anos','Boa comunicação','Disponibilidade para viajar']},
{id:'v4',pais:'MZ',cat:'vaga',tipo:'freelance',t:'Designer Gráfico (projecto)',emp:'Estúdio Maré',prov:'Nampula',reg:'remoto',sal:'',cri:'2026-09-22',lim:'2026-10-10',desc:'Criação de identidade visual e materiais de campanha para cliente do sector agrícola.',req:['Portefólio actualizado','Figma / Illustrator','Entrega dentro de prazos']},
{id:'v5',pais:'MZ',cat:'vaga',tipo:'estagio',t:'Estagiário(a) de Engenharia Informática',emp:'Tecnologias Índico',prov:'Maputo-Província',reg:'hibrido',sal:'12.000 MZN',cri:'2026-09-15',lim:'2026-10-30',desc:'Desenvolvimento web, suporte técnico e documentação.',req:['Frequência de Eng. Informática','HTML, CSS e JavaScript','Trabalho em equipa']},
{id:'v6',pais:'MZ',cat:'vaga',tipo:'emprego_efectivo',t:'Agrónomo(a) de Campo',emp:'AgroZambézia',prov:'Zambézia',reg:'presencial',sal:'',cri:'2026-09-10',lim:'2026-10-20',desc:'Acompanhamento técnico de produtores e monitorização de culturas.',req:['Licenciatura em Agronomia','Carta de condução','Residência em Quelimane']},
{id:'f1',pais:'MZ',cat:'formacao',t:'Competências Digitais para Jovens',emp:'LERMO Formação',prov:'Gaza',reg:'presencial',sal:'',cri:'2026-09-12',lim:'2026-10-18',desc:'Turma de 6 semanas com certificado em Excel, e-mail profissional e presença online.',req:['Idade entre 18 e 30 anos','Bilhete de identidade']},
{id:'e1',pais:'MZ',cat:'evento',t:'Feira de Emprego e Estágios 2026',emp:'LERMO Recursos',prov:'Maputo-Cidade',reg:'presencial',sal:'',cri:'2026-09-05',lim:'2026-10-22',desc:'Encontro entre instituições de ensino, empresas e jovens candidatos.',req:['Entrada livre com inscrição']},
{id:'n1',pais:'MZ',cat:'financiamento',t:'Linha de Financiamento Jovem Empreendedor',emp:'LERMO Empreende',prov:'Inhambane',reg:'presencial',sal:'',cri:'2026-09-01',lim:'2026-11-15',desc:'Crédito e mentoria para projectos de jovens empreendedores nos distritos.',req:['Plano de negócio','Idade entre 18 e 35 anos','NUIT']}
];
var EN={
v7:{t:'Junior Data Analyst',desc:'Preparing reports and dashboards for clients across several sectors.',req:['Degree in a quantitative field','SQL and Excel','Intermediate English'],sal:'1,100 – 1,400 EUR'},
v8:{t:'Digital Marketing Intern',desc:'Support with social media management, content and paid campaigns.',req:['Marketing or Communication student','Good writing skills','Knowledge of social media'],sal:'R$ 1,800'},
v9:{t:'Trainee Programme — Civil Engineering',desc:'Site supervision and inspection with rotation across several projects.',req:['Degree in Civil Engineering','Availability for site work','Driving licence']},
v10:{t:'Portuguese–English Translator',desc:'Translation of technical and business documents, on a per-project basis.',req:['Fluency in Portuguese and English','Proven translation experience','Meeting deadlines']},
f2:{t:'Web Development Bootcamp (online)',desc:'12 weeks of HTML, CSS, JavaScript and hands-on projects, with a certificate.',req:['Computer with internet access','Aged 18 or over']},
v1:{t:'Accounting Intern',desc:'Supporting the audit and accounting team, with guidance from a mentor.',req:['Final-year student or recent Accounting graduate','Excel proficiency','Willingness to learn'],sal:'15,000 – 20,000 MZN'},
v2:{t:'Human Resources Officer',desc:'Managing recruitment processes, onboarding and internal training.',req:['Degree in HR Management or similar','2 years of experience','Intermediate English']},
v3:{t:'Trainee Programme — Commercial Management',desc:'12-month programme with rotation across several commercial areas.',req:['Degree completed less than 2 years ago','Good communication skills','Willingness to travel'],sal:'25,000 MZN'},
v4:{t:'Graphic Designer (project)',desc:'Creating visual identity and campaign materials for a client in the agricultural sector.',req:['Up-to-date portfolio','Figma / Illustrator','Delivery within deadlines']},
v5:{t:'Computer Engineering Intern',desc:'Web development, technical support and documentation.',req:['Enrolled in Computer Engineering','HTML, CSS and JavaScript','Teamwork'],sal:'12,000 MZN'},
v6:{t:'Field Agronomist',desc:'Technical support for producers and crop monitoring.',req:['Degree in Agronomy','Driving licence','Residence in Quelimane']},
f1:{t:'Digital Skills for Young People',desc:'6-week course with a certificate in Excel, professional email and online presence.',req:['Aged between 18 and 30','ID card']},
e1:{t:'Jobs and Internships Fair 2026',desc:'A meeting between educational institutions, companies and young candidates.',req:['Free entry with registration']},
n1:{t:'Young Entrepreneur Funding Line',desc:'Credit and mentoring for young entrepreneurs’ projects in the districts.',req:['Business plan','Aged between 18 and 35','NUIT (tax ID)']}
};
DATA.forEach(function(o){o.en=EN[o.id]});
var PAGE=9;
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(d){return new Date(d+'T00:00:00').toLocaleDateString(I18N.locale(),{day:'2-digit',month:'short',year:'numeric'})}
function norm(x){return String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function dias(o){var t=new Date();t.setHours(0,0,0,0);return Math.round((new Date(o.lim+'T00:00:00')-t)/864e5)}
function isOpen(o){return dias(o)>=0}
function prazo(o){var d=dias(o);if(d<0)return[I18N.t('op.closed'),'off'];if(d===0)return[I18N.t('op.dl.today'),'warn'];if(d<=7)return[I18N.t(d===1?'op.dl.day':'op.dl.days',{n:d}),'warn'];return[I18N.t('op.dl.until',{d:fmt(o.lim)}),'']}
function cap(x){return REG[x]||x}
function toast(t){var e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast._t);toast._t=setTimeout(function(){e.style.display='none'},3200)}
