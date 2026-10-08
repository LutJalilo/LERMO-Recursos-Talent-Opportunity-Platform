'use strict';
/* Área Formação (tabelas programas_formacao, turmas_formacao, inscricoes_formacao e certificados_formacao, ver lermo_database_v5_6.sql):
   programas de vários países, filtros, detalhe, inscrição, cancelamento e certificado.
   Depende de dashboard-candidato.js: MOCK/api, wait, t, esc, crumbs, fmtD, L, paisN, Views, Actions, Modal, toast, invalidate, $, lang, D, Session. */
(()=>{
const add=(pt,en)=>{Object.assign(D.pt,pt);Object.assign(D.en,en)};
add({
 'fm.menu':'Opções','fm.mn.det':'Ver detalhe','fm.mn.enr':'Inscrever-me','fm.mn.closed':'Inscrições encerradas','fm.mn.cx':'Cancelar inscrição','fm.mn.lock':'O programa já começou','fm.mn.cert':'Ver certificado','fm.mn.dl':'Descarregar certificado','fm.mn.nocert':'Disponível após concluir',
 'fm.loc.f':'Região','fm.loc.all':'Todas','fm.pick':'Escolha um país',
 'fm.f.conta':'Dados da sua conta','fm.f.conta.h':'Preenchidos a partir da sua conta. Pode alterá-los no Perfil.','fm.f.dial':'Indicativo','fm.f.nome':'Nome completo','fm.f.email':'E-mail','fm.f.tel':'Telefone','fm.f.pais':'País de residência','fm.f.reg':'Região ou província','fm.f.edu':'Nível de escolaridade','fm.f.sit':'Situação actual','fm.f.mot':'Porque quer frequentar este programa?','fm.f.mot.h':'Entre 20 e 500 caracteres.','fm.f.sel':'Seleccione…','fm.f.dados':'Os seus dados',
 'fm.e.nome':'Indique o seu nome completo.','fm.e.email':'Indique um e-mail válido.','fm.e.tel':'Indique o número sem o indicativo (6 a 12 dígitos).','fm.e.pais':'Seleccione o país.','fm.e.reg':'Seleccione a região.','fm.e.edu':'Seleccione o nível de escolaridade.','fm.e.sit':'Seleccione a sua situação.','fm.e.mot':'Escreva pelo menos 20 caracteres.',
 'fm.edu.basico':'Ensino básico','fm.edu.secundario':'Ensino secundário','fm.edu.tecnico':'Técnico-profissional','fm.edu.licenciatura':'Licenciatura','fm.edu.mestrado':'Mestrado ou superior','fm.edu.outro':'Outro',
 'fm.sit.estudante':'Estudante','fm.sit.desempregado':'Desempregado(a)','fm.sit.empregado':'Empregado(a)','fm.sit.empreendedor':'Empreendedor(a)',
 'est.em_curso':'Em curso','est.concluido':'Concluído',
 'fm.sub':'Programas de formação profissional e acompanhamento das suas inscrições.','fm.search':'Pesquisar por nome, entidade ou local','fm.search.a':'Pesquisar programas de formação',
 'fm.toggle':'Filtros','fm.pais':'País','fm.pais.all':'Todos','fm.mod':'Modalidade','fm.mod.all':'Todas','fm.mod.presencial':'Presencial','fm.mod.online':'Online','fm.mod.hibrido':'Híbrido',
 'fm.sort':'Ordenar','fm.sort.new':'Mais recentes','fm.sort.ini':'Início mais próximo','fm.open':'Só abertos','fm.clear':'Limpar filtros','fm.est':'Estado da inscrição',
 'fm.est.all':'Todos','fm.est.ins':'Inscritos','fm.est.disp':'Disponíveis','fm.count':'{n} programas','fm.count.1':'1 programa',
 'fm.empty':'Ainda não há programas de formação publicados.','fm.none':'Nenhum programa corresponde aos filtros.','fm.vd':'Ver detalhe',
 'fm.canreg':'Inscrições abertas','fm.full':'Esgotado','fm.closed':'Encerrado','fm.online':'Online','fm.startdur':'Início {d} · {h} h',
 'fm.entity':'Entidade','fm.loc':'Local','fm.modality':'Modalidade','fm.dur':'Duração','fm.hours':'{h} horas','fm.start':'Início','fm.end':'Fim','fm.slots':'Vagas','fm.slots.v':'{n} de {t} disponíveis','fm.prazo':'Prazo de inscrição',
 'fm.desc':'Descrição','fm.req':'Requisitos','fm.back':'Voltar à formação','fm.nf':'Programa não encontrado','fm.nf.p':'O programa pedido não existe ou já não está disponível.',
 'fm.st.h':'Estado da inscrição','fm.go':'Inscrição','fm.enr':'Inscrever-me','fm.enrolled':'Inscrito em','fm.pres':'Presença','fm.cx':'Cancelar inscrição',
 'fm.cta.h':'Vagas limitadas','fm.cta.p':'Inscreva-se até ao prazo para garantir o seu lugar.',
 'fm.p.inscrito':'A sua inscrição está confirmada. Pode cancelá-la até ao início do programa.','fm.p.em_curso':'Programa em curso. Já não é possível cancelar a inscrição.','fm.p.concluido':'Programa concluído.',
 'fm.closed.p':'As inscrições estão encerradas.','fm.full.p':'Já não há vagas disponíveis neste programa.',
 'fm.cert.h':'Certificado','fm.cert.ok':'Certificado emitido','fm.cert.code':'Código','fm.cert.date':'Emitido em','fm.cert.view':'Ver certificado','fm.cert.dl':'Descarregar PDF','fm.cert.title':'CERTIFICADO DE PARTICIPAÇÃO','fm.cert.dlok':'Certificado descarregado.','fm.cert.dlfail':'Não foi possível gerar o PDF.','fm.cert.wait':'O certificado está a ser processado.',
 'fm.cert.txt':'Certifica-se que {n} concluiu com aproveitamento o programa {p}, com a duração de {h} horas, promovido por {e}.',
 'fm.m.title':'Inscrição no programa','fm.m.prog':'Programa','fm.m.ack':'Confirmo que posso frequentar o programa nas datas indicadas e que os dados do meu perfil estão actualizados.','fm.m.ack.err':'Confirme para concluir a inscrição.',
 'fm.m.send':'Confirmar inscrição','fm.cert.soon':'O certificado é emitido quando concluir o programa e fica disponível aqui para ver e descarregar em PDF.','fm.mn.edit':'Editar inscrição','fm.ed.title':'Editar inscrição','fm.ed.save':'Guardar alterações','fm.ed.saving':'A guardar…','fm.ed.ok':'Inscrição actualizada.','fm.ed.lock':'O programa já começou. Já não é possível editar a inscrição.','fm.m.sending':'A inscrever…','fm.m.cancel':'Cancelar','fm.m.ok':'Inscrição realizada com sucesso.','fm.m.dup':'Já está inscrito neste programa.','fm.m.closed':'As inscrições deste programa já encerraram.','fm.m.full':'Já não há vagas neste programa.','fm.m.fail':'Não foi possível concluir a inscrição. Tente novamente.',
 'fm.x.title':'Cancelar inscrição','fm.x.p':'Tem a certeza de que quer cancelar a inscrição em {p}? Poderá inscrever-se de novo enquanto houver vagas e o prazo estiver aberto.','fm.x.keep':'Manter inscrição','fm.x.ok':'Inscrição cancelada.','fm.x.lock':'O programa já começou: não é possível cancelar.','fm.x.fail':'Não foi possível cancelar a inscrição. Tente novamente.','fm.close':'Fechar'
},{
 'fm.menu':'Options','fm.mn.det':'View details','fm.mn.enr':'Register','fm.mn.closed':'Registration closed','fm.mn.cx':'Cancel registration','fm.mn.lock':'The programme has started','fm.mn.cert':'View certificate','fm.mn.dl':'Download certificate','fm.mn.nocert':'Available after completion',
 'fm.loc.f':'Region','fm.loc.all':'All','fm.pick':'Choose a country',
 'fm.f.conta':'Your account details','fm.f.conta.h':'Filled in from your account. You can change them in your Profile.','fm.f.dial':'Dial code','fm.f.nome':'Full name','fm.f.email':'Email','fm.f.tel':'Phone','fm.f.pais':'Country of residence','fm.f.reg':'Region or province','fm.f.edu':'Education level','fm.f.sit':'Current situation','fm.f.mot':'Why do you want to attend this programme?','fm.f.mot.h':'Between 20 and 500 characters.','fm.f.sel':'Select…','fm.f.dados':'Your details',
 'fm.e.nome':'Enter your full name.','fm.e.email':'Enter a valid email.','fm.e.tel':'Enter the number without the dial code (6 to 12 digits).','fm.e.pais':'Select the country.','fm.e.reg':'Select the region.','fm.e.edu':'Select your education level.','fm.e.sit':'Select your situation.','fm.e.mot':'Write at least 20 characters.',
 'fm.edu.basico':'Primary education','fm.edu.secundario':'Secondary education','fm.edu.tecnico':'Vocational','fm.edu.licenciatura':"Bachelor's degree",'fm.edu.mestrado':"Master's or higher",'fm.edu.outro':'Other',
 'fm.sit.estudante':'Student','fm.sit.desempregado':'Unemployed','fm.sit.empregado':'Employed','fm.sit.empreendedor':'Entrepreneur',
 'est.em_curso':'In progress','est.concluido':'Completed',
 'fm.sub':'Vocational training programmes and the follow-up of your registrations.','fm.search':'Search by name, organisation or place','fm.search.a':'Search training programmes',
 'fm.toggle':'Filters','fm.pais':'Country','fm.pais.all':'All','fm.mod':'Mode','fm.mod.all':'All','fm.mod.presencial':'In person','fm.mod.online':'Online','fm.mod.hibrido':'Hybrid',
 'fm.sort':'Sort by','fm.sort.new':'Most recent','fm.sort.ini':'Starting soonest','fm.open':'Open only','fm.clear':'Clear filters','fm.est':'Registration status',
 'fm.est.all':'All','fm.est.ins':'Registered','fm.est.disp':'Available','fm.count':'{n} programmes','fm.count.1':'1 programme',
 'fm.empty':'No training programmes have been published yet.','fm.none':'No programme matches the filters.','fm.vd':'View details',
 'fm.canreg':'Registration open','fm.full':'Full','fm.closed':'Closed','fm.online':'Online','fm.startdur':'Starts {d} · {h} h',
 'fm.entity':'Organisation','fm.loc':'Location','fm.modality':'Mode','fm.dur':'Duration','fm.hours':'{h} hours','fm.start':'Start','fm.end':'End','fm.slots':'Places','fm.slots.v':'{n} of {t} available','fm.prazo':'Registration deadline',
 'fm.desc':'Description','fm.req':'Requirements','fm.back':'Back to training','fm.nf':'Programme not found','fm.nf.p':'The requested programme does not exist or is no longer available.',
 'fm.st.h':'Registration status','fm.go':'Registration','fm.enr':'Register','fm.enrolled':'Registered on','fm.pres':'Attendance','fm.cx':'Cancel registration',
 'fm.cta.h':'Limited places','fm.cta.p':'Register before the deadline to secure your place.',
 'fm.p.inscrito':'Your registration is confirmed. You can cancel it until the programme starts.','fm.p.em_curso':'Programme in progress. Registration can no longer be cancelled.','fm.p.concluido':'Programme completed.',
 'fm.closed.p':'Registration is closed.','fm.full.p':'There are no places left in this programme.',
 'fm.cert.h':'Certificate','fm.cert.ok':'Certificate issued','fm.cert.code':'Code','fm.cert.date':'Issued on','fm.cert.view':'View certificate','fm.cert.dl':'Download PDF','fm.cert.title':'CERTIFICATE OF PARTICIPATION','fm.cert.dlok':'Certificate downloaded.','fm.cert.dlfail':'Could not generate the PDF.','fm.cert.wait':'Your certificate is being processed.',
 'fm.cert.txt':'This certifies that {n} successfully completed the programme {p}, lasting {h} hours, run by {e}.',
 'fm.m.title':'Programme registration','fm.m.prog':'Programme','fm.m.ack':'I confirm that I can attend the programme on the stated dates and that my profile details are up to date.','fm.m.ack.err':'Please confirm to complete the registration.',
 'fm.m.send':'Confirm registration','fm.cert.soon':'The certificate is issued when you complete the programme and will be available here to view and download as PDF.','fm.mn.edit':'Edit registration','fm.ed.title':'Edit registration','fm.ed.save':'Save changes','fm.ed.saving':'Saving…','fm.ed.ok':'Registration updated.','fm.ed.lock':'The programme has already started. The registration can no longer be edited.','fm.m.sending':'Registering…','fm.m.cancel':'Cancel','fm.m.ok':'Registration completed.','fm.m.dup':'You are already registered in this programme.','fm.m.closed':'Registration for this programme has closed.','fm.m.full':'There are no places left in this programme.','fm.m.fail':'We could not complete the registration. Please try again.',
 'fm.x.title':'Cancel registration','fm.x.p':'Are you sure you want to cancel your registration in {p}? You can register again while places remain and the deadline is open.','fm.x.keep':'Keep registration','fm.x.ok':'Registration cancelled.','fm.x.lock':'The programme has already started: it cannot be cancelled.','fm.x.fail':'We could not cancel the registration. Please try again.','fm.close':'Close'
});

/* dados de teste (programas de vários países). Em produção: GET /api/formacao/programas */
MOCK.fmProgs=MOCK.fmProgs||[
 {id:'p1',pais:'MZ',local:'Zambézia',mod:'presencial',nome:'Competências Digitais para Jovens',en:'Digital Skills for Young People',ent:'Instituto de Formação Profissional',horas:120,ini:'2026-09-21',fim:'2026-12-18',lim:'2026-09-18',vagas:40,ocup:40,cri:'2026-08-25',
  desc:'Curso prático de utilização do computador, internet, ferramentas de escritório e segurança digital para jovens à procura do primeiro emprego.',descEn:'Hands-on course on computer use, the internet, office tools and digital safety for young people looking for their first job.',
  req:['Idade entre 16 e 30 anos','Ensino básico concluído'],reqEn:['Aged between 16 and 30','Basic education completed']},
 {id:'p2',pais:'MZ',local:'Maputo-Cidade',mod:'hibrido',nome:'Gestão de Pequenos Negócios',en:'Small Business Management',ent:'Centro de Empreendedorismo de Maputo',horas:80,ini:'2026-10-26',fim:'2026-12-11',lim:'2026-10-20',vagas:40,ocup:31,cri:'2026-09-28',
  desc:'Contabilidade básica, preços, vendas e organização financeira para quem já tem ou quer abrir um pequeno negócio.',descEn:'Basic accounting, pricing, sales and financial organisation for people who run or want to start a small business.',
  req:['Ter ou planear um negócio','Saber ler e escrever'],reqEn:['Run or plan a business','Able to read and write']},
 {id:'p3',pais:'MZ',local:'Nampula',mod:'presencial',nome:'Agricultura Sustentável e Cooperativismo',en:'Sustainable Farming and Cooperatives',ent:'Associação de Agricultores do Norte',horas:60,ini:'2026-11-09',fim:'2026-12-18',lim:'2026-11-02',vagas:30,ocup:22,cri:'2026-09-22',
  desc:'Técnicas de cultivo sustentável, conservação de solos e criação de cooperativas agrícolas.',descEn:'Sustainable growing techniques, soil conservation and setting up farming cooperatives.',
  req:['Residir na província de Nampula'],reqEn:['Live in Nampula province']},
 {id:'p4',pais:'MZ',local:'Online',mod:'online',nome:'Inglês Profissional',en:'Professional English',ent:'Academia Lusófona de Línguas',horas:90,ini:'2026-10-19',fim:'2027-01-29',lim:'2026-10-12',vagas:100,ocup:64,cri:'2026-09-30',
  desc:'Inglês para o local de trabalho: entrevistas, e-mails, reuniões e apresentações.',descEn:'Workplace English: interviews, emails, meetings and presentations.',
  req:['Nível básico de inglês','Computador ou telemóvel com internet'],reqEn:['Basic English level','Computer or phone with internet']},
 {id:'p5',pais:'AO',local:'Luanda',mod:'hibrido',nome:'Empreendedorismo e Plano de Negócio',en:'Entrepreneurship and Business Plan',ent:'Hub de Inovação de Luanda',horas:50,ini:'2026-11-16',fim:'2026-12-18',lim:'2026-11-09',vagas:35,ocup:35,cri:'2026-09-18',
  desc:'Da ideia ao plano de negócio: validação de mercado, modelo de receitas e apresentação a investidores.',descEn:'From idea to business plan: market validation, revenue model and investor pitching.',
  req:['Ter uma ideia de negócio'],reqEn:['Have a business idea']},
 {id:'p6',pais:'PT',local:'Online',mod:'online',nome:'Marketing Digital Essencial',en:'Digital Marketing Essentials',ent:'Escola Digital de Lisboa',horas:40,ini:'2026-10-12',fim:'2026-11-20',lim:'2026-10-09',vagas:60,ocup:20,cri:'2026-09-26',
  desc:'Redes sociais, anúncios pagos, e-mail marketing e medição de resultados para pequenas empresas.',descEn:'Social media, paid ads, email marketing and results tracking for small businesses.',
  req:['Computador com internet'],reqEn:['Computer with internet']},
 {id:'p7',pais:'MZ',local:'Maputo-Cidade',mod:'presencial',nome:'Elaboração de Plano de Negócio',en:'Business Plan Development',ent:'Centro de Formação Técnica',horas:60,ini:'2026-08-03',fim:'2026-08-28',lim:'2026-07-27',vagas:25,ocup:25,cri:'2026-07-05',
  desc:'Da ideia ao plano de negócio: análise de mercado, plano de marketing e vendas, plano operacional, previsão financeira e apresentação do plano a financiadores.',descEn:'From idea to business plan: market analysis, marketing and sales plan, operations plan, financial forecast and presenting the plan to funders.',
  req:['Ter ou planear um negócio','Saber ler e escrever'],reqEn:['Run or plan a business','Able to read and write']},
 {id:'p8',pais:'ZA',local:'Joanesburgo',mod:'presencial',nome:'Fundamentos de Análise de Dados',en:'Data Analytics Foundations',ent:'Johannesburg Tech Institute',horas:70,ini:'2026-09-28',fim:'2026-11-27',lim:'2026-09-15',vagas:30,ocup:18,cri:'2026-08-10',
  desc:'Recolha, limpeza e análise de dados com folhas de cálculo e SQL.',descEn:'Collecting, cleaning and analysing data with spreadsheets and SQL.',
  req:['Inglês intermédio'],reqEn:['Intermediate English']}
];
/* inscricoes_formacao do candidato (+ certificados_formacao): estado inscrito | em_curso | concluido; cancelar = apagar a inscrição */
MOCK.fmIns=MOCK.fmIns||[
 {prog_id:'p1',estado:'em_curso',presenca:60,data:'2026-09-10',cert:null},
 {prog_id:'p7',estado:'concluido',presenca:95,data:'2026-07-15',cert:{codigo:'LRM-FM-2026-00417',data:'2026-09-02'}}
];
const hoje=()=>new Date().toISOString().slice(0,10);
const progDe=id=>MOCK.fmProgs.find(x=>x.id===id);
const insDe=id=>MOCK.fmIns.find(x=>x.prog_id===id)||null;
const vagasRest=p=>Math.max(0,p.vagas-p.ocup);
const aberta=p=>new Date(p.lim+'T23:59:59')>=new Date()&&vagasRest(p)>0;
/* resumo do Dashboard: inscrições activas e certificados */
function sync(){
 const act=MOCK.fmIns.filter(i=>i.estado==='inscrito'||i.estado==='em_curso').map(i=>{const p=progDe(i.prog_id);return{id:p.id,t:p.nome,en:p.en,local:p.local,estado:i.estado,presenca:i.presenca||0,inicio:p.ini}});
 MOCK.formacao={abertas:MOCK.fmProgs.filter(p=>aberta(p)&&!insDe(p.id)).length,certificados:MOCK.fmIns.filter(i=>i.cert).map(i=>({id:i.prog_id,codigo:i.cert.codigo,data:i.cert.data})),inscricoes:act};
 invalidate();
}
sync();
api.fmProgs=()=>wait(MOCK.fmProgs.map(p=>({...p,ins:insDe(p.id)})),200);                                  /* GET /api/formacao/programas */
api.fmProg=id=>wait((p=>p?{...p,ins:insDe(p.id)}:null)(progDe(id)),200);                                    /* GET /api/formacao/programas/{id} */
/* POST /api/formacao/inscricoes (programa_id): cria inscricoes_formacao com estado 'inscrito' */
api.fmInscrever=(id,dados)=>new Promise((ok,no)=>setTimeout(()=>{
 const p=progDe(id);
 if(!p)return no(new Error('nf'));if(insDe(id))return no(new Error('dup'));
 if(vagasRest(p)<=0)return no(new Error('full'));if(new Date(p.lim+'T23:59:59')<new Date())return no(new Error('closed'));
 const i={prog_id:id,estado:'inscrito',presenca:0,data:hoje(),cert:null,dados:dados||null};
 p.ocup++;MOCK.fmIns.unshift(i);sync();ok(i)},600));
/* PUT /api/formacao/inscricoes/{programa_id}: actualiza os dados da inscrição (só antes do início, estado 'inscrito') */
api.fmEditar=(id,dados)=>new Promise((ok,no)=>setTimeout(()=>{
 const i=insDe(id);if(!i)return no(new Error('nf'));
 if(i.estado!=='inscrito')return no(new Error('lock'));
 i.dados=dados;sync();ok(i)},500));
/* DELETE /api/formacao/inscricoes/{programa_id}: só antes do início (estado 'inscrito'); liberta a vaga */
api.fmCancelar=id=>new Promise((ok,no)=>setTimeout(()=>{
 const k=MOCK.fmIns.findIndex(i=>i.prog_id===id);
 if(k<0)return no(new Error('nf'));if(MOCK.fmIns[k].estado!=='inscrito')return no(new Error('lock'));
 const p=progDe(id);if(p)p.ocup=Math.max(0,p.ocup-1);
 MOCK.fmIns.splice(k,1);sync();ok()},500));

const FM={q:'',pais:'',loc:'',mod:'',est:'',sort:'new',abertas:true,list:[],det:null,cur:null,tm:0};
const nome=p=>lang==='en'&&p.en?p.en:p.nome;
const ld=(p,f)=>lang==='en'&&p[f+'En']?p[f+'En']:p[f];
const modN=m=>t('fm.mod.'+m);
const localN=p=>p.local==='Online'?t('fm.online'):`${p.local}, ${paisN(p.pais)}`;
const lineById=id=>FM.det&&FM.det.id===id?FM.det:FM.list.find(x=>x.id===id)||null;
const go=id=>{const h='#/formacao/'+id;if(location.hash===h)dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=h};
const refresh=()=>dispatchEvent(new HashChangeEvent('hashchange'));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function prazo(p){
 if(p.ins)return null;
 const ms=new Date(p.lim+'T23:59:59')-new Date();if(ms<0)return[t('fm.closed'),'no'];if(vagasRest(p)<=0)return[t('fm.full'),'no'];
 const d=Math.ceil(ms/864e5);if(d<=1)return[t('op.dl.today'),'warn'];if(d<=8)return[t(d-1===1?'op.dl.day':'op.dl.days',{n:d-1}),'warn'];return[t('op.dl.until',{d:fmtD(p.lim)}),''];
}
const tom=e=>({concluido:'ok',em_curso:'in',inscrito:'in'}[e]||'in');
let pReady=null;
const loadPaises=()=>window.LERMO_PAISES?Promise.resolve():(pReady||(pReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='js/paises.js';s.onload=ok;s.onerror=()=>{pReady=null;no(new Error('paises'))};document.head.append(s)})));
/* lista completa de países e regiões (js/paises.js: 249 países + LERMO_REGIOES), igual à de Eventos, Perfil e Registo */
const paisesOrd=()=>window.LERMO_PAISES.map(p=>p[0]).sort((a,b)=>a==='MZ'?-1:b==='MZ'?1:paisN(a).localeCompare(paisN(b),lang));
const regs=p=>(window.LERMO_REGIOES&&window.LERMO_REGIOES[p]||'').split('|').filter(Boolean);
function fillReg(){
 const x=$('#fmLoc');if(!x)return;
 x.disabled=!FM.pais;
 x.innerHTML=`<option value="">${t(FM.pais?'fm.loc.all':'fm.pick')}</option>`+(FM.pais?opts(regs(FM.pais),FM.loc,provL):'');
}
const opts=(arr,sel,lbl)=>arr.map(x=>`<option value="${esc(x)}"${x===sel?' selected':''}>${esc(lbl(x))}</option>`).join('');

