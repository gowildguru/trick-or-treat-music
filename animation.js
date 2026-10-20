/* MUSIC STREET: gentle background animation add-on.
   Safe to load after app.js. No changes to activities.js. */
(()=>{
  'use strict';
  const stage=document.getElementById('houses');
  const street=document.getElementById('street');
  const soundButton=document.getElementById('sound');
  if(!stage||!street)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=true;
  try{enabled=localStorage.getItem('music-street-animations')!=='off'}catch{}
  const layer=document.createElement('div');
  layer.className='music-atmosphere';
  layer.setAttribute('aria-hidden','true');
  stage.append(layer);
  // app.js redraws the house buttons when returning from an activity.
  // Restore the overlay automatically after each redraw.
  const observer=new MutationObserver(()=>{if(!stage.contains(layer))stage.append(layer)});
  observer.observe(stage,{childList:true});
  const add=(className,text='')=>{const e=document.createElement('span');e.className=className;e.textContent=text;layer.append(e);return e};
  add('music-cloud one');add('music-cloud two');
  // Percentage coordinates are relative to the illustrated 5-column, 2-row street.
  // Window glow positions are intentionally faint to avoid covering the painting.
  const windows=[[10,38],[29,38],[49,39],[70,39],[90,39],[9,78],[30,78],[50,78],[70,78],[90,78]];
  windows.forEach(([x,y],i)=>{const e=add('music-window-glow');e.style.left=`${x-2}%`;e.style.top=`${y}%`;e.style.animationDelay=`-${i*1.7}s`});
  add('music-smoke s1');add('music-smoke s2');add('music-smoke s3');
  const shadow=add('music-shadow');
  const cat=add('music-visitor cat','🐈‍⬛');
  const ghoul=add('music-visitor ghoul','👻');
  const witch=add('music-visitor witch','🧙‍♀️');
  const star=add('music-shooting-star');
  const toolbar=document.querySelector('.toolbar');
  const toggle=document.createElement('button');
  toggle.type='button';toggle.className='small';toggle.id='animationToggle';
  toggle.title='Turn background animations on or off';
  if(toolbar)toolbar.insertBefore(toggle,soundButton||null);
  function update(){
    document.body.classList.toggle('music-animations-off',!enabled);
    toggle.textContent=enabled?'✨ Animations on':'✨ Animations off';
    toggle.setAttribute('aria-pressed',String(enabled));
  }
  toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('music-street-animations',enabled?'on':'off')}catch{}update()});
  update();
  const visible=()=>enabled&&!reduce.matches&&!street.hidden&&!document.hidden;
  let busy=false;
  const random=(min,max)=>min+Math.random()*(max-min);
  function play(element,duration){
    if(!visible()||busy)return false;
    busy=true;
    element.classList.remove('travelling');
    void element.offsetWidth;
    element.classList.add('travelling');
    setTimeout(()=>{element.classList.remove('travelling');busy=false},duration);
    return true;
  }
  // Only one character surprise at a time; long quiet gaps between visits.
  function nextVisitor(){
    if(visible()&&!busy){
      const roll=Math.random();
      if(roll<.42)play(cat,12500);
      else if(roll<.72)play(witch,10500);
      else play(ghoul,11500);
    }
    setTimeout(nextVisitor,random(65000,105000));
  }
  // Moving silhouettes are rarer and do not overlap a passing character.
  function nextShadow(){
    if(visible()&&!busy){
      const positions=[[29,36],[49,36],[70,36],[90,36],[29,76],[49,76],[70,76]];
      const [x,y]=positions[Math.floor(Math.random()*positions.length)];
      shadow.style.left=`${x}%`;shadow.style.top=`${y}%`;
      shadow.classList.remove('passing');void shadow.offsetWidth;shadow.classList.add('passing');
      setTimeout(()=>shadow.classList.remove('passing'),3600);
    }
    setTimeout(nextShadow,random(33000,62000));
  }
  function nextStar(){
    if(visible()&&!busy)play(star,1200);
    setTimeout(nextStar,random(145000,230000));
  }
  setTimeout(nextVisitor,random(20000,37000));
  setTimeout(nextShadow,random(24000,42000));
  setTimeout(nextStar,random(80000,120000));
})();
