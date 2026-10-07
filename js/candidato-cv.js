'use strict';
/* Leitura do CV anexado e extracção dos campos do perfil (tudo no browser; o ficheiro não sai do dispositivo).
   API: LERMO_CV.texto(file) -> Promise<string>   (PDF via pdf.js, DOCX via mammoth; DOC não é suportado)
        LERMO_CV.analisar(texto,{COMP,IDIOMAS,hoje,na}) -> {resumo,nasc,genero,bairro,exps,forms,comps,idis,texto}
   Em produção a extracção deve passar para o servidor (POST /api/candidato/cv/analisar) e devolver a mesma estrutura. */
(()=>{
const G=typeof window!=='undefined'?window:globalThis;
const CDN='https://cdnjs.cloudflare.com/ajax/libs/',PDFJS=CDN+'pdf.js/3.11.174/',MAMMOTH=CDN+'mammoth/1.6.0/mammoth.browser.min.js';
const LIB={};
const lib=src=>LIB[src]||(LIB[src]=new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>{delete LIB[src];no(new Error('lib'))};document.head.append(s)}));

/* ---------- 1. ficheiro -> texto ---------- */
/* reconstrói linhas a partir dos itens do pdf.js: agrupa por coordenada y e ordena por x; intervalos largos viram « | » */
function linhasPdf(items){
 const its=items.filter(i=>i.str&&i.str.trim()).map(i=>({s:i.str,x:i.transform[4],y:i.transform[5],w:i.width||0}));
 its.sort((a,b)=>b.y-a.y||a.x-b.x);
 const rows=[];let cur=null;
 its.forEach(i=>{if(cur&&Math.abs(cur.y-i.y)<=3)cur.p.push(i);else{cur={y:i.y,p:[i]};rows.push(cur)}});
 return rows.map(r=>{r.p.sort((a,b)=>a.x-b.x);let s='',prev=null;
  r.p.forEach(i=>{s+=prev?((i.x-(prev.x+prev.w))>25?' | ':' '):'';s+=i.s.trim();prev=i});
  return s.replace(/\s+/g,' ').trim()}).filter(Boolean);
}
async function pdfTexto(file){
 await lib(PDFJS+'pdf.min.js');
 const L=G.pdfjsLib;L.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';
 const doc=await L.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise,out=[];
 for(let n=1;n<=Math.min(doc.numPages,10);n++){const tc=await(await doc.getPage(n)).getTextContent();out.push(...linhasPdf(tc.items))}
 return out.join('\n');
}
async function docxTexto(file){
 await lib(MAMMOTH);
 return(await G.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value;
}
async function texto(file){
 const ext=(file.name.split('.').pop()||'').toLowerCase();
 if(ext==='doc')throw new Error('doc');
 const s=ext==='pdf'?await pdfTexto(file):await docxTexto(file);
 if(s.replace(/\s/g,'').length<60)throw new Error('vazio');
 return s;
}

/* ---------- 2. texto -> campos ---------- */
const sem=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const MES={jan:1,fev:2,feb:2,mar:3,abr:4,apr:4,mai:5,may:5,jun:6,jul:7,ago:8,aug:8,set:9,sep:9,out:10,oct:10,nov:11,dez:12,dec:12};
const MON='(?:jan|fev|feb|mar|abr|apr|mai|may|jun|jul|ago|aug|set|sep|out|oct|nov|dez|dec)[a-zç]*\\.?';
const DT='(?:'+MON+'\\s*(?:de\\s+)?(?:19|20)\\d{2}|\\d{1,2}[\\/\\-.](?:19|20)\\d{2}|(?:19|20)\\d{2})';
const PRES='(?:actual|atual|actualidade|atualidade|actualmente|atualmente|presente|present|current|now|hoje|em curso|em andamento|ongoing|a decorrer)';
const SEP='(?:\\s*[-–—]+\\s*|\\s+(?:a|à|até|ate|to|until)\\s+)';
const RANGE=new RegExp('('+DT+')'+SEP+'('+DT+'|'+PRES+')(?![a-z0-9])','i'),PRESRE=new RegExp('^'+PRES+'$','i');
const YEAR1=/\b((?:19|20)\d{2})\b/g,BUL=/^[\-•·▪●*◦►➢✓\uf000-\uf8ff]\s*/;
const EDGE=/^[\s|,;:\-–—•·@]+|[\s|,;:\-–—•·@]+$/g,limpa=s=>s.replace(/\(\s*\)|\[\s*\]/g,' ').replace(EDGE,'').replace(/\s+/g,' ');

function pd(s){s=s.trim();let m;
 if((m=s.match(/^(\d{1,2})[\/\-.]((?:19|20)\d{2})$/)))return{y:+m[2],m:Math.min(12,Math.max(1,+m[1]))};
 if((m=s.match(/^([a-zç]+)\.?\s*(?:de\s+)?((?:19|20)\d{2})$/i)))return{y:+m[2],m:MES[sem(m[1]).slice(0,3)]||1};
 if((m=s.match(/^((?:19|20)\d{2})$/)))return{y:+m[1],m:0};
 return null}
const p2=n=>String(n).padStart(2,'0');
function iso(d,fim,hoje){if(!d)return'';const m=d.m||(fim?12:1),dia=fim?new Date(d.y,m,0).getDate():1,v=d.y+'-'+p2(m)+'-'+p2(dia);return v>hoje?hoje:v}
function intervalo(l,hoje,unico){
 const m=RANGE.exec(l);
 if(m){const a=pd(m[1]),pres=PRESRE.test(m[2].trim()),b=pres?null:pd(m[2]);
  if(a&&(pres||b)){let ini=iso(a,0,hoje),fim=pres?'':iso(b,1,hoje);if(fim&&fim<ini)fim=ini;
   return{ini,fim,actual:pres,rest:limpa(l.replace(m[0],' '))}}}
 if(unico){const ys=l.match(YEAR1);if(ys&&ys.length===1&&l.length<=100){const y=+ys[0],a={y,m:0};
  return{ini:iso(a,0,hoje),fim:iso(a,1,hoje),actual:false,rest:limpa(l.replace(ys[0],' '))}}}
 return null}

const SEC=[['resumo',/^(sobre mim|perfil( profissional| pessoal)?|resumo( profissional| pessoal)?|objectivo( profissional)?|objetivo( profissional)?|apresentacao|about( me)?|summary|professional summary|profile|objective)$/],
 ['exp',/^(experiencia( profissional| de trabalho)?|historico profissional|percurso profissional|work experience|professional experience|experience|employment( history)?)$/],
 ['form',/^(formacao( academica)?( e (profissional|complementar|certificacoes|cursos))?|formacao e (educacao|certificacoes|qualificacoes)|educacao e (formacao|certificacoes)|qualificacoes( academicas)?|estudos( realizados)?|education and (training|certifications)|academic (education|qualifications)|educacao|habilitacoes( literarias| academicas)?( e profissionais)?|percurso academico|education|academic background|qualifications)$/],
 ['comp',/^(competencias( tecnicas| pessoais)?|aptidoes|conhecimentos( tecnicos| informaticos)?|skills|technical skills|soft skills|key skills|informatica)$/],
 ['idi',/^(idiomas|linguas|conhecimento de linguas|languages)$/],
 ['x',/^(areas de especializacao|areas de competencia|areas de actuacao|areas de atuacao|areas de interesse|especializacoes|destaques|dados pessoais|informacao pessoal|informacoes pessoais|personal (details|information|data)|contactos?|contacts?|referencias|references|cursos( e certificacoes)?|certificacoes|certifications|formacao complementar|formacao profissional|interesses|hobbies|projectos|projetos|projects|voluntariado|volunteering|publicacoes|outras informacoes|informacoes adicionais|additional information|declaracao)$/]];
function cabec(l){if(l.length>45)return null;const s=sem(l).replace(/[:\-–—_•·|.]+/g,' ').replace(/\s+/g,' ').trim();
 for(const[k,re]of SEC)if(re.test(s))return k;return null}
function seccoes(L){const o={topo:[],resumo:[],exp:[],form:[],comp:[],idi:[],x:[]};let k='topo';
 L.forEach(l=>{const h=cabec(l);if(h)k=h;else o[k].push(l)});return o}

const INST=/\b(universidade|universidad|universite|instituto|escola|faculdade|colegio|centro|academia|university|institute|college|school|politecnico|liceu|iscte|isctem|ispm|uem|unilurio|udm|unisave|ucm|isutc|isri|ispg|isced|esec|unizambeze|unipungue|iscam|isutc|isap|unilicungo|ispt|iscim|upm|utm|ipg|polytechnic|lyceum|academy|catolica|catholic|instituicao|seminario|conservatorio|madrassa|madrasa)\b/i;
const EMP=/\b(lda|limitada|s\.?a\.?|ltd|inc|corp|ong|banco|group|grupo|unipessoal|empresa|company|ministerio|universidade|hospital|clinica|escola|cooperativa|associacao|fundacao|farmacia|papelaria|supermercado|hotel|restaurante|consultoria|servicos|services|solutions|solucoes|logistica|transportes|construcoes|comercio)\b/i;
const ROLE=/\b(gestor|gerente|assistente|tecnico|analista|engenheiro|manager|developer|desenvolvedor|director|diretor|estagiario|intern|coordenador|oficial|responsavel|motorista|professor|docente|contabilista|secretaria|secretario|operador|supervisor|administrativo|consultor|auxiliar|vendedor|caixa|atendente|designer|programador|enfermeiro|medico|advogado|jurista|formador|monitor|promotor|chefe|lider|especialista|agente|representante|arquitecto|arquiteto|agronomo|electricista|eletricista|mecanico|cozinheiro|empregado|rececionista|recepcionista|seguranca|trainee|voluntario|freelancer|technician|assistant|officer|analyst|engineer|administrator|accountant|teacher|consultant|clerk|cashier|sales|representative|specialist|lead|head)\b/i;
const rolScore=s=>{const x=sem(s);return(ROLE.test(x)?2:0)-(EMP.test(x)?1:0)};
function partir(s){
 let p=s.split(/\s*\|\s*|\s+[-–—@]\s+|\s+(?:na|no|em|at)\s+/i).map(limpa).filter(Boolean);
 if(p.length<2&&/,\s/.test(s))p=s.split(/,\s+/).map(limpa).filter(Boolean);
 return p}

/* divide uma secção em entradas assentes nas linhas com datas; suporta «título + data», «título / empresa / data» e «data / título» */
function entradas(L,hoje,unico,split=partir){
 const hdr=l=>l.length<=90&&!BUL.test(l)&&!((/[a-zà-ÿ]{4,}\.$/i.test(l)||/;$/.test(l))&&l.split(' ').length>=6)&&!intervalo(l,hoje,unico);
 const D=[];L.forEach((l,i)=>{if(l.length<=140&&!BUL.test(l)){const r=intervalo(l,hoje,unico);if(r)D.push({i,r,pieces:r.rest?split(r.rest):[]})}});
 const datasPrimeiro=D.length&&D[0].i===0;
 D.forEach((d,k)=>{const prev=k?D[k-1].i:-1,n=d.pieces.length;d.pre=0;d.post=0;d.head=null;
  if(n>=2){d.head=d.pieces;return}
  const max=n===1?1:2,got=[];
  if(!datasPrimeiro){for(let j=d.i-1;j>prev&&got.length<max&&hdr(L[j]);j--)got.unshift(L[j]);d.pre=got.length}
  else{const nx=k+1<D.length?D[k+1].i:L.length;for(let j=d.i+1;j<nx&&got.length<max&&hdr(L[j]);j++)got.push(L[j]);d.post=got.length}
  d.head=n===1?(datasPrimeiro?[d.pieces[0],...got]:[...got,d.pieces[0]]):got});
 return D.map((d,k)=>{const nx=k+1<D.length?D[k+1]:null,ini=d.i+1+d.post,fim=nx?nx.i-nx.pre:L.length;
  const corpo=L.slice(ini,Math.max(ini,fim)).map(l=>l.replace(BUL,'').trim()).filter(Boolean);
  return{head:d.head.slice(0,3),r:d.r,corpo}})}

function exps(L,hoje,na){
 return entradas(L,hoje,false).map(e=>{
  /* «Cargo | Empresa» ou «Cargo - Empresa» numa só linha: separa; «Empresa, Lda» mantém-se inteiro */
  const H=e.head.length<2?e.head.flatMap(h=>{const p=partir(h);while(p.length>1&&/^(lda|ltd|limitada|s\.?a\.?|inc|unipessoal)$/i.test(p[p.length-1])){const x=p.pop();p[p.length-1]+=', '+x}return p.length?p:[h]}):e.head;
  let a=H[0],b=H[1];if(!a)return null;
  if(b&&rolScore(b)>rolScore(a)){const x=a;a=b;b=x}
  return{cargo:a.slice(0,100),empresa:(b||na).slice(0,150),descricao:e.corpo.join('\n').slice(0,2000),inicio:e.r.ini,fim:e.r.actual?'':e.r.fim,actual:e.r.actual}}).filter(Boolean).slice(0,15)}
function grauDe(s){const x=sem(s);
 return/doutor|phd/.test(x)?'Doutoramento':/mestrado|master|\bmsc\b|\bmba\b/.test(x)?'Mestrado':/licenciatura|licenciado|bacharel|bachelor|\bbsc\b/.test(x)?'Licenciatura':/tecnico|diploma|nivel medio|technical/.test(x)?'Técnico':/ensino (medio|secundario|basico)|\d{1,2}\s*(a|ª|º)?\s*classe|high school|secondary/.test(x)?'Outro':''}
const CURSOW=/\b(licenciatura|licenciado|licenciada|mestrado|doutoramento|bacharelato|bacharel|bachelor|master|doctorate|phd|curso|tecnico|diploma|ensino|classe|nivel|engenharia|gestao|contabilidade|direito|medicina|informatica|tecnologias?|ciencias|administracao|economia|certificado|pos graduacao|especializacao|formacao|degree|course|training)\b/i;
const LABLOC=/^(local|localizacao|localidade|cidade|pais|country|city|location|morada)\s*:/i,LABINST=/^(instituicao|instituição|escola|universidade|faculdade|institution|school|university|college)\s*:\s*/i,LABCURSO=/^(curso|grau|titulo|qualificacao|degree|course|qualification|area)\s*:\s*/i;
const SPLITF=/\s*\|\s*|\s+[-–—]\s+|,\s+|\s+(?:pela|pelo|na|no|at|in)\s+(?=[^,|]*\b(?:universidade|instituto|escola|faculdade|colegio|centro|academia|university|institute|college|school|politecnico|liceu|catolica|unizambeze|isced|iscam|ucm|uem|isctem|ispm|unilurio|udm|unisave|isutc|isri|ispg|esec|unipungue|isap)\b)/i;
/* na linha com a data, só separa por «|», « - » e vírgulas (nunca por «em»: «Licenciatura em X» tem de ficar inteiro) */
const partirF=s=>s.split(/\s*\|\s*|\s+[-–—]\s+|,\s+/).map(limpa).filter(Boolean);
/* linhas de uma entrada -> segmentos classificados (instituição, curso, local) */
function segmentos(linhas){
 const out=[];
 linhas.forEach(l=>{
  if(LABLOC.test(sem(l)))return;                                   /* «Local: Beira» */
  const isI=LABINST.test(sem(l)),isC=LABCURSO.test(sem(l));
  l=l.replace(LABINST,'').replace(LABCURSO,'');
  l.split(SPLITF).map(limpa).filter(Boolean).forEach(sg=>{const x=sem(sg);
   out.push({s:sg,inst:isI||INST.test(x),curso:isC||(!INST.test(x)&&CURSOW.test(x))})})});
 return out}
function forms(L,hoje,na){
 return entradas(L,hoje,true,partirF).map(e=>{
  const cab=segmentos(e.head),cor=segmentos(e.corpo.slice(0,4).filter(l=>l.length<=110));
  /* instituição: primeiro no cabeçalho da entrada, depois nas linhas seguintes (muitos CV põem-na por baixo da data) */
  let inst=(cab.find(x=>x.inst)||cor.find(x=>x.inst)||{}).s;
  let curso=(cab.find(x=>x.curso&&x.s!==inst)||{}).s;
  if(!curso){const r=cab.find(x=>x.s!==inst&&!x.inst);curso=r?r.s:(cor.find(x=>x.curso&&x.s!==inst)||{}).s}
  if(!inst){   /* sem palavra-chave: a parte do cabeçalho que não é curso nem local */
   const r=cab.filter(x=>x.s!==curso&&!x.curso);if(r.length&&cab.length>1)inst=r[0].s;
   else if(cab.length>=2&&!r.length)inst=cab.find(x=>x.s!==curso).s}
  if(!inst&&!curso)return null;
  if(!curso)curso=(e.corpo[0]||na);
  else if(/^(licenciatura|mestrado|doutoramento|bacharelato|bachelor|master|doctorate|phd|curso|tecnico|diploma)$/i.test(sem(curso))){const r=cab.find(x=>x.s!==inst&&x.s!==curso&&!x.inst);if(r)curso=curso+' em '+r.s}
  const fut=!e.r.actual&&e.r.fim&&e.r.fim<=hoje;
  const grau=grauDe(cab.map(x=>x.s).join(' ')+' '+e.corpo.slice(0,2).join(' ')),semGrau=curso.replace(/^(?:curso\s+(?:de\s+)?)?(?:licenciatura|licenciado|licenciada|mestrado|doutoramento|bacharelato|bachelor(?:'s)?|master(?:'s)?|doctorate|phd)\s+(?:em|de|in|of)\s+/i,'').trim();
  if(grau&&semGrau&&semGrau.length>=3)curso=semGrau.charAt(0).toUpperCase()+semGrau.slice(1);
  if(inst&&/^cat[oó]lica\b/i.test(inst))inst='Universidade '+inst;   /* «Católica de Moçambique» -> nome completo */
  return{instituicao:(inst||na).replace(/\s*\(\s*\)\s*/g,'').slice(0,150),curso:curso.slice(0,150),grau,inicio:e.r.ini,fim:fut?e.r.fim:'',concluido:!!fut}}).filter(Boolean).slice(0,10)}

const CA={1:['excel'],2:['microsoft word','ms word','*word'],3:['html','css'],4:['javascript','*js'],5:['python'],6:['sql','mysql','postgresql'],7:['contabilidade','contabilista','accounting'],8:['gestao de projecto','gestao de projeto','project management'],
 23:['microsoft office','ms office','pacote office','office 365','microsoft 365','pacote microsoft office'],24:['powerpoint','power point','ppt'],25:['outlook'],26:['microsoft access','ms access'],27:['microsoft teams'],28:['onenote'],29:['microsoft project','ms project'],30:['visio'],31:['power bi'],32:['google workspace','google docs','google sheets','g suite'],33:['libreoffice','openoffice','open office'],34:['dactilografia','typing'],
 37:['java'],38:['c#','csharp'],39:['php'],40:['c++'],41:['react','reactjs'],42:['node.js','nodejs','node js'],43:['spring boot'],44:['android','flutter'],45:['git','github','gitlab'],46:['linux','ubuntu'],47:['windows server','active directory'],48:['redes de computadores','cisco','tcp/ip','ccna','administracao de redes','network administration'],49:['ciberseguranca','cybersecurity','seguranca informatica'],50:['administracao de bases de dados','dba'],51:['aws','azure','computacao em nuvem','cloud computing'],52:['docker','devops','kubernetes'],53:['suporte tecnico','helpdesk','help desk','technical support'],54:['manutencao de computadores','hardware'],55:['analise de dados','data analysis'],56:['machine learning','inteligencia artificial'],57:['wordpress','desenvolvimento web','web development'],58:['ux','ui design','figma'],59:['testes de software','software testing'],60:['vmware','hyper-v','virtualizacao'],
 9:['design grafico','graphic design','photoshop','illustrator','coreldraw','canva'],10:['marketing digital','digital marketing','seo'],11:['redes sociais','social media'],12:['atendimento ao cliente','customer service','atendimento ao publico'],
 13:['traducao','translation','tradutor'],14:['agronomia','agronomo','agronomy'],15:['comunicacao','communication'],16:['trabalho em equipa','trabalho de equipa','trabalho em equipe','teamwork','team work'],17:['lideranca','leadership'],
 18:['resolucao de problemas','problem solving'],19:['gestao do tempo','time management'],20:['criatividade','creativity'],21:['adaptabilidade','adaptability'],22:['pensamento critico','critical thinking']};
const nivC=x=>/avancad|advanced|expert|excelente/.test(x)?'Avançado':/basic|iniciante|beginner|noc[oõ]es/.test(x)?'Básico':'Intermediário';
const alias=(COMP,id)=>[...(CA[id]||[]),...COMP.filter(c=>c[0]===id).flatMap(c=>[sem(c[1]),sem(c[2])])],
 reA=a=>new RegExp('(^|[^a-z0-9])'+esc(a)+'(?![a-z0-9])');
function comps(S,full,COMP){
 const ids=new Set(COMP.map(c=>c[0])),dem=new Map();
 S.comp.forEach(l=>sem(l).split(/[,;|•·]+/).forEach(x=>ids.forEach(id=>{if(!dem.has(id)&&alias(COMP,id).some(a=>reA(a.replace(/^\*/,'')).test(x)))dem.set(id,nivC(x))})));
 const x=sem(full);
 ids.forEach(id=>{const c=COMP.find(k=>k[0]===id);if((c[3]==='o'||c[3]==='d'||id<=14)&&!dem.has(id)&&alias(COMP,id).some(a=>a[0]!=='*'&&reA(a).test(x)))dem.set(id,'Intermediário')});
 return[...dem].map(([id,nivel])=>({id,nivel}))}
/* itens da secção de competências que não existem no catálogo -> ficam como «Outro» (nome livre) */
const NIVW=/^(basico|intermedio|intermediario|avancado|fluente|nativo|bom|muito bom|excelente|advanced|basic|intermediate|expert|beginner|nivel \w+|level \w+)$/;
function outros(S,COMP){
 const ids=COMP.map(c=>c[0]),out=[],vistos=new Set();
 S.comp.forEach(l=>{const r=l.replace(BUL,''),i=r.indexOf(':'),lista=i>=0&&i<60?r.slice(i+1):r;
  lista.replace(/\b(TCP|CI|I|WLAN|LAN)\s*\/\s*(IP|CD|O|WAN)\b/gi,'$1\u2215$2').replace(/\bwi\s*[-–—]?\s*fi\b/gi,'Wi\u2011Fi').split(/[,;|•·\/]+|\s+[-–—]\s+/).forEach(p=>{p=p.replace(/\u2215/g,'/').replace(/\u2011/g,'-');
   let it=limpa(p.replace(/\([^)]*\)/g,' ').replace(BUL,''));const x=sem(it);
   if(it.length<2||it.length>40||it.split(' ').length>4||!/^[A-Za-zÀ-ÿ]/.test(it)||/^\d+$/.test(x)||NIVW.test(x)||vistos.has(x))return;
   if(/\b(conhecimentos?|dominio|experiencia|capacidade de|habilidade|boa|bom|excelente|knowledge|proficiency|ability)\b/.test(x)&&it.split(' ').length>2)return;
   if(ids.some(id=>alias(COMP,id).some(a=>reA(a.replace(/^\*/,'')).test(x))))return;
   if(Object.values(IA).some(v=>v.some(a=>x===a)))return;
   vistos.add(x);out.push(it.charAt(0).toUpperCase()+it.slice(1))})});
 return out.slice(0,12)}
