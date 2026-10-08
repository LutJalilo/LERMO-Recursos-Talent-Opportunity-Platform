'use strict';
(function(){
var I=window.LermoI18n,$=function(i){return document.getElementById(i)},res=$('res'),last='';

/* DEMO: em produção trocar por GET /api/formacao/certificados/{codigo}, que devolve só {valido,nome,programa,entidade,horas,emitido_em,signatario_nome,signatario_cargo,assinatura_digital (primeiros 24 caracteres, em grupos de 4)}. */
var REG={'LRM-FM-2026-00417':{nome:'Candidato (demonstração)',programa:'Elaboração de Plano de Negócio',entidade:'Centro de Formação Técnica',horas:60,emitido:'2026-09-02',assinado:'Guinelson Ernesto',cargo:'Director Administrativo',id:'7B89 5786 8B61 5696 B9DA D37D'}};

function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function icone(nome){var i=el('i','fas '+nome);i.setAttribute('aria-hidden','true');return i}

function mostra(cod){
  last=(cod||'').trim().toUpperCase();res.textContent='';if(!last)return;
  var r=REG[last],box;
  if(r){
    box=el('div','vok');var h=el('h2');h.append(icone('fa-circle-check'),I.t('vf.ok'));box.append(h);
    var dl=el('dl');
    [['vf.l.cod',last],['vf.l.nome',r.nome],['vf.l.prog',r.programa],['vf.l.ent',r.entidade],['vf.l.dur',I.t('vf.horas',{n:r.horas})],
     ['vf.l.em',new Date(r.emitido+'T00:00:00').toLocaleDateString(I.locale(),{day:'numeric',month:'long',year:'numeric'})],
     ['vf.l.ass',r.assinado+' — '+r.cargo],['vf.l.id',r.id]
    ].forEach(function(x){dl.append(el('dt',null,I.t(x[0])),el('dd',null,x[1]))});
    box.append(dl);
  }else{
    box=el('div','vno');var h2=el('h2');h2.append(icone('fa-circle-xmark'),I.t('vf.no'));box.append(h2,el('p',null,I.t('vf.nop')));
  }
  res.append(box);
}
$('f').addEventListener('submit',function(e){e.preventDefault();mostra($('c').value)});
I.onChange(function(){if(last)mostra(last)});
var q=new URLSearchParams(location.search).get('c');if(q){$('c').value=q;mostra(q)}

/* ---- Cabeçalho, menu, voltar ao topo (igual às outras páginas públicas) ---- */
var bt=$('backToTop'),hd=document.querySelector('header');
function sc(){bt.classList.toggle('visible',window.scrollY>400);hd.classList.toggle('scrolled',window.scrollY>20)}
window.addEventListener('scroll',sc,{passive:true});sc();
bt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
function mm(open){$('mm').classList.toggle('open',open);$('hamb').setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''}
$('hamb').addEventListener('click',function(){mm(true)});
$('mmClose').addEventListener('click',function(){mm(false)});
$('mm').addEventListener('click',function(e){if(e.target.closest('a'))mm(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')mm(false)});
})();
