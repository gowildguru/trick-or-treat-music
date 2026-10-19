const $=s=>document.querySelector(s);
const street=$('#street'),activity=$('#activity'),houses=$('#houses'),welcome=$('#welcome'),classSelect=$('#classSelect');
let sounds=true,active=0,step=0,audioContext,entered=false,selectedId='',manualOverride=false,lastClockMinute='';
const ZONE='America/Denver';
const TIMES=[['08:20','09:15',4],['09:20','10:15',5],['10:20','11:15',3],['12:25','13:20',2],['13:25','14:20',1],['14:30','15:25',0]];
const TEACHERS={2:['Flex','Quilis','Wilmes','Robinson','Scholl','Buell'],3:['Armer','Roberts','Miller','Faubert-Gregory','Conkright','Horvath'],4:['Devincenzi','Passmore','Murray','Gliori','Cordes','Lemus'],5:['Meinenger','Fick','Humphries','Lachermeier','McCain','Perez']};
const DAYS={2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday'};
const CLASSES=Object.entries(TEACHERS).flatMap(([day,names])=>names.map((teacher,i)=>({id:`${day}-${i}`,day:Number(day),teacher,grade:TIMES[i][2],start:TIMES[i][0],end:TIMES[i][1],lineup:i===5?'15:15':null})));
const grade={get value(){const c=currentClass();return c&&c.grade<=2?'k2':'g35'}};
function currentClass(){return CLASSES.find(c=>c.id===selectedId)||null}
function denverNow(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:ZONE,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const v=k=>parts.find(p=>p.type===k)?.value;return {day:{Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[v('weekday')],minute:Number(v('hour'))*60+Number(v('minute')),date:`${v('year')}-${v('month')}-${v('day')}`,clock:`${v('hour')}:${v('minute')}`}}
function toMin(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function pretty(t){const [h,m]=t.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
function gradeName(n){return n===0?'Kindergarten':`${n}${n===1?'st':n===2?'nd':n===3?'rd':'th'} Grade`}
function classLabel(c){return `${gradeName(c.grade)} · ${c.teacher}`}
function suggestedClass(now){const todays=CLASSES.filter(c=>c.day===now.day);return todays.find(c=>now.minute>=toMin(c.start)&&now.minute<toMin(c.end))||todays.find(c=>now.minute<toMin(c.start))||null}
function upcomingClass(now){return CLASSES.filter(c=>c.day===now.day&&toMin(c.start)>now.minute).sort((a,b)=>toMin(a.start)-toMin(b.start))[0]||null}
function getKey(){return `music-halloween-${denverNow().date}-${selectedId||'none'}`}
function getVisited(){try{return JSON.parse(localStorage.getItem(getKey())||'[]')}catch{return []}}
function setVisited(a){try{localStorage.setItem(getKey(),JSON.stringify(a))}catch{}}
function beep(freq=420,dur=.13){if(!sounds)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.value=freq;g.gain.value=.045;o.start();o.stop(audioContext.currentTime+dur)}catch{}}
function chime(urgent=false){[0,1,2].forEach((i)=>setTimeout(()=>beep((urgent?[660,550,440]:[440,550,660])[i],.24),i*330))}
function populateClasses(){for(const day of [2,3,4,5]){const group=document.createElement('optgroup');group.label=DAYS[day];CLASSES.filter(c=>c.day===day).forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=`${pretty(c.start)} · ${classLabel(c)}`;group.append(o)});classSelect.append(group)}}
function chooseClass(id,manual=false){selectedId=id;manualOverride=manual;classSelect.value=id;updateWelcome();if(entered){activity.hidden=true;street.hidden=false;draw()}}
function updateWelcome(){const c=currentClass(),now=denverNow(),next=upcomingClass(now);$('#welcomeTitle').textContent=c?`Welcome, ${gradeName(c.grade)}!`:'Welcome to Music Street!';$('#welcomeClass').textContent=c?`${c.teacher}'s Class`:'Choose your class to begin';$('#welcomeTime').textContent=c?`${pretty(c.start)}–${pretty(c.end)}${c.grade===0?' · Gym dismissal at 3:15 PM':''}`:'';$('#enter').disabled=!c;$('#nextClass').textContent=next&&next.id!==selectedId?`Coming up: ${classLabel(next)} at ${pretty(next.start)}`:''}
function showWelcome(){entered=false;activity.hidden=true;street.hidden=true;welcome.hidden=false;updateWelcome();window.scrollTo(0,0)}
function enterStreet(){if(!currentClass())return;entered=true;welcome.hidden=true;activity.hidden=true;street.hidden=false;draw();beep(520);setTimeout(()=>beep(690),140);window.scrollTo(0,0)}
const HOUSE_DECOR=[
  {roof:'#6d4769',wall:'#b9a67c',trim:'#e6cf95',symbol:'🧙',top:'☁️',side:'⚗️'},
  {roof:'#6a596a',wall:'#c7b79d',trim:'#f1d9ae',symbol:'💀',top:'☠',side:'🦴'},
  {roof:'#383852',wall:'#857d99',trim:'#b2a2c5',symbol:'🕸',top:'🦇',side:'🕯️'},
  {roof:'#a65a32',wall:'#d68d4c',trim:'#ffd28a',symbol:'🎃',top:'🍃',side:'🎃'},
  {roof:'#77728e',wall:'#d0c2cc',trim:'#f5e8df',symbol:'👻',top:'👻',side:'✨'},
  {roof:'#8e534a',wall:'#e3c39a',trim:'#ffe5b7',symbol:'📖',top:'📚',side:'📜'},
  {roof:'#596a5b',wall:'#9ba18c',trim:'#d2d6aa',symbol:'👹',top:'🔧',side:'⚙️'},
  {roof:'#b05b6e',wall:'#f2c4a0',trim:'#fff0c2',symbol:'🍬',top:'🍭',side:'🍬'},
  {roof:'#4d4b63',wall:'#817c86',trim:'#bbb0c1',symbol:'🦇',top:'🦇',side:'🪨'},
  {roof:'#7b474f',wall:'#d7bb9e',trim:'#ffe2a8',symbol:'🐈‍⬛',top:'🐈‍⬛',side:'🐾'}
];
function draw(){
  const visited=getVisited();$('#progress').textContent=`🍬 ${visited.length} of 10 houses visited`;
  houses.replaceChildren();
  DOORS.forEach((d,i)=>{
    const theme=HOUSE_DECOR[i],b=document.createElement('button');
    b.type='button';b.className=`house house-${i}${visited.includes(i)?' visited':''}`;
    b.style.setProperty('--roof',theme.roof);b.style.setProperty('--wall',theme.wall);b.style.setProperty('--trim',theme.trim);
    b.setAttribute('aria-label',`Enter ${d.name}${visited.includes(i)?', already visited':''}`);
    b.innerHTML=`<span class="house-art" aria-hidden="true"><span class="house-top">${theme.top}</span><span class="roof"><span class="roof-emblem">${theme.symbol}</span></span><span class="building"><span class="house-detail">${theme.side}</span><span class="window"><span class="window-cross"></span></span><span class="window right"><span class="window-cross"></span></span><span class="doorway"><span class="door-glow"></span><span class="door"><span class="door-knob"></span></span></span></span><span class="house-ground"></span></span><span class="house-name">${d.name}${visited.includes(i)?' <span class="visited-mark">✓</span>':''}</span>`;
    b.addEventListener('click',()=>openDoor(i,b));houses.append(b);
  });
}
let enteringHouse=false;
function portalTransition(button,done){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){done();return}
  const door=button.querySelector('.door'),rect=door.getBoundingClientRect();
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const overlay=document.createElement('div');overlay.className='house-portal';
  overlay.style.setProperty('--portal-x',`${cx}px`);overlay.style.setProperty('--portal-y',`${cy}px`);
  overlay.innerHTML='<span class="portal-swirl" aria-hidden="true">✦ ✧ ✦</span>';
  document.body.append(overlay);button.classList.add('door-opening');
  // First let the illustrated door swing open; then zoom into its glowing interior.
  setTimeout(()=>overlay.classList.add('portal-grow'),390);
  setTimeout(()=>{done();overlay.classList.add('portal-fade');},1100);
  setTimeout(()=>{overlay.remove();button.classList.remove('door-opening');enteringHouse=false},1510);
}

