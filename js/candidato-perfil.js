'use strict';
/* Área Perfil. Tabelas: perfis_candidatos, experiencia_profissional, formacao_academica, candidato_competencias, candidato_idiomas
   + catálogos competencias, idiomas, paises, provincias.
   Depende de dashboard-candidato.js: MOCK/api, wait, t, esc, crumbs, fmtD, provL, paisN, Views, Actions, Modal, toast, invalidate, completude, Session, D, lang, $, parse. */
(()=>{
/* ---------- catálogos (em produção: GET /api/idiomas, GET /api/competencias) ---------- */
const IDIOMAS=[[1,'Português','Portuguese'],[2,'Inglês','English'],[3,'Espanhol','Spanish'],[4,'Francês','French'],[5,'Alemão','German'],[6,'Italiano','Italian'],[7,'Suaíli','Swahili'],[8,'Changana','Changana'],[9,'Ronga','Ronga']];
const COMP=[   /* competencias: id, nome PT, nome EN, categoria (t = Técnica, s = Soft Skill) */
 [1,'Microsoft Excel','Microsoft Excel','t'],[2,'Microsoft Word','Microsoft Word','t'],[3,'HTML e CSS','HTML and CSS','t'],[4,'JavaScript','JavaScript','t'],[5,'Python','Python','t'],[6,'SQL','SQL','t'],
 [7,'Contabilidade','Accounting','t'],[8,'Gestão de projectos','Project management','t'],[9,'Design gráfico','Graphic design','t'],[10,'Marketing digital','Digital marketing','t'],[11,'Redes sociais','Social media','t'],
 [12,'Atendimento ao cliente','Customer service','t'],[13,'Tradução','Translation','t'],[14,'Agronomia','Agronomy','t'],
 [15,'Comunicação','Communication','s'],[16,'Trabalho em equipa','Teamwork','s'],[17,'Liderança','Leadership','s'],[18,'Resolução de problemas','Problem solving','s'],[19,'Gestão do tempo','Time management','s'],[20,'Criatividade','Creativity','s'],[21,'Adaptabilidade','Adaptability','s'],[22,'Pensamento crítico','Critical thinking','s'],
 /* 23-36 Office e ofimática (o) · 37-60 Programação e tecnologia (d) · 61-94 técnicas e profissionais (t) · 95-104 pessoais (s) */
 [23,'Microsoft Office (pacote completo)','Microsoft Office suite','o'],
 [24,'Microsoft PowerPoint','Microsoft PowerPoint','o'],
 [25,'Microsoft Outlook','Microsoft Outlook','o'],
 [26,'Microsoft Access','Microsoft Access','o'],
 [27,'Microsoft Teams','Microsoft Teams','o'],
 [28,'Microsoft OneNote','Microsoft OneNote','o'],
 [29,'Microsoft Project','Microsoft Project','o'],
 [30,'Microsoft Visio','Microsoft Visio','o'],
 [31,'Power BI','Power BI','o'],
 [32,'Google Workspace (Docs, Sheets, Slides)','Google Workspace (Docs, Sheets, Slides)','o'],
 [33,'LibreOffice / OpenOffice','LibreOffice / OpenOffice','o'],
 [34,'Dactilografia','Typing','o'],
 [35,'Gestão documental e arquivo','Document management and filing','o'],
 [36,'Secretariado e apoio administrativo','Secretarial and administrative support','o'],
 [37,'Java','Java','d'],
 [38,'C#','C#','d'],
 [39,'PHP','PHP','d'],
 [40,'C++','C++','d'],
 [41,'React','React','d'],
 [42,'Node.js','Node.js','d'],
 [43,'Spring Boot','Spring Boot','d'],
 [44,'Desenvolvimento móvel (Android)','Mobile development (Android)','d'],
 [45,'Git e GitHub','Git and GitHub','d'],
 [46,'Linux','Linux','d'],
 [47,'Windows Server e Active Directory','Windows Server and Active Directory','d'],
 [48,'Redes de computadores','Computer networking','d'],
 [49,'Cibersegurança','Cybersecurity','d'],
 [50,'Administração de bases de dados','Database administration','d'],
 [51,'Computação em nuvem (AWS, Azure)','Cloud computing (AWS, Azure)','d'],
 [52,'DevOps e Docker','DevOps and Docker','d'],
 [53,'Suporte técnico e helpdesk','Technical support and helpdesk','d'],
 [54,'Manutenção de computadores','Computer maintenance','d'],
 [55,'Análise de dados','Data analysis','d'],
 [56,'Inteligência artificial e machine learning','Artificial intelligence and machine learning','d'],
 [57,'Desenvolvimento web (WordPress)','Web development (WordPress)','d'],
 [58,'Design UX/UI','UX/UI design','d'],
 [59,'Testes de software','Software testing','d'],
 [60,'Virtualização (VMware, Hyper-V)','Virtualisation (VMware, Hyper-V)','d'],
 [61,'Gestão de recursos humanos','Human resources management','t'],
 [62,'Recrutamento e selecção','Recruitment and selection','t'],
 [63,'Finanças','Finance','t'],
 [64,'Auditoria','Auditing','t'],
 [65,'Fiscalidade e impostos','Taxation','t'],
 [66,'Banca e serviços financeiros','Banking and financial services','t'],
 [67,'Análise financeira','Financial analysis','t'],
 [68,'Orçamentação e planeamento','Budgeting and planning','t'],
 [69,'Logística e cadeia de abastecimento','Logistics and supply chain','t'],
 [70,'Gestão de stocks e armazém','Inventory and warehouse management','t'],
 [71,'Compras e aprovisionamento','Procurement','t'],
 [72,'Vendas','Sales','t'],
 [73,'Negociação','Negotiation','t'],
 [74,'Gestão comercial','Commercial management','t'],
 [75,'Elaboração de relatórios','Report writing','t'],
 [76,'Gestão da qualidade','Quality management','t'],
 [77,'Segurança e saúde no trabalho','Occupational health and safety','t'],
 [78,'Monitoria e avaliação','Monitoring and evaluation','t'],
 [79,'Elaboração de projectos e propostas','Project and proposal writing','t'],
 [80,'Estatística e investigação (SPSS)','Statistics and research (SPSS)','t'],
 [81,'Ensino e formação','Teaching and training','t'],
 [82,'Assessoria jurídica','Legal advisory','t'],
 [83,'Contratação pública','Public procurement','t'],
 [84,'Engenharia civil e construção','Civil engineering and construction','t'],
 [85,'Electricidade','Electrical work','t'],
 [86,'Mecânica','Mechanics','t'],
 [87,'Condução (carta de condução)','Driving (driving licence)','t'],
 [88,'Enfermagem e primeiros socorros','Nursing and first aid','t'],
 [89,'Fotografia e edição de vídeo','Photography and video editing','t'],
 [90,'Redacção e revisão de textos','Writing and proofreading','t'],
 [91,'Relações públicas','Public relations','t'],
 [92,'Gestão de eventos','Event management','t'],
 [93,'Empreendedorismo e criação de negócios','Entrepreneurship and business creation','t'],
 [94,'Turismo e hotelaria','Tourism and hospitality','t'],
 [95,'Organização','Organisation','s'],
 [96,'Proactividade','Proactivity','s'],
 [97,'Ética profissional','Professional ethics','s'],
 [98,'Capacidade de aprendizagem','Learning ability','s'],
 [99,'Trabalho sob pressão','Working under pressure','s'],
 [100,'Empatia','Empathy','s'],
 [101,'Tomada de decisão','Decision making','s'],
 [102,'Autonomia','Autonomy','s'],
 [103,'Atenção ao detalhe','Attention to detail','s'],
 [104,'Orientação para resultados','Results orientation','s']];
const NIV={'Básico':'basico','Intermediário':'intermediario','Avançado':'avancado','Fluente':'fluente','Nativo':'nativo'};
const NIV_COMP=['Básico','Intermediário','Avançado'],NIV_IDI=['Básico','Intermediário','Avançado','Fluente','Nativo'];   /* candidato_competencias.nivel / candidato_idiomas.nivel */
const GRAUS=['Técnico','Licenciatura','Mestrado','Doutoramento','Outro'],GENEROS=['Masculino','Feminino','Outro'];
const KIND={exp:'experiencias',form:'formacoes',comp:'competencias',idi:'idiomas',doc:'documentos',cvf:'documentos'};
/* candidato_documentos.tipo (ver lermo_database_v5_6.sql); 'CV' = currículo anexado (só um por candidato) */
const TDOC=['Certificado','Bilhete de Identidade','Carta de motivação','Referência','Outro'];
const EXT_CV=['pdf','doc','docx'],EXT_DOC=['pdf','doc','docx','jpg','jpeg','png'],MAXB=5*1024*1024,MAXDOC=10;

Object.assign(D.pt,{
 'pf.sub':'É o que as empresas vêem quando se candidata. Mantenha-o actualizado.','pf.acc':'O nome, o email e o telefone alteram-se em','pf.na':'Não indicado','pf.now':'Actual','pf.ongoing':'Em curso','pf.done':'Concluído',
 'pf.foto.add':'Adicionar foto','pf.foto.chg':'Alterar foto','pf.foto.rm':'Remover foto','pf.foto.err':'Escolha uma imagem JPG, PNG ou WebP até 5 MB.','pf.foto.ok':'Foto actualizada.','pf.foto.rmd':'Foto removida.',
 'pf.todo':'Complete o seu perfil','pf.todo.p':'Um perfil completo dá mais confiança às empresas. Falta adicionar:',
 'pf.edit':'Editar','pf.add':'Adicionar','pf.rm':'Remover','pf.save':'Guardar','pf.saving':'A guardar…','pf.saved':'Guardado.','pf.removed':'Removido.','pf.fail':'Não foi possível guardar. Tente novamente.','pf.dup':'Este item já está no seu perfil.','pf.cancel':'Cancelar','pf.sel':'Seleccionar…',
 'pf.s.about':'Sobre mim','pf.s.exp':'Experiência profissional','pf.s.form':'Formação académica','pf.s.pess':'Dados pessoais','pf.s.pref':'Preferências','pf.s.comp':'Competências','pf.s.idi':'Idiomas','pf.s.cv':'Currículo','pf.e.cv':'Ainda não adicionou o texto do seu currículo. Cole-o aqui para que as empresas o encontrem em pesquisas por palavras-chave.','pf.cv.edit':'Editar currículo','pf.cv.file':'Ficheiro do currículo','pf.cv.up':'Anexar CV','pf.cv.rep':'Substituir CV','pf.cv.none':'Ainda não anexou o seu currículo. Aceitamos PDF, DOC e DOCX até 5 MB.','pf.cv.at':'Anexado em {d}','pf.cv.ok':'Currículo anexado.','pf.cv.err':'Escolha um ficheiro PDF, DOC ou DOCX até 5 MB.',
 'pf.cv.txt':'Texto para pesquisa','pf.cv.auto':'Ao anexar o CV (PDF ou DOCX), o perfil é preenchido automaticamente. Os campos já preenchidos não são substituídos.','pf.cv.read':'A ler o currículo…',
 'pf.cv.tel':'Telefone da conta actualizado para {t}.',
 'pf.cv.done':'Perfil preenchido a partir do CV. Novos itens — experiências: {x}; formações: {f}; competências: {c}; idiomas: {i}; campos: {p}. Reveja os dados.',
 'pf.cv.nada':'O CV foi lido, mas não foram identificados dados estruturados. O texto foi guardado para pesquisa; preencha o perfil manualmente.',
 'pf.cv.doc':'O formato DOC não permite leitura automática. Converta o CV para DOCX ou PDF para preencher o perfil automaticamente.',
 'pf.cv.scan':'Não foi encontrado texto no ficheiro (possível PDF digitalizado). O perfil não foi preenchido automaticamente.',
 'pf.cv.fail':'O CV foi anexado, mas não foi possível lê-lo. Preencha o perfil manualmente.',
 'pf.s.doc':'Outros documentos','pf.e.doc':'Ainda não anexou documentos. Pode juntar certificados, cópia do BI, cartas de motivação ou referências.','pf.d.add':'Adicionar documento','pf.d.tipo':'Tipo de documento','pf.d.file':'Ficheiro','pf.d.h':'PDF, DOC, DOCX, JPG ou PNG, até 5 MB.','pf.d.dl':'Descarregar',
 'pf.v.file':'Escolha um ficheiro.','pf.v.fmt':'Formato não suportado.','pf.v.size':'O ficheiro excede 5 MB.','pf.v.maxdoc':'Atingiu o limite de 10 documentos.',
 'pf.dt.Certificado':'Certificado','pf.dt.Bilhete de Identidade':'Bilhete de Identidade','pf.dt.Carta de motivação':'Carta de motivação','pf.dt.Referência':'Referência','pf.dt.Outro':'Outro',
 'f.cvf':'currículo','pf.all':'Ver todos ({n})','pf.ld.doc':'A ler o documento e a actualizar o perfil…','pf.ld.up':'A anexar o ficheiro…','pf.ld.foto':'A guardar a fotografia…','pf.cv.upd':'Perfil actualizado a partir do novo CV. Itens novos ou actualizados — experiências: {x}; formações: {f}; competências: {c}; idiomas: {i}; campos: {p}. Reveja os dados.','f.doc':'documentos','f.pref':'preferências','pf.more':'Ver mais','pf.less':'Ver menos','pf.d.img':'Documento anexado. Imagens não são lidas automaticamente — use PDF ou DOCX para preencher o perfil.','pf.doc.done':'Perfil actualizado a partir do documento. Novos itens — experiências: {x}; formações: {f}; competências: {c}; idiomas: {i}; campos: {p}. Reveja os dados.','pf.doc.nada':'Documento anexado. Não foram encontrados dados novos para o perfil.','pf.e.pess':'Ainda não preencheu os seus dados pessoais.','pf.e.about':'Escreva um resumo curto sobre si, os seus objectivos e o que procura.','pf.e.exp':'Ainda não adicionou experiência. Estágios, trabalhos e voluntariado também contam.','pf.e.form':'Ainda não adicionou formação.','pf.e.comp':'Ainda não adicionou competências.','pf.e.idi':'Ainda não adicionou idiomas.',
 'pf.l.nome':'Nome completo','pf.v.nome':'Escreva o nome completo (nome e apelido).','pf.nome.h':'Aparece no perfil, nas candidaturas e no CV.',
 'pf.l.nasc':'Data de nascimento','pf.l.gen':'Género','pf.l.pais':'País de residência','pf.l.reg':'Região','pf.l.bairro':'Bairro','pf.l.bi':'Bilhete de Identidade','pf.l.bin':'Número do BI','pf.l.bie':'Data de emissão','pf.l.bil':'Local de emissão','pf.bi.h':'Opcional.','pf.reg.txt':'Escreva a região ou cidade.','pf.bi.em':'emitido em {d}',
 'pf.g.Masculino':'Masculino','pf.g.Feminino':'Feminino','pf.g.Outro':'Outro',
 'pf.p.mud':'Disponível para mudar de cidade ou país','pf.p.rem':'Disponível para trabalho remoto internacional','pf.p.h':'Ajuda as empresas a perceber se pode aceitar vagas noutros locais.',
 'pf.a.edit':'Editar «Sobre mim»','pf.a.res':'Resumo pessoal','pf.a.res.h':'Apresente-se em poucas linhas.','pf.a.cv':'Currículo em texto (opcional)','pf.a.cv.h':'Cole aqui o texto do seu CV. É usado em pesquisas por palavras-chave.','pf.p.edit':'Dados pessoais',
 'pf.x.add':'Adicionar experiência','pf.x.edit':'Editar experiência','pf.x.emp':'Empresa ou organização','pf.x.cargo':'Cargo','pf.x.desc':'Descrição das actividades','pf.x.ini':'Data de início','pf.x.fim':'Data de fim','pf.x.act':'Trabalho aqui actualmente',
 'pf.f.add':'Adicionar formação','pf.f.edit':'Editar formação','pf.f.inst':'Instituição de ensino','pf.f.curso':'Curso','pf.f.grau':'Grau académico','pf.f.ini':'Data de início','pf.f.fim':'Data de conclusão','pf.f.con':'Curso concluído',
 'pf.gr.Técnico':'Técnico','pf.gr.Licenciatura':'Licenciatura','pf.gr.Mestrado':'Mestrado','pf.gr.Doutoramento':'Doutoramento','pf.gr.Outro':'Outro',
 'pf.c.add':'Adicionar competência','pf.c.edit':'Editar competência','pf.c.nome':'Competência','pf.c.niv':'Nível','pf.c.anos':'Anos de experiência (opcional)','pf.c.y1':'1 ano','pf.c.y':'{n} anos','pf.cat.o':'Office e ofimática','pf.cat.d':'Programação e tecnologia','pf.cat.t':'Técnicas e profissionais','pf.cat.s':'Pessoais','pf.cat.x':'Outra','pf.c.outro':'Outro (especificar)…','pf.c.outro.l':'Especifique a competência','pf.c.outro.h':'Escreva o nome, por exemplo: Tableau, Soldadura, Língua gestual.','pf.c.outro.ph':'Nome da competência',
 'pf.i.add':'Adicionar idioma','pf.i.edit':'Editar idioma','pf.i.nome':'Idioma','pf.i.niv':'Nível','pf.i.main':'Principal','pf.i.setmain':'Definir como principal','pf.i.mainck':'Definir como idioma principal',
 'pf.n.basico':'Básico','pf.n.intermediario':'Intermediário','pf.n.avancado':'Avançado','pf.n.fluente':'Fluente','pf.n.nativo':'Nativo',
 'pf.v.req':'Campo obrigatório.','pf.v.date':'Indique uma data válida.','pf.v.future':'A data não pode ser futura.','pf.v.order':'A data de fim não pode ser anterior à de início.','pf.v.pick':'Escolha uma opção.','pf.v.num':'Indique um valor entre 0 e 60.','pf.v.bi':'Use de 5 a 20 letras ou números, sem espaços.','pf.v.nasc':'Indique uma data de nascimento válida.',
 'pf.del.t':'Remover do perfil','pf.del.p':'Quer remover «{x}» do seu perfil? Esta acção não pode ser anulada.'});
Object.assign(D.en,{
 'pf.sub':'This is what companies see when you apply. Keep it up to date.','pf.acc':'Your name, email and phone are changed in','pf.na':'Not provided','pf.now':'Current','pf.ongoing':'Ongoing','pf.done':'Completed',
 'pf.foto.add':'Add photo','pf.foto.chg':'Change photo','pf.foto.rm':'Remove photo','pf.foto.err':'Choose a JPG, PNG or WebP image up to 5 MB.','pf.foto.ok':'Photo updated.','pf.foto.rmd':'Photo removed.',
 'pf.todo':'Complete your profile','pf.todo.p':'A complete profile gives companies more confidence. Still to add:',
 'pf.edit':'Edit','pf.add':'Add','pf.rm':'Remove','pf.save':'Save','pf.saving':'Saving…','pf.saved':'Saved.','pf.removed':'Removed.','pf.fail':'Could not save. Please try again.','pf.dup':'This item is already in your profile.','pf.cancel':'Cancel','pf.sel':'Select…',
 'pf.s.about':'About me','pf.s.exp':'Work experience','pf.s.form':'Education','pf.s.pess':'Personal details','pf.s.pref':'Preferences','pf.s.comp':'Skills','pf.s.idi':'Languages','pf.s.cv':'CV','f.cvf':'CV','pf.all':'See all ({n})','pf.ld.doc':'Reading the document and updating your profile…','pf.ld.up':'Attaching the file…','pf.ld.foto':'Saving your photo…','pf.cv.upd':'Profile updated from the new CV. New or updated items — experience: {x}; education: {f}; skills: {c}; languages: {i}; fields: {p}. Please review the data.','f.doc':'documents','f.pref':'preferences','pf.more':'See more','pf.less':'See less','pf.d.img':'Document attached. Images are not read automatically — use PDF or DOCX to fill in your profile.','pf.doc.done':'Profile updated from the document. New items — experience: {x}; education: {f}; skills: {c}; languages: {i}; fields: {p}. Please review the data.','pf.doc.nada':'Document attached. No new data was found for your profile.','pf.e.pess':'You have not filled in your personal details yet.','pf.e.cv':'You have not added your CV text yet. Paste it here so companies can find you in keyword searches.','pf.cv.edit':'Edit CV','pf.cv.file':'CV file','pf.cv.up':'Attach CV','pf.cv.rep':'Replace CV','pf.cv.none':'You have not attached your CV yet. PDF, DOC and DOCX up to 5 MB are accepted.','pf.cv.at':'Attached on {d}','pf.cv.ok':'CV attached.','pf.cv.err':'Choose a PDF, DOC or DOCX file up to 5 MB.',
 'pf.cv.txt':'Searchable text','pf.cv.auto':'When you attach your CV (PDF or DOCX), your profile is filled in automatically. Fields that are already filled are not replaced.','pf.cv.read':'Reading your CV…',
 'pf.cv.tel':'Account phone updated to {t}.',
 'pf.cv.done':'Profile filled in from your CV. New items — experience: {x}; education: {f}; skills: {c}; languages: {i}; fields: {p}. Please review the data.',
 'pf.cv.nada':'Your CV was read, but no structured data could be identified. The text was saved for search; please fill in your profile manually.',
 'pf.cv.doc':'The DOC format cannot be read automatically. Convert your CV to DOCX or PDF to fill in your profile automatically.',
 'pf.cv.scan':'No text was found in the file (possibly a scanned PDF). Your profile was not filled in automatically.',
 'pf.cv.fail':'Your CV was attached, but it could not be read. Please fill in your profile manually.',
 'pf.s.doc':'Other documents','pf.e.doc':'You have not attached any documents yet. You can add certificates, an ID copy, cover letters or references.','pf.d.add':'Add document','pf.d.tipo':'Document type','pf.d.file':'File','pf.d.h':'PDF, DOC, DOCX, JPG or PNG, up to 5 MB.','pf.d.dl':'Download',
 'pf.v.file':'Choose a file.','pf.v.fmt':'Unsupported format.','pf.v.size':'The file exceeds 5 MB.','pf.v.maxdoc':'You have reached the limit of 10 documents.',
 'pf.dt.Certificado':'Certificate','pf.dt.Bilhete de Identidade':'ID card','pf.dt.Carta de motivação':'Cover letter','pf.dt.Referência':'Reference','pf.dt.Outro':'Other',
 'pf.e.about':'Write a short summary about yourself, your goals and what you are looking for.','pf.e.exp':'You have not added any experience yet. Internships, jobs and volunteering all count.','pf.e.form':'You have not added any education yet.','pf.e.comp':'You have not added any skills yet.','pf.e.idi':'You have not added any languages yet.',
 'pf.l.nome':'Full name','pf.v.nome':'Enter your full name (first name and surname).','pf.nome.h':'Shown on your profile, applications and CV.',
 'pf.l.nasc':'Date of birth','pf.l.gen':'Gender','pf.l.pais':'Country of residence','pf.l.reg':'Region','pf.l.bairro':'Neighbourhood','pf.l.bi':'ID card (BI)','pf.l.bin':'ID number','pf.l.bie':'Issue date','pf.l.bil':'Place of issue','pf.bi.h':'Optional.','pf.reg.txt':'Type the region or city.','pf.bi.em':'issued on {d}',
 'pf.g.Masculino':'Male','pf.g.Feminino':'Female','pf.g.Outro':'Other',
 'pf.p.mud':'Available to relocate to another city or country','pf.p.rem':'Available for international remote work','pf.p.h':'Helps companies see whether you can take jobs in other places.',
 'pf.a.edit':'Edit “About me”','pf.a.res':'Personal summary','pf.a.res.h':'Introduce yourself in a few lines.','pf.a.cv':'CV as text (optional)','pf.a.cv.h':'Paste the text of your CV here. It is used in keyword searches.','pf.p.edit':'Personal details',
 'pf.x.add':'Add experience','pf.x.edit':'Edit experience','pf.x.emp':'Company or organisation','pf.x.cargo':'Job title','pf.x.desc':'Description of duties','pf.x.ini':'Start date','pf.x.fim':'End date','pf.x.act':'I currently work here',
 'pf.f.add':'Add education','pf.f.edit':'Edit education','pf.f.inst':'Institution','pf.f.curso':'Course','pf.f.grau':'Degree level','pf.f.ini':'Start date','pf.f.fim':'Completion date','pf.f.con':'Course completed',
 'pf.gr.Técnico':'Technical','pf.gr.Licenciatura':'Bachelor’s','pf.gr.Mestrado':'Master’s','pf.gr.Doutoramento':'Doctorate','pf.gr.Outro':'Other',
 'pf.c.add':'Add skill','pf.c.edit':'Edit skill','pf.c.nome':'Skill','pf.c.niv':'Level','pf.c.anos':'Years of experience (optional)','pf.c.y1':'1 year','pf.c.y':'{n} years','pf.cat.o':'Office and productivity','pf.cat.d':'Programming and technology','pf.cat.t':'Technical and professional','pf.cat.s':'Personal','pf.cat.x':'Other','pf.c.outro':'Other (specify)…','pf.c.outro.l':'Specify the skill','pf.c.outro.h':'Write the name, for example: Tableau, Welding, Sign language.','pf.c.outro.ph':'Skill name',
 'pf.i.add':'Add language','pf.i.edit':'Edit language','pf.i.nome':'Language','pf.i.niv':'Level','pf.i.main':'Main','pf.i.setmain':'Set as main','pf.i.mainck':'Set as my main language',
 'pf.n.basico':'Basic','pf.n.intermediario':'Intermediate','pf.n.avancado':'Advanced','pf.n.fluente':'Fluent','pf.n.nativo':'Native',
 'pf.v.req':'Required field.','pf.v.date':'Enter a valid date.','pf.v.future':'The date cannot be in the future.','pf.v.order':'The end date cannot be before the start date.','pf.v.pick':'Choose an option.','pf.v.num':'Enter a value between 0 and 60.','pf.v.bi':'Use 5 to 20 letters or numbers, no spaces.','pf.v.nasc':'Enter a valid date of birth.',
 'pf.del.t':'Remove from profile','pf.del.p':'Do you want to remove “{x}” from your profile? This cannot be undone.'});

/* ---------- dados (mock). Em produção: GET/PUT /api/candidato/perfil e /api/candidato/{experiencias|formacoes|competencias|idiomas} ---------- */
const uid=()=>'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const PF=MOCK.pf={
 data_nascimento:'',genero:'',pais:(()=>{try{return(Session.get()||{}).pais||''}catch(_){return''}})(),provincia:'',bairro:'',          /* provincia_id / pais_id */
 bi_numero:'',bi_emissao:'',bi_local_emissao:'',resumo_pessoal:'',cv_texto:'',foto_url:null,
 disponivel_para_mudanca:false,disponivel_para_remoto:false,idioma_principal_id:null,
 idiomas:[],competencias:[],formacoes:[],
 documentos:[],   /* candidato_documentos: {id,tipo,nome_ficheiro,tipo_mime,tamanho_bytes,criado_em,url}; em produção url_ficheiro vem da API */
 experiencias:[]};
function setAvatar(){const a=$('#av');if(!a)return;
 if(PF.foto_url){a.style.backgroundImage=`url("${PF.foto_url}")`;a.style.backgroundSize='cover';a.textContent=''}
 else{a.style.backgroundImage='';const u=Session.get();if(u)a.textContent=u.nome_completo.split(' ').map(w=>w[0]).slice(0,2).join('')}}
/* mantém o resumo usado pelo Dashboard e pela candidatura (MOCK.perfil) sempre igual ao perfil completo */
function sync(){delete MOCK.perfil.provincia_id;
 Object.assign(MOCK.perfil,{resumo_pessoal:PF.resumo_pessoal,foto_url:PF.foto_url,data_nascimento:PF.data_nascimento,pais_id:PF.pais,provincia:PF.provincia,
  experiencias:PF.experiencias.length,formacoes:PF.formacoes.length,competencias:PF.competencias.length,idiomas:PF.idiomas.length});setAvatar()}
sync();
const lat=fn=>new Promise((ok,no)=>setTimeout(()=>{try{const r=fn();sync();invalidate();ok(r)}catch(e){no(e)}},350));
const A={
 get:()=>wait({...PF,conta:Session.get()},150),
 set:patch=>lat(()=>Object.assign(PF,patch)),
 add:(k,o)=>lat(()=>{const id=o.id??uid();if(PF[k].some(x=>x.id===id))throw new Error('dup');PF[k].push({...o,id})}),
 upd:(k,id,o)=>lat(()=>{const i=PF[k].findIndex(x=>x.id===id);if(i<0)throw new Error('nf');PF[k][i]={...PF[k][i],...o,id}}),
 addDoc:(tipo,file)=>lat(()=>{
  if(tipo==='CV')PF.documentos=PF.documentos.filter(d=>{if(d.tipo!=='CV')return true;d.url&&URL.revokeObjectURL(d.url);return false});
  else if(PF.documentos.filter(d=>d.tipo!=='CV').length>=MAXDOC)throw new Error('max');
  PF.documentos.push({id:uid(),tipo,nome_ficheiro:file.name,tipo_mime:file.type||'',tamanho_bytes:file.size,criado_em:new Date().toISOString(),url:URL.createObjectURL(file)})}),
 importCv:(d,opt={})=>lat(()=>{
  const upd=!!opt.upd,nk=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),n={x:0,f:0,c:0,i:0,p:0},
   set=(k,v)=>{if(v&&(upd||!PF[k])&&PF[k]!==v){PF[k]=v;n.p++}};
  if(d.texto&&opt.cv!==false)PF.cv_texto=d.texto;   /* o texto de pesquisa acompanha sempre o CV mais recente */
  set('resumo_pessoal',d.resumo);set('data_nascimento',d.nasc);set('genero',d.genero);set('bairro',d.bairro);
  if(d.pais&&upd&&PF.pais&&PF.pais!==d.pais)PF.provincia='';
  set('pais',d.pais);if(d.provincia&&PF.pais===d.pais)set('provincia',d.provincia);
  if(d.bi&&!PF.bi_numero){PF.bi_numero=d.bi;n.p++}
  d.exps.forEach(e=>{const x=PF.experiencias.find(y=>nk(y.cargo)===nk(e.cargo)&&nk(y.empresa)===nk(e.empresa));
   if(!x){PF.experiencias.push({...e,id:uid()});n.x++}
   else if(upd&&['descricao','inicio','fim','actual'].some(k=>e[k]!==x[k])&&(e.descricao||e.inicio)){Object.assign(x,{descricao:e.descricao||x.descricao,inicio:e.inicio||x.inicio,fim:e.fim,actual:e.actual});n.x++}});
  d.forms.forEach(f=>{const na=nk(t('pf.na')),ccomp=y=>nk(y.curso).includes(nk(f.curso))||nk(f.curso).includes(nk(y.curso)),
    vazia=y=>!nk(y.instituicao)||nk(y.instituicao)===na||nk(y.instituicao)==='n d'||nk(y.instituicao)===nk(y.curso);   /* instituição em falta ou errada (igual ao curso) */
   const x=PF.formacoes.find(y=>ccomp(y)&&(nk(y.instituicao)===nk(f.instituicao)||vazia(y)||(f.inicio&&y.inicio&&f.inicio.slice(0,4)===y.inicio.slice(0,4))));
   if(!x){PF.formacoes.push({...f,id:uid()});n.f++}
   else{let ch=false;
    if(f.instituicao&&nk(f.instituicao)!==na&&nk(f.instituicao)!==nk(x.instituicao)&&(upd||vazia(x))){x.instituicao=f.instituicao;ch=true}   /* corrige o nome da instituição */
    if(upd&&['inicio','fim','concluido','grau'].some(k=>(f[k]||'')!==(x[k]||''))){Object.assign(x,{grau:f.grau||x.grau,inicio:f.inicio||x.inicio,fim:f.fim,concluido:f.concluido});ch=true}
    if(ch)n.f++}});
  d.comps.forEach(c=>{if(!PF.competencias.some(x=>x.id===c.id)){PF.competencias.push({id:c.id,nivel:c.nivel,anos:null});n.c++}});
  (d.outros||[]).forEach(nm=>{if(!PF.competencias.some(x=>nk(x.nome||'')===nk(nm))){PF.competencias.push({id:'o'+uid(),nome:nm,outro:true,nivel:'Intermediário',anos:null});n.c++}});   /* competências do CV fora do catálogo ficam como «Outro» */
  d.idis.forEach(i=>{if(!PF.idiomas.some(x=>x.id===i.id)){PF.idiomas.push({id:i.id,nivel:i.nivel});n.i++;if(!PF.idioma_principal_id&&i.nivel==='Nativo')PF.idioma_principal_id=i.id}});
  return n}),
 del:(k,id)=>lat(()=>{if(k==='documentos'){const d=PF.documentos.find(x=>x.id===id);if(d&&d.url)URL.revokeObjectURL(d.url)}PF[k]=PF[k].filter(x=>x.id!==id);if(k==='idiomas'&&PF.idioma_principal_id===id)PF.idioma_principal_id=null}),
 idioma:(id,nivel,main,novo)=>lat(()=>{if(novo){if(PF.idiomas.some(x=>x.id===id))throw new Error('dup');PF.idiomas.push({id,nivel})}else PF.idiomas.find(x=>x.id===id).nivel=nivel;
  if(main)PF.idioma_principal_id=id;else if(PF.idioma_principal_id===id)PF.idioma_principal_id=null})
};
let ST=null;   /* último perfil carregado */

