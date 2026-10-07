if(!Element.prototype.replaceChildren)Element.prototype.replaceChildren=function(){while(this.firstChild)this.removeChild(this.firstChild);this.append.apply(this,arguments)};
const D=JSON.parse(document.getElementById('data').textContent);D.certs=D.certs||[];D.cover=D.cover||'';
const $=s=>document.querySelector(s),app=$('#app');
const h=(t,p={},...k)=>{const e=document.createElement(t);for(const a in p)a in e&&a!=='style'?e[a]=p[a]:e.setAttribute(a,p[a]);k.flat().forEach(c=>e.append(c));return e};
const LOCAL=typeof claude==='undefined';let art=null,owner=false,cat='الكل',busy=false;
(async()=>{try{const u=await claude.use('user');owner=!!(u&&u.canEdit&&u.canEdit());art=await claude.use('artifact');}catch(e){}$('#adm').hidden=!(owner&&art);route()})();
addEventListener('hashchange',route);

function route(){const r=location.hash.slice(2)||'';$('#lg').textContent=D.profile.name;document.title=D.profile.name+' — Portfolio';
app.replaceChildren();if(r==='admin')return admin();pub(r)}

function cards(l,cls){return l.map(w=>h('div',{className:'card '+cls,onclick:()=>open(w)},h('img',{src:w.imgs[0]||'',alt:w.title,loading:'lazy'}),h('div',{},h('b',{},w.title),h('span',{},[w.cat,w.year].filter(Boolean).join(' · ')))))}
function pub(r){const p=D.profile,cats=['الكل',...new Set(D.works.map(w=>w.cat).filter(Boolean))];
app.append(h('section',{className:'hero'},h('div',{},h('small',{},'PORTFOLIO'),h('h1',{},p.name),h('p',{},p.title)),D.cover?h('img',{className:'cover',src:D.cover,alt:p.name}):h('div',{className:'cover ph'},owner?'الصورة الكبيرة — ضيفيها من لوحة التحكم':''))); 
const g=h('div',{className:'grid'}),l=D.works.filter(w=>cat==='الكل'||w.cat===cat);
l.length?g.append(...cards(l,'')):g.append(h('div',{className:'empty'},'المشاريع هتظهر هنا قريبًا.'));
app.append(h('h2',{id:'works'},'المشاريع'),h('div',{className:'chips'},cats.map(c=>h('button',{className:'chip'+(c===cat?' on':''),onclick:()=>{cat=c;app.replaceChildren();pub('')}},c))),g);
const cg=h('div',{className:'grid'});D.certs.length?cg.append(...cards(D.certs,'cert')):cg.append(h('div',{className:'empty'},'الشهادات هتظهر هنا قريبًا.'));
app.append(h('h2',{id:'certs'},'الشهادات'),cg);
app.append(h('h2',{id:'about'},'عني'),h('p',{className:'prose'},p.bio));
app.append(h('h2',{id:'contact'},'تواصل'),h('footer',{},p.email?h('a',{href:'mailto:'+p.email},p.email):'',' ',p.insta?h('a',{href:p.insta,target:'_blank',rel:'noopener'},' Instagram'):''));
if(['about','contact','certs'].includes(r))setTimeout(()=>document.getElementById(r).scrollIntoView(),30)}

function open(w){const b=$('#lb');b.replaceChildren(h('div',{className:'in'},h('button',{className:'x',onclick:()=>b.style.display='none'},'×'),w.imgs.map(s=>h('img',{src:s,alt:w.title})),h('h3',{},w.title),h('span',{},[w.cat,w.year].filter(Boolean).join(' · ')),h('p',{},w.desc)));b.style.display='block'}
$('#lb').onclick=e=>{if(e.target.id==='lb')e.target.style.display='none'};