const IA={1:['portugues','portuguese'],2:['ingles','english'],3:['espanhol','spanish','castelhano'],4:['frances','french'],5:['alemao','german'],6:['italiano','italian'],7:['suaili','swahili'],8:['changana','xichangana'],9:['ronga','xironga']};
function nivI(x){return/nativ|native|materna|mother tongue/.test(x)?'Nativo':/fluente|fluent|\bc[12]\b|proficien/.test(x)?'Fluente':/muito bom|very good|avancad|advanced|\bb2\b/.test(x)?'Avançado':
 /basic|elementar|iniciante|beginner|\ba[12]\b|pouco|fraco|escolar/.test(x)?'Básico':'Intermediário'}
function idis(S,IDIOMAS){const ids=new Set(IDIOMAS.map(i=>i[0])),o=new Map();
 S.idi.forEach(l=>sem(l).split(/[,;|\/]+/).forEach(p=>ids.forEach(id=>{if(!o.has(id)&&(IA[id]||[]).some(a=>new RegExp('(^|[^a-z])'+a+'(?![a-z])').test(p)))o.set(id,nivI(p))})));
 return[...o].map(([id,nivel])=>({id,nivel}))}

function pessoais(full,hoje){
 const x=sem(full),o={};let m;
 m=x.match(/(?:data de nascimento|nascimento|nascid[oa] em|date of birth|born(?: on)?)\s*[:\-–]?\s*(\d{1,2})\s*(?:[\/\-.]|de)\s*(\d{1,2}|[a-z]+)\s*(?:[\/\-.]|de)\s*((?:19|20)\d{2})/);
 if(m){const d=+m[1],mo=/^\d+$/.test(m[2])?+m[2]:MES[m[2].slice(0,3)],y=+m[3];
  if(mo>=1&&mo<=12&&d>=1&&d<=new Date(y,mo,0).getDate()){const v=y+'-'+p2(mo)+'-'+p2(d);if(v>='1920-01-01'&&v<=hoje)o.nasc=v}}
 m=x.match(/(?:sexo|genero|gender)\s*[:\-–]?\s*(masculino|feminino|male|female)/);
 if(m)o.genero=/^(masculino|male)$/.test(m[1])?'Masculino':'Feminino';
 m=full.match(/bairro\s*[:\-–]?\s*([^\n|;,]{2,60})/i);if(m)o.bairro=limpa(m[1]).slice(0,80);
 return o}
