/* Modo de TESTE (sem backend): contas e sessão guardadas no navegador.
   - Senhas NUNCA em claro: PBKDF2-SHA256 (150 000 iterações) com sal aleatório por conta (WebCrypto).
   - Bloqueio temporário após 5 tentativas falhadas (por email) e mensagem de erro única (não revela se o email existe).
   - Contas de teste fixas: candidato@lermo.test e empresa@lermo.test, senha de teste Teste2026.
   Substituir por POST /login e POST /registo (Spring Security) quando existir o backend: pôr LermoConta.TEST = false. */
window.LermoConta=(function(){
 const KEY='lermo-contas',LOCK='lermo-bloqueio',SESS='lermo-session',MAXF=5,LOCKMS=60000,ITER=150000;
 const DEMO_PW='Teste2026';
 const DEMO={'empresa@lermo.test':{email:'empresa@lermo.test',nome_completo:'Tecnologias Índico',telefone:'+258840000001',pais:'MZ',tipo:'empresa'},
             'candidato@lermo.test':{email:'candidato@lermo.test',nome_completo:'Lut Jalilo',telefone:'+258840000000',pais:'MZ',tipo:'candidato'}};
 const norm=e=>String(e||'').trim().toLowerCase();
 const rd=k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch(e){return{}}};
 const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
 const b64=u=>btoa(String.fromCharCode.apply(null,u)),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 async function pbkdf2(pw,salt){
  const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:salt,iterations:ITER},k,256));
 }
 const same=(a,b)=>{if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0};
 const sameStr=(a,b)=>{a=String(a);b=String(b);let d=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return d===0};
 const pause=ms=>new Promise(r=>setTimeout(r,ms));
 return{
  TEST:true,
  /* Registo fechado por agora: so as contas de teste (DEMO) entram. Para reabrir: REGISTO_ABERTO:true */
  REGISTO_ABERTO:false,
  registoFechado(){return this.TEST&&!this.REGISTO_ABERTO},
  all(){return rd(KEY)},
  find(email){const k=norm(email),c=this.registoFechado()?null:rd(KEY)[k];if(c){const o=Object.assign({},c);delete o.h;delete o.s;return o}return DEMO[k]||null},
  /* registo: guarda a conta com hash da senha (nunca a senha) */
  async register(c){
   try{
    if(this.registoFechado())return{ok:false,fechado:true};
    if(!c||!norm(c.email)||!c.password)return{ok:false,erro:true,motivo:'dados'};
    if(!(window.crypto&&crypto.subtle&&crypto.getRandomValues))return{ok:false,erro:true,motivo:'crypto'};
    const k=norm(c.email),a=rd(KEY);
    if(a[k]||DEMO[k])return{ok:false,exists:true};
    const salt=crypto.getRandomValues(new Uint8Array(16)),h=await pbkdf2(c.password,salt);
    a[k]={email:k,nome_completo:c.nome_completo,telefone:c.telefone,pais:c.pais,tipo:c.tipo,s:b64(salt),h:b64(h)};
    if(!wr(KEY,a)||!rd(KEY)[k])return{ok:false,erro:true,motivo:'storage'};
    return{ok:true};
   }catch(e){return{ok:false,erro:true,motivo:'excepcao'}}
  },
  /* login: devolve {ok,conta} | {ok:false,locked,wait} | {ok:false} */
  async login(email,password){
   const k=norm(email),L=rd(LOCK),now=Date.now(),st=L[k]||{n:0,until:0};
   if(st.until>now)return{ok:false,locked:true,wait:Math.ceil((st.until-now)/1000)};
   let conta=null;
   try{
    const reg=this.registoFechado()?null:rd(KEY)[k];
    if(reg&&reg.h){const h=await pbkdf2(password,unb64(reg.s));if(same(h,unb64(reg.h))){conta=Object.assign({},reg);delete conta.h;delete conta.s}}
    else if(DEMO[k]){if(sameStr(password,DEMO_PW))conta=DEMO[k]}
    else{await pbkdf2(password,new Uint8Array(16))} /* tempo semelhante quando o email não existe */
   }catch(e){return{ok:false,erro:true}}
   if(conta){delete L[k];wr(LOCK,L);return{ok:true,conta:conta}}
   st.n=(st.n||0)+1;if(st.n>=MAXF){st.until=now+LOCKMS;st.n=0}
   L[k]=st;wr(LOCK,L);await pause(300);
   return st.until>now?{ok:false,locked:true,wait:Math.ceil(LOCKMS/1000)}:{ok:false};
  },
  startSession(conta){
   wr(SESS,{utilizador_id:'u-'+norm(conta.email),nome_completo:conta.nome_completo,email:conta.email,telefone:conta.telefone,pais:conta.pais,tipo:conta.tipo==='empresa'?'empresa':'candidato',exp:Date.now()+864e5});
   return conta.tipo==='empresa'?'dashboard-empresa.html':'dashboard-candidato.html';
  }
 };
})();