/* ---------- utilitários ---------- */
const hoje=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const okD=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(new Date(v+'T00:00:00'));
const loc=()=>lang==='en'?'en-GB':'pt-PT';
const fmtMY=d=>d?new Intl.DateTimeFormat(loc(),{month:'short',year:'numeric'}).format(new Date(d+'T00:00:00')):'';
const nv=v=>NIV[v]?t('pf.n.'+NIV[v]):v;
const cNome=id=>{const c=COMP.find(x=>x[0]===id);return c?(lang==='en'?c[2]:c[1]):((PF.competencias.find(x=>x.id===id)||{}).nome||'')};
const cId=raw=>/^\d+$/.test(String(raw))?+raw:raw;   /* competências do catálogo têm id numérico; as «Outro» têm id de texto */
const iNome=id=>{const c=IDIOMAS.find(x=>x[0]===id);return c?(lang==='en'?c[2]:c[1]):''};
const anos=n=>n===1?t('pf.c.y1'):t('pf.c.y',{n:new Intl.NumberFormat(loc()).format(n)});
const mask=n=>'•'.repeat(Math.max(0,n.length-4))+n.slice(-4);
const ini=u=>u.nome_completo.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
let pReady=null;   /* a lista de países/regiões só é descarregada quando se abre o Perfil */
const loadPaises=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
const regioes=p=>(window.LERMO_REGIOES&&window.LERMO_REGIOES[p]||'').split('|').filter(Boolean);

