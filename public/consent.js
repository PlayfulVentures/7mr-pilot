// Einwilligung (Cookie-Banner) + Messung. Ohne Einwilligung wird nichts von PostHog oder Meta geladen.
// Seiten melden Ereignisse mit mr7.track(name, props, opts); vor einer Entscheidung warten sie, nach "Ablehnen" fallen sie weg.
(function(){
var KEY='7mr_consent', V=1;
var PH_KEY='phc_rwCgVEuNkFtfvjUX8Zcoa8h7aheUcLxtrkjf8JPv54sV', PH_HOST='https://eu.i.posthog.com';
var META_PIXEL='601275581981813';
var PH_EVENT={video_opened:'session_video_opened',video_progress:'session_video_progress',checkout_clicked:'checkout_clicked',purchase:'pilot_purchased'};
var META_EVENT={video_opened:['ViewContent',{content_name:'Beispiel-Session',content_type:'video'}],checkout_clicked:['InitiateCheckout',{value:29,currency:'EUR'}],purchase:['Purchase',{value:29,currency:'EUR'}]};
var pending=[], loaded={stats:false,marketing:false};

function read(){try{var c=JSON.parse(localStorage.getItem(KEY)||'null');return c&&c.v===V?c:null}catch(e){return null}}
function write(stats,marketing){var c={v:V,stats:!!stats,marketing:!!marketing,ts:new Date().toISOString()};try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}return c}

function loadPostHog(){
if(loaded.stats)return;loaded.stats=true;
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify reset get_distinct_id set_config opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
window.posthog.init(PH_KEY,{api_host:PH_HOST,person_profiles:'identified_only',capture_pageview:true,capture_pageleave:true,autocapture:false,capture_dead_clicks:false,capture_performance:false,enable_heatmaps:false,disable_session_recording:true,disable_surveys:true,persistence:'localStorage+cookie'});
}
function loadMeta(){
if(loaded.marketing)return;loaded.marketing=true;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
window.fbq('init',META_PIXEL);window.fbq('track','PageView');
}

function send(name,props,opts){
var c=read();if(!c||!(c.stats||c.marketing))return;props=props||{};opts=opts||{};
if(opts.once){var ok='mr7_once_'+opts.once;try{if(localStorage.getItem(ok))return;localStorage.setItem(ok,'1')}catch(e){}}
if(c.stats&&window.posthog&&PH_EVENT[name])window.posthog.capture(PH_EVENT[name],props,opts.beacon?{transport:'sendBeacon'}:undefined);
if(c.marketing&&window.fbq&&META_EVENT[name])window.fbq('track',META_EVENT[name][0],META_EVENT[name][1],opts.eventID?{eventID:opts.eventID}:undefined);
}
function apply(c){
if(c.stats)loadPostHog();
if(c.marketing)loadMeta();
var q=pending;pending=[];q.forEach(function(e){send(e[0],e[1],e[2])});
}
function clearTracking(stats,marketing){
if(stats&&window.posthog&&window.posthog.set_config)try{window.posthog.set_config({disable_persistence:true})}catch(e){}
var re=stats&&marketing?/^(ph_|_fbp|_fbc)/:stats?/^ph_/:/^(_fbp|_fbc)/;
var del=function(n){document.cookie=n+'=; Max-Age=0; path=/';document.cookie=n+'=; Max-Age=0; path=/; domain=.'+location.hostname.replace(/^www\./,'')};
document.cookie.split(';').forEach(function(p){var n=p.split('=')[0].trim();if(re.test(n))del(n)});
if(stats)try{Object.keys(localStorage).forEach(function(k){if(/^ph_/.test(k))localStorage.removeItem(k)})}catch(e){}
}

var CSS='.mr7c{position:fixed;z-index:50;left:12px;right:12px;bottom:12px;max-width:520px;margin:0 auto;background:#fffdf9;color:#1d1d1b;border:1px solid #e4ddcf;border-radius:18px;padding:18px 18px 16px;box-shadow:0 24px 48px -20px rgba(70,55,30,.45),0 4px 12px rgba(70,55,30,.08);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
+'.mr7c h2{font:600 17px/1.3 ui-serif,"New York","Iowan Old Style",Georgia,serif;margin:0 0 6px;text-align:left}'
+'.mr7c p{margin:0 0 14px;color:#5b5a53;font-size:14.5px}.mr7c a{color:#2f6b47}'
+'.mr7c .row{display:flex;gap:10px}.mr7c .row button{flex:1}'
+'.mr7c button.b1,.mr7c button.b2{padding:12px 14px;border-radius:12px;font-family:inherit;font-weight:600;font-size:15px;line-height:1.2;cursor:pointer}'
+'.mr7c .b1{background:#2f6b47;color:#fff;border:1.5px solid #2f6b47}.mr7c .b2{background:#fffdf9;color:#1d1d1b;border:1.5px solid #cfc6b4}'
+'.mr7c .more{display:block;margin:12px auto 0;background:none;border:0;padding:4px;font:inherit;font-size:13.5px;color:#5b5a53;text-decoration:underline;text-underline-offset:3px;cursor:pointer}'
+'.mr7c label{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid #efe8da;font-size:14px;color:#5b5a53;cursor:pointer}'
+'.mr7c label b{display:block;color:#1d1d1b;font-weight:600}.mr7c input{margin-top:3px;width:18px;height:18px;accent-color:#2f6b47;flex:none}'
+'.mr7c .opts{margin:0 0 14px}.mr7c button:focus-visible{outline:3px solid rgba(47,107,71,.35);outline-offset:2px}'
+'[data-consent-open]{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}';

var box=null;
function close(){if(box){box.remove();box=null}}
function show(withOptions){
close();var c=read()||{stats:false,marketing:false};
if(!document.getElementById('mr7c-css')){var st=document.createElement('style');st.id='mr7c-css';st.textContent=CSS;document.head.appendChild(st)}
box=document.createElement('div');box.className='mr7c';box.setAttribute('role','dialog');box.setAttribute('aria-label','Cookie-Einstellungen');
box.innerHTML='<h2>Dürfen wir messen?</h2>'
+'<p>Mit deiner Einwilligung sehen wir, wie die Seite genutzt wird (PostHog) und welche Anzeigen zu Buchungen führen (Meta-Pixel). Ohne Einwilligung bleibt beides aus. Du kannst deine Wahl jederzeit unten auf der Seite über „Cookie-Einstellungen“ ändern. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>'
+(withOptions?'<div class="opts">'
+'<label><input type="checkbox" checked disabled><span><b>Notwendig</b>Speichert nur deine Auswahl in diesem Browser.</span></label>'
+'<label><input type="checkbox" data-k="stats"'+(c.stats?' checked':'')+'><span><b>Statistik (PostHog)</b>Seitenaufrufe, Videostart, Klick auf „Platz sichern“, Buchung. Server in der EU.</span></label>'
+'<label><input type="checkbox" data-k="marketing"'+(c.marketing?' checked':'')+'><span><b>Marketing (Meta-Pixel)</b>Misst, welche Anzeigen auf Facebook und Instagram wirken. Daten gehen an Meta, auch in die USA.</span></label>'
+'</div><div class="row"><button type="button" class="b2" data-a="save">Auswahl speichern</button><button type="button" class="b1" data-a="all">Alle akzeptieren</button></div>'
:'<div class="row"><button type="button" class="b2" data-a="none">Ablehnen</button><button type="button" class="b1" data-a="all">Akzeptieren</button></div><button type="button" class="more" data-a="opts">Einstellungen</button>');
document.body.appendChild(box);
box.addEventListener('click',function(e){var a=e.target.closest('[data-a]');if(!a)return;var k=a.getAttribute('data-a');
if(k==='opts')return show(true);
var before=read(),s=false,m=false;
if(k==='all'){s=m=true}else if(k==='save'){s=box.querySelector('[data-k="stats"]').checked;m=box.querySelector('[data-k="marketing"]').checked}
var c2=write(s,m);close();
if(before&&((before.stats&&!s)||(before.marketing&&!m))){clearTracking(!s,!m);location.reload();return}
if(!s&&!m)pending=[];apply(c2);});
var first=box.querySelector('button');if(first&&withOptions)first.focus();
}

window.mr7={
track:function(name,props,opts){var c=read();if(!c){pending.push([name,props,opts]);return}send(name,props,opts)},
open:function(){show(true)}
};
document.addEventListener('click',function(e){if(e.target.closest('[data-consent-open]')){e.preventDefault();show(true)}});
var c0=read();
if(c0){if(!c0.stats||!c0.marketing)clearTracking(!c0.stats,!c0.marketing);apply(c0)}else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){show(false)});else show(false);
})();
