/* Página de detalhe: detalhe.html?id=v7  (dados e utilitários vêm de dados.js; textos de i18n.js) */
(function(){
var t=function(k,v){return I18N.t(k,v)};
var q=new URLSearchParams(location.search),o=DATA.filter(function(x){return x.id===q.get('id')})[0];
function here(id){return 'detalhe.html?id='+encodeURIComponent(id)}

/* ---- Cabeçalho, menu, voltar ao topo ---- */
var bt=$('backToTop'),hd=document.querySelector('header');
function sc(){bt.classList.toggle('visible',window.scrollY>400);hd.classList.toggle('scrolled',window.scrollY>20)}
window.addEventListener('scroll',sc,{passive:true});sc();
bt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
function mm(open){$('mm').classList.toggle('open',open);$('hamb').setAttribute('aria-expanded',String(open));document.body.style.overflow=(open||document.querySelector('.lm-modal.open'))?'hidden':''}
$('hamb').addEventListener('click',function(){mm(true)});
$('mmClose').addEventListener('click',function(){mm(false)});
$('mm').addEventListener('click',function(e){if(e.target.closest('a'))mm(false)});
if(LOGGED_IN){var conta='<a class="btn btn-g" href="painel.html" th:href="@{/painel}"><i class="fas fa-user"></i> <span data-i18n="op.account">'+esc(t('op.account'))+'</span></a>';$('authBtns').innerHTML=conta;$('mmAuth').innerHTML=conta}

/* ---- Aviso "Entre para se candidatar" ---- */
function gateText(){
  if(!o)return;
  var ins=o.cat!=='vaga';
  $('gateTitle').textContent=t(ins?'op.gate.titleEnroll':'op.gate.titleApply');
  $('gateTxt').textContent=t(ins?'op.gate.txtEnrollT':'op.gate.txtApplyT',{t:L(o,'t')});
}
function closeGate(){var m=$('gateModal');m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function openGate(next){
  gateText();
  window.LermoAuth.setNext(next);
  document.querySelectorAll('.lm-modal.open').forEach(function(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')});
  var m=$('gateModal');m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(function(){m.querySelector('[data-gate=login]').focus()},60);
}
$('gateClose').addEventListener('click',closeGate);
$('gateModal').addEventListener('mousedown',function(e){if(e.target===$('gateModal'))closeGate()});
$('gateModal').addEventListener('click',function(e){var b=e.target.closest('[data-gate]');if(!b)return;if(b.dataset.gate==='login')window.LermoAuth.openLogin(b);else window.LermoAuth.openReg(b,'candidato')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){mm(false);if($('gateModal').classList.contains('open'))closeGate()}});

/* ---- Candidatar / partilhar ---- */
function apply(){
  if(!isOpen(o)){toast(t('op.toast.closed'));return}
  if(!LOGGED_IN){openGate(here(o.id)+'&aplicar=1');return}
  fetch('/api/candidaturas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({vagaId:o.id})})
   .then(function(r){toast(t(r.ok?'op.toast.sent':'op.toast.fail'))})
   .catch(function(){toast(t('op.toast.preview'))});
}
function share(){
  var url=new URL(here(o.id),location.href).href;
  if(navigator.share){navigator.share({title:L(o,'t')+' — LERMO Recursos',url:url}).catch(function(){})}
  else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast(t('op.toast.copied'))},function(){toast(url)})}
  else toast(url);
}
document.addEventListener('click',function(e){
  var x=e.target.closest('[data-apply],[data-share]');if(!x)return;
  if(x.hasAttribute('data-apply'))apply();else share();
});

/* ---- Conteúdo (refeito sempre que o idioma muda) ---- */
function crumb(last){return '<nav class="crumb" aria-label="'+esc(t('op.crumbAria'))+'"><a href="index.html" th:href="@{/}">'+esc(t('nav.home'))+'</a><span aria-hidden="true">›</span><a href="oportunidades.html" th:href="@{/oportunidades}">'+esc(t('nav.opportunities'))+'</a><span aria-hidden="true">›</span><span>'+esc(last)+'</span></nav>'}
function build(){
  if(!o){
    document.title=t('op.det.nfDoc');
    $('dHero').innerHTML=crumb(t('op.det.nfCrumb'))+'<h1>'+esc(t('op.det.nfTitle'))+'</h1><p>'+esc(t('op.det.nfLead'))+'</p>';
    $('dLayout').style.gridTemplateColumns='1fr';
    $('dLayout').innerHTML='<div class="dcard dnf"><i class="fas fa-magnifying-glass"></i><p>'+esc(t('op.det.nfTxt'))+'</p><a class="btn btn-g" href="oportunidades.html" th:href="@{/oportunidades}">'+esc(t('op.det.nfBtn'))+'</a></div>';
    return;
  }
  var c=CATS[o.cat],pz=prazo(o),open=pz[1]!=='off',ins=o.cat!=='vaga',label=t(ins?'op.enroll':'op.apply');
  var title=L(o,'t'),desc=L(o,'desc'),reqs=L(o,'req'),sal=L(o,'sal');
  document.title=title+' — LERMO Recursos';
  var md=document.querySelector('meta[name=description]');if(md)md.content=title+' — '+o.emp+', '+loc(o)+'. '+desc;
  $('dHero').innerHTML=crumb(title)+'<span class="tag">'+esc(o.tipo?TIPOS[o.tipo]:c[0])+'</span><h1>'+esc(title)+'</h1><div class="emp">'+esc(o.emp)+'</div><span class="dstat '+pz[1]+'"><i class="far fa-clock"></i> '+esc(pz[0])+'</span>';
  var facts=[['fa-location-dot',t('op.fact.place'),loc(o)],['fa-building',t('op.fact.regime'),cap(o.reg)],['fa-calendar-plus',t('op.fact.published'),fmt(o.cri)],['fa-clock',t('op.fact.deadline'),open?fmt(o.lim):t('op.dl.closedOn',{d:fmt(o.lim)})]];
  if(sal)facts.push(['fa-coins',t('op.fact.pay'),sal]);
  var req=reqs&&reqs.length?'<section><h2>'+esc(t('op.det.requirements'))+'</h2><ul>'+reqs.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></section>':'';
  $('dLayout').style.gridTemplateColumns='';
  $('dLayout').innerHTML=
   '<article class="dcard dmain"><section><h2>'+esc(t('op.det.description'))+'</h2><p>'+esc(desc)+'</p></section>'+req+'</article>'+
   '<aside class="dcard dside" aria-label="'+esc(t('op.det.summary'))+'"><div class="facts">'+facts.map(function(f){return '<div><i class="fas '+f[0]+'"></i><span>'+esc(f[1])+'</span><b>'+esc(f[2])+'</b></div>'}).join('')+'</div>'+
   '<div class="acts">'+(open?'<button type="button" class="btn btn-g" data-apply><i class="fas fa-paper-plane"></i> '+esc(label)+'</button>':'<button type="button" class="btn btn-g" disabled>'+esc(t('op.closed'))+'</button>')+'<button type="button" class="btn btn-l" data-share><i class="fas fa-share-nodes"></i> '+esc(t('op.share'))+'</button></div>'+
   (open&&!LOGGED_IN?'<p class="dnote">'+esc(t(ins?'op.det.needEnroll':'op.det.needApply'))+'</p>':'')+'</aside>';

  /* Semelhantes: mesma categoria, do mesmo país primeiro */
  var sim=DATA.filter(function(x){return x.id!==o.id&&x.cat===o.cat&&isOpen(x)}).sort(function(a,b){return (b.pais===o.pais)-(a.pais===o.pais)||b.cri.localeCompare(a.cri)}).slice(0,3);
  if(sim.length){
    $('dSim').innerHTML=sim.map(function(x){var cc=CATS[x.cat],p=prazo(x);
      return '<article class="card"><div class="top"><div class="ic"><i class="fas '+cc[1]+'"></i></div><span class="tag">'+esc(x.tipo?TIPOS[x.tipo]:cc[0])+'</span></div><div><h3>'+esc(L(x,'t'))+'</h3><div class="emp">'+esc(x.emp)+'</div></div><div class="meta"><span><i class="fas fa-location-dot"></i>'+esc(loc(x))+'</span><span><i class="fas fa-building"></i>'+esc(cap(x.reg))+'</span></div><div class="foot"><small class="'+p[1]+'"><i class="far fa-clock"></i> '+esc(p[0])+'</small><a class="btn btn-l" href="'+here(x.id)+'">'+esc(t('op.viewDetails'))+'</a></div></article>'}).join('');
    $('dSimWrap').hidden=false;
  }
}
build();
I18N.onChange(function(){build();gateText()});
if(o&&q.get('aplicar')&&isOpen(o))apply();
})();
