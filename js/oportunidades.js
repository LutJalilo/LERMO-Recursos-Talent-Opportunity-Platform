/* Lista de oportunidades. Dados, rótulos e utilitários vêm de dados.js; textos de i18n.js. */
var t=function(k,v){return I18N.t(k,v)};
var st={cat:'',tipos:[],reg:'',pais:'',prov:'',sal:false,open:true,q:'',sort:'new',n:9};
var gateId=null;

function byName(a,b){return paisNome(a).localeCompare(paisNome(b),I18N.locale())}
function buildStatic(){
  $('fTipo').innerHTML=Object.keys(TIPOS).map(function(k){return '<label class="chk"><input type="checkbox" value="'+k+'" class="ft"'+(st.tipos.indexOf(k)>=0?' checked':'')+' /> '+esc(TIPOS[k])+'</label>'}).join('');
  var ps=[];DATA.forEach(function(o){if(o.pais&&ps.indexOf(o.pais)<0)ps.push(o.pais)});
  ps.sort(byName);
  var cnt={};DATA.forEach(function(o){if(o.pais)cnt[o.pais]=(cnt[o.pais]||0)+1});
  var outros=LERMO_PAISES.map(function(p){return p[0]}).filter(function(c){return ps.indexOf(c)<0}).sort(byName);
  var opt=function(c,n){return '<option value="'+c+'">'+esc(paisNome(c))+(n?' ('+n+')':'')+'</option>'};
  var sel=$('fPais').value||st.pais;
  $('fPais').innerHTML='<option value="">'+esc(t('op.f.allCountries'))+'</option>'+(ps.length?'<optgroup label="'+esc(t('op.f.withOpps'))+'">'+ps.map(function(c){return opt(c,cnt[c])}).join('')+'</optgroup>':'')+'<optgroup label="'+esc(t('op.f.otherCountries',{n:outros.length}))+'">'+outros.map(function(c){return opt(c)}).join('')+'</optgroup>';
  $('fPais').value=sel||'';
  fillRegions($('fProv').value||st.prov);
  var emps=[];DATA.forEach(function(o){if(emps.indexOf(o.emp)<0)emps.push(o.emp)});
  $('stats').innerHTML='<div><b>'+DATA.filter(isOpen).length+'</b><span>'+esc(t('op.stats.open'))+'</span></div><div><b>'+ps.length+'</b><span>'+esc(t(ps.length===1?'op.stats.country':'op.stats.countries'))+'</span></div><div><b>'+emps.length+'</b><span>'+esc(t('op.stats.entities'))+'</span></div>';
}
function fillRegions(sel){
  var pais=$('fPais').value,f=$('fProv'),rs=[];
  if(pais){
    rs=(REGIOES[pais]||'').split('|').filter(Boolean);
    DATA.forEach(function(o){if(o.pais===pais&&o.prov&&rs.indexOf(o.prov)<0)rs.push(o.prov)});
    rs.sort(function(x,y){return provL(x).localeCompare(provL(y),I18N.locale())});
  }
  var vazio=!pais?t('op.f.regionFirst'):(rs.length?t('op.f.regionAll'):t('op.f.regionNone'));
  f.innerHTML='<option value="">'+esc(vazio)+'</option>'+rs.map(function(r){return '<option value="'+esc(r)+'">'+esc(provL(r))+'</option>'}).join('');
  f.disabled=!rs.length;
  f.value=(sel&&rs.indexOf(sel)>=0)?sel:'';
}
function filtered(skipCat){
  var q=norm(st.q);
  var r=DATA.filter(function(o){
    if(!skipCat&&st.cat&&o.cat!==st.cat)return false;
    if(st.tipos.length&&(o.cat!=='vaga'||st.tipos.indexOf(o.tipo)<0))return false;
    if(st.reg&&o.reg!==st.reg)return false;
    if(st.pais&&o.pais!==st.pais)return false;
    if(st.prov&&o.prov!==st.prov)return false;
    if(st.sal&&!o.sal)return false;
    if(st.open&&!isOpen(o))return false;
    if(q&&norm(L(o,'t')+' '+o.emp+' '+L(o,'desc')+' '+provL(o.prov)+' '+cidL(o.cid||'')+' '+paisNome(o.pais)+' '+(o.tipo?TIPOS[o.tipo]:'')+' '+CATS[o.cat][0]).indexOf(q)<0)return false;
    return true});
  r.sort(function(a,b){return st.sort==='close'?a.lim.localeCompare(b.lim):b.cri.localeCompare(a.cri)});
  return r;
}
function cardHtml(o){
  var c=CATS[o.cat],pz=prazo(o),open=pz[1]!=='off',sal=L(o,'sal'),d=dias(o),mid='om-'+o.id;
  var mi=function(a,ic,k){return '<button class="mi" type="button" role="menuitem" '+a+'><i class="fas '+ic+'" aria-hidden="true"></i><span>'+esc(t(k))+'</span></button>'};
  var menu='<div class="dd"><button class="ib" type="button" data-menu="'+mid+'" aria-haspopup="true" aria-expanded="false" aria-label="'+esc(t('op.more.opts')+': '+L(o,'t'))+'"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button>'+
   '<div class="menu" id="'+mid+'" role="menu">'+mi('data-view="'+o.id+'"','fa-eye','op.details')+(open?mi('data-apply="'+o.id+'"',o.cat==='vaga'?'fa-paper-plane':'fa-user-plus',o.cat==='vaga'?'op.apply':'op.enroll'):'')+mi('data-share="'+o.id+'"','fa-share-nodes','op.share')+'</div></div>';
  var tags='<span class="tag '+(open?'ok':'no')+'">'+esc(open?t('op.status.open'):t('op.closed'))+'</span>'+(o.tipo?'<span class="tag in">'+esc(TIPOS[o.tipo])+'</span>':'<span class="tag in">'+esc(c[0])+'</span>')+'<span class="tag in">'+esc(cap(o.reg))+'</span>';
  var prazoTxt=esc(t('op.fact.deadline'))+': '+esc(fmt(o.lim))+(open&&d<=35?' · <b class="dl'+(d<=7?' warn':'')+'">'+esc(d===0?t('op.dl.today'):t(d===1?'op.dl.day':'op.dl.days',{n:d}))+'</b>':'');
  return '<article class="card oc'+(open?'':' closed')+'"><div class="oc-h"><span class="oc-ic" aria-hidden="true"><i class="fas '+c[1]+'"></i></span><div class="oc-ti"><h3><a href="detalhe.html?id='+encodeURIComponent(o.id)+'">'+esc(L(o,'t'))+'</a></h3><small>'+esc(o.emp)+'</small></div>'+menu+'</div>'+
  '<div class="oc-tags">'+tags+'</div>'+
  '<ul class="oc-l"><li><i class="fas fa-location-dot" aria-hidden="true"></i><span>'+esc(loc(o))+'</span></li><li><i class="fas fa-clock" aria-hidden="true"></i><span>'+prazoTxt+'</span></li>'+(sal?'<li><i class="fas fa-coins" aria-hidden="true"></i><span>'+esc(sal)+'</span></li>':'')+'</ul>'+
  '<div class="oc-bt"><a class="btn btn-l" href="detalhe.html?id='+encodeURIComponent(o.id)+'">'+esc(t('op.details'))+'</a>'+
  (open?'<button class="btn btn-g" type="button" data-apply="'+o.id+'">'+esc(t(o.cat==='vaga'?'op.apply':'op.enroll'))+'</button>':'<button class="btn btn-g" type="button" disabled>'+esc(t('op.closed'))+'</button>')+'</div></article>';
}
function closeMenus(except){
  document.querySelectorAll('.oc .menu.on').forEach(function(m){
    if(m===except)return;
    m.classList.remove('on');m.closest('.oc').classList.remove('menu-open');
    var b=m.previousElementSibling;if(b)b.setAttribute('aria-expanded','false');
  });
}
function toggleMenu(btn){
  var m=document.getElementById(btn.dataset.menu),on=!m.classList.contains('on');
  closeMenus(on?m:null);
  m.classList.toggle('on',on);m.closest('.oc').classList.toggle('menu-open',on);
  btn.setAttribute('aria-expanded',String(on));
  if(on){var f=m.querySelector('.mi');if(f)f.focus()}
}
function renderTabs(){
  var base=filtered(true),h='<button class="tab'+(st.cat?'':' on')+'" role="tab" aria-selected="'+(!st.cat)+'" data-cat="">'+esc(t('op.tabs.all'))+' <b>'+base.length+'</b></button>';
  Object.keys(CATS).forEach(function(k){
    var n=base.filter(function(o){return o.cat===k}).length;
    h+='<button class="tab'+(st.cat===k?' on':'')+'" role="tab" aria-selected="'+(st.cat===k)+'" data-cat="'+k+'"><i class="fas '+CATS[k][1]+'"></i> '+esc(CATS[k][0])+' <b>'+n+'</b></button>';
  });
  $('tabs').innerHTML=h;
}
function renderChips(){
  var c=[];
  if(st.q)c.push(['q','',"“"+st.q+"”"]);
  st.tipos.forEach(function(x){c.push(['tipo',x,TIPOS[x]])});
  if(st.reg)c.push(['reg','',cap(st.reg)]);
  if(st.pais)c.push(['pais','',paisNome(st.pais)]);
  if(st.prov)c.push(['prov','',provL(st.prov)]);
  if(st.sal)c.push(['sal','',t('op.chip.paid')]);
  var h=c.map(function(x){return '<button type="button" class="chip" data-rm="'+x[0]+'" data-v="'+esc(x[1])+'" aria-label="'+esc(t('op.chip.remove',{x:x[2]}))+'">'+esc(x[2])+' <i class="fas fa-xmark"></i></button>'}).join('');
  if(c.length>1)h+='<button type="button" class="chip clr" data-rm="all">'+esc(t('op.chip.clearAll'))+'</button>';
  $('chips').innerHTML=h;
}
function removeChip(k,v){
  if(k==='all'){$('clear').click();return}
  if(k==='q')$('q').value='';
  else if(k==='tipo'){var e=document.querySelector('.ft[value="'+v+'"]');if(e)e.checked=false}
  else if(k==='reg')$('fReg').value='';
  else if(k==='pais'){$('fPais').value='';fillRegions()}
  else if(k==='prov')$('fProv').value='';
  else if(k==='sal')$('fSal').checked=false;
  readForm();
}
function carSync(){var r=document.getElementById('ocRow');if(!r)return;
  var p=document.querySelector('[data-car="-1"]'),n=document.querySelector('[data-car="1"]');
  if(p)p.disabled=r.scrollLeft<=2;if(n)n.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-2}