function admin(){if(!(owner&&art)&&!LOCAL){app.append(h('p',{className:'empty'},'اللوحة دي للمالكة بس. افتحيها وانتي مسجلة دخول بحسابك.'));return}
const P=D.profile,bar=h('div',{className:'pub'},h('span',{},LOCAL?'نزّلي الملف وارفعيه مكان القديم':'التعديلات مش منشورة لسه'),h('button',{className:'btn',onclick:LOCAL?save:publish},LOCAL?'تنزيل index.html':'نشر'));bar.hidden=true;const mark=()=>{bar.hidden=false};
const f=(k,l,ta)=>{const i=h(ta?'textarea':'input',{value:P[k],rows:3,oninput:()=>{P[k]=i.value;mark()}});return[h('label',{},l),i]};
app.append(h('h2',{},'لوحة التحكم'),h('div',{className:'panel'},h('b',{},'البيانات الشخصية'),f('name','الاسم'),f('title','التخصص'),f('bio','نبذة',1),f('email','الإيميل'),f('insta','رابط انستجرام')));
const ci=h('input',{type:'file',accept:'image/*'}),cp=h('img',{className:'cover',style:'max-width:340px;margin-top:10px',src:D.cover||''});cp.hidden=!D.cover;
ci.onchange=async()=>{if(!ci.files[0])return;D.cover=await shrink(ci.files[0],1600);cp.src=D.cover;cp.hidden=false;mark()};
app.append(h('div',{className:'panel'},h('b',{},'الصورة الكبيرة (غلاف الصفحة)'),h('label',{},'اختاري صورة'),ci,cp));
const sec=(nm,key,cl)=>{const L=D[key],list=h('div'),dr=()=>list.replaceChildren(...L.map((w,i)=>h('div',{className:'row'},h('img',{src:w.imgs[0]||''}),h('b',{},w.title),h('button',{className:'btn alt',style:'margin:0',onclick:()=>{if(confirm('حذف "'+w.title+'"؟')){L.splice(i,1);mark();dr()}}},'حذف'))));
const t=h('input'),c=h('input'),y=h('input',{placeholder:'2026'}),d=h('textarea',{rows:3}),im=h('input',{type:'file',accept:'image/*',multiple:true}),msg=h('small',{});
const add=h('button',{className:'btn',onclick:async()=>{if(!t.value||!im.files.length){msg.textContent='العنوان وصورة واحدة على الأقل مطلوبين';return}msg.textContent='جاري المعالجة…';const imgs=[];for(const fl of im.files)imgs.push(await shrink(fl));
L.unshift({id:Date.now(),title:t.value,cat:c.value,year:y.value,desc:d.value,imgs});[t,c,y,d,im].forEach(e=>e.value='');msg.textContent='اتضاف — اضغطي نشر';mark();dr()}},'إضافة '+nm);dr();
return[h('div',{className:'panel'},h('b',{},nm+' جديد'),h('label',{},'العنوان'),t,h('label',{},cl),c,h('label',{},'السنة'),y,h('label',{},'التفاصيل'),d,h('label',{},'الصور'),im,add,' ',msg),h('div',{className:'panel'},h('b',{},key==='works'?'المشاريع الحالية':'الشهادات الحالية'),list)]};
app.append(...sec('مشروع','works','التصنيف (تريكو / نسيج / طباعة…)'),...sec('شهادة','certs','الجهة المانحة'),bar)}

function shrink(file,M=1100){return new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,M/Math.max(i.width,i.height)),cv=document.createElement('canvas');cv.width=i.width*k;cv.height=i.height*k;cv.getContext('2d').drawImage(i,0,0,cv.width,cv.height);r(cv.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(file)})}

function build(){const root=document.documentElement.cloneNode(true);
root.querySelector('#data').textContent=JSON.stringify(D).replace(/</g,'\\u003c');root.querySelector('#app').replaceChildren();root.querySelector('#lb').replaceChildren();
return'<!DOCTYPE html>\n'+root.outerHTML}
function save(){const a=h('a',{href:URL.createObjectURL(new Blob([build()],{type:'text/html'})),download:'index.html'});document.body.append(a);a.click();a.remove()}
async function publish(){if(busy)return;busy=true;try{await art.publish(build())}catch(e){busy=false;alert('فشل النشر: '+(e.code||e.message))}}

/* background: fine-thread contour lines (draped yarn), minimal and formal */
const cv=$('#bg'),x=cv.getContext('2d'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;let W,H,t=0;
const rs=()=>{if(W&&innerWidth===W&&Math.abs(innerHeight-H)<150)return;W=cv.width=innerWidth;H=cv.height=innerHeight};addEventListener('resize',rs);rs();
const N=54;
function frame(){t+=16;x.clearRect(0,0,W,H);const gap=(H*1.1)/N;x.lineJoin='round';
for(let i=0;i<N;i++){const by=i*gap-H*.05,m=i%18===9?3:i%6===0?2:1;
x.beginPath();for(let X=-10;X<=W+10;X+=W<700?12:7){const e=Math.exp(-Math.pow((X-W*.72)/(W*.3),2)),
y=by+Math.sin(X/190+i*.09+t/2800)*6+Math.sin(X/430-i*.05-t/3600)*14*(.4+.6*e)-e*46*Math.sin(i*.12+t/4200)+e*e*20*Math.cos(X/70+t/2000);
X<0?x.moveTo(X,y):x.lineTo(X,y)}
x.lineWidth=m===3?1.4:m===2?1.5:.9;x.strokeStyle=m===3?'rgba(255,255,255,.95)':m===2?'rgba(122,23,48,.75)':i%2?'rgba(122,23,48,.3)':'rgba(255,255,255,.55)';x.stroke()}
if(!RM)requestAnimationFrame(frame)}
frame();
