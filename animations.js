/* MUSIC STREET atmosphere v2: calibrated to the supplied illustration.
   Load after app.js; no changes to existing activities or schedules. */
(()=>{
  'use strict';
  const stage=document.getElementById('houses');
  const street=document.getElementById('street');
  if(!stage||!street)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=true;
  try{enabled=localStorage.getItem('music-street-animations')!=='off'}catch{}
  const layer=document.createElement('div');
  layer.className='music-atmosphere';
  layer.setAttribute('aria-hidden','true');
  stage.append(layer);
  // The main application recreates the house buttons after activities.
  const observer=new MutationObserver(()=>{if(!stage.contains(layer))stage.append(layer)});
  observer.observe(stage,{childList:true});
  const add=(className,text='')=>{
    const e=document.createElement('span');
    e.className=className;e.textContent=text;layer.append(e);return e;
  };
  add('music-cloud one');add('music-cloud two');
  // Precise percentages based on the 1471 x 685 full-street screenshot.
  // Keep glows modest so the painted window frames remain visible.
  const windows=[
    [9.8,23.1],[7.3,36.8],          // Witch's Cottage
    [27.3,36.6],[35.1,36.7],       // Skeleton House
    [50.1,12.3],[45.4,30.4],[54.4,30.4], // Mansion
    [64.3,36.7],[73.8,36.5],       // Pumpkin Patch
    [87.9,23.8],[85.1,38.4],[93.6,38.4], // Ghost House
    [6.6,77.6],[15.7,66.4],       // Storybook Cottage
    [31.5,69.5],                   // Monster Garage lamp
    [47.3,76.6],[53.3,76.6],       // Candy Shop
    [87.2,78.8],[91.0,65.9]       // Black Cat House
  ];
  windows.forEach(([x,y],i)=>{
    const e=add('music-window-glow');
    e.style.left=`${x-1.4}%`;e.style.top=`${y-3}%`;
    e.style.animationDelay=`-${i*1.13}s`;
  });
  add('music-smoke s1');add('music-smoke s2');add('music-smoke s3');
  add('music-cave-fire');
  add('music-ember e1');add('music-ember e2');add('music-ember e3');
  const shadow=add('music-shadow');
  const cat=add('music-visitor cat','🐈‍⬛');
  const ghoul=add('music-visitor ghoul','👻');
  const witch=add('music-visitor witch','🧙‍♀️');
  const star=add('music-shooting-star');
  const toolbar=document.querySelector('.toolbar');
  let toggle=document.getElementById('animationToggle');
  if(!toggle&&toolbar){
    toggle=document.createElement('button');toggle.type='button';
    toggle.className='small';toggle.id='animationToggle';
    toggle.title='Turn background animations on or off';
    toolbar.insertBefore(toggle,document.getElementById('sound'));
  }
  function update(){
    document.body.classList.toggle('music-animations-off',!enabled);
    if(toggle){toggle.textContent=enabled?'✨ Animations on':'✨ Animations off';toggle.setAttribute('aria-pressed',String(enabled))}
  }
  if(toggle)toggle.addEventListener('click',()=>{
    enabled=!enabled;
    try{localStorage.setItem('music-street-animations',enabled?'on':'off')}catch{}
    update();
  });
  update();
  const visible=()=>enabled&&!reduce.matches&&!street.hidden&&!document.hidden;
  const random=(a,b)=>a+Math.random()*(b-a);
  let busy=false;
  function play(element,duration){
    if(!visible()||busy)return false;
    busy=true;element.classList.remove('travelling');
    void element.offsetWidth;element.classList.add('travelling');
    setTimeout(()=>{element.classList.remove('travelling');busy=false},duration);
    return true;
  }
  function nextVisitor(){
    if(visible()&&!busy){
      const r=Math.random();
      if(r<.44)play(cat,11000);
      else if(r<.76)play(witch,11000);
      else play(ghoul,10000);
    }
    setTimeout(nextVisitor,random(45000,75000));
  }
  function nextShadow(){
    if(visible()&&!busy){
      const spots=[[27.3,36.6],[35.1,36.7],[45.4,30.4],[54.4,30.4],[85.1,38.4],[87.2,78.8]];
      const [x,y]=spots[Math.floor(Math.random()*spots.length)];
      shadow.style.left=`${x-1}%`;shadow.style.top=`${y-3}%`;
      shadow.classList.remove('passing');void shadow.offsetWidth;
      shadow.classList.add('passing');
      setTimeout(()=>shadow.classList.remove('passing'),4000);
    }
    setTimeout(nextShadow,random(24000,42000));
  }
  function nextStar(){
    if(visible()&&!busy)play(star,1400);
    setTimeout(nextStar,random(130000,190000));
  }
  setTimeout(nextVisitor,random(12000,22000));
  setTimeout(nextShadow,random(18000,28000));
  setTimeout(nextStar,random(85000,110000));
})();
