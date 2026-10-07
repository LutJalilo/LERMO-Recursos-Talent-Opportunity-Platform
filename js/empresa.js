'use strict';
/* Dados de demonstração do painel da empresa (sem API). Segue o SQL v5.10.
   - Vagas e candidaturas demo: carregam sempre que a empresa ainda não tem vagas (copiadas das vagas do painel do candidato, js/dados.js).
     Para as desligar: acrescentar ?demo=0 ao endereço.
   - Perfil demo («Tecnologias Índico»): só com ?demo=1, para não substituir os dados reais da conta.
   Em produção, remover este ficheiro: tudo vem de GET /api/empresa/vagas. */
(()=>{const q=new URLSearchParams(location.search).get('demo');if(q==='0')return;
const dia=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)},iso=n=>new Date(Date.now()+n*864e5).toISOString();
if(!Array.isArray(MOCK.vagas))MOCK.vagas=[];
if(!MOCK.vagas.length){
/* V(id, título, tipo_id[1 estágio·2 efectivo·3 trainee·4 freelance], regime_id[1 presencial·2 híbrido·3 remoto], país, província, cidade, [mín, máx, moeda], estado, prazo(dias), visualizações, criada(dias), descrição, requisitos, competências[ids], idiomas[ids]) */
const V=(id,titulo,tipo,reg,pais,prov,cid,pay,estado,lim,vis,cr,desc,req,sk,lg)=>({vaga_id:id,titulo,titulo_en:null,descricao:desc,descricao_en:null,responsabilidades:null,requisitos:req,requisitos_en:[],tipo_id:tipo,regime_id:reg,pais_id:pais,provincia:prov,cidade:cid||null,remuneracao_minima:pay?pay[0]:null,remuneracao_maxima:pay?pay[1]:null,remuneracao_visivel:!!pay,moeda:pay?pay[2]:'MZN',data_limite:dia(lim),estado,vagas_disponiveis:1,visualizacoes:vis,criado_em:iso(cr),competencias:sk||[],idiomas:lg||[]});
MOCK.vagas=[
V('d1','Estagiário(a) de Contabilidade',1,1,'MZ','Maputo-Cidade','',[15000,20000,'MZN'],'aberta',19,167,-16,'Apoio à equipa de auditoria e contabilidade, com acompanhamento de um mentor.',['Estudante finalista ou recém-licenciado em Contabilidade','Domínio de Excel','Vontade de aprender'],[1,7],[1]),
V('d2','Técnico(a) de Recursos Humanos',2,1,'MZ','Sofala','',null,'aberta',9,214,-18,'Gestão de processos de recrutamento, admissões e formação interna.',['Licenciatura em Gestão de RH ou similar','2 anos de experiência','Inglês intermédio'],[2],[1,2]),
V('d3','Programa Trainee — Gestão Comercial',3,2,'MZ','Maputo-Cidade','',[25000,25000,'MZN'],'aberta',30,302,-11,'Programa de 12 meses com rotação por várias áreas comerciais.',['Licenciatura concluída há menos de 2 anos','Boa comunicação','Disponibilidade para viajar'],[8,10],[1,2]),
V('d4','Designer Gráfico (projecto)',4,3,'MZ','Nampula','',null,'aberta',4,98,-14,'Criação de identidade visual e materiais de campanha para cliente do sector agrícola.',['Portefólio actualizado','Figma / Illustrator','Entrega dentro de prazos'],[9],[1]),
V('d5','Estagiário(a) de Engenharia Informática',1,2,'MZ','Maputo-Província','',[12000,12000,'MZN'],'aberta',24,187,-21,'Desenvolvimento web, suporte técnico e documentação.',['Frequência de Eng. Informática','HTML, CSS e JavaScript','Trabalho em equipa'],[3,4,6],[1,2]),
V('d6','Agrónomo(a) de Campo',2,1,'MZ','Zambézia','',null,'aberta',14,76,-26,'Acompanhamento técnico de produtores e monitorização de culturas.',['Licenciatura em Agronomia','Carta de condução','Residência em Quelimane'],[],[1]),
V('d7','Analista de Dados Júnior',2,2,'PT','Lisboa','',[1100,1400,'EUR'],'aberta',35,121,-9,'Preparação de relatórios e dashboards para clientes de vários sectores.',['Licenciatura em áreas quantitativas','SQL e Excel','Inglês intermédio'],[1,5,6],[1,2]),
V('d8','Estagiário(a) de Marketing Digital',1,3,'BR','São Paulo','',[1800,1800,'BRL'],'rascunho',22,0,-3,'Apoio à gestão de redes sociais, conteúdo e campanhas pagas.',['Estudante de Marketing ou Comunicação','Boa escrita','Conhecimentos de redes sociais'],[10],[1]),
V('d9','Programa Trainee — Engenharia Civil',3,1,'AO','Luanda','',null,'rascunho',27,0,-2,'Acompanhamento de obra e fiscalização com rotação por vários projectos.',['Licenciatura em Engenharia Civil','Disponibilidade para obra','Carta de condução'],[8],[1]),
V('d10','Tradutor(a) Português–Inglês',4,3,'ZA','Western Cape','Cidade do Cabo',null,'fechada',-6,302,-45,'Tradução de documentos técnicos e comerciais, por projecto.',['Fluência em português e inglês','Experiência comprovada em tradução','Cumprimento de prazos'],[2],[1,2])];
const C=(i,v,e,d)=>({id:'dc'+i,vaga_id:v,estado:e,em:dia(-d)});
MOCK.candidaturas=[C(1,'d1','candidatou_se',1),C(2,'d1','candidatou_se',2),C(3,'d1','em_analise',4),C(4,'d1','entrevista',6),C(5,'d2','candidatou_se',3),C(6,'d2','em_analise',7),C(7,'d2','entrevista',8),C(8,'d3','candidatou_se',0),C(9,'d3','candidatou_se',1),C(10,'d3','em_analise',5),C(11,'d5','candidatou_se',2),C(12,'d5','em_analise',6),C(13,'d4','candidatou_se',3),C(14,'d7','candidatou_se',1),C(15,'d10','contratado',20),C(16,'d10','rejeitado',24)];
MOCK.vagasConsumidas=MOCK.vagas.filter(v=>v.estado!=='rascunho').length;
MOCK.membros=MOCK.membros||2;MOCK.convites=MOCK.convites||1;
MOCK.publicacoes=MOCK.publicacoes||{formacao:{n:1,i:18},eventos:{n:2,i:46},financiamento:{n:1,i:5},empreendedorismo:{n:0,i:0},marketplace:{n:3,i:2}};
MOCK.actividade=MOCK.actividade||[{tipo:'candidatura',texto:'Nova candidatura a Técnico(a) de Recursos Humanos',em:iso(0)},{tipo:'inscricao',texto:'3 novas inscrições no evento Feira de Emprego 2026',em:iso(-1)},{tipo:'pagamento',texto:'Pagamento do plano Premium confirmado',em:iso(-5)},{tipo:'equipa',texto:'Convite enviado a um novo recrutador',em:iso(-6)}]}
if(q==='1')Object.assign(MOCK.empresa,{nome:'Tecnologias Índico',sector:'tecnologia',tamanho:'51-200',ano:2014,descricao:'Soluções de software e consultoria digital para empresas em Moçambique.',visao:'Ser a referência regional em transformação digital.',email:'rh@indico.co.mz',telefone:'+258 84 000 0001',website:'https://www.indico.co.mz',pais:'MZ'});
})();
