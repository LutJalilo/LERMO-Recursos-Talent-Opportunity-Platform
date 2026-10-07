'use strict';
/* Área Empreendedorismo: programas de empreendedorismo, inscrição e mentoria.
   Tabelas projetos_empreendedorismo, inscricoes_projetos e mentorias_projetos (o painel já as referencia em js/dashboard-candidato.js).
   Tabelas criadas/completadas em lermo_database_v5_6.sql (migração v5.2 a v5.6): programas, inscrições (com os dados do formulário) e mentorias.
   Depende também de js/candidato-formacao.js (window.LRM_FRM: país, região e indicativo do formulário de inscrição).
   Depende de dashboard-candidato.js: MOCK/api, wait, norm, t, esc, crumbs, fmtD, paisN, Views, Actions, Modal, toast, invalidate, $, lang, D. */
(()=>{
const PG=4;
const F=window.LRM_FRM;
Object.assign(D.pt,{'est.em_curso':'Em curso','est.concluido':'Concluído',
 'em.sub':'Programas de incubação, aceleração e mentoria para quem tem uma ideia ou um negócio em fase inicial.','em.search':'Pesquisar por nome, entidade ou país','em.search.a':'Pesquisar programas de empreendedorismo',
 'em.toggle':'Filtros','em.pais':'País','em.pais.all':'Todos','em.sort':'Ordenar','em.sort.new':'Mais recentes','em.sort.dl':'Prazo mais próximo','em.open':'Só abertos','em.clear':'Limpar filtros',
 'em.count':'{n} programas','em.count.1':'1 programa','em.empty':'Ainda não há programas de empreendedorismo publicados.','em.none':'Nenhum programa corresponde aos filtros.','em.more':'Mostrar mais','em.vd':'Ver detalhe',
 'em.back':'Voltar ao empreendedorismo','em.nf':'Programa não encontrado','em.nf.p':'O programa pedido não existe ou já não está disponível.',
 'em.est':'Estado da inscrição','em.est.all':'Todos','em.est.ins':'Inscritos','em.est.disp':'Disponíveis',
 'em.full':'Esgotado','em.canreg':'Inscrições abertas','em.entity':'Entidade','em.loc':'Local','em.dur':'Período','em.slots':'Vagas','em.slots.v':'{n} de {t} disponíveis','em.prazo':'Prazo de inscrição','em.mentoria':'Mentoria',
 'em.desc':'Descrição','em.req':'Requisitos','em.go':'Inscrição','em.cta.h':'Vagas limitadas','em.cta.p':'Inscreva-se antes do prazo para garantir a sua vaga. Os inscritos têm acompanhamento de mentoria no tema do programa.',
 'em.enr':'Inscrever-me','em.enrolled':'Inscrito em','em.cx':'Cancelar inscrição','em.closed.p':'As inscrições deste programa já encerraram.','em.full.p':'Já não há vagas neste programa.',
 'em.st.h':'Estado da inscrição','em.p.inscrito':'A sua inscrição está confirmada. Pode cancelá-la enquanto o programa não começar.','em.p.em_curso':'Programa em curso. Já não é possível cancelar a inscrição.','em.p.concluido':'Programa concluído.',
 'em.mn.h':'A sua mentoria','em.mn.tema':'Tema','em.mn.mentor':'Mentor','em.mn.pend':'Ainda sem mentor atribuído.',
 'em.m.title':'Inscrição no programa','em.m.prog':'Programa','em.m.p':'Ao inscrever-se, passa a ter mentoria no tema «{t}» durante o programa.',
 'em.m.ack':'Confirmo que posso participar nas datas indicadas e que os dados do meu perfil estão actualizados.','em.m.ack.err':'Confirme para concluir a inscrição.',
 'em.m.send':'Confirmar inscrição','em.m.sending':'A inscrever…','em.m.cancel':'Cancelar','em.m.ok':'Inscrição realizada com sucesso.','em.m.dup':'Já está inscrito neste programa.','em.m.closed':'As inscrições deste programa já encerraram.','em.m.full':'Já não há vagas neste programa.','em.m.fail':'Não foi possível concluir a inscrição. Tente novamente.',
 'em.x.title':'Cancelar inscrição','em.x.p':'Tem a certeza de que pretende cancelar a sua inscrição em {p}? Pode inscrever-se de novo enquanto houver vagas e o prazo estiver aberto.','em.x.keep':'Manter inscrição','em.x.ok':'Inscrição cancelada.','em.x.lock':'O programa já começou: não é possível cancelar.','em.x.fail':'Não foi possível cancelar a inscrição. Tente novamente.'});
Object.assign(D.en,{'est.em_curso':'In progress','est.concluido':'Completed',
 'em.sub':'Incubation, acceleration and mentoring programmes for people with an idea or an early-stage business.','em.search':'Search by name, organisation or country','em.search.a':'Search entrepreneurship programmes',
 'em.toggle':'Filters','em.pais':'Country','em.pais.all':'All','em.sort':'Sort by','em.sort.new':'Newest','em.sort.dl':'Closest deadline','em.open':'Open only','em.clear':'Clear filters',
 'em.count':'{n} programmes','em.count.1':'1 programme','em.empty':'No entrepreneurship programmes have been published yet.','em.none':'No programme matches the filters.','em.more':'Show more','em.vd':'View details',
 'em.back':'Back to entrepreneurship','em.nf':'Programme not found','em.nf.p':'The requested programme does not exist or is no longer available.',
 'em.est':'Registration status','em.est.all':'All','em.est.ins':'Registered','em.est.disp':'Available',
 'em.full':'Full','em.canreg':'Registration open','em.entity':'Organisation','em.loc':'Location','em.dur':'Period','em.slots':'Places','em.slots.v':'{n} of {t} available','em.prazo':'Registration deadline','em.mentoria':'Mentoring',
 'em.desc':'Description','em.req':'Requirements','em.go':'Registration','em.cta.h':'Limited places','em.cta.p':'Register before the deadline to secure your place. Participants receive mentoring on the programme topic.',
 'em.enr':'Register','em.enrolled':'Registered on','em.cx':'Cancel registration','em.closed.p':'Registration for this programme is closed.','em.full.p':'There are no places left in this programme.',
 'em.st.h':'Registration status','em.p.inscrito':'Your registration is confirmed. You can cancel it until the programme starts.','em.p.em_curso':'Programme in progress. Registration can no longer be cancelled.','em.p.concluido':'Programme completed.',
 'em.mn.h':'Your mentoring','em.mn.tema':'Topic','em.mn.mentor':'Mentor','em.mn.pend':'No mentor assigned yet.',
 'em.m.title':'Programme registration','em.m.prog':'Programme','em.m.p':'By registering, you receive mentoring on «{t}» during the programme.',
 'em.m.ack':'I confirm that I can attend on the stated dates and that my profile details are up to date.','em.m.ack.err':'Please confirm to complete the registration.',
 'em.m.send':'Confirm registration','em.m.sending':'Registering…','em.m.cancel':'Cancel','em.m.ok':'Registration completed successfully.','em.m.dup':'You are already registered in this programme.','em.m.closed':'Registration for this programme is closed.','em.m.full':'There are no places left in this programme.','em.m.fail':'Could not complete the registration. Please try again.',
 'em.x.title':'Cancel registration','em.x.p':'Are you sure you want to cancel your registration in {p}? You can register again while places remain and the deadline is open.','em.x.keep':'Keep registration','em.x.ok':'Registration cancelled.','em.x.lock':'The programme has already started: it cannot be cancelled.','em.x.fail':'Could not cancel the registration. Please try again.'});
Object.assign(D.pt,{'em.menu':'Opções','em.mn.det':'Ver detalhe','em.mn.enr':'Inscrever-me','em.mn.closed':'Inscrições encerradas','em.mn.edit':'Editar inscrição','em.mn.cx':'Cancelar inscrição','em.mn.lock':'O programa já começou','em.mn.mine':'A minha mentoria','em.mn.nomen':'Disponível após a inscrição','em.mn.close':'Fechar',
 'em.loc.f':'Região','em.loc.all':'Todas','em.dados.h':'Os seus dados de inscrição',
 'em.f.sec':'Sobre o seu projecto','em.f.negocio':'Nome do negócio ou da ideia','em.f.negocio.h':'Opcional.','em.f.fase':'Fase do negócio','em.f.sector':'Sector de actividade','em.f.equipa':'Pessoas na equipa (incluindo você)','em.f.ideia':'Descreva a sua ideia ou negócio','em.f.mot':'O que espera da mentoria?','em.f.h':'Entre 20 e 500 caracteres.',
 'em.e.fase':'Seleccione a fase do negócio.','em.e.sector':'Seleccione o sector.','em.e.equipa':'Indique um número entre 1 e 99.','em.e.ideia':'Escreva pelo menos 20 caracteres.','em.e.mot':'Escreva pelo menos 20 caracteres.',
 'em.fase.ideia':'Apenas uma ideia','em.fase.validacao':'Ideia em validação','em.fase.operacao':'Negócio em funcionamento','em.fase.crescimento':'Negócio em crescimento',
 'em.sec.agri':'Agricultura e pecuária','em.sec.comercio':'Comércio','em.sec.servicos':'Serviços','em.sec.tecnologia':'Tecnologia','em.sec.industria':'Indústria e transformação','em.sec.turismo':'Turismo e restauração','em.sec.educacao':'Educação e formação','em.sec.outro':'Outro',
 'em.ed.title':'Editar inscrição','em.ed.save':'Guardar alterações','em.ed.saving':'A guardar…','em.ed.ok':'Inscrição actualizada.','em.ed.lock':'O programa já começou. Já não é possível editar a inscrição.'});
Object.assign(D.en,{'em.menu':'Options','em.mn.det':'View details','em.mn.enr':'Register','em.mn.closed':'Registration closed','em.mn.edit':'Edit registration','em.mn.cx':'Cancel registration','em.mn.lock':'The programme has already started','em.mn.mine':'My mentoring','em.mn.nomen':'Available after registration','em.mn.close':'Close',
 'em.loc.f':'Region','em.loc.all':'All','em.dados.h':'Your registration details',
 'em.f.sec':'About your project','em.f.negocio':'Business or idea name','em.f.negocio.h':'Optional.','em.f.fase':'Business stage','em.f.sector':'Business sector','em.f.equipa':'People on the team (including you)','em.f.ideia':'Describe your idea or business','em.f.mot':'What do you expect from the mentoring?','em.f.h':'Between 20 and 500 characters.',
 'em.e.fase':'Select the business stage.','em.e.sector':'Select the sector.','em.e.equipa':'Enter a number between 1 and 99.','em.e.ideia':'Write at least 20 characters.','em.e.mot':'Write at least 20 characters.',
 'em.fase.ideia':'Just an idea','em.fase.validacao':'Idea being validated','em.fase.operacao':'Business up and running','em.fase.crescimento':'Growing business',
 'em.sec.agri':'Farming and livestock','em.sec.comercio':'Trade','em.sec.servicos':'Services','em.sec.tecnologia':'Technology','em.sec.industria':'Industry and processing','em.sec.turismo':'Tourism and food service','em.sec.educacao':'Education and training','em.sec.outro':'Other',
 'em.ed.title':'Edit registration','em.ed.save':'Save changes','em.ed.saving':'Saving…','em.ed.ok':'Registration updated.','em.ed.lock':'The programme has already started. The registration can no longer be edited.'});

/* dados de teste (programas de vários países). Em produção: GET /api/empreendedorismo/programas
   (projetos_empreendedorismo; tema = área da mentoria em mentorias_projetos) */
MOCK.empProjs=MOCK.empProjs||[
 {id:'p1',pais:'MZ',local:'Maputo-Cidade',nome:'Jovens Empreendedores 2026',en:'Young Entrepreneurs 2026',ent:'LERMO Empreende',ini:'2026-10-19',fim:'2026-12-18',lim:'2026-10-16',vagas:40,ocup:34,cri:'2026-09-01',tema:'Plano de negócio',temaEn:'Business plan',
  desc:'Programa de seis a oito semanas para transformar uma ideia num negócio viável: validação da ideia, plano de negócio e preparação para pedir financiamento, com mentoria individual.',descEn:'Six to eight-week programme to turn an idea into a viable business: idea validation, business plan and preparation to apply for funding, with one-to-one mentoring.',
  req:['Idade entre 18 e 35 anos','Ter uma ideia ou um negócio em fase inicial'],reqEn:['Aged 18 to 35','Have an idea or an early-stage business']},
 {id:'p2',pais:'MZ',local:'Nampula',nome:'Incubação de Negócios Rurais',en:'Rural Business Incubation',ent:'Programa de Desenvolvimento Rural',ini:'2026-11-09',fim:'2027-02-26',lim:'2026-11-02',vagas:20,ocup:12,cri:'2026-09-22',tema:'Gestão e comercialização',temaEn:'Management and marketing',
  desc:'Acompanhamento de pequenos negócios agrícolas e de transformação local: organização, preços, acesso a mercados e gestão financeira básica.',descEn:'Support for small agricultural and local processing businesses: organisation, pricing, market access and basic financial management.',
  req:['Negócio em zona rural','Residir na província de Nampula'],reqEn:['Business in a rural area','Live in Nampula province']},
 {id:'p3',pais:'PT',local:'Online',nome:'Aceleração de Startups Lusófonas',en:'Lusophone Startup Acceleration',ent:'Associação de Apoio a Startups',ini:'2026-11-02',fim:'2027-01-29',lim:'2026-10-26',vagas:25,ocup:25,cri:'2026-09-18',tema:'Estratégia e investimento',temaEn:'Strategy and investment',
  desc:'Programa online para startups com produto mínimo: estratégia de crescimento, métricas e preparação para investidores.',descEn:'Online programme for startups with a minimum product: growth strategy, metrics and investor readiness.',
  req:['Equipa com pelo menos dois fundadores','Protótipo ou produto mínimo'],reqEn:['Team of at least two founders','Prototype or minimum product']},
 {id:'p4',pais:'AO',local:'Luanda',nome:'Concurso Ideias de Negócio',en:'Business Ideas Competition',ent:'Entidade de Fomento Empresarial',ini:'2026-11-16',fim:'2026-12-18',lim:'2026-11-09',vagas:50,ocup:31,cri:'2026-09-25',tema:'Validação da ideia',temaEn:'Idea validation',
  desc:'Concurso com formação e mentoria para validar ideias de negócio e apresentá-las a um júri.',descEn:'Competition with training and mentoring to validate business ideas and pitch them to a jury.',
  req:['Maior de 18 anos','Ideia de negócio por validar'],reqEn:['Over 18 years old','Business idea to be validated']},
 {id:'p5',pais:'ZA',local:'Joanesburgo',nome:'Programa Empreendedoras',en:'Women Entrepreneurs Programme',ent:'Small Business Development Agency',ini:'2026-10-12',fim:'2026-12-04',lim:'2026-10-02',vagas:30,ocup:18,cri:'2026-08-28',tema:'Gestão financeira',temaEn:'Financial management',
  desc:'Formação e mentoria em gestão financeira para mulheres que lideram pequenos negócios.',descEn:'Financial management training and mentoring for women who run small businesses.',
  req:['Liderar um pequeno negócio'],reqEn:['Run a small business']},
 {id:'p6',pais:'MZ',local:'Zambézia',nome:'Negócios Digitais para Jovens',en:'Digital Business for Young People',ent:'Hub de Inovação da Zambézia',ini:'2026-09-14',fim:'2026-11-27',lim:'2026-09-11',vagas:30,ocup:30,cri:'2026-08-20',tema:'Marketing e vendas online',temaEn:'Online marketing and sales',
  desc:'Como começar a vender online: presença nas redes sociais, atendimento ao cliente, pagamentos móveis e primeiras campanhas, com mentoria individual.',descEn:'How to start selling online: social media presence, customer service, mobile payments and first campaigns, with one-to-one mentoring.',
  req:['Idade entre 18 e 35 anos','Telemóvel com internet'],reqEn:['Aged 18 to 35','Phone with internet']},
 {id:'p7',pais:'MZ',local:'Maputo-Cidade',nome:'Laboratório de Ideias 2026',en:'Ideas Lab 2026',ent:'LERMO Empreende',ini:'2026-06-08',fim:'2026-08-28',lim:'2026-06-05',vagas:35,ocup:35,cri:'2026-05-10',tema:'Validação da ideia',temaEn:'Idea validation',
  desc:'Doze semanas para testar uma ideia junto de clientes reais, ajustar a proposta de valor e apresentar o resultado a um painel de mentores.',descEn:'Twelve weeks to test an idea with real customers, refine the value proposition and present the result to a panel of mentors.',
  req:['Ter uma ideia de negócio'],reqEn:['Have a business idea']}
];
/* inscricoes_projetos do candidato (+ mentorias_projetos: mentor atribuído, quando existir); estado inscrito | em_curso | concluido; cancelar = apagar a inscrição */
MOCK.empIns=MOCK.empIns||[{proj_id:'p1',estado:'inscrito',data:'2026-09-28',mentor:null},{proj_id:'p6',estado:'em_curso',data:'2026-09-02',mentor:'Carlos Mussa'},{proj_id:'p7',estado:'concluido',data:'2026-05-28',mentor:'Helena Cossa'}];

const EM={q:'',pais:'',loc:'',est:'',sort:'new',abertas:true,n:PG,list:[],det:null,cur:null,edit:false,acc:null,tm:0};
const progDe=id=>MOCK.empProjs.find(x=>x.id===id);
const insDe=id=>MOCK.empIns.find(x=>x.proj_id===id)||null;
const vagasRest=p=>Math.max(0,p.vagas-p.ocup);
const aberta=p=>new Date(p.lim+'T23:59:59')>=new Date()&&vagasRest(p)>0;
const nome=p=>lang==='en'&&p.en?p.en:p.nome;
const ld=(p,f)=>lang==='en'&&p[f+'En']?p[f+'En']:p[f];
const hoje=()=>new Date().toISOString().slice(0,10);
const go=id=>{const h='#/empreendedorismo/'+id;if(location.hash===h)dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=h};
const refresh=()=>dispatchEvent(new HashChangeEvent('hashchange'));
const tom=e=>({concluido:'ok',em_curso:'in'}[e]||'in');

/* resumo do Dashboard (cartão Empreendedorismo e pesquisa): MOCK.projetos = inscrições do candidato */
function sync(){
 MOCK.projetos=MOCK.empIns.map(i=>{const p=progDe(i.proj_id);return{id:p.id,titulo:p.nome,tituloEn:p.en,estado:i.estado,mentoria:p.tema,mentoriaEn:p.temaEn}});
 invalidate();
}
sync();
api.empProjs=()=>wait(MOCK.empProjs.map(p=>({...p,ins:insDe(p.id)})),200);                                  /* GET /api/empreendedorismo/programas */
api.empProj=id=>wait((p=>p?{...p,ins:insDe(p.id)}:null)(progDe(id)),200);                                    /* GET /api/empreendedorismo/programas/{id} */
api.empInscrever=(id,dados)=>new Promise((ok,no)=>setTimeout(()=>{                                          /* POST /api/empreendedorismo/inscricoes (inscricoes_projetos + dados do formulário) */
 const p=progDe(id);
 if(!p)return no(new Error('nf'));if(insDe(id))return no(new Error('dup'));
 if(new Date(p.lim+'T23:59:59')<new Date())return no(new Error('closed'));if(vagasRest(p)<=0)return no(new Error('full'));
 MOCK.empIns.unshift({proj_id:id,estado:'inscrito',data:hoje(),mentor:null,dados:dados||null});p.ocup++;sync();ok()},600));
api.empEditar=(id,dados)=>new Promise((ok,no)=>setTimeout(()=>{                                              /* PUT /api/empreendedorismo/inscricoes/{projeto_id}: só com estado 'inscrito' */
 const i=insDe(id);if(!i)return no(new Error('nf'));
 if(i.estado!=='inscrito')return no(new Error('lock'));
 i.dados=dados;sync();ok(i)},500));
api.empCancelar=id=>new Promise((ok,no)=>setTimeout(()=>{                                                    /* DELETE /api/empreendedorismo/inscricoes/{id}: só com estado 'inscrito' */
 const i=MOCK.empIns.findIndex(x=>x.proj_id===id);
 if(i<0)return no(new Error('nf'));if(MOCK.empIns[i].estado!=='inscrito')return no(new Error('lock'));
 MOCK.empIns.splice(i,1);const p=progDe(id);if(p)p.ocup=Math.max(0,p.ocup-1);sync();ok()},500));

/* ---------- lista ---------- */
function prazo(p){
 if(p.ins)return null;
 const ms=new Date(p.lim+'T23:59:59')-new Date();
 if(ms<0)return[t('op.closed'),'no'];if(vagasRest(p)<=0)return[t('em.full'),'no'];
 const d=Math.ceil(ms/864e5);
 if(d<=1)return[t('op.dl.today'),'warn'];if(d<=8)return[t(d-1===1?'op.dl.day':'op.dl.days',{n:d-1}),'warn'];return[t('op.dl.until',{d:fmtD(p.lim)}),''];
}
function filtrar(est=EM.est){
 const q=norm(EM.q.trim());
 const r=EM.list.filter(p=>(!EM.pais||p.pais===EM.pais)&&(!EM.loc||p.local===EM.loc)&&(!EM.abertas||aberta(p)||p.ins)&&(est!=='ins'||p.ins)&&(est!=='disp'||(!p.ins&&aberta(p)))&&(!q||norm([p.nome,p.en||'',p.ent,paisN(p.pais),p.local].join(' ')).includes(q)));
 return r.sort(EM.sort==='dl'?(a,b)=>a.lim.localeCompare(b.lim):(a,b)=>b.cri.localeCompare(a.cri));
}
function sinal(p){
 if(p.ins)return`<span class="tag ${tom(p.ins.estado)}"><i class="fas fa-check" aria-hidden="true"></i> ${t('est.'+p.ins.estado)}</span>`;
 return aberta(p)?`<span class="tag">${t('em.canreg')}</span>`:'';
}
function menuHtml(p){
 const i=p.ins,ab=aberta(p),pode=i&&i.estado==='inscrito';
 const it=(a,ic,k,o={})=>`<button class="fx-mi${o.d?' d':''}" type="button" role="menuitem" data-a="${a}:${esc(p.id)}"${o.off?' disabled':''}><i class="fas ${ic}" aria-hidden="true"></i><span>${t(k)}${o.sub?`<small>${t(o.sub)}</small>`:''}</span></button>`;
 const items=[it('em-ver','fa-eye','em.mn.det')];
 if(!i)items.unshift(it('em-enr','fa-user-plus','em.mn.enr',{off:!ab,sub:ab?'':'em.mn.closed'}));
 items.push(it('em-mn','fa-handshake-angle','em.mn.mine',{off:!i,sub:i?'':'em.mn.nomen'}));
 if(i){items.push(it('em-edit','fa-pen','em.mn.edit',{off:!pode,sub:pode?'':'em.mn.lock'}));items.push(it('em-cx','fa-rotate-left','em.mn.cx',{d:1,off:!pode,sub:pode?'':'em.mn.lock'}))}
 return `<div class="fx-dd"><button class="ib sm fx-kb" type="button" data-a="em-menu:${esc(p.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="${t('em.menu')}: ${esc(nome(p))}"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button><div class="fx-menu" role="menu">${items.join('')}</div></div>`;
}
const closeEm=focus=>document.querySelectorAll('.fx-menu.on').forEach(m=>{m.classList.remove('on');const k=m.previousElementSibling;k.setAttribute('aria-expanded','false');const c=m.closest('.vc');c&&c.classList.remove('fx-open');if(focus)k.focus()});
Actions['em-menu']=b=>{const m=b.nextElementSibling,on=!m.classList.contains('on');closeEm();
 if(on){m.classList.add('on');b.setAttribute('aria-expanded','true');const c=b.closest('.vc');c&&c.classList.add('fx-open');const f=m.querySelector('button:not([disabled])');f&&f.focus()}};
Actions['em-ver']=(b,id)=>{closeEm();go(id)};
function card(p){
 const pz=prazo(p);
 return`<article class="vc${p.ins?' req':''}"><div class="vh"><span class="ic"><i class="fas fa-lightbulb" aria-hidden="true"></i></span><div class="rb"><h2 class="vt"><a href="#/empreendedorismo/${esc(p.id)}">${esc(nome(p))}</a></h2><div class="rs">${esc(p.ent)}</div></div>${menuHtml(p)}</div>
 <div class="chips"><span class="tag in">${esc(paisN(p.pais))}</span>${sinal(p)}</div>
 <ul class="meta"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(p.local)}</li>${pz?`<li class="${pz[1]}"><i class="fas fa-clock" aria-hidden="true"></i>${esc(pz[0])}</li>`:`<li><i class="fas fa-bars-progress" aria-hidden="true"></i>${esc(t('em.p.'+p.ins.estado).split('.')[0])}</li>`}<li><i class="fas fa-calendar-days" aria-hidden="true"></i>${fmtD(p.ini)} – ${fmtD(p.fim)}</li></ul>
 <a class="btn btn-l" href="#/empreendedorismo/${esc(p.id)}">${t('em.vd')}</a></article>`;
}
const nFiltros=()=>(EM.pais?1:0)+(EM.loc?1:0)+(EM.abertas?0:1)+(EM.sort!=='new'?1:0);
function updFiltros(){const n=nFiltros(),tg=$('#emTog'),cl=$('#emClr');if(!tg)return;tg.querySelector('b').textContent=n?n:'';tg.querySelector('b').hidden=!n;cl.disabled=!n&&!EM.q&&!EM.est}
function updSeg(){document.querySelectorAll('#emSeg button').forEach(b=>{const v=b.dataset.a.split(':')[1];b.setAttribute('aria-pressed',String(EM.est===v));b.querySelector('b').textContent=filtrar(v).length})}
const opts=(arr,sel,lbl)=>arr.map(x=>`<option value="${esc(x)}"${x===sel?' selected':''}>${esc(lbl(x))}</option>`).join('');
function fillLoc(){
 const x=$('#emLoc');if(!x)return;
 x.disabled=!EM.pais;
 x.innerHTML=`<option value="">${t(EM.pais?'em.loc.all':'fm.pick')}</option>`+(EM.pais?opts(F.regs(EM.pais),EM.loc,provL):'');
}
function renderRes(){
 const box=$('#emRes');if(!box)return;updSeg();
 const r=filtrar(),c=$('#emCount');
 c.textContent=t(r.length===1?'em.count.1':'em.count',{n:r.length});
 if(!EM.list.length){box.innerHTML=`<div class="state card"><i class="fas fa-lightbulb" aria-hidden="true"></i>${t('em.empty')}</div>`;c.textContent='';return}
 if(!r.length){box.innerHTML=`<div class="state card"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>${t('em.none')}</p><br><button class="btn btn-l" type="button" data-a="em-clear">${t('em.clear')}</button></div>`;return}
 const show=r.slice(0,EM.n);
 box.innerHTML=`<div class="vgrid">${show.map(card).join('')}</div>`+(r.length>show.length?`<div class="more"><button class="btn btn-l" type="button" data-a="em-more">${t('em.more')} (${r.length-show.length})</button></div>`:'');
}
async function lista(){
 await F.loadPaises();EM.list=await api.empProjs();EM.det=null;
 return{title:t('n.proj'),after:()=>{fillLoc();renderRes();updFiltros()},html:
  crumbs([[t('n.dash'),'#/dashboard'],[t('n.proj')]])+
  `<div class="ph"><div><h1>${t('n.proj')}</h1><p class="rs wrap">${t('em.sub')}</p></div><p class="rs" id="emCount" aria-live="polite"></p></div>
  <form class="flt${nFiltros()?' open':''}" id="emF" role="search" aria-label="${t('n.proj')}">
   <div class="fld fq"><label class="sr" for="emQ">${t('em.search.a')}</label><div class="inw"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input id="emQ" type="search" value="${esc(EM.q)}" placeholder="${t('em.search')}" autocomplete="off" maxlength="80"></div></div>
   <button class="btn btn-l" id="emTog" type="button" data-a="em-tog" aria-expanded="${nFiltros()?'true':'false'}" aria-controls="emSec"><i class="fas fa-sliders" aria-hidden="true"></i> ${t('em.toggle')} <b class="bd" hidden></b></button>
   <div class="fsec" id="emSec">
    <div class="fld"><label for="emPais">${t('em.pais')}</label><select id="emPais" data-f="pais"><option value="">${t('em.pais.all')}</option>${opts(F.paisesOrd(),EM.pais,paisN)}</select></div>
    <div class="fld"><label for="emLoc">${t('em.loc.f')}</label><select id="emLoc" data-f="loc"></select></div>
    <div class="fld"><label for="emSort">${t('em.sort')}</label><select id="emSort" data-f="sort"><option value="new"${EM.sort==='new'?' selected':''}>${t('em.sort.new')}</option><option value="dl"${EM.sort==='dl'?' selected':''}>${t('em.sort.dl')}</option></select></div>
    <label class="chk"><input type="checkbox" id="emAb" data-f="abertas"${EM.abertas?' checked':''}> ${t('em.open')}</label>
    <button class="btn btn-l" id="emClr" type="button" data-a="em-clear">${t('em.clear')}</button>
   </div></form>
  <div class="fx-seg" id="emSeg" role="group" aria-label="${t('em.est')}">${[['','em.est.all'],['ins','em.est.ins'],['disp','em.est.disp']].map(([v,k])=>`<button type="button" data-a="em-est:${v}" aria-pressed="${EM.est===v}">${t(k)} <b></b></button>`).join('')}</div>
  <div id="emRes" aria-live="polite"></div>`};
}

/* ---------- detalhe ---------- */
function passos(i){
 const idx={inscrito:0,em_curso:1,concluido:2}[i.estado]??0;
 const lab=[t('est.inscrito'),t('est.em_curso'),t('est.concluido')];
 return`<ol class="fx-steps" aria-label="${t('em.st.h')}">${lab.map((x,k)=>`<li class="${k<idx?'done':k===idx?'cur'+(k===2?' ok':''):''}"${k===idx?' aria-current="step"':''}><span class="dot" aria-hidden="true"></span><span>${x}</span></li>`).join('')}</ol>`;
}
function barra(p){
 const a=new Date(p.cri+'T00:00:00'),b=new Date(p.lim+'T23:59:59'),v=Math.max(0,Math.min(100,Math.round((Date.now()-a)/(b-a)*100)));
 return isNaN(v)?'':`<div class="fx-bar" role="img" aria-label="${esc(prazo(p)[0])}"><span><i style="width:${v}%"></i></span></div>`;
}
function dadosBox(i){
 const d=i.dados;if(!d)return'';
 const row=(k,v)=>v?`<p class="rs wrap">${t(k)}: <strong>${esc(v)}</strong></p>`:'';
 return`<div class="fx-box"><h3>${t('em.dados.h')}</h3>${row('em.f.negocio',d.negocio)}${row('em.f.fase',d.fase&&t('em.fase.'+d.fase))}${row('em.f.sector',d.sector&&t('em.sec.'+d.sector))}${row('em.f.equipa',d.equipa)}</div>`;
}
function detalheHtml(p){
 const pz=prazo(p),ab=aberta(p),i=p.ins;
 const fact=(ic,k,v)=>v?`<div><dt><i class="fas ${ic}" aria-hidden="true"></i> ${t(k)}</dt><dd>${esc(v)}</dd></div>`:'';
 const rq=ld(p,'req');
 const cta=i
  ?`<div class="fx-top"><h2 class="fx-h">${t('em.st.h')}</h2></div>${passos(i)}<span class="tag ${tom(i.estado)}">${t('est.'+i.estado)}</span>
   <dl class="facts" style="margin:.2rem 0;width:100%"><div><dt>${t('em.enrolled')}</dt><dd>${fmtD(i.data)}</dd></div></dl>
   <div class="fx-box"><h3>${t('em.mn.h')}</h3><p class="rs wrap">${t('em.mn.tema')}: <strong>${esc(ld(p,'tema'))}</strong></p><p class="rs wrap">${i.mentor?`${t('em.mn.mentor')}: <strong>${esc(i.mentor)}</strong>`:t('em.mn.pend')}</p></div>
   ${dadosBox(i)}
   <p class="rs wrap">${t('em.p.'+i.estado)}</p>
   ${i.estado==='inscrito'?`<button class="btn btn-l" type="button" data-a="em-edit:${esc(p.id)}"><i class="fas fa-pen" aria-hidden="true"></i> ${t('em.mn.edit')}</button><button class="btn btn-d" type="button" data-a="em-cx:${esc(p.id)}"><i class="fas fa-rotate-left" aria-hidden="true"></i> ${t('em.cx')}</button>`:''}`
  :ab?`<div class="fx-top"><h2 class="fx-h">${t('em.go')}</h2></div><span class="tag">${t('em.canreg')}</span><div class="apx"><strong>${t('em.cta.h')}</strong><p>${t('em.slots.v',{n:vagasRest(p),t:p.vagas})}. ${t('em.cta.p')}</p></div>${barra(p)}<button class="btn btn-g" type="button" data-a="em-enr:${esc(p.id)}"><i class="fas fa-user-plus" aria-hidden="true"></i> ${t('em.enr')}</button>`
  :`<div class="fx-top"><h2 class="fx-h">${t('em.go')}</h2></div><p class="rs wrap">${t(vagasRest(p)<=0&&new Date(p.lim+'T23:59:59')>=new Date()?'em.full.p':'em.closed.p')}</p><button class="btn btn-g" type="button" disabled>${t('em.enr')}</button>`;
 return crumbs([[t('n.dash'),'#/dashboard'],[t('n.proj'),'#/empreendedorismo'],[nome(p)]])+
 `<div class="vtop"><a class="btn btn-l" href="#/empreendedorismo"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('em.back')}</a><a class="btn btn-l" href="#/dashboard">${t('n.dash')}</a></div>
 <div class="det fxd"><article class="card"><header><h1>${esc(nome(p))}</h1><p class="rs wrap">${esc(p.ent)}</p>
  <div class="chips"><span class="tag in">${esc(paisN(p.pais))}</span>${pz?`<span class="tag ${pz[1]==='no'?'no':''}">${esc(pz[0])}</span>`:''}${i?`<span class="tag ${tom(i.estado)}">${t('est.'+i.estado)}</span>`:''}</div></header>
  <dl class="facts">${fact('fa-building-columns','em.entity',p.ent)}${fact('fa-location-dot','em.loc',`${paisN(p.pais)} · ${p.local}`)}${fact('fa-calendar-days','em.dur',`${fmtD(p.ini)} – ${fmtD(p.fim)}`)}${fact('fa-user-group','em.slots',t('em.slots.v',{n:vagasRest(p),t:p.vagas}))}${fact('fa-clock','em.prazo',fmtD(p.lim))}${fact('fa-handshake-angle','em.mentoria',ld(p,'tema'))}</dl>
  <h2>${t('em.desc')}</h2><p>${esc(ld(p,'desc'))}</p>
  ${rq&&rq.length?`<h2>${t('em.req')}</h2><ul class="reqs">${rq.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</article>
 <aside class="card cta" aria-label="${t('em.go')}">${cta}</aside></div>`;
}
async function detalhe(id){
 await F.loadPaises();
 const p=await api.empProj(id);EM.det=p;
 if(!p)return{title:t('n.proj'),html:crumbs([[t('n.dash'),'#/dashboard'],[t('n.proj'),'#/empreendedorismo'],[id]])+`<div class="state card"><i class="fas fa-circle-question" aria-hidden="true"></i><h1 style="font-size:1.2rem;color:var(--t)">${t('em.nf')}</h1><p>${t('em.nf.p')}</p><br><a class="btn btn-g" href="#/empreendedorismo"><i class="fas fa-arrow-left" aria-hidden="true"></i> ${t('em.back')}</a></div>`};
 return{title:nome(p),html:detalheHtml(p)};
}
Views.empreendedorismo=id=>id?detalhe(id):lista();
const progById=id=>EM.det&&EM.det.id===id?EM.det:EM.list.find(x=>x.id===id)||progDe(id)||null;

/* ---------- inscrição (formulário completo), edição, mentoria e cancelamento (modais) ---------- */
const EDU=['basico','secundario','tecnico','licenciatura','mestrado','outro'],SIT=['estudante','desempregado','empregado','empreendedor'],FASE=['ideia','validacao','operacao','crescimento'],SEC=['agri','comercio','servicos','tecnologia','industria','turismo','educacao','outro'];
/* inscrição nova (edit=false) ou edição da inscrição existente (edit=true): mesmo formulário.
   Os campos do país, região e telefone partilham os ids (fmFp, fmFr, fmFt, fmFi) e o seletor de indicativo do formulário da Formação. */
function emForm(id,edit){
 closeEm(true);
 const p=progDe(id),ins=insDe(id);if(!p)return;
 if(edit?(!ins||ins.estado!=='inscrito'):(ins||!aberta(p)))return;
 EM.cur=p;EM.edit=!!edit;
 let u={};try{u=Session.get()||{}}catch(_){}
 const d=edit&&ins.dados||{};
 const sp=F.splitTel(u.telefone);
 const accTel=sp?{dial:sp.dial,num:sp.num,iso:u.pais&&F.dialDe(u.pais)===sp.dial?u.pais:sp.iso}:null;
 const accPais=u.pais||(accTel&&accTel.iso)||'';
 const tel=accTel||F.telInicial(d.tel,d.iso);
 const pais=accPais||d.pais||tel.iso;
 EM.acc={n:(u.nome_completo||d.nome||'').trim(),e:(u.email||d.email||'').trim(),t:accTel,p:accPais};
 const fld=(i,e,lbl,inner,err,hint)=>`<div class="fld"><label for="${i}">${lbl}</label>${inner}${hint||''}<p class="ferr" id="${e}" role="alert" hidden>${t(err)}</p></div>`;
 const ro=(lbl,v)=>`<div><dt>${lbl}</dt><dd>${esc(v)}</dd></div>`;
 const roF=(lbl,iso,txt)=>`<div><dt>${lbl}</dt><dd class="fm-rof">${F.flagH(iso)}<span class="fm-iso">${iso}</span> ${esc(txt)}</dd></div>`;
 const fmtT=a=>`${a.dial} ${a.num.replace(/(\d{2})(\d{3})(\d{3,})/,'$1 $2 $3')}`;
 const conta=[EM.acc.n?ro(t('fm.f.nome'),EM.acc.n):'',EM.acc.e?ro(t('fm.f.email'),EM.acc.e):'',accTel?roF(t('fm.f.tel'),accTel.iso,fmtT(accTel)):'',accPais?roF(t('fm.f.pais'),accPais,paisN(accPais)):''].join('');
 const sel=(L,v,pre)=>L.map(x=>`<option value="${x}"${x===v?' selected':''}>${t(pre+x)}</option>`).join('');
 const sx=`<option value="">${t('fm.f.sel')}</option>`;
 const mb=Modal.open({title:t(edit?'em.ed.title':'em.m.title'),body:`<form id="emS" novalidate>
  <p class="rs wrap" style="margin-bottom:.4rem"><strong>${t('em.m.prog')}:</strong> ${esc(nome(p))} · ${esc(p.ent)}</p>
  <ul class="meta" style="margin-bottom:1rem"><li><i class="fas fa-location-dot" aria-hidden="true"></i>${esc(p.local==='Online'?t('fm.online'):p.local+', '+paisN(p.pais))}</li><li><i class="fas fa-calendar-days" aria-hidden="true"></i>${fmtD(p.ini)} – ${fmtD(p.fim)}</li></ul>
  <p class="wrap" style="line-height:1.6;margin-bottom:1rem">${t('em.m.p',{t:esc(ld(p,'tema'))})}</p>
  ${conta?`<div class="fm-acc"><h3 class="fx-sec">${t('fm.f.conta')}</h3><dl class="facts fm-ro">${conta}</dl><p class="rs">${t('fm.f.conta.h')}</p></div>`:''}
  <div class="fm-g">
   ${EM.acc.n?'':fld('fmFn','fmEn',t('fm.f.nome'),`<input id="fmFn" type="text" autocomplete="name" maxlength="150" value="${esc(d.nome||'')}">`,'fm.e.nome')}
   ${EM.acc.e?'':fld('fmFe','fmEe',t('fm.f.email'),`<input id="fmFe" type="email" autocomplete="email" maxlength="150" value="${esc(d.email||'')}">`,'fm.e.email')}
   ${accTel?'':fld('fmFt','fmEt',t('fm.f.tel'),`<div class="fm-tel">${F.ccHtml(tel.iso)}<input id="fmFt" type="tel" autocomplete="tel-national" inputmode="tel" maxlength="16" placeholder="84 000 0000" value="${esc(tel.num)}"></div>`,'fm.e.tel')}
   ${accPais?`<input type="hidden" id="fmFp" value="${esc(accPais)}">`:fld('fmFp','fmEp',t('fm.f.pais'),`<select id="fmFp" autocomplete="country">${opts(F.paisesOrd(),pais,paisN)}</select>`,'fm.e.pais')}
   ${fld('fmFr','fmEr',t('fm.f.reg'),`<select id="fmFr"></select>`,'fm.e.reg')}
   ${fld('fmFd','fmEd',t('fm.f.edu'),`<select id="fmFd">${sx}${sel(EDU,d.edu,'fm.edu.')}</select>`,'fm.e.edu')}
   ${fld('fmFs','fmEs',t('fm.f.sit'),`<select id="fmFs">${sx}${sel(SIT,d.sit,'fm.sit.')}</select>`,'fm.e.sit')}
  </div>
  <h3 class="fx-sec">${t('em.f.sec')}</h3>
  <div class="fm-g">
   ${fld('emFg','emEg',t('em.f.negocio'),`<input id="emFg" type="text" maxlength="150" value="${esc(d.negocio||'')}">`,'em.f.negocio.h',`<div class="fh"><span>${t('em.f.negocio.h')}</span></div>`)}
   ${fld('emFf','emEf',t('em.f.fase'),`<select id="emFf">${sx}${sel(FASE,d.fase,'em.fase.')}</select>`,'em.e.fase')}
   ${fld('emFc','emEc',t('em.f.sector'),`<select id="emFc">${sx}${sel(SEC,d.sector,'em.sec.')}</select>`,'em.e.sector')}
   ${fld('emFq','emEq',t('em.f.equipa'),`<input id="emFq" type="number" inputmode="numeric" min="1" max="99" value="${esc(d.equipa||'')}">`,'em.e.equipa')}
  </div>
  ${fld('emFi','emEi',t('em.f.ideia'),`<textarea id="emFi" rows="4" maxlength="500">${esc(d.ideia||'')}</textarea>`,'em.e.ideia',`<div class="fh"><span>${t('em.f.h')}</span><span id="emCi">${(d.ideia||'').length}/500</span></div>`)}
  ${fld('emFm','emEm',t('em.f.mot'),`<textarea id="emFm" rows="4" maxlength="500">${esc(d.mot||'')}</textarea>`,'em.e.mot',`<div class="fh"><span>${t('em.f.h')}</span><span id="emCm">${(d.mot||'').length}/500</span></div>`)}
  ${edit?'':`<div class="fld"><label class="chk" for="emAck"><input type="checkbox" id="emAck" aria-describedby="emAckE"> ${t('em.m.ack')}</label><p class="ferr" id="emAckE" role="alert" hidden>${t('em.m.ack.err')}</p></div>`}
  <p class="ferr box" id="emFail" role="alert" hidden></p>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('em.m.cancel')}</button><button class="btn btn-g" id="emGo" type="submit"><i class="fas ${edit?'fa-floppy-disk':'fa-user-plus'}" aria-hidden="true"></i> ${t(edit?'em.ed.save':'em.m.send')}</button></div></form>`});
 mb.querySelector('.mod').style.width='min(680px,100%)';
 F.fillRegF(d.reg||'');
}
Actions['em-enr']=(b,id)=>emForm(id,false);
Actions['em-edit']=(b,id)=>emForm(id,true);
document.addEventListener('submit',async e=>{
 if(e.target.id==='emF'){e.preventDefault();return}
 if(e.target.id!=='emS')return;
 e.preventDefault();
 const p=EM.cur,acc=EM.acc,edit=EM.edit,btn=$('#emGo'),fail=$('#emFail');fail.hidden=true;
 const v=i=>{const el=$('#'+i);return el?el.value.trim():''};
 const num=acc.t?acc.t.num:v('fmFt').replace(/[\s().-]/g,'').replace(/^0+/,'');
 const hasReg=F.regs(v('fmFp')).length>0,eq=v('emFq');
 /* [campo, mensagem de erro, válido?] pela ordem em que aparecem no formulário */
 const chk=[];
 if(!acc.n)chk.push(['fmFn','fmEn',v('fmFn').length>=3]);
 if(!acc.e)chk.push(['fmFe','fmEe',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('fmFe'))]);
 if(!acc.t)chk.push(['fmFt','fmEt',/^\d{6,12}$/.test(num)]);
 if(!acc.p)chk.push(['fmFp','fmEp',!!v('fmFp')]);
 chk.push(['fmFr','fmEr',!hasReg||!!v('fmFr')],['fmFd','fmEd',!!v('fmFd')],['fmFs','fmEs',!!v('fmFs')],['emFf','emEf',!!v('emFf')],['emFc','emEc',!!v('emFc')],['emFq','emEq',/^\d{1,2}$/.test(eq)&&+eq>=1],['emFi','emEi',v('emFi').length>=20],['emFm','emEm',v('emFm').length>=20]);
 let first=null;
 chk.forEach(([i,er,ok])=>{const el=$('#'+i),m=$('#'+er);if(!el||!m)return;m.hidden=ok;ok?el.removeAttribute('aria-invalid'):el.setAttribute('aria-invalid','true');if(!ok&&!first)first=el});
 const ack=$('#emAck');
 if(ack){$('#emAckE').hidden=ack.checked;ack.checked?ack.removeAttribute('aria-invalid'):ack.setAttribute('aria-invalid','true')}
 if(first){first.focus();return}
 if(ack&&!ack.checked){ack.focus();return}
 const iso=acc.t?acc.t.iso:$('#fmFi').dataset.iso;
 const dados={nome:acc.n||v('fmFn'),email:acc.e||v('fmFe'),tel:F.dialDe(iso)+num,iso,pais:v('fmFp'),reg:v('fmFr'),edu:v('fmFd'),sit:v('fmFs'),negocio:v('emFg'),fase:v('emFf'),sector:v('emFc'),equipa:+eq,ideia:v('emFi'),mot:v('emFm')};
 const lab=()=>`<i class="fas ${edit?'fa-floppy-disk':'fa-user-plus'}" aria-hidden="true"></i> ${t(edit?'em.ed.save':'em.m.send')}`;
 btn.disabled=true;btn.innerHTML=`<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${t(edit?'em.ed.saving':'em.m.sending')}`;
 try{
  if(edit){await api.empEditar(p.id,dados);Modal.close();toast(t('em.ed.ok'));refresh()}
  else{await api.empInscrever(p.id,dados);Modal.close();toast(t('em.m.ok'));go(p.id)}
 }catch(x){fail.textContent=t(x.message==='lock'?'em.ed.lock':x.message==='dup'?'em.m.dup':x.message==='closed'?'em.m.closed':x.message==='full'?'em.m.full':'em.m.fail');fail.hidden=false;btn.disabled=false;btn.innerHTML=lab()}
});
Actions['em-mn']=(b,id)=>{
 closeEm(true);
 const p=progById(id),i=insDe(id);if(!p||!i)return;
 Modal.open({title:t('em.mn.h'),body:`<p class="rs wrap" style="margin-bottom:.6rem"><strong>${t('em.m.prog')}:</strong> ${esc(nome(p))} · ${esc(p.ent)}</p><div class="fx-box"><p class="rs wrap">${t('em.mn.tema')}: <strong>${esc(ld(p,'tema'))}</strong></p><p class="rs wrap">${i.mentor?`${t('em.mn.mentor')}: <strong>${esc(i.mentor)}</strong>`:t('em.mn.pend')}</p></div><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('em.mn.close')}</button></div>`});
};
Actions['em-cx']=(b,id)=>{
 closeEm(true);
 const p=progById(id);if(!p)return;const i=insDe(id);if(!i||i.estado!=='inscrito')return;
 Modal.open({title:t('em.x.title'),body:`<p class="wrap" style="line-height:1.6">${t('em.x.p',{p:'<strong>'+esc(nome(p))+'</strong>'})}</p><p class="ferr box" id="emXF" role="alert" hidden></p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('em.x.keep')}</button><button class="btn btn-d" type="button" data-a="em-cx-ok:${esc(id)}"><i class="fas fa-rotate-left" aria-hidden="true"></i> ${t('em.cx')}</button></div>`});
};
Actions['em-cx-ok']=async(b,id)=>{
 const f=$('#emXF');f.hidden=true;b.disabled=true;
 try{await api.empCancelar(id);Modal.close();toast(t('em.x.ok'));refresh()}
 catch(x){f.textContent=t(x.message==='lock'?'em.x.lock':'em.x.fail');f.hidden=false;b.disabled=false}
};

/* ---------- filtros ---------- */
document.addEventListener('input',e=>{
 if(e.target.id==='emFi'){$('#emCi').textContent=e.target.value.length+'/500'}
 if(e.target.id==='emFm'){$('#emCm').textContent=e.target.value.length+'/500'}
 if(e.target.id==='emQ'){EM.q=e.target.value;clearTimeout(EM.tm);EM.tm=setTimeout(()=>{EM.n=PG;renderRes();updFiltros()},120)}
});
document.addEventListener('change',e=>{
 const el=e.target,k=el.dataset&&el.dataset.f;if(!k||!el.closest('#emF'))return;
 EM[k]=el.type==='checkbox'?el.checked:el.value;if(k==='pais'){EM.loc='';fillLoc()}EM.n=PG;renderRes();updFiltros();
});
Actions['em-est']=(b,v)=>{EM.est=v||'';EM.n=PG;renderRes();updFiltros()};
Actions['em-more']=()=>{EM.n+=PG;renderRes()};
Actions['em-clear']=()=>{Object.assign(EM,{q:'',pais:'',loc:'',est:'',sort:'new',abertas:true,n:PG});
 const f=$('#emF');if(f){f.reset();$('#emQ').value='';$('#emPais').value='';fillLoc();$('#emSort').value='new';$('#emAb').checked=true}renderRes();updFiltros();if(f)$('#emQ').focus()};
Actions['em-tog']=b=>{const on=!$('#emF').classList.contains('open');$('#emF').classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
})();