/* ---------- ficheiros ---------- */
const extOf=n=>(n.split('.').pop()||'').toLowerCase();
const fileErr=(f,exts)=>!f||!f.size?t('pf.v.file'):(!exts.includes(extOf(f.name))||f.name.length>255)?t('pf.v.fmt'):f.size>MAXB?t('pf.v.size'):'';
const fsz=b=>b<1048576?Math.max(1,Math.round(b/1024))+' KB':new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(b/1048576)+' MB';
const fico=n=>({pdf:'fa-file-pdf',doc:'fa-file-word',docx:'fa-file-word',jpg:'fa-file-image',jpeg:'fa-file-image',png:'fa-file-image'}[extOf(n)]||'fa-file');
const dRow=(d,cv)=>`<li class="pfr"><span class="pfic" aria-hidden="true"><i class="fas ${fico(d.nome_ficheiro)}"></i></span><div class="rb"><div class="rt wrap">${esc(d.nome_ficheiro)}</div><div class="rs wrap">${esc(extOf(d.nome_ficheiro).toUpperCase())} · ${fsz(d.tamanho_bytes)} · ${t('pf.cv.at',{d:esc(fmtD(d.criado_em))})}</div></div>${cv?'':`<span class="tag in">${t('pf.dt.'+d.tipo)}</span>`}
 <div class="pfx"><a class="ib sm" href="${esc(d.url)}" download="${esc(d.nome_ficheiro)}" aria-label="${t('pf.d.dl')}: ${esc(d.nome_ficheiro)}"><i class="fas fa-download" aria-hidden="true"></i></a><button class="ib sm" type="button" data-a="pf-del:${cv?'cvf':'doc'}|${d.id}" aria-label="${t('pf.rm')}: ${esc(d.nome_ficheiro)}"><i class="fas fa-trash" aria-hidden="true"></i></button></div></li>`;