/* ---------- lista ---------- */
function filtrar(est=FM.est){
 const q=norm(FM.q.trim());
 const r=FM.list.filter(p=>(!FM.pais||p.pais===FM.pais)&&(!FM.loc||p.local===FM.loc)&&(!FM.mod||p.mod===FM.mod)&&(!FM.abertas||aberta(p)||p.ins)&&(est!=='ins'||p.ins)&&(est!=='disp'||!p.ins)&&(!q||norm([p.nome,p.en||'',p.ent,p.local,paisN(p.pais)].join(' ')).includes(q)));
 return r.sort(FM.sort==='ini'?(a,b)=>a.ini.localeCompare(b.ini):(a,b)=>b.cri.localeCompare(a.cri));
}
function sinal(p){
 const i=p.ins;
 if(i)return `<span class="tag ${tom(i.estado)}"><i class="fas fa-check" aria-hidden="true"></i> ${t('est.'+i.estado)}</span>`;
 return aberta(p)?`<span class="tag">${t('fm.canreg')}</span>`:'';
}
function menuHtml(p){
 const i=p.ins,ab=aberta(p);
 const it=(a,ic,k,o={})=>`<button class="fx-mi${o.d?' d':''}" type="button" role="menuitem" data-a="${a}:${esc(p.id)}"${o.off?' disabled':''}><i class="fas ${ic}" aria-hidden="true"></i><span>${t(k)}${o.sub?`<small>${t(o.sub)}</small>`:''}</span></button>`;
 const items=[it('fm-ver','fa-eye','fm.mn.det')];
 if(!i)items.unshift(it('fm-enr','fa-user-plus','fm.mn.enr',{off:!ab,sub:ab?'':'fm.mn.closed'}))
 if(!i){items.push(it('fm-cert','fa-award','fm.mn.cert',{off:1,sub:'fm.mn.nocert'}));items.push(it('fm-cert-dl','fa-download','fm.mn.dl',{off:1,sub:'fm.mn.nocert'}))}
 else{
  items.push(it('fm-edit','fa-pen','fm.mn.edit',{off:i.estado!=='inscrito',sub:i.estado!=='inscrito'?'fm.mn.lock':''}));
  items.push(it('fm-cert','fa-award','fm.mn.cert',{off:!i.cert,sub:i.cert?'':'fm.mn.nocert'}));
  items.push(it('fm-cert-dl','fa-download','fm.mn.dl',{off:!i.cert,sub:i.cert?'':'fm.mn.nocert'}));
  items.push(it('fm-cx','fa-rotate-left','fm.mn.cx',{d:1,off:i.estado!=='inscrito',sub:i.estado!=='inscrito'?'fm.mn.lock':''}));
 }
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="fm-menu:${esc(p.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${t('fm.menu')}: ${esc(nome(p))}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.join('')}</div></div>`;
}
const closeFm=focus=>document.querySelectorAll('.fx-menu.on').forEach(m=>{m.classList.remove('on');const k=m.previousElementSibling;k.setAttribute('aria-expanded','false');const c=m.closest('.vc');c&&c.classList.remove('fx-open');if(focus)k.focus()});
Actions['fm-menu']=b=>{const m=b.nextElementSibling,on=!m.classList.contains('on');closeFm();
 if(on){m.classList.add('on');b.setAttribute('aria-expanded','true');const c=b.closest('.vc');c&&c.classList.add('fx-open');const f=m.querySelector('button:not([disabled])');f&&f.focus()}};
