function l(t){const c=atob(t);return s(c)}const r={name:"Base64 to Text",options:[]};function s(t){const c=[];let e=0,o=0,h=0,n=0;for(;e<t.length;)o=t.charCodeAt(e),o<128?(c.push(o),e+=1):o>191&&o<224?(h=t.charCodeAt(e+1),c.push((o&31)<<6|h&63),e+=2):(h=t.charCodeAt(e+1),n=t.charCodeAt(e+2),c.push((o&15)<<12|(h&63)<<6|n&63),e+=3);return String.fromCharCode(...c)}export{l as handle,r as meta};