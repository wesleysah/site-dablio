/* Visualizador de projetos da proposta (mesma lógica do site da Dáblio) */
(()=>{
const $=s=>document.querySelector(s);
const PAGES=10;
const CASES=[
  {id:'cajuama',nome:'Cajuama',seg:'Castanha de caju'},
  {id:'cimsal',nome:'Cimsal',seg:'Indústria salineira'},
  {id:'intensefit',nome:'Intensefit',seg:'Academias'},
  {id:'artbamboo',nome:'Art Bamboo',seg:'Festas e lembranças'},
  {id:'debora',nome:'Débora Aires',seg:'Psicologia'},
  {id:'afmetais',nome:'AF Metais',seg:'Metalúrgica'},
  {id:'bambino',nome:'Bambino',seg:'Escola bilíngue'}
];
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pg=(id,n)=>`proj/${id}/${String(n).padStart(2,'0')}.webp`;
const vw=$('#vw'),img=$('#vwImg'),thumbs=$('#vwThumbs'),stage=$('#vwStage');
if(!vw||!img)return;
let cur=0,page=1,opener=null;
const pause=()=>{try{lenis.stop()}catch(e){}};
const resume=()=>{try{lenis.start()}catch(e){}};
function preload(n){if(n>=1&&n<=PAGES){const im=new Image();im.src=pg(CASES[cur].id,n)}}
function montarThumbs(){
  const c=CASES[cur];
  thumbs.innerHTML=Array.from({length:PAGES},(_,k)=>`<button type="button" data-p="${k+1}" aria-label="Página ${k+1}"><img src="${pg(c.id,k+1)}" alt="" loading="lazy"></button>`).join('');
  thumbs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>ir(+b.dataset.p)));
}
function carregar(src,cb){
  stage.classList.add('loading');stage.classList.remove('failed');
  const tmp=new Image();
  tmp.onload=()=>{stage.classList.remove('loading');cb(true)};
  tmp.onerror=()=>{stage.classList.remove('loading');stage.classList.add('failed');cb(false)};
  tmp.src=src;
}
function render(dir){
  const c=CASES[cur];const src=pg(c.id,page);
  if(dir&&!REDUCE){
    img.className=dir>0?'out-l':'out-r';
    carregar(src,()=>setTimeout(()=>{img.src=src;img.className=dir>0?'in-l':'in-r';void img.offsetWidth;img.className=''},160));
  }else{img.className='';carregar(src,()=>{});img.src=src}
  img.alt=`${c.nome}, página ${page} de ${PAGES}`;
  $('#vwPg').textContent=String(page).padStart(2,'0');
  $('#vwTot').textContent=PAGES;
  $('#vwPrev').disabled=page===1;
  $('#vwNext').disabled=page===PAGES;
  thumbs.querySelectorAll('button').forEach(b=>{const on=+b.dataset.p===page;b.setAttribute('aria-current',on?'true':'false');if(on)b.scrollIntoView({block:'nearest',inline:'center'})});
  preload(page+1);preload(page-1);
}
function abrir(i,p){
  cur=i;page=p||1;
  const c=CASES[cur];
  $('#vwNome').textContent=c.nome;$('#vwSeg').textContent=`Identidade visual · ${c.seg}`;
  montarThumbs();render(0);
  if(!vw.open){pause();if(vw.showModal)vw.showModal();else vw.setAttribute('open','')}
}
function ir(p){if(p<1||p>PAGES||p===page)return;const d=p>page?1:-1;page=p;render(d)}
function projeto(d){abrir((cur+d+CASES.length)%CASES.length,1)}
document.querySelectorAll('.project-open').forEach(b=>b.addEventListener('click',()=>{
  const i=CASES.findIndex(c=>c.id===b.dataset.project);
  if(i<0)return;opener=b;abrir(i,+b.dataset.page||1);
}));
$('#vwPrev').onclick=()=>ir(page-1);
$('#vwNext').onclick=()=>ir(page+1);
$('#vwProjPrev').onclick=()=>projeto(-1);
$('#vwProjNext').onclick=()=>projeto(1);
$('#vwClose').onclick=()=>vw.close();
vw.addEventListener('close',()=>{resume();if(opener)opener.focus({preventScroll:true})});
img.addEventListener('click',e=>{const r=img.getBoundingClientRect();ir(e.clientX<r.left+r.width/2?page-1:page+1)});
vw.addEventListener('click',e=>{if(e.target===vw)vw.close()});
vw.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();ir(page+1)}if(e.key==='ArrowLeft'){e.preventDefault();ir(page-1)}});
let tx=null;
stage.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
stage.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>45)ir(dx<0?page+1:page-1);tx=null});
})();
