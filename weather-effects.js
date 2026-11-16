/* Lightweight, dependency-free canvas weather particles. */
(()=>{'use strict';
const canvas=document.getElementById('weatherFx');if(!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let mode='none',particles=[],width=0,height=0,frame=0,last=0;
function resize(){const dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);populate()}
function populate(){const count=mode==='snow'?Math.min(130,Math.floor(width*height/8000)):mode==='rain'?Math.min(170,Math.floor(width*height/5500)):0;particles=Array.from({length:count},()=>particle(true))}
function particle(randomY=false){return{x:Math.random()*width,y:randomY?Math.random()*height:-30,r:mode==='snow'?1.5+Math.random()*3:1+Math.random(),speed:mode==='snow'?0.5+Math.random()*1.3:9+Math.random()*7,drift:(Math.random()-.5)*1.1,alpha:.25+Math.random()*.5}}
function tick(ts){frame=requestAnimationFrame(tick);if(reduced.matches||!mode||mode==='none'||document.hidden)return;if(ts-last<30)return;last=ts;ctx.clearRect(0,0,width,height);ctx.lineCap='round';for(let i=0;i<particles.length;i++){let p=particles[i];ctx.strokeStyle=mode==='rain'?`rgba(200,227,255,${p.alpha})`:`rgba(255,255,255,${p.alpha})`;ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;ctx.beginPath();if(mode==='rain'){ctx.lineWidth=p.r;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-3,p.y+17);ctx.stroke();p.x-=2;p.y+=p.speed}else{ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.x+=p.drift+Math.sin(ts/1300+i)*.4;p.y+=p.speed}if(p.y>height+30||p.x<-40||p.x>width+40)particles[i]=particle()}}
window.setWeatherAtmosphere=(code,isDay,temp)=>{let next=([71,73,75,77,85,86].includes(code))?'snow':([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code))?'rain':'none';const cls=code>=95?'storm':next!=='none'?next:code===0?'clear':code<=2?'partly':'cloudy';document.body.classList.remove('wx-clear','wx-partly','wx-cloudy','wx-rain','wx-snow','wx-storm','wx-night');document.body.classList.add('wx-'+cls);if(!isDay)document.body.classList.add('wx-night');if(next!==mode){mode=next;populate()}if(reduced.matches)ctx.clearRect(0,0,width,height)};
addEventListener('resize',resize,{passive:true});reduced.addEventListener?.('change',()=>{if(reduced.matches)ctx.clearRect(0,0,width,height)});resize();frame=requestAnimationFrame(tick);
})();