function button(label,fn,primary=false){let b=document.createElement('button');b.className='action'+(primary?' primary':'');b.textContent=label;b.onclick=fn;return b}
function append(parent,...children){children.forEach(x=>parent.append(x));return parent}
function el(tag,cls='',content=''){let n=document.createElement(tag);n.className=cls;n.textContent=content;return n}
function openDoor(i,button){if(enteringHouse)return;enteringHouse=true;active=i;step=0;beep(520);setTimeout(()=>beep(700),180);portalTransition(button,()=>{street.hidden=true;activity.hidden=false;window.scrollTo(0,0);renderActivity()})}
function renderActivity(){const d=DOORS[active],a=d[grade.value],body=$('#activityBody');body.replaceChildren();append(body,el('div','reveal '+a.type,a.type==='trick'?'🎭 TRICK!':'🍭 TREAT!'),el('h2','',a.title),el('p','instructions',a.description),el('div','note','For the substitute: '+a.prep));let content=el('div');body.append(content);
if(a.kind==='video'||a.kind==='story'){if(a.kind==='story')renderStory(content,a);if(a.youtubeId){let f=document.createElement('iframe');f.className='video';f.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.youtubeId)}?rel=0`;f.title=a.title;f.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';f.allowFullscreen=true;content.append(f)}else content.append(el('div','video-placeholder','🎬 Video link not selected yet. Add a YouTube video ID in activities.js.'))}
if(a.kind==='poison')renderPoison(content);if(a.kind==='rhythm')renderRhythm(content);if(a.kind==='soundtrack')renderSoundtrack(content);if(a.kind==='choice')renderChoice(content);
let actions=el('div','actions');append(actions,button('✓ Mark complete & return',()=>{let v=getVisited();if(!v.includes(active)){v.push(active);setVisited(v)}goBack()},true),button('Return without completing',goBack));body.append(actions)}
function goBack(){activity.hidden=true;street.hidden=false;draw();window.scrollTo(0,0)}
const poison=[['♩','♩','♫','♩'],['♫','♫','♩','♩'],['♩','♫','♩','♩'],['♫','♫','♩','♩'],['♩','♩','♩','♩'],['♫','♩','♫','♩']];const rhythmEasy=[['♩','♩','♩','♩'],['♩','♫','♩','♩'],['♫','♫','♩','♩'],['♩','♩','♫','♩']];const rhythmHard=[['♩','♫','♩','♩'],['♫','♫','♩','♩'],['♩','𝄽','♫','♩'],['♫','♩','♫','♩']];
function renderPattern(parent,p){let box=el('div','rhythm');p.forEach(n=>box.append(el('span','',n)));parent.append(box)}
function renderPoison(p){p.append(el('h3','','☠️ Memorize the poison rhythm'));renderPattern(p,poison[1]);let area=el('div');p.append(area);function next(){area.replaceChildren();let pattern=poison[step%poison.length];area.append(el('p','',`Round ${step%poison.length+1} of ${poison.length}: Echo the rhythm, unless it is poison!`));renderPattern(area,pattern);let answer=el('p','');area.append(answer);let actions=el('div','actions');append(actions,button('Reveal',()=>{answer.textContent=step%poison.length===1||step%poison.length===3?'☠️ POISON! Stay silent!':'✅ Safe rhythm! Echo it!';beep(300)}),button('Next rhythm →',()=>{step++;next()},true));area.append(actions)}next()}
function renderRhythm(p){let patterns=grade.value==='k2'?rhythmEasy:rhythmHard;let area=el('div');p.append(area);function next(){area.replaceChildren();area.append(el('p','',`Pattern ${step%patterns.length+1} of ${patterns.length}`));renderPattern(area,patterns[step%patterns.length]);area.append(button('Next pattern →',()=>{step++;beep(480);next()},true))}next()}
const cues=[['Footsteps','Woodblocks / rhythm sticks','Tap, tap, tap... Someone walks toward the old house.'],['Wind','Shakers','A chilly wind whistles through the trees.'],['Creaking door','Guiro / gentle scrape','The front door slowly creaks open.'],['Thunder','Hand drum','Suddenly, thunder rolls across the sky!'],['Surprise!','Tambourine / cymbal','A tiny black cat jumps out and says... MEOW!']];
function renderSoundtrack(p){p.append(el('h3','','🎬 Your spooky soundtrack'));let area=el('div');p.append(area);function next(){area.replaceChildren();let c=cues[step%cues.length];area.append(el('p','',`Scene ${step%cues.length+1} of ${cues.length}`),el('h3','',c[0]),el('div','cue',c[2]),el('p','','Instrument idea: '+c[1]),button('Next scene →',()=>{step++;next()},true))}next()}
const storyCues=[['👞 Shoes','CLOMP CLOMP','Woodblocks'],['👖 Pants','WIGGLE WIGGLE','Rhythm sticks'],['👕 Shirt','SHAKE SHAKE','Egg shakers'],['🧤 Gloves','CLAP CLAP','Hand drums'],['🎩 Hat','NOD NOD','Claves'],['🎃 Pumpkin','BOO BOO','Tambourine']];
function renderStory(p){p.append(el('h3','','Practice your story sounds'));storyCues.forEach(c=>p.append(el('div','cue',`${c[0]} — ${c[1]} (${c[2]})`)));p.append(el('p','','Assign groups before starting the read-aloud. Play only when your object appears.'))}
function renderChoice(p){let box=el('div','actions'),out=el('p','');append(box,button('▶ High ghost',()=>{beep(800,.35);out.textContent='That was a HIGH sound!'}),button('▶ Low ghost',()=>{beep(220,.35);out.textContent='That was a LOW sound!'}));p.append(box,out)}
function showAlert(type,c){const kindergarten=c.grade===0;$('#alertEmoji').textContent=type==='warning'?'⏳':kindergarten?'🎒':'🚪';$('#alertTitle').textContent=type==='warning'?'5 Minutes Left!':kindergarten?'Time to Head to the Gym!':'Time to Line Up!';$('#alertText').textContent=type==='warning'?'Our spooky adventure is almost over! Finish your activity and begin cleaning up your instruments and materials.':kindergarten?'Put everything away, line up quietly at the door, and get ready to walk to the gym for dismissal with the other specials classes.':'Put away your instruments, check your space, and quietly line up at the classroom door.';$('#alertOverlay').hidden=false;chime(type==='lineup')}
function clockTick(){const now=denverNow(),key=`${now.date}-${now.clock}`;if(key===lastClockMinute)return;lastClockMinute=key;
if(!manualOverride&&!entered){const c=suggestedClass(now);if((c?.id||'')!==selectedId)chooseClass(c?.id||'');else updateWelcome()}
const c=currentClass();if(!c||!entered||c.day!==now.day)return;const lineAt=toMin(c.lineup||c.end)-(c.lineup?0:2);const warningAt=c.lineup?lineAt-5:toMin(c.end)-5;
for(const [type,target] of [['warning',warningAt],['lineup',lineAt]]){const onceKey=`music-alert-${now.date}-${c.id}-${type}`;if(now.minute===target&&!sessionStorage.getItem(onceKey)){sessionStorage.setItem(onceKey,'1');showAlert(type,c)}}}
classSelect.onchange=()=>{chooseClass(classSelect.value,true);showWelcome()};$('#welcomeButton').onclick=showWelcome;$('#enter').onclick=enterStreet;$('#back').onclick=goBack;$('#dismissAlert').onclick=()=>{$('#alertOverlay').hidden=true};$('#reset').onclick=()=>{if(!currentClass())return;if(confirm('Reset visited houses for this class today?')){setVisited([]);draw()}};$('#sound').onclick=()=>{sounds=!sounds;$('#sound').textContent=sounds?'🔊 Sounds on':'🔇 Sounds off';$('#sound').setAttribute('aria-pressed',String(sounds));if(sounds)beep(540)};
populateClasses();chooseClass(suggestedClass(denverNow())?.id||'');showWelcome();clockTick();setInterval(clockTick,1000);