function carGo(d){var r=document.getElementById('ocRow'),c=r&&r.querySelector('.oc');if(!c)return;
  var w1=c.getBoundingClientRect().width+(parseFloat(getComputedStyle(r).columnGap)||16),k=Math.max(1,Math.floor((r.clientWidth+1)/w1)); /* uma página = os cartões visíveis (3 no computador) */
  r.scrollBy({left:d*w1*k,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}
document.addEventListener('scroll',function(e){if(e.target&&e.target.id==='ocRow')carSync()},true);
addEventListener('resize',carSync);
function render(){
  var r=filtered();
  $('count').textContent=t(r.length===1?'op.count1':'op.countN',{n:r.length});
  $('mres').textContent=t(r.length===1?'op.f.result1':'op.f.resultN',{n:r.length});
  renderTabs();renderChips();
  /* carrossel: desliza com o dedo (telemóvel); no computador, com 3 ou mais cartões, Anterior/Próximo + barra de rolagem */
  var g=$('grid');g.className=r.length?'oc-car':'grid';
  g.innerHTML=r.length?'<div class="oc-carw"><div class="oc-row" id="ocRow" tabindex="0" role="region" aria-label="'+esc(t('op.car.nav'))+'">'+r.map(cardHtml).join('')+'</div>'+
   (r.length<3?'':'<nav class="oc-nav" aria-label="'+esc(t('op.car.nav'))+'"><button class="btn btn-l" type="button" data-car="-1" disabled><i class="fas fa-chevron-left" aria-hidden="true"></i> '+esc(t('op.car.prev'))+'</button><button class="btn btn-l" type="button" data-car="1">'+esc(t('op.car.next'))+' <i class="fas fa-chevron-right" aria-hidden="true"></i></button></nav>')+'</div>'
   :'<div class="empty"><i class="fas fa-magnifying-glass"></i><p>'+esc(st.pais?t('op.empty.country',{p:paisNome(st.pais)+(st.prov?' ('+provL(st.prov)+')':'')}):t('op.empty.any'))+'<br>'+esc(t('op.empty.try'))+'</p><button type="button" class="btn btn-l" data-rm="all">'+esc(t('op.empty.clear'))+'</button></div>';
  $('more').innerHTML='';
  setTimeout(carSync,60);
  var p=new URLSearchParams();
  if(st.cat)p.set('cat',st.cat);if(st.q)p.set('q',st.q);if(st.reg)p.set('regime',st.reg);if(st.pais)p.set('pais',st.pais);if(st.prov)p.set('regiao',st.prov);if(st.tipos.length)p.set('tipo',st.tipos.join(','));
  history.replaceState(null,'',p.toString()?'?'+p:location.pathname);
}
function find(id){return DATA.filter(function(o){return o.id===id})[0]}
function view(id,aplicar){location.href='detalhe.html?id='+encodeURIComponent(id)+(aplicar?'&aplicar=1':'')}
function share(id){
  var o=find(id);if(!o)return;
  var url=new URL('detalhe.html?id='+encodeURIComponent(id),location.href).href;
  if(navigator.share){navigator.share({title:L(o,'t')+' — LERMO Recursos',url:url}).catch(function(){})}
  else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast(t('op.toast.copied'))},function(){toast(url)})}
  else toast(url);
}
function gateText(){
  var o=find(gateId);if(!o)return;
  var ins=o.cat!=='vaga';
  $('gateTitle').textContent=t(ins?'op.gate.titleEnroll':'op.gate.titleApply');
  $('gateTxt').textContent=t(ins?'op.gate.txtEnrollT':'op.gate.txtApplyT',{t:L(o,'t')});
}
function openGate(id,next){
  gateId=id;gateText();
  window.LermoAuth.setNext(next);
  document.querySelectorAll('.lm-modal.open').forEach(function(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')});
  var m=$('gateModal');m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(function(){m.querySelector('[data-gate=login]').focus()},60);
}
function closeGate(){var m=$('gateModal');m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow='';gateId=null}
function apply(id){
  var oo=find(id);if(oo&&!isOpen(oo)){toast(t('op.toast.closed'));return}
  var next='oportunidades.html?aplicar='+encodeURIComponent(id);
  if(!LOGGED_IN){
    /* Sem sessão: pede para entrar ou criar conta (e depois volta a esta oportunidade) */
    openGate(id,next);return;
  }
  /* Sessão activa: submeter candidatura (ajustar ao teu endpoint) */
  fetch('/api/candidaturas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({vagaId:id})})
   .then(function(r){toast(t(r.ok?'op.toast.sent':'op.toast.fail'))})
   .catch(function(){toast(t('op.toast.preview'))});
}
function readForm(){
  st.n=PAGE;
  st.q=$('q').value.trim();st.reg=$('fReg').value;st.pais=$('fPais').value;st.prov=$('fProv').value;st.sal=$('fSal').checked;st.open=$('fOpen').checked;st.sort=$('sort').value;
  st.tipos=[].slice.call(document.querySelectorAll('.ft:checked')).map(function(x){return x.value});
  render();
}
function init(){
  var p=new URLSearchParams(location.search);
  st.cat=p.get('cat')||'';
  st.pais=p.get('pais')||'';
  st.prov=p.get('regiao')||p.get('provincia')||'';
  (p.get('tipo')||'').split(',').forEach(function(x){if(TIPOS[x])st.tipos.push(x)});
  buildStatic();
  $('q').value=p.get('q')||'';$('fReg').value=p.get('regime')||'';
  readForm();
  document.addEventListener('click',function(e){
    var mb=e.target.closest('[data-menu]');
    if(mb){toggleMenu(mb);return}
    if(!e.target.closest('.oc .menu'))closeMenus();
    var cb=e.target.closest('[data-car]');if(cb){carGo(+cb.dataset.car);return}
    var x=e.target.closest('[data-cat],[data-apply],[data-share],[data-view],[data-more],[data-rm]');
    if(!x)return;
    if(x.closest('.menu'))closeMenus();
    if(x.hasAttribute('data-view'))view(x.dataset.view);
    else if(x.hasAttribute('data-share'))share(x.dataset.share);
    else if(x.hasAttribute('data-more')){st.n+=PAGE;render()}
    else if(x.hasAttribute('data-rm'))removeChip(x.dataset.rm,x.dataset.v||'');
    else if(x.dataset.apply)apply(x.dataset.apply);
    else if(x.classList.contains('tab')){st.cat=x.dataset.cat;st.n=PAGE;render()}
  });
  $('sf').addEventListener('submit',function(e){e.preventDefault();readForm();var l=document.querySelector('.tabs');if(l)l.scrollIntoView({behavior:'smooth',block:'start'})});
  $('q').addEventListener('input',readForm);
  ['fReg','fProv','fSal','fOpen','sort'].forEach(function(i){$(i).addEventListener('change',readForm)});
  $('fPais').addEventListener('change',function(){fillRegions();readForm()});
  $('fTipo').addEventListener('change',readForm);
  $('clear').addEventListener('click',function(){$('q').value='';$('fReg').value='';$('fPais').value='';fillRegions();$('fSal').checked=false;$('fOpen').checked=true;document.querySelectorAll('.ft').forEach(function(x){x.checked=false});readForm()});
  $('mf').addEventListener('click',function(){$('filters').classList.toggle('show')});
  var conta='<a class="btn btn-g" href="painel.html" th:href="@{/painel}"><i class="fas fa-user"></i> <span data-i18n="op.account">'+esc(t('op.account'))+'</span></a>';
  if(LOGGED_IN){$('authBtns').innerHTML=conta;$('mmAuth').innerHTML=conta}
  /* Voltar ao topo (igual ao index) */
  var bt=$('backToTop');
  window.addEventListener('scroll',function(){bt.classList.toggle('visible',window.scrollY>400)},{passive:true});
  bt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
  /* Cabeçalho compacto ao rolar */
  function sc(){document.querySelector('header').classList.toggle('scrolled',window.scrollY>20)}
  window.addEventListener('scroll',sc,{passive:true});sc();
  /* Menu mobile */
  function mm(open){$('mm').classList.toggle('open',open);$('hamb').setAttribute('aria-expanded',String(open));document.body.style.overflow=(open||document.querySelector('.lm-modal.open'))?'hidden':''}
  $('hamb').addEventListener('click',function(){mm(true)});
  $('mmClose').addEventListener('click',function(){mm(false)});
  $('mm').addEventListener('click',function(e){if(e.target.closest('a'))mm(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){mm(false);var o=document.querySelector('.oc .menu.on');if(o){var b=o.previousElementSibling;closeMenus();if(b)b.focus()}}});
  /* Aviso de candidatura: Entrar / Criar conta */
  $('gateClose').addEventListener('click',closeGate);
  $('gateModal').addEventListener('mousedown',function(e){if(e.target===$('gateModal'))closeGate()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('gateModal').classList.contains('open'))closeGate()});
  $('gateModal').addEventListener('click',function(e){
    var b=e.target.closest('[data-gate]');if(!b)return;
    if(b.dataset.gate==='login')window.LermoAuth.openLogin(b);else window.LermoAuth.openReg(b,'candidato');
  });
  $('mres').addEventListener('click',function(){$('filters').classList.remove('show');document.querySelector('.bar').scrollIntoView({behavior:'smooth',block:'start'})});
  /* Mudança de idioma: refaz filtros e cartões mantendo a selecção */
  I18N.onChange(function(){readForm();buildStatic();render();if(gateId)gateText()});
  var ver=p.get('ver');if(ver&&find(ver)){view(ver);return}
  var ap=p.get('aplicar');if(ap&&find(ap)){LOGGED_IN?apply(ap):view(ap,1)}
}
init();
