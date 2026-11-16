const $=id=>document.getElementById(id);
const SCALE=[[-Infinity,9,'FUCKIN ARCTIC HELL'],[10,30,'FUCKIN SEVERE COLD'],[31,45,'FUCKIN COLD'],[46,59,'STILL FUCKIN CHILLY'],[60,69,'NOT FUCKIN BAD'],[70,79,'FUCKIN PERFECT'],[80,89,'ITS FUCKIN HOT OUT'],[90,104,'ITS FUCKIN HELL'],[105,Infinity,'FUCKIN SURFACE OF THE SUN']];
const scale=t=>SCALE.find(([lo,hi])=>t>=lo&&t<=hi)?.[2]||'FUCKIN UNKNOWN';
const rain=c=>[51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(c);
const snow=c=>[71,73,75,77,85,86].includes(c);
function precip(c,amount=0){if(snow(c))return c===75||c===86||amount>=4?'MORE FUCKIN SNOW':'FUCKIN SNOW';if(rain(c))return [55,57,65,67,82,95,96,99].includes(c)||amount>=5?'MORE FUCKIN RAIN':'FUCKIN RAIN';return null}
function icon(c,day=1){if(c===0)return day?'☀️':'🌙';if(c<=2)return day?'🌤️':'☁️';if(c===3)return '☁️';if(c<=48)return '🌫️';if(snow(c))return '🌨️';if(c>=95)return '⛈️';if(rain(c))return '🌧️';return '☁️'}
function condition(c){return precip(c)|| (c===0?'FUCKIN CLEAR':c<=2?'PARTLY FUCKIN CLOUDY':c<=3?'FUCKIN CLOUDY':c<=48?'FUCKIN FOGGY':'FUCKIN CLOUDY')}
const dayName=s=>new Date(s+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'});
const longDay=s=>new Date(s+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'});
const hourName=s=>new Date(s).toLocaleTimeString('en-US',{hour:'numeric'}).replace(' ','');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function outlook(d){let high=d.daily.temperature_2m_max,low=d.daily.temperature_2m_min,codes=d.daily.weather_code,amount=d.daily.precipitation_sum||[],days=d.daily.time;let avg=high.reduce((a,b)=>a+b,0)/high.length;let headline=avg<=45?'THIS WEEK IS GONNA BE FUCKIN COLD! 🥶':avg<=59?'THIS WEEK IS GONNA BE FUCKIN CHILLY! 🧥':avg<=79?'THIS WEEK LOOKS FUCKIN DECENT! 😎':avg<=89?'THIS WEEK IS GONNA BE FUCKIN HOT! 🥵':'THIS WEEK IS GONNA BE FUCKIN HELL! 🔥';
const describe=i=>{let p=precip(codes[i],amount[i]);return `${longDay(days[i])} is ${p||scale(Math.round(high[i]))}`};
let first=describe(0)+'.';let trend=high[high.length-1]-high[0];let mid=days.length>3?`${describe(1)} and ${describe(2)}. `:'';let ending=trend>=7?'It gets FUCKIN WARMER as the week goes on!':trend<=-7?'It gets FUCKIN COLDER as the week goes on!':'The temperatures stay pretty FUCKIN STEADY.';
let wet=days.map((x,i)=>({i,p:precip(codes[i],amount[i])})).filter(x=>x.p);let wetText=wet.length?' '+wet.map(x=>`${longDay(days[x.i])}: ${x.p}`).join('. ')+'.':'';
let weekend=days.map((x,i)=>({i,day:new Date(x+'T12:00:00').getDay()})).filter(x=>x.day===0||x.day===6).map(x=>`${x.day===6?'Saturday':'Sunday'} looks ${precip(codes[x.i],amount[x.i])||scale(Math.round(high[x.i]))}`).join('. ');
$('outlookTitle').textContent=headline;$('outlookSummary').textContent=first+' '+mid+ending+wetText;$('outlookWeekend').textContent='FUCKIN WEEKEND OUTLOOK: '+(weekend?weekend+'.':'No weekend days in this forecast.');}
// Personality commentary is based on forecast data, not official safety alerts.
let lastForecast=null;
let roastIndex=0;
function makeRoasts(d){
 const temp=Math.round(d.current.temperature_2m), code=d.current.weather_code;
 const hourly=d.hourly, currentHour=d.current.time.slice(0,13);
 const start=Math.max(0,hourly.time.findIndex(t=>t.slice(0,13)>=currentHour));
 const next=hourly.temperature_2m.slice(start,Math.min(start+8,hourly.time.length));
 const wet=hourly.weather_code.slice(start,Math.min(start+8,hourly.time.length));
 const rainSoon=wet.some(rain),snowSoon=wet.some(snow);
 const upcoming=next.length?Math.round(Math.max(...next)-Math.min(...next)):0;
 let lines;
 if(code>=95)lines=['THE SKY IS THROWING A FUCKIN TANTRUM. ⛈️','FUCKIN THUNDER. FUCKIN DRAMA. CLASSIC WEATHER.','THE CLOUDS ARE HAVING A FULL-BLOWN FUCKIN ARGUMENT.'];
 else if(snow(code))lines=[precip(code,d.current.precipitation||0)==='MORE FUCKIN SNOW'?'MORE FUCKIN SNOW. THE SKY WON’T FUCKIN STOP. ❄️':'FUCKIN SNOW. THE SKY IS SHEDDING AGAIN. ❄️','SOMEONE TELL WINTER TO FUCKIN RELAX.','IT’S A FUCKIN SNOW GLOBE OUT THERE.'];
 else if(rain(code))lines=[precip(code,d.current.precipitation||0)==='MORE FUCKIN RAIN'?'MORE FUCKIN RAIN. IS THE SKY LEAKING?! 🌧️':'FUCKIN RAIN. OF COURSE IT IS. 🌧️','THE CLOUDS HAVE DECIDED TO FUCKIN CRY TODAY.','TAKE AN UMBRELLA. THE SKY’S BEING A FUCKIN JERK.'];
 else if(temp<=9)lines=['DON’T EVEN FUCKIN GO OUTSIDE UNLESS YOU HAVE TO. 🥶','THIS ISN’T COLD. THIS IS A FUCKIN FREEZER.','THE AIR IS TRYING TO FUCKIN FIGHT YOU.'];
 else if(temp<=30)lines=['IT’S FUCKIN BRUTAL OUT THERE. BUNDLE UP. 🧊','YOUR FACE IS GONNA FUCKIN NOTICE THIS WEATHER.','WINTER NEEDS TO FUCKIN CHILL. ACTUALLY, NO MORE CHILL.'];
 else if(temp<=45)lines=['FUCKIN COLD. GRAB A JACKET. ❄️','THE WEATHER SAID FUCK YOUR WARMTH.','YEP. STILL FUCKIN COLD OUTSIDE.'];
 else if(temp<=59)lines=['NOT FREEZING, BUT STILL FUCKIN CHILLY.','THE SUN ISN’T DOING ITS FUCKIN JOB TODAY.','A HOODIE SOUNDS LIKE A FUCKIN GOOD IDEA.'];
 else if(temp<=79)lines=['HOLY SHIT. THE WEATHER IS ACTUALLY FUCKIN DECENT. 😎','ENJOY IT BEFORE THE WEATHER FUCKS IT UP.','IT’S A PRETTY FUCKIN GOOD DAY OUT THERE.'];
 else if(temp<=89)lines=['IT’S FUCKIN HOT OUT. STAY HYDRATED. 🥵','THE SUN NEEDS TO FUCKIN BACK OFF.','WELCOME TO THE FUCKIN SWEAT ZONE.'];
 else lines=['IT’S FUCKIN HELL OUT THERE. FIND SOME SHADE. 🔥','THE SUN HAS CHOSEN FUCKIN VIOLENCE.','DON’T COOK YOURSELF OUT THERE. IT’S FUCKIN HOT.'];
 const trend=next.length>2?next[next.length-1]-next[0]:0;
 let hourlyLine=rainSoon&&snowSoon?'THE NEXT FEW HOURS ARE A FUCKIN MIX OF RAIN AND SNOW.':snowSoon?'FUCKIN SNOW IS IN THE NEXT FEW HOURS.':rainSoon?'FUCKIN RAIN IS IN THE NEXT FEW HOURS.':trend>=8?'IT GETS FUCKIN WARMER OVER THE NEXT FEW HOURS.':trend<=-8?'IT GETS FUCKIN COLDER OVER THE NEXT FEW HOURS.':upcoming<=5?'THE NEXT FEW HOURS LOOK PRETTY FUCKIN STEADY.':'THE WEATHER’S GONNA FUCKIN SHIFT A BIT TODAY.';
 return {lines,hourlyLine};
}
function renderPersonality(){if(!lastForecast)return;const {lines,hourlyLine}=makeRoasts(lastForecast);$('personalityLine').textContent=lines[roastIndex%lines.length];$('hourlyRoast').textContent=hourlyLine;$('newRoast').hidden=false;}
$('newRoast').addEventListener('click',()=>{roastIndex++;renderPersonality()});
function draw(d){lastForecast=d;roastIndex=0;renderPersonality();let now=Math.round(d.current.temperature_2m),code=d.current.weather_code;$('phrase').textContent=scale(now);$('condition').textContent=`${icon(code,d.current.is_day)} ${condition(code)}`;$('heroSymbol').textContent=icon(code,d.current.is_day);$('high').textContent='H: '+scale(Math.round(d.daily.temperature_2m_max[0]));$('low').textContent='L: '+scale(Math.round(d.daily.temperature_2m_min[0]));document.body.classList.toggle('hot',now>=80);document.body.classList.toggle('freezing',now<=30);window.setWeatherAtmosphere?.(code, d.current.is_day, now);
let start=d.hourly.time.findIndex(t=>t>=d.current.time.slice(0,13)+':00');start=Math.max(start,0);$('hourly').replaceChildren();for(let i=start;i<Math.min(start+24,d.hourly.time.length);i++){let t=Math.round(d.hourly.temperature_2m[i]),c=d.hourly.weather_code[i],p=precip(c,d.hourly.precipitation?.[i]||0);let el=document.createElement('div');el.className='hour';el.innerHTML=`<span class="time">${i===start?'Now':esc(hourName(d.hourly.time[i]))}</span><span class="emoji">${icon(c,d.hourly.is_day[i])}</span><span class="hour-label">${p||scale(t)}</span>`;$('hourly').append(el)}
$('daily').replaceChildren();let allLow=Math.min(...d.daily.temperature_2m_min),allHigh=Math.max(...d.daily.temperature_2m_max),span=Math.max(1,allHigh-allLow);for(let i=0;i<d.daily.time.length;i++){let lo=Math.round(d.daily.temperature_2m_min[i]),hi=Math.round(d.daily.temperature_2m_max[i]),c=d.daily.weather_code[i],p=precip(c,d.daily.precipitation_sum?.[i]||0);let el=document.createElement('div');el.className='day';let left=100*(lo-allLow)/span,width=Math.max(7,100*(hi-lo)/span);let chance=d.daily.precipitation_probability_max?.[i];el.innerHTML=`<strong>${i===0?'Today':dayName(d.daily.time[i])}</strong><span class="day-icon">${icon(c)}${chance>=25?`<small>${Math.round(chance)}%</small>`:''}</span><span class="lowtemp">${esc(scale(lo))}</span><div class="bar-track"><span class="bar-fill" style="left:${left}%;width:${Math.min(width,100-left)}%"></span></div><span class="hightemp">${esc(scale(hi))}</span><span class="day-label">${esc(p||scale(hi))}</span>`;$('daily').append(el)}outlook(d)}
async function loadWeather(lat,lon,name){$('status').textContent='Fetching live FUCKIN weather…';$('city').textContent=name;try{let url=new URL('https://api.open-meteo.com/v1/forecast');Object.entries({latitude:lat,longitude:lon,current:'temperature_2m,weather_code,is_day',hourly:'temperature_2m,weather_code,is_day,precipitation',daily:'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max',temperature_unit:'fahrenheit',precipitation_unit:'mm',timezone:'auto',forecast_days:7}).forEach(([k,v])=>url.searchParams.set(k,v));let r=await fetch(url);if(!r.ok)throw Error('Weather service unavailable');let d=await r.json();draw(d);$('status').textContent='LIVE • Updated '+new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});localStorage.setItem('fuckinWeatherCity',JSON.stringify({lat,lon,name}));}catch(e){$('status').textContent='Could not fetch weather. Check your connection and try again.';console.error(e)}}
async function searchCity(){let q=$('search').value.trim();if(!q)return;$('searchStatus').textContent='Searching…';try{let r=await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&name='+encodeURIComponent(q));if(!r.ok)throw Error('Search unavailable');let d=await r.json();if(!d.results?.length)throw Error('City not found');let c=d.results[0];$('searchStatus').textContent='';await loadWeather(c.latitude,c.longitude,[c.name,c.admin1].filter(Boolean).join(', '))}catch(e){$('searchStatus').textContent=e.message}}
$('searchBtn').addEventListener('click',searchCity);
$('search').addEventListener('keydown',e=>{if(e.key==='Enter')searchCity()});
const stored=()=>{try{return JSON.parse(localStorage.getItem('fuckinWeatherCity')||'null')}catch{return null}};
$('refresh').addEventListener('click',()=>{const c=stored();if(c&&Number.isFinite(c.lat)&&Number.isFinite(c.lon)){loadWeather(c.lat,c.lon,c.name||'Selected Location')}else{$('status').textContent='Choose a location below first.';$('search').focus()}});
$('locationBtn').addEventListener('click',()=>{if(!navigator.geolocation){$('status').textContent='Location unavailable. Search for a city.';return}$('status').textContent='Requesting location permission…';navigator.geolocation.getCurrentPosition(p=>loadWeather(p.coords.latitude,p.coords.longitude,'My Location'),()=>{$('status').textContent='Location denied or unavailable. Search for a city below.'},{timeout:12000})});
// Never preload the developer's location or hardcode a default city.
// A returning visitor sees only their own previously selected location, stored on their device.
const c=stored();if(c&&Number.isFinite(c.lat)&&Number.isFinite(c.lon)){loadWeather(c.lat,c.lon,c.name||'Selected Location')}else{$('status').textContent='Tap “Choose location” or enter your city below to get started.';}

$('gpsBtn').addEventListener('click',()=> $('locationBtn').click());
$('locationBtn').addEventListener('click',()=>document.querySelector('#searchPanel').scrollIntoView({behavior:'smooth'}));

// Fahrenheit is the default. The first Celsius attempt is a joke; the second asks for confirmation.
// Weather data remains Fahrenheit internally so the custom scale thresholds do not change.
let selectedUnit='F';
let celsiusAttempts=0;
const unitDialog=$('unitDialog');
function updateUnitButtons(){
 for(const u of ['F','C']){
  const b=$('unit'+u);b.classList.toggle('active',selectedUnit===u);
  b.setAttribute('aria-pressed',String(selectedUnit===u));
 }
}
function closeUnitDialog(){unitDialog.hidden=true;}
function showUnitDialog(title,description,actions){
 $('unitDialogTitle').textContent=title;
 $('unitDialogText').textContent=description;
 const buttons=$('unitDialogActions');buttons.replaceChildren();
 actions.forEach(({label,run,primary})=>{
  const b=document.createElement('button');b.type='button';b.textContent=label;
  if(primary)b.classList.add('primary');
  b.addEventListener('click',()=>{closeUnitDialog();run();});buttons.appendChild(b);
 });
 unitDialog.hidden=false;buttons.querySelector('button')?.focus();
}
$('unitF').addEventListener('click',()=>{selectedUnit='F';celsiusAttempts=0;updateUnitButtons();});
$('unitC').addEventListener('click',()=>{
 if(selectedUnit==='C')return;
 celsiusAttempts++;
 if(celsiusAttempts===1){
  selectedUnit='F';updateUnitButtons();
  showUnitDialog('YOU FUCKIN COMMIE! 😂','HERE, LET ME HELP YOU. BACK TO FAHRENHEIT YOU GO.',[
   {label:'FUCKIN FINE',primary:true,run:()=>{}}
  ]);
 }else{
  showUnitDialog('WHAT THE FUCK, ARE YOU SURE? 🤨','YOU REALLY WANNA USE CELSIUS?',[
   {label:'NO — °F',run:()=>{selectedUnit='F';celsiusAttempts=0;updateUnitButtons();}},
   {label:'YES — °C',primary:true,run:()=>{selectedUnit='C';updateUnitButtons();}}
  ]);
 }
});
unitDialog.addEventListener('click',e=>{if(e.target===unitDialog)closeUnitDialog()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!unitDialog.hidden)closeUnitDialog()});
updateUnitButtons();