/* ---------- vista ---------- */
const ITENS=[['resumo',p=>!!p.resumo_pessoal,'about'],['foto',p=>!!p.foto_url,'foto'],['nasc',p=>!!p.data_nascimento,'pess'],['prov',p=>!!(p.pais&&p.provincia),'pess'],
 ['exp',p=>p.experiencias.length>0,'exp'],['form',p=>p.formacoes.length>0,'form'],['comp',p=>p.competencias.length>0,'comp'],['id',p=>p.idiomas.length>0,'idi']];
const SI={about:'fa-user',cv:'fa-file-lines',exp:'fa-briefcase',form:'fa-graduation-cap',idi:'fa-language',pess:'fa-id-card',doc:'fa-folder-open',pref:'fa-sliders',comp:'fa-star'};
const sec=(id,titulo,btn,body)=>`<section class="card" id="pf-${id}" aria-labelledby="pf-${id}-h"><div class="ch"><h2 id="pf-${id}-h"><span class="pfhi" aria-hidden="true"><i class="fas ${SI[id]||'fa-circle'}"></i></span>${titulo}</h2>${btn}</div>${body}</section>`;
const bEdit=id=>`<button class="btn btn-l btn-s" type="button" id="pf-b-${id}" data-a="pf-go:${id}"><i class="fas fa-pen" aria-hidden="true"></i> ${t('pf.edit')}</button>`;
const bAdd=id=>`<button class="btn btn-l btn-s" type="button" id="pf-b-${id}" data-a="pf-go:${id}"><i class="fas fa-plus" aria-hidden="true"></i> ${t('pf.add')}</button>`;
const row=(kind,id,label,title,sub,extra,desc)=>`<li class="pfr"><div class="rb"><div class="rt wrap">${title}</div>${sub?`<div class="rs wrap">${sub}</div>`:''}${desc?clamp(desc):''}${extra&&extra.below?extra.below:''}</div>${extra&&extra.tag?extra.tag:''}
 <div class="pfx"><button class="ib sm" type="button" data-a="pf-ed:${kind}|${id}" aria-label="${t('pf.edit')}: ${esc(label)}"><i class="fas fa-pen" aria-hidden="true"></i></button><button class="ib sm" type="button" data-a="pf-del:${kind}|${id}" aria-label="${t('pf.rm')}: ${esc(label)}"><i class="fas fa-trash" aria-hidden="true"></i></button></div></li>`;
const emp=(ic,txt,sm)=>`<div class="pfem${sm?' sm':''}"><span class="pfei" aria-hidden="true"><i class="fas ${ic}"></i></span><p class="wrap">${txt}</p></div>`;
/* indicador de carregamento; block=true bloqueia cliques enquanto decorre */
const busy=(msg,block)=>{if(block)return lmLoader(msg);const e=document.createElement('div');e.className='pfbusy'+(block?' blk':'');e.setAttribute('role','status');
 e.innerHTML=`<div class="pfbusy-i"><span class="pfsp" aria-hidden="true"></span><span>${esc(msg)}</span></div>`;document.body.append(e);return()=>e.remove()};
const CVMAX=30000;   /* texto do CV: um CV de várias páginas cabe inteiro (coluna TEXT no PostgreSQL) */
const clamp=(x,st='',always)=>{const long=always||x.length>200||x.split('\n').length>3;
 return long?`<div class="pfcw"><p class="pfd pfcl"${st}>${esc(x)}</p><button class="pfl2" type="button" data-a="pf-more" aria-haspopup="dialog">${t('pf.more')}</button></div>`:`<p class="pfd"${st}>${esc(x)}</p>`};
let showPref=false;
const ALL={};
const lista=(items,empty,ic='fa-inbox',key,max=4)=>{if(!items.length)return emp(ic,empty);
 if(!key||items.length<=max)return `<ul class="pfl">${items.join('')}</ul>`;
 ALL[key]=items.join('');
 return `<ul class="pfl">${items.slice(0,max).join('')}</ul><button class="pfl2 pfall" type="button" data-a="pf-all:${key}" aria-haspopup="dialog">${t('pf.all',{n:items.length})}</button>`};
const dd=(k,v)=>`<div><dt>${t(k)}</dt><dd>${v?v:`<span class="n0">${t('pf.na')}</span>`}</dd></div>`;
const dp=dd;

