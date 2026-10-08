'use strict';
/* Plano e pagamentos da empresa (passo 1): plano actual, consumo, comparação de planos, pagar/mudar/renovar/cancelar, próximo pagamento e histórico.
   Depende de dashboard-empresa.js: MOCK, t, esc, crumbs, Views, Actions, Modal, toast, D, lang, Session, setPlan, parse, $.
   Tabelas SQL: planos_assinatura, assinaturas_empresas, vagas_mensais_consumidas, pagamentos, cronograma_pagamentos, metodos_pagamento, moedas.
   Regras (modo de teste, sem cobrança real):
   - «Mudar plano» (assistente): escolher plano e periodicidade, ver o impacto (o que ganha/perde, equipa e vagas) e continuar.
   - Subida de plano (ou passar a anual): paga-se agora e o novo período começa hoje.
   - Descida de plano: nada é cobrado agora; fica agendada (assinatura.agendada = assinaturas_empresas.plano_agendado_id) e começa no fim do período pago; pode ser cancelada.
   - Bloqueio: se a equipa tiver mais membros do que max_recrutadores do plano de destino (impacto_mudanca_plano, SQL v5.13).
   - Cancelar subscrição: activa até ao fim do período.
   - Se a subscrição terminar sem renovação, a conta passa para o plano Gratuito.
   - Dados de cartão NUNCA são recolhidos aqui: em produção o pagamento é feito no fornecedor (redirecionamento).
   Em produção: GET /api/empresa/assinatura, POST /api/empresa/pagamentos, PUT /api/empresa/assinatura/cancelar. O estado de teste fica no navegador. */