Actions['fm-ver']=(b,id)=>{closeFm();go(id)};
function card(p){
 const pz=prazo(p);
 return `<article class="vc${p.ins?' req':''}"><div class="vh"><span class="ic"><i class="fas fa-graduation-cap" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/formacao/${esc(p.id)}">${esc(nome(p))}</a></h2><div class="rs">${esc(p.ent)}</div></div>${menuHtml(p)}</div>
 <div class="chips"><span class="tag in">${esc(modN(p.mod))}</span>${sinal(p)}</div>
 <ul class="meta"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(localN(p))}</li>${pz?`<li class="${pz[1]}"><i class="fas fa-clock" aria-hidden="true"></i>${esc(pz[0])}</li>`:`<li><i class="fas fa-bars-progress" aria-hidden="true"></i>${p.ins.estado==='inscrito'?esc(t('fm.p.inscrito').split('.')[0]):esc(t('fm.pres')+' '+p.ins.presenca+'%')}</li>`}<li><i class="fas fa-calendar-days" aria-hidden="true"></i>${esc(t('fm.startdur',{d:fmtD(p.ini),h:p.horas}))}</li></ul>
 <a class="btn btn-l" href="#/formacao/${esc(p.id)}">${t('fm.vd')}</a></article>`;
}
const nFiltros=()=>(FM.pais?1:0)+(FM.loc?1:0)+(FM.mod?1:0)+(FM.abertas?0:1)+(FM.sort!=='new'?1:0);
function updFiltros(){const n=nFiltros(),tg=$('#fmTog'),cl=$('#fmClr');if(!tg)return;tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!FM.q&&!FM.est}
function updSeg(){document.querySelectorAll('#fmSeg button').forEach(b=>{const v=b.dataset.a.split(':')[1];b.setAttribute('aria-pressed',String(FM.est===v));b.querySelector('b').textContent=filtrar(v).length})}
function renderRes(){
 const box=$('#fmRes');if(!box)return;updSeg();
 const r=filtrar(),c=$('#fmCount');
 c.textContent=t(r.length===1?'fm.count.1':'fm.count',{n:r.length});
 if(!FM.list.length){box.innerHTML=`<div class="state card"><i class="fas fa-graduation-cap" aria-hidden="true"></i>${t('fm.empty')}</div>`;c.textContent='';return}
 if(!r.length){box.innerHTML=`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('fm.none')}</p><br><button class="btn btn-l" type="button" data-a="fm-clear">${t('fm.clear')}</button></div>`;return}
 box.innerHTML=LRM_CAR.html(r.map(card).join(''),r.length,t('n.form'));LRM_CAR.later();
}
async function lista(){
 await loadPaises();FM.list=await api.fmProgs();FM.det=null;
 const mods=['presencial','hibrido','online'];
 return{title:t('n.form'),after:()=>{fillReg();renderRes();updFiltros()},html:
  crumbs([[t('n.dash'),'#/dashboard'],[t('n.form')]])+
  `<div class="ph"><div><h1>${t('n.form')}</h1><p class="rs wrap">${t('fm.sub')}</p></div><p class="rs" id="fmCount" aria-live="polite"></p></div>
  <form class="flt${nFiltros()?' open':''}" id="fmF" role="search" aria-label="${t('n.form')}">
   <div class="fld fq"><label class="sr" for="fmQ">${t('fm.search.a')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="fmQ" type="search" value="${esc(FM.q)}" placeholder="${t('fm.search')}" autocomplete="off" maxlength="80"></div></div>
   <button class="btn btn-l" id="fmTog" type="button" data-a="fm-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="fmSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('fm.toggle')} <b class="bd" hidden></b></button>
   <div class="fsec" id="fmSec">
    <div class="fld"><label for="fmPais">${t('fm.pais')}</label><select id="fmPais" data-f="pais"><option value="">${t('fm.pais.all')}</option>${opts(paisesOrd(),FM.pais,paisN)}</select></div>
    <div class="fld"><label for="fmLoc">${t('fm.loc.f')}</label><select id="fmLoc" data-f="loc"></select></div>
    <div class="fld"><label for="fmMod">${t('fm.mod')}</label><select id="fmMod" data-f="mod"><option value="">${t('fm.mod.all')}</option>${opts(mods,FM.mod,modN)}</select></div>
    <div class="fld"><label for="fmSort">${t('fm.sort')}</label><select id="fmSort" data-f="sort"><option value="new"${FM.sort==='new'?' selected':''}>${t('fm.sort.new')}</option><option value="ini"${FM.sort==='ini'?' selected':''}>${t('fm.sort.ini')}</option></select></div>
    <label class="chk"><input type="checkbox" id="fmAb" data-f="abertas"${FM.abertas?' checked':''}> ${t('fm.open')}</label>
    <button class="btn btn-l" id="fmClr" type="button" data-a="fm-clear">${t('fm.clear')}</button>
   </div></form>
  <div class="fx-seg" id="fmSeg" role="group" aria-label="${t('fm.est')}">${[['','fm.est.all'],['ins','fm.est.ins'],['disp','fm.est.disp']].map(([v,k])=>`<button type="button" data-a="fm-est:${v}" aria-pressed="${FM.est===v}">${t(k)} <b></b></button>`).join('')}</div>
  <div id="fmRes" aria-live="polite"></div>`};
}