function perfilHtml(p){
 ST=p;
 const u=p.conta,pc=completude(MOCK.perfil),falta=ITENS.filter(i=>!i[1](p));
 const av=p.foto_url?`<div class="pfav" style="background-image:url('${p.foto_url}')" role="img" aria-label="${esc(u.nome_completo)}"></div>`:`<div class="pfav" aria-hidden="true">${esc(ini(u))}</div>`;
 const head=`<section class="card pfh">${av}<div class="pfwho"><h1>${esc(u.nome_completo)}</h1><p class="rs wrap">${t('pf.sub')}</p>
  <ul class="meta"><li><i class="fas fa-envelope" aria-hidden="true"></i>${esc(u.email)}</li>${u.telefone?`<li><i class="fas fa-phone" aria-hidden="true"></i>${esc(u.telefone)}</li>`:''}</ul>
  <p class="rs wrap">${t('pf.acc')} <a href="#/definicoes" style="color:var(--pl);font-weight:600">${t('n.def')}</a>.</p>
  <div class="pfact"><button class="btn btn-l btn-s" type="button" id="pfFotoBtn" data-a="pf-foto"><i class="fas fa-camera" aria-hidden="true"></i> ${t(p.foto_url?'pf.foto.chg':'pf.foto.add')}</button>${p.foto_url?`<button class="btn btn-l btn-s" type="button" data-a="pf-foto-rm">${t('pf.foto.rm')}</button>`:''}<button class="pf-cvb" type="button" data-a="pf-cv-pdf"><span class="ic"><i class="fas fa-file-arrow-down" aria-hidden="true"></i></span><span>${t('pf.cvpdf')}</span></button><input type="file" id="pfFile" accept="image/jpeg,image/png,image/webp" hidden><input type="file" id="pfCvFile" accept=".pdf,.doc,.docx" hidden></div></div>
  <div class="pfpc"><div class="ring" style="--v:${pc.v}" role="img" aria-label="${pc.v}%"><b>${pc.v}%</b></div></div></section>`;
 const cvf=p.documentos.find(d=>d.tipo==='CV'),outros=p.documentos.filter(d=>d.tipo!=='CV'),
  verPref=showPref||p.disponivel_para_mudanca||p.disponivel_para_remoto,
  chips=[...(!cvf&&!p.cv_texto?[['cvf','cvf']]:[]),...[...new Map(falta.filter(i=>i[0]!=='foto').map(i=>i[2]==='pess'?['pess','pess']:[i[0],i[2]]))],...(!outros.length?[['doc','doc']]:[]),...(!verPref?[['pref','pref']]:[])];
 const todo=chips.length?`<section class="card pfn" aria-labelledby="pfTodoH"><h2 id="pfTodoH">${t('pf.todo')}</h2><div class="chips">${chips.map(([k,go],ix)=>`<button class="pfi${k==='cvf'?' pri':''}" type="button" data-a="pf-go:${go}"><i class="fas fa-plus" aria-hidden="true"></i> ${t('f.'+k)}</button>`).join('')}</div></section>`:'';

 const about=sec('about',t('pf.s.about'),bEdit('about'),clamp(p.resumo_pessoal,' style="margin:0"'));
 const cvBtn=`<button class="btn btn-l btn-s" type="button" id="pf-b-cvf" data-a="pf-go:cvf"><i class="fas fa-paperclip" aria-hidden="true"></i> ${t(cvf?'pf.cv.rep':'pf.cv.up')}</button>`;
 const cv=sec('cv',t('pf.s.cv'),cvBtn,`<h3 class="pfsh">${t('pf.cv.file')}</h3>${cvf?`<ul class="pfl">${dRow(cvf,1)}</ul>`:emp('fa-file-arrow-up',t('pf.cv.none'),1)}
  <p class="rs wrap pfcvst" id="pfCvSt" role="status" aria-live="polite"></p>
  <div class="pfsr"><h3 class="pfsh">${t('pf.cv.txt')}</h3>${p.cv_texto?bEdit('cv'):bAdd('cv')}</div>${p.cv_texto?clamp(p.cv_texto,' style="margin:0"',1):emp('fa-align-left',t('pf.e.cv'),1)}`);
 const docs=sec('doc',t('pf.s.doc'),bAdd('doc'),lista(p.documentos.filter(d=>d.tipo!=='CV').sort((a,b)=>b.criado_em.localeCompare(a.criado_em)).map(d=>dRow(d,0)),t('pf.e.doc'),'fa-folder-open','doc',3));
 const exps=[...p.experiencias].sort((a,b)=>(b.actual-a.actual)||b.inicio.localeCompare(a.inicio)).map(e=>row('exp',e.id,e.cargo+' — '+e.empresa,esc(e.cargo),`${esc(e.empresa)} · ${fmtMY(e.inicio)} – ${e.actual?t('pf.now'):fmtMY(e.fim)}`,{tag:e.actual?`<span class="tag ok">${t('pf.now')}</span>`:''},e.descricao));
 const frms=[...p.formacoes].sort((a,b)=>b.inicio.localeCompare(a.inicio)).map(f=>row('form',f.id,f.curso,esc(f.curso)+(f.grau?' — '+esc(t('pf.gr.'+f.grau)):''),`${esc(f.instituicao)} · ${f.inicio.slice(0,4)} – ${f.concluido?f.fim.slice(0,4):t('pf.ongoing')}`,{tag:`<span class="tag ${f.concluido?'ok':'in'}">${t(f.concluido?'pf.done':'pf.ongoing')}</span>`}));
 const pessVazio=!(u.nome_completo||p.data_nascimento||p.genero||p.pais||p.provincia||p.bairro||p.bi_numero);
 const pess=sec('pess',t('pf.s.pess'),pessVazio?bAdd('pess'):bEdit('pess'),pessVazio?emp('fa-id-card',t('pf.e.pess')):`<dl class="pfdl">${dd('pf.l.nome',esc(u.nome_completo))}${dp('pf.l.nasc',p.data_nascimento&&esc(fmtD(p.data_nascimento)))}${dp('pf.l.gen',p.genero&&esc(t('pf.g.'+p.genero)))}${dp('pf.l.pais',p.pais&&esc(paisN(p.pais)))}${dp('pf.l.reg',p.provincia&&esc(provL(p.provincia)))}${dp('pf.l.bairro',p.bairro&&esc(p.bairro))}
  ${dp('pf.l.bi',p.bi_numero&&`${esc(mask(p.bi_numero))}${p.bi_emissao||p.bi_local_emissao?`<br><span class="n0">${[p.bi_emissao&&t('pf.bi.em',{d:esc(fmtD(p.bi_emissao))}),p.bi_local_emissao&&esc(p.bi_local_emissao)].filter(Boolean).join(' · ')}</span>`:''}`)}</dl>`);
 const sw=(k,lbl)=>`<label class="sw"><input type="checkbox" role="switch" data-pf="${k}"${p[k]?' checked':''}><span>${t(lbl)}</span></label>`;
 const pref=sec('pref',t('pf.s.pref'),'',`${sw('disponivel_para_mudanca','pf.p.mud')}${sw('disponivel_para_remoto','pf.p.rem')}<p class="rs wrap" style="margin-top:.4rem">${t('pf.p.h')}</p>`);
 const comps=[...p.competencias].sort((a,b)=>cNome(a.id).localeCompare(cNome(b.id),lang)).map(c=>row('comp',c.id,cNome(c.id),esc(cNome(c.id)),`${nv(c.nivel)}${c.anos!=null?' · '+anos(c.anos):''}`));
 const idis=[...p.idiomas].sort((a,b)=>(b.id===p.idioma_principal_id)-(a.id===p.idioma_principal_id)||iNome(a.id).localeCompare(iNome(b.id),lang)).map(i=>{const m=i.id===p.idioma_principal_id;
  return row('idi',i.id,iNome(i.id),esc(iNome(i.id)),nv(i.nivel)+(m?'':` · <button class="pfl2 in" type="button" data-a="pf-main:${i.id}">${t('pf.i.setmain')}</button>`),{tag:m?`<span class="tag ok">${t('pf.i.main')}</span>`:''})});
 const LONG=260,cards=[
  [p.resumo_pessoal,about,p.resumo_pessoal.length>LONG],
  [0,pess,0],   /* cartão «Dados pessoais» escondido; continua a abrir pelo botão «Editar nome» e pelas sugestões «Complete o seu perfil» */
  [exps.length,sec('exp',t('pf.s.exp'),bAdd('exp'),lista(exps,'','','exp',3)),p.experiencias.some(e=>(e.descricao||'').length>LONG)],
  [frms.length,sec('form',t('pf.s.form'),bAdd('form'),lista(frms,'','','form',3)),0],
  [idis.length,sec('idi',t('pf.s.idi'),bAdd('idi'),lista(idis,'','','idi',3)),0],
  [comps.length,sec('comp',t('pf.s.comp'),bAdd('comp'),lista(comps,'','','comp',3)),0],
  [cvf||p.cv_texto,cv,1],
  [outros.length,docs,outros.some(d=>d.nome_ficheiro.length>45)],
  [verPref,pref,0]].filter(c=>c[0]);
 const nar=cards.filter(c=>!c[2]);if(nar.length%2)nar[nar.length-1][2]=1;   /* sem cartão sozinho numa linha */
 const grid=cards.map(c=>c[2]?c[1].replace('class="card"','class="card pfw"'):c[1]).join('');
 return `<div id="pfRoot">`+crumbs([[t('n.dash'),'#/dashboard'],[t('n.perfil')]])+head+todo+`<div class="pfg">${grid}</div></div>`;
}
Views.perfil=async()=>{await loadPaises();const p=await A.get();return{title:t('n.perfil'),html:perfilHtml(p)}};
async function refresh(focusId){
 const p=await A.get();if(!/^#\/perfil/.test(location.hash))return;
 $('#main').innerHTML=perfilHtml(p);const el=focusId&&$('#'+focusId);if(el)el.focus();
}

/* ---------- formulários ---------- */
const F=(id,label,control,{hint,max,len,req}={})=>`<div class="fld"><label for="${id}">${label}${req?'<span aria-hidden="true"> *</span>':''}</label>${control}${hint||max?`<div class="fh"><span>${hint||''}</span>${max?`<span id="${id}C">${len||0}/${max}</span>`:''}</div>`:''}<p class="ferr" id="${id}E" role="alert" hidden></p></div>`;
const inp=(id,v='',{type='text',max,ex=''}={})=>`<input id="${id}" type="${type}" value="${esc(v??'')}"${max?` maxlength="${max}"`:''}${type==='date'?` max="${hoje()}"`:''} autocomplete="off" ${ex}>`;
const selH=(id,opts,val,ex='')=>`<select id="${id}" ${ex}>${opts.map(([v,l])=>`<option value="${esc(v)}"${String(v)===String(val)?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
const foot=()=>`<p class="ferr box" id="pfFail" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('pf.cancel')}</button><button class="btn btn-g" id="pfGo" type="submit"><i class="fas fa-check" aria-hidden="true"></i> ${t('pf.save')}</button></div>`;
const blank=()=>['',t('pf.sel')];
const mk=(id,msg)=>{const el=$('#'+id),w=el.closest('.fld'),e=$('#'+id+'E');w.classList.toggle('invalid',!!msg);el.setAttribute('aria-invalid',String(!!msg));if(e){e.textContent=msg||'';e.hidden=!msg;el.setAttribute('aria-describedby',id+'E')}return msg?el:null};
const dmsg=(v,{req,min,max}={})=>!v?(req?t('pf.v.req'):''):!okD(v)?t('pf.v.date'):(max&&v>max)?t('pf.v.future'):(min&&v<min)?t('pf.v.order'):'';
const val=id=>$('#'+id).value.trim();
async function guardar(fn,{btn,focus,msg}){
 const fail=$('#pfFail'),html=btn.innerHTML;fail.hidden=true;btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t('pf.saving')}`;
 try{await fn();Modal.close(true);await refresh(focus);toast(t(msg||'pf.saved'));return true}
 catch(e){fail.textContent=t(e.message==='dup'?'pf.dup':'pf.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=html;return false}
}

function openAbout(){const p=ST;
 Modal.open({title:t('pf.a.edit'),body:`<form id="pfF-about" class="pff" novalidate>
  ${F('pfRes',t('pf.a.res'),`<textarea id="pfRes" rows="5" maxlength="1200">${esc(p.resumo_pessoal)}</textarea>`,{hint:t('pf.a.res.h'),max:1200,len:p.resumo_pessoal.length})}
  ${foot()}</form>`});
}
function openCv(){const p=ST;
 Modal.open({title:t('pf.cv.edit'),body:`<form id="pfF-cv" class="pff" novalidate>
  ${F('pfCv',t('pf.a.cv'),`<textarea id="pfCv" rows="12" maxlength="${CVMAX}">${esc(p.cv_texto)}</textarea>`,{hint:t('pf.a.cv.h'),max:CVMAX,len:p.cv_texto.length})}${foot()}</form>`});
}
function openDoc(){
 if(ST.documentos.filter(d=>d.tipo!=='CV').length>=MAXDOC){toast(t('pf.v.maxdoc'));return}
 Modal.open({title:t('pf.d.add'),body:`<form id="pfF-doc" class="pff" novalidate>
  ${F('pfDocTipo',t('pf.d.tipo'),selH('pfDocTipo',[blank(),...TDOC.map(x=>[x,t('pf.dt.'+x)])],''),{req:1})}
  ${F('pfDocFile',t('pf.d.file'),`<input id="pfDocFile" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">`,{hint:t('pf.d.h'),req:1})}${foot()}</form>`});
}
function regField(pais,v){
 const rs=regioes(pais),L=t('pf.l.reg');
 if(!pais)return F('pfReg',L,`<select id="pfReg" disabled><option value="">${t('pf.sel')}</option></select>`);
 if(!rs.length)return F('pfReg',L,inp('pfReg',v,{max:50}),{hint:t('pf.reg.txt')});
 if(v&&!rs.includes(v))rs.push(v);
 return F('pfReg',L,`<select id="pfReg"><option value="">${t('pf.sel')}</option>${rs.map(r=>`<option value="${esc(r)}"${r===v?' selected':''}>${esc(provL(r))}</option>`).join('')}</select>`);
}
function openPess(){const p=ST;
 Modal.open({title:t('pf.p.edit'),body:`<form id="pfF-pess" class="pff" novalidate>
  ${F('pfNome',t('pf.l.nome'),inp('pfNome',p.conta.nome_completo,{max:150}),{hint:t('pf.nome.h'),req:1})}
  <div class="frow">${F('pfNasc',t('pf.l.nasc'),inp('pfNasc',p.data_nascimento,{type:'date',ex:'min="1920-01-01"'}))}${F('pfGen',t('pf.l.gen'),selH('pfGen',[blank(),...GENEROS.map(g=>[g,t('pf.g.'+g)])],p.genero))}</div>
  ${F('pfPais',t('pf.l.pais'),selH('pfPais',[blank(),...paisesOrd().map(c=>[c,paisN(c)])],p.pais))}
  <div id="pfRegW">${regField(p.pais,p.provincia)}</div>
  ${F('pfBairro',t('pf.l.bairro'),inp('pfBairro',p.bairro,{max:80}))}
  <fieldset class="fs"><legend>${t('pf.l.bi')} · ${t('pf.bi.h')}</legend>
   ${F('pfBi',t('pf.l.bin'),inp('pfBi',p.bi_numero,{max:20}))}
   <div class="frow">${F('pfBiEm',t('pf.l.bie'),inp('pfBiEm',p.bi_emissao,{type:'date'}))}${F('pfBiLoc',t('pf.l.bil'),inp('pfBiLoc',p.bi_local_emissao,{max:100}))}</div></fieldset>${foot()}</form>`});
}
function openExp(id){const e=id?ST.experiencias.find(x=>x.id===id):null;if(id&&!e)return;
 Modal.open({title:t(e?'pf.x.edit':'pf.x.add'),body:`<form id="pfF-exp" class="pff" data-id="${id||''}" novalidate>
  ${F('pfEmp',t('pf.x.emp'),inp('pfEmp',e&&e.empresa,{max:150}),{req:1})}${F('pfCargo',t('pf.x.cargo'),inp('pfCargo',e&&e.cargo,{max:100}),{req:1})}
  ${F('pfDesc',t('pf.x.desc'),`<textarea id="pfDesc" rows="4" maxlength="2000">${esc(e?e.descricao:'')}</textarea>`,{max:2000,len:e?e.descricao.length:0})}
  <div class="frow">${F('pfIni',t('pf.x.ini'),inp('pfIni',e&&e.inicio,{type:'date'}),{req:1})}${F('pfFim',t('pf.x.fim'),inp('pfFim',e&&e.fim,{type:'date'}),{req:1})}</div>
  <label class="chk"><input type="checkbox" id="pfAct"${e&&e.actual?' checked':''}> ${t('pf.x.act')}</label>${foot()}</form>`});
 togAct();
}
function openForm(id){const f=id?ST.formacoes.find(x=>x.id===id):null;if(id&&!f)return;
 Modal.open({title:t(f?'pf.f.edit':'pf.f.add'),body:`<form id="pfF-form" class="pff" data-id="${id||''}" novalidate>
  ${F('pfInst',t('pf.f.inst'),inp('pfInst',f&&f.instituicao,{max:150}),{req:1})}${F('pfCurso',t('pf.f.curso'),inp('pfCurso',f&&f.curso,{max:150}),{req:1})}
  ${F('pfGrau',t('pf.f.grau'),selH('pfGrau',[blank(),...GRAUS.map(g=>[g,t('pf.gr.'+g)])],f&&f.grau))}
  <div class="frow">${F('pfIni',t('pf.f.ini'),inp('pfIni',f&&f.inicio,{type:'date'}),{req:1})}${F('pfFim',t('pf.f.fim'),inp('pfFim',f&&f.fim,{type:'date'}),{req:1})}</div>
  <label class="chk"><input type="checkbox" id="pfCon"${f&&f.concluido?' checked':''}> ${t('pf.f.con')}</label>${foot()}</form>`});
 togCon();
}
function openComp(id){const c=id?ST.competencias.find(x=>x.id===id):null;if(id&&!c)return;
 const custom=!!(c&&c.outro),usados=new Set(ST.competencias.map(x=>x.id)),grupo=k=>COMP.filter(x=>x[3]===k&&(c?x[0]===id:!usados.has(x[0]))).map(x=>`<option value="${x[0]}"${c&&x[0]===id?' selected':''}>${esc(lang==='en'?x[2]:x[1])}</option>`).join('');
 const opts=custom?'':['o','d','t','s'].map(k=>grupo(k)?`<optgroup label="${t('pf.cat.'+k)}">${grupo(k)}</optgroup>`:'').join('');
 const outroOpt=(!c||custom)?`<option value="outro"${custom?' selected':''}>${t('pf.c.outro')}</option>`:'';
 Modal.open({title:t(c?'pf.c.edit':'pf.c.add'),body:`<form id="pfF-comp" class="pff" data-id="${id||''}" novalidate>
  ${F('pfComp',t('pf.c.nome'),`<select id="pfComp"${c?' disabled':''}>${c?'':`<option value="">${t('pf.sel')}</option>`}${opts}${outroOpt}</select>`,{req:1})}
  <div id="pfOutroW"${custom?'':' hidden'}>${F('pfOutro',t('pf.c.outro.l'),inp('pfOutro',custom?c.nome:'',{max:80,ex:`placeholder="${esc(t('pf.c.outro.ph'))}"`}),{req:1,hint:t('pf.c.outro.h')})}</div>
  <div class="frow">${F('pfNiv',t('pf.c.niv'),selH('pfNiv',NIV_COMP.map(n=>[n,nv(n)]),c?c.nivel:'Intermediário'))}${F('pfAnos',t('pf.c.anos'),inp('pfAnos',c&&c.anos!=null?c.anos:'',{type:'number',ex:'min="0" max="60" step="0.5" inputmode="decimal"'}))}</div>${foot()}</form>`});
}
function openIdi(id){const i=id?ST.idiomas.find(x=>x.id===id):null;if(id&&!i)return;
 const usados=new Set(ST.idiomas.map(x=>x.id)),opts=IDIOMAS.filter(x=>i?x[0]===id:!usados.has(x[0])).map(x=>[x[0],lang==='en'?x[2]:x[1]]);
 Modal.open({title:t(i?'pf.i.edit':'pf.i.add'),body:`<form id="pfF-idi" class="pff" data-id="${id||''}" novalidate>
  ${F('pfIdi',t('pf.i.nome'),selH('pfIdi',i?opts:[blank(),...opts],i?id:'',i?'disabled':''),{req:1})}
  ${F('pfNiv',t('pf.i.niv'),selH('pfNiv',NIV_IDI.map(n=>[n,nv(n)]),i?i.nivel:'Intermediário'))}
  <label class="chk"><input type="checkbox" id="pfMain"${i&&ST.idioma_principal_id===id?' checked':''}> ${t('pf.i.mainck')}</label>${foot()}</form>`});
}
const togAct=()=>{const a=$('#pfAct'),f=$('#pfFim');if(!a||!f)return;f.closest('.fld').hidden=a.checked;if(a.checked){f.value='';mk('pfFim','')}};
const togCon=()=>{const a=$('#pfCon'),f=$('#pfFim');if(!a||!f)return;f.closest('.fld').hidden=!a.checked;if(!a.checked){f.value='';mk('pfFim','')}};

/* ---------- submissões ---------- */
const SUB={
 about:(f,b)=>guardar(()=>A.set({resumo_pessoal:val('pfRes')}),{btn:b,focus:'pf-b-about'}),
 doc:(f,b)=>{
  const fl=$('#pfDocFile').files[0],tp=$('#pfDocTipo').value;
  const bad=[mk('pfDocTipo',tp?'':t('pf.v.pick')),mk('pfDocFile',fileErr(fl,EXT_DOC))].find(Boolean);
  if(bad){bad.focus();return}
  guardar(()=>A.addDoc(tp,fl),{btn:b,focus:'pf-b-doc'}).then(ok=>{if(ok)autoFill(fl,{foco:'pf-b-doc',cv:false})});
 },
 cv:(f,b)=>guardar(()=>A.set({cv_texto:val('pfCv')}),{btn:b,focus:'pf-b-cv'}),
 pess:(f,b)=>{
  const nome=val('pfNome').replace(/\s+/g,' '),nasc=$('#pfNasc').value,bi=val('pfBi'),em=$('#pfBiEm').value;
  const nomeOk=nome.length>=3&&nome.split(' ').length>=2&&/^[\p{L}][\p{L}'’.\- ]*$/u.test(nome);
  const bad=[mk('pfNome',nomeOk?'':t('pf.v.nome')),mk('pfNasc',dmsg(nasc,{max:hoje()})||(nasc&&nasc<'1920-01-01'?t('pf.v.nasc'):'')),mk('pfBi',bi&&!/^[A-Za-z0-9]{5,20}$/.test(bi)?t('pf.v.bi'):''),mk('pfBiEm',dmsg(em,{max:hoje()}))].find(Boolean);
  if(bad){bad.focus();return}
  guardar(()=>{const ss=Session.get();if(ss)localStorage.setItem(Session.KEY,JSON.stringify({...ss,nome_completo:nome}));
   const wn=$('#wn'),av=$('#av');if(wn)wn.textContent=nome;if(av&&!av.style.backgroundImage)av.textContent=nome.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
   return A.set({data_nascimento:nasc,genero:$('#pfGen').value,pais:$('#pfPais').value,provincia:$('#pfReg').value.trim(),bairro:val('pfBairro'),bi_numero:bi,bi_emissao:em,bi_local_emissao:val('pfBiLoc')})},{btn:b,focus:'pf-b-pess'});
 },
 exp:(f,b)=>{
  const act=$('#pfAct').checked,ini=$('#pfIni').value,fim=$('#pfFim').value,id=f.dataset.id;
  const bad=[mk('pfEmp',val('pfEmp')?'':t('pf.v.req')),mk('pfCargo',val('pfCargo')?'':t('pf.v.req')),mk('pfIni',dmsg(ini,{req:1,max:hoje()})),
   mk('pfFim',act?'':dmsg(fim,{req:1,max:hoje(),min:okD(ini)?ini:''}))].find(Boolean);
  if(bad){bad.focus();return}
  const o={empresa:val('pfEmp'),cargo:val('pfCargo'),descricao:val('pfDesc'),inicio:ini,fim:act?'':fim,actual:act};
  guardar(()=>id?A.upd('experiencias',id,o):A.add('experiencias',o),{btn:b,focus:'pf-b-exp'});
 },
 form:(f,b)=>{
  const con=$('#pfCon').checked,ini=$('#pfIni').value,fim=$('#pfFim').value,id=f.dataset.id;
  const bad=[mk('pfInst',val('pfInst')?'':t('pf.v.req')),mk('pfCurso',val('pfCurso')?'':t('pf.v.req')),mk('pfIni',dmsg(ini,{req:1,max:hoje()})),
   mk('pfFim',con?dmsg(fim,{req:1,max:hoje(),min:okD(ini)?ini:''}):'')].find(Boolean);
  if(bad){bad.focus();return}
  const o={instituicao:val('pfInst'),curso:val('pfCurso'),grau:$('#pfGrau').value,inicio:ini,fim:con?fim:'',concluido:con};
  guardar(()=>id?A.upd('formacoes',id,o):A.add('formacoes',o),{btn:b,focus:'pf-b-form'});
 },
 comp:(f,b)=>{
  const raw=f.dataset.id,sel=$('#pfComp').value,a=$('#pfAnos').value,n=Number(a),ed=!!raw,
   outro=ed?!/^\d+$/.test(raw):sel==='outro',nm=outro?val('pfOutro').replace(/\s+/g,' '):'';
  const key=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9#+]+/g,' ').trim();
  const cat=outro&&nm?COMP.find(c=>key(c[1])===key(nm)||key(c[2])===key(nm)):null;   /* «Excel» escrito em Outro usa a competência do catálogo */
  const bad=[mk('pfComp',ed||sel?'':t('pf.v.pick')),outro?mk('pfOutro',!nm?t('pf.v.req'):(!ed&&!cat&&ST.competencias.some(x=>x.outro&&key(x.nome)===key(nm)))?t('pf.dup'):''):null,mk('pfAnos',a!==''&&(!isFinite(n)||n<0||n>60)?t('pf.v.num'):'')].find(Boolean);
  if(bad){bad.focus();return}
  const o={nivel:$('#pfNiv').value,anos:a===''?null:n};
  if(ed){if(outro)o.nome=nm;guardar(()=>A.upd('competencias',cId(raw),o),{btn:b,focus:'pf-b-comp'});return}
  const id=outro?(cat?cat[0]:'o'+uid()):+sel;
  if(outro&&!cat){o.nome=nm;o.outro=true}
  guardar(()=>A.add('competencias',{id,...o}),{btn:b,focus:'pf-b-comp'});
 },
 idi:(f,b)=>{
  const id=f.dataset.id?+f.dataset.id:+$('#pfIdi').value,bad=mk('pfIdi',id?'':t('pf.v.pick'));
  if(bad){bad.focus();return}
  guardar(()=>A.idioma(id,$('#pfNiv').value,$('#pfMain').checked,!f.dataset.id),{btn:b,focus:'pf-b-idi'});
 }
};
document.addEventListener('submit',e=>{
 const f=e.target;if(!f.id||!f.id.startsWith('pfF-'))return;
 e.preventDefault();const fn=SUB[f.id.slice(4)];if(fn)fn(f,$('#pfGo'));
});

/* ---------- acções ---------- */
const OPEN={about:openAbout,cv:openCv,doc:openDoc,cvf:()=>$('#pfCvFile').click(),pref:()=>{showPref=true;refresh().then(()=>{const e=$('#pf-pref input');if(e)e.focus()})},pess:openPess,exp:()=>openExp(),form:()=>openForm(),comp:()=>openComp(),idi:()=>openIdi(),foto:()=>$('#pfFile').click()};
Actions['pf-go']=(b,x)=>{if(OPEN[x])OPEN[x]()};

/* ---------- CV em PDF gerado a partir do perfil (no navegador; A4, Helvetica, várias páginas) ---------- */
Object.assign(D.pt,{'pf.cvpdf.sum':'Resumo profissional','pf.cvpdf.busy':'A gerar…','pf.cvpdf':'Gerar CV em PDF','pf.cvpdf.ok':'CV gerado.','pf.cvpdf.empty':'Preencha primeiro o perfil (resumo, experiência, formação, competências ou idiomas).','pf.cvpdf.t':'Currículo','pf.cvpdf.foot':'Gerado na LERMO Recursos','pf.cvpdf.pg':'Página {a} de {b}','pf.cvpdf.cert':'Certificações e formação complementar','pf.cvpdf.vf':'Verificar'});
Object.assign(D.en,{'pf.cvpdf.sum':'Professional summary','pf.cvpdf.busy':'Generating…','pf.cvpdf':'Generate CV as PDF','pf.cvpdf.ok':'CV generated.','pf.cvpdf.empty':'Fill in your profile first (summary, experience, education, skills or languages).','pf.cvpdf.t':'Curriculum vitae','pf.cvpdf.foot':'Generated on LERMO Recursos','pf.cvpdf.pg':'Page {a} of {b}','pf.cvpdf.cert':'Certifications and training','pf.cvpdf.vf':'Verify'});
/* resumo: corta títulos de secção colados (ex.: «ÁREAS DE ESPECIALIZAÇÃO») e fica com 3 a 4 frases inteiras (~600 caracteres, 3 a 6 linhas), o recomendado para um CV */
function resumoCurto(x){
 let s=String(x||'').replace(/\s+/g,' ').trim();if(!s)return'';
 const k=s.slice(30).search(/\s[A-ZÀ-Ý]{4,}(?:\s+[A-ZÀ-Ý]{2,})+/);if(k>=0)s=s.slice(0,k+30).trim();
 const fr=s.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)||[s];let o='';
 let nf=0;for(const f of fr){if(o&&((o+f).length>600||nf>=4))break;o+=f;nf++}
 o=o.trim();if(o.length>650){const c=o.slice(0,620),i=c.lastIndexOf(' ');o=c.slice(0,i>300?i:620).replace(/[,;:\s]+$/,'')+'.'}
 return o}
function cvBuild(u,SC,maxB){
 /* CV compatível com ATS: uma só coluna, texto real em ordem de leitura, fonte padrão, sem tabelas, imagens nem colunas;
    títulos de secção convencionais, datas na mesma linha do cargo e competências em lista simples. */
 const sc=SC||1,PW=595,PH=842,W=PW/sc,H=PH/sc,M=50/sc,TOP=H-44/sc,BOT=48/sc,cv=document.createElement('canvas').getContext('2d');
 const mw=(x,sz,b)=>{cv.font=`${b?'bold ':''}${sz}px Helvetica, Arial, 'Liberation Sans', sans-serif`;return cv.measureText(x).width};
 const enc=x=>{let o='';for(const ch0 of String(x)){let c=ch0.charCodeAt(0);if(c===0x2013)c=0x96;else if(c===0x2014)c=0x97;else if(c===0x2026)c=0x85;else if(c===0x2018||c===0x2019)c=0x27;else if(c===0x201C||c===0x201D)c=0x22;else if(c===0x2022)c=0x95;if(c>255||c<32)c=63;const ch=String.fromCharCode(c);o+=ch==='\\'||ch==='('||ch===')'?'\\'+ch:ch}return o};
 const G='0.788 0.627 0.227',V='0.106 0.263 0.196',C='0.3 0.35 0.32',K='0.08 0.08 0.08',LN='0.78 0.82 0.8',f2=n=>n.toFixed(2);
 const wrap=(x,sz,max,b)=>{const out=[];String(x).split(/\n/).forEach(par=>{let ln='';for(const w of par.split(/\s+/).filter(Boolean)){const tt=ln?ln+' '+w:w;if(mw(tt,sz,b)>max&&ln){out.push(ln);ln=w}else ln=tt}out.push(ln)});return out};
 const pages=[[]];let y=TOP;
 const cur=()=>pages[pages.length-1];
 const room=h=>{if(y-h<BOT){pages.push([]);y=TOP}};
 const put=(x,sz,b,col,xx)=>cur().push(`BT /${b?'F2':'F1'} ${sz} Tf ${col} rg ${f2(xx)} ${f2(y)} Td (${enc(x)}) Tj ET`);
 const hr=(col,w)=>cur().push(`${w} w ${col} RG ${M} ${f2(y)} m ${W-M} ${f2(y)} l S`);
 /* cabeçalho: nome e contactos em texto simples */
 const nome=(u.nome_completo||'').trim()||'—';
 let nsz=27;while(mw(nome,nsz,true)>W-2*M&&nsz>14)nsz--;
 const loc=[PF.provincia,PF.pais&&paisN(PF.pais)].filter(Boolean).join(', ');
 const ct=[u.email,u.telefone,loc].filter(Boolean).join('   |   '),cl=ct?wrap(ct,10,W-2*M,false):[];
 y=TOP-nsz+6/sc;put(nome,nsz,true,V,M);
 y-=11;cur().push(`${V} rg ${M} ${f2(y)} 46 3 re f`);y-=4;
 cl.forEach(l=>{y-=16;put(l,10,false,C,M)});
 y-=11;hr('0.8 0.84 0.82',0.6);y-=2;
 const sec=(x,need)=>{room(36+(need||40));y-=25;cur().push(`BT /F2 10 Tf ${V} rg 1.1 Tc ${M} ${f2(y)} Td (${enc(x.toUpperCase())}) Tj 0 Tc ET`);y-=6;cur().push(`0.8 0.84 0.82 RG 0.6 w ${M} ${f2(y)} m ${W-M} ${f2(y)} l S`,`${V} rg ${M} ${f2(y-0.9)} 34 1.8 re f`);y-=4};
 const BUL=/^[\-•·▪●*◦►➢✓]\s*/;
 /* descrição -> blocos: junta linhas partidas, «PRINCIPAIS PROJECTOS» vira subtítulo, o resto fica em marcadores */
 const paras=txt=>{const out=[];let proj=false;
  String(txt||'').split(/\n/).map(s=>s.trim()).filter(Boolean).forEach(raw=>{
   const isB=BUL.test(raw),s=raw.replace(BUL,''),p=out[out.length-1];
   const cap=s.length<=45&&s===s.toUpperCase()&&/[A-ZÀ-Ý]{3}/.test(s);
   if(cap){out.push({k:'h',s});proj=/projec|projet/i.test(s);return}
   if(proj&&s.length<=95&&/\s[—–-]\s/.test(s)&&!/[.!?;:,]$/.test(s)&&!/^(tecnologias|resultados?|technologies)\b/i.test(s)){out.push({k:'s',s});return}
   if(p&&p.k==='b'&&!isB&&(/[,;:]$/.test(p.s)||(!/[.!?]$/.test(p.s)&&/^[a-zà-ÿ(]/.test(s)))){p.s+=' '+s;return}
   out.push({k:'b',s})});
  return out};
 const entry=(date,title,sub,body)=>{
  const dw=date?mw(date,9.5,false)+16:0,L=[];
  wrap(title,10.5,W-2*M-dw,true).forEach((l,k)=>L.push({t:l,sz:10.5,b:1,col:K,lh:14,gap:k?0:2,date:k?'':date}));
  if(sub)wrap(sub,10,W-2*M,false).forEach(l=>L.push({t:l,sz:10,col:C,lh:13.5}));
  let P=paras(body);{let nb=0,cut=P.length;for(let j=0;j<P.length;j++)if(P[j].k==='b'){if(nb>=maxB){cut=j;break}nb++}P=P.slice(0,cut);while(P.length&&P[P.length-1].k!=='b')P.pop()}
  const lista=P.filter(x=>x.k==='b').length>1||P.some(x=>x.k==='h'||x.k==='s');
  P.forEach((x,i)=>{
   if(x.k==='s'){wrap(x.s,10,W-2*M,true).forEach((l,j)=>L.push({t:l,sz:10,b:1,col:V,lh:13.5,gap:j?0:4}));return}
   if(x.k==='h'){wrap(x.s,9.5,W-2*M,true).forEach((l,j)=>L.push({t:l,sz:9.5,b:1,col:C,lh:13,gap:j?0:4}));return}
   if(!lista){wrap(x.s,10,W-2*M,false).forEach((l,j)=>L.push({t:l,sz:10,col:K,lh:13.5,gap:j?0:2}));return}
   const bw=mw('\u2022 ',10),ls=wrap(x.s,10,W-2*M-8-bw,false);
   ls.forEach((l,j)=>L.push({t:j?l:'\u2022 '+l,sz:10,col:K,lh:13.3,ind:8+(j?bw:0),gap:j?0:1.5}))});
  room(L.slice(0,4).reduce((a,l)=>a+l.lh+(l.gap||0),0));
  L.forEach(l=>{room(l.lh+(l.gap||0));y-=l.lh+(l.gap||0);
   put(l.t,l.sz,!!l.b,l.col,M+(l.ind||0));
   if(l.date)put(l.date,9.5,false,C,W-M-mw(l.date,9.5))});
  y-=9};
 const para=(x)=>wrap(x,10,W-2*M,false).forEach(l=>{room(14);y-=13.5;put(l,10,false,K,M)});
 /* se o resumo escrito for curto, abre com uma frase montada só com dados do perfil: cargo mais recente, anos de experiência e 3 competências */
 const lead=()=>{const E=[...PF.experiencias].sort((a,b)=>(b.actual-a.actual)||b.inicio.localeCompare(a.inicio));if(!E.length)return'';
  const ini=E.map(e=>e.inicio).sort()[0],an=Math.floor((Date.now()-new Date(ini))/31557600000),en=lang==='en',sk=PF.competencias.map(c=>cNome(c.id)).filter(Boolean).slice(0,3);
  return E[0].cargo+(an>=1?(en?` with ${an}+ year${an>1?'s':''} of experience`:` com mais de ${an} ano${an>1?'s':''} de experiência`):'')+(sk.length?(en?', skilled in ':', com competências em ')+sk.join(', '):'')+'.'};
 let rs=resumoCurto(PF.resumo_pessoal);if(rs.length<180){const l=lead();if(l)rs=(l+' '+rs).trim()}
 if(rs){sec(t('pf.cvpdf.sum'),30);para(rs);y-=2}
 if(PF.experiencias.length){sec(t('pf.s.exp'),50);
  [...PF.experiencias].sort((a,b)=>(b.actual-a.actual)||b.inicio.localeCompare(a.inicio)).forEach(e=>
   entry(`${fmtMY(e.inicio)} – ${e.actual?t('pf.now'):fmtMY(e.fim)}`,e.cargo,e.empresa,e.descricao))}
 if(PF.formacoes.length){sec(t('pf.s.form'),40);
  [...PF.formacoes].sort((a,b)=>b.inicio.localeCompare(a.inicio)).forEach(fm=>{
   const y0=fm.inicio.slice(0,4),y1=fm.concluido?fm.fim.slice(0,4):t('pf.ongoing'),gr=fm.grau&&fm.grau!=='Outro'?t('pf.gr.'+fm.grau):'';
   entry(y0===y1?y0:`${y0} – ${y1}`,gr?(lang==='en'?`${gr} – ${fm.curso}`:`${gr} em ${fm.curso}`):fm.curso,fm.instituicao,'')})}
 /* certificados LERMO concluídos, cada um com o endereço público de verificação (o mesmo do QR do certificado) */
 const vurl=window.LERMO_VERIFY_URL||new URL('verificar.html',location.href).href;
 const certs=(MOCK.fmIns||[]).filter(i=>i.cert&&i.estado==='concluido').map(i=>({i,p:(MOCK.fmProgs||[]).find(x=>x.id===i.prog_id)})).filter(x=>x.p).sort((a,b)=>b.i.cert.data.localeCompare(a.i.cert.data));
 if(certs.length){sec(t('pf.cvpdf.cert'),50);
  certs.forEach(({i,p})=>entry(fmtMY(i.cert.data),lang==='en'&&p.en?p.en:p.nome,`${p.ent}  |  ${p.horas} ${lang==='en'?'hours':'horas'}`,
   `${t('pf.cvpdf.vf')}: ${vurl+(vurl.includes('?')?'&':'?')}c=${encodeURIComponent(i.cert.codigo)}`))}
 if(PF.competencias.length){sec(t('pf.s.comp'),30);
  para([...PF.competencias].map(c=>cNome(c.id)).filter(Boolean).sort((a,b)=>a.localeCompare(b,lang)).join('  ·  '))}
 if(PF.idiomas.length){sec(t('pf.s.idi'),30);
  para([...PF.idiomas].sort((a,b)=>(b.id===PF.idioma_principal_id)-(a.id===PF.idioma_principal_id)).map(i=>`${iNome(i.id)} (${nv(i.nivel)})`).join('  ·  '))}
 if(sc<=0.8&&pages.length>2)pages.length=2;
 const n=pages.length;
 pages.forEach((pg,k)=>{pg.unshift(`${V} rg 0 ${f2(H-5/sc)} ${W} ${f2(5/sc)} re f`);const a=t('pf.cvpdf.foot'),b=t('pf.cvpdf.pg',{a:k+1,b:n});pg.push(`0.75 0.75 0.75 RG 0.6 w ${M} ${f2(36/sc)} m ${W-M} ${f2(36/sc)} l S`,`BT /F1 8 Tf ${C} rg ${M} ${f2(24/sc)} Td (${enc(a)}) Tj ET`,`BT /F1 8 Tf ${C} rg ${f2(W-M-mw(b,8,false))} ${f2(24/sc)} Td (${enc(b)}) Tj ET`)});
 const streams=pages.map(p=>`${sc} 0 0 ${sc} 0 0 cm\n`+p.join('\n')+'\n');
 const objs=[null,null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 const kids=[];
 streams.forEach((c,k)=>{const pi=objs.length+1;kids.push(pi+' 0 R');
  objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pi+1} 0 R >>`);
  objs.push(`<< /Length ${c.length} >>\nstream\n${c}endstream`)});
 objs.push(`<< /Title (${enc(nome+' - '+t('pf.cvpdf.t'))}) /Author (${enc(nome)}) /Producer (LERMO Recursos) >>`);const info=objs.length;
 objs[0]='<< /Type /Catalog /Pages 2 0 R >>';objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${n} >>`;
 let out='%PDF-1.4\n',off=[];
 objs.forEach((o,k)=>{off.push(out.length);out+=`${k+1} 0 obj\n${o}\nendobj\n`});
 const xr=out.length;
 out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objs.length+1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xr}\n%%EOF`;
 const b=new Uint8Array(out.length);for(let k=0;k<out.length;k++)b[k]=out.charCodeAt(k)&255;
 const bl=new Blob([b],{type:'application/pdf'});bl.pages=n;return bl;
}
/* no máximo 2 páginas: reduz a escala e o nº de marcadores por experiência até caber */
function cvPdf(u){let b;for(const[sc,mb]of[[1,6],[.95,5],[.91,4],[.87,3],[.83,3],[.8,2]]){b=cvBuild(u,sc,mb);if(b.pages<=2)break}return b}
Actions['pf-cv-pdf']=b=>{
 const u=Session.get()||{};
 if(!(PF.resumo_pessoal||PF.experiencias.length||PF.formacoes.length||PF.competencias.length||PF.idiomas.length)){toast(t('pf.cvpdf.empty'));return}
 const bt=b&&b.closest?b.closest('.pf-cvb')||b:null,html=bt?bt.innerHTML:'';
 if(bt){if(bt.disabled)return;bt.disabled=true;bt.innerHTML='<span class="ic"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i></span><span>'+t('pf.cvpdf.busy')+'</span>'}
 setTimeout(()=>{try{
  const blob=cvPdf(u),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='cv-'+norm(u.nome_completo||'candidato').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.pdf';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast(t('pf.cvpdf.ok'))
 }catch(e){toast(t('pf.fail'))}
 if(bt){bt.disabled=false;bt.innerHTML=html}},60);
};

