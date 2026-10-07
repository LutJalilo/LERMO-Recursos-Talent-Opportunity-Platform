/* Substitui os atributos inline onerror (incompatíveis com a CSP estrita): bandeiras que não carregam. */
document.addEventListener('error',function(e){var t=e.target;if(!t||t.tagName!=='IMG')return;var c=t.className||'';
 if(/fm-flag/.test(c)){var s=document.createElement('span');s.className='fm-flag fm-flag-x';t.replaceWith(s)}
 else if(/flag/.test(c))t.style.visibility='hidden'},true);