/* ---------- detalhe ---------- */
function passos(i){
 const e=i.estado,idx={inscrito:0,em_curso:1,concluido:2}[e]??0;
 const lab=[t('est.inscrito'),t('est.em_curso'),t('est.concluido')];
 return `<ol class="fx-steps" aria-label="${t('fm.st.h')}">${lab.map((x,k)=>`<li class="${k<idx?'done':k===idx?'cur'+(k===2?' ok':''):''}"${k===idx?' aria-current="step"':''}><span class="dot" aria-hidden="true"></span><span>${x}</span></li>`).join('')}</ol>`;
}
function detalheHtml(p){
 const ab=aberta(p),i=p.ins,pz=prazo(p),rq=ld(p,'req');
 const fact=(ic,k,v)=>v?`<div><dt><i class="fas ${ic}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(v)}</dd></div>`:'';
 const certOff=`<div class="fx-box"><h3>${t('fm.cert.h')}</h3><p class="rs wrap">${t('fm.cert.soon')}</p><div class="fx-btns"><button class="btn btn-l btn-s" type="button" disabled aria-disabled="true" title="${esc(t('fm.mn.nocert'))}"><i class="fas fa-award" aria-hidden="true"></i> ${t('fm.cert.view')}</button><button class="btn btn-g btn-s" type="button" disabled aria-disabled="true" title="${esc(t('fm.mn.nocert'))}"><i class="fas fa-download" aria-hidden="true"></i> ${t('fm.cert.dl')}</button></div></div>`;
 const cta=i
  ?`<div class="fx-top"><h2 class="fx-h">${t('fm.st.h')}</h2></div>${passos(i)}<span class="tag ${tom(i.estado)}">${t('est.'+i.estado)}</span>
   <dl class="facts" style="margin:.2rem 0;width:100%"><div><dt>${t('fm.enrolled')}</dt><dd>${fmtD(i.data)}</dd></div>${i.estado!=='inscrito'?`<div><dt>${t('fm.pres')}</dt><dd>${i.presenca}%</dd></div>`:''}</dl>
   ${i.estado!=='inscrito'?`<div class="fx-bar" role="img" aria-label="${esc(t('fm.pres')+' '+i.presenca+'%')}"><span><i style="width:${i.presenca}%"></i></span></div>`:''}
   ${i.cert?`<div class="fx-box"><h3>${t('fm.cert.ok')}</h3><p class="rs wrap">${t('fm.cert.code')}: <strong>${esc(i.cert.codigo)}</strong><br>${t('fm.cert.date')} ${fmtD(i.cert.data)}</p><div class="fx-btns"><button class="btn btn-l btn-s" type="button" data-a="fm-cert:${esc(p.id)}"><i class="fas fa-award" aria-hidden="true"></i> ${t('fm.cert.view')}</button><button class="btn btn-g btn-s" type="button" data-a="fm-cert-dl:${esc(p.id)}"><i class="fas fa-download" aria-hidden="true"></i> ${t('fm.cert.dl')}</button></div></div>`:i.estado==='concluido'?`<p class="rs wrap">${t('fm.cert.wait')}</p>`:''}
   <p class="rs wrap">${t('fm.p.'+i.estado)}</p>
   ${i.cert?'':certOff}
   ${i.estado==='inscrito'?`<button class="btn btn-l" type="button" data-a="fm-edit:${esc(p.id)}"><i class="fas fa-pen" aria-hidden="true"></i> ${t('fm.mn.edit')}</button>`:''}
   ${i.estado==='inscrito'?`<button class="btn btn-l" type="button" data-a="fm-cx:${esc(p.id)}">${t('fm.cx')}</button>`:''}`
  :ab?`<div class="fx-top"><h2 class="fx-h">${t('fm.go')}</h2></div><span class="tag">${t('fm.canreg')}</span><div class="apx"><strong>${t('fm.cta.h')}</strong><p>${t('fm.slots.v',{n:vagasRest(p),t:p.vagas})}. ${t('fm.cta.p')}</p></div><button class="btn btn-g" type="button" data-a="fm-enr:${esc(p.id)}"><i class="fas fa-user-plus" aria-hidden="true"></i> ${t('fm.enr')}</button>${certOff}`
  :`<div class="fx-top"><h2 class="fx-h">${t('fm.go')}</h2></div><p class="rs wrap">${t(vagasRest(p)<=0&&new Date(p.lim+'T23:59:59')>=new Date()?'fm.full.p':'fm.closed.p')}</p><button class="btn btn-g" type="button" disabled>${t('fm.enr')}</button>${certOff}`;
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.form'),'#/formacao'],[nome(p)]])+
 `<div class="vtop"><a class="btn btn-l" href="#/formacao"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('fm.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det fxd"><article class="card"><header><h1>${esc(nome(p))}</h1><p class="rs wrap">${esc(p.ent)}</p>
  <div class="chips"><span class="tag in">${esc(modN(p.mod))}</span>${p.local==='Online'&&p.mod==='online'?'':`<span class="tag in">${esc(localN(p))}</span>`}${pz?`<span class="tag ${pz[1]==='no'?'no':''}">${esc(pz[0])}</span>`:''}${i?`<span class="tag ${tom(i.estado)}">${t('est.'+i.estado)}</span>`:''}</div></header>
  <dl class="facts">${fact('fa-building-columns','fm.entity',p.ent)}${fact('fa-location-dot','fm.loc',localN(p))}${fact('fa-laptop-file','fm.modality',modN(p.mod))}${fact('fa-hourglass-half','fm.dur',t('fm.hours',{h:p.horas}))}${fact('fa-calendar-day','fm.start',fmtD(p.ini))}${fact('fa-calendar-check','fm.end',fmtD(p.fim))}${fact('fa-users','fm.slots',t('fm.slots.v',{n:vagasRest(p),t:p.vagas}))}${fact('fa-clock','fm.prazo',fmtD(p.lim))}</dl>
  <h2>${t('fm.desc')}</h2><p>${esc(ld(p,'desc'))}</p>
  ${rq&&rq.length?`<h2>${t('fm.req')}</h2><ul class="reqs">${rq.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</article>
 <aside class="card cta" aria-label="${t('fm.go')}">${cta}</aside></div>`;
}
async function detalhe(id){
 await loadPaises();
 const p=await api.fmProg(id);FM.det=p;
 if(!p)return{title:t('n.form'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.form'),'#/formacao'],[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('fm.nf')}</h1><p>${t('fm.nf.p')}</p><br><a class="btn btn-g" href="#/formacao"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('fm.back')}</a></div>`};
 return{title:nome(p),html:detalheHtml(p)};
}
Views.formacao=id=>id?detalhe(id):lista();