Actions['pf-all']=(b,k)=>{if(!ALL[k])return;const h=b.closest('.card').querySelector('h2');
 Modal.open({title:h.textContent.trim(),body:`<ul class="pfl pfmx">${ALL[k]}</ul><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('modal.close')}</button></div>`})};
Actions['pf-more']=b=>{const q=b.previousElementSibling,r=b.closest('.pfr'),h=(r&&r.querySelector('.rt'))||b.closest('.card').querySelector('h2');
 Modal.open({title:h.textContent.trim(),body:`<div class="pfmx">${esc(q.textContent)}</div><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('modal.close')}</button></div>`})};
Actions['pf-ed']=(b,x)=>{const [k,id]=x.split('|');({exp:openExp,form:openForm,comp:openComp,idi:openIdi}[k])(k==='comp'?cId(id):k==='idi'?+id:id)};
Actions['pf-del']=(b,x)=>{
 const [k,raw]=x.split('|'),id=k==='comp'?cId(raw):k==='idi'?+raw:raw,it=ST[KIND[k]].find(y=>y.id===id);if(!it)return;
 const nome=k==='doc'||k==='cvf'?it.nome_ficheiro:k==='exp'?it.cargo:k==='form'?it.curso:k==='comp'?cNome(id):iNome(id);
 Modal.open({title:t('pf.del.t'),body:`<p class="wrap">${t('pf.del.p',{x:esc(nome)})}</p><p class="ferr box" id="pfFail" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('pf.cancel')}</button><button class="btn btn-d" type="button" id="pfGo" data-a="pf-delok:${x}"><i class="fas fa-trash" aria-hidden="true"></i> ${t('pf.rm')}</button></div>`});
};
Actions['pf-delok']=(b,x)=>{const [k,raw]=x.split('|');guardar(()=>A.del(KIND[k],k==='comp'?cId(raw):k==='idi'?+raw:raw),{btn:b,focus:'pf-b-'+k,msg:'pf.removed'})};
Actions['pf-main']=async(b,x)=>{b.disabled=true;const fim=busy(t('pf.saving'),true);try{await A.set({idioma_principal_id:+x});await refresh('pf-b-idi');toast(t('pf.saved'))}catch(e){b.disabled=false;toast(t('pf.fail'))}finally{fim()}};
Actions['pf-foto']=()=>$('#pfFile').click();
Actions['pf-foto-rm']=async()=>{const fim=busy(t('pf.saving'),true);try{await A.set({foto_url:null});await refresh('pfFotoBtn');toast(t('pf.foto.rmd'))}catch(e){toast(t('pf.fail'))}finally{fim()}};