(()=>{
/* planos_assinatura (SQL v5.13): n=nome, m=preco_mensal, a=preco_anual (10 x mensal = 2 meses grátis), v=vagas_mensais, r=max_recrutadores,
   bd/sp/ra/mk = booleanos; fo/ev/fi/em = acesso a Formação, Eventos, Financiamento e Empreendedorismo (colunas acesso_* do SQL).
   Preços em MZN, a rever com validação de mercado; manter igual a INSERT INTO planos_assinatura. */
const PL=[{n:'gratuito',m:0,a:0,v:3,r:1,bd:0,sp:0,ra:0,mk:0,fo:0,ev:0,fi:0,em:0},
 {n:'basico',m:7500,a:75000,v:10,r:2,bd:0,sp:0,ra:0,mk:0,fo:1,ev:1,fi:0,em:0},
 {n:'premium',m:20000,a:200000,v:25,r:5,bd:1,sp:1,ra:1,mk:1,fo:1,ev:1,fi:1,em:1},
 {n:'enterprise',m:50000,a:500000,v:999,r:10,bd:1,sp:1,ra:1,mk:1,fo:1,ev:1,fi:1,em:1}];
/* metodos_pagamento (mesmos ids do SQL): [id, nome, tipo, prefixo do número, prefixos para a mensagem, operador, ícone] */
const MET=[[1,'M-Pesa','mov','8[45]','84/85','M-Pesa','fa-mobile-screen'],[2,'E-Mola','mov','8[67]','86/87','e-Mola','fa-mobile-screen'],[3,'mKesh','mov','8[23]','82/83','mKesh','fa-mobile-screen'],
 [4,'Visa','card','','','','fa-credit-card'],[5,'Mastercard','card','','','','fa-credit-card'],[6,'PayPal','ext','','','','fa-wallet'],[7,'Transferência Bancária','bank','','','','fa-building-columns']];
const MOEDA='MZN',TESTE=true;
const ICO={gratuito:'fa-seedling',basico:'fa-briefcase',premium:'fa-crown',enterprise:'fa-building'};
const plano=n=>PL.find(x=>x.n===n)||PL[0],idx=n=>PL.findIndex(x=>x.n===n);
const preco=(p,c)=>c==='anual'?p.a:p.m;
const metNome=m=>m[2]==='bank'?t('pn.m.bank'):m[1];
const loc=()=>lang==='en'?'en-GB':'pt-PT';
const hoje=()=>new Date().toISOString().slice(0,10);
const addD=(d,n)=>{const x=new Date(d+'T00:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const addM=(d,n)=>{const [y,m,dd]=d.split('-').map(Number),last=new Date(Date.UTC(y,m-1+n+1,0)).getUTCDate();return new Date(Date.UTC(y,m-1+n,Math.min(dd,last))).toISOString().slice(0,10)};
const fmtD=d=>{try{return new Intl.DateTimeFormat(loc(),{day:'2-digit',month:'short',year:'numeric'}).format(new Date(String(d).slice(0,10)+'T00:00:00'))}catch(e){return d}};
const fmtM=n=>{try{return new Intl.NumberFormat(loc(),{style:'currency',currency:MOEDA,maximumFractionDigits:0,useGrouping:'always'}).format(n)}catch(e){return n+' '+MOEDA}};
const S={c:'mensal',v:'cartoes',busy:false};
let n0=0;const nid=()=>'p'+Date.now().toString(36)+(n0++);
const ref=()=>'LRM-'+Math.random().toString(36).slice(2,10).toUpperCase();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

Object.assign(D.pt,{
 'pn.pop':'Mais popular',
 'pn.rec':'Recomendação para a sua empresa','pn.rec.go':'Ver mudança','pn.rec.tag':'Recomendado','pn.v.aria':'Vista','pn.v.cartoes':'Cartões','pn.v.tabela':'Tabela','pn.yes':'Incluído','pn.no':'Não incluído','pn.t.pr':'Preço','pn.t.v':'Vagas por mês','pn.t.r':'Recrutadores','pn.t.unl':'Ilimitadas',
 'pn.rec.up':'Usa {u} de {l} vagas e {m} de {r} lugares na equipa. O plano {x} dá-lhe margem para crescer sem interromper o recrutamento.','pn.rec.ano':'Pagando por ano poupa {v} em relação a 12 meses ao preço mensal.','pn.rec.down':'Este mês usou {u} vagas, e o plano {x} inclui {l}. Poupa {v} por período, mas deixa de ter {n} funcionalidades.',
 'pn.mud':'Mudar plano','pn.w.t':'Mudar plano','pn.w.cur':'Plano actual: {p} · {c}','pn.w.pick':'Escolha o novo plano','pn.w.cy':'Periodicidade','pn.w.same':'É o seu plano actual. Escolha outro plano ou outra periodicidade.','pn.w.when':'Começa','pn.w.today':'Hoje','pn.w.now':'A pagar agora','pn.w.later':'Cobrança na renovação','pn.w.gain':'Passa a ter','pn.w.lose':'Deixa de ter','pn.w.team':'A equipa tem {m} membros e o plano {p} permite {r}. Remova membros em Equipa antes de mudar.','pn.w.team.l':'Ir para Equipa','pn.w.jobs':'Tem {u} vagas este mês e o plano {p} permite {v}. As vagas publicadas mantêm-se, mas só poderá publicar novas quando houver quota.','pn.w.go.up':'Continuar para o pagamento','pn.w.go.dn':'Agendar mudança','pn.w.go.free':'Cancelar subscrição','pn.w.n.up':'A mudança começa hoje e substitui o período actual (sem reembolso proporcional).','pn.w.n.dn':'O plano actual mantém-se até ao fim do período pago. Nada é cobrado agora e pode cancelar a mudança antes dessa data.','pn.w.n.free':'O plano actual mantém-se até ao fim do período e depois passa ao Gratuito.','pn.sch':'Mudança agendada: plano {p} ({c}) a partir de {d}.','pn.sch.x':'Cancelar mudança','pn.sch.ok':'Mudança agendada para {d}.','pn.sch.no':'Mudança cancelada.','pn.next.sch':'Plano {p} a partir de {d} · {v} por renovação',
'pn.h':'Plano e pagamentos','pn.sub':'Gira a subscrição, acompanhe o consumo e consulte os pagamentos.',
 'pn.cur':'Plano actual','pn.st.act':'Activo','pn.st.can':'Cancelado','pn.st.free':'Gratuito','pn.valid':'Válido até {d}','pn.nolimit':'Sem prazo de validade','pn.cycle':'Periodicidade: {c}',
 'pn.cy.mensal':'Mensal','pn.cy.anual':'Anual','pn.per.m':'/mês','pn.per.a':'/ano','pn.free':'Grátis','pn.save':'Poupa {n}%',
 'pn.renew':'Renovar','pn.cancel':'Cancelar subscrição','pn.react':'Reactivar',
 'pn.use':'Consumo do plano','pn.use.v':'{u} de {l} vagas publicadas este mês','pn.use.vu':'{u} vagas publicadas este mês · sem limite','pn.use.r':'{u} de {l} membros da equipa','pn.use.vl':'Vagas','pn.use.rl':'Equipa',
 'pn.plans':'Planos','pn.plans.p':'Compare os planos e escolha o que melhor serve a sua empresa.','pn.cy.aria':'Periodicidade',
 'pn.f.v':'{n} vagas por mês','pn.f.vu':'Vagas ilimitadas','pn.f.r1':'1 recrutador','pn.f.rn':'{n} recrutadores','pn.f.bd':'Acesso à base de dados completa','pn.f.sp':'Suporte prioritário','pn.f.ra':'Relatórios avançados','pn.f.mk':'Marketplace B2B incluído','pn.f.fo':'Formação: programas e certificados','pn.f.ev':'Eventos: publicação e inscrições','pn.f.fi':'Financiamento: acesso às linhas e apoio à candidatura','pn.f.em':'Empreendedorismo: projectos e mentoria',
 'pn.btn.cur':'Plano actual','pn.btn.free':'Passa a Gratuito ao cancelar a subscrição.','pn.paid.info':'Renovação paga: plano {p} a partir de {d}.','pn.btn.go':'Escolher {p}','pn.btn.up':'Mudar para {p}','pn.btn.lock':'Disponível quando a subscrição actual terminar.',
 'pn.next':'Próximo pagamento','pn.next.d':'Renovação prevista a {d}','pn.next.none':'Sem pagamentos agendados. O plano Gratuito não tem custos.','pn.next.can':'Subscrição cancelada: não haverá nova cobrança. O plano termina a {d}.',
 'pn.hist':'Histórico de pagamentos','pn.hist.none':'Ainda não tem pagamentos.',
 'pn.es.confirmado':'Confirmado','pn.es.pendente':'Pendente','pn.es.cancelado':'Cancelado','pn.es.falhou':'Falhado',
 'pn.tp.novo':'Subscrição','pn.tp.upgrade':'Mudança de plano','pn.tp.renovar':'Renovação','pn.desc':'Plano {p} — {c}','pn.ref':'Ref. {r}','pn.m.bank':'Transferência Bancária',
 'pn.pay.t':'Pagamento do plano','pn.pay.plan':'Plano','pn.pay.cy':'Periodicidade','pn.pay.total':'Total','pn.pay.meth':'Método de pagamento','pn.pay.tel':'Número {m}','pn.pay.go':'Pagar {v}','pn.pay.cancel':'Cancelar',
 'pn.note.mov':'Vai receber um pedido de confirmação no telemóvel.','pn.note.bank':'Receberá uma referência de pagamento. O plano activa quando recebermos a transferência.',
 'pn.note.up':'A mudança começa hoje e substitui o período anterior (sem reembolso proporcional).','pn.test':'Modo de teste: nenhum valor é cobrado.',
 'pn.err.tel':'Introduza um número {m} válido (9 dígitos, começa por {x}).','pn.err.meth':'Escolha um método de pagamento.','pn.pay.mail':'Email da conta PayPal','pn.pay.card':'Número do cartão','pn.pay.cname':'Nome no cartão','pn.pay.exp':'Validade (MM/AA)','pn.pay.cvv':'CVV','pn.pay.bname':'Nome do ordenante','pn.pay.nuit':'NUIT (opcional)','pn.err.card':'Número de cartão inválido.','pn.err.brand':'O número não corresponde a um cartão {m}.','pn.err.cname':'Introduza o nome que consta no cartão.','pn.err.exp':'Validade inválida ou expirada (MM/AA).','pn.err.cvv':'O CVV tem 3 dígitos.','pn.err.bname':'Introduza o nome do ordenante.','pn.err.nuit':'O NUIT tem 9 dígitos.','pn.err.mail':'Introduza um email PayPal válido.','pn.note.ext':'Será ligado ao PayPal para concluir o pagamento. Introduza o email da sua conta PayPal.',
 'pn.proc':'A ligar ao fornecedor de pagamento…','pn.proc.mov':'Confirme o pagamento no seu telemóvel…','pn.ok':'Pagamento confirmado. Plano {p} activo até {d}.',
 'pn.bank.t':'Aguardamos a transferência','pn.bank.p':'Use a referência abaixo na transferência. Enviaremos os dados bancários para {e}. O plano activa quando recebermos o pagamento.','pn.bank.ref':'Referência','pn.bank.close':'Fechar',
 'pn.act.conf':'Simular confirmação (teste)','pn.act.canc':'Cancelar pagamento','pn.conf.ok':'Pagamento confirmado.','pn.canc.ok':'Pagamento cancelado.',
 'pn.cs.t':'Cancelar subscrição','pn.cs.q':'O plano {p} mantém-se activo até {d}. Depois passa para o plano Gratuito. Pode reactivar antes dessa data.','pn.cs.keep':'Manter plano','pn.cs.done':'Subscrição cancelada. Activa até {d}.','pn.re.done':'Subscrição reactivada.',
 'pn.exp':'A subscrição {p} terminou a {d} e a conta passou para o plano Gratuito. Escolha um plano para continuar.','pn.team.link':'Ver equipa'});
Object.assign(D.en,{
 'pn.pop':'Most popular',
 'pn.rec':'Recommendation for your company','pn.rec.go':'See change','pn.rec.tag':'Recommended','pn.v.aria':'View','pn.v.cartoes':'Cards','pn.v.tabela':'Table','pn.yes':'Included','pn.no':'Not included','pn.t.pr':'Price','pn.t.v':'Jobs per month','pn.t.r':'Recruiters','pn.t.unl':'Unlimited',
 'pn.rec.up':'You use {u} of {l} jobs and {m} of {r} team seats. The {x} plan gives you room to grow without pausing recruitment.','pn.rec.ano':'Paying yearly saves {v} compared with 12 months at the monthly price.','pn.rec.down':'This month you used {u} jobs, and the {x} plan includes {l}. You save {v} per period but lose {n} features.',
 'pn.mud':'Change plan','pn.w.t':'Change plan','pn.w.cur':'Current plan: {p} · {c}','pn.w.pick':'Choose the new plan','pn.w.cy':'Billing period','pn.w.same':'This is your current plan. Choose another plan or billing period.','pn.w.when':'Starts','pn.w.today':'Today','pn.w.now':'To pay now','pn.w.later':'Charged at renewal','pn.w.gain':'You get','pn.w.lose':'You lose','pn.w.team':'Your team has {m} members and the {p} plan allows {r}. Remove members in Team before changing.','pn.w.team.l':'Go to Team','pn.w.jobs':'You have {u} jobs this month and the {p} plan allows {v}. Published jobs stay, but you can only publish new ones when there is quota.','pn.w.go.up':'Continue to payment','pn.w.go.dn':'Schedule change','pn.w.go.free':'Cancel subscription','pn.w.n.up':'The change starts today and replaces the current period (no pro-rata refund).','pn.w.n.dn':'The current plan stays until the end of the paid period. Nothing is charged now and you can cancel the change before then.','pn.w.n.free':'The current plan stays until the end of the period and then moves to Free.','pn.sch':'Scheduled change: {p} plan ({c}) from {d}.','pn.sch.x':'Cancel change','pn.sch.ok':'Change scheduled for {d}.','pn.sch.no':'Change cancelled.','pn.next.sch':'{p} plan from {d} · {v} per renewal',
'pn.h':'Plan and payments','pn.sub':'Manage your subscription, follow usage and review payments.',
 'pn.cur':'Current plan','pn.st.act':'Active','pn.st.can':'Cancelled','pn.st.free':'Free','pn.valid':'Valid until {d}','pn.nolimit':'No expiry date','pn.cycle':'Billing: {c}',
 'pn.cy.mensal':'Monthly','pn.cy.anual':'Yearly','pn.per.m':'/month','pn.per.a':'/year','pn.free':'Free','pn.save':'Save {n}%',
 'pn.renew':'Renew','pn.cancel':'Cancel subscription','pn.react':'Reactivate',
 'pn.use':'Plan usage','pn.use.v':'{u} of {l} jobs published this month','pn.use.vu':'{u} jobs published this month · no limit','pn.use.r':'{u} of {l} team members','pn.use.vl':'Jobs','pn.use.rl':'Team',
 'pn.plans':'Plans','pn.plans.p':'Compare the plans and choose the one that best fits your company.','pn.cy.aria':'Billing period',
 'pn.f.v':'{n} jobs per month','pn.f.vu':'Unlimited jobs','pn.f.r1':'1 recruiter','pn.f.rn':'{n} recruiters','pn.f.bd':'Full database access','pn.f.sp':'Priority support','pn.f.ra':'Advanced reports','pn.f.mk':'B2B marketplace included','pn.f.fo':'Training: programmes and certificates','pn.f.ev':'Events: publishing and registrations','pn.f.fi':'Funding: access to funding lines and application support','pn.f.em':'Entrepreneurship: projects and mentoring',
 'pn.btn.cur':'Current plan','pn.btn.free':'You move to Free when you cancel the subscription.','pn.paid.info':'Renewal paid: {p} plan from {d}.','pn.btn.go':'Choose {p}','pn.btn.up':'Switch to {p}','pn.btn.lock':'Available when the current subscription ends.',
 'pn.next':'Next payment','pn.next.d':'Renewal due on {d}','pn.next.none':'No scheduled payments. The Free plan has no cost.','pn.next.can':'Subscription cancelled: there will be no new charge. The plan ends on {d}.',
 'pn.hist':'Payment history','pn.hist.none':'You have no payments yet.',
 'pn.es.confirmado':'Confirmed','pn.es.pendente':'Pending','pn.es.cancelado':'Cancelled','pn.es.falhou':'Failed',
 'pn.tp.novo':'Subscription','pn.tp.upgrade':'Plan change','pn.tp.renovar':'Renewal','pn.desc':'{p} plan — {c}','pn.ref':'Ref. {r}','pn.m.bank':'Bank transfer',
 'pn.pay.t':'Plan payment','pn.pay.plan':'Plan','pn.pay.cy':'Billing period','pn.pay.total':'Total','pn.pay.meth':'Payment method','pn.pay.tel':'{m} number','pn.pay.go':'Pay {v}','pn.pay.cancel':'Cancel',
 'pn.note.mov':'You will receive a confirmation request on your phone.','pn.note.bank':'You will receive a payment reference. The plan activates once we receive the transfer.',
 'pn.note.up':'The change starts today and replaces the previous period (no pro-rata refund).','pn.test':'Test mode: no amount is charged.',
 'pn.err.tel':'Enter a valid {m} number (9 digits, starting with {x}).','pn.err.meth':'Choose a payment method.','pn.pay.mail':'PayPal account email','pn.pay.card':'Card number','pn.pay.cname':'Name on card','pn.pay.exp':'Expiry (MM/YY)','pn.pay.cvv':'CVV','pn.pay.bname':'Payer name','pn.pay.nuit':'NUIT (optional)','pn.err.card':'Invalid card number.','pn.err.brand':'The number does not match a {m} card.','pn.err.cname':'Enter the name shown on the card.','pn.err.exp':'Invalid or expired date (MM/YY).','pn.err.cvv':'The CVV has 3 digits.','pn.err.bname':'Enter the payer name.','pn.err.nuit':'The NUIT has 9 digits.','pn.err.mail':'Enter a valid PayPal email.','pn.note.ext':'You will be taken to PayPal to complete the payment. Enter the email of your PayPal account.',
 'pn.proc':'Connecting to the payment provider…','pn.proc.mov':'Confirm the payment on your phone…','pn.ok':'Payment confirmed. {p} plan active until {d}.',
 'pn.bank.t':'Waiting for the transfer','pn.bank.p':'Use the reference below in the transfer. We will send the bank details to {e}. The plan activates once we receive the payment.','pn.bank.ref':'Reference','pn.bank.close':'Close',
 'pn.act.conf':'Simulate confirmation (test)','pn.act.canc':'Cancel payment','pn.conf.ok':'Payment confirmed.','pn.canc.ok':'Payment cancelled.',
 'pn.cs.t':'Cancel subscription','pn.cs.q':'The {p} plan stays active until {d}. After that the account moves to the Free plan. You can reactivate before then.','pn.cs.keep':'Keep plan','pn.cs.done':'Subscription cancelled. Active until {d}.','pn.re.done':'Subscription reactivated.',
 'pn.exp':'The {p} subscription ended on {d} and the account moved to the Free plan. Choose a plan to continue.','pn.team.link':'View team'});

/* ---------- estado (guardado no navegador, por conta) ---------- */
const KEY=()=>{const s=Session.raw();return 'lermo-plano-'+((s&&s.utilizador_id)||'x')};
const save=()=>{try{localStorage.setItem(KEY(),JSON.stringify({assinatura:MOCK.assinatura,pagamentos:MOCK.pagamentos}))}catch(e){}};
function seed(){
 const p=plano(MOCK.plano||'gratuito');MOCK.pagamentos=[];
 if(p.n==='gratuito'){MOCK.assinatura={plano:'gratuito',ciclo:null,data_inicio:hoje(),data_fim:null,cancelada:false,expirou:null};return}
 const ini=addD(hoje(),-5);
 MOCK.assinatura={plano:p.n,ciclo:'mensal',data_inicio:ini,data_fim:addM(ini,1),cancelada:false,expirou:null};
 MOCK.pagamentos=[{pagamento_id:'p-seed',metodo_id:1,valor:p.m,moeda:MOEDA,plano:p.n,ciclo:'mensal',tipo:'novo',referencia_externa:'LRM-DEMO0001',estado:'confirmado',criado_em:ini+'T09:00:00.000Z',data_confirmacao:ini+'T09:01:00.000Z'}];
}
function load(){
 let s=null;try{s=JSON.parse(localStorage.getItem(KEY()))}catch(e){}
 if(s&&s.assinatura&&Array.isArray(s.pagamentos)&&PL.some(x=>x.n===s.assinatura.plano)){MOCK.assinatura=s.assinatura;MOCK.pagamentos=s.pagamentos;MOCK.plano=s.assinatura.plano}else seed();
}
/* subscrição terminada sem renovação -> plano Gratuito */
function normalizar(){
 const a=MOCK.assinatura;
 if(a.plano!=='gratuito'&&a.agendada&&a.data_fim&&a.data_fim<hoje()){   /* mudança agendada: o novo plano começa no fim do período; fica um pagamento pendente (em produção, cobrança automática) */
  const g=a.agendada,np=plano(g.plano);
  MOCK.pagamentos.unshift({pagamento_id:nid(),metodo_id:1,valor:preco(np,g.ciclo),moeda:MOEDA,plano:np.n,ciclo:g.ciclo,tipo:'renovar',referencia_externa:ref(),estado:'pendente',criado_em:a.data_fim+'T00:00:00.000Z',data_confirmacao:null});
  MOCK.assinatura={plano:np.n,ciclo:g.ciclo,data_inicio:a.data_fim,data_fim:addM(a.data_fim,g.ciclo==='anual'?12:1),cancelada:false,expirou:null};MOCK.plano=np.n;save();return;
 }
 if(a.plano!=='gratuito'&&a.data_fim&&a.data_fim<hoje()&&a.renovacao){
  const r=a.renovacao;MOCK.assinatura={plano:r.plano,ciclo:r.ciclo,data_inicio:a.data_fim,data_fim:r.data_fim,cancelada:false,expirou:null};MOCK.plano=r.plano;save();return;
 }
 if(a.plano!=='gratuito'&&a.data_fim&&a.data_fim<hoje()){
  MOCK.assinatura={plano:'gratuito',ciclo:null,data_inicio:hoje(),data_fim:null,cancelada:false,expirou:{plano:a.plano,data:a.data_fim}};
  MOCK.plano='gratuito';save();
 }
}
load();

/* ---------- aplicar um pagamento confirmado ---------- */
function aplicar(p){
 const a=MOCK.assinatura;
 if(p.tipo==='renovar'&&a.data_fim&&a.data_fim>=hoje()&&a.plano!==p.plano){   /* renovação paga com outro plano: só entra em vigor quando o período actual terminar */
  MOCK.assinatura=Object.assign({},a,{cancelada:false,renovacao:{plano:p.plano,ciclo:p.ciclo,data_fim:addM(a.data_fim,p.ciclo==='anual'?12:1)}});
  if(Array.isArray(MOCK.actividade))MOCK.actividade.unshift({tipo:'pagamento',texto:'Renovação paga: plano '+t('plano.'+p.plano),em:new Date().toISOString()});
  return;
 }
 const renova=p.tipo==='renovar'&&a.data_fim&&a.data_fim>=hoje(),base=renova?a.data_fim:hoje();
 MOCK.assinatura={plano:p.plano,ciclo:p.ciclo,data_inicio:renova?a.data_inicio:hoje(),data_fim:addM(base,p.ciclo==='anual'?12:1),cancelada:false,expirou:null};
 MOCK.plano=p.plano;
 if(Array.isArray(MOCK.actividade))MOCK.actividade.unshift({tipo:'pagamento',texto:'Pagamento do plano '+t('plano.'+p.plano)+' confirmado',em:new Date().toISOString()});
}
const descr=p=>t('pn.desc',{p:t('plano.'+p.plano),c:t('pn.cy.'+p.ciclo)});

/* ---------- vista ---------- */
const bar=(u,l)=>{const full=u>=l,pc=Math.min(100,Math.round(u/l*100));return `<div class="vg-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${l}" aria-valuenow="${Math.min(u,l)}"><span${full?' class="full"':''} style="width:${pc}%"></span></div>`};
function atual(){
 const a=MOCK.assinatura,pl=plano(a.plano),pago=a.plano!=='gratuito',st=!pago?'free':a.cancelada?'can':'act';
 const mud=`<button class="btn btn-g btn-s" type="button" data-a="pn-mudar:"><i class="fas fa-arrow-right-arrow-left" aria-hidden="true"></i> ${t('pn.mud')}</button>`;
 const acts=pago&&a.renovacao?'':pago?mud+(a.cancelada?`<button class="btn btn-g btn-s" type="button" data-a="pn-reativar"><i class="fas fa-rotate-left" aria-hidden="true"></i> ${t('pn.react')}</button>`
  :`<button class="btn btn-g btn-s" type="button" data-a="pn-pagar:${a.plano}:renovar"><i class="fas fa-rotate" aria-hidden="true"></i> ${t('pn.renew')}</button><button class="btn btn-l btn-s" type="button" data-a="pn-cancelar">${t('pn.cancel')}</button>`):mud;
 return `<section class="card pn-cur"><div class="ch"><h2>${t('pn.cur')}</h2><span class="tag ${st==='act'?'ok':st==='can'?'no':'in'}">${t('pn.st.'+st)}</span></div>
 <p class="pn-nm">${t('plano.'+pl.n)}</p>
 <p class="pn-meta">${pago?t('pn.valid',{d:fmtD(a.data_fim)})+(a.ciclo?' · '+t('pn.cycle',{c:t('pn.cy.'+a.ciclo)}):''):t('pn.nolimit')}</p>
 ${a.agendada?`<p class="pn-sch"><i class="fas fa-calendar-check" aria-hidden="true"></i><span>${esc(t('pn.sch',{p:t('plano.'+a.agendada.plano),c:t('pn.cy.'+a.agendada.ciclo),d:fmtD(a.data_fim)}))}</span><button class="btn btn-l btn-s" type="button" data-a="pn-sch-x">${t('pn.sch.x')}</button></p>`:''}
 ${a.renovacao?`<p class="pn-meta">${esc(t('pn.paid.info',{p:t('plano.'+a.renovacao.plano),d:fmtD(a.data_fim)}))}</p>`:''}
 ${acts?`<div class="pn-acts">${acts}</div>`:''}</section>`;
}
function consumo(){
 const a=MOCK.assinatura,pl=plano(a.plano),u=MOCK.vagasConsumidas||0,m=MOCK.membros||1,ilim=pl.v>=999;
 return `<section class="card"><div class="ch"><h2>${t('pn.use')}</h2></div>
 <div class="pn-use"><div class="pn-ul"><strong>${t('pn.use.vl')}</strong></div>${ilim?`<p class="vg-qt">${t('pn.use.vu',{u})}</p>`:bar(u,pl.v)+`<p class="vg-qt">${t('pn.use.v',{u,l:pl.v})}</p>`}</div>
 <div class="pn-use"><div class="pn-ul"><strong>${t('pn.use.rl')}</strong><a href="#/equipa">${t('pn.team.link')}</a></div>${bar(m,pl.r)}<p class="vg-qt">${t('pn.use.r',{u:m,l:pl.r})}</p></div></section>`;
}
function btnFor(pl){
 const a=MOCK.assinatura,pago=a.plano!=='gratuito',cur=a.plano===pl.n;let btn;
 if(cur)btn=`<button class="btn btn-l" type="button" disabled>${t('pn.btn.cur')}</button>`;
 else if(a.renovacao)btn=`<p class="pn-lk">${t('pn.btn.lock')}</p>`;
 else if(pl.n==='gratuito')btn=pago?`<button class="btn btn-l" type="button" data-a="pn-mudar:gratuito">${t('pn.btn.up',{p:t('plano.gratuito')})}</button>`:'';
 else if(idx(pl.n)>idx(a.plano))btn=`<button class="btn btn-g" type="button" data-a="pn-mudar:${pl.n}">${t(pago?'pn.btn.up':'pn.btn.go',{p:t('plano.'+pl.n)})}</button>`;
 else btn=`<button class="btn btn-l" type="button" data-a="pn-mudar:${pl.n}">${t('pn.btn.up',{p:t('plano.'+pl.n)})}</button>`;   /* plano inferior: paga-se agora, entra em vigor no fim do período actual */
 return btn}
/* Recomendação inteligente: lê o consumo real (vagas do mês e equipa) e sugere subir, descer ou passar a anual. */
function recom(){
 const a=MOCK.assinatura,pl=plano(a.plano),pago=a.plano!=='gratuito',u=MOCK.vagasConsumidas||0,m=MOCK.membros||1,i=idx(a.plano);
 if(a.agendada||a.cancelada||a.renovacao)return null;
 const apertado=(pl.v<999&&u/pl.v>=.8)||m>=pl.r;
 if(apertado&&PL[i+1]){const x=PL.slice(i+1).find(y=>y.v>=Math.ceil(u*1.5)&&y.r>m)||PL[PL.length-1];if(x.n!==a.plano)return{k:'up',p:x.n,c:a.ciclo||'mensal',u,l:pl.v,m,r:pl.r,x:t('plano.'+x.n)}}
 if(pago&&a.ciclo==='mensal'){const sv=pl.m*12-pl.a;if(sv>0)return{k:'ano',p:a.plano,c:'anual',v:fmtM(sv)}}
 const lo=PL[i-1];
 if(pago&&lo&&lo.n!=='gratuito'&&u<=lo.v*.6&&m<=lo.r)return{k:'down',p:lo.n,c:a.ciclo||'mensal',u,l:lo.v,v:fmtM((pl.m-lo.m)*(a.ciclo==='anual'?12:1)),x:t('plano.'+lo.n),n:WL.filter(k=>pl[k]&&!lo[k]).length};
 return null;
}
function recomHtml(){
 const r=recom();if(!r)return '';
 return `<section class="card pn-rec" aria-label="${t('pn.rec')}"><span class="pn-rec-i"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i></span><div class="pn-rec-b"><span class="pn-rec-k">${t('pn.rec')}</span><p>${esc(t('pn.rec.'+r.k,r))}</p></div><button class="btn btn-g" type="button" data-a="pn-mudar:${r.p}:${r.c}">${t('pn.rec.go')}</button></section>`;
}
/* Vista em tabela: compara todos os planos linha a linha, com o plano actual e o recomendado em destaque. */
function tabela(){
 const a=MOCK.assinatura,r=recom(),yes=(v)=>`<i class="fas ${v?'fa-check':'fa-minus'} ${v?'on':'off'}" aria-hidden="true"></i><span class="sr">${t(v?'pn.yes':'pn.no')}</span>`;
 const th=pl=>`<th scope="col" class="${a.plano===pl.n?'cur':''}${r&&r.p===pl.n?' rec':''}" data-pl="${pl.n}"><span class="ic"><i class="fas ${ICO[pl.n]}" aria-hidden="true"></i></span>${t('plano.'+pl.n)}${a.plano===pl.n?`<em class="tag ok">${t('pn.st.act')}</em>`:r&&r.p===pl.n?`<em class="tag in">${t('pn.rec.tag')}</em>`:''}</th>`;
 const row=(lb,f)=>`<tr><th scope="row">${lb}</th>${PL.map(pl=>`<td class="${a.plano===pl.n?'cur':''}">${f(pl)}</td>`).join('')}</tr>`;
 const feat=[['bd','pn.f.bd'],['sp','pn.f.sp'],['ra','pn.f.ra'],['mk','pn.f.mk'],['fo','pn.f.fo'],['ev','pn.f.ev'],['fi','pn.f.fi'],['em','pn.f.em']];
 return `<div class="pn-tw"><table class="pn-tb"><caption class="sr">${t('pn.plans')}</caption><thead><tr><td></td>${PL.map(th).join('')}</tr></thead><tbody>`+
  row(t('pn.t.pr'),pl=>pl.m?`<strong>${fmtM(preco(pl,S.c))}</strong><small>${t(S.c==='anual'?'pn.per.a':'pn.per.m')}</small>`:`<strong>${t('pn.free')}</strong>`)+
  row(t('pn.t.v'),pl=>pl.v>=999?t('pn.t.unl'):pl.v)+row(t('pn.t.r'),pl=>pl.r)+feat.map(([k,l])=>row(t(l),pl=>yes(pl[k]))).join('')+
  row('',pl=>btnFor(pl))+`</tbody></table></div>`;
}
function planos(){
 const a=MOCK.assinatura,pago=a.plano!=='gratuito';
 const card=pl=>{
  const cur=a.plano===pl.n,pr=preco(pl,S.c),sav=pl.m>0&&S.c==='anual'?Math.round((1-pl.a/(pl.m*12))*100):0;
  const ft=(on,txt)=>`<li class="${on?'on':'off'}"><i class="fas ${on?'fa-check':'fa-minus'}" aria-hidden="true"></i><span>${txt}</span></li>`;
  const feats=ft(1,pl.v>=999?t('pn.f.vu'):t('pn.f.v',{n:pl.v}))+ft(1,pl.r===1?t('pn.f.r1'):t('pn.f.rn',{n:pl.r}))+ft(pl.bd,t('pn.f.bd'))+ft(pl.sp,t('pn.f.sp'))+ft(pl.ra,t('pn.f.ra'))+ft(pl.mk,t('pn.f.mk'))+ft(pl.fo,t('pn.f.fo'))+ft(pl.ev,t('pn.f.ev'))+ft(pl.fi,t('pn.f.fi'))+ft(pl.em,t('pn.f.em'));
  const btn=btnFor(pl);
  return `<article class="pn-card${cur?' cur':''}" data-pl="${pl.n}" aria-label="${t('plano.'+pl.n)}">${pl.n==='premium'&&!cur?`<span class="pn-pop">${t('pn.pop')}</span>`:''}<div class="pn-hh"><div class="pn-hd"><span class="ic"><i class="fas ${ICO[pl.n]}" aria-hidden="true"></i></span><h3>${t('plano.'+pl.n)}</h3>${cur?`<span class="tag ok">${t('pn.st.act')}</span>`:''}</div>
  <p class="pn-pr">${pr===0?`<strong>${t('pn.free')}</strong>`:`<strong>${fmtM(pr)}</strong><small>${t(S.c==='anual'?'pn.per.a':'pn.per.m')}</small>`}</p>
  <p class="pn-sv">${sav>0?`<span class="tag ok">${t('pn.save',{n:sav})}</span>`:'&nbsp;'}</p></div>
  <ul class="pn-ft">${feats}</ul><div class="pn-bt">${btn}</div></article>`;
 };
 return `<div class="ch"><div><h2>${t('pn.plans')}</h2><p class="pn-sub">${t('pn.plans.p')}</p></div>
 <div class="seg" role="group" aria-label="${t('pn.cy.aria')}">${['mensal','anual'].map(c=>`<button type="button" data-a="pn-ciclo:${c}" aria-pressed="${S.c===c}">${t('pn.cy.'+c)}</button>`).join('')}</div>
 <div class="seg" role="group" aria-label="${t('pn.v.aria')}">${['cartoes','tabela'].map(v=>`<button type="button" data-a="pn-vista:${v}" aria-pressed="${(S.v||'cartoes')===v}"><i class="fas ${v==='tabela'?'fa-table-list':'fa-table-cells-large'}" aria-hidden="true"></i> ${t('pn.v.'+v)}</button>`).join('')}</div></div>
 ${S.v==='tabela'?tabela():`<div class="pn-grid">${PL.map(card).join('')}</div>`}`;
}
function proximo(){
 const a=MOCK.assinatura,pl=plano(a.plano);let b;
 if(a.plano==='gratuito')b=`<p class="pn-meta">${t('pn.next.none')}</p>`;
 else if(a.renovacao)b=`<p class="pn-meta">${esc(t('pn.paid.info',{p:t('plano.'+a.renovacao.plano),d:fmtD(a.data_fim)}))}</p>`;
 else if(a.agendada)b=`<p class="pn-meta">${esc(t('pn.next.sch',{p:t('plano.'+a.agendada.plano),d:fmtD(a.data_fim),v:fmtM(preco(plano(a.agendada.plano),a.agendada.ciclo))}))}</p>`;
 else if(a.cancelada)b=`<p class="pn-meta">${t('pn.next.can',{d:fmtD(a.data_fim)})}</p>`;
 else b=`<p class="pn-nx"><strong>${fmtM(preco(pl,a.ciclo||'mensal'))}</strong></p><p class="pn-meta">${t('pn.next.d',{d:fmtD(a.data_fim)})}</p>`;
 return `<section class="card"><div class="ch"><h2>${t('pn.next')}</h2></div>${b}</section>`;
}
function linha(p){
 const m=MET.find(x=>x[0]===p.metodo_id)||MET[0],cls={confirmado:'ok',pendente:'',cancelado:'in',falhou:'no'}[p.estado]||'';
 const acts=p.estado==='pendente'?`<div class="pn-ra">${TESTE?`<button class="btn btn-l btn-s" type="button" data-a="pn-conf:${p.pagamento_id}">${t('pn.act.conf')}</button>`:''}<button class="btn btn-l btn-s" type="button" data-a="pn-canc:${p.pagamento_id}">${t('pn.act.canc')}</button></div>`:'';
 return `<div class="row pn-row"><span class="ic"><i class="fas ${m[6]}" aria-hidden="true"></i></span><div class="rb"><div class="rt wrap">${esc(descr(p))}</div>
 <div class="rs wrap">${esc(t('pn.tp.'+p.tipo))} · ${esc(metNome(m))} · ${esc(fmtD(p.criado_em))}${p.referencia_externa?' · '+esc(t('pn.ref',{r:p.referencia_externa})):''}</div>${acts}</div>
 <div class="pn-am"><strong>${fmtM(p.valor)}</strong><span class="tag ${cls}">${t('pn.es.'+p.estado)}</span></div></div>`;
}
function historico(){
 const L=MOCK.pagamentos;
 return `<section class="card"><div class="ch"><h2>${t('pn.hist')}</h2></div>${L.length?L.map(linha).join(''):`<div class="state"><i class="fas fa-receipt" aria-hidden="true"></i><p>${t('pn.hist.none')}</p></div>`}</section>`;
}
function pagina(){
 const a=MOCK.assinatura,ex=a.expirou;
 return `<h1 class="sr">${t('pn.h')}</h1>`+crumbs([[t('n.dash'),'#/dashboard'],[t('n.plano')]])+
 `<section class="hello"><div><h1>${t('pn.h')}</h1><p>${t('pn.sub')}</p></div></section>`+
 (ex?`<p class="pn-warn" role="status"><i class="fas fa-circle-info" aria-hidden="true"></i> ${t('pn.exp',{p:t('plano.'+ex.plano),d:fmtD(ex.data)})}</p>`:'')+
 `<div class="g2 pn-top">${atual()}${consumo()}</div>${recomHtml()}<section class="card pn-plans" id="pnPlans">${planos()}</section>
 <div class="g2" style="margin-top:1rem">${historico()}${proximo()}</div>`;
}
const refresh=()=>{if(parse().area==='plano'){$('#main').innerHTML=pagina()}setPlan()};
Views.plano=async()=>{normalizar();return{title:t('n.plano'),html:pagina()}};

/* ---------- modal de pagamento ---------- */
const opt=(name,val,label,sub,checked,extra='')=>`<label class="pn-opt"><input type="radio" name="${name}" value="${val}"${checked?' checked':''}${extra}><span class="pn-ob"><strong>${label}</strong>${sub?`<small>${sub}</small>`:''}</span></label>`;
function payHtml(pl,tipo,ciclo){
 return `<form id="pnF" data-p="${pl.n}" data-tipo="${tipo}" novalidate>
 <div class="pn-sum"><div><span>${t('pn.pay.plan')}</span><strong>${t('plano.'+pl.n)}</strong></div><div><span>${t('pn.pay.total')}</span><strong id="pnTot"></strong></div></div>
 <fieldset class="pn-fs"><legend>${t('pn.pay.cy')}</legend><div class="pn-opts">${['mensal','anual'].map(c=>opt('pnC',c,t('pn.cy.'+c),fmtM(preco(pl,c))+t(c==='anual'?'pn.per.a':'pn.per.m'),c===ciclo)).join('')}</div></fieldset>
 <fieldset class="pn-fs"><legend>${t('pn.pay.meth')}</legend><div class="pn-opts pn-ms">${MET.map((m,i)=>opt('pnM',m[0],`<i class="fas ${m[6]}" aria-hidden="true"></i> ${esc(metNome(m))}`,'',i===0)).join('')}</div></fieldset>
 <div class="fld" id="pnTelW"><label for="pnTel" id="pnTelL"></label><input type="tel" id="pnTel" inputmode="numeric" autocomplete="tel-national" placeholder="8X XXX XXXX" maxlength="16"><p class="ferr" id="pnTelE" hidden></p></div>
 <div class="fld" id="pnMailW" hidden><label for="pnMail">${t('pn.pay.mail')}</label><input type="email" id="pnMail" inputmode="email" autocomplete="email" placeholder="nome@exemplo.com" maxlength="120" value="${esc((Session.get()||{}).email||'')}"><p class="ferr" id="pnMailE" hidden></p></div>
 <div class="pn-grp" id="pnCardW" hidden>
  <div class="fld" id="pnCnW"><label for="pnCn">${t('pn.pay.card')}</label><input type="text" id="pnCn" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="23"><p class="ferr" id="pnCnE" hidden></p></div>
  <div class="fld" id="pnCtW"><label for="pnCt">${t('pn.pay.cname')}</label><input type="text" id="pnCt" autocomplete="cc-name" maxlength="60"><p class="ferr" id="pnCtE" hidden></p></div>
  <div class="pn-row"><div class="fld" id="pnCeW"><label for="pnCe">${t('pn.pay.exp')}</label><input type="text" id="pnCe" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5"><p class="ferr" id="pnCeE" hidden></p></div>
  <div class="fld" id="pnCvW"><label for="pnCv">${t('pn.pay.cvv')}</label><input type="password" id="pnCv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="3"><p class="ferr" id="pnCvE" hidden></p></div></div>
 </div>
 <div class="pn-grp" id="pnBankW" hidden>
  <div class="fld" id="pnBnW"><label for="pnBn">${t('pn.pay.bname')}</label><input type="text" id="pnBn" autocomplete="organization" maxlength="100" value="${esc((Session.get()||{}).nome_completo||'')}"><p class="ferr" id="pnBnE" hidden></p></div>
  <div class="fld" id="pnNuW"><label for="pnNu">${t('pn.pay.nuit')}</label><input type="text" id="pnNu" inputmode="numeric" maxlength="9" placeholder="123456789"><p class="ferr" id="pnNuE" hidden></p></div>
 </div>
 <p class="pn-note" id="pnNote"></p>${tipo==='upgrade'?`<p class="pn-note">${t('pn.note.up')}</p>`:''}
 <p class="pn-test"><i class="fas fa-flask" aria-hidden="true"></i> ${t('pn.test')}</p>
 <p class="ferr box" id="pnFail" role="alert" hidden></p>
 <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('pn.pay.cancel')}</button><button class="btn btn-g" type="submit" id="pnGo"></button></div></form>`;
}
function upd(f){
 const pl=plano(f.dataset.p),c=f.querySelector('input[name=pnC]:checked').value,mEl=f.querySelector('input[name=pnM]:checked'),m=MET.find(x=>x[0]===+(mEl&&mEl.value))||MET[0];
 const v=fmtM(preco(pl,c));$('#pnTot').textContent=v;$('#pnGo').innerHTML=`<i class="fas fa-lock" aria-hidden="true"></i> ${t('pn.pay.go',{v})}`;
 const mov=m[2]==='mov';$('#pnTelW').hidden=!mov;$('#pnMailW').hidden=m[2]!=='ext';$('#pnCardW').hidden=m[2]!=='card';$('#pnBankW').hidden=m[2]!=='bank';if(mov)$('#pnTelL').textContent=t('pn.pay.tel',{m:m[5]});
 $('#pnNote').textContent=m[2]==='card'?'':t('pn.note.'+m[2]);
}
Actions['pn-pagar']=b=>{   /* data-a="pn-pagar:<plano>:<tipo>" (o motor só passa o 2.º segmento, por isso lê-se o atributo todo) */
 const [,n,tipo]=b.dataset.a.split(':'),pl=plano(n);if(!pl||pl.n==='gratuito')return;
 const a=MOCK.assinatura,ciclo=tipo==='renovar'&&a.plano===pl.n&&a.ciclo?a.ciclo:S.c;
 const m=Modal.open({title:t('pn.pay.t')+' '+t('plano.'+pl.n),body:payHtml(pl,tipo||'novo',ciclo)});if(m)upd(m.querySelector('#pnF'));
};
document.addEventListener('change',e=>{const f=e.target.closest&&e.target.closest('#pnF');if(f)upd(f)});
Actions['pn-vista']=(b,x)=>{if(x!=='cartoes'&&x!=='tabela')return;S.v=x;$('#pnPlans').innerHTML=planos();const n=$('#pnPlans [data-a="pn-vista:'+x+'"]');n&&n.focus()};
Actions['pn-ciclo']=(b,x)=>{if(x!=='mensal'&&x!=='anual')return;S.c=x;$('#pnPlans').innerHTML=planos();const n=$('#pnPlans [data-a="pn-ciclo:'+x+'"]');n&&n.focus()};

function bankHtml(rec){
 const u=Session.get();
 return `<div class="pn-st"><i class="fas fa-hourglass-half" aria-hidden="true"></i><h3>${t('pn.bank.t')}</h3><p>${esc(t('pn.bank.p',{e:(u&&u.email)||''}))}</p>
 <p class="pn-refb"><span>${t('pn.bank.ref')}</span><strong>${esc(rec.referencia_externa)}</strong></p><p class="pn-meta">${esc(descr(rec))} · ${fmtM(rec.valor)}</p>
 <div class="mod-f"><button class="btn btn-g" type="button" data-a="modal-close">${t('pn.bank.close')}</button></div></div>`;
}
async function pagar(f){
 if(S.busy)return;
 const pl=plano(f.dataset.p),tipo=f.dataset.tipo,ciclo=f.querySelector('input[name=pnC]:checked').value,mEl=f.querySelector('input[name=pnM]:checked'),fail=$('#pnFail');
 fail.hidden=true;
 if(!mEl){fail.textContent=t('pn.err.meth');fail.hidden=false;return}
 const m=MET.find(x=>x[0]===+mEl.value);
 if(m[2]==='mov'){
  const raw=$('#pnTel').value.replace(/\D/g,'').replace(/^258(?=\d{9}$)/,''),ok=new RegExp('^'+m[3]+'\\d{7}$').test(raw),w=$('#pnTelW'),er=$('#pnTelE');
  w.classList.toggle('invalid',!ok);$('#pnTel').setAttribute('aria-invalid',String(!ok));er.textContent=ok?'':t('pn.err.tel',{m:m[5],x:m[4]});er.hidden=ok;
  if(!ok){$('#pnTel').focus();return}
 }
 const chk=(w,e,i,ok,msg)=>{const W=$('#'+w),E=$('#'+e),I=$('#'+i);W.classList.toggle('invalid',!ok);I.setAttribute('aria-invalid',String(!ok));E.textContent=ok?'':msg;E.hidden=ok;return [ok,i]};
 let R=[];
 if(m[2]==='ext')R=[chk('pnMailW','pnMailE','pnMail',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#pnMail').value.trim()),t('pn.err.mail'))];
 if(m[2]==='card'){
  const num=$('#pnCn').value.replace(/\D/g,''),visa=m[1]==='Visa';
  const luhn=n=>{let q=0,d=false;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(d){x*=2;if(x>9)x-=9}q+=x;d=!d}return q%10===0};
  const fmt=num.length>=13&&num.length<=19&&luhn(num),brand=visa?/^4/.test(num):/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(num);
  const ex=$('#pnCe').value.match(/^(\d{2})\/(\d{2})$/),exOk=!!ex&&+ex[1]>=1&&+ex[1]<=12&&new Date(2000+ +ex[2],+ex[1],1)>new Date();
  R=[chk('pnCnW','pnCnE','pnCn',fmt&&brand,fmt?t('pn.err.brand',{m:m[1]}):t('pn.err.card')),
     chk('pnCtW','pnCtE','pnCt',$('#pnCt').value.trim().length>=3,t('pn.err.cname')),
     chk('pnCeW','pnCeE','pnCe',exOk,t('pn.err.exp')),
     chk('pnCvW','pnCvE','pnCv',/^\d{3}$/.test($('#pnCv').value),t('pn.err.cvv'))];
 }
 if(m[2]==='bank'){
  const nu=$('#pnNu').value.trim();
  R=[chk('pnBnW','pnBnE','pnBn',$('#pnBn').value.trim().length>=3,t('pn.err.bname')),chk('pnNuW','pnNuE','pnNu',nu===''||/^\d{9}$/.test(nu),t('pn.err.nuit'))];
 }
 {const bad=R.find(x=>!x[0]);if(bad){$('#'+bad[1]).focus();return}}
 S.busy=true;
 const rec={pagamento_id:nid(),metodo_id:m[0],valor:preco(pl,ciclo),moeda:MOEDA,plano:pl.n,ciclo,tipo,referencia_externa:ref(),estado:'pendente',criado_em:new Date().toISOString(),data_confirmacao:null};
 if(m[2]==='ext')rec.pagador_email=$('#pnMail').value.trim();   /* só em modo de teste; em produção o email vem do PayPal na confirmação */
 if(m[2]==='card')rec.cartao_final=$('#pnCn').value.replace(/\D/g,'').slice(-4);   /* nunca se guarda o número completo nem o CVV */
 if(m[2]==='bank'){rec.pagador_nome=$('#pnBn').value.trim();rec.pagador_nuit=$('#pnNu').value.trim()}
 const body=f.closest('.mod-c');
 try{
  if(m[2]==='bank'){
   MOCK.pagamentos.unshift(rec);save();if(body)body.innerHTML=bankHtml(rec);refresh();return;
  }
  if(body)body.innerHTML=`<div class="pn-st" role="status"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i><h3>${t(m[2]==='mov'?'pn.proc.mov':'pn.proc')}</h3></div>`;
  await sleep(1800);
  rec.estado='confirmado';rec.data_confirmacao=new Date().toISOString();
  MOCK.pagamentos.unshift(rec);aplicar(rec);save();
  Modal.close(true);refresh();toast(t('pn.ok',{p:t('plano.'+pl.n),d:fmtD(MOCK.assinatura.data_fim)}));
 }finally{S.busy=false}
}
document.addEventListener('input',e=>{const i=e.target;if(!i||!i.closest||!i.closest('#pnF'))return;
 if(i.id==='pnCn')i.value=i.value.replace(/\D/g,'').slice(0,19).replace(/(.{4})/g,'$1 ').trim();
 else if(i.id==='pnCe'){const d=i.value.replace(/\D/g,'').slice(0,4);i.value=d.length>2?d.slice(0,2)+'/'+d.slice(2):d}
 else if(i.id==='pnCv'||i.id==='pnNu')i.value=i.value.replace(/\D/g,'')});
document.addEventListener('submit',e=>{if(e.target.id==='pnF'){e.preventDefault();pagar(e.target)}});

/* ---------- «Mudar plano»: escolher plano e periodicidade, ver o impacto e pagar (subida) ou agendar (descida) ---------- */
const WL=['bd','sp','ra','mk','fo','ev','fi','em'];
function wInfo(sel,c){
 const a=MOCK.assinatura,cur=plano(a.plano),pl=plano(sel),pago=a.plano!=='gratuito',m=MOCK.membros||1,u=MOCK.vagasConsumidas||0;
 if(sel===a.plano&&c===(a.ciclo||'mensal'))return{same:true};
 let tipo;
 if(pl.n==='gratuito')tipo='free';
 else if(!pago)tipo='novo';
 else if(idx(sel)>idx(a.plano)||(sel===a.plano&&c==='anual'))tipo='upgrade';
 else tipo='agendar';
 const gain=WL.filter(k=>pl[k]&&!cur[k]),lose=WL.filter(k=>!pl[k]&&cur[k]);
 return{tipo,pl,gain,lose,teamBad:m>pl.r,m,u,jobsBad:pl.v<999&&u>pl.v,pr:preco(pl,c)};
}
function wHtml(i,c){
 if(i.same)return `<p class="pn-note">${t('pn.w.same')}</p>`;
 const a=MOCK.assinatura,now=i.tipo==='upgrade'||i.tipo==='novo',nm=t('plano.'+i.pl.n);
 const lst=(k,arr,cls)=>arr.length?`<div class="pn-wl ${cls}"><strong>${t(k)}</strong><ul>${arr.map(x=>`<li><i class="fas ${cls==='gain'?'fa-plus':'fa-minus'}" aria-hidden="true"></i>${t('pn.f.'+x)}</li>`).join('')}</ul></div>`:'';
 const rows=i.tipo==='free'?'':`<div class="pn-sum"><div><span>${t('pn.w.when')}</span><strong>${now?t('pn.w.today'):fmtD(a.data_fim)}</strong></div><div><span>${t(now?'pn.w.now':'pn.w.later')}</span><strong>${fmtM(i.pr)}</strong></div></div>`;
 return rows+`<p class="pn-note">${t('pn.w.n.'+(now?'up':i.tipo==='free'?'free':'dn'))}</p>`+lst('pn.w.gain',i.gain,'gain')+lst('pn.w.lose',i.lose,'lose')+
  (i.teamBad?`<p class="pn-bad" role="alert"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i><span>${esc(t('pn.w.team',{m:i.m,p:nm,r:i.pl.r}))} <a href="#/equipa" data-a="modal-close">${t('pn.w.team.l')}</a></span></p>`:'')+
  (i.jobsBad&&!i.teamBad?`<p class="pn-warn"><i class="fas fa-circle-info" aria-hidden="true"></i>${esc(t('pn.w.jobs',{u:i.u,p:nm,v:i.pl.v}))}</p>`:'');
}
function wUpd(f){
 const sel=f.querySelector('input[name=pnWP]:checked'),c=f.querySelector('input[name=pnWC]:checked').value,i=wInfo(sel.value,c),go=$('#pnWGo');
 $('#pnWI').innerHTML=wHtml(i,c);
 go.disabled=!!i.same||!!i.teamBad;
 go.innerHTML=i.same?t('pn.w.go.up'):t(i.tipo==='free'?'pn.w.go.free':i.tipo==='agendar'?'pn.w.go.dn':'pn.w.go.up');
}
Actions['pn-mudar']=b=>{
 const a=MOCK.assinatura,pa=b.dataset.a.split(':'),pre=pa[1],ciclo=pa[2]==='anual'||pa[2]==='mensal'?pa[2]:(a.ciclo||S.c),pago=a.plano!=='gratuito';
 const ini=PL.some(x=>x.n===pre)?pre:(PL[idx(a.plano)+1]||PL[idx(a.plano)]).n;
 const lista=PL.filter(x=>pago||x.n!=='gratuito');
 const m=Modal.open({title:t('pn.w.t'),body:`<form id="pnW" novalidate><p class="pn-meta pn-wc">${esc(t('pn.w.cur',{p:t('plano.'+a.plano),c:a.ciclo?t('pn.cy.'+a.ciclo):t('pn.st.free')}))}</p>
  <fieldset class="pn-fs"><legend>${t('pn.w.pick')}</legend><div class="pn-opts">${lista.map(x=>opt('pnWP',x.n,`<i class="fas ${ICO[x.n]}" aria-hidden="true"></i> ${t('plano.'+x.n)}`,x.m?fmtM(x.m)+t('pn.per.m'):t('pn.free'),x.n===ini,x.n===a.plano?' data-cur="1"':'')).join('')}</div></fieldset>
  <fieldset class="pn-fs"><legend>${t('pn.w.cy')}</legend><div class="pn-opts">${['mensal','anual'].map(c=>opt('pnWC',c,t('pn.cy.'+c),'',c===ciclo)).join('')}</div></fieldset>
  <div id="pnWI" aria-live="polite"></div>
  <div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('pn.pay.cancel')}</button><button class="btn btn-g" type="submit" id="pnWGo"></button></div></form>`});
 if(m)wUpd(m.querySelector('#pnW'));
};
document.addEventListener('change',e=>{const f=e.target.closest&&e.target.closest('#pnW');if(f)wUpd(f)});
document.addEventListener('submit',e=>{
 if(e.target.id!=='pnW')return;e.preventDefault();
 const f=e.target,sel=f.querySelector('input[name=pnWP]:checked').value,c=f.querySelector('input[name=pnWC]:checked').value,i=wInfo(sel,c);
 if(i.same||i.teamBad)return;
 const a=MOCK.assinatura;
 if(i.tipo==='free'){Modal.close(true);Actions['pn-cancelar']();return}
 if(i.tipo==='agendar'){a.agendada={plano:sel,ciclo:c};a.cancelada=false;save();Modal.close(true);refresh();toast(t('pn.sch.ok',{d:fmtD(a.data_fim)}));return}
 S.c=c;Modal.close(true);Actions['pn-pagar']({dataset:{a:'pn-pagar:'+sel+':'+i.tipo}});
});
Actions['pn-sch-x']=()=>{const a=MOCK.assinatura;a.agendada=null;save();refresh();toast(t('pn.sch.no'))};

/* ---------- pagamentos pendentes, cancelar e reactivar ---------- */
Actions['pn-conf']=(b,id)=>{const p=MOCK.pagamentos.find(x=>x.pagamento_id===id);if(!p||p.estado!=='pendente')return;
 p.estado='confirmado';p.data_confirmacao=new Date().toISOString();aplicar(p);save();refresh();toast(t('pn.conf.ok'))};
Actions['pn-canc']=(b,id)=>{const p=MOCK.pagamentos.find(x=>x.pagamento_id===id);if(!p||p.estado!=='pendente')return;
 p.estado='cancelado';save();refresh();toast(t('pn.canc.ok'))};
Actions['pn-cancelar']=()=>{
 const a=MOCK.assinatura;if(a.plano==='gratuito')return;
 Modal.open({title:t('pn.cs.t'),body:`<p>${esc(t('pn.cs.q',{p:t('plano.'+a.plano),d:fmtD(a.data_fim)}))}</p><div class="mod-f"><button class="btn btn-l" type="button" data-a="modal-close">${t('pn.cs.keep')}</button><button class="btn btn-g" type="button" data-a="pn-cancelar-ok">${t('pn.cs.t')}</button></div>`});
};
Actions['pn-cancelar-ok']=()=>{const a=MOCK.assinatura;if(a.plano==='gratuito')return;a.cancelada=true;a.agendada=null;save();Modal.close(true);refresh();toast(t('pn.cs.done',{d:fmtD(a.data_fim)}))};
Actions['pn-reativar']=()=>{const a=MOCK.assinatura;if(a.plano==='gratuito')return;a.cancelada=false;save();refresh();toast(t('pn.re.done'))};
})();
