/* Termos de Utilização e Política de Privacidade (PT/EN).
   Todo o texto está aqui, num só sítio: cada secção é [título, [parágrafos], [pontos]].
   Marcadores nos parágrafos: [[contact]] = ligação aos contactos; [[terms]] / [[privacy]] = ligação ao outro documento. */
(function(){
'use strict';
var I=window.LermoI18n,$=function(i){return document.getElementById(i)};
var UPDATED='2026-09-29';

/* Textos da própria página */
var UI={
 pt:{'lg.crumb.termos':'Termos de Utilização','lg.crumb.privacidade':'Política de Privacidade','lg.tab.termos':'Termos de Utilização','lg.tab.privacidade':'Política de Privacidade','lg.tabs':'Documentos legais','lg.toc':'Neste documento','lg.updated':'Última actualização: {d}','lg.contactLink':'formulário de contacto','lg.termsLink':'Termos de Utilização','lg.privacyLink':'Política de Privacidade','lg.title.termos':'Termos de Utilização — LERMO Recursos','lg.title.privacidade':'Política de Privacidade — LERMO Recursos','lg.desc.termos':'Regras de utilização da plataforma LERMO Recursos para candidatos e entidades.','lg.desc.privacidade':'Como a LERMO Recursos recolhe, usa, partilha e protege os seus dados pessoais.','lg.nojs':'Active o JavaScript para ler este documento.'},
 en:{'lg.crumb.termos':'Terms of Use','lg.crumb.privacidade':'Privacy Policy','lg.tab.termos':'Terms of Use','lg.tab.privacidade':'Privacy Policy','lg.tabs':'Legal documents','lg.toc':'In this document','lg.updated':'Last updated: {d}','lg.contactLink':'contact form','lg.termsLink':'Terms of Use','lg.privacyLink':'Privacy Policy','lg.title.termos':'Terms of Use — LERMO Recursos','lg.title.privacidade':'Privacy Policy — LERMO Recursos','lg.desc.termos':'Rules for using the LERMO Recursos platform for candidates and organisations.','lg.desc.privacidade':'How LERMO Recursos collects, uses, shares and protects your personal data.','lg.nojs':'Turn on JavaScript to read this document.'}
};
['pt','en'].forEach(function(l){Object.assign(I.dict[l],UI[l])});

var DOCS={
termos:{
pt:{h1:'Termos de Utilização',
intro:'Estes Termos de Utilização regulam o acesso e a utilização da plataforma LERMO Recursos (o «Site»). Ao criar uma conta ou ao utilizar o Site, declara que os leu e que os aceita. Se não concordar, não deve utilizar o Site.',
secs:[
['1. Quem somos e o que oferecemos',['A LERMO Recursos é uma plataforma que liga candidatos (estudantes, recém-graduados e profissionais) a entidades (empresas e instituições) que publicam oportunidades: vagas, estágios, formação, eventos e financiamento, em Moçambique e noutros países.','Somos um intermediário tecnológico. Não somos parte nos contratos celebrados entre candidatos e entidades, não garantimos que uma candidatura seja aceite e não asseguramos qualquer resultado de recrutamento.']],
['2. Conta e registo',['Para se candidatar ou publicar oportunidades tem de criar uma conta, como candidato ou como empresa. Ao registar-se compromete-se a:'],['ter pelo menos 18 anos e capacidade legal para aceitar estes termos;','fornecer informação verdadeira, completa e actualizada, e mantê-la assim;','no caso de empresas, indicar o nome e a identificação fiscal correctos (NUIT em Moçambique; Tax ID/VAT noutros países) e ter poderes para representar a entidade;','manter a senha confidencial e avisar-nos de imediato se suspeitar de uso não autorizado da conta;','manter uma única conta por pessoa ou entidade.']],
['3. Regras para candidatos',['O registo e as candidaturas são gratuitos para os candidatos. Ao candidatar-se, autoriza que os seus dados e o conteúdo da candidatura sejam enviados à entidade que publicou a oportunidade.','As candidaturas devem ser verdadeiras: não pode apresentar documentos, qualificações ou experiência falsos. A decisão de seleccionar ou não um candidato é sempre da entidade.','Não pague a terceiros para obter uma oportunidade e comunique-nos qualquer pedido suspeito através do [[contact]].']],
['4. Regras para empresas e entidades',['As entidades são as únicas responsáveis pelas oportunidades que publicam. Ao publicar, compromete-se a:'],['publicar apenas oportunidades reais, com descrição, requisitos, remuneração (quando indicada) e prazo correctos;','não exigir aos candidatos qualquer pagamento para candidatura, selecção ou contratação;','não discriminar candidatos com base em raça, cor, sexo, religião, origem, deficiência ou qualquer outro motivo proibido pela lei aplicável;','usar os dados dos candidatos apenas para o processo de recrutamento a que se destinam e protegê-los adequadamente;','aceitar que podemos recusar, editar ou remover oportunidades que sejam falsas, enganosas ou contrárias a estes termos.']],
['5. Utilização aceitável',['Não pode utilizar o Site para:'],['fins ilícitos, ou para publicar conteúdo falso, enganoso, ofensivo ou que viole direitos de terceiros;','aceder sem autorização a contas, sistemas ou dados, testar vulnerabilidades ou sobrecarregar o Site;','recolher informação de forma automática (por exemplo, scraping) ou copiar e revender as listagens sem a nossa autorização;','enviar mensagens não solicitadas (spam) ou usar dados de outros utilizadores para fins alheios ao recrutamento;','fazer-se passar por outra pessoa ou entidade.']],
['6. Conteúdo que submete',['Mantém os direitos sobre os conteúdos que submete (por exemplo, dados de perfil e documentos). Concede-nos uma licença limitada e não exclusiva para os armazenar, tratar e apresentar às entidades, apenas na medida necessária para prestar o serviço.','É responsável pela legalidade e veracidade do que submete.']],
['7. Propriedade intelectual',['A marca, o logótipo, o desenho, o código e os textos do Site pertencem à LERMO Recursos ou são usados com licença. Pode usar o Site para fins pessoais e não comerciais. Não pode reproduzir, modificar ou distribuir estes elementos sem autorização prévia por escrito.']],
['8. Disponibilidade do serviço',['Procuramos manter o Site disponível, mas podem ocorrer interrupções por manutenção ou por motivos fora do nosso controlo. Podemos alterar, suspender ou descontinuar funcionalidades quando necessário.']],
['9. Limitação de responsabilidade',['Na medida máxima permitida pela lei:'],['não garantimos a veracidade das oportunidades publicadas pelas entidades, nem o resultado de qualquer candidatura;','não somos responsáveis por danos indirectos, perda de oportunidades ou por actos de terceiros, incluindo entidades e utilizadores;','não somos responsáveis pelo conteúdo de sites externos para os quais o Site tenha ligações.'],'Nada nestes termos exclui responsabilidade que a lei não permita excluir.'],
['10. Suspensão e encerramento',['Podemos suspender ou eliminar contas que violem estes termos ou a lei, sem prejuízo de outras medidas. Pode encerrar a sua conta a qualquer momento, pedindo-o através do [[contact]].']],
['11. Dados pessoais',['O tratamento dos seus dados pessoais é descrito na nossa [[privacy]], que faz parte integrante destes termos.']],
['12. Alterações a estes termos',['Podemos actualizar estes termos. A data da última actualização está indicada no topo. Quando as alterações forem relevantes, avisaremos no Site ou por email. Se continuar a utilizar o Site depois disso, considera-se que aceita a nova versão.']],
['13. Lei aplicável e litígios',['Estes termos regem-se pela lei da República de Moçambique. Em caso de litígio, procuraremos primeiro uma solução amigável. Na falta dela, são competentes os tribunais de Moçambique, sem prejuízo de direitos imperativos que a lei do seu país lhe reconheça como consumidor.']],
['14. Contactos',['Para qualquer questão sobre estes termos, use o [[contact]].']]
]},
en:{h1:'Terms of Use',
intro:'These Terms of Use govern access to and use of the LERMO Recursos platform (the “Site”). By creating an account or using the Site, you confirm that you have read and accept them. If you do not agree, you must not use the Site.',
secs:[
['1. Who we are and what we offer',['LERMO Recursos is a platform that connects candidates (students, recent graduates and professionals) with organisations (companies and institutions) that post opportunities: jobs, internships, training, events and funding, in Mozambique and other countries.','We are a technology intermediary. We are not a party to any contract between candidates and organisations, we do not guarantee that an application will be accepted, and we do not ensure any recruitment outcome.']],
['2. Account and sign-up',['To apply or to post opportunities you must create an account, either as a candidate or as a company. By signing up you agree to:'],['be at least 18 years old and have the legal capacity to accept these terms;','provide true, complete and up-to-date information, and keep it that way;','if you are a company, give the correct name and tax identification (NUIT in Mozambique; Tax ID/VAT in other countries) and have the authority to represent the organisation;','keep your password confidential and tell us immediately if you suspect unauthorised use of your account;','keep a single account per person or organisation.']],
['3. Rules for candidates',['Sign-up and applications are free for candidates. When you apply, you authorise your data and the content of your application to be sent to the organisation that posted the opportunity.','Applications must be truthful: you must not submit false documents, qualifications or experience. The decision whether to select a candidate is always the organisation’s.','Do not pay third parties to obtain an opportunity, and report any suspicious request to us through the [[contact]].']],
['4. Rules for companies and organisations',['Organisations are solely responsible for the opportunities they post. By posting, you agree to:'],['post only real opportunities, with a correct description, requirements, pay (when stated) and deadline;','not require candidates to pay anything for applying, selection or hiring;','not discriminate against candidates on grounds of race, colour, sex, religion, origin, disability or any other ground prohibited by applicable law;','use candidates’ data only for the recruitment process it was provided for, and protect it appropriately;','accept that we may refuse, edit or remove opportunities that are false, misleading or contrary to these terms.']],
['5. Acceptable use',['You must not use the Site to:'],['pursue unlawful purposes, or post content that is false, misleading, offensive or infringes the rights of others;','gain unauthorised access to accounts, systems or data, test for vulnerabilities, or overload the Site;','collect information automatically (for example, scraping) or copy and resell the listings without our permission;','send unsolicited messages (spam) or use other users’ data for purposes unrelated to recruitment;','impersonate another person or organisation.']],
['6. Content you submit',['You keep the rights to the content you submit (for example, profile data and documents). You grant us a limited, non-exclusive licence to store, process and show it to organisations, only as far as needed to provide the service.','You are responsible for the lawfulness and accuracy of what you submit.']],
['7. Intellectual property',['The brand, logo, design, code and texts of the Site belong to LERMO Recursos or are used under licence. You may use the Site for personal, non-commercial purposes. You must not reproduce, modify or distribute these elements without our prior written permission.']],
['8. Availability of the service',['We aim to keep the Site available, but interruptions may occur for maintenance or for reasons beyond our control. We may change, suspend or discontinue features when necessary.']],
['9. Limitation of liability',['To the maximum extent permitted by law:'],['we do not guarantee the accuracy of opportunities posted by organisations, or the outcome of any application;','we are not liable for indirect damages, loss of opportunities, or the acts of third parties, including organisations and users;','we are not responsible for the content of external websites the Site may link to.'],'Nothing in these terms excludes liability that cannot be excluded by law.'],
['10. Suspension and termination',['We may suspend or delete accounts that breach these terms or the law, without prejudice to other measures. You may close your account at any time by requesting it through the [[contact]].']],
['11. Personal data',['The processing of your personal data is described in our [[privacy]], which forms an integral part of these terms.']],
['12. Changes to these terms',['We may update these terms. The date of the last update is shown at the top. When changes are significant, we will let you know on the Site or by email. If you keep using the Site afterwards, you are deemed to accept the new version.']],
['13. Governing law and disputes',['These terms are governed by the law of the Republic of Mozambique. In case of a dispute, we will first seek an amicable solution. Failing that, the courts of Mozambique have jurisdiction, without prejudice to any mandatory consumer rights granted by the law of your country.']],
['14. Contact',['For any question about these terms, use the [[contact]].']]
]}
},
privacidade:{
pt:{h1:'Política de Privacidade',
intro:'Esta Política de Privacidade explica como a LERMO Recursos recolhe, usa, partilha e protege os seus dados pessoais quando utiliza o Site. Aplica-se a candidatos, a empresas e a quem simplesmente visita o Site.',
secs:[
['1. Quem é o responsável',['O responsável pelo tratamento dos seus dados é a LERMO Recursos, com morada no Campus da UniRovuma, Bairro Napipine, Bloco-C, Nampula, Moçambique. Para qualquer questão sobre esta política, use o [[contact]].']],
['2. Dados que recolhemos',['Recolhemos os dados que nos fornece e alguns dados gerados pela utilização do Site:'],['dados de conta: nome completo (ou nome da empresa), email, telefone com indicativo do país, país e senha (guardada de forma cifrada, nunca em texto legível);','dados de empresas: nome e identificação fiscal (NUIT em Moçambique; Tax ID/VAT noutros países);','dados de candidatura e de perfil: as candidaturas que envia e a informação ou documentos que decidir juntar ao seu perfil, como o currículo;','mensagens de contacto: o que nos enviar através do formulário de contacto ou por email;','dados técnicos: tipo de dispositivo e de navegador, endereço IP, páginas visitadas e data e hora dos acessos, registados pelos nossos servidores.']],
['3. Para que usamos os dados',['Usamos os seus dados para:'],['criar e gerir a sua conta e permitir candidaturas e a publicação de oportunidades (execução do serviço);','enviar a sua candidatura à entidade a que se candidata (execução do serviço e o seu pedido);','enviar comunicações de serviço, como a recuperação de senha ou avisos sobre a sua conta;','responder aos seus contactos;','garantir a segurança do Site, prevenir fraude e abusos e melhorar o serviço (interesse legítimo);','cumprir obrigações legais.'],'Não vendemos os seus dados pessoais.'],
['4. Com quem partilhamos',['Só partilhamos dados quando é necessário:'],['entidades a que se candidata: recebem os dados da candidatura e do perfil que decidir partilhar, e tratam-nos como responsáveis pelo seu próprio processo de recrutamento;','prestadores de serviços que nos ajudam a operar o Site (por exemplo, alojamento e envio de email), que só podem usar os dados para nos prestar o serviço;','autoridades públicas, quando a lei o exigir.'],'Para apresentar o Site, o seu navegador carrega tipos de letra, ícones e bandeiras de serviços externos (Google Fonts, cdnjs e flagcdn.com). Nesse momento esses serviços podem registar o seu endereço IP.'],
['5. Transferências internacionais',['A LERMO Recursos aceita candidatos e entidades de vários países. Por isso, os seus dados podem ser tratados ou armazenados fora do país onde vive. Adoptamos medidas razoáveis para que continuem protegidos de forma adequada.']],
['6. Durante quanto tempo guardamos',['Guardamos os dados enquanto a sua conta estiver activa e pelo tempo necessário para as finalidades acima. Quando a conta é eliminada, apagamos ou tornamos anónimos os dados, salvo se a lei exigir a sua conservação ou se forem necessários para defender direitos.']],
['7. Os seus direitos',['Nos termos da lei aplicável, pode pedir-nos para:'],['aceder aos seus dados e receber uma cópia;','corrigir dados incorrectos ou incompletos;','eliminar os seus dados;','limitar o tratamento ou opor-se a ele;','receber os seus dados num formato de uso corrente, quando aplicável;','retirar o consentimento que tenha dado, sem afectar o que foi feito antes.'],'Para exercer estes direitos, use o [[contact]]. Pode também apresentar reclamação junto da autoridade de protecção de dados competente.'],
['8. Segurança',['Usamos medidas técnicas e organizativas para proteger os seus dados, como ligações cifradas (HTTPS), senhas guardadas de forma cifrada e acesso restrito à informação. Nenhum sistema é totalmente seguro, por isso proteja a sua senha e não a partilhe.']],
['9. Cookies e armazenamento local',['Usamos apenas o que é essencial ao funcionamento do Site:'],['um cookie de sessão, para manter a sua sessão iniciada e proteger os formulários;','o armazenamento local do navegador, onde guardamos a sua preferência de idioma (PT ou EN).'],'Neste momento não usamos cookies de publicidade nem de rastreamento.'],
['10. Menores',['O Site não se destina a menores de 18 anos. Se soubermos que recolhemos dados de um menor sem a autorização devida, eliminamo-los.']],
['11. Ligações externas',['O Site pode ter ligações para sites de entidades ou de terceiros, que têm as suas próprias políticas de privacidade. Não somos responsáveis por elas.']],
['12. Alterações a esta política',['Podemos actualizar esta política. A data da última actualização está indicada no topo. Quando as alterações forem relevantes, avisaremos no Site ou por email.']],
['13. Contactos',['Para qualquer questão sobre privacidade, use o [[contact]]. Consulte também os nossos [[terms]].']]
]},
en:{h1:'Privacy Policy',
intro:'This Privacy Policy explains how LERMO Recursos collects, uses, shares and protects your personal data when you use the Site. It applies to candidates, to companies and to anyone who simply visits the Site.',
secs:[
['1. Who is responsible',['The controller of your data is LERMO Recursos, located at UniRovuma Campus, Napipine Neighbourhood, Block C, Nampula, Mozambique. For any question about this policy, use the [[contact]].']],
['2. Data we collect',['We collect the data you give us and some data generated by your use of the Site:'],['account data: full name (or company name), email, phone number with country code, country and password (stored in encrypted form, never as readable text);','company data: name and tax identification (NUIT in Mozambique; Tax ID/VAT in other countries);','application and profile data: the applications you send and the information or documents you choose to add to your profile, such as your CV;','contact messages: whatever you send us through the contact form or by email;','technical data: device and browser type, IP address, pages visited and the date and time of access, recorded by our servers.']],
['3. What we use your data for',['We use your data to:'],['create and manage your account and enable applications and the posting of opportunities (performance of the service);','send your application to the organisation you apply to (performance of the service and your request);','send service communications, such as password recovery or notices about your account;','reply to your enquiries;','keep the Site secure, prevent fraud and abuse and improve the service (legitimate interest);','comply with legal obligations.'],'We do not sell your personal data.'],
['4. Who we share it with',['We only share data when necessary:'],['organisations you apply to: they receive the application and profile data you choose to share, and handle it as controllers of their own recruitment process;','service providers that help us run the Site (for example, hosting and email delivery), which may only use the data to provide the service to us;','public authorities, when required by law.'],'To display the Site, your browser loads fonts, icons and flags from external services (Google Fonts, cdnjs and flagcdn.com). At that moment those services may record your IP address.'],
['5. International transfers',['LERMO Recursos accepts candidates and organisations from many countries. Your data may therefore be processed or stored outside the country where you live. We take reasonable steps to keep it adequately protected.']],
['6. How long we keep it',['We keep data while your account is active and for as long as needed for the purposes above. When the account is deleted, we erase or anonymise the data, unless the law requires us to keep it or it is needed to defend legal claims.']],
['7. Your rights',['Under the applicable law, you may ask us to:'],['access your data and receive a copy;','correct data that is wrong or incomplete;','delete your data;','restrict processing or object to it;','receive your data in a commonly used format, where applicable;','withdraw any consent you have given, without affecting what was done before.'],'To exercise these rights, use the [[contact]]. You may also lodge a complaint with the competent data protection authority.'],
['8. Security',['We use technical and organisational measures to protect your data, such as encrypted connections (HTTPS), passwords stored in encrypted form and restricted access to information. No system is completely secure, so protect your password and do not share it.']],
['9. Cookies and local storage',['We only use what is essential for the Site to work:'],['a session cookie, to keep you signed in and protect forms;','the browser’s local storage, where we keep your language preference (PT or EN).'],'We do not currently use advertising or tracking cookies.'],
['10. Minors',['The Site is not intended for people under 18. If we learn that we have collected data from a minor without proper authorisation, we will delete it.']],
['11. External links',['The Site may link to websites of organisations or third parties, which have their own privacy policies. We are not responsible for them.']],
['12. Changes to this policy',['We may update this policy. The date of the last update is shown at the top. When changes are significant, we will let you know on the Site or by email.']],
['13. Contact',['For any privacy question, use the [[contact]]. See also our [[terms]].']]
]}
}};

/* ---- Cabeçalho, menu, voltar ao topo ---- */
var bt=$('backToTop'),hd=document.querySelector('header');
function sc(){bt.classList.toggle('visible',window.scrollY>400);hd.classList.toggle('scrolled',window.scrollY>20)}
window.addEventListener('scroll',sc,{passive:true});sc();
bt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
function mm(open){$('mm').classList.toggle('open',open);$('hamb').setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''}
$('hamb').addEventListener('click',function(){mm(true)});
$('mmClose').addEventListener('click',function(){mm(false)});
$('mm').addEventListener('click',function(e){if(e.target.closest('a'))mm(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')mm(false)});
if(typeof LOGGED_IN!=='undefined'&&LOGGED_IN){var conta='<a class="btn btn-g" href="painel.html" th:href="@{/painel}"><i class="fas fa-user"></i> <span data-i18n="op.account">'+I.t('op.account')+'</span></a>';$('authBtns').innerHTML=conta;$('mmAuth').innerHTML=conta}

/* ---- Documento ---- */
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function links(s,cur){
  return esc(s)
   .replace(/\[\[contact\]\]/g,'<a href="index.html#contactos" th:href="@{/#contactos}">'+esc(I.t('lg.contactLink'))+'</a>')
   .replace(/\[\[terms\]\]/g,'<a href="#termos">'+esc(I.t('lg.termsLink'))+'</a>')
   .replace(/\[\[privacy\]\]/g,'<a href="#privacidade">'+esc(I.t('lg.privacyLink'))+'</a>');
}
function current(){return location.hash==='#privacidade'?'privacidade':'termos'}
function render(){
  var k=current(),d=DOCS[k][I.lang()],up=new Date(UPDATED+'T00:00:00').toLocaleDateString(I.locale(),{day:'numeric',month:'long',year:'numeric'});
  document.title=I.t('lg.title.'+k);
  var md=document.querySelector('meta[name=description]');if(md)md.content=I.t('lg.desc.'+k);
  $('lgHero').innerHTML='<nav class="crumb" aria-label="'+esc(I.t('op.crumbAria'))+'"><a href="index.html" th:href="@{/}">'+esc(I.t('nav.home'))+'</a><span aria-hidden="true">›</span><span>'+esc(I.t('lg.crumb.'+k))+'</span></nav><h1>'+esc(d.h1)+'</h1><p class="upd"><i class="far fa-calendar" aria-hidden="true"></i> '+esc(I.t('lg.updated',{d:up}))+'</p>';
  $('lgTabs').innerHTML=['termos','privacidade'].map(function(x){return '<a href="#'+x+'" role="tab" aria-selected="'+(x===k)+'" class="'+(x===k?'on':'')+'">'+esc(I.t('lg.tab.'+x))+'</a>'}).join('');
  $('lgTabs').setAttribute('aria-label',I.t('lg.tabs'));
  $('lgToc').setAttribute('aria-label',I.t('lg.toc'));
  $('lgTocTitle').textContent=I.t('lg.toc');
  $('lgTocList').innerHTML=d.secs.map(function(s,i){return '<li><a href="#" data-go="s'+i+'">'+esc(s[0])+'</a></li>'}).join('');
  $('lgDoc').innerHTML='<p class="intro">'+esc(d.intro)+'</p>'+d.secs.map(function(s,i){
    return '<section id="s'+i+'"><h2>'+esc(s[0])+'</h2>'+
      (s[1]||[]).map(function(p){return '<p>'+links(p)+'</p>'}).join('')+
      (s[2]&&s[2].length?'<ul>'+s[2].map(function(li){return '<li>'+links(li)+'</li>'}).join('')+'</ul>':'')+
      (s[3]?'<p>'+links(s[3])+'</p>':'')+'</section>'}).join('');
}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(!g)return;
  e.preventDefault();var t=$(g.dataset.go);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
});
window.addEventListener('hashchange',function(){render();window.scrollTo({top:0})});
I.onChange(render);
render();
})();