/* ---------- inscrição, cancelamento e certificado (modais) ---------- */
const EDU=['basico','secundario','tecnico','licenciatura','mestrado','outro'],SIT=['estudante','desempregado','empregado','empreendedor'];
function fillRegF(sel){
 const x=$('#fmFr');if(!x)return;const r=regs($('#fmFp').value);
 x.disabled=!r.length;x.innerHTML=`<option value="">${t('fm.f.sel')}</option>`+opts(r,sel||'',provL);
}
/* telefone da conta: separa o indicativo (js/paises.js: [ISO, indicativo, nome]) do número */
function splitTel(raw){
 const n=String(raw||'').replace(/[^\d+]/g,'');if(!n)return null;
 const x=n.startsWith('+')?n:'+'+n;
 const dials=[...new Set(window.LERMO_PAISES.map(c=>c[1]))].sort((a,b)=>b.length-a.length);
 const d=dials.find(k=>x.startsWith(k));if(!d)return null;
 const iso=(window.LERMO_PAISES.find(c=>c[1]===d)||[])[0];
 return{dial:d,iso,num:x.slice(d.length)};
}
const dialDe=iso=>(window.LERMO_PAISES.find(c=>c[0]===iso)||[])[1]||'';
/* telefone (da conta ou da inscrição): o ISO guardado só vale se o indicativo coincidir (ex.: +1 serve vários países) */
function telInicial(tel,iso){
 const a=splitTel(tel);if(!a)return{iso:iso&&dialDe(iso)?iso:'MZ',num:''};
 return{iso:iso&&dialDe(iso)===a.dial?iso:a.iso,num:a.num};
}
const flagH=c=>`<img class="fm-flag" src="https://flagcdn.com/w40/${c.toLowerCase()}.png" srcset="https://flagcdn.com/w80/${c.toLowerCase()}.png 2x" width="24" height="18" alt="" loading="lazy">`;
const ccBtnH=iso=>`${flagH(iso)}<span class="fm-iso">${iso}</span><span>${esc(dialDe(iso))}</span><i class="fas fa-chevron-down" aria-hidden="true"></i>`;
/* seletor de país/indicativo: bandeira + código ISO + indicativo (igual ao de Criar conta) */
function ccHtml(iso){
 const L=[...window.LERMO_PAISES].sort((a,c)=>a[0]==='MZ'?-1:c[0]==='MZ'?1:paisN(a[0]).localeCompare(paisN(c[0]),lang));
 return `<div class="fm-cc"><button type="button" class="fm-ccb" id="fmFi" data-a="fm-cc" data-iso="${iso}" aria-haspopup="listbox" aria-expanded="false" aria-controls="fmCcL" aria-label="${t('fm.f.dial')}" title="${esc(paisN(iso))}">${ccBtnH(iso)}</button><ul class="fm-ccl" id="fmCcL" role="listbox" aria-label="${t('fm.f.dial')}" hidden>${L.map(c=>`<li role="option" tabindex="-1" data-a="fm-cc-pick:${c[0]}" data-iso="${c[0]}" aria-selected="${c[0]===iso}">${flagH(c[0])}<span class="fm-iso">${c[0]}</span><span class="n">${esc(paisN(c[0]))}</span><span class="d">${esc(c[1])}</span></li>`).join('')}</ul></div>`;
}
const ccOpen=on=>{const b=$('#fmFi'),l=$('#fmCcL');if(!b||!l)return;l.hidden=!on;b.setAttribute('aria-expanded',String(on));if(on){const x=l.querySelector('[aria-selected="true"]')||l.firstElementChild;x.scrollIntoView({block:'nearest'});x.focus()}};
Actions['fm-cc']=()=>ccOpen($('#fmCcL').hidden);
Actions['fm-cc-pick']=(b,iso)=>{const x=$('#fmFi');x.dataset.iso=iso;x.innerHTML=ccBtnH(iso);x.title=paisN(iso);const pf=$('#fmFp');if(pf&&pf.tagName==='SELECT'&&[...pf.options].some(o=>o.value===iso)){pf.value=iso;fillRegF('');const er=$('#fmEp');if(er)er.hidden=true;pf.removeAttribute('aria-invalid')}$('#fmCcL').querySelectorAll('li').forEach(li=>li.setAttribute('aria-selected',String(li.dataset.iso===iso)));ccOpen(false);x.focus()};
document.addEventListener('click',e=>{if(!e.target.closest('.fm-cc'))ccOpen(false)});
/* em captura, para o Esc fechar só a lista (e não o modal inteiro) */
document.addEventListener('keydown',e=>{
 const l=$('#fmCcL');if(!l)return;
 const li=e.target.closest&&e.target.closest('#fmCcL li');
 if(!li){if(e.target.id==='fmFi'&&e.key==='ArrowDown'){e.preventDefault();ccOpen(true)}else if(!l.hidden&&e.key==='Escape'){e.preventDefault();e.stopPropagation();ccOpen(false);$('#fmFi').focus()}return}
 const nz=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(e.key==='ArrowDown'){e.preventDefault();(li.nextElementSibling||li).focus()}
 else if(e.key==='ArrowUp'){e.preventDefault();(li.previousElementSibling||li).focus()}
 else if(e.key==='Enter'||e.key===' '){e.preventDefault();Actions['fm-cc-pick'](li,li.dataset.iso)}
 else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();ccOpen(false);$('#fmFi').focus()}
 else if(e.key.length===1&&/\S/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
  const it=[...l.children],c=it.indexOf(li),k=nz(e.key),h=it.slice(c+1).concat(it.slice(0,c+1)).find(x=>nz(x.querySelector('.n').textContent).startsWith(k));
  if(h){e.preventDefault();h.focus()}}
},true);
/* inscrição nova (edit=false) ou edição da inscrição existente (edit=true): mesmo formulário */
function fmForm(id,edit){
 closeFm(true);
 const p=progDe(id),ins=insDe(id);if(!p)return;
 if(edit?(!ins||ins.estado!=='inscrito'):(ins||!aberta(p)))return;
 FM.cur=p;FM.edit=!!edit;
 let u={};try{u=Session.get()||{}}catch(_){}
 const d=edit&&ins.dados||{};
 const sp=splitTel(u.telefone);
 const accTel=sp?{dial:sp.dial,num:sp.num,iso:u.pais&&dialDe(u.pais)===sp.dial?u.pais:sp.iso}:null;
 const accPais=u.pais||(accTel&&accTel.iso)||'';
 const tel=accTel||telInicial(d.tel,d.iso);
 const pais=accPais||d.pais||tel.iso;
 FM.acc={n:(u.nome_completo||d.nome||'').trim(),e:(u.email||d.email||'').trim(),t:accTel,p:accPais};
 const fld=(k,lbl,inner,hint)=>`<div class="fld"><label for="fmF${k}">${lbl}</label>${inner}${hint||''}<p class="ferr" id="fmE${k}" role="alert" hidden>${t('fm.e.'+({n:'nome',e:'email',t:'tel',p:'pais',r:'reg',d:'edu',s:'sit',m:'mot'})[k])}</p></div>`;
 const ro=(lbl,v)=>`<div><dt>${lbl}</dt><dd>${esc(v)}</dd></div>`;
 const roF=(lbl,iso,txt)=>`<div><dt>${lbl}</dt><dd class="fm-rof">${flagH(iso)}<span class="fm-iso">${iso}</span> ${esc(txt)}</dd></div>`;
 const fmtT=a=>`${a.dial} ${a.num.replace(/(\d{2})(\d{3})(\d{3,})/,'$1 $2 $3')}`;
 const conta=[FM.acc.n?ro(t('fm.f.nome'),FM.acc.n):'',FM.acc.e?ro(t('fm.f.email'),FM.acc.e):'',accTel?roF(t('fm.f.tel'),accTel.iso,fmtT(accTel)):'',accPais?roF(t('fm.f.pais'),accPais,paisN(accPais)):''].join('');
 const sel=(L,k,pre)=>L.map(x=>`<option value="${x}"${x===d[k]?' selected':''}>${t(pre+x)}</option>`).join('');
 const mb=Modal.open({title:t(edit?'fm.ed.title':'fm.m.title'),body:`<form id="fmS" novalidate>
  <p class="rs wrap" style="margin-bottom:.4rem"><strong>${t('fm.m.prog')}:</strong> ${esc(nome(p))} · ${esc(p.ent)}</p>
  <ul class="meta" style="margin-bottom:1rem"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(localN(p))}</li><li><i class="fas fa-calendar-days" aria-hidden="true"></i>${fmtD(p.ini)} – ${fmtD(p.fim)} · ${t('fm.hours',{h:p.horas})}</li></ul>
  ${conta?`<div class="fm-acc"><h3 class="fx-sec">${t('fm.f.conta')}</h3><dl class="facts fm-ro">${conta}</dl><p class="rs">${t('fm.f.conta.h')}</p></div>`:''}
  <div class="fm-g">
   ${FM.acc.n?'':fld('n',t('fm.f.nome'),`<input id="fmFn" type="text" autocomplete="name" maxlength="150" value="${esc(d.nome||'')}">`)}
   ${FM.acc.e?'':fld('e',t('fm.f.email'),`<input id="fmFe" type="email" autocomplete="email" maxlength="150" value="${esc(d.email||'')}">`)}
   ${accTel?'':fld('t',t('fm.f.tel'),`<div class="fm-tel">${ccHtml(tel.iso)}<input id="fmFt" type="tel" autocomplete="tel-national" inputmode="tel" maxlength="16" placeholder="84 000 0000" value="${esc(tel.num)}"></div>`)}
   ${accPais?`<input type="hidden" id="fmFp" value="${esc(accPais)}">`:fld('p',t('fm.f.pais'),`<select id="fmFp" autocomplete="country">${opts(paisesOrd(),pais,paisN)}</select>`)}
   ${fld('r',t('fm.f.reg'),`<select id="fmFr"></select>`)}
   ${fld('d',t('fm.f.edu'),`<select id="fmFd"><option value="">${t('fm.f.sel')}</option>${sel(EDU,'edu','fm.edu.')}</select>`)}
   ${fld('s',t('fm.f.sit'),`<select id="fmFs"><option value="">${t('fm.f.sel')}</option>${sel(SIT,'sit','fm.sit.')}</select>`)}
  </div>
  ${fld('m',t('fm.f.mot'),`<textarea id="fmFm" rows="4" maxlength="500">${esc(d.mot||'')}</textarea>`,`<div class="fh"><span>${t('fm.f.mot.h')}</span><span id="fmMc">${(d.mot||'').length}/500</span></div>`)}
  ${edit?'':`<div class="fld"><label class="chk" for="fmAck"><input type="checkbox" id="fmAck" aria-describedby="fmAckE"> ${t('fm.m.ack')}</label><p class="ferr" id="fmAckE" role="alert" hidden>${t('fm.m.ack.err')}</p></div>`}
  <p class="ferr box" id="fmFail" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('fm.m.cancel')}</button><button class="btn btn-g" id="fmGo" type="submit"><i class="fas ${edit?'fa-floppy-disk':'fa-user-plus'}" aria-hidden="true"></i> ${t(edit?'fm.ed.save':'fm.m.send')}</button></div></form>`});
 mb.querySelector('.mod').style.width='min(680px,100%)';
 fillRegF(d.reg||'');
}
Actions['fm-enr']=(b,id)=>fmForm(id,false);
Actions['fm-edit']=(b,id)=>fmForm(id,true);
document.addEventListener('submit',async e=>{
 if(e.target.id==='fmF'){e.preventDefault();return}
 if(e.target.id!=='fmS')return;
 e.preventDefault();
 const p=FM.cur,acc=FM.acc,edit=FM.edit,btn=$('#fmGo'),fail=$('#fmFail');fail.hidden=true;
 const v=k=>{const el=$('#fmF'+k);return el?el.value.trim():''};
 const num=acc.t?acc.t.num:v('t').replace(/[\s().-]/g,'').replace(/^0+/,'');
 const hasReg=regs($('#fmFp').value).length>0;
 const rules={r:!hasReg||!!v('r'),d:!!v('d'),s:!!v('s'),m:v('m').length>=20};
 if(!acc.t)rules.t=/^\d{6,12}$/.test(num);
 if(!acc.p)rules.p=!!v('p');
 if(!acc.n)rules.n=v('n').length>=3;
 if(!acc.e)rules.e=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('e'));
 let first=null;
 for(const k of ['n','e','t','p','r','d','s','m']){if(!(k in rules))continue;const el=$('#fmF'+k),bad=!rules[k];$('#fmE'+k).hidden=!bad;bad?el.setAttribute('aria-invalid','true'):el.removeAttribute('aria-invalid');if(bad&&!first)first=el}
 const ack=$('#fmAck');
 if(ack){$('#fmAckE').hidden=ack.checked;ack.checked?ack.removeAttribute('aria-invalid'):ack.setAttribute('aria-invalid','true')}
 if(first){first.focus();return}
 if(ack&&!ack.checked){ack.focus();return}
 const iso=acc.t?acc.t.iso:$('#fmFi').dataset.iso;
 const dados={nome:acc.n||v('n'),email:acc.e||v('e'),tel:dialDe(iso)+num,iso,pais:v('p'),reg:v('r'),edu:v('d'),sit:v('s'),mot:v('m')};
 const lab=()=>`<i class="fas ${edit?'fa-floppy-disk':'fa-user-plus'}" aria-hidden="true"></i> ${t(edit?'fm.ed.save':'fm.m.send')}`;
 btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t(edit?'fm.ed.saving':'fm.m.sending')}`;
 try{
  if(edit){await api.fmEditar(p.id,dados);Modal.close();toast(t('fm.ed.ok'));refresh()}
  else{await api.fmInscrever(p.id,dados);Modal.close();toast(t('fm.m.ok'));go(p.id)}
 }catch(x){fail.textContent=t(x.message==='lock'?'fm.ed.lock':x.message==='dup'?'fm.m.dup':x.message==='closed'?'fm.m.closed':x.message==='full'?'fm.m.full':'fm.m.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=lab()}
});
Actions['fm-cx']=(b,id)=>{
 closeFm(true);
 const p=lineById(id)||progDe(id);if(!p)return;const i=insDe(id);if(!i||i.estado!=='inscrito')return;
 Modal.open({title:t('fm.x.title'),body:`<p class="wrap" style="line-height:1.6">${t('fm.x.p',{p:'<strong>'+esc(nome(p))+'</strong>'})}</p><p class="ferr box" id="fmXF" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('fm.x.keep')}</button><button class="btn btn-g" type="button" data-a="fm-cx-ok:${esc(id)}">${t('fm.cx')}</button></div>`});
};
Actions['fm-cx-ok']=async(b,id)=>{
 const f=$('#fmXF');f.hidden=true;b.disabled=true;
 try{await api.fmCancelar(id);Modal.close();toast(t('fm.x.ok'));refresh()}
 catch(x){f.textContent=t(x.message==='lock'?'fm.x.lock':'fm.x.fail');f.hidden=false;b.disabled=false}
};
Actions['fm-cert']=(b,id)=>{
 closeFm(true);
 const p=progDe(id),i=insDe(id);if(!p||!i||!i.cert)return;
 let n='';try{n=(Session.get()||{}).nome_completo||''}catch(_){}
 Modal.open({title:t('fm.cert.h'),body:`<div class="fm-dip">${window.LERMO_LOGO?`<img src="${window.LERMO_LOGO.png}" alt="LERMO Recursos" width="64" height="85">`:'<i class="fas fa-award" aria-hidden="true"></i>'}<p class="fm-dip-t">${esc(nome(p))}</p><p class="wrap">${t('fm.cert.txt',{n:'<strong>'+esc(n||'—')+'</strong>',p:'<strong>'+esc(nome(p))+'</strong>',h:p.horas,e:esc(p.ent)})}</p><p class="rs">${t('fm.cert.code')}: <strong>${esc(i.cert.codigo)}</strong> · ${t('fm.cert.date')} ${fmtD(i.cert.data)}</p><div class="fm-sig">${sigSvg()}<span class="fm-sig-l" aria-hidden="true"></span><strong>${esc(sigDe(i.cert).nome)}</strong><span>${esc(sigDe(i.cert).cargo)}</span><em class="fm-sig-d"><i class="fas fa-shield-halved" aria-hidden="true"></i> ${t('fm.cert.dsig')}<br>${t('fm.cert.sigid')}: ${sigDe(i.cert).id}</em></div><div class="fm-qr">${qrSvg(verUrl(i.cert.codigo),104)}<span>${t('fm.cert.vfu')}</span></div></div><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('fm.close')}</button><button class="btn btn-g" type="button" data-a="fm-cert-dl:${esc(id)}"><i class="fas fa-download" aria-hidden="true"></i> ${t('fm.cert.dl')}</button></div>`});
};
Object.assign(D.pt,{'fm.cert.l1':'Certifica-se que','fm.cert.l2':'concluiu com aproveitamento o programa','fm.cert.l3':'com a duração de {h} horas, promovido por {e}.','fm.cert.foot':'Documento emitido electronicamente. A autenticidade pode ser confirmada através do código QR.','fm.cert.vf':'Verificar autenticidade','fm.cert.vfu':'Digitalize o código QR para confirmar este certificado.','fm.cert.sig.cargo':'Director Administrativo','fm.cert.t1':'CERTIFICADO','fm.cert.t2':'DE CONCLUSÃO','fm.cert.dsig':'ASSINADO DIGITALMENTE','fm.cert.dsig2':'Assinado digitalmente','fm.cert.sigid':'ID DA ASSINATURA'});
Object.assign(D.en,{'fm.cert.l1':'This certifies that','fm.cert.l2':'successfully completed the programme','fm.cert.l3':'lasting {h} hours, run by {e}.','fm.cert.foot':'Electronically issued document. Its authenticity can be confirmed through the QR code.','fm.cert.vf':'Verify authenticity','fm.cert.vfu':'Scan the QR code to confirm this certificate.','fm.cert.sig.cargo':'Administrative Director','fm.cert.t1':'CERTIFICATE','fm.cert.t2':'OF COMPLETION','fm.cert.dsig':'DIGITALLY SIGNED','fm.cert.dsig2':'Digitally signed','fm.cert.sigid':'SIGNATURE ID'});
/* ---------- QR de verificação ----------
   O QR contém só o endereço público de verificação (…/verificar.html?c=CÓDIGO). Em produção defina window.LERMO_VERIFY_URL
   (ex.: 'https://lermo.co.mz/verificar') antes de carregar este ficheiro; por omissão usa a página verificar.html do mesmo site. */
const VERIFY=window.LERMO_VERIFY_URL||new URL('verificar.html',location.href).href;
/* Assinatura digital do Director Administrativo. Em produção vem de certificados_formacao (signatario_nome, signatario_cargo,
   assinatura_digital; SQL v5.12) como i.cert.assin={nome,cargo,hash}. Em modo de teste: window.LERMO_SIGNATARIO={nome:'…'} ou nome de
   exemplo, e um selo calculado aqui (não é uma assinatura criptográfica real). */
const sigHash=s=>{let o='';for(let k=0;k<8;k++){let h1=0xdeadbeef^k,h2=0x41c6ce57^k;for(let n=0;n<s.length;n++){const c=s.charCodeAt(n);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}
 h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);o+=(h1>>>0).toString(16).padStart(8,'0')}return o.toUpperCase()};
const sigDe=c=>{const a=c.assin||{},w=window.LERMO_SIGNATARIO||{},h=a.hash||sigHash(c.codigo+'|'+c.data);
 return{nome:a.nome||w.nome||'Guinelson Ernesto',cargo:a.cargo||t('fm.cert.sig.cargo'),id:h.slice(0,24).match(/.{4}/g).join(' ')}};
/* rubrica desenhada (caixa 170×44, origem em baixo à esquerda): traços = [início, curvas bézier…] */
const SIGP=[[[6,10],[10,40,30,46,36,30],[40,18,30,8,22,14],[14,20,26,34,46,26],[58,20,60,8,70,16],[78,22,74,32,84,26],[96,19,100,10,110,17],[118,23,116,32,126,27],[138,21,146,13,162,21]],
 [[8,7],[50,2,112,3,166,11]],[[116,36],[124,40,134,38,140,30]]];
const sigSvg=()=>`<svg class="fm-sig-s" viewBox="0 0 170 44" width="170" height="44" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${SIGP.map(s=>'<path d="M'+s[0][0]+' '+(44-s[0][1])+s.slice(1).map(q=>' C'+q.map((v,k)=>k%2?(44-v):v).join(' ')).join('')+'"/>').join('')}</svg>`;
const verUrl=cod=>VERIFY+(VERIFY.includes('?')?'&':'?')+'c='+encodeURIComponent(cod);
function qrMatrix(s){const q=qrcode(0,'M');q.addData(s);q.make();const n=q.getModuleCount(),m=[];for(let r=0;r<n;r++){m.push([]);for(let c=0;c<n;c++)m[r].push(q.isDark(r,c))}return m}
/* QR como vectores dentro do PDF (x,y = canto inferior esquerdo) */
function qrPdf(s,x,y,size){
 const m=qrMatrix(s),n=m.length,u=size/n;let o='0.106 0.263 0.196 rg\n';
 for(let r=0;r<n;r++){let c=0;while(c<n){if(!m[r][c]){c++;continue}let e=c;while(e<n&&m[r][e])e++;
  o+=`${(x+c*u).toFixed(2)} ${(y+size-(r+1)*u).toFixed(2)} ${((e-c)*u+0.15).toFixed(2)} ${(u+0.15).toFixed(2)} re\n`;c=e}}
 return o+'f\n'}
function qrSvg(s,px){
 const m=qrMatrix(s),n=m.length;let d='';
 for(let r=0;r<n;r++){let c=0;while(c<n){if(!m[r][c]){c++;continue}let e=c;while(e<n&&m[r][e])e++;d+=`M${c} ${r}h${e-c}v1h-${e-c}z`;c=e}}
 return `<svg viewBox="0 0 ${n} ${n}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR"><path d="${d}" fill="#1B4332"/></svg>`}
/* PDF do certificado gerado no próprio navegador (A4 horizontal; fontes padrão do PDF e logótipo incorporado).
   Larguras do texto: tabelas AFM em js/lermo-logo.js (centragem exacta, independente do dispositivo). */
function certPdf(p,i,nomeC){
 const W=842,H=595,FW=window.LERMO_FONT_W||{},LG=window.LERMO_LOGO||null;
 const FK={F1:'F1',F2:'F2',F3:'F3',F4:'F4',F5:'F5'}; /* F1 Helvetica, F2 Helvetica-Bold, F3 Times-Roman, F4 Times-Bold, F5 Times-Italic */
 const code=ch0=>{let c=ch0.charCodeAt(0);if(c===0x2013)c=0x96;else if(c===0x2014)c=0x97;else if(c===0x2026)c=0x85;else if(c===0x2018||c===0x2019)c=0x27;else if(c===0x201C||c===0x201D)c=0x22;return(c>255||c<32)?63:c};
 const mw=(txt,sz,f,tc)=>{const w=FW[f]||FW.F1;let n=0,a=0;if(!w){return String(txt).length*sz*0.5}for(const ch of String(txt)){a+=w[code(ch)-32]||500;n++}return a*sz/1000+(tc||0)*Math.max(0,n-1)};
 const enc=x=>{let o='';for(const ch0 of String(x)){const ch=String.fromCharCode(code(ch0));o+=ch==='\\'||ch==='('||ch===')'?'\\'+ch:ch}return o};
 const G='0.788 0.627 0.227',V='0.106 0.263 0.196',C='0.31 0.38 0.34',L='0.55 0.6 0.57';
 let c='';
 const fill=(col,x,y,w,h)=>{c+=`${col} rg ${x} ${y} ${w} ${h} re f\n`};
 const rect=(x,y,w,h,col,lw)=>{c+=`${lw} w ${col} RG ${x} ${y} ${w} ${h} re S\n`};
 const line=(x1,y1,x2,y2,col,lw)=>{c+=`${lw} w ${col} RG ${x1} ${y1} m ${x2} ${y2} l S\n`};
 const diamond=(x,y,r,col)=>{c+=`${col} rg ${x-r} ${y} m ${x} ${y+r} l ${x+r} ${y} l ${x} ${y-r} l f\n`};
 const txt=(x,y,s,sz,f,col,tc)=>{c+=`BT /${f} ${sz} Tf ${col} rg ${tc||0} Tc ${x.toFixed(2)} ${y} Td (${enc(s)}) Tj ET\n`};
 const mid=(y,s,sz,f,col,tc)=>txt((W-mw(s,sz,f,tc))/2,y,s,sz,f,col,tc);
 const wrap=(s,sz,f,max)=>{const out=[];let ln='';for(const w of String(s).split(/\s+/)){const tt=ln?ln+' '+w:w;if(mw(tt,sz,f)>max&&ln){out.push(ln);ln=w}else ln=tt}if(ln)out.push(ln);return out};
 const cen=(cx,y,s,sz,f,col,tc)=>txt(cx-mw(s,sz,f,tc)/2,y,s,sz,f,col,tc);
 const LR=LG?LG.w/LG.h:0.755,CX=W/2,MW=W-190;
 fill('0.992 0.99 0.984',0,0,W,H);
 rect(28,28,W-56,H-56,G,0.8);
 /* cabeçalho: logótipo e título */
 if(LG){const lh=84,lw=lh*LR;c+=`q ${lw.toFixed(1)} 0 0 ${lh} ${((W-lw)/2).toFixed(1)} ${H-44-lh} cm /Im1 Do Q\n`}
 else cen(CX,H-90,'LERMO Recursos',22,'F2',V);
 cen(CX,424,t('fm.cert.title'),24,'F2',V,2);
 line(CX-40,408,CX+40,408,G,1);
 /* texto: Certifica-se que … concluiu com aproveitamento o programa … com a duração de … promovido por … */
 cen(CX,380,t('fm.cert.l1'),13,'F1',C);
 const nm=nomeC||'—';let nsz=32;while(nsz>18&&mw(nm,nsz,'F4')>MW)nsz-=2;
 cen(CX,342,nm,nsz,'F4',V);
 cen(CX,312,t('fm.cert.l2'),13,'F1',C);
 let psz=18,pl=wrap(nome(p),psz,'F2',MW);while(pl.length>2&&psz>14){psz-=2;pl=wrap(nome(p),psz,'F2',MW)}
 let y=288;pl.forEach(l=>{cen(CX,y,l,psz,'F2',V);y-=psz+5});
 y-=3;
 wrap(t('fm.cert.l3',{h:p.horas,e:p.ent}),13,'F1',MW).forEach(l=>{cen(CX,y,l,13,'F1',C);y-=18});
 cen(CX,y-4,`${fmtD(p.ini)} – ${fmtD(p.fim)}`,12,'F2',C);
 /* rodapé: código e data | assinatura digital do Director Administrativo | QR */
 line(70,166,W-70,166,'0.86 0.86 0.82',0.5);
 txt(70,140,t('fm.cert.code').toUpperCase(),7.5,'F2',L,0.8);
 txt(70,125,i.cert.codigo,11,'F2',V);
 txt(70,104,t('fm.cert.date').toUpperCase(),7.5,'F2',L,0.8);
 txt(70,89,fmtD(i.cert.data),11,'F2',V);
 {const sg=sigDe(i.cert),OX=CX-85;
  SIGP.forEach(st=>{let q=`1.3 w 1 J 1 j ${V} RG ${(OX+st[0][0]).toFixed(1)} ${(116+st[0][1]).toFixed(1)} m `;
   st.slice(1).forEach(b=>{q+=b.map((v,k)=>(k%2?116+v:OX+v).toFixed(1)).join(' ')+' c '});c+=q+'S\n'});
  line(OX,110,OX+170,110,L,0.6);
  let ssz=11;while(ssz>8&&mw(sg.nome,ssz,'F2')>230)ssz--;
  cen(CX,96,sg.nome,ssz,'F2',V);cen(CX,83,sg.cargo,9,'F1',C);
  cen(CX,70,t('fm.cert.dsig2')+' · '+sg.id,7,'F1',L)}
 {const QS=72,QX=W-70-QS;c+=qrPdf(verUrl(i.cert.codigo),QX,78,QS);
  cen(QX+QS/2,66,t('fm.cert.vf'),7.5,'F2',V)}
 cen(CX,44,t('fm.cert.foot'),8,'F1',L);
 /* ficheiro PDF */
 const bin=b64=>atob(b64);
 const imgs=LG?[bin(LG.rgb),bin(LG.alpha)]:[];
 const objs=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R /F4 7 0 R /F5 8 0 R >>${LG?' /XObject << /Im1 10 0 R >> /ExtGState << /GS1 << /ca 0.04 >> >>':''} >> /Contents 9 0 R >>`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>',
  `<< /Length ${c.length} >>\nstream\n${c}endstream`];
 if(LG){
  objs.push(`<< /Type /XObject /Subtype /Image /Width ${LG.w} /Height ${LG.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask 11 0 R /Length ${imgs[0].length} >>\nstream\n${imgs[0]}\nendstream`);
  objs.push(`<< /Type /XObject /Subtype /Image /Width ${LG.w} /Height ${LG.h} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${imgs[1].length} >>\nstream\n${imgs[1]}\nendstream`)}
 const info=objs.length+1;objs.push(`<< /Title (${enc(t('fm.cert.title')+' - '+nome(p))}) /Producer (LERMO Recursos) >>`);
 let out='%PDF-1.4\n',off=[];
 objs.forEach((o,k)=>{off.push(out.length);out+=`${k+1} 0 obj\n${o}\nendobj\n`});
 const xr=out.length;
 out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objs.length+1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xr}\n%%EOF`;
 const u=new Uint8Array(out.length);for(let k=0;k<out.length;k++)u[k]=out.charCodeAt(k)&255;
 return new Blob([u],{type:'application/pdf'});
}
Actions['fm-cert-dl']=(b,id)=>{
 closeFm();
 const p=progDe(id),i=insDe(id);if(!p||!i||!i.cert)return;
 try{
  let n='';try{n=(Session.get()||{}).nome_completo||''}catch(_){}
  const blob=certPdf(p,i,n),u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='certificado-'+norm(nome(p)).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.pdf';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast(t('fm.cert.dlok'));
 }catch(_){toast(t('fm.cert.dlfail'))}
};

/* ---------- filtros ---------- */
document.addEventListener('input',e=>{
 if(e.target.id==='fmFm'){$('#fmMc').textContent=e.target.value.length+'/500'}
 if(e.target.id==='fmQ'){FM.q=e.target.value;clearTimeout(FM.tm);FM.tm=setTimeout(()=>{renderRes();updFiltros()},120)}
});
document.addEventListener('change',e=>{
 if(e.target.id==='fmFp'){fillRegF('');return}
 const el=e.target,k=el.dataset&&el.dataset.f;if(!k||!el.closest('#fmF'))return;
 FM[k]=el.type==='checkbox'?el.checked:el.value;if(k==='pais'){FM.loc='';fillReg()}renderRes();updFiltros();
});
Actions['fm-est']=(b,v)=>{FM.est=v||'';renderRes();updFiltros()};
Actions['fm-clear']=()=>{Object.assign(FM,{q:'',pais:'',loc:'',mod:'',est:'',sort:'new',abertas:true});
 const f=$('#fmF');if(f){f.reset();$('#fmQ').value='';$('#fmPais').value='';$('#fmMod').value='';fillReg();$('#fmSort').value='new';$('#fmAb').checked=true}renderRes();updFiltros();if(f)$('#fmQ').focus()};
Actions['fm-tog']=b=>{const on=!$('#fmF').classList.contains('open');$('#fmF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
/* auxiliares do formulário (país, região, indicativo) partilhados com js/candidato-empreendedorismo.js */
window.LRM_FRM={loadPaises,paisesOrd,regs,splitTel,dialDe,telInicial,flagH,ccHtml,fillRegF,opts};
})();