function lerFoto(file){return new Promise((ok,no)=>{
 if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5*1024*1024)return no(new Error('foto'));
 const r=new FileReader();r.onerror=()=>no(new Error('foto'));
 r.onload=()=>{const im=new Image();im.onerror=()=>no(new Error('foto'));
  im.onload=()=>{try{const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=320;c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,320,320);ok(c.toDataURL('image/jpeg',.85))}catch(e){no(e)}};
  im.src=r.result};
 r.readAsDataURL(file)})}
;const LIBS={},loadJs=src=>LIBS[src]||(LIBS[src]=new Promise((ok,no)=>{const x=document.createElement('script');x.src=src;x.onload=ok;x.onerror=()=>{delete LIBS[src];no(new Error('lib'))};document.head.append(x)}));
const cvSt=m=>{const e=$('#pfCvSt');if(e)e.textContent=m||''};
/* localização e BI a partir do texto do documento (país/região existentes em LERMO_PAISES/LERMO_REGIOES) */
const sn=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const MZR=[['provincia de maputo','Maputo-Província'],['maputo provincia','Maputo-Província'],['cidade de maputo','Maputo-Cidade'],['maputo cidade','Maputo-Cidade'],['cabo delgado','Cabo Delgado'],['pemba','Cabo Delgado'],['lichinga','Niassa'],['niassa','Niassa'],['nampula','Nampula'],['mocuba','Zambézia'],['quelimane','Zambézia'],['zambezia','Zambézia'],['tete','Tete'],['chimoio','Manica'],['manica','Manica'],['beira','Sofala'],['sofala','Sofala'],['inhambane','Inhambane'],['xai xai','Gaza'],['gaza','Gaza'],['matola','Maputo-Província'],['maputo','Maputo-Cidade']];
/* telefone do CV: internacional (+indicativo ou 00indicativo, validado contra LERMO_PAISES) ou, em Moçambique, número local de 9 dígitos (82-87); devolve '+indicativo+número' como na conta */
function achaTel(L,code){
 const rot=/tel|telem|telemovel|celular|cell|mobile|phone|contacto|contact|whatsapp|fone/,
  zona=[...L.slice(0,15),...L.slice(15).filter(l=>l.length<=160&&rot.test(sn(l)))],
  dials=window.LERMO_PAISES?[...new Set(window.LERMO_PAISES.map(c=>c[1].replace(/\D/g,'')))].sort((x,y)=>y.length-x.length):[];
 for(const l of zona){
  const mi=l.match(/(?:^|[^\d])(?:\+|00)\s?(\d(?:[\s().-]{0,2}\d){7,14})(?!\d)/);
  if(mi){const dg=mi[1].replace(/\D/g,''),d=dials.find(x=>dg.startsWith(x)),num=d?dg.slice(d.length):'';
   if(d&&num.length>=6&&num.length<=12)return '+'+d+num}
  const ml=l.match(/(?:^|[^\d+])(8[2-7](?:[\s.-]?\d){7})(?!\d)/);
  if(ml&&(!code||code==='MZ'))return '+258'+ml[1].replace(/\D/g,'')}
 return ''}
