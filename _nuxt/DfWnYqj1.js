import{e as E,d as c,f as o,c as f}from"./BVDwJ206.js";function p(l){const i=l.split(`
`),s=[];for(let t=1;t<i.length;t+=1){const e=i[t];let n=e.indexOf(E);if(n<0&&(n=e.indexOf(c)),n<0||e.slice(n+1,n+o)!==f)throw new Error("Invalid input");const r=Math.floor(n/o),a="  ".repeat(r);s.push(`${a}- ${e.slice(n+o)}`)}return s.join(`
`)}const T={name:"Tree to Markdown list",options:[]};export{p as handle,T as meta};
