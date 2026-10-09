(function(){
"use strict";
var C=window.CONFIG,DD=window.DADOS,EV=window.EVENTOS,PR=window.PRESIDENTES;
var D=DD.ipca,W=DD.salario;
var Y1=Math.max.apply(null,Object.keys(D).map(Number));
var MN=1994*12+6,MX=Y1*12+D[Y1].length-1;
var M=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
var $=function(id){return document.getElementById(id)};
function wage(i){var v=W[0][2];W.forEach(function(w){if(w[0]*12+w[1]<=i)v=w[2]});return v}
function fmt(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function pc(n){return n.toLocaleString("pt-BR",{maximumFractionDigits:2})}
function yearAcc(y,a,b){var f=1;for(var m=a;m<=b;m++)f*=1+D[y][m]/100;return f}

var am=$("am"),ay=$("ay"),zm=$("zm"),zy=$("zy"),V=$("v");
M.forEach(function(m,i){am.add(new Option(m,i));zm.add(new Option(m,i))});
for(var y=1994;y<=Y1;y++){ay.add(new Option(y,y));zy.add(new Option(y,y))}
am.value=6;ay.value=1994;zm.value=D[Y1].length-1;zy.value=Y1;
$("periodo").textContent="julho/1994 a "+M[D[Y1].length-1]+"/"+Y1;
var at=DD.atualizadoEm.split("-");$("atualizado").textContent=at[2]+"/"+at[1]+"/"+at[0];

function go(){
  var a=+ay.value*12+ +am.value,z=+zy.value*12+ +zm.value;
  if(a<MN){ay.value=1994;am.value=6;a=MN}
  if(z<MN){zy.value=1994;zm.value=6;z=MN}
  if(a>MX){ay.value=Y1;am.value=D[Y1].length-1;a=MX}
  if(z>MX){zy.value=Y1;zm.value=D[Y1].length-1;z=MX}
  if(z<a){zy.value=ay.value;zm.value=am.value;z=a}
  var y0=+ay.value,m0=+am.value,y1=+zy.value,m1=+zm.value,f=1,ys=[];
  for(var y=y0;y<=y1;y++){var s=y==y0?m0:0,e=y==y1?m1:D[y].length-1,fy=yearAcc(y,s,e);f*=fy;ys.push([y,(fy-1)*100])}
  var v=+V.value||0,w0=wage(a),w1=wage(z),rl=((w1/w0)/f-1)*100;
  $("res").innerHTML='<div class="hero"><span class="lbl">'+fmt(v)+" em "+M[m0]+"/"+y0+' equivalem a</span><div class="big">'+fmt(v*f)+'</div><span class="lbl">em '+M[m1]+"/"+y1+" · hoje esse valor teria o poder de compra de "+fmt(v/f)+' no início</span></div>'+
  '<div class="stats">'+
  '<div class="st"><span>Inflação acumulada (IPCA)</span><b>'+pc((f-1)*100)+'%</b></div>'+
  '<div class="st"><span>Valor do salário mínimo</span><div class="rw"><em>'+M[m0]+"/"+y0+"</em><b>"+fmt(w0)+'</b></div><div class="rw"><em>'+M[m1]+"/"+y1+"</em><b>"+fmt(w1)+"</b></div><small>alta nominal de "+pc((w1/w0-1)*100)+"%</small></div>"+
  '<div class="st"><span>Seu dinheiro em nº de salários mínimos</span><div class="rw"><em>'+fmt(v)+" em "+M[m0]+"/"+y0+"</em><b>"+pc(v/w0)+'</b></div><div class="rw"><em>'+fmt(v*f)+" em "+M[m1]+"/"+y1+"</em><b>"+pc(v*f/w1)+"</b></div><small>valor corrigido pelo IPCA</small></div>"+
  '<div class="st"><span>Mínimo acima da inflação</span><b class="'+(rl>=0?"up":"down")+'">'+(rl>=0?"+":"−")+pc(Math.abs(rl))+"%</b><small>"+(rl>=0?"ganho real":"perda real")+" no período</small></div></div>";
  var mx=Math.max.apply(null,ys.map(function(x){return Math.abs(x[1])}).concat([1]));
  $("ch").innerHTML=ys.map(function(p){return '<div class="b'+(p[1]>=10?" hi":"")+'" style="height:'+Math.max(p[1],0)/mx*100+'%" title="'+p[0]+": "+pc(p[1])+'%"></div>'}).join("");
  $("lb").innerHTML=ys.map(function(p){return "<span>"+String(p[0]).slice(2)+"</span>"}).join("");
  var t="";
  EV.filter(function(e){return e[0]>=y0&&e[0]<=y1}).forEach(function(e){
    var yy=e[0],ln=D[yy].length,s0=yy==1994?6:0,yr=(yearAcc(yy,s0,ln-1)-1)*100;
    var lb=yy==1994?"IPCA jul–dez":ln<12?"IPCA jan–"+M[ln-1]:"IPCA do ano";
    var p=PR.filter(function(p){return yy>=p[0]&&yy<=p[1]}).map(function(p){return '<span class="pres">'+p[2]+"</span>"}).join("");
    t+='<div class="ev"><small>'+yy+" · "+lb+": "+pc(yr)+"% · Salário mínimo no fim do ano: "+fmt(wage(yy*12+ln-1))+"</small><br>"+p+"<b>"+e[1]+"</b><br>"+e[2]+"</div>"});
  $("tl").innerHTML=t||"Sem eventos cadastrados neste período.";
}
[am,ay,zm,zy,V].forEach(function(e){e.addEventListener("input",go)});go();

/* Botão de consultoria */
(function(){
  var box=$("cta");if(!box)return;
  if(!C.CONSULTORIA_URL){box.hidden=true;return}
  var u;try{u=new URL(C.CONSULTORIA_URL)}catch(e){box.hidden=true;return}
  u.searchParams.set("utm_source","site-inflacao");u.searchParams.set("utm_medium","calculadora");u.searchParams.set("utm_campaign","consultoria");
  $("cta-t").textContent=C.CONSULTORIA_TITULO;$("cta-p").textContent=C.CONSULTORIA_TEXTO;$("cta-p").hidden=!C.CONSULTORIA_TEXTO;
  var b=$("cta-b");b.textContent=C.CONSULTORIA_BOTAO;b.href=u.toString();
})();

/* Anúncios e consentimento de cookies (LGPD) */
(function(){
  var KEY="consentimento-anuncios",ads=!!C.ADSENSE_CLIENT;
  function ler(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function gravar(x){try{localStorage.setItem(KEY,x)}catch(e){}}
  var slots=document.querySelectorAll(".ad[data-slot]");
  function previa(){slots.forEach(function(el){el.hidden=false;el.classList.add("previa");el.textContent="Espaço reservado para anúncio ("+el.dataset.slot+")"})}
  function carregar(){
    if(!document.querySelector("script[data-ads]")){var s=document.createElement("script");s.async=true;s.setAttribute("data-ads","1");s.crossOrigin="anonymous";s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(C.ADSENSE_CLIENT);document.head.appendChild(s)}
    slots.forEach(function(el){var id=C.SLOTS&&C.SLOTS[el.dataset.slot];if(!id||el.dataset.ok)return;el.dataset.ok="1";el.hidden=false;el.className="ad";
      el.innerHTML='<small>Publicidade</small><ins class="adsbygoogle" style="display:block" data-ad-client="'+C.ADSENSE_CLIENT+'" data-ad-slot="'+id+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      (window.adsbygoogle=window.adsbygoogle||[]).push({})})}
  var bar=$("cookie");
  if(!ads){if(C.MODO_PREVIA)previa();return}
  var c=ler();
  if(c==="sim")carregar();else if(c===null)bar.hidden=false;
  $("ck-sim").onclick=function(){gravar("sim");bar.hidden=true;carregar()};
  $("ck-nao").onclick=function(){gravar("nao");bar.hidden=true};
  var g=$("ck-gerir");g.hidden=false;g.onclick=function(ev){ev.preventDefault();bar.hidden=false};
})();
})();
