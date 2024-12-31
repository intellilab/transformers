const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./BM1hUVjx.js","./CNVyilSt.js","./entry.whQpWaPK.css","./C-qBzMy0.js"])))=>i.map(i=>d[i]);
import{m as M,r as N,n as w,p as z,g as $,o as g,c as b,a as u,q as S,v as L,s as E,u as y,F as H,x as O,b as V,y as j,t as k}from"./CNVyilSt.js";import{_ as D}from"./C-qBzMy0.js";function p(r,t="Assertion error"){if(!r)throw new Error(t)}function h(r){return typeof r=="string"&&(r=r.trim(),r.endsWith("%")?r=+r.slice(0,-1)*2.55:r=+r),p(!Number.isNaN(r)),Math.max(0,Math.min(255,r))}function F(r){return r=+r,p(!Number.isNaN(r)),Math.max(0,Math.min(1,r))}function _(r){const{r:t,g:s,b:i,a:e}=r;return{r:h(t),g:h(s),b:h(i),a:F(e)}}function v(r){{const t=r.match(/^\s*rgb(a?)\((.*?)\)\s*$/);if(t){const[,s,i]=t,e=i.split(",");p(e.length===3+!!s),s||e.push(1);const[n,o,a,l]=e;return _({r:n,g:o,b:a,a:l})}}{const t=r.match(/^\s*hsl(a?)\((.*?)\)\s*$/);if(t){const[,s,i]=t,e=i.split(",");p(e.length===3+!!s);let[n,o,a]=e;n=(n%360+360)%360/360,p(o.endsWith("%")),o=+o.slice(0,-1)/100,p(a.endsWith("%")),a=+a.slice(0,-1)/100;const[l,c,f]=W(n,o,a).map(C=>C*255),m=s?e[3]:1;return _({r:l,g:c,b:f,a:m})}}{const t=r.match(/^\s*#([0-9a-fA-F]{3,8})\s*$/);if(t){const[,s]=t;p([3,4,6,8].includes(s.length));const i=s.length<6,e=i?1:2,[n,o,a,l]=Array.from({length:4},(f,m)=>s.slice(m*e,m*e+e)).map(f=>parseInt(f,16)*(i?17:1)),c=Number.isNaN(l)?1:l/255;return _({r:n,g:o,b:a,a:c})}}p(!1)}function A(r){return`${+r.toFixed(3)}`.replace(/^0./,".")}function P(r){const{r:t,g:s,b:i,a:e}=r,n=[t,s,i].map(a=>Math.floor(a));e!==1&&n.push(Math.floor(e*255));let o=n.map(a=>a.toString(16).padStart(2,"0"));return o.every(a=>a[0]===a[1])&&(o=o.map(a=>a[0])),`#${o.join("")}`}function I(r){let{r:t,g:s,b:i,a:e}=r;return t|=0,s|=0,i|=0,e=A(e),e==="1"?`rgb(${t},${s},${i})`:`rgba(${t},${s},${i},${e})`}function T(r){const{r:t,g:s,b:i}=r;let[e,n,o]=B(...[t,s,i].map(l=>l/255));e|=0,n=n*100|0,o=o*100|0;const a=A(r.a);return a==="1"?`hsl(${e},${n}%,${o}%)`:`hsla(${e},${n}%,${o}%,${a})`}function W(r,t,s){const i=s<=.5?s*(t+1):s+t-s*t,e=s*2-i,n=x(e,i,r+1/3),o=x(e,i,r),a=x(e,i,r-1/3);return[n,o,a]}function x(r,t,s){return s<0?s+=1:s>1&&(s-=1),s*6<1?r+(t-r)*s*6:s*2<1?t:s*3<2?r+(t-r)*(2/3-s)*6:r}function B(r,t,s){const i=Math.min(r,t,s),e=Math.max(r,t,s),n=e-i,o=(i+e)/2;return[U(r,t,s,e,n),n===0?0:n/(1-Math.abs(2*o-1)),o]}function U(r,t,s,i,e){let n=0;return e&&(i===r?n=(t-s)/e%6:i===t?n=(s-r)/e+2:i===s&&(n=(r-t)/e+4),n*=60),n<0?n+360:n}const q={class:"flex mb-2"},R={class:"flex-1 mr-4"},J={class:"flex"},K={class:"flex-1"},Q=["textContent"],X=["value"],d=N([]);Y();async function Y(){const r=await Promise.all(Object.values(Object.assign({"/components/color/pipes/dealpha.ts":()=>w(()=>import("./BM1hUVjx.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)})).map(async t=>await t()));d.value=r}const Z=M({__name:"color",setup(r){const t=z({input:"",output:{Hex:"",RGBA:"",HSLA:""},pipes:[]});$(()=>t.input,e=>{try{t.inputColor=e&&v(e),t.inputError=null}catch(n){t.inputColor=null,t.inputError=n}}),$(()=>[d.value,t.pipes,t.inputColor],()=>{let e;try{let n=t.inputColor;for(const{name:o,options:a}of t.pipes){const l=d.value.find(c=>c.meta.name===o);l&&(e=o,n=l.handle(n,a))}t.output=i(n),t.errorPipe=""}catch(n){t.error=n,t.errorPipe=e}});function s(e){try{return`background-color: ${P(v(e))}`}catch{return null}}function i(e){return{Hex:e&&P(e),RGBA:e&&I(e),HSLA:e&&T(e)}}return(e,n)=>(g(),b("div",null,[n[5]||(n[5]=u("h1",null,"Color Pipes",-1)),u("section",q,[u("div",R,[n[3]||(n[3]=u("label",null,"Input",-1)),u("div",J,[S(u("input",{class:E(["form-input flex-1",{"bg-red-300":t.inputError}]),"onUpdate:modelValue":n[0]||(n[0]=o=>t.input=o)},null,2),[[L,t.input]]),u("div",{class:"w-8 h-8 ml-2 border border-gray-400",style:y(s(t.input))},null,4)])]),u("div",K,[n[4]||(n[4]=u("label",null,"Output",-1)),(g(!0),b(H,null,O(t.output,(o,a)=>(g(),b("div",{class:"flex items-center",key:a},[u("div",{class:"w-16 text-gray-600",textContent:k(a)},null,8,Q),u("input",{class:"form-input flex-1",readonly:"",value:o,onClick:n[1]||(n[1]=l=>l.target.select())},null,8,X),u("div",{class:"w-8 h-8 ml-2 border border-gray-400",style:y({background:o})},null,4)]))),128))])]),V(j(D),{pipeList:d.value,errorPipe:t.errorPipe,modelValue:t.pipes,"onUpdate:modelValue":n[2]||(n[2]=o=>t.pipes=o)},null,8,["pipeList","errorPipe","modelValue"])]))}}),et=Object.freeze(Object.defineProperty({__proto__:null,default:Z},Symbol.toStringTag,{value:"Module"}));export{et as c,v as p};