function extras(txt){
 const o={},L=txt.replace(/\r/g,'').split('\n').map(l=>l.trim()).filter(Boolean),
  lab=/morada|residencia|reside|endereco|address|localizacao|location|cidade|city|provincia|province|pais |country|natural de|based in/,
  zona=' '+[...L.slice(0,10),...L.filter(l=>l.length<=140&&lab.test(sn(l)+' '))].map(sn).join(' | ')+' ';
 let code='';
 if(window.LERMO_PAISES){const c=window.LERMO_PAISES.find(c=>{const n=sn(c[2]);return n.length>=4&&zona.includes(' '+n+' ')});code=c?c[0]:(zona.includes(' mozambique ')?'MZ':'')}
 if(code==='MZ'||!code){const r=MZR.find(r=>zona.includes(' '+r[0]+' '));if(r){o.provincia=r[1];code=code||'MZ'}}
 else if(window.LERMO_REGIOES&&window.LERMO_REGIOES[code]){const r=window.LERMO_REGIOES[code].split('|').find(r=>{const n=sn(r);return n.length>=4&&zona.includes(' '+n+' ')});if(r)o.provincia=r}
 if(code)o.pais=code;
 const tel=achaTel(L,code||(Session.get()||{}).pais||'');if(tel)o.tel=tel;
 const m=txt.match(/(?:^|[^a-z])(?:bilhete\s+de\s+identidade|b\.\s?i\.|bi)\s*(?:n[.º°o]*\s*)?[:\-–]?\s*(\d{9,13}\s?[A-Za-z]?)(?![A-Za-z0-9])/i);
 if(m)o.bi=m[1].replace(/\s/g,'').toUpperCase();
 return o}
/* lê o CV ou outro documento anexado (PDF/DOCX) e preenche o perfil; só acrescenta o que ainda não existe */
async function autoFill(f,{foco='pf-b-cvf',cv=true,upd=false}={}){
 const ext=extOf(f.name),say=m=>{if(cv)cvSt(m);toast(m)};
 if(ext==='doc'){say(t('pf.cv.doc'));return}
 if(ext!=='pdf'&&ext!=='docx'){toast(t('pf.d.img'));return}
 if(cv)cvSt(t('pf.cv.read'));
 const fim=busy(t(cv?'pf.cv.read':'pf.ld.doc'),true);
 try{
  await Promise.all([loadJs('js/candidato-cv.js'),loadPaises()]);
  const txt=await window.LERMO_CV.texto(f),
   d=Object.assign(window.LERMO_CV.analisar(txt,{COMP,IDIOMAS,hoje:hoje(),na:t('pf.na')}),extras(txt)),n=await A.importCv(d,{cv,upd});
  let tn='';
  if(cv&&d.tel){const u=Session.get();if(u&&u.telefone!==d.tel){localStorage.setItem(Session.KEY,JSON.stringify({...u,telefone:d.tel}));n.p++;tn=' '+t('pf.cv.tel',{t:d.tel})}}   /* o telefone pertence à conta; mantém-se a validade da sessão */
  await refresh(foco);
  const m=(n.x+n.f+n.c+n.i+n.p?t(cv?(upd?'pf.cv.upd':'pf.cv.done'):'pf.doc.done',n):t(cv?'pf.cv.nada':'pf.doc.nada'))+tn;say(m);
 }catch(x){const m=t(x.message==='vazio'?'pf.cv.scan':'pf.cv.fail');say(m)}finally{fim()}
}
document.addEventListener('change',async e=>{
 const el=e.target;
 if(el.id==='pfComp'){const w=$('#pfOutroW'),on=el.value==='outro';if(w){w.hidden=!on;if(on){const i=$('#pfOutro');i&&i.focus()}else mk('pfOutro','')}return}
 if(el.id==='pfFile'){const f=el.files[0];el.value='';if(!f)return;
  const fim=busy(t('pf.ld.foto'),true);try{const url=await lerFoto(f);await A.set({foto_url:url});await refresh('pfFotoBtn');toast(t('pf.foto.ok'))}catch(x){toast(t('pf.foto.err'))}finally{fim()}}
 else if(el.id==='pfCvFile'){const f=el.files[0];el.value='';if(!f)return;
  if(fileErr(f,EXT_CV)){toast(t('pf.cv.err'));return}
  const fim=busy(t('pf.ld.up'),true);
  try{await A.addDoc('CV',f);await refresh('pf-b-cvf')}catch(x){fim();toast(t('pf.fail'));return}
  fim();await autoFill(f,{upd:true})}   /* o CV carregado é a fonte: actualiza também os dados já existentes (antes só o fazia ao substituir um CV) */
 else if(el.id==='pfPais'){$('#pfRegW').innerHTML=regField(el.value,'')}
 else if(el.id==='pfAct')togAct();
 else if(el.id==='pfCon')togCon();
 else if(el.dataset&&el.dataset.pf){const k=el.dataset.pf,on=el.checked;el.disabled=true;
  const fim=busy(t('pf.saving'));try{await A.set({[k]:on});ST[k]=on;toast(t('pf.saved'))}catch(x){el.checked=!on;toast(t('pf.fail'))}fim();el.disabled=false;el.focus()}
});
document.addEventListener('input',e=>{
 const el=e.target,w=el.closest&&el.closest('.pff');if(!w)return;
 if(el.tagName==='TEXTAREA'){const c=$('#'+el.id+'C');if(c)c.textContent=el.value.length+'/'+el.maxLength}
 if(el.closest('.fld.invalid'))mk(el.id,'');
});
})();