function resumo(S){
 const s=S.resumo.map(l=>l.replace(BUL,'')).join(' ').replace(/\s+/g,' ').trim();if(!s)return'';
 if(s.length<=1200)return s;const c=s.slice(0,1200),i=Math.max(c.lastIndexOf('. ')+1,c.lastIndexOf(' '));return(i>600?c.slice(0,i):c).replace(/[,;:\s]+$/,'')}

function analisar(txt,{COMP,IDIOMAS,hoje,na='N/D'}){
 const L=txt.replace(/\r/g,'').split('\n').map(l=>l.replace(/[\t\u00a0]+/g,' ').replace(/\s{2,}/g,' ').trim()).filter(Boolean),
  S=seccoes(L),full=L.join('\n'),p=pessoais(full,hoje);
 return{resumo:resumo(S),nasc:p.nasc||'',genero:p.genero||'',bairro:p.bairro||'',
  exps:exps(S.exp,hoje,na),forms:forms(S.form,hoje,na),comps:comps(S,full,COMP),outros:outros(S,COMP),idis:idis(S,IDIOMAS),
  texto:full.replace(/[^\S\n]+/g,' ').slice(0,30000)}}

G.LERMO_CV={texto,analisar,_linhasPdf:linhasPdf};
if(typeof module!=='undefined')module.exports=G.LERMO_CV;
})();
