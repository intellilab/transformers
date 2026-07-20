import{r as e,t}from"./QTnfLwEv.js";import{t as n}from"./HclGiUj8.js";var r=t(((e,t)=>{t.exports=class{#e;constructor(e=[]){this.#e=[new Map(e)]}get size(){return this.#e.reduce((e,t)=>e+t.size,0)}clear(){this.#e=[new Map]}delete(e){return this.#e.some(t=>t.delete(e))}get(e){for(let t of this.#e)if(t.has(e))return t.get(e)}has(e){return this.#e.some(t=>t.has(e))}set(e,t){let n=this.#e[0];for(let t of this.#e)if(t.has(e)){n=t;break}return!n.has(e)&&n.size>=8388608&&(this.#e.unshift(new Map),n=this.#e[0]),n.set(e,t),this}*[Symbol.iterator](){for(let e of this.#e)yield*e}*keys(){for(let e of this.#e)yield*e.keys()}*values(){for(let e of this.#e)yield*e.values()}*entries(){for(let e of this.#e)yield*e.entries()}forEach(e,t){for(let[n,r]of this)e.call(t,r,n,this)}}})),i=e(t(((e,t)=>{var n=r();function i(e,t){let n=e.toLowerCase(),r=t.toLowerCase();if(r===``)return!1;if(r.indexOf(`*`)===-1&&r.indexOf(`?`)===-1&&r.indexOf(`[`)===-1&&r.indexOf(`{`)===-1)return n===r;let a=r,o=a.match(/\{([^}]+)\}/);if(o)return o[1].split(`,`).map(e=>a.replace(o[0],e.trim())).some(t=>i(e,t));let s=``,c=0;for(;c<a.length;){let e=a[c];if(e===`*`)s+=`.*`;else if(e===`?`)s+=`.`;else if(e===`[`){let e=c+1,t=`[`;for(;e<a.length&&a[e]!==`]`;)t+=a[e],e++;e<a.length?(t+=`]`,s+=t,c=e):s+=`\\[`}else/[.+^${}()|\\]/.test(e)?s+=`\\`+e:s+=e;c++}try{return RegExp(`^`+s+`$`,`i`).test(e)}catch{return n===r}}var a=20;t.exports=class{constructor(e={}){typeof e==`string`&&(e={dbName:e}),this.store=new n,this.expireTimes=new n,this.db=null,this.dbName=e.dbName,this.dbVersion=e.dbVersion||1,this.isIndexedDBAvailable=!1,this.isInitialized=!1,this.initPromise=null,this.storeSet=(e,t)=>{this.store.set(e,t),this._initCleanupLoop(a),this.isIndexedDBAvailable&&this.db&&this._persistToIndexedDB(e,t)},this._initIndexedDB()}_initIndexedDB(){typeof window<`u`&&window.indexedDB&&this.dbName?(this.isIndexedDBAvailable=!0,this.initPromise=this._setupIndexedDB()):this.isInitialized=!0}async _setupIndexedDB(){try{this.db=await this._openDatabase(),await this._loadFromIndexedDB(),this.isInitialized=!0}catch(e){console.warn(`Failed to initialize IndexedDB:`,e),this.isIndexedDBAvailable=!1,this.isInitialized=!0}}_openDatabase(){return new Promise((e,t)=>{let n=indexedDB.open(this.dbName,this.dbVersion);n.onerror=()=>t(n.error),n.onsuccess=()=>e(n.result),n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(`store`)||t.createObjectStore(`store`,{keyPath:`key`}),t.objectStoreNames.contains(`expireTimes`)||t.createObjectStore(`expireTimes`,{keyPath:`key`})}})}async _loadFromIndexedDB(){if(this.db)try{let e=this.db.transaction([`store`,`expireTimes`],`readonly`),t=e.objectStore(`store`),n=e.objectStore(`expireTimes`),r=t.getAll(),i=n.getAll(),[a,o]=await Promise.all([new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)}),new Promise((e,t)=>{i.onsuccess=()=>e(i.result),i.onerror=()=>t(i.error)})]);a.forEach(e=>{this.store.set(e.key,e.value)}),o.forEach(e=>{this.expireTimes.set(e.key,e.expireTime)});let s=Date.now();for(let[e,t]of this.expireTimes.entries())s>t&&(this.store.delete(e),this.expireTimes.delete(e),this._removeFromIndexedDB(e))}catch(e){console.warn(`Failed to load data from IndexedDB:`,e)}}async _persistToIndexedDB(e,t){if(this.db)try{this.db.transaction([`store`],`readwrite`).objectStore(`store`).put({key:e,value:t})}catch(e){console.warn(`Failed to persist to IndexedDB:`,e)}}async _persistExpirationToIndexedDB(e,t){if(this.db)try{let n=this.db.transaction([`expireTimes`],`readwrite`).objectStore(`expireTimes`);t===void 0?n.delete(e):n.put({key:e,expireTime:t})}catch(e){console.warn(`Failed to persist expiration to IndexedDB:`,e)}}async _removeFromIndexedDB(e){if(this.db)try{let t=this.db.transaction([`store`,`expireTimes`],`readwrite`),n=t.objectStore(`store`),r=t.objectStore(`expireTimes`);n.delete(e),r.delete(e)}catch(e){console.warn(`Failed to remove from IndexedDB:`,e)}}async waitForInitialization(){this.isInitialized||this.initPromise&&await this.initPromise}set(e,t,n={}){let{NX:r=!1,XX:i=!1,GET:a=!1,EX:o=void 0,PX:s=void 0,EXAT:c=void 0,PXAT:l=void 0,KEEPTTL:u=!1}=n,d=r,f=i,p=a,m=o?parseInt(o,10):void 0,h=s?parseInt(s,10):void 0,g=c?parseInt(c,10):void 0,_=l?parseInt(l,10):void 0,v=u,y=this.store.has(e);if(f&&!y||d&&y)return;let b;if(p&&y&&(b=this.store.get(e)),this.storeSet(e,t),m!==void 0||h!==void 0||g!==void 0||_!==void 0||v){let t;m===void 0?h===void 0?g===void 0?_===void 0?v&&y&&(t=this.expireTimes.get(e)):t=_:t=g*1e3:t=Date.now()+h:t=Date.now()+m*1e3,t!==void 0&&(this.expireTimes.set(e,t),this.isIndexedDBAvailable&&this.db&&this._persistExpirationToIndexedDB(e,t))}else this.expireTimes.delete(e),this.isIndexedDBAvailable&&this.db&&this._persistExpirationToIndexedDB(e,void 0);return!p||b}get(e){if(!this._checkAndRemoveExpiredKey(e))return this.store.get(e)}del(...e){let t=0;for(let n of e)this._checkAndRemoveExpiredKey(n)||this.store.delete(n)&&(this.expireTimes.delete(n),this.isIndexedDBAvailable&&this.db&&this._removeFromIndexedDB(n),t++);return t}exists(...e){let t=0;for(let n of e)this._checkAndRemoveExpiredKey(n)||this.store.has(n)&&t++;return t}incr(e){return this.incrby(e,1)}incrby(e,t){let n=this.store.get(e);if(n===void 0)n=0;else if(!Number.isInteger(Number(n)))throw Error(`ERR value is not an integer`);let r=Number(n)+t;return this.storeSet(e,r.toString()),r}decr(e){try{return this.decrby(e,1)}catch(e){throw e}}decrby(e,t){let n=this.store.get(e);if(n===void 0)n=0;else if(!Number.isInteger(Number(n)))throw Error(`ERR value is not an integer`);let r=Number(n)-t;return this.storeSet(e,r.toString()),r}expire(e,t,n={}){if(!this.store.has(e))return 0;let{NX:r=!1,XX:i=!1,GT:a=!1,LT:o=!1}=n,s=Date.now(),c=this.expireTimes.get(e);return r&&c!==void 0||i&&c===void 0||a&&(c===void 0||c<=s+t*1e3)||o&&(c===void 0||c>=s+t*1e3)?0:(this.expireTimes.set(e,s+t*1e3),1)}keys(e){let t=[];for(let[n,r]of this.store.entries())if(i(n,e)){let e=this.expireTimes.get(n);(e===void 0||e>Date.now())&&t.push(n)}return t}mget(...e){return e.map(e=>this.get(e))}mset(...e){if(e.length%2!=0)throw Error(`MSET requires an even number of arguments`);for(let t=0;t<e.length;t+=2)this.set(e[t],e[t+1]);return!0}renamenx(e,t){if(!this.store.has(e)||this.store.has(t))return 0;let n=this.store.get(e);if(this.store.delete(e),this.storeSet(t,n),this.expireTimes.has(e)){let n=this.expireTimes.get(e);this.expireTimes.delete(e),this.expireTimes.set(t,n)}return 1}randomkey(){let e=Array.from(this.store.keys());if(e.length!==0)return e[Math.floor(Math.random()*e.length)]}expireat(e,t,n={}){if(typeof t!=`number`||isNaN(t))throw Error(`ERR invalid expire time in SETEX`);if(!this.store.has(e))return 0;let{NX:r=!1,XX:i=!1,GT:a=!1,LT:o=!1}=n,s=Date.now(),c=t*1e3-s;if(c<=0)return this.store.delete(e),this.expireTimes.delete(e),0;let l=this.pttl(e);return i&&l===-1||r&&l!==-1||a&&l!==-1&&c<=l||o&&l!==-1&&c>=l?0:this.pexpire(e,c)}pexpire(e,t,n={}){let{NX:r=!1,XX:i=!1,GT:a=!1,LT:o=!1}=n;if(r&&this.store.has(e)||i&&!this.store.has(e))return 0;if(a||o){let n=this.pttl(e);if(a&&n>=t||o&&n<=t)return 0}return this.expireTimes.set(e,Date.now()+t),1}pexpireat(e,t){let n=t-Date.now();return n<=0?(this.store.delete(e),this.expireTimes.delete(e),0):this.pexpire(e,n)}pttl(e){if(!this.store.has(e))return-2;if(!this.expireTimes.has(e))return-1;let t=this.expireTimes.get(e)-Date.now();return t>0?t:-2}ttl(e){if(!this.store.has(e))return-2;if(!this.expireTimes.has(e))return-1;let t=Math.floor((this.expireTimes.get(e)-Date.now())/1e3);return t>0?t:-2}persist(e){return!this.store.has(e)||!this.expireTimes.has(e)?0:(this.expireTimes.delete(e),this.isIndexedDBAvailable&&this.db&&this._persistExpirationToIndexedDB(e,void 0),1)}getrange(e,t,n){let r=this.get(e);return typeof r==`string`?r.slice(t,n+1):``}getset(e,t){let n=this.get(e);return this.set(e,t),n}setex(e,t,n){if(this.store.has(e))return this.set(e,t),this.expire(e,n),!0}setrange(e,t,n){if(typeof t!=`number`||t<0)throw Error(`Invalid offset value`);if(typeof n!=`string`)throw Error(`Value must be a string`);let r=this.get(e);(r===void 0||r===void 0)&&(r=``);let i=r.slice(0,t),a=r.slice(t+n.length),o=i+n+a;return this.set(e,o),o.length}strlen(e){let t=this.get(e);return t===void 0?0:t.length}msetnx(...e){if(e.length%2!=0)throw Error(`MSETNX requires an even number of arguments`);for(let t=0;t<e.length;t+=2)if(this.store.has(e[t]))return 0;for(let t=0;t<e.length;t+=2)this.set(e[t],e[t+1]);return 1}incrbyfloat(e,t){let n=this.store.get(e);if(n===void 0)n=0;else if(isNaN(parseFloat(n)))throw Error(`ERR value is not a valid float`);let r=parseFloat(n)+t;return this.storeSet(e,r.toString()),r}append(e,t){let n=this.get(e),r=n===void 0?t:n+t;return this.set(e,r),r.length}getbit(e,t){let n=this.get(e);if(n===void 0||t>=n.length*8)return 0;let r=Math.floor(t/8),i=7-t%8;return n.charCodeAt(r)>>i&1}setbit(e,t,n){if(n!==0&&n!==1)throw Error(`ERR bit is not an integer or out of range`);let r=this.get(e);r===void 0&&(r=``);let i=Math.floor(t/8),a=7-t%8;for(;i>=r.length;)r+=`\0`;let o=r.charCodeAt(i),s=o>>a&1,c=o&~(1<<a)|n<<a,l=String.fromCharCode(c),u=r.slice(0,i),d=r.slice(i+1),f=u+l+d;return this.set(e,f),s}copy(e,t){let n=this.get(e);return n===void 0?0:(this.set(t,n),1)}rename(e,t){if(!this.store.has(e))throw Error(`ERR no such key`);if(e===t)return!0;let n=this.store.get(e),r=this.expireTimes.get(e);return this.storeSet(t,n),this.store.delete(e),r!==void 0&&(this.expireTimes.set(t,r),this.expireTimes.delete(e)),!0}type(e){return this.store.has(e)?typeof this.store.get(e):`none`}sadd(e,...t){this.store.has(e)||this.storeSet(e,new Set);let n=this.store.get(e);if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let r=0;for(let e of t)n.has(e)||(n.add(e),r++);return r}scard(e){let t=this.store.get(e);if(t===void 0)return 0;if(!(t instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return t.size}sdiff(e,...t){let n=this.store.get(e)||new Set;if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let r=new Set(n);for(let e of t){let t=this.store.get(e)||new Set;if(!(t instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);for(let e of t)r.delete(e)}return Array.from(r)}sdiffstore(e,t,...n){let r=this.sdiff(t,...n),i=new Set(r);return this.storeSet(e,i),i.size}sinter(...e){if(e.length===0)return[];let t=e.map(e=>{let t=this.store.get(e);if(t===void 0)return new Set;if(!(t instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return t}),n=new Set(t[0]);for(let e=1;e<t.length;e++)for(let r of n)t[e].has(r)||n.delete(r);return Array.from(n)}sintercard(...e){return this.sinter(...e).length}sinterstore(e,...t){let n=this.sinter(...t),r=new Set(n);return this.storeSet(e,r),r.size}sismember(e,t){let n=this.store.get(e);if(n===void 0)return!1;if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return!!n.has(t)}smembers(e){let t=this.store.get(e);if(t===void 0)return[];if(!(t instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return Array.from(t)}smismember(e,...t){let n=this.store.get(e)||new Set;if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return t.map(e=>+!!n.has(e))}smove(e,t,n){let r=this.store.get(e);if(r===void 0||!r.has(n))return 0;if(!(r instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let i=this.store.get(t)||new Set;if(!(i instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);return r.delete(n),i.add(n),this.storeSet(t,i),1}spop(e,t=1){let n=this.store.get(e);if(n===void 0)return[];if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let r=[];for(let e of n){if(r.length>=t)break;r.push(e),n.delete(e)}return r}srandmember(e,t=1){let n=this.store.get(e);if(n===void 0)return[];if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let r=Array.from(n),i=[];for(let e=0;e<t&&e<r.length;e++){let e=Math.floor(Math.random()*r.length);i.push(r[e]),r.splice(e,1)}return i}srem(e,...t){let n=this.store.get(e);if(n===void 0)return 0;if(!(n instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let r=0;for(let e of t)n.delete(e)&&r++;return r}sscan(e,t,n={}){let{match:r=`*`,count:i=10}=n,a=this.store.get(e);if(a===void 0)return[0,[]];if(!(a instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);let o=new RegExp(r.replace(`*`,`.*`)),s=Array.from(a),c=[],l=t;for(let e=t;e<s.length&&c.length<i;e++)o.test(s[e])&&c.push(s[e]),l=e+1;return[l>=s.length?0:l,c]}sunion(...e){let t=new Set;for(let n of e){let e=this.store.get(n)||new Set;if(!(e instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);for(let n of e)t.add(n)}return Array.from(t)}sunionstore(e,...t){let n=new Set;for(let e of t){let t=this.store.get(e)||new Set;if(!(t instanceof Set))throw Error(`ERR Operation against a key holding the wrong kind of value`);for(let e of t)n.add(e)}return this.storeSet(e,n),n.size}lset(e,t,n){let r=this.store.get(e);if(r===void 0)throw Error(`ERR no such key`);if(!Array.isArray(r))throw Error(`ERR Operation against a key holding the wrong kind of value`);if(t<0||t>=r.length)throw Error(`ERR index out of range`);return r[t]=n,!0}ltrim(e,t,n){let r=this.store.get(e);if(r===void 0)return!0;if(!Array.isArray(r))throw Error(`ERR Operation against a key holding the wrong kind of value`);let i=r.length,a=t>=0?t:Math.max(i+t,0),o=n>=0?n:Math.max(i+n,-1),s=r.slice(a,o+1);return this.storeSet(e,s),!0}rpop(e){let t=this.store.get(e);return t===void 0||!Array.isArray(t)?null:t.pop()}rpoplpush(e,t){let n=this.rpop(e);return n===void 0?null:(this.lpush(t,n),n)}rpush(e,...t){let n=this.store.get(e);if(n===void 0)n=[],this.storeSet(e,n);else if(!Array.isArray(n))throw Error(`ERR Operation against a key holding the wrong kind of value`);return n.push(...t),n.length}rpushx(e,t){let n=this.store.get(e);return n===void 0||!Array.isArray(n)?0:(n.push(t),n.length)}lpush(e,...t){let n=this.store.get(e);if(n===void 0)n=[],this.storeSet(e,n);else if(!Array.isArray(n))throw Error(`ERR Operation against a key holding the wrong kind of value`);return n.unshift(...t),n.length}lpushx(e,...t){let n=this.store.get(e);return n===void 0||!Array.isArray(n)?0:(n.unshift(...t),n.length)}lrange(e,t,n){let r=this.store.get(e);if(r===void 0||!Array.isArray(r))return[];let i=r.length,a=t>=0?t:Math.max(i+t,0),o=n>=0?n:Math.max(i+n,-1);return r.slice(a,o+1)}lrem(e,t,n){let r=this.store.get(e);if(r===void 0||!Array.isArray(r))return 0;let i=0;if(t>0)for(let e=0;e<r.length&&i<t;e++)r[e]===n&&(r.splice(e,1),i++,e--);else if(t<0)for(let e=r.length-1;e>=0&&i<-t;e--)r[e]===n&&(r.splice(e,1),i++);else i=r.filter(e=>e===n).length,this.storeSet(e,r.filter(e=>e!==n));return i}lmove(e,t,n,r){let i=n===`LEFT`?`lpop`:`rpop`,a=r===`LEFT`?`lpush`:`rpush`,o=this[i](e);return o===void 0?null:(this[a](t,o),o)}lmpop(e,t,n){let r=n===`LEFT`?`lpop`:`rpop`,i=[];for(let n=0;n<e;n++){let e=this[r](t);if(e===void 0)break;i.push(e)}return i}lpop(e){let t=this.store.get(e);return t===void 0||!Array.isArray(t)?null:t.shift()}lpos(e,t,n={}){let{rank:r=0,start:i=0,stop:a=-1}=n,o=this.store.get(e);if(o===void 0||!Array.isArray(o))return;let s=0,c=o.length,l=i>=0?i:Math.max(c+i,0),u=a>=0?a:Math.max(c+a,-1);for(let e=l;e<=u;e++)if(o[e]===t){if(s===r)return e;s++}}brpoplpush(e,t,n){let r=this.brpop(e,n);return r===void 0?null:(this.lpush(t,r),r)}lindex(e,t){let n=this.store.get(e);return n===void 0||!Array.isArray(n)?null:(t<0&&(t=n.length+t),n[t]===void 0?null:n[t])}linsert(e,t,n,r){let i=this.store.get(e);if(i===void 0)return 0;if(!Array.isArray(i))throw Error(`ERR Operation against a key holding the wrong kind of value`);let a=i.indexOf(n);if(a===-1)return 0;if(t===`BEFORE`)i.splice(a,0,r);else if(t===`AFTER`)i.splice(a+1,0,r);else throw Error(`ERR syntax error`);return i.length}llen(e){let t=this.store.get(e);return t===void 0?0:t.length}blmove(e,t,n,r,i){let a=n===`LEFT`?`blpop`:`brpop`,o=r===`LEFT`?`lpush`:`rpush`,s=this[a]([e],i);return s===void 0?null:(this[o](t,s[1]),s[1])}blmpop(e,t,...n){let r=[],i=t*1e3,a=n.length===1?`brpop`:`brpoplpush`,o=n.concat(i);for(let t=0;t<e;t++){let e=this[a](o);if(e===void 0)break;r.push(e)}return r}blpop(e,...t){return this.blmpop(1,e,...t)[0]}brpop(e,...t){let n=e*1e3,r=Date.now()+n;for(;Date.now()<r;)for(let e=0;e<t.length;e++){let n=t[e],r=this.store.get(n);if(r!==void 0&&Array.isArray(r)&&r.length>0){let e=r.pop();return r.length===0&&this.store.delete(n),[n,e]}}return null}expiretime(e){return this.expireTimes.get(e)}pexpiretime(e){let t=this.expireTimes.get(e);return t?t*1e3:null}zadd(e,t,r){return this._checkAndRemoveExpiredKey(e)?0:(this.store.has(e)||this.storeSet(e,new n),this.store.get(e).set(r,Number(t)),1)}zcard(e){return this._checkAndRemoveExpiredKey(e)||!this.store.has(e)?0:this.store.get(e).size}zcount(e,t,n){if(this._checkAndRemoveExpiredKey(e)||!this.store.has(e))return 0;let r=this.store.get(e),i=0;for(let e of r.values())e>=t&&e<=n&&i++;return i}zdiff(...e){if(e.length===0)return new Set;let t=e.map(e=>this._checkAndRemoveExpiredKey(e)?new n:this.store.get(e)||new n),r=new Set(t[0].keys());for(let e=1;e<t.length;e++)for(let n of t[e].keys())r.delete(n);return r}zdiffstore(e,...t){let r=this.ZDIFF(...t),i=new n;for(let e of r){let n=t.map(t=>{let n=this.store.get(t);return n?n.get(e):void 0}).filter(e=>e!==void 0);n.length>0&&i.set(e,Math.min(...n))}return this.storeSet(e,i),i.size}bzmpop(e,...t){let n=[];for(let r of t){let t=this.store.get(r);if(t&&t.size>0){let i=Array.from(t.entries()).sort((e,t)=>e[1]-t[1]).slice(0,e).map(([e,n])=>(t.delete(e),[e,n]));n.push([r,...i]);break}}return n}bzpopmax(e,t){let n=this.store.get(e);return!n||n.size===0?[]:[e,...Array.from(n.entries()).sort((e,t)=>t[1]-e[1]).slice(0,t).map(([e,t])=>(n.delete(e),[e,t]))]}bzpopmin(e,t){let n=this.store.get(e);return!n||n.size===0?[]:[e,...Array.from(n.entries()).sort((e,t)=>e[1]-t[1]).slice(0,t).map(([e,t])=>(n.delete(e),[e,t]))]}zincrby(e,t,r){this.store.has(e)||this.storeSet(e,new n);let i=this.store.get(e),a=(i.get(r)||0)+Number(t);return i.set(r,a),a}zinter(...e){if(e.length===0)return new Set;let t=e.map(e=>this.store.get(e)||new n),r=new Set(t[0].keys());for(let e=1;e<t.length;e++){let n=new Set;for(let i of t[e].keys())r.has(i)&&n.add(i);r.clear();for(let e of n)r.add(e)}return r}zintercard(...e){return this.ZINTER(...e).size}zinterstore(e,...t){let r=this.ZINTER(...t),i=new n;for(let e of r){let n=t.map(t=>{let n=this.store.get(t);return n?n.get(e):void 0}).filter(e=>e!==void 0);n.length>0&&i.set(e,Math.max(...n))}return this.storeSet(e,i),i.size}zlexcount(e,t,r){let i=this.store.get(e)||new n,a=Array.from(i.keys()).sort(),o=0;for(let e of a)e>=t&&e<=r&&o++;return o}zmpop(e,...t){let n=[];for(let r of t){let t=this.store.get(r);if(t&&t.size>0){let i=Array.from(t.entries()).sort((e,t)=>e[1]-t[1]).slice(0,e).map(([e,n])=>(t.delete(e),[e,n]));n.push([r,...i]);break}}return n}zmscore(e,...t){let r=this.store.get(e)||new n;return t.map(e=>r.get(e))}zpopmax(e,t){let n=this.store.get(e);return!n||n.size===0?[]:Array.from(n.entries()).sort((e,t)=>t[1]-e[1]).slice(0,t).map(([e,t])=>(n.delete(e),[e,t]))}zpopmin(e,t){let n=this.store.get(e);return!n||n.size===0?[]:Array.from(n.entries()).sort((e,t)=>e[1]-t[1]).slice(0,t).map(([e,t])=>(n.delete(e),[e,t]))}zrandmember(e,t=1){let n=this.store.get(e);if(!n||n.size===0)return[];let r=Array.from(n.keys()),i=[];for(let e=0;e<t;e++){let e=Math.floor(Math.random()*r.length);i.push(r[e])}return i}zrange(e,t,r){let i=this.store.get(e)||new n,a=Array.from(i.entries()).sort((e,t)=>e[1]-t[1]);return t<0&&(t=a.length+t),r<0&&(r=a.length+r),a.slice(t,r+1).map(([e,t])=>[e,t])}zrangebylex(e,t,r,i={}){let a=this.store.get(e)||new n,o=Array.from(a.keys()).sort().filter(e=>e>=t&&e<=r);if(i.limit){let{offset:e,count:t}=i.limit;o=o.slice(e,e+t)}return o}zrangebyscore(e,t,r,i={}){let a=this.store.get(e)||new n,o=Array.from(a.entries()).sort((e,t)=>e[1]-t[1]).filter(([,e])=>e>=t&&e<=r);if(o=i.withscores?o.map(([e,t])=>[e,t]):o.map(([e])=>e),i.limit){let{offset:e,count:t}=i.limit;o=o.slice(e,e+t)}return o}zrangestore(e,t,r,i){let a=this.store.get(t)||new n,o=Array.from(a.entries()).sort((e,t)=>e[1]-t[1]);r<0&&(r=o.length+r),i<0&&(i=o.length+i);let s=new n(o.slice(r,i+1));return this.storeSet(e,s),s.size}zrank(e,t){let n=this.store.get(e);if(!n)return;let r=Array.from(n.entries()).sort((e,t)=>e[1]-t[1]);for(let e=0;e<r.length;e++)if(r[e][0]===t)return e}zrem(e,...t){let n=this.store.get(e);if(!n)return 0;let r=0;for(let e of t)n.delete(e)&&r++;return r}zremrangebylex(e,t,n){let r=this.store.get(e);if(!r)return 0;let i=Array.from(r.keys()).sort(),a=0;for(let e of i)e>=t&&e<=n&&(r.delete(e),a++);return a}zremrangebyrank(e,t,n){let r=this.store.get(e);if(!r)return 0;let i=Array.from(r.entries()).sort((e,t)=>e[1]-t[1]);t<0&&(t=i.length+t),n<0&&(n=i.length+n);let a=0;for(let e=t;e<=n;e++)r.delete(i[e][0])&&a++;return a}zremrangebyscore(e,t,n){let r=this.store.get(e);if(!r)return 0;let i=Array.from(r.entries()).sort((e,t)=>e[1]-t[1]),a=0;for(let[e,o]of i)o>=t&&o<=n&&(r.delete(e),a++);return a}zrevrange(e,t,r){let i=this.store.get(e)||new n,a=Array.from(i.entries()).sort((e,t)=>t[1]-e[1]);return t<0&&(t=a.length+t),r<0&&(r=a.length+r),a.slice(t,r+1).map(([e,t])=>[e,t])}zrevrangebylex(e,t,r,i={}){let a=this.store.get(e)||new n,o=Array.from(a.keys()).sort().reverse().filter(e=>e>=r&&e<=t);if(i.limit){let{offset:e,count:t}=i.limit;o=o.slice(e,e+t)}return o}zrevrangebyscore(e,t,r,i={}){let a=this.store.get(e)||new n,o=Array.from(a.entries()).sort((e,t)=>t[1]-e[1]).filter(([,e])=>e>=r&&e<=t);if(o=i.withscores?o.map(([e,t])=>[e,t]):o.map(([e])=>e),i.limit){let{offset:e,count:t}=i.limit;o=o.slice(e,e+t)}return o}zrevrank(e,t){let n=this.store.get(e);if(!n)return;let r=Array.from(n.entries()).sort((e,t)=>t[1]-e[1]);for(let e=0;e<r.length;e++)if(r[e][0]===t)return e}zscan(e,t,r={}){let i=this.store.get(e)||new n,a=Array.from(i.entries()).sort((e,t)=>e[1]-t[1]),o=[],s=r.count||10,c=t;for(;s>0&&c<a.length;)(!r.match||new RegExp(r.match.replace(`*`,`.*`)).test(a[c][0]))&&(o.push(a[c]),s--),c++;return[c>=a.length?0:c,o]}zscore(e,t){let n=this.store.get(e);if(n)return n.get(t)}zunion(e){let t=new n;for(let n of e){let e=this.store.get(n);if(e)for(let[n,r]of e.entries())t.set(n,(t.get(n)||0)+r)}return Array.from(t.entries()).sort((e,t)=>e[1]-t[1])}zunionstore(e,t){let r=new n(this.zunion(t));return this.storeSet(e,r),r.size}geoadd(e,t,r,i){if(typeof t!=`number`||typeof r!=`number`)throw Error(`Invalid longitude or latitude value`);let a=this.store.get(e)||new n;if(!a.get(i)){let n={longitude:t,latitude:r};return a.set(i,n),this.storeSet(e,a),1}return 0}geodist(e,t,n,r=`m`){let i=this.store.get(e);if(!i)return;let a=i.get(t),o=i.get(n);if(!a||!o)return;let s=this._haversineDistance(a.latitude,a.longitude,o.latitude,o.longitude);return this._convertDistance(s,r)}geohash(e,...t){let n=this.store.get(e);return n?t.map(e=>{let t=n.get(e);return t?this._encodeGeohash(t.latitude,t.longitude):null}):[]}geopos(e,...t){let n=this.store.get(e);return n?t.map(e=>{let t=n.get(e);return t?[t.latitude,t.longitude]:null}):[]}georadius(e,t,n,r,i=`m`){let a=this.store.get(e);if(!a)return[];let o=this._convertDistance(r,i,`m`),s=[];for(let[e,r]of a.entries())this._haversineDistance(n,t,r.latitude,r.longitude)<=o&&s.push(e);return s}georadius_ro(e,t,n,r){return this.georadius(e,t,n,r,!0)}georadiusbymember(e,t,n){let r=this.geopos(e,t);if(r)return this.georadius(r[0],r[1],n,e)}georadiusbymember_ro(e,t,n){let r=this.geopos(e,t);if(r)return this.georadius(r[0],r[1],n,e,!0)}geosearch(e,t,n,r){return this.georadius(t,n,r,e)}geosearchstore(e,t,n,r,i){let a=this.georadius(n,r,i,t);return this.set(e,a),a.length}scan(e,t=`*`,n=10){let r=this.keys(t),i=Math.min(e+n,r.length);return[i===r.length?0:i,r.slice(e,i)]}sort(e,t=`ASC`,n=!1){let r=this.store.get(e);return Array.isArray(r)?r.slice().sort((e,r)=>n?t===`ASC`?e.localeCompare(r):r.localeCompare(e):t===`ASC`?e-r:r-e):[]}touch(...e){return e.reduce((e,t)=>e+ +!!this.exists(t),0)}sort_ro(e,t=`ASC`,n=!1){return this.sort(e,t,n)}unlink(...e){let t=0;for(let n of e)this.del(n)&&t++;return t}hset(e,t,r){this.store.has(e)||this.storeSet(e,new n);let i=this.store.get(e),a=!i.has(t);return i.set(t,r),+!!a}hdel(e,...t){let n=this.store.get(e);if(!n)return 0;let r=0;for(let e of t)n.delete(e)&&r++;return r}hget(e,t){let n=this.store.get(e);return n?n.get(t):void 0}hgetall(e){let t=this.store.get(e);if(!t)return{};let n={};for(let[e,r]of t)n[e]=r;return n}hincrby(e,t,r){let i=this.store.get(e)||new n,a=parseInt(i.get(t)||0,10)+r;return i.set(t,a.toString()),this.storeSet(e,i),a}hincrbyfloat(e,t,r){let i=this.store.get(e)||new n,a=parseFloat(i.get(t)||0)+r;return i.set(t,a.toString()),this.storeSet(e,i),a}hkeys(e){let t=this.store.get(e);return t?Array.from(t.keys()):[]}hlen(e){let t=this.store.get(e);return t?t.size:0}hmget(e,...t){let r=this.store.get(e)||new n;return t.map(e=>r.get(e))}hmset(e,...t){let r=this.store.get(e)||new n;for(let e=0;e<t.length;e+=2){let n=t[e],i=t[e+1];r.set(n,i)}return this.storeSet(e,r),!0}hsetnx(e,t,r){let i=this.store.get(e)||new n;return i.has(t)?0:(i.set(t,r),this.storeSet(e,i),1)}hstrlen(e,t){let n=this.store.get(e),r=n?n.get(t):null;return r?r.length:0}hvals(e){let t=this.store.get(e);return t?Array.from(t.values()):[]}hscan(e,t,r=`*`,i=10){let a=this.store.get(e)||new n,o=Array.from(a.keys()).filter(e=>e.includes(r)),s=Math.min(t+i,o.length);return[s===o.length?0:s,o.slice(t,s).map(e=>[e,a.get(e)])]}hexists(e,t){let n=this.store.get(e);return n&&n.has(t)?1:0}hrandfield(e,t=1){let n=this.store.get(e);if(!n)return[];let r=Array.from(n.keys()),i=[];for(let e=0;e<t;e++){let e=Math.floor(Math.random()*r.length);i.push(r[e])}return i}_checkAndRemoveExpiredKey(e){let t=this.expireTimes.get(e);return t&&Date.now()>t?(this.store.delete(e),this.expireTimes.delete(e),this.isIndexedDBAvailable&&this.db&&this._removeFromIndexedDB(e),!0):!1}_initCleanupLoop(e){this.store.size===1&&(this.cleanupLoop=setInterval(()=>{if(this.store.size===0&&this.cleanupLoop)clearInterval(this.cleanupLoop);else for(let e of this.expireTimes.keys())this._checkAndRemoveExpiredKey(e)},e),typeof this.cleanupLoop==`object`&&typeof this.cleanupLoop.unref==`function`&&this.cleanupLoop.unref())}_haversineDistance(e,t,n,r){let i=e=>e*Math.PI/180,a=i(n-e),o=i(r-t),s=Math.sin(a/2)*Math.sin(a/2)+Math.cos(i(e))*Math.cos(i(n))*Math.sin(o/2)*Math.sin(o/2);return 6371e3*(2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)))}_convertDistance(e,t,n){let r={m:1,km:.001,mi:621371e-9,ft:3.28084};if(!r[t]||!r[n])throw Error(`Invalid distance unit`);return e*r[t]/r[n]}_encodeGeohash(e,t){let n=``,r=-90,i=90,a=-180,o=180,s=!0,c=0,l=0;for(;n.length<12;){if(s){let e=(a+o)/2;t>e?(l=(l<<1)+1,a=e):(l<<=1,o=e)}else{let t=(r+i)/2;e>t?(l=(l<<1)+1,r=t):(l<<=1,i=t)}s=!s,c<4?c++:(n+=`0123456789bcdefghjkmnpqrstuvwxyz`[l],c=0,l=0)}return n}flushall(){return this.store.clear(),this.expireTimes.clear(),this.isIndexedDBAvailable&&this.db&&this._clearIndexedDB(),!0}async _clearIndexedDB(){if(this.db)try{let e=this.db.transaction([`store`,`expireTimes`],`readwrite`),t=e.objectStore(`store`),n=e.objectStore(`expireTimes`);t.clear(),n.clear()}catch(e){console.warn(`Failed to clear IndexedDB:`,e)}}}}))(),1),a=class{constructor(e={}){this.config={enabled:e.enabled??!1,...e}}updateConfig(e){this.config={...this.config,...e}}enable(){this.config.enabled=!0}disable(){this.config.enabled=!1}isEnabled(){return this.config.enabled}logRequest(e={}){if(!this.isEnabled())return;let{service:t=`unknown`,operation:n=`unknown`,params:r={},result:i=null,error:a=null}=e,o=`{}`;if(r&&Object.keys(r).length>0)try{o=JSON.stringify(r)}catch{o=`[Unable to serialize params]`}let s=`${t} - ${n} - \x1b[1m${o}\x1b[22m`;a?console.error(s,{error:a.message||a,result:i}):console.log(s,i)}getStats(){return{enabled:this.config.enabled,config:{...this.config}}}},o=46,s=47;function c(e){return e===s}function l(e,t,n,r){let i=``,a=0,c=-1,l=0,u=0;for(let d=0;d<=e.length;++d){if(d<e.length)u=e.charCodeAt(d);else if(r(u))break;else u=s;if(r(u)){if(!(c===d-1||l===1))if(l===2){if(i.length<2||a!==2||i.charCodeAt(i.length-1)!==o||i.charCodeAt(i.length-2)!==o){if(i.length>2){let e=i.lastIndexOf(n);e===-1?(i=``,a=0):(i=i.slice(0,e),a=i.length-1-i.lastIndexOf(i,n)),c=d,l=0;continue}else if(i.length!==0){i=``,a=0,c=d,l=0;continue}}t&&(i+=i.length>0?`${n}..`:`..`,a=2)}else i.length>0?i+=`${n}${e.slice(c+1,d)}`:i=e.slice(c+1,d),a=d-c-1;c=d,l=0}else u===o&&l!==-1?++l:l=-1}return i}var u={resolve(...e){let t=``,n=!1;for(let r=e.length-1;r>=-1&&!n;r--){let i=r>=0?e[r]:`/`;i.length!==0&&(t=`${i}/${t}`,n=i.charCodeAt(0)===s)}return t=l(t,!n,`/`,c),n?`/${t}`:t.length>0?t:`.`},normalize(e){if(e.length===0)return`.`;let t=e.charCodeAt(0)===s,n=e.charCodeAt(e.length-1)===s;return e=l(e,!t,`/`,c),e.length===0?t?`/`:n?`./`:`.`:(n&&(e+=`/`),t?`/${e}`:e)},isAbsolute(e){return e.length>0&&e.charCodeAt(0)===s},join(...e){if(e.length===0)return`.`;let t;for(let n=0;n<e.length;++n){let r=e[n];r.length>0&&(t===void 0?t=r:t+=`/${r}`)}return t===void 0?`.`:u.normalize(t)},relative(e,t){if(e===t||(e=u.resolve(e),t=u.resolve(t),e===t))return``;let n=e.length,r=n-1,i=t.length-1,a=r<i?r:i,o=-1,c=0;for(;c<a;c++){let n=e.charCodeAt(1+c);if(n!==t.charCodeAt(1+c))break;n===s&&(o=c)}if(c===a)if(i>a){if(t.charCodeAt(1+c)===s)return t.slice(1+c+1);if(c===0)return t.slice(1+c)}else r>a&&(e.charCodeAt(1+c)===s?o=c:c===0&&(o=0));let l=``;for(c=1+o+1;c<=n;++c)(c===n||e.charCodeAt(c)===s)&&(l+=l.length===0?`..`:`/..`);return`${l}${t.slice(1+o)}`},toNamespacedPath(e){return e},dirname(e){if(e.length===0)return`.`;let t=e.charCodeAt(0)===s,n=-1,r=!0;for(let t=e.length-1;t>=1;--t)if(e.charCodeAt(t)===s){if(!r){n=t;break}}else r=!1;return n===-1?t?`/`:`.`:t&&n===1?`//`:e.slice(0,n)},basename(e,t){let n=0,r=-1,i=!0;if(t!==void 0&&t.length>0&&t.length<=e.length){if(t===e)return``;let a=t.length-1,o=-1;for(let c=e.length-1;c>=0;--c){let l=e.charCodeAt(c);if(l===s){if(!i){n=c+1;break}}else o===-1&&(i=!1,o=c+1),a>=0&&(l===t.charCodeAt(a)?--a===-1&&(r=c):(a=-1,r=o))}return n===r?r=o:r===-1&&(r=e.length),e.slice(n,r)}for(let t=e.length-1;t>=0;--t)if(e.charCodeAt(t)===s){if(!i){n=t+1;break}}else r===-1&&(i=!1,r=t+1);return r===-1?``:e.slice(n,r)},extname(e){let t=-1,n=0,r=-1,i=!0,a=0;for(let c=e.length-1;c>=0;--c){let l=e.charCodeAt(c);if(l===s){if(!i){n=c+1;break}continue}r===-1&&(i=!1,r=c+1),l===o?t===-1?t=c:a!==1&&(a=1):t!==-1&&(a=-1)}return t===-1||r===-1||a===0||a===1&&t===r-1&&t===n+1?``:e.slice(t,r)},format:d.bind(null,`/`),parse(e){let t={root:``,dir:``,base:``,ext:``,name:``};if(e.length===0)return t;let n=e.charCodeAt(0)===s,r;n?(t.root=`/`,r=1):r=0;let i=-1,a=0,c=-1,l=!0,u=e.length-1,d=0;for(;u>=r;--u){let t=e.charCodeAt(u);if(t===s){if(!l){a=u+1;break}continue}c===-1&&(l=!1,c=u+1),t===o?i===-1?i=u:d!==1&&(d=1):i!==-1&&(d=-1)}if(c!==-1){let r=a===0&&n?1:a;i===-1||d===0||d===1&&i===c-1&&i===a+1?t.base=t.name=e.slice(r,c):(t.name=e.slice(r,i),t.base=e.slice(r,c),t.ext=e.slice(i,c))}return a>0?t.dir=e.slice(0,a-1):n&&(t.dir=`/`),t},sep:`/`,delimiter:`:`,win32:null,posix:null};function d(e,t){validateObject(t,`pathObject`);let n=t.dir||t.root,r=t.base||`${t.name||``}${t.ext||``}`;return n?n===t.root?`${n}${r}`:`${n}${e}${r}`:r}var f={},p={},m={};p.length=0,p.getItem=function(e){return e in m?m[e]:null},p.setItem=function(e,t){t===void 0?p.removeItem(e):(m.hasOwnProperty(e)||p.length++,m[e]=`${t}`)},p.removeItem=function(e){m.hasOwnProperty(e)&&(delete m[e],p.length--)},p.key=function(e){return Object.keys(m)[e]||null},p.clear=function(){m={},p.length=0},typeof exports==`object`?module.exports=p:f.localStorage=p;var h=Symbol(`readyState`),g=Symbol(`headers`),_=Symbol(`response headers`),v=Symbol(`AbortController`),y=Symbol(`method`),b=Symbol(`URL`),x=Symbol(`MIME`),S=Symbol(`dispatch`),C=Symbol(`errored`),w=Symbol(`timeout`),T=Symbol(`timedOut`),E=Symbol(`isResponseText`);function D(...e){let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t);return e.forEach((e,t,r)=>{let i=r.slice(0,t).reduce((e,t)=>e+t.length,0);n.set(e,i)}),n}async function O(e){let t=this.responseType||`text`,n=new TextDecoder,r=this[x]||this[_].get(`content-type`)||`text/plain`;switch(t){case`text`:this.response=n.decode(e);break;case`blob`:this.response=new Blob([e],{type:r});break;case`arraybuffer`:this.response=e.buffer;break;case`json`:this.response=JSON.parse(n.decode(e));break}}var k=class extends EventTarget{onreadystatechange(){}set readyState(e){this[h]!==e&&(this[h]=e,this.dispatchEvent(new Event(`readystatechange`)),this.onreadystatechange(new Event(`readystatechange`)))}get readyState(){return this[h]}constructor(){super(),this.readyState=this.constructor.UNSENT,this.response=null,this.responseType=``,this.responseURL=``,this.status=0,this.statusText=``,this.timeout=0,this.withCredentials=!1,this[g]=Object.create(null),this[g].accept=`*/*`,this[_]=Object.create(null),this[v]=new AbortController,this[y]=``,this[b]=``,this[x]=``,this[C]=!1,this[w]=0,this[T]=!1,this[E]=!0}static get UNSENT(){return 0}static get OPENED(){return 1}static get HEADERS_RECEIVED(){return 2}static get LOADING(){return 3}static get DONE(){return 4}upload={addEventListener(){}};get responseText(){if(this[C])return null;if(this.readyState<this.constructor.HEADERS_RECEIVED)return``;if(this[E])return this.response;throw new DOMException(`Response type not set to text`,`InvalidStateError`)}get responseXML(){throw Error(`XML not supported`)}[S](e){let t=`on${e.type}`;typeof this[t]==`function`&&this.addEventListener(e.type,this[t].bind(this),{once:!0}),this.dispatchEvent(e)}abort(){this[v].abort(),this.status=0,this.readyState=this.constructor.UNSENT}open(e,t){this.status=0,this[y]=e,this[b]=t,this.readyState=this.constructor.OPENED}setRequestHeader(e,t){e=String(e).toLowerCase(),this[g][e]===void 0?this[g][e]=String(t):this[g][e]+=`, ${t}`}overrideMimeType(e){this[x]=String(e)}getAllResponseHeaders(){return this[C]||this.readyState<this.constructor.HEADERS_RECEIVED?``:Array.from(this[_].entries().map(([e,t])=>`${e}: ${t}`)).join(`\r
`)}getResponseHeader(e){let t=this[_].get(String(e).toLowerCase());return typeof t==`string`?t:null}send(e=null){this.timeout>0&&(this[w]=setTimeout(()=>{this[T]=!0,this[v].abort()},this.timeout));let t=this.responseType||`text`;this[E]=t===`text`,this.setRequestHeader(`user-agent`,`puter-js/1.0`),this.setRequestHeader(`origin`,`https://puter.work`),this.setRequestHeader(`referer`,`https://puter.work/`),fetch(this[b],{method:this[y]||`GET`,signal:this[v].signal,headers:this[g],credentials:this.withCredentials?`include`:`same-origin`,body:e}).then(async e=>{if(this.responseURL=e.url,this.status=e.status,this.statusText=e.statusText,this[_]=e.headers,this.readyState=this.constructor.HEADERS_RECEIVED,e.headers.get(`content-type`).includes(`application/x-ndjson`)||this.streamRequestBadForPerformance){let t=new Uint8Array;for await(let n of e.body)this.readyState=this.constructor.LOADING,t=D(t,n),O.call(this,t),this[S](new CustomEvent(`progress`))}else{let t=[];for await(let n of e.body)t.push(n);O.call(this,D(...t))}this.readyState=this.constructor.DONE,this[S](new CustomEvent(`load`))},e=>{let t=`abort`;e.name===`AbortError`?this[T]&&(t=`timeout`):(this[C]=!0,t=`error`),this.readyState=this.constructor.DONE,this[S](new CustomEvent(t))}).finally(()=>this[S](new CustomEvent(`loadend`))).finally(()=>{clearTimeout(this[w]),this[S](new CustomEvent(`loadstart`))})}};typeof module==`object`&&module.exports?module.exports=k:(globalThis||self).XMLHttpRequestShim=k;function ee(e){let t=new Uint8Array(e).reduce((e,t)=>e+String.fromCharCode(t),``);return typeof btoa==`function`?btoa(t):Buffer.from(t,`binary`).toString(`base64`)}var te=class{constructor(){this.result=null,this.error=null,this.onloadend=null}readAsDataURL(e){let t=this;(async function(){try{let n;n=e&&typeof e.arrayBuffer==`function`?await e.arrayBuffer():e instanceof ArrayBuffer?e:ArrayBuffer.isView(e)?e.buffer:new Uint8Array().buffer;let r=ee(n),i=e&&e.type||`application/octet-stream`;t.result=`data:`+i+`;base64,`+r,typeof t.onloadend==`function`&&t.onloadend()}catch(e){t.error=e,typeof t.onloadend==`function`&&t.onloadend()}})()}},ne=class extends (globalThis.HTMLElement||Object){constructor(e){super(),this.message=e||`You have reached your usage limit for this account.`,this.attachShadow({mode:`open`}),this.shadowRoot.innerHTML=`
        <style>
        dialog {
            background: transparent;
            border: none;
            box-shadow: none;
            outline: none;
            padding: 0;
        }

        dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }

        .puter-dialog-content {
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 50px 30px 30px;
            background-color: #fff;
            box-shadow: 0 0 9px 1px rgb(0 0 0 / 21%);
            -webkit-font-smoothing: antialiased;
            color: #575762;
            position: relative;
            box-sizing: border-box;
            width: 400px;
            max-width: 90vw;
        }

        dialog, dialog * {
            font-family: "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif;
        }

        .close-btn {
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 17px;
            color: #8a8a8a8c;
            cursor: pointer;
        }

        .close-btn:hover {
            color: #000;
        }

        .dialog-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto;
        }

        .dialog-icon svg {
            display: block;
            width: 70px;
            height: 70px;
            padding: 15px;
            border-radius: 8px;
            box-sizing: border-box;
            background-color: #f59e0b;
            color: #fff;
        }

        h2 {
            text-align: center;
            font-size: 19px;
            font-weight: 500;
            color: #1f1f2a;
            margin: 18px 0 0;
        }

        .message {
            text-align: center;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.5;
            color: #575762;
            padding: 10px 10px 0;
            margin: 0;
        }

        .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 24px;
        }

        .button {
            color: #666666;
            background: linear-gradient(#f6f6f6, #e1e1e1);
            font-size: 14px;
            text-align: center;
            height: 35px;
            line-height: 35px;
            padding: 0 30px;
            margin: 0;
            display: inline-block;
            appearance: none;
            cursor: pointer;
            border: 1px solid #b9b9b9;
            box-sizing: border-box;
            border-radius: 4px;
            outline: none;
            width: 220px;
            -webkit-font-smoothing: antialiased;
        }

        .button:focus-visible {
            border-color: rgb(118 118 118);
        }

        .button-primary {
            border-color: #088ef0;
            background: linear-gradient(#34a5f8, #088ef0);
            color: #fff;
            font-weight: 500;
            font-size: 15px;
            margin-bottom: 10px;
        }

        .button-primary:active {
            background: #2798eb;
            border-color: #2798eb;
            color: #bedef5;
        }

        .button-cancel {
            background: none;
        }

        @media (max-width: 480px) {
            .puter-dialog-content {
                padding: 50px 20px 25px;
            }
            .button {
                width: 100%;
            }
        }

        @media (prefers-color-scheme: dark) {
            .puter-dialog-content {
                border: 1px solid #2a2a2e;
                background-color: #1e1e22;
                color: #d6d6dc;
                box-shadow: 0 0 9px 1px rgb(0 0 0 / 60%);
            }

            h2 {
                color: #e4e4ea;
            }

            .message {
                color: #b9b9c2;
            }

            .close-btn {
                color: #8a8a90;
            }

            .close-btn:hover {
                color: #fff;
            }

            .button {
                color: #d6d6dc;
                background: linear-gradient(#3f3f45, #2e2e34);
                border-color: #4a4a50;
            }

            .button:focus-visible {
                border-color: #8a8a90;
            }

            .button-primary {
                border-color: #088ef0;
                background: linear-gradient(#34a5f8, #088ef0);
                color: #fff;
            }
        }
        </style>
        <dialog>
            <div class="puter-dialog-content">
                <span class="close-btn">&#x2715;</span>
                <div class="dialog-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2>Low Balance</h2>
                <p class="message">${this.message}</p>
                <div class="buttons">
                    <button class="button button-primary" id="upgrade-btn">Upgrade Now</button>
                    <button class="button button-cancel" id="close-btn">Close</button>
                </div>
            </div>
        </dialog>
        `}connectedCallback(){let e=this.shadowRoot.querySelector(`dialog`);this.shadowRoot.querySelector(`.close-btn`).addEventListener(`click`,()=>{this.close()}),this.shadowRoot.querySelector(`#close-btn`).addEventListener(`click`,()=>{this.close()}),this.shadowRoot.querySelector(`#upgrade-btn`).addEventListener(`click`,()=>{window.open(`https://puter.com/dashboard`,`_blank`),this.close()}),e.addEventListener(`click`,t=>{t.target===e&&this.close()})}open(){this.shadowRoot.querySelector(`dialog`).showModal()}close(){this.shadowRoot.querySelector(`dialog`).close(),this.remove()}};globalThis.HTMLElement!==void 0&&globalThis.customElements&&(customElements.get(`usage-limit-dialog`)||customElements.define(`usage-limit-dialog`,ne));function A(e){if(globalThis.document===void 0){console.warn(`[Puter]`,e);return}if(document.querySelector(`usage-limit-dialog`))return;let t=new ne(e);document.body.appendChild(t),t.open()}var re=class extends (globalThis.HTMLElement||Object){constructor(e){super(),this.message=e||`Please confirm your email address to use this service.`,this.attachShadow({mode:`open`}),this.shadowRoot.innerHTML=`
        <style>
        dialog {
            background: transparent;
            border: none;
            box-shadow: none;
            outline: none;
            padding: 0;
        }

        dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }

        .puter-dialog-content {
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 50px 30px 30px;
            background-color: #fff;
            box-shadow: 0 0 9px 1px rgb(0 0 0 / 21%);
            -webkit-font-smoothing: antialiased;
            color: #575762;
            position: relative;
            box-sizing: border-box;
            width: 400px;
            max-width: 90vw;
        }

        dialog, dialog * {
            font-family: "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif;
        }

        .close-btn {
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 17px;
            color: #8a8a8a8c;
            cursor: pointer;
        }

        .close-btn:hover {
            color: #000;
        }

        .dialog-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto;
        }

        .dialog-icon svg {
            display: block;
            width: 70px;
            height: 70px;
            padding: 15px;
            border-radius: 8px;
            box-sizing: border-box;
            background-color: #088ef0;
            color: #fff;
        }

        h2 {
            text-align: center;
            font-size: 19px;
            font-weight: 500;
            color: #1f1f2a;
            margin: 18px 0 0;
        }

        .message {
            text-align: center;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.5;
            color: #575762;
            padding: 10px 10px 0;
            margin: 0;
        }

        .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 24px;
        }

        .button {
            color: #666666;
            background: linear-gradient(#f6f6f6, #e1e1e1);
            font-size: 14px;
            text-align: center;
            height: 35px;
            line-height: 35px;
            padding: 0 30px;
            margin: 0;
            display: inline-block;
            appearance: none;
            cursor: pointer;
            border: 1px solid #b9b9b9;
            box-sizing: border-box;
            border-radius: 4px;
            outline: none;
            width: 220px;
            -webkit-font-smoothing: antialiased;
        }

        .button:focus-visible {
            border-color: rgb(118 118 118);
        }

        .button-primary {
            border-color: #088ef0;
            background: linear-gradient(#34a5f8, #088ef0);
            color: #fff;
            font-weight: 500;
            font-size: 15px;
            margin-bottom: 10px;
        }

        .button-primary:active {
            background: #2798eb;
            border-color: #2798eb;
            color: #bedef5;
        }

        .button-cancel {
            background: none;
        }

        @media (max-width: 480px) {
            .puter-dialog-content {
                padding: 50px 20px 25px;
            }
            .button {
                width: 100%;
            }
        }

        @media (prefers-color-scheme: dark) {
            .puter-dialog-content {
                border: 1px solid #2a2a2e;
                background-color: #1e1e22;
                color: #d6d6dc;
                box-shadow: 0 0 9px 1px rgb(0 0 0 / 60%);
            }

            h2 {
                color: #e4e4ea;
            }

            .message {
                color: #b9b9c2;
            }

            .close-btn {
                color: #8a8a90;
            }

            .close-btn:hover {
                color: #fff;
            }

            .button {
                color: #d6d6dc;
                background: linear-gradient(#3f3f45, #2e2e34);
                border-color: #4a4a50;
            }

            .button:focus-visible {
                border-color: #8a8a90;
            }

            .button-primary {
                border-color: #088ef0;
                background: linear-gradient(#34a5f8, #088ef0);
                color: #fff;
            }
        }
        </style>
        <dialog>
            <div class="puter-dialog-content">
                <span class="close-btn">&#x2715;</span>
                <div class="dialog-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2>Confirm Your Email</h2>
                <p class="message">${this.message}</p>
                <div class="buttons">
                    <button class="button button-primary" id="confirm-email-btn">Go to Puter.com</button>
                    <button class="button button-cancel" id="close-btn">Close</button>
                </div>
            </div>
        </dialog>
        `}connectedCallback(){let e=this.shadowRoot.querySelector(`dialog`);this.shadowRoot.querySelector(`.close-btn`).addEventListener(`click`,()=>{this.close()}),this.shadowRoot.querySelector(`#close-btn`).addEventListener(`click`,()=>{this.close()}),this.shadowRoot.querySelector(`#confirm-email-btn`).addEventListener(`click`,()=>{window.open(`https://puter.com`,`_blank`),this.close()}),e.addEventListener(`click`,t=>{t.target===e&&this.close()})}open(){this.shadowRoot.querySelector(`dialog`).showModal()}close(){this.shadowRoot.querySelector(`dialog`).close(),this.remove()}};globalThis.HTMLElement!==void 0&&globalThis.customElements&&(customElements.get(`email-confirmation-dialog`)||customElements.define(`email-confirmation-dialog`,re));function ie(e){if(globalThis.document===void 0||document.querySelector(`email-confirmation-dialog`))return;let t=new re(e);document.body.appendChild(t),t.open()}async function ae(e){if(e.responseType===`blob`){let t=e.getResponseHeader(`content-type`);if(t.startsWith(`application/json`)){let t=await e.response.text();try{return JSON.parse(t)}catch{return t}}else if(t.startsWith(`application/octet-stream`))return e.response;return{success:!0,result:e.response}}let t=e.responseText;try{return JSON.parse(t)}catch{return t}}function oe(){return`10000000-1000-4000-8000-100000000000`.replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}var se=()=>{let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}};function j(e,t,n,r=`post`,i=`text/plain;actually=json`,a=void 0){let o=new XMLHttpRequest;o.open(r,t+e,!0),o.withCredentials=!0,n&&o.setRequestHeader(`Authorization`,`Bearer ${n}`),o.setRequestHeader(`Content-Type`,i),o.responseType=a??``,o._puterReq={endpoint:e,APIOrigin:t,method:r,contentType:i,responseType:a};let s=o.send.bind(o);return o.send=function(e){return o._puterReq.body=e,s(e)},globalThis.puter?.apiCallLogger?.isEnabled()&&(o._puterRequestId={method:r,service:`xhr`,operation:e.replace(/^\//,``),params:{endpoint:e,contentType:i,responseType:a}}),o}function ce(e,t,n,r,i){let a=(e.target??e)?._puterReq;if(!a||a._replayed)return!1;let o=j(a.endpoint,a.APIOrigin,globalThis.puter?.authToken,a.method,a.contentType,a.responseType);return o._puterReq._replayed=!0,M(o,t,n,r,i),o.send(a.body),!0}async function le(e,t,n,r,i){let a=await ae(i);if(i.status===401){if(a?.code===`reauth_required`)try{if(await puter.triggerReauth({reason:a.reason,auth_id:a.auth_id}),ce(i,e,t,n,r))return}catch(e){let n={status:401,code:`reauth_required`,reason:a.reason,auth_id:a.auth_id,message:e?.message||`Reauthentication required`};return t&&typeof t==`function`&&t(n),r(n)}if(a?.code===`token_auth_failed`&&puter.env===`web`)try{puter.resetAuthToken(),await puter.ui.authenticateWithPuter()}catch{return r({error:{code:`auth_canceled`,message:`Authentication canceled`}})}return t&&typeof t==`function`&&t({status:401,message:`Unauthorized`}),r({status:401,message:`Unauthorized`})}else if(i.status!==200)return t&&typeof t==`function`&&t(a),r(a);else return a.success===!1&&a.error?.code===`permission_denied`&&(await puter.ui.requestPermission({permission:`driver:puter-image-generation:generate`})).granted,e&&typeof e==`function`&&e(a),n(a)}function ue(e,t,n){return e&&typeof e==`function`&&e(n),t(n)}function M(e,t,n,r,i){e.addEventListener(`load`,async function(a){if(globalThis.puter?.apiCallLogger?.isEnabled()&&this._puterRequestId){let e=await ae(this).catch(()=>null);globalThis.puter.apiCallLogger.logRequest({service:this._puterRequestId.service,operation:this._puterRequestId.operation,params:this._puterRequestId.params,result:this.status>=400?null:e,error:this.status>=400?{message:this.statusText,status:this.status}:null})}return le(t,n,r,i,this,e)}),e.addEventListener(`error`,function(e){return globalThis.puter?.apiCallLogger?.isEnabled()&&this._puterRequestId&&globalThis.puter.apiCallLogger.logRequest({service:this._puterRequestId.service,operation:this._puterRequestId.operation,params:this._puterRequestId.params,error:{message:`Network error occurred`,event:e.type}}),ue(n,i,this)})}var de=()=>{},fe=class{static callback(e){return e&&typeof e==`function`?e:void 0}};function N(e,t,n,r,i={}){return async function(...a){let o={},s={};return a.length===1&&typeof a[0]==`object`&&!Array.isArray(a[0])?(o={...a[0]},s={success:o.success,error:o.error},delete o.success,delete o.error):(e.forEach((e,t)=>{o[e]=a[t]}),s={success:a[e.length],error:a[e.length+1]}),i.preprocess&&typeof i.preprocess==`function`&&(o=i.preprocess(o)),await pe(s,t,n,r,o,i)}}async function pe(e,t,n,r,i,a){let o=se();return me(e,o.resolve,o.reject,t,n,r,i,void 0,void 0,a),await o.promise}async function me(e={},t,n,r,i,a,o,s,c=`text/plain;actually=json`,l={}){let u=null;if(globalThis.puter?.apiCallLogger?.isEnabled()&&(u={interface:r,driver:i,method:a,args:o}),!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{return u&&globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${r}::${a}`,params:{interface:r,driver:i,method:a,args:o},error:{code:`auth_canceled`,message:`Authentication canceled`}}),n({error:{code:`auth_canceled`,message:`Authentication canceled`}})}let d=fe.callback(e.success)??de,f=fe.callback(e.error)??de,p=j(`/drivers/call`,puter.APIOrigin,void 0,`POST`,c);u&&(p._puterDriverRequestInfo=u),l.responseType&&(p.responseType=l.responseType,p._puterReq&&(p._puterReq.responseType=l.responseType));let m=!1,h=null,g=0,_=!1,v=``,y=[];p.onreadystatechange=()=>{if(p.readyState===2){if(p.getResponseHeader(`Content-Type`)!==`application/x-ndjson`)return;m=!0;let e=async function*(){for(;!_;){let e=se();if(h=e.resolve,await e.promise,_)break;for(;y.length>0;){let e=y.shift();if(e.trim()===``)continue;let t=JSON.parse(e);(t?.error?.code===`insufficient_funds`||t?.metadata?.usage_limited===!0)&&(puter.env===`web`?A(`You have reached your usage limit for this account.<br>Please upgrade to continue.`):puter.env===`app`&&await puter.ui.requestUpgrade()),t?.error?.code===`email_must_be_confirmed`&&puter.env===`web`&&ie(t?.error?.message||`Email confirmation required. Go to Puter.com to confirm your email address.`),typeof t.text==`string`&&Object.defineProperty(t,"toString",{enumerable:!1,value:()=>t.text}),yield t}}}();return Object.defineProperty(e,"start",{enumerable:!1,value:async t=>{let n=new TextEncoder;for await(let r of e)t.enqueue(n.encode(r));t.close()}}),t(e)}p.readyState===4&&(_=!0,m&&h?.())},p.onprogress=function(){if(!h)return;let e=p.responseText.slice(g);g=p.responseText.length;let t=!1;for(let n=0;n<e.length;n++)v+=e[n],e[n]===`
`&&(t=!0,y.push(v),v=``);t&&h()},p.addEventListener(`load`,async function(u){if(m)return;let p=await ae(u.target);this._puterDriverRequestInfo&&globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${this._puterDriverRequestInfo.interface}::${this._puterDriverRequestInfo.method}`,params:{interface:this._puterDriverRequestInfo.interface,driver:this._puterDriverRequestInfo.driver,method:this._puterDriverRequestInfo.method,args:this._puterDriverRequestInfo.args},result:u.status>=400||p?.success===!1?null:p,error:u.status>=400||p?.success===!1?p:null});let h=u.target?.status===402||p?.error?.code===`insufficient_funds`||p?.error?.status===402,g=p?.metadata?.usage_limited===!0;if((h||g)&&puter.env===`web`?A(`Your account has not enough funding to complete this request.<br>Please upgrade to continue.`):(h||g)&&puter.env===`app`&&await puter.ui.requestUpgrade(),p?.error?.code===`email_must_be_confirmed`&&puter.env===`web`&&ie(p?.error?.message||`Email confirmation required. Go to Puter.com to confirm your email address.`),u.target.status===401||p?.code===`token_auth_failed`){if(p?.code===`reauth_required`)try{if(await puter.triggerReauth({reason:p.reason,auth_id:p.auth_id}),!l._reauthReplayed)return me(e,t,n,r,i,a,o,s,c,{...l,_reauthReplayed:!0});let u={status:401,code:`reauth_required`,reason:p.reason,auth_id:p.auth_id,message:`Reauthentication still required after retry`};return f&&typeof f==`function`&&f(u),n(u)}catch(e){let t={status:401,code:`reauth_required`,reason:p.reason,auth_id:p.auth_id,message:e?.message||`Reauthentication required`};return f&&typeof f==`function`&&f(t),n(t)}if(p?.code===`token_auth_failed`&&puter.env===`web`)try{puter.resetAuthToken(),await puter.ui.authenticateWithPuter()}catch{return n({error:{code:`auth_canceled`,message:`Authentication canceled`}})}return f&&typeof f==`function`&&f({status:401,message:`Unauthorized`}),n({status:401,message:`Unauthorized`})}else if(u.target.status&&u.target.status!==200)return f(p),n(p);else{if(p.success===!1&&p.error?.code===`permission_denied`)return(await puter.ui.requestPermission({permission:`driver:${r}:${a}`})).granted?me(e,t,n,r,a,o,s,c,l):(f(p),n(p));if(p.success===!1)return f(p),n(p);let i=p.result===void 0?p:p.result;return l.transform&&(i=await l.transform(i)),t.success&&d(i),t(i)}}),p.addEventListener(`error`,function(e){return this._puterDriverRequestInfo&&globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${this._puterDriverRequestInfo.interface}::${this._puterDriverRequestInfo.method}`,params:{interface:this._puterDriverRequestInfo.interface,driver:this._puterDriverRequestInfo.driver,method:this._puterDriverRequestInfo.method,args:this._puterDriverRequestInfo.args},error:{message:`Network error occurred`,event:e.type}}),ue(f,n,this)}),p.send(JSON.stringify({interface:r,driver:i,test_mode:l?.test_mode,method:a,args:o,auth_token:puter.authToken}))}async function P(e){let t=new(globalThis.FileReader||te);return await new Promise((n,r)=>{t.onloadend=()=>n(t.result),t.onerror=r,t.readAsDataURL(e)})}function he(e){return new Promise((t,n)=>{let r=new(globalThis.FileReader||te);r.onload=function(e){t(e.target.result)},r.onerror=function(e){n(e)},r.readAsDataURL(e)})}var ge=[`mp4`,`webm`,`mov`,`mpeg`,`avi`,`mkv`,`m4v`,`ogv`],_e=e=>{if(typeof e!=`string`)return!1;if(e.startsWith(`data:video/`))return!0;let t=e.split(`?`)[0].split(`#`)[0].split(`.`).pop()?.toLowerCase();return ge.includes(t)},F=e=>puter.env===`gui`&&!e||/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(e)?e:(e||=`.`,(!e||!e.startsWith(`/`)&&!e.startsWith(`~`))&&(e=puter.appID?u.join(`~/AppData`,puter.appID,e):u.join(`~/`,e)),e),I=e=>{if(typeof e!=`string`)return null;let t=e.toLowerCase();return t===`openai`?`openai`:[`elevenlabs`,`eleven`,`11labs`,`11-labs`,`eleven-labs`,`elevenlabs-tts`].includes(t)?`elevenlabs`:[`gemini`,`google`,`gemini-tts`,`google-tts`].includes(t)?`gemini`:[`xai`,`grok`,`x-ai`,`xai-tts`,`grok-tts`].includes(t)?`xai`:t===`aws`||t===`polly`||t===`aws-polly`?`aws-polly`:e},ve=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}async listModels(e){let t=this.authToken?{Authorization:`Bearer ${this.authToken}`}:{},n=async()=>{let n=await fetch(`${this.APIOrigin}/puterai/chat/models/details`,{headers:t});if(!n.ok)return null;let r=await n.json(),i=Array.isArray(r?.models)?r.models:[];return e?i.filter(t=>t.provider===e):i},r=async()=>{let t=await puter.drivers.call(`puter-chat-completion`,`ai-chat`,`models`),n=Array.isArray(t?.result)?t.result:[];return e?n.filter(t=>t.provider===e):n};return await(async()=>{try{let e=await n();if(e!==null)return e}catch{}try{return await r()}catch{return[]}})()}async listModelProviders(){let e=await this.listModels(),t=new Set;return(e??[]).forEach(e=>{e?.provider&&t.add(e.provider)}),Array.from(t)}img2txt=async(...e)=>{let t=10*1024*1024;if(!e||e.length===0)throw{message:`Arguments are required`,code:`arguments_required`};let n=e=>typeof Blob>`u`?!1:e instanceof Blob||typeof File<`u`&&e instanceof File,r=e=>e&&typeof e==`object`&&!Array.isArray(e)&&!n(e),i=e=>{if(!e)return`aws-textract`;let t=String(e).toLowerCase();return[`aws`,`textract`,`aws-textract`].includes(t)?`aws-textract`:[`mistral`,`mistral-ocr`].includes(t)?`mistral`:`aws-textract`},a={};r(e[0])?a={...e[0]}:a.source=e[0];let o=!1;for(let t=1;t<e.length;t++){let n=e[t];typeof n==`boolean`?o||=n:r(n)&&(a={...a,...n})}typeof a.testMode==`boolean`&&(o=a.testMode);let s=i(a.provider);if(delete a.provider,delete a.testMode,!a.source)throw{message:`Source is required`,code:`source_required`};if(n(a.source)?a.source=await he(a.source):a.source?.source&&n(a.source.source)&&(a.source=await he(a.source.source)),typeof a.source==`string`&&a.source.startsWith(`data:`)&&a.source.length>t)throw{message:`Input size cannot be larger than ${t}`,code:`input_too_large`};let c=e=>{if(!e)return``;if(Array.isArray(e.blocks)&&e.blocks.length){let t=``;for(let n of e.blocks)typeof n?.text==`string`&&(!n.type||n.type===`text/textract:LINE`||n.type.startsWith(`text/`))&&(t+=`${n.text}\n`);if(t.trim())return t}if(Array.isArray(e.pages)&&e.pages.length){let t=e.pages.map(e=>(e?.markdown||``).trim()).filter(Boolean).join(`

`);if(t.trim())return t}return typeof e.document_annotation==`string`?e.document_annotation:typeof e.text==`string`?e.text:``};return await N([`source`],`puter-ocr`,s,`recognize`,{test_mode:o??!1,transform:async e=>c(e)}).call(this,a)};txt2speech=async(...e)=>{let t=3e3,n={},r=!1;if(!e)throw{message:`Arguments are required`,code:`arguments_required`};if(typeof e[0]==`string`&&(n={text:e[0]}),e[1]&&typeof e[1]==`object`&&!Array.isArray(e[1]))Object.assign(n,e[1]);else if(e[1]&&typeof e[1]==`string`)n.language=e[1],e[2]&&typeof e[2]==`string`&&(n.voice=e[2]),e[3]&&typeof e[3]==`string`&&(n.engine=e[3]);else if(e[1]&&typeof e[1]!=`boolean`)throw{message:`Second argument must be an options object or language string. Use: txt2speech("text", { voice: "name", engine: "type", language: "code" }) or txt2speech("text", "language", "voice", "engine")`,code:`invalid_arguments`};if(!n.text)throw{message:`Text parameter is required`,code:`text_required`};let i=[`standard`,`neural`,`long-form`,`generative`],a=I(n.provider);if(n.engine&&I(n.engine)===`openai`&&!n.provider&&(a=`openai`),n.engine&&I(n.engine)===`elevenlabs`&&!n.provider&&(a=`elevenlabs`),n.engine&&I(n.engine)===`gemini`&&!n.provider&&(a=`gemini`),n.engine&&I(n.engine)===`xai`&&!n.provider&&(a=`xai`),a===`openai`)!n.model&&typeof n.engine==`string`&&(n.model=n.engine),n.voice||=`alloy`,n.model||=`gpt-4o-mini-tts`,n.response_format||=`mp3`,delete n.engine;else if(a===`elevenlabs`)n.voice||=`21m00Tcm4TlvDq8ikWAM`,!n.model&&typeof n.engine==`string`&&(n.model=n.engine),n.model||=`eleven_multilingual_v2`,!n.output_format&&!n.response_format&&(n.output_format=`mp3_44100_128`),n.response_format&&!n.output_format&&(n.output_format=n.response_format),delete n.engine;else if(a===`gemini`)!n.model&&typeof n.engine==`string`&&(n.model=n.engine),n.voice||=`Kore`,n.model||=`gemini-2.5-flash-preview-tts`,delete n.engine;else if(a===`xai`)n.voice||=`eve`,n.language||=`en`,delete n.engine;else{if(a=`aws-polly`,n.engine&&!i.includes(n.engine))throw{message:`Invalid engine. Must be one of: ${i.join(`, `)}`,code:`invalid_engine`};n.voice||=`Joanna`,n.engine||=`standard`,n.language||=`en-US`}if(n.text.length>t)throw{message:`Input size cannot be larger than ${t}`,code:`input_too_large`};for(let t=0;t<e.length;t++)if(typeof e[t]==`boolean`&&e[t]===!0){r=!0;break}return await N([`source`],`puter-tts`,{openai:`openai-tts`,elevenlabs:`elevenlabs-tts`,gemini:`gemini-tts`,xai:`xai-tts`}[a]||`aws-polly`,`synthesize`,{responseType:`blob`,test_mode:r??!1,transform:async e=>{let t;if(typeof e==`string`)t=e;else if(e instanceof Blob)t=await P(e);else if(e instanceof ArrayBuffer)t=await P(new Blob([e]));else if(e&&typeof e==`object`&&typeof e.arrayBuffer==`function`){let n=await e.arrayBuffer();t=await P(new Blob([n],{type:e.type||void 0}))}else throw{message:`Unexpected audio response format`,code:`invalid_audio_response`};let n=new(globalThis.Audio||Object);return n.src=t,n.toString=()=>t,n.valueOf=()=>t,n}}).call(this,n)};speech2speech=async(...e)=>{if(!e||!e.length)throw{message:`Arguments are required`,code:`arguments_required`};let t=async e=>e instanceof Blob?await he(e):e,n=(e={})=>{let t={...e};return t.voiceId&&!t.voice&&!t.voice_id&&(t.voice=t.voiceId),t.modelId&&!t.model&&!t.model_id&&(t.model=t.modelId),t.outputFormat&&!t.output_format&&(t.output_format=t.outputFormat),t.voiceSettings&&!t.voice_settings&&(t.voice_settings=t.voiceSettings),t.fileFormat&&!t.file_format&&(t.file_format=t.fileFormat),t.removeBackgroundNoise!==void 0&&t.remove_background_noise===void 0&&(t.remove_background_noise=t.removeBackgroundNoise),t.optimizeStreamingLatency!==void 0&&t.optimize_streaming_latency===void 0&&(t.optimize_streaming_latency=t.optimizeStreamingLatency),t.enableLogging!==void 0&&t.enable_logging===void 0&&(t.enable_logging=t.enableLogging),delete t.voiceId,delete t.modelId,delete t.outputFormat,delete t.voiceSettings,delete t.fileFormat,delete t.removeBackgroundNoise,delete t.optimizeStreamingLatency,delete t.enableLogging,t},r={},i=!1,a=e[0];if(a&&typeof a==`object`&&!Array.isArray(a)&&!(a instanceof Blob)?r={...a}:r.audio=await t(a),e[1]&&typeof e[1]==`object`&&!Array.isArray(e[1])&&!(e[1]instanceof Blob)?r={...r,...e[1]}:typeof e[1]==`boolean`&&(i=e[1]),typeof e[2]==`boolean`&&(i=e[2]),r.file&&(r.audio=await t(r.file),delete r.file),r.audio instanceof Blob&&(r.audio=await t(r.audio)),!r.audio)throw{message:`Audio input is required`,code:`audio_required`};if(typeof r.audio==`string`&&r.audio.startsWith(`data:`)){let e=r.audio.split(`,`)[1]||``,t=e.endsWith(`==`)?2:+!!e.endsWith(`=`);if(Math.floor(e.length*3/4)-t>26214400)throw{message:`Input size cannot be larger than 25 MB`,code:`input_too_large`}}let o=n({...r});return delete o.provider,await N([`audio`],`puter-speech2speech`,`elevenlabs-voice-changer`,`convert`,{responseType:`blob`,test_mode:i,transform:async e=>{let t;if(typeof e==`string`)t=e;else if(e instanceof Blob)t=await P(e);else if(e instanceof ArrayBuffer)t=await P(new Blob([e]));else if(e&&typeof e==`object`&&typeof e.arrayBuffer==`function`){let n=await e.arrayBuffer();t=await P(new Blob([n],{type:e.type||void 0}))}else throw{message:`Unexpected audio response format`,code:`invalid_audio_response`};let n=new Audio(t);return n.toString=()=>t,n.valueOf=()=>t,n}}).call(this,o)};speech2txt=async(...e)=>{if(!e||!e.length)throw{message:`Arguments are required`,code:`arguments_required`};let t=async e=>e instanceof Blob?await he(e):e,n={},r=!1,i=e[0];if(i&&typeof i==`object`&&!Array.isArray(i)&&!(i instanceof Blob)?n={...i}:n.file=await t(i),e[1]&&typeof e[1]==`object`&&!Array.isArray(e[1])&&!(e[1]instanceof Blob)?n={...n,...e[1]}:typeof e[1]==`boolean`&&(r=e[1]),typeof e[2]==`boolean`&&(r=e[2]),n.audio&&(n.file=await t(n.audio),delete n.audio),n.file instanceof Blob&&(n.file=await t(n.file)),!n.file)throw{message:`Audio input is required`,code:`audio_required`};if(typeof n.file==`string`&&n.file.startsWith(`data:`)){let e=n.file.split(`,`)[1]||``,t=e.endsWith(`==`)?2:+!!e.endsWith(`=`);if(Math.floor(e.length*3/4)-t>26214400)throw{message:`Input size cannot be larger than 25 MB`,code:`input_too_large`}}let a=n.translate?`translate`:`transcribe`,o={...n};delete o.translate;let s=o.provider;delete o.provider;let c=s&&{xai:`xai-speech2txt`,grok:`xai-speech2txt`,"x-ai":`xai-speech2txt`}[s.toLowerCase()]||`openai-speech2txt`,l=o.response_format;return await N([],`puter-speech2txt`,c,a,{test_mode:r,transform:async e=>l===`text`&&e&&typeof e==`object`&&typeof e.text==`string`?e.text:e}).call(this,o)};txt2speech=Object.assign(this.txt2speech,{listEngines:async(e={})=>{let t=`aws-polly`,n={};return typeof e==`string`?t=I(e):e&&typeof e==`object`&&(t=I(e.provider)||t,n={...e},delete n.provider),t===`openai`&&(n.provider=`openai`),t===`elevenlabs`&&(n.provider=`elevenlabs`),t===`gemini`&&(n.provider=`gemini`),t===`xai`&&(n.provider=`xai`),await N([`source`],`puter-tts`,{openai:`openai-tts`,elevenlabs:`elevenlabs-tts`,gemini:`gemini-tts`,xai:`xai-tts`}[t]||`aws-polly`,`list_engines`,{responseType:`text`}).call(this,n)},listVoices:async e=>{let t=`aws-polly`,n={};return typeof e==`string`?n.engine=e:e&&typeof e==`object`&&(t=I(e.provider)||t,n={...e},delete n.provider),t===`openai`&&(n.provider=`openai`,delete n.engine),t===`elevenlabs`&&(n.provider=`elevenlabs`),t===`gemini`&&(n.provider=`gemini`,delete n.engine),t===`xai`&&(n.provider=`xai`,delete n.engine),N([`source`],`puter-tts`,{openai:`openai-tts`,elevenlabs:`elevenlabs-tts`,gemini:`gemini-tts`,xai:`xai-tts`}[t]||`aws-polly`,`list_voices`,{responseType:`text`}).call(this,n)}});chat=async(...e)=>{let t={},n={},r=!1;if(!e)throw{message:`Arguments are required`,code:`arguments_required`};if(typeof e[0]==`string`&&(t={messages:[{content:e[0]}]}),typeof e[0]==`string`&&(!e[1]||typeof e[1]==`boolean`))t={messages:[{content:e[0]}]};else if(typeof e[0]==`string`&&(typeof e[1]==`string`||e[1]instanceof File)){e[1]instanceof File&&(e[1]=await he(e[1]));let n=_e(e[1])?{video_url:{url:e[1]}}:{image_url:{url:e[1]}};t={vision:!0,messages:[{content:[e[0],n]}]}}else if(typeof e[0]==`string`&&Array.isArray(e[1])){for(let t=0;t<e[1].length;t++){let n=e[1][t];e[1][t]=_e(n)?{video_url:{url:n}}:{image_url:{url:n}}}t={vision:!0,messages:[{content:[e[0],...e[1]]}]}}else Array.isArray(e[0])&&(t={messages:e[0]});(typeof e[1]==`boolean`&&e[1]===!0||typeof e[2]==`boolean`&&e[2]===!0||typeof e[3]==`boolean`&&e[3]===!0)&&(r=!0);let i=e=>typeof e==`object`&&!Array.isArray(e)&&e!==null;for(let t=0;t<e.length;t++)if(i(e[t])){n=e[t];break}n.model&&(t.model=n.model),n.temperature&&(t.temperature=n.temperature),n.max_tokens&&(t.max_tokens=n.max_tokens),n.provider&&(t.provider=n.provider),t.model=t.model??``,n.stream!==void 0&&typeof n.stream==`boolean`&&(t.stream=n.stream),n.driver&&(t.provider=t.provider||n.driver);for(let e of[`tools`,`response`,`reasoning`,`reasoning_effort`,`text`,`verbosity`,`provider`,`image_config`])n[e]&&(t[e]=n[e]);return t.model===``&&delete t.model,await N([`messages`],`puter-chat-completion`,`ai-chat`,`complete`,{test_mode:r??!1,transform:async e=>(e.toString=()=>e.message?.content,e.valueOf=()=>e.message?.content,e)}).call(this,t)};txt2img=async(...e)=>{let t={},n=!1;if(!e)throw{message:`Arguments are required`,code:`arguments_required`};typeof e[0]==`string`&&(t={prompt:e[0]}),typeof e[1]==`boolean`&&e[1]===!0&&(n=!0),typeof e[0]==`string`&&typeof e[1]==`object`&&(t=e[1],t.prompt=e[0]),typeof e[0]==`object`&&(t=e[0]);let r=`openai-image-generation`;return t.model===`nano-banana`&&(t.model=`gemini-2.5-flash-image-preview`),t.model===`nano-banana-pro`&&(t.model=`gemini-3-pro-image-preview`),r=(typeof t.driver==`string`?t.driver:void 0)||`ai-image`,t.puter_output_path&&=F(t.puter_output_path),await N([`prompt`],`puter-image-generation`,r,`generate`,{responseType:`blob`,test_mode:n??!1,transform:async e=>{let t;if(typeof e==`string`)t=e;else if(e instanceof Blob)t=await P(e);else if(e instanceof ArrayBuffer)t=await P(new Blob([e]));else if(e&&typeof e==`object`&&typeof e.arrayBuffer==`function`){let n=await e.arrayBuffer();t=await P(new Blob([n],{type:e.type||void 0}))}else throw{message:`Unexpected image response format`,code:`invalid_image_response`};let n=new(globalThis.Image||Object);return n.src=t,n.toString=()=>n.src,n.valueOf=()=>n.src,n}}).call(this,t)};txt2vid=async(...e)=>{let t={},n=!1;if(!e)throw{message:`Arguments are required`,code:`arguments_required`};if(typeof e[0]==`string`&&(t={prompt:e[0]}),typeof e[1]==`boolean`&&e[1]===!0&&(n=!0),typeof e[0]==`string`&&typeof e[1]==`object`&&(t=e[1],t.prompt=e[0]),typeof e[0]==`object`&&(t=e[0]),!t.prompt)throw{message:`Prompt parameter is required`,code:`prompt_required`};t.duration!==void 0&&t.seconds===void 0&&(t.seconds=t.duration),t.test_mode===!0&&(n=!0);let r=`ai-video`,i=typeof t.driver==`string`?t.driver:void 0;return i&&(r=i),t.puter_output_path&&=F(t.puter_output_path),await N([`prompt`],`puter-video-generation`,r,`generate`,{responseType:`blob`,test_mode:n??!1,transform:async e=>{let t=null,n=null;if(e instanceof Blob?(t=await P(e),n=e.type||`video/mp4`):typeof e==`string`?t=e:e&&typeof e==`object`&&(t=e.asset_url||e.url||e.href||null,n=e.mime_type||e.content_type||null),!t)return e;let r=globalThis.document?.createElement(`video`)||{setAttribute:()=>{}};return r.src=t,r.controls=!0,r.preload=`metadata`,n&&r.setAttribute(`data-mime-type`,n),r.setAttribute(`data-source`,t),r.toString=()=>r.src,r.valueOf=()=>r.src,r}}).call(this,t)}},ye=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}#e(e){return e.getUsers=async t=>(t??={},(await puter.drivers.call(`app-telemetry`,`app-telemetry`,`get_users`,{app_uuid:e.uid,limit:t.limit,offset:t.offset})).result),e.users=async function*(t=100){let n=0;for(;;){let r=await e.getUsers({limit:t,offset:n});if(!r||r.length===0)return;for(let e of r)yield e;if(n+=r.length,r.length<t)return}},e}#t(e){return e.forEach(e=>{this.#e(e)}),e}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}list=async(...e)=>{let t={};return typeof e[0]==`object`&&e[0]!==null&&(t.params=e[0]),t.predicate=[`user-can-edit`],this.#t(await N([`uid`],`puter-apps`,`es:app`,`select`).call(this,t))};create=async(...e)=>{let t={};if(typeof e[0]==`string`){let n=e[1],r=e[2]??e[0];t={object:{name:e[0],index_url:n,title:r}}}else if(typeof e[0]==`object`&&e[0]!==null){let n=e[0];t={object:{name:n.name,index_url:n.indexURL,title:n.title??n.name,description:n.description,icon:n.icon,maximize_on_start:n.maximizeOnStart,background:n.background,filetype_associations:n.filetypeAssociations,metadata:n.metadata},options:{dedupe_name:n.dedupeName??!1}}}if(!t.object.name)throw{success:!1,error:{code:`invalid_request`,message:`Name is required`}};if(!t.object.index_url)throw{success:!1,error:{code:`invalid_request`,message:`Index URL is required`}};return this.#e(await N([`object`],`puter-apps`,`es:app`,`create`).call(this,t))};update=async(...e)=>{let t={};if(Array.isArray(e)&&typeof e[0]==`string`){let n=e[1],r={name:n.name,index_url:n.indexURL,title:n.title,description:n.description,icon:n.icon,maximize_on_start:n.maximizeOnStart,background:n.background,filetype_associations:n.filetypeAssociations,metadata:n.metadata};t={id:{name:e[0]},object:r}}return this.#e(await N([`object`],`puter-apps`,`es:app`,`update`).call(this,t))};get=async(...e)=>{let t={};return Array.isArray(e)&&typeof e[0]==`string`&&(typeof e[1]==`object`&&e[1]!==null&&(t.params=e[1]),t.id={name:e[0]}),typeof e[0]==`object`&&e[0]!==null&&(t.params=e[0]),this.#e(await N([`uid`],`puter-apps`,`es:app`,`read`).call(this,t))};delete=async(...e)=>{let t={};return Array.isArray(e)&&typeof e[0]==`string`&&(t={id:{name:e[0]}}),N([`uid`],`puter-apps`,`es:app`,`delete`).call(this,t)};checkName=async e=>{if(typeof e!=`string`||e.length===0)throw{success:!1,error:{code:`invalid_request`,message:`Name is required`}};let t=await fetch(`${puter.APIOrigin}/apps/nameAvailable?name=${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${puter.authToken}`}}),n=await t.json();if(!t.ok)throw n;return n};getDeveloperProfile=function(...e){return typeof e[0]==`object`&&e[0]!==null?e[0]:(e[0],e[1]),new Promise((t,n)=>{let r;return r=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]},new Promise((e,i)=>{let a=j(`/get-dev-profile`,puter.APIOrigin,puter.authToken,`get`);M(a,r.success??t,r.error??n,e,i),a.send()})})}},be=600,xe=700,Se=()=>{if(navigator.userActivation)return navigator.userActivation.hasBeenActive&&navigator.userActivation.isActive;try{let e=window.open(``,`_blank`,`width=1,height=1,left=-1000,top=-1000`);return e?(e.close(),!0):!1}catch{return!1}},Ce=(e,t=`Puter`)=>{let n=screen.width/2-be/2,r=screen.height/2-xe/2;return window.open(e,t,`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${be}, height=${xe}, top=${r}, left=${n}`)},we=class extends (globalThis.HTMLElement||Object){static messageID=Math.floor((2**53-1)/2);#e;constructor(e,t,n={}){super(),this.reject=t,this.resolve=e,this.options=n,this.#e=this.constructor.messageID++,this.attachShadow({mode:`open`});let r=`
        <style>
        dialog{
            background: transparent;
            border: none;
            box-shadow: none;
            outline: none;
        }
        dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }
        .puter-dialog-content {
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 20px;
            background: white;
            box-shadow: 0 0 9px 1px rgb(0 0 0 / 21%);
            padding: 80px 20px;
            -webkit-font-smoothing: antialiased;
            color: #575762;
            position: relative;
            background-color: #fff;
        }
        
        dialog * {
            max-width: 500px;
            font-family: "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif;
        }
        
        dialog p.about{
            text-align: center;
            font-size: 17px;
            padding: 10px 30px;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            color: #1f1f2a;
            box-sizing: border-box;
            max-width: 400px;
        }
        
        dialog .buttons{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 20px;
            text-align: center;
            flex-direction: column;
        }
        
        .launch-auth-popup-footnote{
            font-size: 10px;
            color: #666;
            margin-top: 10px;
            /* footer at the bottom */
            position: absolute;
            left: 0;
            right: 0;
            bottom: 20px;
            text-align: center;
            margin: 0 auto; 
            max-width: 215px;
        }
        
        dialog .close-btn{
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 17px;
            color: #8a8a8a8c;
            cursor: pointer;
        }
        
        dialog .close-btn:hover{
            color: #000;
        }
        
        /* ------------------------------------
        Button
        ------------------------------------*/
        
        dialog .button {
            color: #666666;
            background-color: #eeeeee;
            border-color: #eeeeee;
            font-size: 14px;
            text-decoration: none;
            text-align: center;
            line-height: 40px;
            height: 35px;
            padding: 0 30px;
            margin: 0;
            display: inline-block;
            appearance: none;
            cursor: pointer;
            border: none;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border-color: #b9b9b9;
            border-style: solid;
            border-width: 1px;
            line-height: 35px;
            background: -webkit-gradient(linear, left top, left bottom, from(#f6f6f6), to(#e1e1e1));
            background: linear-gradient(#f6f6f6, #e1e1e1);
            border-radius: 4px;
            outline: none;
            -webkit-font-smoothing: antialiased;
        }
        
        dialog .button:focus-visible {
            border-color: rgb(118 118 118);
        }
        
        dialog .button:active, dialog .button.active, dialog .button.is-active, dialog .button.has-open-contextmenu {
            text-decoration: none;
            background-color: #eeeeee;
            border-color: #cfcfcf;
            color: #a9a9a9;
            -webkit-transition-duration: 0s;
            transition-duration: 0s;
            -webkit-box-shadow: inset 0 1px 3px rgb(0 0 0 / 20%);
            box-shadow: inset 0px 2px 3px rgb(0 0 0 / 36%), 0px 1px 0px white;
        }
        
        dialog .button.disabled, dialog .button.is-disabled, dialog .button:disabled {
            top: 0 !important;
            background: #EEE !important;
            border: 1px solid #DDD !important;
            text-shadow: 0 1px 1px white !important;
            color: #CCC !important;
            cursor: default !important;
            appearance: none !important;
            pointer-events: none;
        }
        
        dialog .button-action.disabled, dialog .button-action.is-disabled, dialog .button-action:disabled {
            background: #55a975 !important;
            border: 1px solid #60ab7d !important;
            text-shadow: none !important;
            color: #CCC !important;
        }
        
        dialog .button-primary.disabled, dialog .button-primary.is-disabled, dialog .button-primary:disabled {
            background: #8fc2e7 !important;
            border: 1px solid #98adbd !important;
            text-shadow: none !important;
            color: #f5f5f5 !important;
        }
        
        dialog .button-block {
            width: 100%;
        }
        
        dialog .button-primary {
            border-color: #088ef0;
            background: -webkit-gradient(linear, left top, left bottom, from(#34a5f8), to(#088ef0));
            background: linear-gradient(#34a5f8, #088ef0);
            color: white;
        }
        
        dialog .button-danger {
            border-color: #f00808;
            background: -webkit-gradient(linear, left top, left bottom, from(#f83434), to(#f00808));
            background: linear-gradient(#f83434, #f00808);
            color: white;
        }
        
        dialog .button-primary:active, dialog .button-primary.active, dialog .button-primary.is-active, dialog .button-primary-flat:active, dialog .button-primary-flat.active, dialog .button-primary-flat.is-active {
            background-color: #2798eb;
            border-color: #2798eb;
            color: #bedef5;
        }
        
        dialog .button-action {
            border-color: #08bf4e;
            background: -webkit-gradient(linear, left top, left bottom, from(#29d55d), to(#1ccd60));
            background: linear-gradient(#29d55d, #1ccd60);
            color: white;
        }
        
        dialog .button-action:active, dialog .button-action.active, dialog .button-action.is-active, dialog .button-action-flat:active, dialog .button-action-flat.active, dialog .button-action-flat.is-active {
            background-color: #27eb41;
            border-color: #27eb41;
            color: #bef5ca;
        }
        
        dialog .button-giant {
            font-size: 28px;
            height: 70px;
            line-height: 70px;
            padding: 0 70px;
        }
        
        dialog .button-jumbo {
            font-size: 24px;
            height: 60px;
            line-height: 60px;
            padding: 0 60px;
        }
        
        dialog .button-large {
            font-size: 20px;
            height: 50px;
            line-height: 50px;
            padding: 0 50px;
        }
        
        dialog .button-normal {
            font-size: 16px;
            height: 40px;
            line-height: 38px;
            padding: 0 40px;
        }
        
        dialog .button-small {
            height: 30px;
            line-height: 29px;
            padding: 0 30px;
        }
        
        dialog .button-tiny {
            font-size: 9.6px;
            height: 24px;
            line-height: 24px;
            padding: 0 24px;
        }
        
        #launch-auth-popup{
            width: 220px; 
            font-weight: 500; 
            font-size: 15px;
            max-width: 250px;
        }
        dialog .button-auth{
            margin-bottom: 10px;
        }
        dialog .button-auth-cancel{
            background: none !important;
            width: 220px;
            max-width: 250px;
        }
        dialog a, dialog a:visited{
            color: rgb(0 0 0);
            text-decoration: none;
        }
        dialog a:hover{
            text-decoration: underline;
        }
        
        @media (max-width:480px)  {
            .puter-dialog-content{
                padding: 50px 20px;
            }
            dialog p.about{
                padding: 10px 0;
            }
            dialog .button-auth{
                width: 100% !important;
                margin:0 !important;
                margin-bottom: 10px !important;
            }

            dialog .buttons{
                margin-bottom: 20px;
            }
        }
        .error-container h1 {
            color: #e74c3c;
            font-size: 20px;
            text-align: center;
        }

        .puter-dialog-content a:focus{
            outline: none;
        }

        @media (prefers-color-scheme: dark) {
            .puter-dialog-content {
                border: 1px solid #2a2a2e;
                background: #1e1e22;
                background-color: #1e1e22;
                color: #d6d6dc;
                box-shadow: 0 0 9px 1px rgb(0 0 0 / 60%);
            }

            dialog p.about {
                color: #e4e4ea;
            }

            dialog .close-btn {
                color: #8a8a90;
            }

            dialog .close-btn:hover {
                color: #fff;
            }

            .launch-auth-popup-footnote {
                color: #9a9aa0;
            }

            dialog .button {
                color: #d6d6dc;
                background-color: #3a3a40;
                border-color: #4a4a50;
                background: linear-gradient(#3f3f45, #2e2e34);
                -webkit-box-shadow: inset 0px 1px 0px rgb(255 255 255 / 6%), 0 1px 2px rgb(0 0 0 / 40%);
                box-shadow: inset 0px 1px 0px rgb(255 255 255 / 6%), 0 1px 2px rgb(0 0 0 / 40%);
            }

            dialog .button:focus-visible {
                border-color: #8a8a90;
            }

            dialog .button:active, dialog .button.active, dialog .button.is-active, dialog .button.has-open-contextmenu {
                background-color: #2a2a30;
                border-color: #1f1f24;
                color: #8a8a90;
                -webkit-box-shadow: inset 0 1px 3px rgb(0 0 0 / 60%);
                box-shadow: inset 0px 2px 3px rgb(0 0 0 / 60%), 0px 1px 0px rgb(255 255 255 / 4%);
            }

            /* The dark-mode 'dialog .button' rule above has the same specificity
               as the light-mode 'dialog .button-primary' rule, so without this
               override source order wins and the primary button turns gray. */
            dialog .button-primary {
                border-color: #088ef0;
                background: linear-gradient(#34a5f8, #088ef0);
                color: white;
            }

            dialog .button-primary:active, dialog .button-primary.active, dialog .button-primary.is-active {
                background-color: #2798eb;
                border-color: #2798eb;
                color: #bedef5;
            }

            dialog .button.disabled, dialog .button.is-disabled, dialog .button:disabled {
                background: #2a2a30 !important;
                border: 1px solid #34343a !important;
                text-shadow: none !important;
                color: #5a5a60 !important;
            }

            dialog .button-primary.disabled, dialog .button-primary.is-disabled, dialog .button-primary:disabled {
                background: #1f4e74 !important;
                border: 1px solid #2a5a82 !important;
                color: #8aa4bd !important;
            }

            dialog .button-action.disabled, dialog .button-action.is-disabled, dialog .button-action:disabled {
                background: #1f5a3a !important;
                border: 1px solid #2a6a45 !important;
                color: #8abda0 !important;
            }

            dialog a, dialog a:visited {
                color: #6ea8ff;
            }

            .error-container h1 {
                color: #ff7466;
            }
        }
        </style>`;window.location.protocol===`file:`?r+=`<dialog>
                    <div class="puter-dialog-content" style="padding: 20px 40px; font-size: 15px;">
                        <span class="close-btn">&#x2715</span>
                        <div class="error-container">
                            <h1>Puter.js Error: Unsupported Protocol</h1>
                            <p>It looks like you've opened this file directly in your browser (using the <code style="font-family: monospace;">file:///</code> protocol) which is not supported by Puter.js for security reasons.</p>
                            <p>To view this content properly, you need to serve it through a web server. Here are some options:</p>
                            <ul>
                                <li>Use a local development server (e.g., Python's built-in server or Node.js http-server)</li>
                                <li>Upload the files to a web hosting service</li>
                                <li>Use a local server application like XAMPP or MAMP</li>
                            </ul>
                            <p class="help-text">If you're not familiar with these options, consider reaching out to your development team or IT support for assistance.</p>
                        </div>
                        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center; font-size:13px;">
                            <a href="https://docs.puter.com" target="_blank">Docs</a><span style="margin:10px; color: #CCC;">|</span>
                            <a href="https://github.com/heyPuter/puter/" target="_blank">Github</a><span style="margin:10px; color: #CCC;">|</span>
                            <a href="https://discord.com/invite/PQcx7Teh8u" target="_blank">Discord</a>
                        </p>
                    </div>
                </dialog>`:r+=`<dialog>
                <div class="puter-dialog-content">
                    <span class="close-btn">&#x2715</span>
                    <a href="https://puter.com?utm_source=sdk-splash" target="_blank" style="border:none; outline:none; display: block; width: 70px; height: 70px; margin: 0 auto; border-radius: 4px;"><img style="display: block; width: 40px; height: 40px; margin: 0 auto; border-radius: 8px; background-color: #2210d7; padding: 15px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGcgY2xhc3M9ImxheWVyIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGcgaWQ9InN2Z18xIiBzdHJva2Utd2lkdGg9IjMiIHRyYW5zZm9ybT0icm90YXRlKDkwIDI0IDIzLjk5OTcpIj4KICAgPHBvbHlsaW5lIGZpbGw9Im5vbmUiIGlkPSJzdmdfMiIgcG9pbnRzPSIzOSAyNCAyNSAyNCAyNSAyOCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMyIvPgogICA8cG9seWxpbmUgZmlsbD0ibm9uZSIgaWQ9InN2Z18zIiBwb2ludHM9IjM1Ljg3OSAxMC4xMjEgMzIgMTQgMjUgMTQgMjUgMTgiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjMiLz4KICAgPHBhdGggZD0ibTEzLDI2YTEwLjI5LDEwLjI5IDAgMCAxIC03LjIsLTMiIGZpbGw9Im5vbmUiIGlkPSJzdmdfNCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMyIvPgogICA8cGF0aCBkPSJtMTcsMzEuNmE1LjgzLDUuODMgMCAwIDEgLTQsLTUuNmE1LjczLDUuNzMgMCAwIDEgMiwtNC40IiBmaWxsPSJub25lIiBpZD0ic3ZnXzUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjMiLz4KICAgPHBhdGggZD0ibTM1Ljg4LDM3Ljg4bC0zLjg4LC0zLjg4bC03LDBsMCwyYTkuOSw5LjkgMCAwIDEgLTEwLDEwYTkuOSw5LjkgMCAwIDEgLTEwLC0xMGE5LjA2LDkuMDYgMCAwIDEgMC42LC0zLjJhNS42Myw1LjYzIDAgMCAxIC0yLjYsLTQuOGE1Ljg5LDUuODkgMCAwIDEgMi44LC01YTkuOTksOS45OSAwIDAgMSAtMi44LC03YTkuOSw5LjkgMCAwIDEgMTAsLTEwbDAuNCwwYTUuODMsNS44MyAwIDAgMSA1LjYsLTRhNS44OSw1Ljg5IDAgMCAxIDYsNiIgZmlsbD0ibm9uZSIgaWQ9InN2Z182IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgIDxjaXJjbGUgY3g9IjM4IiBjeT0iOCIgZGF0YS1jb2xvcj0iY29sb3ItMiIgZmlsbD0ibm9uZSIgaWQ9InN2Z183IiByPSIzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgIDxjaXJjbGUgY3g9IjQyIiBjeT0iMjQiIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIGlkPSJzdmdfOCIgcj0iMyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMyIvPgogICA8Y2lyY2xlIGN4PSIzOCIgY3k9IjQwIiBkYXRhLWNvbG9yPSJjb2xvci0yIiBmaWxsPSJub25lIiBpZD0ic3ZnXzkiIHI9IjMiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPg=="/></a>
                    <p class="about">This website uses Puter to bring you safe, secure, and private AI and Cloud features.</p>
                    <div class="buttons">
                        <button class="button button-primary button-auth" id="launch-auth-popup">Continue</button>
                        <button class="button button-auth button-auth-cancel" id="launch-auth-popup-cancel">Cancel</button>
                    </div>
                    <p class="launch-auth-popup-footnote">By clicking 'Continue' you agree to Puter's <a href="https://puter.com/terms" target="_blank">Terms of Service</a> and <a href="https://puter.com/privacy" target="_blank">Privacy Policy</a></p>
                </div>
            </dialog>`,this.shadowRoot.innerHTML=r,this.messageListener=async e=>{e.origin===puter.defaultGUIOrigin&&(this.authPopup&&e.source!==this.authPopup||e.data.msg===`puter.token`&&(this.close(),puter.setAuthToken(e.data.token),puter.setAppID(e.data.app_uid),window.removeEventListener(`message`,this.messageListener),puter.puterAuthState.authGranted=!0,this.resolve(),puter.onAuth&&typeof puter.onAuth==`function`&&puter.getUser().then(e=>{puter.onAuth(e)}),puter.puterAuthState.isPromptOpen=!1,puter.puterAuthState.resolver&&(puter.puterAuthState.authGranted?puter.puterAuthState.resolver.resolve():puter.puterAuthState.resolver.reject(),puter.puterAuthState.resolver=null)))}}#t(){return this.options.popupURL?this.options.popupURL:`${puter.defaultGUIOrigin}/?embedded_in_popup=true&request_auth=true&msg_id=${this.#e}${window.crossOriginIsolated?`&cross_origin_isolated=true`:``}`}cancelListener=()=>{if(this.close(),window.removeEventListener(`message`,this.messageListener),this.options.popupURL){typeof this.options.onCancel==`function`&&this.options.onCancel();return}puter.puterAuthState.authGranted=!1,puter.puterAuthState.isPromptOpen=!1,this.reject(Error(`User cancelled the authentication`)),puter.puterAuthState.resolver&&(puter.puterAuthState.resolver.reject(Error(`User cancelled the authentication`)),puter.puterAuthState.resolver=null)};connectedCallback(){this.shadowRoot.querySelector(`#launch-auth-popup`)?.addEventListener(`click`,()=>{let e=Ce(this.#t());this.authPopup=e,this.options.popupURL&&(typeof this.options.onLaunch==`function`&&this.options.onLaunch(e),this.close())}),this.options.popupURL||window.addEventListener(`message`,this.messageListener),this.shadowRoot.querySelector(`#launch-auth-popup-cancel`)?.addEventListener(`click`,this.cancelListener),this.shadowRoot.querySelector(`.close-btn`)?.addEventListener(`click`,this.cancelListener)}open(){if(Se()){let e=Ce(this.#t());this.authPopup=e,this.options.popupURL&&typeof this.options.onLaunch==`function`&&this.options.onLaunch(e)}else this.shadowRoot.querySelector(`dialog`).showModal()}close(){this.shadowRoot.querySelector(`dialog`).close()}};we.__proto__===globalThis.HTMLElement&&customElements.define(`puter-dialog`,we);var Te=class{#e=1;constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}signIn=e=>(e||={},new Promise((t,n)=>{let r=this.#e++,i=`${puter.defaultGUIOrigin}/action/sign-in?embedded_in_popup=true&msg_id=${r}${window.crossOriginIsolated?`&cross_origin_isolated=true`:``}${e.attempt_temp_user_creation?`&attempt_temp_user_creation=true`:``}`,a=!1,o=null,s=null,c=()=>{o&&=(clearInterval(o),null),window.removeEventListener(`message`,l)};function l(e){e.origin===puter.defaultGUIOrigin&&(s&&e.source!==s||e.data?.msg===`puter.token`&&e.data?.msg_id==r&&(a||(a=!0,c(),delete e.data.msg_id,delete e.data.msg,e.data.success?(puter.setAuthToken(e.data.token),t(e.data)):n(e.data))))}window.addEventListener(`message`,l);let u=e=>{if(!a){if(!e){a=!0,c(),n({error:`popup_blocked`,msg:`The sign-in popup was blocked by the browser.`});return}s=e,o=setInterval(()=>{e.closed&&(clearInterval(o),o=null,!a&&(a=!0,c(),n({error:`auth_window_closed`,msg:`Authentication window was closed by the user without completing the process.`})))},100)}};if(Se())u(Ce(i));else{let e=new we(()=>{},()=>{},{popupURL:i,onLaunch:e=>u(e),onCancel:()=>{a||(a=!0,c(),n({error:`auth_window_closed`,msg:`Authentication window was closed by the user without completing the process.`}))}});document.body.appendChild(e),e.open()}}));isSignedIn=()=>!!puter.authToken;getUser=function(...e){if(!puter.authToken)throw{status:401,message:`Unauthorized`};let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]},new Promise((e,n)=>{let r=j(`/whoami`,puter.APIOrigin,puter.authToken,`get`);M(r,t.success,t.error,e,n),r.send()})};signOut=()=>{puter.resetAuthToken()};async whoami(){if(!this.authToken)throw{status:401,message:`Unauthorized`};try{let e=await(await fetch(`${this.APIOrigin}/whoami`,{headers:{Authorization:`Bearer ${this.authToken}`}})).json();return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`whoami`,params:{},result:e}),e}catch(e){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`whoami`,params:{},error:{message:e.message||e.toString(),stack:e.stack}}),e}}async getMonthlyUsage(){try{let e=await(await fetch(`${this.APIOrigin}/metering/usage`,{headers:{Authorization:`Bearer ${this.authToken}`}})).json();return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`usage`,params:{},result:e}),e}catch(e){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`usage`,params:{},error:{message:e.message||e.toString(),stack:e.stack}}),e}}async getDetailedAppUsage(e){if(!e)throw Error(`appId is required`);try{let t=await(await fetch(`${this.APIOrigin}/metering/usage/${e}`,{headers:{Authorization:`Bearer ${this.authToken}`}})).json();return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`detailed_app_usage`,params:{appId:e},result:t}),t}catch(t){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`detailed_app_usage`,params:{appId:e},error:{message:t.message||t.toString(),stack:t.stack}}),t}}async getGlobalUsage(){try{let e=await(await fetch(`${this.APIOrigin}/metering/globalUsage`,{headers:{Authorization:`Bearer ${this.authToken}`}})).json();return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`global_usage`,params:{},result:e}),e}catch(e){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`auth`,operation:`global_usage`,params:{},error:{message:e.message||e.toString(),stack:e.stack}}),e}}},Ee=class{constructor(e,t){this.puter=e,this.parameters=t,this._init()}_init(){let e=new URL(location.href).searchParams.get(`enabled_logs`);e||=``,e=e.split(`;`);for(let t of e)t!==``&&this.puter.logger.on(t);globalThis.addEventListener(`message`,async e=>{e.source===globalThis.parent&&e.data.$&&e.data.$===`puterjs-debug`&&(console.log(`Got a puter.js debug event!`,e.data),e.data.cmd===`log.on`&&(console.log(`Got instruction to turn logs on!`),this.puter.logger.on(e.data.category)))})}},De=class{constructor({getAPIOrigin:e,getAuthToken:t}){this.getAPIOrigin=e,this.getAuthToken=t,this.response_handlers=this.constructor.response_handlers}static response_handlers={"application/x-ndjson":async e=>async function*(e){let t=e.getReader(),n,r;for(;!r&&({value:n,done:r}=await t.read(),!r);){let e=new TextDecoder().decode(n).split(`
`);for(let t of e)t.trim()!==``&&(yield JSON.parse(t))}}(e.body),"application/json":async e=>await e.json(),"application/octet-stream":async e=>await e.blob()};async call({driver:e,method_name:t,parameters:n}){try{let r=await fetch(`${this.getAPIOrigin()}/drivers/call`,{headers:{"Content-Type":`text/plain;actually=json`},method:`POST`,body:JSON.stringify({interface:e.iface_name,...e.service_name?{service:e.service_name}:{},method:t,args:n,auth_token:this.getAuthToken()})}),i=r.headers.get(`content-type`).split(`;`)[0].trim(),a=this.response_handlers[i];if(!a){let a=`unrecognized content type: ${i}`;throw console.error(a),console.error(`creating blob so dev tools shows response...`),await r.blob(),globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${e.iface_name}::${t}`,params:{interface:e.iface_name,driver:e.service_name||e.iface_name,method:t,args:n},error:{message:a}}),Error(a)}let o=await a(r);return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${e.iface_name}::${t}`,params:{interface:e.iface_name,driver:e.service_name||e.iface_name,method:t,args:n},result:o}),o}catch(r){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`${e.iface_name}::${t}`,params:{interface:e.iface_name,driver:e.service_name||e.iface_name,method:t,args:n},error:{message:r.message||r.toString(),stack:r.stack}}),r}}},Oe=class{constructor({iface:e,iface_name:t,service_name:n,call_backend:r}){this.iface=e,this.iface_name=t,this.service_name=n,this.call_backend=r}async call(e,t){return await this.call_backend.call({driver:this,method_name:e,parameters:t})}},ke=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID,this.drivers_={}}_init({puter:e}){e.call=this.call.bind(this)}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}async list(){try{let e=await(await fetch(`${this.APIOrigin}/lsmod`,{headers:{Authorization:`Bearer ${this.authToken}`},method:`POST`})).json();return globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`list`,params:{},result:e.interfaces}),e.interfaces}catch(e){throw globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`drivers`,operation:`list`,params:{},error:{message:e.message||e.toString(),stack:e.stack}}),e}}async get(e,t){t||=e;let n=`${e}:${t}`;return this.drivers_[n]?this.drivers_[n]:this.drivers_[n]=new Oe({call_backend:new De({getAPIOrigin:()=>this.APIOrigin,getAuthToken:()=>this.authToken}),iface_name:e,service_name:t})}async call(...e){let t,n,r,i;return e.length===4?[t,n,r,i]=e:e.length===3?[t,r,i]=e:e.length===2&&([t,i]=e,r=t),await(await this.get(t,n)).call(r,i)}},L=Object.create(null);L.open=`0`,L.close=`1`,L.ping=`2`,L.pong=`3`,L.message=`4`,L.upgrade=`5`,L.noop=`6`;var Ae=Object.create(null);Object.keys(L).forEach((e=>{Ae[L[e]]=e}));var je={type:`error`,data:`parser error`},Me=typeof Blob==`function`||typeof Blob<`u`&&Object.prototype.toString.call(Blob)===`[object BlobConstructor]`,Ne=typeof ArrayBuffer==`function`,Pe=e=>typeof ArrayBuffer.isView==`function`?ArrayBuffer.isView(e):e&&e.buffer instanceof ArrayBuffer,Fe=({type:e,data:t},n,r)=>Me&&t instanceof Blob?n?r(t):Ie(t,r):Ne&&(t instanceof ArrayBuffer||Pe(t))?n?r(t):Ie(new Blob([t]),r):r(L[e]+(t||``)),Ie=(e,t)=>{let n=new FileReader;return n.onload=function(){let e=n.result.split(`,`)[1];t(`b`+(e||``))},n.readAsDataURL(e)};function Le(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}var Re,ze=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`,Be=typeof Uint8Array>`u`?[]:new Uint8Array(256);for(let e=0;e<64;e++)Be[ze.charCodeAt(e)]=e;var Ve=typeof ArrayBuffer==`function`,He=(e,t)=>{if(typeof e!=`string`)return{type:`message`,data:We(e,t)};let n=e.charAt(0);return n===`b`?{type:`message`,data:Ue(e.substring(1),t)}:Ae[n]?e.length>1?{type:Ae[n],data:e.substring(1)}:{type:Ae[n]}:je},Ue=(e,t)=>Ve?We((e=>{let t,n,r,i,a,o=.75*e.length,s=e.length,c=0;e[e.length-1]===`=`&&(o--,e[e.length-2]===`=`&&o--);let l=new ArrayBuffer(o),u=new Uint8Array(l);for(t=0;t<s;t+=4)n=Be[e.charCodeAt(t)],r=Be[e.charCodeAt(t+1)],i=Be[e.charCodeAt(t+2)],a=Be[e.charCodeAt(t+3)],u[c++]=n<<2|r>>4,u[c++]=(15&r)<<4|i>>2,u[c++]=(3&i)<<6|63&a;return l})(e),t):{base64:!0,data:e},We=(e,t)=>t===`blob`?e instanceof Blob?e:new Blob([e]):e instanceof ArrayBuffer?e:e.buffer,Ge=``;function Ke(){return new TransformStream({transform(e,t){(function(e,t){Me&&e.data instanceof Blob?e.data.arrayBuffer().then(Le).then(t):Ne&&(e.data instanceof ArrayBuffer||Pe(e.data))?t(Le(e.data)):Fe(e,!1,(e=>{Re||=new TextEncoder,t(Re.encode(e))}))})(e,(n=>{let r=n.length,i;if(r<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,r);else if(r<65536){i=new Uint8Array(3);let e=new DataView(i.buffer);e.setUint8(0,126),e.setUint16(1,r)}else{i=new Uint8Array(9);let e=new DataView(i.buffer);e.setUint8(0,127),e.setBigUint64(1,BigInt(r))}e.data&&typeof e.data!=`string`&&(i[0]|=128),t.enqueue(i),t.enqueue(n)}))}})}var qe;function Je(e){return e.reduce(((e,t)=>e+t.length),0)}function Ye(e,t){if(e[0].length===t)return e.shift();let n=new Uint8Array(t),r=0;for(let i=0;i<t;i++)n[i]=e[0][r++],r===e[0].length&&(e.shift(),r=0);return e.length&&r<e[0].length&&(e[0]=e[0].slice(r)),n}function R(e){if(e)return function(e){for(var t in R.prototype)e[t]=R.prototype[t];return e}(e)}R.prototype.on=R.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks[`$`+e]=this._callbacks[`$`+e]||[]).push(t),this},R.prototype.once=function(e,t){function n(){this.off(e,n),t.apply(this,arguments)}return n.fn=t,this.on(e,n),this},R.prototype.off=R.prototype.removeListener=R.prototype.removeAllListeners=R.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n,r=this._callbacks[`$`+e];if(!r)return this;if(arguments.length==1)return delete this._callbacks[`$`+e],this;for(var i=0;i<r.length;i++)if((n=r[i])===t||n.fn===t){r.splice(i,1);break}return r.length===0&&delete this._callbacks[`$`+e],this},R.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=Array(arguments.length-1),n=this._callbacks[`$`+e],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(n){r=0;for(var i=(n=n.slice(0)).length;r<i;++r)n[r].apply(this,t)}return this},R.prototype.emitReserved=R.prototype.emit,R.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks[`$`+e]||[]},R.prototype.hasListeners=function(e){return!!this.listeners(e).length};var z=typeof self<`u`?self:typeof window<`u`?window:Function(`return this`)();function Xe(e,...t){return t.reduce(((t,n)=>(e.hasOwnProperty(n)&&(t[n]=e[n]),t)),{})}var Ze=z.setTimeout,Qe=z.clearTimeout;function $e(e,t){t.useNativeTimers?(e.setTimeoutFn=Ze.bind(z),e.clearTimeoutFn=Qe.bind(z)):(e.setTimeoutFn=z.setTimeout.bind(z),e.clearTimeoutFn=z.clearTimeout.bind(z))}var et=class extends Error{constructor(e,t,n){super(e),this.description=t,this.context=n,this.type=`TransportError`}},tt=class extends R{constructor(e){super(),this.writable=!1,$e(this,e),this.opts=e,this.query=e.query,this.socket=e.socket}onError(e,t,n){return super.emitReserved(`error`,new et(e,t,n)),this}open(){return this.readyState=`opening`,this.doOpen(),this}close(){return this.readyState!==`opening`&&this.readyState!==`open`||(this.doClose(),this.onClose()),this}send(e){this.readyState===`open`&&this.write(e)}onOpen(){this.readyState=`open`,this.writable=!0,super.emitReserved(`open`)}onData(e){let t=He(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved(`packet`,e)}onClose(e){this.readyState=`closed`,super.emitReserved(`close`,e)}pause(e){}createUri(e,t={}){return e+`://`+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){let e=this.opts.hostname;return e.indexOf(`:`)===-1?e:`[`+e+`]`}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port!==443)||!this.opts.secure&&Number(this.opts.port)!==80)?`:`+this.opts.port:``}_query(e){let t=function(e){let t=``;for(let n in e)e.hasOwnProperty(n)&&(t.length&&(t+=`&`),t+=encodeURIComponent(n)+`=`+encodeURIComponent(e[n]));return t}(e);return t.length?`?`+t:``}},nt=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_`.split(``),rt=64,it={},at,ot=0,st=0;function ct(e){let t=``;do t=nt[e%rt]+t,e=Math.floor(e/rt);while(e>0);return t}function lt(){let e=ct(+new Date);return e===at?e+`.`+ct(ot++):(ot=0,at=e)}for(;st<rt;st++)it[nt[st]]=st;var ut=!1;try{ut=typeof XMLHttpRequest<`u`&&`withCredentials`in new XMLHttpRequest}catch{}var dt=ut;function ft(e){let t=e.xdomain;try{if(typeof XMLHttpRequest<`u`&&(!t||dt))return new XMLHttpRequest}catch{}if(!t)try{return new z[[`Active`,`Object`].join(`X`)](`Microsoft.XMLHTTP`)}catch{}}function pt(){}var mt=new ft({xdomain:!1}).responseType!=null,B=class e extends R{constructor(e,t){super(),$e(this,t),this.opts=t,this.method=t.method||`GET`,this.uri=e,this.data=t.data===void 0?null:t.data,this.create()}create(){var t;let n=Xe(this.opts,`agent`,`pfx`,`key`,`passphrase`,`cert`,`ca`,`ciphers`,`rejectUnauthorized`,`autoUnref`);n.xdomain=!!this.opts.xd;let r=this.xhr=new ft(n);try{r.open(this.method,this.uri,!0);try{if(this.opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let e in this.opts.extraHeaders)this.opts.extraHeaders.hasOwnProperty(e)&&r.setRequestHeader(e,this.opts.extraHeaders[e])}}catch{}if(this.method===`POST`)try{r.setRequestHeader(`Content-type`,`text/plain;charset=UTF-8`)}catch{}try{r.setRequestHeader(`Accept`,`*/*`)}catch{}(t=this.opts.cookieJar)==null||t.addCookies(r),`withCredentials`in r&&(r.withCredentials=this.opts.withCredentials),this.opts.requestTimeout&&(r.timeout=this.opts.requestTimeout),r.onreadystatechange=()=>{var e;r.readyState===3&&((e=this.opts.cookieJar)==null||e.parseCookies(r)),r.readyState===4&&(r.status===200||r.status===1223?this.onLoad():this.setTimeoutFn((()=>{this.onError(typeof r.status==`number`?r.status:0)}),0))},r.send(this.data)}catch(e){this.setTimeoutFn((()=>{this.onError(e)}),0);return}typeof document<`u`&&(this.index=e.requestsCount++,e.requests[this.index]=this)}onError(e){this.emitReserved(`error`,e,this.xhr),this.cleanup(!0)}cleanup(t){if(this.xhr!==void 0&&this.xhr!==null){if(this.xhr.onreadystatechange=pt,t)try{this.xhr.abort()}catch{}typeof document<`u`&&delete e.requests[this.index],this.xhr=null}}onLoad(){let e=this.xhr.responseText;e!==null&&(this.emitReserved(`data`,e),this.emitReserved(`success`),this.cleanup())}abort(){this.cleanup()}};B.requestsCount=0,B.requests={},typeof document<`u`&&(typeof attachEvent==`function`?attachEvent(`onunload`,ht):typeof addEventListener==`function`&&addEventListener(`onpagehide`in z?`pagehide`:`unload`,ht,!1));function ht(){for(let e in B.requests)B.requests.hasOwnProperty(e)&&B.requests[e].abort()}var gt=typeof Promise==`function`&&typeof Promise.resolve==`function`?e=>Promise.resolve().then(e):(e,t)=>t(e,0),_t=z.WebSocket||z.MozWebSocket,vt=typeof navigator<`u`&&typeof navigator.product==`string`&&navigator.product.toLowerCase()===`reactnative`,yt={websocket:class extends tt{constructor(e){super(e),this.supportsBinary=!e.forceBase64}get name(){return`websocket`}doOpen(){if(!this.check())return;let e=this.uri(),t=this.opts.protocols,n=vt?{}:Xe(this.opts,`agent`,`perMessageDeflate`,`pfx`,`key`,`passphrase`,`cert`,`ca`,`ciphers`,`rejectUnauthorized`,`localAddress`,`protocolVersion`,`origin`,`maxPayload`,`family`,`checkServerIdentity`);this.opts.extraHeaders&&(n.headers=this.opts.extraHeaders);try{this.ws=vt?new _t(e,t,n):t?new _t(e,t):new _t(e)}catch(e){return this.emitReserved(`error`,e)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:`websocket connection closed`,context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError(`websocket error`,e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){let n=e[t],r=t===e.length-1;Fe(n,this.supportsBinary,(e=>{try{this.ws.send(e)}catch{}r&&gt((()=>{this.writable=!0,this.emitReserved(`drain`)}),this.setTimeoutFn)}))}}doClose(){this.ws!==void 0&&(this.ws.close(),this.ws=null)}uri(){let e=this.opts.secure?`wss`:`ws`,t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=lt()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}check(){return!!_t}},webtransport:class extends tt{get name(){return`webtransport`}doOpen(){typeof WebTransport==`function`&&(this.transport=new WebTransport(this.createUri(`https`),this.opts.transportOptions[this.name]),this.transport.closed.then((()=>{this.onClose()})).catch((e=>{this.onError(`webtransport error`,e)})),this.transport.ready.then((()=>{this.transport.createBidirectionalStream().then((e=>{let t=function(e,t){qe||=new TextDecoder;let n=[],r=0,i=-1,a=!1;return new TransformStream({transform(o,s){for(n.push(o);;){if(r===0){if(Je(n)<1)break;let e=Ye(n,1);a=(128&e[0])==128,i=127&e[0],r=i<126?3:i===126?1:2}else if(r===1){if(Je(n)<2)break;let e=Ye(n,2);i=new DataView(e.buffer,e.byteOffset,e.length).getUint16(0),r=3}else if(r===2){if(Je(n)<8)break;let e=Ye(n,8),t=new DataView(e.buffer,e.byteOffset,e.length),a=t.getUint32(0);if(a>2**21-1){s.enqueue(je);break}i=a*2**32+t.getUint32(4),r=3}else{if(Je(n)<i)break;let e=Ye(n,i);s.enqueue(He(a?e:qe.decode(e),t)),r=0}if(i===0||i>e){s.enqueue(je);break}}}})}(2**53-1,this.socket.binaryType),n=e.readable.pipeThrough(t).getReader(),r=Ke();r.readable.pipeTo(e.writable),this.writer=r.writable.getWriter();let i=()=>{n.read().then((({done:e,value:t})=>{e||(this.onPacket(t),i())})).catch((e=>{}))};i();let a={type:`open`};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this.writer.write(a).then((()=>this.onOpen()))}))})))}write(e){this.writable=!1;for(let t=0;t<e.length;t++){let n=e[t],r=t===e.length-1;this.writer.write(n).then((()=>{r&&gt((()=>{this.writable=!0,this.emitReserved(`drain`)}),this.setTimeoutFn)}))}}doClose(){var e;(e=this.transport)==null||e.close()}},polling:class extends tt{constructor(e){if(super(e),this.polling=!1,typeof location<`u`){let t=location.protocol===`https:`,n=location.port;n||=t?`443`:`80`,this.xd=typeof location<`u`&&e.hostname!==location.hostname||n!==e.port}let t=e&&e.forceBase64;this.supportsBinary=mt&&!t,this.opts.withCredentials&&(this.cookieJar=void 0)}get name(){return`polling`}doOpen(){this.poll()}pause(e){this.readyState=`pausing`;let t=()=>{this.readyState=`paused`,e()};if(this.polling||!this.writable){let e=0;this.polling&&(e++,this.once(`pollComplete`,(function(){--e||t()}))),this.writable||(e++,this.once(`drain`,(function(){--e||t()})))}else t()}poll(){this.polling=!0,this.doPoll(),this.emitReserved(`poll`)}onData(e){((e,t)=>{let n=e.split(Ge),r=[];for(let e=0;e<n.length;e++){let i=He(n[e],t);if(r.push(i),i.type===`error`)break}return r})(e,this.socket.binaryType).forEach((e=>{if(this.readyState===`opening`&&e.type===`open`&&this.onOpen(),e.type===`close`)return this.onClose({description:`transport closed by the server`}),!1;this.onPacket(e)})),this.readyState!==`closed`&&(this.polling=!1,this.emitReserved(`pollComplete`),this.readyState===`open`&&this.poll())}doClose(){let e=()=>{this.write([{type:`close`}])};this.readyState===`open`?e():this.once(`open`,e)}write(e){this.writable=!1,((e,t)=>{let n=e.length,r=Array(n),i=0;e.forEach(((e,a)=>{Fe(e,!1,(e=>{r[a]=e,++i===n&&t(r.join(Ge))}))}))})(e,(e=>{this.doWrite(e,(()=>{this.writable=!0,this.emitReserved(`drain`)}))}))}uri(){let e=this.opts.secure?`https`:`http`,t=this.query||{};return!1!==this.opts.timestampRequests&&(t[this.opts.timestampParam]=lt()),this.supportsBinary||t.sid||(t.b64=1),this.createUri(e,t)}request(e={}){return Object.assign(e,{xd:this.xd,cookieJar:this.cookieJar},this.opts),new B(this.uri(),e)}doWrite(e,t){let n=this.request({method:`POST`,data:e});n.on(`success`,t),n.on(`error`,((e,t)=>{this.onError(`xhr post error`,e,t)}))}doPoll(){let e=this.request();e.on(`data`,this.onData.bind(this)),e.on(`error`,((e,t)=>{this.onError(`xhr poll error`,e,t)})),this.pollXhr=e}}},bt=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,xt=[`source`,`protocol`,`authority`,`userInfo`,`user`,`password`,`host`,`port`,`relative`,`path`,`directory`,`file`,`query`,`anchor`];function St(e){let t=e,n=e.indexOf(`[`),r=e.indexOf(`]`);n!=-1&&r!=-1&&(e=e.substring(0,n)+e.substring(n,r).replace(/:/g,`;`)+e.substring(r,e.length));let i=bt.exec(e||``),a={},o=14;for(;o--;)a[xt[o]]=i[o]||``;return n!=-1&&r!=-1&&(a.source=t,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,`:`),a.authority=a.authority.replace(`[`,``).replace(`]`,``).replace(/;/g,`:`),a.ipv6uri=!0),a.pathNames=function(e,t){let n=t.replace(/\/{2,9}/g,`/`).split(`/`);return t.slice(0,1)!=`/`&&t.length!==0||n.splice(0,1),t.slice(-1)==`/`&&n.splice(n.length-1,1),n}(0,a.path),a.queryKey=function(e,t){let n={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,(function(e,t,r){t&&(n[t]=r)})),n}(0,a.query),a}var Ct=class e extends R{constructor(e,t={}){super(),this.binaryType=`arraybuffer`,this.writeBuffer=[],e&&typeof e==`object`&&(t=e,e=null),e?(e=St(e),t.hostname=e.host,t.secure=e.protocol===`https`||e.protocol===`wss`,t.port=e.port,e.query&&(t.query=e.query)):t.host&&(t.hostname=St(t.host).host),$e(this,t),this.secure=t.secure==null?typeof location<`u`&&location.protocol===`https:`:t.secure,t.hostname&&!t.port&&(t.port=this.secure?`443`:`80`),this.hostname=t.hostname||(typeof location<`u`?location.hostname:`localhost`),this.port=t.port||(typeof location<`u`&&location.port?location.port:this.secure?`443`:`80`),this.transports=t.transports||[`polling`,`websocket`,`webtransport`],this.writeBuffer=[],this.prevBufferLen=0,this.opts=Object.assign({path:`/engine.io`,agent:!1,withCredentials:!1,upgrade:!0,timestampParam:`t`,rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,``)+(this.opts.addTrailingSlash?`/`:``),typeof this.opts.query==`string`&&(this.opts.query=function(e){let t={},n=e.split(`&`);for(let e=0,r=n.length;e<r;e++){let r=n[e].split(`=`);t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}(this.opts.query)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingTimeoutTimer=null,typeof addEventListener==`function`&&(this.opts.closeOnBeforeunload&&(this.beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener(`beforeunload`,this.beforeunloadEventListener,!1)),this.hostname!==`localhost`&&(this.offlineEventListener=()=>{this.onClose(`transport close`,{description:`network connection lost`})},addEventListener(`offline`,this.offlineEventListener,!1))),this.open()}createTransport(e){let t=Object.assign({},this.opts.query);t.EIO=4,t.transport=e,this.id&&(t.sid=this.id);let n=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new yt[e](n)}open(){let t;if(this.opts.rememberUpgrade&&e.priorWebsocketSuccess&&this.transports.indexOf(`websocket`)!==-1)t=`websocket`;else{if(this.transports.length===0)return void this.setTimeoutFn((()=>{this.emitReserved(`error`,`No transports available`)}),0);t=this.transports[0]}this.readyState=`opening`;try{t=this.createTransport(t)}catch{this.transports.shift(),this.open();return}t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on(`drain`,this.onDrain.bind(this)).on(`packet`,this.onPacket.bind(this)).on(`error`,this.onError.bind(this)).on(`close`,(e=>this.onClose(`transport close`,e)))}probe(t){let n=this.createTransport(t),r=!1;e.priorWebsocketSuccess=!1;let i=()=>{r||(n.send([{type:`ping`,data:`probe`}]),n.once(`packet`,(t=>{if(!r)if(t.type===`pong`&&t.data===`probe`){if(this.upgrading=!0,this.emitReserved(`upgrading`,n),!n)return;e.priorWebsocketSuccess=n.name===`websocket`,this.transport.pause((()=>{r||this.readyState!==`closed`&&(u(),this.setTransport(n),n.send([{type:`upgrade`}]),this.emitReserved(`upgrade`,n),n=null,this.upgrading=!1,this.flush())}))}else{let e=Error(`probe error`);e.transport=n.name,this.emitReserved(`upgradeError`,e)}})))};function a(){r||(r=!0,u(),n.close(),n=null)}let o=e=>{let t=Error(`probe error: `+e);t.transport=n.name,a(),this.emitReserved(`upgradeError`,t)};function s(){o(`transport closed`)}function c(){o(`socket closed`)}function l(e){n&&e.name!==n.name&&a()}let u=()=>{n.removeListener(`open`,i),n.removeListener(`error`,o),n.removeListener(`close`,s),this.off(`close`,c),this.off(`upgrading`,l)};n.once(`open`,i),n.once(`error`,o),n.once(`close`,s),this.once(`close`,c),this.once(`upgrading`,l),this.upgrades.indexOf(`webtransport`)!==-1&&t!==`webtransport`?this.setTimeoutFn((()=>{r||n.open()}),200):n.open()}onOpen(){if(this.readyState=`open`,e.priorWebsocketSuccess=this.transport.name===`websocket`,this.emitReserved(`open`),this.flush(),this.readyState===`open`&&this.opts.upgrade){let e=0,t=this.upgrades.length;for(;e<t;e++)this.probe(this.upgrades[e])}}onPacket(e){if(this.readyState===`opening`||this.readyState===`open`||this.readyState===`closing`)switch(this.emitReserved(`packet`,e),this.emitReserved(`heartbeat`),this.resetPingTimeout(),e.type){case`open`:this.onHandshake(JSON.parse(e.data));break;case`ping`:this.sendPacket(`pong`),this.emitReserved(`ping`),this.emitReserved(`pong`);break;case`error`:let t=Error(`server error`);t.code=e.data,this.onError(t);break;case`message`:this.emitReserved(`data`,e.data),this.emitReserved(`message`,e.data)}}onHandshake(e){this.emitReserved(`handshake`,e),this.id=e.sid,this.transport.query.sid=e.sid,this.upgrades=this.filterUpgrades(e.upgrades),this.pingInterval=e.pingInterval,this.pingTimeout=e.pingTimeout,this.maxPayload=e.maxPayload,this.onOpen(),this.readyState!==`closed`&&this.resetPingTimeout()}resetPingTimeout(){this.clearTimeoutFn(this.pingTimeoutTimer),this.pingTimeoutTimer=this.setTimeoutFn((()=>{this.onClose(`ping timeout`)}),this.pingInterval+this.pingTimeout),this.opts.autoUnref&&this.pingTimeoutTimer.unref()}onDrain(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved(`drain`):this.flush()}flush(){if(this.readyState!==`closed`&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){let e=this.getWritablePackets();this.transport.send(e),this.prevBufferLen=e.length,this.emitReserved(`flush`)}}getWritablePackets(){if(!(this.maxPayload&&this.transport.name===`polling`&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let n=0;n<this.writeBuffer.length;n++){let r=this.writeBuffer[n].data;if(r&&(e+=typeof(t=r)==`string`?function(e){let t=0,n=0;for(let r=0,i=e.length;r<i;r++)t=e.charCodeAt(r),t<128?n+=1:t<2048?n+=2:t<55296||t>=57344?n+=3:(r++,n+=4);return n}(t):Math.ceil(1.33*(t.byteLength||t.size))),n>0&&e>this.maxPayload)return this.writeBuffer.slice(0,n);e+=2}var t;return this.writeBuffer}write(e,t,n){return this.sendPacket(`message`,e,t,n),this}send(e,t,n){return this.sendPacket(`message`,e,t,n),this}sendPacket(e,t,n,r){if(typeof t==`function`&&(r=t,t=void 0),typeof n==`function`&&(r=n,n=null),this.readyState===`closing`||this.readyState===`closed`)return;(n||={}).compress=!1!==n.compress;let i={type:e,data:t,options:n};this.emitReserved(`packetCreate`,i),this.writeBuffer.push(i),r&&this.once(`flush`,r),this.flush()}close(){let e=()=>{this.onClose(`forced close`),this.transport.close()},t=()=>{this.off(`upgrade`,t),this.off(`upgradeError`,t),e()},n=()=>{this.once(`upgrade`,t),this.once(`upgradeError`,t)};return this.readyState!==`opening`&&this.readyState!==`open`||(this.readyState=`closing`,this.writeBuffer.length?this.once(`drain`,(()=>{this.upgrading?n():e()})):this.upgrading?n():e()),this}onError(t){e.priorWebsocketSuccess=!1,this.emitReserved(`error`,t),this.onClose(`transport error`,t)}onClose(e,t){this.readyState!==`opening`&&this.readyState!==`open`&&this.readyState!==`closing`||(this.clearTimeoutFn(this.pingTimeoutTimer),this.transport.removeAllListeners(`close`),this.transport.close(),this.transport.removeAllListeners(),typeof removeEventListener==`function`&&(removeEventListener(`beforeunload`,this.beforeunloadEventListener,!1),removeEventListener(`offline`,this.offlineEventListener,!1)),this.readyState=`closed`,this.id=null,this.emitReserved(`close`,e,t),this.writeBuffer=[],this.prevBufferLen=0)}filterUpgrades(e){let t=[],n=0,r=e.length;for(;n<r;n++)~this.transports.indexOf(e[n])&&t.push(e[n]);return t}};Ct.protocol=4;var wt=typeof ArrayBuffer==`function`,Tt=e=>typeof ArrayBuffer.isView==`function`?ArrayBuffer.isView(e):e.buffer instanceof ArrayBuffer,Et=Object.prototype.toString,Dt=typeof Blob==`function`||typeof Blob<`u`&&Et.call(Blob)===`[object BlobConstructor]`,Ot=typeof File==`function`||typeof File<`u`&&Et.call(File)===`[object FileConstructor]`;function kt(e){return wt&&(e instanceof ArrayBuffer||Tt(e))||Dt&&e instanceof Blob||Ot&&e instanceof File}function At(e,t){if(!e||typeof e!=`object`)return!1;if(Array.isArray(e)){for(let t=0,n=e.length;t<n;t++)if(At(e[t]))return!0;return!1}if(kt(e))return!0;if(e.toJSON&&typeof e.toJSON==`function`&&arguments.length===1)return At(e.toJSON(),!0);for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t)&&At(e[t]))return!0;return!1}function jt(e){let t=[],n=e.data,r=e;return r.data=Mt(n,t),r.attachments=t.length,{packet:r,buffers:t}}function Mt(e,t){if(!e)return e;if(kt(e)){let n={_placeholder:!0,num:t.length};return t.push(e),n}if(Array.isArray(e)){let n=Array(e.length);for(let r=0;r<e.length;r++)n[r]=Mt(e[r],t);return n}if(typeof e==`object`&&!(e instanceof Date)){let n={};for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=Mt(e[r],t));return n}return e}function Nt(e,t){return e.data=Pt(e.data,t),delete e.attachments,e}function Pt(e,t){if(!e)return e;if(e&&!0===e._placeholder){if(typeof e.num==`number`&&e.num>=0&&e.num<t.length)return t[e.num];throw Error(`illegal attachments`)}if(Array.isArray(e))for(let n=0;n<e.length;n++)e[n]=Pt(e[n],t);else if(typeof e==`object`)for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&(e[n]=Pt(e[n],t));return e}var Ft=[`connect`,`connect_error`,`disconnect`,`disconnecting`,`newListener`,`removeListener`],V;(function(e){e[e.CONNECT=0]=`CONNECT`,e[e.DISCONNECT=1]=`DISCONNECT`,e[e.EVENT=2]=`EVENT`,e[e.ACK=3]=`ACK`,e[e.CONNECT_ERROR=4]=`CONNECT_ERROR`,e[e.BINARY_EVENT=5]=`BINARY_EVENT`,e[e.BINARY_ACK=6]=`BINARY_ACK`})(V||={});function It(e){return Object.prototype.toString.call(e)===`[object Object]`}var Lt=class e extends R{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e==`string`){if(this.reconstructor)throw Error(`got plaintext data when reconstructing a packet`);t=this.decodeString(e);let n=t.type===V.BINARY_EVENT;n||t.type===V.BINARY_ACK?(t.type=n?V.EVENT:V.ACK,this.reconstructor=new Rt(t),t.attachments===0&&super.emitReserved(`decoded`,t)):super.emitReserved(`decoded`,t)}else{if(!kt(e)&&!e.base64)throw Error(`Unknown type: `+e);if(!this.reconstructor)throw Error(`got binary data when not reconstructing a packet`);t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved(`decoded`,t))}}decodeString(t){let n=0,r={type:Number(t.charAt(0))};if(V[r.type]===void 0)throw Error(`unknown packet type `+r.type);if(r.type===V.BINARY_EVENT||r.type===V.BINARY_ACK){let e=n+1;for(;t.charAt(++n)!==`-`&&n!=t.length;);let i=t.substring(e,n);if(i!=Number(i)||t.charAt(n)!==`-`)throw Error(`Illegal attachments`);r.attachments=Number(i)}if(t.charAt(n+1)===`/`){let e=n+1;for(;++n&&!(t.charAt(n)===`,`||n===t.length););r.nsp=t.substring(e,n)}else r.nsp=`/`;let i=t.charAt(n+1);if(i!==``&&Number(i)==i){let e=n+1;for(;++n;){let e=t.charAt(n);if(e==null||Number(e)!=e){--n;break}if(n===t.length)break}r.id=Number(t.substring(e,n+1))}if(t.charAt(++n)){let i=this.tryParse(t.substr(n));if(!e.isPayloadValid(r.type,i))throw Error(`invalid payload`);r.data=i}return r}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case V.CONNECT:return It(t);case V.DISCONNECT:return t===void 0;case V.CONNECT_ERROR:return typeof t==`string`||It(t);case V.EVENT:case V.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]==`number`||typeof t[0]==`string`&&Ft.indexOf(t[0])===-1);case V.ACK:case V.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&=(this.reconstructor.finishedReconstruction(),null)}},Rt=class{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){let e=Nt(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}},zt=Object.freeze({__proto__:null,protocol:5,get PacketType(){return V},Encoder:class{constructor(e){this.replacer=e}encode(e){return e.type!==V.EVENT&&e.type!==V.ACK||!At(e)?[this.encodeAsString(e)]:this.encodeAsBinary({type:e.type===V.EVENT?V.BINARY_EVENT:V.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id})}encodeAsString(e){let t=``+e.type;return e.type!==V.BINARY_EVENT&&e.type!==V.BINARY_ACK||(t+=e.attachments+`-`),e.nsp&&e.nsp!==`/`&&(t+=e.nsp+`,`),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){let t=jt(e),n=this.encodeAsString(t.packet),r=t.buffers;return r.unshift(n),r}},Decoder:Lt});function H(e,t,n){return e.on(t,n),function(){e.off(t,n)}}var Bt=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1}),Vt=class extends R{constructor(e,t,n){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,n&&n.auth&&(this.auth=n.auth),this._opts=Object.assign({},n),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;let e=this.io;this.subs=[H(e,`open`,this.onopen.bind(this)),H(e,`packet`,this.onpacket.bind(this)),H(e,`error`,this.onerror.bind(this)),H(e,`close`,this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected||(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState===`open`&&this.onopen()),this}open(){return this.connect()}send(...e){return e.unshift(`message`),this.emit.apply(this,e),this}emit(e,...t){if(Bt.hasOwnProperty(e))throw Error(`"`+e.toString()+`" is a reserved event name`);if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;let n={type:V.EVENT,data:t,options:{}};if(n.options.compress=!1!==this.flags.compress,typeof t[t.length-1]==`function`){let e=this.ids++,r=t.pop();this._registerAckCallback(e,r),n.id=e}let r=this.io.engine&&this.io.engine.transport&&this.io.engine.transport.writable;return this.flags.volatile&&(!r||!this.connected)||(this.connected?(this.notifyOutgoingListeners(n),this.packet(n)):this.sendBuffer.push(n)),this.flags={},this}_registerAckCallback(e,t){let n=this.flags.timeout??this._opts.ackTimeout;if(n===void 0)return void(this.acks[e]=t);let r=this.io.setTimeoutFn((()=>{delete this.acks[e];for(let t=0;t<this.sendBuffer.length;t++)this.sendBuffer[t].id===e&&this.sendBuffer.splice(t,1);t.call(this,Error(`operation has timed out`))}),n);this.acks[e]=(...e)=>{this.io.clearTimeoutFn(r),t.apply(this,[null,...e])}}emitWithAck(e,...t){let n=this.flags.timeout!==void 0||this._opts.ackTimeout!==void 0;return new Promise(((r,i)=>{t.push(((e,t)=>n?e?i(e):r(t):r(e))),this.emit(e,...t)}))}_addToQueue(e){let t;typeof e[e.length-1]==`function`&&(t=e.pop());let n={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push(((e,...r)=>{if(n===this._queue[0])return e===null?(this._queue.shift(),t&&t(null,...r)):n.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(e)),n.pending=!1,this._drainQueue()})),this._queue.push(n),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;let t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth==`function`?this.auth((e=>{this._sendConnectPacket(e)})):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:V.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved(`connect_error`,e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved(`disconnect`,e,t)}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case V.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved(`connect_error`,Error(`It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)`));break;case V.EVENT:case V.BINARY_EVENT:this.onevent(e);break;case V.ACK:case V.BINARY_ACK:this.onack(e);break;case V.DISCONNECT:this.ondisconnect();break;case V.CONNECT_ERROR:this.destroy();let t=Error(e.data.message);t.data=e.data.data,this.emitReserved(`connect_error`,t)}}onevent(e){let t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){let t=this._anyListeners.slice();for(let n of t)n.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]==`string`&&(this._lastOffset=e[e.length-1])}ack(e){let t=this,n=!1;return function(...r){n||(n=!0,t.packet({type:V.ACK,id:e,data:r}))}}onack(e){let t=this.acks[e.id];typeof t==`function`&&(t.apply(this,e.data),delete this.acks[e.id])}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this.emitReserved(`connect`),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach((e=>this.emitEvent(e))),this.receiveBuffer=[],this.sendBuffer.forEach((e=>{this.notifyOutgoingListeners(e),this.packet(e)})),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose(`io server disconnect`)}destroy(){this.subs&&=(this.subs.forEach((e=>e())),void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:V.DISCONNECT}),this.destroy(),this.connected&&this.onclose(`io client disconnect`),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){let t=this._anyListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){let t=this._anyOutgoingListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){let t=this._anyOutgoingListeners.slice();for(let n of t)n.apply(this,e.data)}}};function U(e){e||={},this.ms=e.min||100,this.max=e.max||1e4,this.factor=e.factor||2,this.jitter=e.jitter>0&&e.jitter<=1?e.jitter:0,this.attempts=0}U.prototype.duration=function(){var e=this.ms*this.factor**+this.attempts++;if(this.jitter){var t=Math.random(),n=Math.floor(t*this.jitter*e);e=1&Math.floor(10*t)?e+n:e-n}return 0|Math.min(e,this.max)},U.prototype.reset=function(){this.attempts=0},U.prototype.setMin=function(e){this.ms=e},U.prototype.setMax=function(e){this.max=e},U.prototype.setJitter=function(e){this.jitter=e};var Ht=class extends R{constructor(e,t){super(),this.nsps={},this.subs=[],e&&typeof e==`object`&&(t=e,e=void 0),(t||={}).path=t.path||`/socket.io`,this.opts=t,$e(this,t),this.reconnection(!1!==t.reconnection),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor(t.randomizationFactor??.5),this.backoff=new U({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState=`closed`,this.uri=e;let n=t.parser||zt;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=!1!==t.autoConnect,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)==null||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)==null||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)==null||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf(`open`))return this;this.engine=new Ct(this.uri,this.opts);let t=this.engine,n=this;this._readyState=`opening`,this.skipReconnect=!1;let r=H(t,`open`,(function(){n.onopen(),e&&e()})),i=t=>{this.cleanup(),this._readyState=`closed`,this.emitReserved(`error`,t),e?e(t):this.maybeReconnectOnOpen()},a=H(t,`error`,i);if(!1!==this._timeout){let e=this._timeout,n=this.setTimeoutFn((()=>{r(),i(Error(`timeout`)),t.close()}),e);this.opts.autoUnref&&n.unref(),this.subs.push((()=>{this.clearTimeoutFn(n)}))}return this.subs.push(r),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState=`open`,this.emitReserved(`open`);let e=this.engine;this.subs.push(H(e,`ping`,this.onping.bind(this)),H(e,`data`,this.ondata.bind(this)),H(e,`error`,this.onerror.bind(this)),H(e,`close`,this.onclose.bind(this)),H(this.decoder,`decoded`,this.ondecoded.bind(this)))}onping(){this.emitReserved(`ping`)}ondata(e){try{this.decoder.add(e)}catch(e){this.onclose(`parse error`,e)}}ondecoded(e){gt((()=>{this.emitReserved(`packet`,e)}),this.setTimeoutFn)}onerror(e){this.emitReserved(`error`,e)}socket(e,t){let n=this.nsps[e];return n?this._autoConnect&&!n.active&&n.connect():(n=new Vt(this,e,t),this.nsps[e]=n),n}_destroy(e){let t=Object.keys(this.nsps);for(let e of t)if(this.nsps[e].active)return;this._close()}_packet(e){let t=this.encoder.encode(e);for(let n=0;n<t.length;n++)this.engine.write(t[n],e.options)}cleanup(){this.subs.forEach((e=>e())),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose(`forced close`),this.engine&&this.engine.close()}disconnect(){return this._close()}onclose(e,t){this.cleanup(),this.backoff.reset(),this._readyState=`closed`,this.emitReserved(`close`,e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;let e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved(`reconnect_failed`),this._reconnecting=!1;else{let t=this.backoff.duration();this._reconnecting=!0;let n=this.setTimeoutFn((()=>{e.skipReconnect||(this.emitReserved(`reconnect_attempt`,e.backoff.attempts),e.skipReconnect||e.open((t=>{t?(e._reconnecting=!1,e.reconnect(),this.emitReserved(`reconnect_error`,t)):e.onreconnect()})))}),t);this.opts.autoUnref&&n.unref(),this.subs.push((()=>{this.clearTimeoutFn(n)}))}}onreconnect(){let e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved(`reconnect`,e)}},Ut={};function Wt(e,t){typeof e==`object`&&(t=e,e=void 0);let n=function(e,t=``,n){let r=e;n||=typeof location<`u`&&location,e??=n.protocol+`//`+n.host,typeof e==`string`&&(e.charAt(0)===`/`&&(e=e.charAt(1)===`/`?n.protocol+e:n.host+e),/^(https?|wss?):\/\//.test(e)||(e=n===void 0?`https://`+e:n.protocol+`//`+e),r=St(e)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port=`80`:/^(http|ws)s$/.test(r.protocol)&&(r.port=`443`)),r.path=r.path||`/`;let i=r.host.indexOf(`:`)===-1?r.host:`[`+r.host+`]`;return r.id=r.protocol+`://`+i+`:`+r.port+t,r.href=r.protocol+`://`+i+(n&&n.port===r.port?``:`:`+r.port),r}(e,(t||={}).path||`/socket.io`),r=n.source,i=n.id,a=n.path,o=Ut[i]&&a in Ut[i].nsps,s;return t.forceNew||t[`force new connection`]||!1===t.multiplex||o?s=new Ht(r,t):(Ut[i]||(Ut[i]=new Ht(r,t)),s=Ut[i]),n.query&&!t.query&&(t.query=n.queryKey),s.socket(n.path,t)}Object.assign(Wt,{Manager:Ht,Socket:Vt,io:Wt,connect:Wt});var W=class{constructor(e){this.readURL=e.readURL??e.read_url,this.writeURL=e.writeURL??e.write_url,this.metadataURL=e.metadataURL??e.metadata_url,this.name=e.name??e.fsentry_name,this.uid=e.uid??e.uuid??e.fsentry_uid??e.fsentry_id??e.fsentry_uuid??e.id,this.id=this.uid,this.uuid=this.uid,this.path=e.path??e.fsentry_path,this.size=e.size??e.fsentry_size,this.accessed=e.accessed??e.fsentry_accessed,this.modified=e.modified??e.fsentry_modified,this.created=e.created??e.fsentry_created,this.isDirectory=!!(e.isDirectory||e.is_dir||e.fsentry_is_dir);let t={};Object.defineProperty(this,"_internalProperties",{enumerable:!1,value:t}),t.signature=e.signature??new URL(this.writeURL??this.readURL).searchParams.get(`signature`),t.expires=e.expires??new URL(this.writeURL??this.readURL).searchParams.get(`expires`),Object.defineProperty(t,"file_signature",{get:()=>({read_url:this.readURL,write_url:this.writeURL,metadata_url:this.metadataURL,fsentry_accessed:this.accessed,fsentry_modified:this.modified,fsentry_created:this.created,fsentry_is_dir:this.isDirectory,fsentry_size:this.size,fsentry_name:this.name,path:this.path,uid:this.uid})})}write=async function(e){return puter.fs.write(this.path,new File([e],this.name),{overwrite:!0,dedupeName:!1})};watch=function(e){};open=function(e){};setAsWallpaper=function(e,t){};rename=function(e){return puter.fs.rename(this.uid,e)};move=function(e,t=!1,n){return puter.fs.move(this.path,e,t,n)};copy=function(e,t=!1,n=!1){return puter.fs.copy(this.path,e,t,n)};delete=function(){return puter.fs.delete(this.path)};versions=async function(){};trash=function(){};mkdir=async function(e,t=!1){if(!this.isDirectory)throw Error(`mkdir() can only be called on a directory`);return puter.fs.mkdir(u.join(this.path,e))};metadata=async function(){};readdir=async function(){if(!this.isDirectory)throw Error(`readdir() can only be called on a directory`);return puter.fs.readdir(this.path)};read=async function(){return puter.fs.read(this.path)}},Gt=e=>class{constructor(){this.form=new FormData,this.operations=[]}move(e,t,n){return this.operations.push({op:`move`,source:e,destination:t,new_name:n}),this}rm(...e){return this.delete(...e)}delete(...e){for(let t of e)this.operations.push({op:`delete`,path:t})}async send(){for(let e of this.operations)this.form.append(`operation`,JSON.stringify(e));return(await(await fetch(`${e.APIOrigin}/batch`,{headers:{Authorization:`Bearer ${e.authToken}`,...[`web`,`app`].includes(e.env)?{Origin:`https://puter.work`}:{}},method:`POST`,body:this.form})).json())?.results}},Kt=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{source:e[0],destination:e[1],overwrite:e[2]?.overwrite,new_name:e[2]?.newName||e[2]?.new_name,create_missing_parents:e[2]?.createMissingParents||e[2]?.create_missing_parents,new_metadata:e[2]?.newMetadata||e[2]?.new_metadata,original_client_socket_id:e[2]?.excludeSocketID||e[2]?.original_client_socket_id,success:e[3],error:e[4]},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}t.source=F(t.source),t.destination=F(t.destination);let r=j(`/copy`,this.APIOrigin,this.authToken);M(r,t.success,t.error,e,n),r.send(JSON.stringify({original_client_socket_id:this.socket.id,socket_id:this.socket.id,source:t.source,destination:t.destination,overwrite:t.overwrite,new_name:t.new_name||t.newName,dedupe_name:t.dedupe_name||t.dedupeName}))})},qt=async function(...e){let t;t=typeof e[0]==`object`&&e[0]!==null?e[0]:{paths:e[0],recursive:e[1]?.recursive??!0,descendantsOnly:e[1]?.descendantsOnly??!1};let n=t.paths;return typeof n==`string`&&(n=[n]),new Promise(async(e,r)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{r(`Authentication failed.`)}let i=j(`/delete`,this.APIOrigin,this.authToken);M(i,t.success,t.error,e,r),n=n.map(e=>F(e)),i.send(JSON.stringify({paths:n,descendants_only:(t.descendants_only||t.descendantsOnly)??!1,recursive:t.recursive??!0}))})},Jt=new Map,Yt=2e3,Xt=async function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{path:e[0],...typeof e[1]==`object`?e[1]:{},success:typeof e[1]==`object`?e[2]:e[1],error:typeof e[1]==`object`?e[3]:e[2]},new Promise(async(e,n)=>{t.consistency||=`strong`;let r;if(t.path&&(r=`item:${t.path}`),t.consistency===`eventual`&&!t.returnSubdomains&&!t.returnPermissions&&!t.returnVersions&&!t.returnSize){let t=await puter._cache.get(r);if(t){e(t);return}}let i=JSON.stringify({path:t.path,uid:t.uid,returnSubdomains:t.returnSubdomains||t.returnWorkers,returnPermissions:t.returnPermissions,returnVersions:t.returnVersions,returnSize:t.returnSize,consistency:t.consistency}),a=Jt.get(i),o=Date.now();if(a)if(o-a.timestamp<Yt){try{e(await a.promise)}catch(e){n(e)}return}else Jt.delete(i);let s=new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`);return}let i=j(`/stat`,this.APIOrigin,void 0,`post`,`text/plain;actually=json`);M(i,t.success,t.error,async t=>{JSON.stringify(t).length<=20*1024*1024&&puter._cache.set(r,t),e(t)},n);let a={};t.uid===void 0?t.path!==void 0&&(a.path=F(t.path)):a.uid=t.uid,a.return_subdomains=t.returnSubdomains||t.returnWorkers,a.return_permissions=t.returnPermissions,a.return_versions=t.returnVersions,a.return_size=t.returnSize,a.auth_token=this.authToken,i.send(JSON.stringify(a))});Jt.set(i,{promise:s,timestamp:o});try{let t=await s;Jt.delete(i),e(t)}catch(e){Jt.delete(i),n(e)}})},Zt=async function(e,t=`24h`){return new Promise(async(n,r)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{r(`Authentication failed.`)}try{let{uid:i,is_dir:a}=await Xt.call(this,e);if(a){r(`Cannot create readUrl for directory`);return}let o=j(`/auth/create-access-token`,this.APIOrigin,this.authToken);M(o,()=>{},()=>{},({token:e})=>{n(`${this.APIOrigin}/token-read?uid=${encodeURIComponent(i)}&token=${encodeURIComponent(e)}`)},r),o.send(JSON.stringify({expiresIn:t,permissions:[`fs:${i}:read`]}))}catch(e){r(e)}})},Qt=function(...e){let t={};return typeof e[0]==`string`&&typeof e[1]==`object`&&!(e[1]instanceof Function)||typeof e[0]==`object`&&e[0]!==null?typeof e[0]==`string`?(t.path=e[0],Object.assign(t,e[1]),t.success=e[2],t.error=e[3]):t=e[0]:typeof e[0]==`string`&&(t.path=e[0],t.success=e[1],t.error=e[2]),new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}let r=j(`/mkdir`,this.APIOrigin,this.authToken);M(r,t.success,t.error,e,n),t.path=F(t.path),r.send(JSON.stringify({parent:u.dirname(t.path),path:u.basename(t.path),overwrite:t.overwrite??!1,dedupe_name:(t.rename||t.dedupeName)??!1,shortcut_to:t.shortcutTo,original_client_socket_id:this.socket.id,create_missing_parents:(t.recursive||t.createMissingParents)??!1}))})},$t=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{source:e[0],destination:e[1],overwrite:e[2]?.overwrite,new_name:e[2]?.newName||e[2]?.new_name,create_missing_parents:e[2]?.createMissingParents||e[2]?.create_missing_parents,new_metadata:e[2]?.newMetadata||e[2]?.new_metadata,original_client_socket_id:e[2]?.excludeSocketID||e[2]?.original_client_socket_id},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}if(t.source=F(t.source),t.destination=F(t.destination),!t.new_name)try{if(!(await Xt.bind(this)(t.destination)).is_dir)throw`is not directory`}catch{t.new_name=u.basename(t.destination),t.destination=u.dirname(t.destination)}let r=j(`/move`,this.APIOrigin,this.authToken);M(r,t.success,t.error,e,n),r.send(JSON.stringify({source:t.source,destination:t.destination,overwrite:t.overwrite,new_name:t.new_name||t.newName,create_missing_parents:t.create_missing_parents||t.createMissingParents,new_metadata:t.new_metadata||t.newMetadata,original_client_socket_id:t.excludeSocketID}))})},en=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{path:typeof e[0]==`string`?e[0]:typeof e[0]==`object`&&e[0]!==null?e[0].path:e[0],...typeof e[1]==`object`?e[1]:{success:e[1],error:e[2]}},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}t.path=F(t.path);let r=j(`/read?${new URLSearchParams({file:t.path,...t.offset?{offset:t.offset}:{},...t.byte_count?{byte_count:t.byte_count}:{}}).toString()}`,this.APIOrigin,this.authToken,`get`,`application/json;charset=UTF-8`,`blob`);t.cache!==!0&&(r.setRequestHeader(`Cache-Control`,`no-cache`),r.setRequestHeader(`Pragma`,`no-cache`)),M(r,t.success,t.error,e,n),r.send()})},tn=new Map,nn=2e3,rn=async function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{path:e[0],success:e[1],error:e[2]},new Promise(async(e,n)=>{if(t.consistency||=`strong`,!t.path&&!t.uid)throw Error({code:`NO_PATH_OR_UID`,message:`Either path or uid must be provided.`});let r;if(t.path&&(r=`readdir:${t.path}`),t.consistency===`eventual`){let t=await puter._cache.get(r);if(t){e(t);return}}let i=JSON.stringify({path:t.path,uid:t.uid,no_thumbs:t.no_thumbs,no_assocs:t.no_assocs,no_subdomains:t.no_subdomains,consistency:t.consistency}),a=tn.get(i),o=Date.now();if(a)if(o-a.timestamp<nn){try{e(await a.promise)}catch(e){n(e)}return}else tn.delete(i);let s=new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`);return}let i=j(`/readdir`,this.APIOrigin,void 0,`post`,`text/plain;actually=json`);M(i,t.success,t.error,async t=>{JSON.stringify(t).length<=100*1024*1024&&puter._cache.set(r,t);for(let e of t)puter._cache.set(`item:${e.path}`,e);e(t)},n);let a={no_thumbs:t.no_thumbs,no_assocs:t.no_assocs,no_subdomains:t.no_subdomains,auth_token:this.authToken};t.uid?a.uid=t.uid:t.path&&(a.path=F(t.path)),i.send(JSON.stringify(a))});tn.set(i,{promise:s,timestamp:o});try{let t=await s;tn.delete(i),e(t)}catch(e){tn.delete(i),n(e)}})},an=async function(e){return new Promise(async(t,n)=>{if(!e||typeof e!=`object`){n(Error(`Options object is required`));return}if(!Array.isArray(e.directory_ids)||e.directory_ids.length===0){n(Error(`directory_ids must be a non-empty array`));return}if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(Error(`Authentication failed.`));return}let r=j(`/readdir-subdomains`,this.APIOrigin,void 0,`post`,`text/plain;actually=json`);M(r,e.success,e.error,async e=>{t(e)},n);let i={directory_ids:e.directory_ids,auth_token:this.authToken};r.send(JSON.stringify(i))})},on=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{path:e[0],new_name:e[1],success:e[2],error:e[3]},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}let r=j(`/rename`,this.APIOrigin,this.authToken);M(r,t.success,t.error,e,n);let i={original_client_socket_id:t.excludeSocketID||t.original_client_socket_id,new_name:t.new_name||t.newName};t.uid===void 0?t.path!==void 0&&(i.path=F(t.path)):i.uid=t.uid,r.send(JSON.stringify(i))})},sn=async function(e){return new Promise(async(t,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`);return}try{let r=j(`/auth/revoke-access-token`,this.APIOrigin,this.authToken);M(r,()=>{},()=>{},()=>t(),n),r.send(JSON.stringify({tokenOrUuid:typeof e==`string`?e.trim():String(e)}))}catch(e){n(e)}})},cn=function(...e){let t;return t={app_uid:e[0],items:e[1],success:e[2],error:e[3]},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}let r=t.items;Array.isArray(r)||(r=[r]);let i=j(`/sign`,this.APIOrigin,this.authToken);i.addEventListener(`load`,async function(i){let a=await ae(this);if(this.status!==200)return t.error&&typeof t.error==`function`&&t.error(a),n(a);{let n=a,i,o=n.token;if(r.length==1)i={...n.signatures[0]};else{let e=[];for(let t=0;t<n.signatures.length;t++)e.push({...n.signatures[t]});i=e}return t.success&&typeof t.success==`function`&&t.success({token:o,items:i}),e({token:o,items:i})}}),i.upload.addEventListener(`progress`,function(e){}),i.addEventListener(`error`,function(e){return ue(t.error,n,this)}),i.send(JSON.stringify({app_uid:t.app_uid,items:r}))})},ln=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]},new Promise(async(e,n)=>{if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{n(`Authentication failed.`)}let r=j(`/df`,this.APIOrigin,this.authToken);M(r,t.success,t.error,e,n),r.send()})},un=2*1024*1024,dn=128,fn=32,pn=`signedBatchWriteSupported`,mn=500,hn=4,gn=8,_n=8,vn=new Set([404,405,501]),yn=[`web`,`gui`,`app`],bn=e=>{if(!e)return!1;if(e.type&&e.type.startsWith(`image/`))return!0;let t=(e.name||``).toLowerCase();return[`.png`,`.jpg`,`.jpeg`,`.gif`,`.bmp`,`.webp`,`.tiff`,`.avif`,`.jfif`].some(e=>t.endsWith(e))},xn=e=>{if(!e)return 0;let t=e.indexOf(`,`),n=t===-1?e:e.slice(t+1);return Math.ceil(n.length*3/4)},Sn=e=>typeof e==`string`&&e.startsWith(`data:`),Cn=e=>{if(!Sn(e))return;let t=e.indexOf(`,`),[n]=(t===-1?e.slice(5):e.slice(5,t)).split(`;`);return(n?n.trim():``)||`application/octet-stream`},wn=async e=>{let t=await fetch(e);if(!t.ok)throw Error(`Failed to read thumbnail data URL`);return await t.blob()},Tn=e=>{if(!(typeof e!=`string`||e.length===0)&&!(Sn(e)&&xn(e)>un))return e},En=(e,t,n)=>{let r=Math.min(1,n/(Math.max(e,t)||1));return{width:Math.max(1,Math.round(e*r)),height:Math.max(1,Math.round(t*r))}},Dn=e=>new Promise((t,n)=>{if(typeof document>`u`||typeof URL>`u`||typeof Image>`u`)return t(null);let r=URL.createObjectURL(e),i=new Image;i.onload=()=>{URL.revokeObjectURL(r),t(i)},i.onerror=e=>{URL.revokeObjectURL(r),n(e)},i.src=r}),On=(e,t,n,r)=>{if(!e||typeof document>`u`)return null;let{width:i,height:a}=En(e.naturalWidth||e.width,e.naturalHeight||e.height,t),o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`);if(!s)return null;s.drawImage(e,0,0,i,a);try{return o.toDataURL(n,r)}catch{return null}},kn=async e=>{try{if(typeof document>`u`||typeof File>`u`||!(e instanceof File)||!bn(e))return;let t=await Dn(e);if(!t)return;let n=dn,r=[{type:`image/webp`,quality:.85},{type:`image/jpeg`,quality:.8},{type:`image/png`}];for(;n>=fn;){for(let{type:e,quality:i}of r){let r=On(t,n,e,i);if(r&&xn(r)<=un)return r}n=Math.floor(n/2)}}catch{return}},An=async e=>{let t=await e.text();if(!t)return null;try{return JSON.parse(t)}catch{return t}},jn=e=>{let t={Authorization:`Bearer ${e}`,"Content-Type":`application/json`};return[`web`,`app`].includes(puter.env)&&(t.Origin=`https://puter.work`),t},Mn=(e,t,n)=>{let r=t&&typeof t==`object`?t:null,i=r?.message??(typeof r?.error==`string`?r.error:r?.error?.message)??(typeof t==`string`&&t.length>0?t:null)??n??`Request failed with status ${e.status}`,a=Error(i);return a.status=e.status,a.body=t,typeof r?.code==`string`&&r.code.length>0?a.code=r.code:typeof r?.errorCode==`string`&&r.errorCode.length>0&&(a.code=r.errorCode),a},G=async(e,t,n,r)=>{let i=await fetch(`${e}${n}`,{method:`POST`,headers:jn(t),credentials:`include`,body:JSON.stringify(r)}),a=await An(i);if(!i.ok)throw Mn(i,a,`Failed request to ${n}`);return a},Nn=e=>{if(!e||typeof e!=`object`)return!1;if(e.signedBatchUnavailable===!0)return!0;let t=e.body&&typeof e.body==`object`?e.body:null;return typeof t?.code==`string`&&t.code.length>0||typeof t?.errorCode==`string`&&t.errorCode.length>0?!1:vn.has(e.status)},Pn=e=>{if(e&&typeof e==`object`){if(typeof e.message==`string`&&e.message.length>0)return e.message;if(typeof e.body==`string`&&e.body.length>0)return e.body;if(e.body&&typeof e.body==`object`){if(typeof e.body.message==`string`&&e.body.message.length>0)return e.body.message;if(e.body.error&&typeof e.body.error==`object`&&typeof e.body.error.message==`string`&&e.body.error.message.length>0)return e.body.error.message}}return String(e)},Fn=(e,t)=>{if(!t||typeof t!=`object`)return;if(t.type===`directory`)return t.directoryPath;if(t.type!==`file`||!t.file)return;let n=t.file;return n.puter_full_path??u.join(e,n.filepath||n.name||``)},K=(e,t)=>{let n=[];if(!Array.isArray(e)||e.length===0)return n;let r=Math.max(1,Number(t)||1);for(let t=0;t<e.length;t+=r)n.push(e.slice(t,t+r));return n},In=async({url:e,blob:t,contentType:n,onProgress:r,onRequestCreated:i,onRequestCompleted:a})=>await new Promise((o,s)=>{let c=new XMLHttpRequest;c.open(`PUT`,e,!0),c.withCredentials=!1,n&&c.setRequestHeader(`Content-Type`,n),i&&i(c);let l=0;c.upload.addEventListener(`progress`,e=>{if(!r||!e.lengthComputable)return;let t=Math.max(0,e.loaded-l);l=e.loaded,t>0&&r(t)}),c.onload=()=>{if(a&&a(c),t.size>l&&r&&r(t.size-l),c.status>=200&&c.status<300){o({etag:c.getResponseHeader(`etag`)??c.getResponseHeader(`ETag`)});return}let e=Error(`Signed upload failed with status ${c.status}`);e.status=c.status,s(e)},c.onerror=()=>{a&&a(c);let e=Error(`Network error during signed upload`);e.status=c.status,s(e)},c.onabort=()=>{a&&a(c);let e=Error(`Signed upload aborted`);e.aborted=!0,s(e)},c.send(t)}),Ln=async function(e,t,n={}){return new Promise(async(r,i)=>{let a=globalThis.DataTransfer||class{},o=globalThis.FileList||class{},s=globalThis.DataTransferItemList||class{};if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch(e){i(e)}let c=e=>((e?.code===`NOT_ENOUGH_SPACE`||e?.status===413||e?.code===`storage_limit_reached`)&&(puter.env===`app`?puter.ui.requestUpgrade():A(`Not enough storage space available.<br>Please upgrade to continue.`)),n.error&&typeof n.error==`function`&&n.error(e),i(e)),l=new XMLHttpRequest;if(t===`/`)return c(`Can not upload to root directory.`);t=F(t);let d=oe(),f=!1;n.init&&typeof n.init==`function`&&n.init(d,l);let p=0,m=0,h,g=0,_=0;if(Array.isArray(e)&&e.length>0)for(let t=0;t<e.length;t++)e[t]instanceof a||e[t]instanceof s;if(e instanceof s||e instanceof a||e[0]instanceof a||n.parsedDataTransferItems)h=n.parsedDataTransferItems?e:await puter.ui.getEntriesFromDataTransferItems(e),h.sort((e,t)=>e.isDirectory&&!t.isDirectory?-1:!e.isDirectory&&t.isDirectory?1:e.isDirectory&&t.isDirectory?0:e.size-t.size);else if(e instanceof File||e[0]instanceof File||e instanceof o||e[0]instanceof o){h=Array.isArray(e)?e:e instanceof o?Array.from(e):[e],h.sort((e,t)=>e.size-t.size);for(let e=0;e<h.length;e++)h[e].filepath=h[e].name,h[e].fullPath=h[e].name}else if(e instanceof Blob){h=[new File([e],n.name,{type:`application/octet-stream`})];for(let e=0;e<h.length;e++)h[e].filepath=h[e].name,h[e].fullPath=h[e].name}else if(typeof e==`string`){h=[new File([e],`default.txt`,{type:`text/plain`})];for(let e=0;e<h.length;e++)h[e].filepath=h[e].name,h[e].fullPath=h[e].name}else return c({code:`field_invalid`,message:`upload() items parameter is an invalid type`});let v=[],y={},b=[];for(let e=0;e<h.length;e++)if(h[e]){if(h[e].isDirectory){let n=h[e].finalPath?h[e].finalPath:h[e].fullPath,r=typeof n==`string`?n.replace(/^\/+/,``):``;v.push({path:u.join(t,r)})}else{let r=h[e].finalPath||h[e].filepath||h[e].fullPath||h[e].name;typeof r==`string`&&(r=r.replace(/^\/+/,``));let[i,a]=[r?.slice(0,r?.lastIndexOf(`/`)),r?.slice(r?.lastIndexOf(`/`)+1)];if((typeof a==`string`?a.trim().toLowerCase():``)===`.ds_store`)continue;if(a!==``){let n=r||h[e].name;h[e].puter_full_path=u.join(t,n),b.push(h[e])}if(n.createFileParent&&r.includes(`/`)){let e;i.split(`/`).forEach(n=>{e=e?`${e}/${n}`:n;let r=u.join(t,e);y[r]||(y[r]=!0,v.push({path:r}))})}}h[e].size!==void 0&&(g+=h[e].size,_++)}if(v.length===0&&b.length===0)return c({code:`EMPTY_UPLOAD`,message:`No files or directories to upload.`});let x=[],S=n.generateThumbnails||n.thumbnailGenerator;if(b.length&&S){let e=n.thumbnailGenerator||kn;x=await Promise.all(b.map(async t=>{try{return await e(t)}catch{return}}))}let C;if(puter.env!==`web`)try{if(C=await this.space(),C.capacity-C.used<g)return c({code:`NOT_ENOUGH_SPACE`,message:`Not enough storage space available.`})}catch{}let w=v.map(e=>e.path),T=this[pn]!==!1;if(yn.includes(puter.env)&&!n.shortcutTo&&(b.length>0||w.length>0)&&T){let e=n.overwrite??!1,a=!!(n.createMissingAncestors||n.createMissingParents||n.createFileParent||v.length>0),o=g>0?g:1,s=0,p=new Set,m=new Set,h=!1,_=()=>{let e=(s/o*100).toFixed(2);e=e>100?100:e,n.progress&&typeof n.progress==`function`&&n.progress(d,e)},y=e=>{e<=0||(s+=e,_())},S=async()=>{if(m.size===0)return;let e=Array.from(m);await Promise.all(e.map(async e=>{try{await G(this.APIOrigin,this.authToken,`/fs/abortWrite`,{uploadId:e})}catch{}})),m.clear()},C=async()=>{if(!h){h=!0;for(let e of p)try{e.abort()}catch{}await S(),n.abort&&typeof n.abort==`function`&&n.abort(d)}};l.abort=()=>{C()};try{let i=[];for(let e=0;e<w.length;e++)i.push({type:`directory`,directoryPath:w[e],itemUploadId:`dir_${e}`});for(let e=0;e<b.length;e++)i.push({type:`file`,file:b[e],fileIndex:e,thumbnailData:Tn(x[e]??n.thumbnail??void 0),itemUploadId:String(e)});let c=i.reduce((e,t)=>t.type!==`file`||!Sn(t.thumbnailData)?e:e+xn(t.thumbnailData),0),l=g+c;o=l>0?l:1;let _=i.map(r=>{if(r.type===`directory`)return{fileMetadata:{path:r.directoryPath,size:0,contentType:`application/x-puter-directory`,overwrite:e,createMissingParents:a},directory:!0,guiMetadata:{operationId:d,itemUploadId:r.itemUploadId,socketId:this.socket.id,originalClientSocketId:this.socket.id}};let i=r.file;return{fileMetadata:{path:i.puter_full_path??u.join(t,i.filepath||i.name),size:i.size,contentType:i.type||`application/octet-stream`,overwrite:e,dedupeName:e?!1:n.dedupeName??!0,createMissingParents:a,app_uid:n.appUID},...Sn(r.thumbnailData)?{thumbnailMetadata:{contentType:Cn(r.thumbnailData),size:xn(r.thumbnailData)}}:{},guiMetadata:{operationId:d,itemUploadId:r.itemUploadId,socketId:this.socket.id,originalClientSocketId:this.socket.id}}});n.start&&typeof n.start==`function`&&(n.start(),f=!0);let v=new Map,S=[],C=[],T=K(_,mn),E=K(i,mn),D=K(i.map((e,t)=>t),mn);if(T.length!==E.length||T.length!==D.length)throw Error(`Signed batch request chunk mapping is invalid`);let O=async e=>{let{requestIndex:t,requestItem:n,startResponse:r}=e,i=n.file,a=n.thumbnailData,o;if(Sn(a)){let e=r.thumbnailUploadUrl,t=r.thumbnailUrl;if(e&&t){let n=await wn(a);n.size<=un&&(await In({url:e,blob:n,contentType:n.type||Cn(a),onProgress:y,onRequestCreated:e=>{p.add(e)},onRequestCompleted:e=>{p.delete(e)}}),o=t)}}else typeof a==`string`&&a.length>0&&(o=a);if(r.uploadMode===`multipart`){let e=Number(r.multipartPartSize)||Math.max(i.size,1),a=Number(r.multipartPartCount),s=Math.max(1,Math.ceil(i.size/e)),c=Number.isInteger(a)&&a>0?a:s,l=new Map,u=Array.isArray(r.multipartPartUrls)?r.multipartPartUrls:[];for(let e of u)e?.partNumber&&e?.url&&l.set(Number(e.partNumber),e.url);let f=[];for(let e=1;e<=c;e++)l.has(e)||f.push(e);if(f.length>0){let e=await G(this.APIOrigin,this.authToken,`/fs/signMultipartParts`,{uploadId:r.sessionId,partNumbers:f}),t=Array.isArray(e?.multipartPartUrls)?e.multipartPartUrls:[];for(let e of t)e?.partNumber&&e?.url&&l.set(Number(e.partNumber),e.url)}let m=[],h=[];for(let e=1;e<=c;e++)h.push(e);let g=K(h,_n);for(let t of g){let n=await Promise.allSettled(t.map(async t=>{let n=l.get(t);if(!n)throw Error(`Missing signed multipart URL for part ${t}`);let a=(t-1)*e,o=Math.min(a+e,i.size),s=await In({url:n,blob:i.slice(a,o),contentType:r.contentType||i.type||`application/octet-stream`,onProgress:y,onRequestCreated:e=>{p.add(e)},onRequestCompleted:e=>{p.delete(e)}});if(!s.etag)throw Error(`Missing ETag for multipart part ${t}`);return{partNumber:t,etag:s.etag}}));for(let e of n){if(e.status===`rejected`)throw e.reason;m.push(e.value)}}return m.sort((e,t)=>e.partNumber-t.partNumber),{requestIndex:t,completionItem:{uploadId:r.sessionId,parts:m,...o===void 0?{}:{thumbnailData:o},guiMetadata:{operationId:d,itemUploadId:n.itemUploadId,socketId:this.socket.id,originalClientSocketId:this.socket.id}}}}if(!r.url)throw Error(`Signed upload URL is missing`);return await In({url:r.url,blob:i,contentType:r.contentType||i.type||`application/octet-stream`,onProgress:y,onRequestCreated:e=>{p.add(e)},onRequestCompleted:e=>{p.delete(e)}}),{requestIndex:t,completionItem:{uploadId:r.sessionId,...o===void 0?{}:{thumbnailData:o},guiMetadata:{operationId:d,itemUploadId:n.itemUploadId,socketId:this.socket.id,originalClientSocketId:this.socket.id}}}},k=async e=>{if(h){let e=Error(`Signed upload aborted`);throw e.aborted=!0,e}let t=T[e],n=E[e],r=D[e];if(!t||!n||!r)throw Error(`Missing signed batch request chunk`);let i=await G(this.APIOrigin,this.authToken,`/fs/startBatchWrite`,t);if(!Array.isArray(i)){let e=Error(`Signed batch start response is invalid`);throw e.signedBatchUnavailable=!0,e}if(i.length!==t.length)throw Error(`Signed batch start response count mismatch`);let a=[];for(let e=0;e<i.length;e++){let t=r[e],o=n[e],s=i[e];if(t===void 0||!o||!s)throw Error(`Missing batch signed upload metadata`);if(o.type===`directory`){v.set(t,s.fsEntry??s);continue}if(!s.sessionId)throw Error(`Signed batch response missing sessionId`);m.add(s.sessionId),a.push({requestIndex:t,requestItem:o,startResponse:s})}let o=[],s=[],c=K(a,gn);for(let e of c){if(h){let e=Error(`Signed upload aborted`);throw e.aborted=!0,e}let t=await Promise.allSettled(e.map(async e=>await O(e)));for(let n=0;n<t.length;n++){let r=t[n];if(r?.status===`rejected`){let t=e[n];t&&s.push({requestIndex:t.requestIndex,uploadId:t.startResponse.sessionId,error:r.reason});continue}o.push(r.value)}}if(s.length>0){let e=Array.from(new Set(s.map(e=>e.uploadId)));await Promise.allSettled(e.map(async e=>{m.delete(e),await G(this.APIOrigin,this.authToken,`/fs/abortWrite`,{uploadId:e})})),S.push(...s)}if(o.length===0)return;o.sort((e,t)=>e.requestIndex-t.requestIndex);let l=o.map(e=>e.completionItem),u=o.map(e=>e.requestIndex),d=K(l,mn),f=K(u,mn);if(d.length!==f.length)throw Error(`Signed batch completion request mapping is invalid`);let p=[];for(let e=0;e<d.length;e++){if(h){let e=Error(`Signed upload aborted`);throw e.aborted=!0,e}let t=d[e],n=f[e];if(!t||!n)throw Error(`Missing signed batch completion request chunk`);try{let e=await G(this.APIOrigin,this.authToken,`/fs/completeBatchWrite`,t);if(!Array.isArray(e))throw Error(`Signed batch completion response is invalid`);if(e.length!==t.length)throw Error(`Signed batch completion response count mismatch`);for(let r=0;r<e.length;r++){let i=e[r],a=n[r],o=t[r];if(a===void 0)throw Error(`Missing request index for completed signed batch response`);o?.uploadId&&m.delete(o.uploadId),v.set(a,i?.fsEntry??i)}}catch(e){let r=await Promise.allSettled(t.map(async e=>await G(this.APIOrigin,this.authToken,`/fs/completeWrite`,e)));for(let i=0;i<r.length;i++){let a=r[i],o=n[i],s=t[i];if(!(o===void 0||!s)){if(a?.status===`fulfilled`){m.delete(s.uploadId),v.set(o,a.value?.fsEntry??a.value);continue}p.push({requestIndex:o,uploadId:s.uploadId,error:a?.status===`rejected`?a.reason:e})}}}}if(p.length>0){let e=Array.from(new Set(p.map(e=>e.uploadId)));await Promise.allSettled(e.map(async e=>{m.delete(e),await G(this.APIOrigin,this.authToken,`/fs/abortWrite`,{uploadId:e})})),C.push(...p)}},ee=K(T.map((e,t)=>t),hn);for(let e of ee){let t=await Promise.allSettled(e.map(async e=>{await k(e)}));for(let e of t)if(e.status===`rejected`)throw e.reason}this[pn]=!0;let te=[...S.map(e=>({...e,stage:`upload`})),...C.map(e=>({...e,stage:`complete`}))];if(te.length>0){let e=Error(`One or more signed batch file operations failed`),n=te.map(e=>{let n=i[e.requestIndex],r=Fn(t,n);return{requestIndex:e.requestIndex,uploadId:e.uploadId,stage:e.stage,path:r,name:typeof r==`string`&&r.length>0?u.basename(r):void 0,message:Pn(e.error)}});throw e.partial=!0,e.failedItems=n,e.failedPaths=n.map(e=>e.path).filter(e=>typeof e==`string`&&e.length>0),e.completedItemCount=v.size,e.totalItemCount=i.length,e}let ne=[];for(let e=0;e<i.length;e++){if(!v.has(e))throw Error(`Missing signed batch response item at index ${e}`);ne.push(v.get(e))}y(Math.max(0,o-s));let A=ne;return A=A.length===1?A[0]:A,n.success&&typeof n.success==`function`&&n.success(A),r(A)}catch(e){if(h||e?.aborted)return i(e);let t=Nn(e);Nn(e)&&(this[pn]=!1);try{await S()}catch{}if(t)delete l.abort;else return c(e)}}g*=2;let E=new FormData;v.sort((e,t)=>t.path.length-e.path.length);let D=[];for(let e=0;e<v.length;e++){for(let n=0;n<b.length;n++)!b[n].puter_path_param&&u.join(t,b[n].filepath).startsWith(`${v[e].path}/`)&&(b[n].puter_path_param=`$dir_${e}/${u.basename(b[n].filepath)}`);for(let t=0;t<v.length;t++)!v[t].puter_path_param&&v[t].path.startsWith(`${v[e].path}/`)&&(v[t].puter_path_param=`$dir_${e}/${u.basename(v[t].path)}`)}for(let e=0;e<v.length;e++){let t=u.dirname(v[e].puter_path_param||v[e].path),r=v[e].puter_path_param||v[e].path;t!==`/`&&(r=r.replace(t,``)),D.push({op:`mkdir`,parent:t,path:r,overwrite:n.overwrite??!1,dedupe_name:n.dedupeName??!0,create_missing_ancestors:n.createMissingAncestors??!0,as:`dir_${e}`})}D.reverse(),E.append(`operation_id`,d),E.append(`socket_id`,this.socket.id),E.append(`original_client_socket_id`,this.socket.id);for(let e=0;e<D.length;e++)E.append(`operation`,JSON.stringify(D[e]));if(!n.shortcutTo)for(let e=0;e<b.length;e++){let t=Tn(x[e]??n.thumbnail??void 0),r={name:b[e].name,type:b[e].type,size:b[e].size};t&&(r.thumbnail=t),E.append(`fileinfo`,JSON.stringify({...r}))}for(let e=0;e<b.length;e++){let r=Tn(x[e]??n.thumbnail??void 0),i={op:n.shortcutTo?`shortcut`:`write`,dedupe_name:n.dedupeName??!0,overwrite:n.overwrite??!1,thumbnail:r,create_missing_ancestors:n.createMissingAncestors||n.createMissingParents,operation_id:d,path:b[e].puter_path_param&&u.dirname(b[e].puter_path_param??``)||b[e].filepath&&u.join(t,u.dirname(b[e].filepath))||``,name:u.basename(b[e].filepath),item_upload_id:e,shortcut_to:n.shortcutTo,shortcut_to_uid:n.shortcutTo,app_uid:n.appUID};r===void 0&&delete i.thumbnail,E.append(`operation`,JSON.stringify(i))}if(!n.shortcutTo)for(let e=0;e<b.length;e++)E.append(`file`,b[e]??``);let O=e=>{e.operation_id===d&&(m+=e.loaded_diff)};this.socket.on(`upload.progress`,O);let k=null;l.open(`post`,`${this.APIOrigin}/batch`,!0),l.withCredentials=!0,l.setRequestHeader(`Authorization`,`Bearer ${this.authToken}`),l.upload.addEventListener(`progress`,function(e){let t;k===null?(t=e.loaded,k=0):t=e.loaded-k,k+=t,p+=t;let r=((m+p)/g*100).toFixed(2);r=r>100?100:r,n.progress&&typeof n.progress==`function`&&n.progress(d,r)});let ee=setInterval(function(){let e=((m+p)/g*100).toFixed(2);e=e>100?100:e,n.progress&&typeof n.progress==`function`&&n.progress(d,e)},100);l.onabort=()=>{clearInterval(ee),this.socket.off(`upload.progress`,O),n.abort&&typeof n.abort==`function`&&n.abort(d)},l.onreadystatechange=async e=>{if(l.readyState===4){let e=await ae(l);if(l.status>=400&&l.status<600||n.strict&&l.status===218){if(clearInterval(ee),this.socket.off(`upload.progress`,O),n.strict&&l.status===218){let t;for(let n=0;n<e.results?.length;n++)if(e.results[n].status!==200){t=e.results[n];break}return c(t)}return c(e)}else{(!e||!e.results||e.results.length===0)&&puter.debugMode&&console.log(`no results`);let t=e.results;return t=t.length===1?t[0]:t,n.success&&typeof n.success==`function`&&n.success(t),clearInterval(ee),this.socket.off(`upload.progress`,O),r(t)}}},!f&&n.start&&typeof n.start==`function`&&(n.start(),f=!0),l.send(E)})},Rn=async function(e,t,n={}){if(!e)throw Error({code:`NO_TARGET_PATH`,message:`No target path provided.`});e instanceof File&&t===void 0&&(t=e,e=t.name),n.strict=!0,n.overwrite=n.overwrite??!0,n.overwrite&&n.dedupeName===void 0&&(n.dedupeName=!1),e=F(e);let r=u.basename(e),i=u.dirname(e);if(typeof t==`string`?t=new File([t??``],r??`Untitled.txt`,{type:`text/plain`}):t instanceof Blob?t=new File([t??``],r??`Untitled`,{type:t.type}):(t instanceof ArrayBuffer||ArrayBuffer.isView(t))&&(t=new File([t],r??`Untitled`,{type:`application/octet-stream`})),t||=new File([t??``],r),!(t instanceof File))throw Error({code:`field_invalid`,message:`write() data parameter is an invalid type`});return this.upload(t,i,n)},zn=`last_valid_ts`,Bn=class{space=ln;mkdir=Qt;copy=Kt;rename=on;upload=Ln;read=en;delete=qt;move=$t;write=Rn;sign=cn;getReadURL=Zt;revokeReadURL=sn;readdir=rn;readdirSubdomains=an;stat=Xt;FSItem=W;constructor(e){this.puter=e,this.Batch=Gt(e),this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID,this.cacheUpdateTimer=null,this.initializeSocket();let t={};Object.defineProperty(t,"authToken",{get:()=>this.authToken}),Object.defineProperty(t,"APIOrigin",{get:()=>this.APIOrigin})}initializeSocket(){this.socket&&this.socket.disconnect(),this.socket=Wt(this.APIOrigin,{auth:{auth_token:this.authToken},autoUnref:this.shouldUseSocketAutoUnref(),transports:[`websocket`,`polling`],withCredentials:!0}),this.bindSocketEvents()}shouldUseSocketAutoUnref(){if(this.puter.env!==`nodejs`)return!1;let e=globalThis.WebSocket;if(typeof e!=`function`)return!1;let t=e.prototype??{};return typeof t.on==`function`&&typeof t.removeListener==`function`}bindSocketEvents(){this.socket.on(`item.renamed`,e=>{puter._cache.flushall()}),this.socket.on(`item.removed`,e=>{puter._cache.flushall()}),this.socket.on(`item.added`,e=>{puter._cache.del(`readdir:${u.dirname(e.path)}`),puter._cache.del(`item:${u.dirname(e.path)}`)}),this.socket.on(`item.updated`,e=>{puter._cache.flushall()}),this.socket.on(`item.moved`,e=>{puter._cache.flushall()}),this.socket.on(`connect`,()=>{puter.debugMode&&console.log(`FileSystem Socket: Connected`,this.socket.id)}),this.socket.on(`disconnect`,()=>{puter.debugMode&&console.log(`FileSystem Socket: Disconnected`)}),this.socket.on(`reconnect`,e=>{puter.debugMode&&console.log(`FileSystem Socket: Reconnected`,this.socket.id)}),this.socket.on(`reconnect_attempt`,e=>{puter.debugMode&&console.log(`FileSystem Socket: Reconnection Attemps`,e)}),this.socket.on(`reconnect_error`,e=>{puter.debugMode&&console.log(`FileSystem Socket: Reconnection Error`,e)}),this.socket.on(`reconnect_failed`,()=>{puter.debugMode&&console.log(`FileSystem Socket: Reconnection Failed`)}),this.socket.on(`error`,e=>{puter.debugMode&&console.error(`FileSystem Socket Error:`,e)})}setAuthToken(e){this.authToken=e,this.puter.env===`gui`&&(this.checkCacheAndPurge(),this.startCacheUpdateTimer()),this.initializeSocket()}setAPIOrigin(e){this.APIOrigin=e,this.initializeSocket()}invalidateCache(){localStorage.setItem(zn,`0`),puter._cache.flushall()}async getCacheTimestamp(){return new Promise((e,t)=>{let n=j(`/cache/last-change-timestamp`,this.APIOrigin,this.authToken,`get`,`application/json`);M(n,void 0,void 0,async n=>{try{e((typeof n==`string`?JSON.parse(n):n).timestamp||Date.now())}catch{t(Error(`Failed to parse response`))}},t),n.send()})}async checkCacheAndPurge(){try{await this.getCacheTimestamp()-(parseInt(localStorage.getItem(zn))||0)>2e3&&(puter._cache.flushall(),localStorage.setItem(zn,`0`))}catch(e){console.error(`Error checking cache timestamp:`,e)}}startCacheUpdateTimer(){this.puter.env===`gui`&&(this.cacheUpdateTimer=setInterval(()=>{localStorage.setItem(zn,Date.now().toString())},1e3))}stopCacheUpdateTimer(){this.cacheUpdateTimer&&=(clearInterval(this.cacheUpdateTimer),null)}},Vn=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}list=async(...e)=>(await N([],`puter-subdomains`,void 0,`select`)(...e)).filter(e=>!e.subdomain.startsWith(`workers.puter.`));create=async(...e)=>{let t={};return typeof e[0]==`string`&&e.length===1?(e[0].match(/^[a-z0-9]+\.puter\.(site|com)$/)&&(e[0]=e[0].split(`.`)[0]),t={object:{subdomain:e[0]}}):Array.isArray(e)&&e.length===2&&typeof e[0]==`string`?(e[0].match(/^[a-z0-9]+\.puter\.(site|com)$/)&&(e[0]=e[0].split(`.`)[0]),e[1]&&=F(e[1]),t={object:{subdomain:e[0],root_dir:e[1]}}):typeof e[0]==`object`&&(t={object:e[0]}),await N([`object`],`puter-subdomains`,void 0,`create`).call(this,t)};update=async(...e)=>{let t={};return Array.isArray(e)&&typeof e[0]==`string`&&(e[0].match(/^[a-z0-9]+\.puter\.(site|com)$/)&&(e[0]=e[0].split(`.`)[0]),e[1]&&=F(e[1]),t={id:{subdomain:e[0]},object:{root_dir:e[1]??null}}),await N([`object`],`puter-subdomains`,void 0,`update`).call(this,t)};get=async(...e)=>{let t={};return Array.isArray(e)&&typeof e[0]==`string`&&(e[0].match(/^[a-z0-9]+\.puter\.(site|com)$/)&&(e[0]=e[0].split(`.`)[0]),t={id:{subdomain:e[0]}}),N([`uid`],`puter-subdomains`,void 0,`read`).call(this,t)};delete=async(...e)=>{let t={};return Array.isArray(e)&&typeof e[0]==`string`&&(e[0].match(/^[a-z0-9]+\.puter\.(site|com)$/)&&(e[0]=e[0].split(`.`)[0]),t={id:{subdomain:e[0]}}),N([`uid`],`puter-subdomains`,void 0,`delete`).call(this,t)}},Hn=()=>{let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}},Un=[`has_set_default_app_user_permissions`,`window_sidebar_width`,`sidebar_items`,`menubar_style`,`user_preferences.auto_arrange_desktop`,`user_preferences.show_hidden_files`,`user_preferences.language`,`user_preferences.clock_visible`,`toolbar_auto_hide_enabled`,`has_seen_welcome_window`,`desktop_item_positions`,`desktop_icons_hidden`,`taskbar_position`,`has_seen_toolbar_animation`],q=e=>typeof e==`object`&&!!e&&!Array.isArray(e),Wn=e=>q(e)&&Object.prototype.hasOwnProperty.call(e,`appUuid`),Gn=e=>q(e)&&Object.prototype.hasOwnProperty.call(e,`key`),Kn=class{MAX_KEY_SIZE=1024;MAX_VALUE_SIZE=399*1024;constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID,this.gui_cached=Hn(),this.gui_cache_init=Hn(),(async()=>{await this.gui_cache_init.promise,this.gui_cache_init=null;let e=await(await fetch(`${this.APIOrigin}/drivers/call`,{method:`POST`,headers:{"Content-Type":`text/plain;actually=json`},body:JSON.stringify({interface:`puter-kvstore`,method:`get`,args:{key:Un},auth_token:this.authToken})})).json();if(!Array.isArray(e?.result)){this.gui_cached.resolve({}),setTimeout(()=>{this.gui_cached=null},4e3);return}let t={};for(let n=0;n<Un.length;n++)t[Un[n]]=e.result[n];this.gui_cached.resolve(t),setTimeout(()=>{this.gui_cached=null},4e3)})()}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}set=async(...e)=>{if(Array.isArray(e[0])){let t=e[0],n=e.slice(1),r,i,a;return n[0]===void 0&&n.shift(),q(n[0])&&(r=n.shift()),typeof n[0]==`function`&&(i=n.shift()),typeof n[0]==`function`&&(a=n.shift()),await this.setBatch_({items:t,optConfig:r,success:i,error:a})}if(e.length===1&&q(e[0]))return Array.isArray(e[0].items)?await this.setBatch_(e[0]):await this.set_(e[0]);let t=e[0],n=e[1],r=e.slice(2),i,a,o,s;return(typeof r[0]==`number`||r[0]===null)&&(i=r.shift()),r[0]===void 0&&r.shift(),q(r[0])&&(a=r.shift()),typeof r[0]==`function`&&(o=r.shift()),typeof r[0]==`function`&&(s=r.shift()),await this.set_({key:t,value:n,expireAt:i,optConfig:a,success:o,error:s})};set_=N([`key`,`value`,`expireAt`],`puter-kvstore`,void 0,`set`,{preprocess:e=>{if(e.key===void 0||e.key===null)throw{message:`Key cannot be undefined`,code:`key_undefined`};if(e.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};if(e.value&&e.value.length>this.MAX_VALUE_SIZE)throw{message:`Value size cannot be larger than ${this.MAX_VALUE_SIZE}`,code:`value_too_large`};return e}});setBatch_=N([`items`],`puter-kvstore`,void 0,`batchPut`,{preprocess:e=>{if(!Array.isArray(e.items)||e.items.length===0)throw{message:`Items are required`,code:`items_required`};let t=e.items.map(e=>{if(!Gn(e))throw{message:`Each item must include a key`,code:`invalid_item`};let t=String(e.key);if(t.length===0)throw{message:`Key cannot be undefined`,code:`key_undefined`};if(t.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};if(e.value&&e.value.length>this.MAX_VALUE_SIZE)throw{message:`Value size cannot be larger than ${this.MAX_VALUE_SIZE}`,code:`value_too_large`};return{key:t,value:e.value,...e.expireAt===void 0?{}:{expireAt:e.expireAt}}});return{...e,items:t}}});async get(...e){if(e.length===1&&q(e[0]))return await this.get_(e[0]);let t=e[0],n,r,i;return q(e[1])?(n=e[1],r=e[2],i=e[3]):(r=e[1],i=e[2]),typeof t==`string`&&Un.includes(t)&&!n&&this.gui_cached!==null?(this.gui_cache_init&&this.gui_cache_init.resolve(),(await this.gui_cached.promise)[t]):await this.get_({key:t,optConfig:n,success:r,error:i})}get_=N([`key`],`puter-kvstore`,void 0,`get`,{preprocess:e=>{if(e.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return e},transform:e=>e});incr=async(...e)=>{let t={};if(e.length===1&&q(e[0]))t={...e[0]};else{if(!e||e.length===0)throw{message:`Arguments are required`,code:`arguments_required`};t.key=e[0];let n=e[1],r=e[2];Wn(n)&&r===void 0&&(r=n,n=void 0),t.pathAndAmountMap=n?typeof n==`number`?{"":n}:n:{"":1},t.optConfig=r}if(t.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return N([`key`],`puter-kvstore`,void 0,`incr`).call(this,t)};decr=async(...e)=>{let t={};if(e.length===1&&q(e[0]))t={...e[0]};else{if(!e||e.length===0)throw{message:`Arguments are required`,code:`arguments_required`};t.key=e[0];let n=e[1],r=e[2];Wn(n)&&r===void 0&&(r=n,n=void 0),t.pathAndAmountMap=n?typeof n==`number`?{"":n}:n:{"":1},t.optConfig=r}if(t.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return N([`key`],`puter-kvstore`,void 0,`decr`).call(this,t)};add=async(...e)=>{let t={};if(e.length===1&&q(e[0]))t={...e[0]};else{if(!e||e.length===0)throw{message:`Arguments are required`,code:`arguments_required`};t.key=e[0];let n=e[1],r=e[2];Wn(n)&&r===void 0&&(r=n,n=void 0),t.pathAndValueMap=n===void 0?{"":1}:n&&typeof n==`object`&&!Array.isArray(n)?n:{"":n},t.optConfig=r}if(t.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return N([`key`],`puter-kvstore`,void 0,`add`).call(this,t)};remove=async(...e)=>{if(!e||e.length<2)throw{message:`At least one path is required`,code:`arguments_required`};let t=e[0],n=e.slice(1),r;if(q(n[n.length-1])&&(r=n.pop()),Array.isArray(n[0])&&n.length===1)throw{message:`Paths must be provided as separate arguments`,code:`paths_invalid`};if(t==null)throw{message:`Key cannot be undefined`,code:`key_undefined`};if(t.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};if(n.length===0)throw{message:`At least one path is required`,code:`arguments_required`};if(n.some(e=>typeof e!=`string`))throw{message:`All paths must be strings`,code:`paths_invalid`};return N([`key`,`paths`],`puter-kvstore`,void 0,`remove`).call(this,{key:t,paths:n,optConfig:r})};update=async(...e)=>{if(e.length===1&&q(e[0]))return await this.update_(e[0]);let t=e[0],n=e[1],r,i,a,o,s=e.slice(2);return(typeof s[0]==`number`||s[0]===null)&&(r=s.shift()),s[0]===void 0&&s.shift(),q(s[0])&&(i=s.shift()),typeof s[0]==`function`&&(a=s.shift()),typeof s[0]==`function`&&(o=s.shift()),await this.update_({key:t,pathAndValueMap:n,ttl:r,optConfig:i,success:a,error:o})};update_=N([`key`,`pathAndValueMap`,`ttl`],`puter-kvstore`,void 0,`update`,{preprocess:e=>{if(e.key===void 0||e.key===null)throw{message:`Key cannot be undefined`,code:`key_undefined`};if(e.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};if(e.pathAndValueMap===void 0||e.pathAndValueMap===null||Array.isArray(e.pathAndValueMap)||typeof e.pathAndValueMap!=`object`)throw{message:`pathAndValueMap must be an object`,code:`path_map_invalid`};if(Object.keys(e.pathAndValueMap).length===0)throw{message:`pathAndValueMap cannot be empty`,code:`path_map_invalid`};if(e.ttl!==void 0&&e.ttl!==null){let t=Number(e.ttl);if(Number.isNaN(t))throw{message:`ttl must be a number`,code:`ttl_invalid`};e.ttl=t}return e}});expire=async(e,t,n)=>{let r={};if(r.key=e,r.ttl=t,r.optConfig=n,r.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return N([`key`,`ttl`],`puter-kvstore`,void 0,`expire`).call(this,r)};expireAt=async(e,t,n)=>{let r={};if(r.key=e,r.timestamp=t,r.optConfig=n,r.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return N([`key`,`timestamp`],`puter-kvstore`,void 0,`expireAt`).call(this,r)};del=async(...e)=>{if(e.length===1&&q(e[0]))return await this.del_(e[0]);let t=e[0],n,r,i;return q(e[1])?(n=e[1],r=e[2],i=e[3]):(r=e[1],i=e[2]),await this.del_({key:t,optConfig:n,success:r,error:i})};del_=N([`key`],`puter-kvstore`,void 0,`del`,{preprocess:e=>{if(e.key.length>this.MAX_KEY_SIZE)throw{message:`Key size cannot be larger than ${this.MAX_KEY_SIZE}`,code:`key_too_large`};return e}});list=async(...e)=>{let t={},n,r=!1;if(e.length===1&&e[0]&&typeof e[0]==`object`&&!Array.isArray(e[0])){let i=e[0];typeof i.pattern==`string`&&(n=i.pattern),r=!!i.returnValues,q(i.optConfig)?t.optConfig=i.optConfig:Wn(i)&&(t.optConfig=i),i.limit!==void 0&&(t.limit=i.limit),i.cursor!==void 0&&(t.cursor=i.cursor)}else q(e[1])&&(t.optConfig=e[1]),q(e[2])&&(t.optConfig=e[2]),(e&&e.length===1&&e[0]===!0||e&&e.length===2&&e[1]===!0)&&(r=!0),e&&e.length===3&&e[1]===!0&&(r=!0),(e&&e.length===1&&typeof e[0]==`string`||e&&e.length===2&&typeof e[0]==`string`&&e[1]===!0)&&(n=e[0]),e&&e.length===2&&typeof e[0]==`string`&&q(e[1])&&(n=e[0]),e&&e.length===3&&typeof e[0]==`string`&&e[1]===!0&&(n=e[0]);r||(t.as=`keys`);let i=qn(n);return i&&(t.pattern=i),N([],`puter-kvstore`,void 0,`list`).call(this,t)};flush=async(...e)=>{if(e.length===1&&q(e[0])){let t=e[0];return Object.prototype.hasOwnProperty.call(t,`optConfig`)||Object.prototype.hasOwnProperty.call(t,`success`)||Object.prototype.hasOwnProperty.call(t,`error`)?await this.flush_(t):await this.flush_({optConfig:t})}let t,n,r;return q(e[0])?(t=e[0],n=e[1],r=e[2]):(n=e[0],r=e[1]),await this.flush_({optConfig:t,success:n,error:r})};flush_=N([],`puter-kvstore`,void 0,`flush`);clear=this.flush};function qn(e){if(typeof e!=`string`)return;let t=e.trim();if(t!==``){if(t.endsWith(`*`)){let e=t.slice(0,-1);return e===``?void 0:e}return t}}var Jn=class{#e;#t;constructor(e){this.#e=e,this.#t=(()=>{let e=new Map;for(let t of this.#e)e[t]=[];return e})()}emit(e,t){if(!this.#e.includes(e)){console.error(`Event name '${e}' not supported`);return}this.#t[e].forEach(e=>{e(t)})}on(e,t){if(!this.#e.includes(e)){console.error(`Event name '${e}' not supported`);return}return this.#t[e].push(t),this}off(e,t){if(!this.#e.includes(e)){console.error(`Event name '${e}' not supported`);return}let n=this.#t[e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),this}},Yn=new TextDecoder,Xn=new TextEncoder,Zn={1:`Reason unspecified or unknown. Returning a more specific reason should be preferred.`,3:`Unexpected stream closure due to a network error.`,65:`Stream creation failed due to invalid information. This could be sent if the destination was a reserved address or the port is invalid.`,66:`Stream creation failed due to an unreachable destination host. This could be sent if the destination is an domain which does not resolve to anything.`,67:`Stream creation timed out due to the destination server not responding.`,68:`Stream creation failed due to the destination server refusing the connection.`,71:`TCP data transfer timed out.`,72:`Stream destination address/domain is intentionally blocked by the proxy server.`,73:`Connection throttled by the server.`};function Qn(e){let t=new DataView(e.buffer,e.byteOffset),n=t.getUint8(0),r=t.getUint32(1,!0);switch(n){case 1:return{packetType:n,streamID:r,streamType:t.getUint8(5),port:t.getUint16(6,!0),hostname:Yn.decode(e.subarray(8,e.length))};case 2:return{packetType:n,streamID:r,payload:e.subarray(5,e.length)};case 3:return{packetType:n,streamID:r,remainingBuffer:t.getUint32(5,!0)};case 4:return{packetType:n,streamID:r,reason:t.getUint8(5)};case 5:let i={};i.version_major=t.getUint8(5),i.version_minor=t.getUint8(6);let a=7;for(;a<e.length;){let n=t.getUint8(a),r=t.getUint32(a+1,!0);i[n]=e.subarray(a+5,a+5+r),a+=5+r}return{packetType:n,streamID:r,infoObj:i}}}function $n(e){let t=5;switch(e.packetType){case 1:e.hostEncoded=Xn.encode(e.hostname),t+=3+e.hostEncoded.length;break;case 2:t+=e.payload.byteLength;break;case 3:t+=4;break;case 4:t+=1;break;case 5:t+=2,e.password&&(t+=6),e.puterAuth&&(e.passwordEncoded=Xn.encode(e.puterAuth),t+=8+e.passwordEncoded.length);break;default:throw Error(`Not supported`)}let n=new Uint8Array(t),r=new DataView(n.buffer);switch(r.setUint8(0,e.packetType),r.setUint32(1,e.streamID,!0),e.packetType){case 1:r.setUint8(5,e.streamType),r.setUint16(6,e.port,!0),n.set(e.hostEncoded,8);break;case 2:n.set(e.payload,5);break;case 3:r.setUint32(5,e.remainingBuffer,!0);break;case 4:r.setUint8(5,e.reason);break;case 5:r.setUint8(5,2),r.setUint8(6,0),e.password&&(r.setUint8(7,2),r.setUint32(8,1,!0),r.setUint8(12,0)),e.puterAuth&&(r.setUint8(7,2),r.setUint32(8,5+e.passwordEncoded.length,!0),r.setUint8(12,0),r.setUint16(13,e.passwordEncoded.length,!0),n.set(e.passwordEncoded,15))}return n}var er=class{_ws;_nextStreamID=1;_bufferMax;onReady=void 0;streamMap=new Map;constructor(e,t){let n=()=>{this._ws=new WebSocket(e),this._ws.binaryType=`arraybuffer`,this._ws.onmessage=e=>{let r=Qn(new Uint8Array(e.data));switch(r.packetType){case 2:this.streamMap.get(r.streamID).dataCallBack(r.payload.slice(0));break;case 3:if(r.streamID===0){this._bufferMax=r.remainingBuffer,this._ws.onclose=()=>{setTimeout(n(),1e3)},this.onReady&&this.onReady();return}this.streamMap.get(r.streamID).buffer=r.remainingBuffer,this._continue();break;case 4:r.streamID!==0&&this.streamMap.get(r.streamID).closeCallBack(r.reason);break;case 5:t&&this._ws.send($n({packetType:5,streamID:0,puterAuth:t}));break}}};n()}_continue(e){let t=this.streamMap.get(e).queue;for(let n=0;n<t.length;n++)this.write(e,t.shift())}register(e,t,n){let r=this._nextStreamID++;return this.streamMap.set(r,{queue:[],streamID:r,buffer:this._bufferMax,dataCallBack:n.dataCallBack,closeCallBack:n.closeCallBack}),this._ws.send($n({packetType:1,streamType:1,streamID:r,hostname:e,port:t})),r}write(e,t){let n=this.streamMap.get(e);n.buffer>0?(n.buffer--,this._ws.send($n({packetType:2,streamID:e,payload:t}))):n.queue.push(t)}close(e){this._ws.send($n({packetType:4,streamID:e,reason:2}))}},tr=new TextEncoder,nr=!0,J={server:`wss://puter.cafe/`,handler:void 0},rr=class extends Jn{_events=new Map;_streamID;constructor(e,t){super([`data`,`drain`,`open`,`error`,`close`,`tlsdata`,`tlsopen`,`tlsclose`]),(async()=>{if(!puter.authToken&&puter.env===`web`&&nr)try{await puter.ui.authenticateWithPuter()}catch(e){throw e}if(!J.handler){let{token:e,server:t}=await(await fetch(`${puter.APIOrigin}/wisp/relay-token/create`,{method:`POST`,headers:{Authorization:puter.authToken?`Bearer ${puter.authToken}`:``,"Content-Type":`application/json`},body:JSON.stringify({})})).json();J.handler=new er(t,e),await new Promise((e,t)=>{J.handler.onReady=e})}let n={dataCallBack:e=>{this.emit(`data`,e)},closeCallBack:e=>{if(e!==2){this.emit(`error`,Error(Zn[e])),this.emit(`close`,!0);return}this.emit(`close`,!1)}};this._streamID=J.handler.register(e,t,n),setTimeout(()=>{this.emit(`open`,void 0)},0)})()}addListener(...e){this.on(...e)}write(e,t){if(e.buffer)J.handler.write(this._streamID,e),t&&t();else if(e.resize)e.write(this._streamID,new Uint8Array(e)),t&&t();else if(typeof e==`string`)J.handler.write(this._streamID,tr.encode(e)),t&&t();else throw Error(`Invalid data type (not TypedArray, ArrayBuffer or String!!)`)}close(){J.handler.close(this._streamID)}},ir=void 0,ar=class extends rr{constructor(...e){super(...e),super.on(`open`,(async()=>{ir||(globalThis.ReadableByteStreamController||await n(()=>import(`https://unpkg.com/web-streams-polyfill@3.0.2/dist/polyfill.js`),[],import.meta.url),ir=await n(()=>import(`https://puter-net.b-cdn.net/rustls.js`),[],import.meta.url),await ir.default(`https://puter-net.b-cdn.net/rustls.wasm`));let t=!1,r=new ReadableStream({start:e=>{super.on(`data`,t=>{e.enqueue(t.buffer)}),super.on(`close`,()=>{t||e.close()})},pull:e=>{},cancel:()=>{t=!0}}),i=new WritableStream({write:e=>{super.write(e)},abort:()=>{super.close()},close:()=>{super.close()}}),a,o;try{let t=await ir.connect_tls(r,i,e[0]);a=t.read,o=t.write}catch(e){this.emit(`error`,Error(`TLS Handshake failed: ${e}`));return}this.writer=o.getWriter();let s=a.getReader(),c=!1;this.emit(`tlsopen`,void 0);try{for(;!c;){let{done:e,value:t}=await s.read();c=e,c||this.emit(`tlsdata`,t)}this.emit(`tlsclose`,!1)}catch(e){this.emit(`error`,e),this.emit(`tlsclose`,!0)}}))}on(e,t){return e===`data`||e===`open`||e===`close`?super.on(`tls${e}`,t):super.on(e,t)}write(e,t){if(e.buffer)this.writer.write(e.slice(0).buffer).then(t);else if(e.resize)this.writer.write(e).then(t);else if(typeof e==`string`)this.writer.write(e).then(t);else throw Error(`Invalid data type (not TypedArray, ArrayBuffer or String!!)`)}};function or(...e){let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t);return e.forEach((e,t,r)=>{let i=r.slice(0,t).reduce((e,t)=>e+t.length,0);n.set(e,i)}),n}function sr(e){let t=e.split(`\r
`),n=t.shift().split(` `),r=Number(n[1]),i=n.slice(2).join(` `)||``,a=[];for(let e of t){let t=e.split(`: `),n=t[0],r=t.slice(1).join(`: `);a.push([n,r])}return new Headers(a),{headers:new Headers(a),statusText:i,status:r}}function cr(...e){return new Promise(async(t,n)=>{try{let r=new Request(...e),i=new URL(r.url),a=new Headers(r.headers),o;if(i.protocol===`http:`)o=new puter.net.Socket(i.hostname,i.port||80);else if(i.protocol===`https:`)o=new puter.net.tls.TLSSocket(i.hostname,i.port||443);else{let e=`Failed to fetch. URL scheme "${i.protocol}" is not supported.`;globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`network`,operation:`pFetch`,params:{url:r.url,method:r.method},error:{message:e}}),n(e);return}a.get(`user-agent`)||a.set(`user-agent`,navigator.userAgent);let s=`${r.method} ${i.pathname}${i.search} HTTP/1.1\r\nHost: ${i.host}\r\nConnection: close\r\n`;for(let[e,t]of a)s+=`${e}: ${t}\r\n`;let c;if(r.body){if(c=new Uint8Array(await r.arrayBuffer()),!a.has(`content-length`))a.set(`content-length`,c.length);else if(a.get(`content-length`)!==String(c.length))return n(`Content-Length header does not match the body length. Please check your request.`);s+=`Content-Length: ${c.length}\r\n`}s+=`\r
`,o.on(`open`,async()=>{o.write(s),c&&o.write(c)});let l=new TextDecoder,u=``,d=-1,f=[],p=!1,m=-1,h=0,g=!1,_=-1,v=new Uint8Array,y=new ReadableStream({start(e){function i(t){let n=new Uint8Array(v.length+t.length);for(n.set(v,0),n.set(t,v.length),v=n;;)if(_>0)if(v.length>=_+2){let t=v.slice(0,_);e.enqueue(t),v=v.slice(_+2),_=0}else{e.enqueue(v),_-=v.length,v=new Uint8Array;break}else{let t=-1;for(let e=0;e+1<v.length;e++)if(v[e]===13&&v[e+1]===10){t=e;break}if(t<0)break;let n=l.decode(v.slice(0,t)).trim();if(_=parseInt(n,16),isNaN(_)&&e.error(`Invalid chunk length from server`),v=v.slice(t+2),_===0){p=!0,e.close();return}}}o.on(`data`,n=>{if(d!==-1&&!g&&(e.enqueue(n),h+=n.length),d===-1&&(f.push(n),u+=l.decode(n,{stream:!0})),g&&i(n),u.indexOf(`\r
\r
`)!==-1){d=u.indexOf(`\r
\r
`),u=u.slice(0,d);let n=sr(u);m=Number(n.headers.get(`content-length`)),g=n.headers.get(`transfer-encoding`)===`chunked`,globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`network`,operation:`pFetch`,params:{url:r.url,method:r.method},result:{status:n.status,statusText:n.statusText}}),t(new Response(y,n));let a=or(...f).slice(d+4);g?i(a):(h+=a.length,e.enqueue(a))}m!==-1&&h===m&&!g&&(p||(p=!0,e.close()))}),o.on(`close`,()=>{p||(p=!0,e.close())}),o.on(`error`,e=>{globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`network`,operation:`pFetch`,params:{url:r.url,method:r.method},error:{message:`Socket errored with the following reason: ${e}`}}),n(`Socket errored with the following reason: ${e}`)})}})}catch(e){globalThis.puter?.apiCallLogger?.isEnabled()&&globalThis.puter.apiCallLogger.logRequest({service:`network`,operation:`pFetch`,params:{url:reqObj.url,method:reqObj.method},error:{message:e.message||e.toString(),stack:e.stack}}),n(e)}})}var lr=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}user=function(...e){let t;t=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]};let n=``;return t?.query&&(n=`?${new URLSearchParams(t.query).toString()}`),new Promise((e,r)=>{let i=j(`/whoami${n}`,this.APIOrigin,this.authToken,`get`);M(i,t.success,t.error,e,r),i.send()})};version=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]},new Promise((e,n)=>{let r=j(`/version`,this.APIOrigin,this.authToken,`get`);M(r,t.success,t.error,e,n),r.send()})}},ur=class{constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}async req_(e,t){try{let n=await fetch(this.APIOrigin+e,{method:t?`POST`:`GET`,headers:{Authorization:`Bearer ${this.authToken}`,"Content-Type":`application/json`},...t?{body:JSON.stringify(t)}:{}});if(n.headers.get(`content-type`)?.includes(`application/json`)){let e=await n.json();return n.status!==200&&(e.error=!0),e}return{error:!0,message:await n.text(),code:`unknown_error`}}catch(e){return{error:!0,message:e.message,code:`internal_error`}}}async grantUser(e,t){return await this.req_(`/auth/grant-user-user`,{target_username:e,permission:t})}async grantGroup(e,t){return await this.req_(`/auth/grant-user-group`,{group_uid:e,permission:t})}async grantApp(e,t){return await this.req_(`/auth/grant-user-app`,{app_uid:e,permission:t})}async grantAppAnyUser(e,t){return await this.req_(`/auth/grant-dev-app`,{app_uid:e,permission:t})}async grantOrigin(e,t){return await this.req_(`/auth/grant-user-app`,{origin:e,permission:t})}async revokeUser(e,t){return await this.req_(`/auth/revoke-user-user`,{target_username:e,permission:t})}async revokeGroup(e,t){return await this.req_(`/auth/revoke-user-group`,{group_uid:e,permission:t})}async revokeApp(e,t){return await this.req_(`/auth/revoke-user-app`,{app_uid:e,permission:t})}async revokeAppAnyUser(e,t){return await this.req_(`/auth/revoke-dev-app`,{app_uid:e,permission:t})}async revokeOrigin(e,t){return await this.req_(`/auth/revoke-user-app`,{origin:e,permission:t})}async createGroup(e={},t={}){return await this.req_(`/group/create`,{metadata:e,extra:t})}async addUsersToGroup(e,t){return await this.req_(`/group/add-users`,{uid:e,users:t??[]})}async removeUsersFromGroup(e,t){return await this.req_(`/group/remove-users`,{uid:e,users:t??[]})}async listGroups(){return await this.req_(`/group/list`)}requestPermission(...e){return this.request(...e)}async request(e){return await this.puter.ui.requestPermission({permission:e})}async requestEmail(){let e;return e=await this.puter.auth.whoami(),e.email===void 0&&await this.puter.ui.requestPermission({permission:`user:${e.uuid}:email:read`})&&(e=await this.puter.auth.whoami()),e.email}async requestReadDesktop(){return this.requestFolder_(`Desktop`,`read`)}async requestWriteDesktop(){return this.requestFolder_(`Desktop`,`write`)}async requestReadDocuments(){return this.requestFolder_(`Documents`,`read`)}async requestWriteDocuments(){return this.requestFolder_(`Documents`,`write`)}async requestReadPictures(){return this.requestFolder_(`Pictures`,`read`)}async requestWritePictures(){return this.requestFolder_(`Pictures`,`write`)}async requestReadVideos(){return this.requestFolder_(`Videos`,`read`)}async requestWriteVideos(){return this.requestFolder_(`Videos`,`write`)}async requestReadApps(){let e=await this.puter.auth.whoami();return await this.puter.ui.requestPermission({permission:`apps-of-user:${e.uuid}:read`})}async requestManageApps(){let e=await this.puter.auth.whoami();return await this.puter.ui.requestPermission({permission:`apps-of-user:${e.uuid}:write`})}async requestReadSubdomains(){let e=await this.puter.auth.whoami();return await this.puter.ui.requestPermission({permission:`subdomains-of-user:${e.uuid}:read`})}async requestManageSubdomains(){let e=await this.puter.auth.whoami();return await this.puter.ui.requestPermission({permission:`subdomains-of-user:${e.uuid}:write`})}async requestReadAppRootDir(e){return await this.#e(`read`,e)}async requestWriteAppRootDir(e){return await this.#e(`write`,e)}async#e(e,t){if(typeof t==`object`&&t&&(t=t.uid),typeof t!=`string`)throw Error(`parameter app_uid must be a strinkg`);let n,r=async()=>n=await this.req_(`/auth/request-app-root-dir`,{app_uid:t,access:`read`});if(await r(),!n.error)return n;t=typeof app_or_uuid==`object`&&t!==null?t.uid:t;let i=`app-root-dir:${t}:read`;if(await this.puter.ui.requestPermission({permission:i})){await r();let e=100,t=5e3,i=0;for(;n.error&&i<t&&(await new Promise(t=>setTimeout(t,e)),i+=e,await r(),n.error);)e=Math.min(e*2,Math.max(100,t-i))}if(!n.error)return n}async requestFolder_(e,t){let n=`/${(await this.puter.auth.whoami()).username}/${e}`;try{if(await this.puter.fs.stat({path:n}),t!==`write`)return n}catch{}if(await this.puter.ui.requestPermission({permission:`fs:${n}:${t}`}))return n}},dr=()=>{let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}},fr=Symbol(`FILE_SAVE_CANCELLED`),pr=Symbol(`FILE_OPEN_CANCELLED`),mr=class e extends Jn{#e=`*`;#t;#n;static from(t,n,{messageTarget:r,appInstanceID:i}){let a=new e(n,{target:t.appInstanceID,usesSDK:t.usesSDK,messageTarget:r,appInstanceID:i});return a.response=t.response,a}constructor(e,{target:t,usesSDK:n,messageTarget:r,appInstanceID:i}){super([`message`,`close`]),this.messageTarget=r,this.appInstanceID=i,this.targetAppInstanceID=t,this.#t=!0,this.#n=n,this.log=e.logger.fields({category:`ipc`}),this.log.fields({cons_source:i,source:e.appInstanceID,target:t}).info(`AppConnection created to ${t}`,this),globalThis.document&&window.addEventListener(`message`,e=>{if(e.data.msg===`messageToApp`){if(e.data.appInstanceID!==this.targetAppInstanceID)return;if(e.data.targetAppInstanceID!==this.appInstanceID){console.error(`AppConnection received message intended for wrong app! appInstanceID=${this.appInstanceID}, target=${e.data.targetAppInstanceID}`);return}this.emit(`message`,e.data.contents);return}if(e.data.msg===`appClosed`){if(e.data.appInstanceID!==this.targetAppInstanceID)return;this.#t=!1,this.emit(`close`,{appInstanceID:this.targetAppInstanceID,statusCode:e.data.statusCode})}})}get usesSDK(){return this.#n}postMessage(e){if(!this.#t){console.warn(`Trying to post message on a closed AppConnection`);return}if(!this.#n){console.warn(`Trying to post message to a non-SDK app`);return}this.messageTarget.postMessage({msg:`messageToApp`,appInstanceID:this.appInstanceID,targetAppInstanceID:this.targetAppInstanceID,targetAppOrigin:`*`,contents:e},this.#e)}close(){if(!this.#t){console.warn(`Trying to close an app on a closed AppConnection`);return}this.messageTarget.postMessage({msg:`closeApp`,appInstanceID:this.appInstanceID,targetAppInstanceID:this.targetAppInstanceID},this.#e)}},hr=class extends Jn{#e=1;itemWatchCallbackFunctions=[];appInstanceID;parentInstanceID;#t=null;#n=[];#r;#i;#a;#o;#s=new Map;#c=!1;#l=null;#u(e,t,n={}){let r=this.#e++;this.messageTarget?.postMessage({msg:e,env:this.env,appInstanceID:this.appInstanceID,uuid:r,...n},`*`),this.#n[r]=(...e)=>{t(...e)}}#d(e,t={}){return new Promise(n=>{this.#u(e,n,t)})}#f(e,t){let n=this.util.rpc.getDehydrator({target:this.messageTarget});this.messageTarget?.postMessage({msg:e,env:this.env,appInstanceID:this.appInstanceID,value:n.dehydrate(t)},`*`)}async#p({callback:e,method:t,parameters:n}){let r,i;await new Promise(e=>{r=new Promise(t=>{i=t,e()})});let a=this.util.rpc.registerCallback(i);this.messageTarget?.postMessage({$:`puter-ipc`,v:2,appInstanceID:this.appInstanceID,env:this.env,msg:t,parameters:n,uuid:a},`*`);let o=await r;return e&&e(o),o}constructor(e,{appInstanceID:t,parentInstanceID:n}){let r=[`localeChanged`,`themeChanged`,`connection`];if(super(r),this.#o=r,this.puter=e,this.appInstanceID=t,this.parentInstanceID=n,this.appID=e.appID,this.env=e.env,this.util=e.util,this.env===`app`)this.messageTarget=window.parent;else if(this.env===`gui`)return;this.parentInstanceID&&(this.#t=new mr(this.puter,{target:this.parentInstanceID,usesSDK:!0,messageTarget:this.messageTarget,appInstanceID:this.appInstanceID})),this.messageTarget?.postMessage({msg:`READY`,appInstanceID:this.appInstanceID},`*`),globalThis.document&&window.addEventListener(`focus`,e=>{this.messageTarget?.postMessage({msg:`windowFocused`,appInstanceID:this.appInstanceID},`*`)});let i=null;globalThis.document&&window.addEventListener(`message`,async e=>{if(e.data){if(e.data.error)throw e.data.error;if(e.data.msg&&e.data.msg===`focus`)window.focus();else if(e.data.msg&&e.data.msg===`click`){let t=document.elementFromPoint(e.data.x,e.data.y);t!==null&&t.click()}else if(e.data.msg&&e.data.msg===`drag`){let t=document.elementFromPoint(e.data.x,e.data.y);if(t!==i){if(i){let t=new Event(`dragleave`,{bubbles:!0,cancelable:!0,clientX:e.data.x,clientY:e.data.y});i.dispatchEvent(t)}if(t){let n=new Event(`dragenter`,{bubbles:!0,cancelable:!0,clientX:e.data.x,clientY:e.data.y});t.dispatchEvent(n)}i=t}}else if(e.data.msg&&e.data.msg===`drop`){if(i){let t=new CustomEvent(`drop`,{bubbles:!0,cancelable:!0,detail:{clientX:e.data.x,clientY:e.data.y,items:e.data.items}});i.dispatchEvent(t),i=null}}else if(e.data.msg===`windowWillClose`)this.#r===void 0?this.messageTarget?.postMessage({msg:!0,appInstanceID:this.appInstanceID,original_msg_id:e.data.msg_id},`*`):(this.messageTarget?.postMessage({msg:!1,appInstanceID:this.appInstanceID,original_msg_id:e.data.msg_id},`*`),this.#r());else if(e.data.msg===`itemsOpened`)if(this.#i===void 0)this.messageTarget?.postMessage({msg:!0,appInstanceID:this.appInstanceID,original_msg_id:e.data.msg_id},`*`);else{this.messageTarget?.postMessage({msg:!1,appInstanceID:this.appInstanceID,original_msg_id:e.data.msg_id},`*`);let t=[];if(e.data.items.length>0)for(let n=0;n<e.data.items.length;n++)t.push(new W(e.data.items[n]));this.#i(t)}else if(e.data.msg===`getAppDataSucceeded`){let t=new W(e.data.item);e.data.original_msg_id&&this.#n[e.data.original_msg_id]&&this.#n[e.data.original_msg_id](t)}else if(e.data.msg===`instancesOpenSucceeded`)e.data.original_msg_id&&this.#n[e.data.original_msg_id]&&this.#n[e.data.original_msg_id](e.data.instancesOpen);else if(e.data.msg===`readAppDataFileSucceeded`){let t=new W(e.data.item);e.data.original_msg_id&&this.#n[e.data.original_msg_id]&&this.#n[e.data.original_msg_id](t)}else if(e.data.msg===`readAppDataFileFailed`)e.data.original_msg_id&&this.#n[e.data.original_msg_id]&&this.#n[e.data.original_msg_id](null);else if(e.data.original_msg_id!==void 0&&this.#n[e.data.original_msg_id]){if(e.data.msg===`fileOpenPicked`){if(e.data.items.length===1)this.#n[e.data.original_msg_id](new W(e.data.items[0]));else if(e.data.items.length>1){let t=[];for(let n=0;n<e.data.items.length;n++)t.push(new W(e.data.items[n]));this.#n[e.data.original_msg_id](t)}}else if(e.data.msg===`directoryPicked`){if(e.data.items.length===1)this.#n[e.data.original_msg_id](new W({uid:e.data.items[0].uid,name:e.data.items[0].fsentry_name,path:e.data.items[0].path,readURL:e.data.items[0].read_url,writeURL:e.data.items[0].write_url,metadataURL:e.data.items[0].metadata_url,isDirectory:!0,size:e.data.items[0].fsentry_size,accessed:e.data.items[0].fsentry_accessed,modified:e.data.items[0].fsentry_modified,created:e.data.items[0].fsentry_created}));else if(e.data.items.length>1){let t=[];for(let n=0;n<e.data.items.length;n++)t.push(new W(e.data.items[n]));this.#n[e.data.original_msg_id](t)}}else e.data.msg===`colorPicked`?this.#n[e.data.original_msg_id](e.data.color):e.data.msg===`fontPicked`?this.#n[e.data.original_msg_id](e.data.font):e.data.msg===`alertResponded`||e.data.msg===`promptResponded`?this.#n[e.data.original_msg_id](e.data.response):e.data.msg===`notificationShown`?this.#n[e.data.original_msg_id](e.data.uid):e.data.msg===`languageReceived`?this.#n[e.data.original_msg_id](e.data.language):e.data.msg===`fileSaved`?this.#n[e.data.original_msg_id](new W(e.data.saved_file)):e.data.msg===`fileSaveCancelled`?this.#n[e.data.original_msg_id](fr):e.data.msg===`fileOpenCancelled`?this.#n[e.data.original_msg_id](pr):this.#n[e.data.original_msg_id](e.data);delete this.#n[e.data.original_msg_id]}else if(e.data.msg===`itemChanged`&&e.data.data&&e.data.data.uid)this.itemWatchCallbackFunctions[e.data.data.uid]&&typeof this.itemWatchCallbackFunctions[e.data.data.uid]==`function`&&this.itemWatchCallbackFunctions[e.data.data.uid](e.data.data);else if(e.data.msg===`broadcast`){let{name:t,data:n}=e.data;if(!this.#o.includes(t))return;this.emit(t,n),this.#s.set(t,n)}else if(e.data.msg===`connection`){e.data.usesSDK=!0;let t=mr.from(e.data,this.puter,{messageTarget:this.messageTarget,appInstanceID:this.appInstanceID});this.emit(`connection`,{conn:t,accept:t=>{this.messageTarget?.postMessage({$:`connection-resp`,connection:e.data.appInstanceID,accept:!0,value:t},`*`)},reject:t=>{this.messageTarget?.postMessage({$:`connection-resp`,connection:e.data.appInstanceID,accept:!1,value:t},`*`)}})}}}),globalThis.document?.addEventListener(`mousemove`,async e=>{this.mouseX=e.clientX,this.mouseY=e.clientY,this.messageTarget?.postMessage({msg:`mouseMoved`,appInstanceID:this.appInstanceID,x:this.mouseX,y:this.mouseY},`*`)}),globalThis.document?.addEventListener(`click`,async e=>{this.mouseX=e.clientX,this.mouseY=e.clientY,this.messageTarget?.postMessage({msg:`mouseClicked`,appInstanceID:this.appInstanceID,x:this.mouseX,y:this.mouseY},`*`)})}onWindowClose(e){this.#r=e}onItemsOpened(e){if(!this.#i){let t=new URLSearchParams(globalThis.location.search);if(t.has(`puter.item.name`)&&t.has(`puter.item.uid`)&&t.has(`puter.item.read_url`)){let n=t.get(`puter.item.path`);!n.startsWith(`~/`)&&!n.startsWith(`/`)&&(n=`~/${n}`),e([new W({name:t.get(`puter.item.name`),path:n,uid:t.get(`puter.item.uid`),readURL:t.get(`puter.item.read_url`),writeURL:t.get(`puter.item.write_url`),metadataURL:t.get(`puter.item.metadata_url`),size:t.get(`puter.item.size`),accessed:t.get(`puter.item.accessed`),modified:t.get(`puter.item.modified`),created:t.get(`puter.item.created`)})])}}this.#i=e}wasLaunchedWithItems(){let e=new URLSearchParams(globalThis.location.search);return e.has(`puter.item.name`)&&e.has(`puter.item.uid`)&&e.has(`puter.item.read_url`)}onLaunchedWithItems(e){if(!this.#a){let t=new URLSearchParams(globalThis.location.search);if(t.has(`puter.item.name`)&&t.has(`puter.item.uid`)&&t.has(`puter.item.read_url`)){let n=t.get(`puter.item.path`);!n.startsWith(`~/`)&&!n.startsWith(`/`)&&(n=`~/${n}`),e([new W({name:t.get(`puter.item.name`),path:n,uid:t.get(`puter.item.uid`),readURL:t.get(`puter.item.read_url`),writeURL:t.get(`puter.item.write_url`),metadataURL:t.get(`puter.item.metadata_url`),size:t.get(`puter.item.size`),accessed:t.get(`puter.item.accessed`),modified:t.get(`puter.item.modified`),created:t.get(`puter.item.created`)})])}}this.#a=e}requestEmailConfirmation(){return new Promise((e,t)=>{this.#u(`requestEmailConfirmation`,e,{})})}alert(e,t,n,r){return this.messageTarget?new Promise(r=>{this.#u(`ALERT`,r,{message:e,buttons:t,options:n})}):new Promise(r=>{let i=document.createElement(`puter-alert`);i.setAttribute(`message`,e||``),i.buttons=t,i.options=n,i.addEventListener(`response`,e=>r(e.detail)),document.body.appendChild(i),i.open()})}openDevPaymentsAccount(){return new Promise(e=>{this.#u(`openDevPaymentsAccount`,e,{})})}instancesOpen(e){return new Promise(e=>{this.#u(`getInstancesOpen`,e,{})})}socialShare(e,t,n,r){return new Promise(r=>{this.#u(`socialShare`,r,{url:e,message:t,options:n})})}prompt(e,t,n,r){return this.messageTarget?new Promise(r=>{this.#u(`PROMPT`,r,{message:e,placeholder:t,options:n})}):new Promise(r=>{let i=document.createElement(`puter-prompt`);e&&i.setAttribute(`message`,e),t&&i.setAttribute(`placeholder`,t),n?.defaultValue&&i.setAttribute(`default-value`,n.defaultValue),i.options=n,i.addEventListener(`response`,e=>r(e.detail)),document.body.appendChild(i),i.open()})}notify(e){return this.messageTarget?new Promise(t=>{let n={...e??{}};n.roundIcon!==void 0&&n.round_icon===void 0&&(n.round_icon=n.roundIcon),this.#u(`showNotification`,t,{options:n})}):new Promise(t=>{let n=e??{},r=document.createElement(`puter-notification`);n.title&&r.setAttribute(`title`,n.title),n.text&&r.setAttribute(`text`,n.text),n.icon&&r.setAttribute(`icon`,n.icon),n.type&&r.setAttribute(`type`,n.type),(n.round_icon||n.roundIcon)&&r.setAttribute(`round-icon`,``),n.duration!==void 0&&r.setAttribute(`duration`,String(n.duration)),r.addEventListener(`close`,()=>t(n.uid||null)),document.body.appendChild(r),t(n.uid||null)})}showDirectoryPicker(e,t){return new Promise((t,n)=>{if(!globalThis.open)return n(`This API is not compatible in Web Workers.`);let r=this.#e++;if(this.env===`app`)this.messageTarget?.postMessage({msg:`showDirectoryPicker`,appInstanceID:this.appInstanceID,uuid:r,options:e,env:this.env},`*`);else{var i=screen.width/2-700/2,a=screen.height/2-400/2;window.open(`${puter.defaultGUIOrigin}/action/show-directory-picker?embedded_in_popup=true&msg_id=${r}&appInstanceID=${this.appInstanceID}&env=${this.env}&options=${JSON.stringify(e)}`,`Puter: Open Directory`,`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=400, top=${a}, left=${i}`)}this.#n[r]=t})}showOpenFilePicker(e,t){let n=dr(),r=new Promise((t,r)=>{if(!globalThis.open)return r(`This API is not compatible in Web Workers.`);let i=this.#e++;if(this.env===`app`)this.messageTarget?.postMessage({msg:`showOpenFilePicker`,appInstanceID:this.appInstanceID,uuid:i,options:e??{},env:this.env},`*`);else{var a=screen.width/2-700/2,o=screen.height/2-400/2;window.open(`${puter.defaultGUIOrigin}/action/show-open-file-picker?embedded_in_popup=true&msg_id=${i}&appInstanceID=${this.appInstanceID}&env=${this.env}&options=${JSON.stringify(e??{})}`,`Puter: Open File`,`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=400, top=${o}, left=${a}`)}this.#n[i]=e=>{if(e===pr){n.resolve(void 0);return}n.resolve(e),t(e)}});return r.undefinedOnCancel=n.promise,r}showFontPicker(e){return this.messageTarget?new Promise(t=>{this.#u(`showFontPicker`,t,{options:e??{}})}):new Promise(t=>{let n=typeof e==`string`?{defaultFont:e}:e??{},r=document.createElement(`puter-font-picker`),i=n.defaultFont||n.default||`System UI`;r.setAttribute(`default-font`,i),r.addEventListener(`response`,e=>t(e.detail)),document.body.appendChild(r),r.open()})}showColorPicker(e){return this.messageTarget?new Promise(t=>{this.#u(`showColorPicker`,t,{options:e??{}})}):new Promise(t=>{let n=typeof e==`string`?{defaultColor:e}:e??{},r=document.createElement(`puter-color-picker`),i=n.defaultValue||n.defaultColor||n.default||`#3b82f6`;r.setAttribute(`default-color`,i),r.addEventListener(`response`,e=>t(e.detail)),document.body.appendChild(r),r.open()})}requestUpgrade(){return new Promise(e=>{this.#u(`requestUpgrade`,e,{})})}showSaveFilePicker(e,t,n){let r=dr(),i=new Promise((i,a)=>{if(!globalThis.open)return a(`This API is not compatible in Web Workers.`);let o=this.#e++;!n&&Object.prototype.toString.call(e)===`[object URL]`&&(n=`url`);let s=n===`url`?e.toString():void 0,c=[`move`,`copy`].includes(n)?e:void 0;if(this.env===`app`)this.messageTarget?.postMessage({msg:`showSaveFilePicker`,appInstanceID:this.appInstanceID,content:s?void 0:e,save_type:n,url:s,source_path:c,suggestedName:t??``,env:this.env,uuid:o},`*`);else{let n=new Blob([e],{type:`application/octet-stream`}),r=URL.createObjectURL(n);var l=screen.width/2-700/2,u=screen.height/2-400/2;let i=window.open(`${puter.defaultGUIOrigin}/action/show-save-file-picker?embedded_in_popup=true&msg_id=${o}&appInstanceID=${this.appInstanceID}&env=${this.env}&blobUrl=${encodeURIComponent(r)}`,`Puter: Save File`,`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=400, top=${u}, left=${l}`),a=n=>{n.data?.msg===`sendMeFileData`&&n.origin===puter.defaultGUIOrigin&&(!i||n.source!==i||(n.source.postMessage({msg:`showSaveFilePickerPopup`,content:s?void 0:e,url:s?s.toString():void 0,suggestedName:t??``,env:this.env,uuid:o},puter.defaultGUIOrigin),window.removeEventListener(`message`,a)))};window.addEventListener(`message`,a)}this.#n[o]=e=>{if(e===fr){r.resolve(void 0);return}r.resolve(e),i(e)}});return i.undefinedOnCancel=r.promise,i}setWindowTitle(e,t,n){return typeof t==`function`?(n=t,t=void 0):typeof t==`object`&&t&&(t=t.id),new Promise(n=>{this.#u(`setWindowTitle`,n,{new_title:e,window_id:t})})}setWindowWidth(e,t,n){return typeof t==`function`?(n=t,t=void 0):typeof t==`object`&&t&&(t=t.id),new Promise(n=>{this.#u(`setWindowWidth`,n,{width:e,window_id:t})})}setWindowHeight(e,t,n){return typeof t==`function`?(n=t,t=void 0):typeof t==`object`&&t&&(t=t.id),new Promise(n=>{this.#u(`setWindowHeight`,n,{height:e,window_id:t})})}setWindowSize(e,t,n,r){return typeof n==`function`?(r=n,n=void 0):typeof n==`object`&&n&&(n=n.id),new Promise(r=>{this.#u(`setWindowSize`,r,{width:e,height:t,window_id:n})})}setWindowPosition(e,t,n,r){return typeof n==`function`?(r=n,n=void 0):typeof n==`object`&&n&&(n=n.id),new Promise(r=>{this.#u(`setWindowPosition`,r,{x:e,y:t,window_id:n})})}setWindowY(e,t,n){return typeof t==`function`?(n=t,t=void 0):typeof t==`object`&&t&&(t=t.id),new Promise(n=>{this.#u(`setWindowY`,n,{y:e,window_id:t})})}setWindowX(e,t,n){return typeof t==`function`?(n=t,t=void 0):typeof t==`object`&&t&&(t=t.id),new Promise(n=>{this.#u(`setWindowX`,n,{x:e,window_id:t})})}showWindow(){this.#f(`showWindow`)}hideWindow(){this.#f(`hideWindow`)}toggleWindow(){this.#f(`toggleWindow`)}setMenubar(e){if(this.messageTarget){this.#f(`setMenubar`,e);return}document.querySelectorAll(`puter-menubar`).forEach(e=>e.remove());let t=document.createElement(`puter-menubar`);t.items=e.items||[],document.body.appendChild(t)}async requestPermission(e){return this.env===`app`&&(await this.#d(`requestPermission`,{options:e})).granted}disableMenuItem(e){this.#f(`disableMenuItem`,{id:e})}enableMenuItem(e){this.#f(`enableMenuItem`,{id:e})}setMenuItemIcon(e,t){this.#f(`setMenuItemIcon`,{id:e,icon:t})}setMenuItemIconActive(e,t){this.#f(`setMenuItemIconActive`,{id:e,icon:t})}setMenuItemChecked(e,t){this.#f(`setMenuItemChecked`,{id:e,checked:t})}contextMenu(e){if(this.messageTarget){this.#f(`contextMenu`,e);return}let t=document.createElement(`puter-context-menu`);t.items=e.items||[];let n=e.x??globalThis.event?.clientX??0,r=e.y??globalThis.event?.clientY??0;t.setAttribute(`x`,String(n)),t.setAttribute(`y`,String(r)),document.body.appendChild(t)}getEntriesFromDataTransferItems=async function(e,t={raw:!1}){let n=e=>{if(this.getEntriesFromDataTransferItems.didShowInfo||e.name!==`EncodingError`)return;this.getEntriesFromDataTransferItems.didShowInfo=!0;let t=`${e.name} occurred within datatransfer-files-promise module\nError message: "${e.message}"\nTry serving html over http if currently you are running it from the filesystem.`;console.warn(t)},r=(e,r=``)=>new Promise((i,a)=>{e.file(e=>{t.raw||(e.filepath=r+e.name),i(e)},e=>{n(e),a(e)})}),i=(e,t)=>new Promise((r,i)=>{e.readEntries(async e=>{let n=[];for(let r of e){let e=await o(r,t);n=n.concat(e)}r(n)},e=>{n(e),i(e)})}),a=async(e,t)=>{let n=e.createReader(),r=`${t+e.name}/`,a=[],o;do o=await i(n,r),a=a.concat(o);while(o.length>0);return a},o=async(e,t=``)=>{if(e!==null){if(e.isFile)return[await r(e,t)];if(e.isDirectory){let n=await a(e,t);return n.push(e),n}}},s=[],c=[];for(let t=0,n=e.length;t<n;t++)c.push(e[t].webkitGetAsEntry());for(let e of c){let t=await o(e);s=s.concat(t)}return s};authenticateWithPuter(){if(this.env===`web`)return this.authToken?new Promise(e=>{e()}):puter.puterAuthState.isPromptOpen?new Promise((e,t)=>{puter.puterAuthState.resolver={resolve:e,reject:t}}):(puter.puterAuthState.isPromptOpen=!0,puter.puterAuthState.authGranted=null,new Promise((e,t)=>{if(puter.authToken)e();else{let n=new we(e,t);document.body.appendChild(n),n.open()}}))}launchApp=async function(e,t,n){let r,i,a,o=e;if(typeof o==`object`&&o){let e=o;o=e.name||e.app_name,i=e.file_paths,t||=e.args,n||=e.callback,r=e.pseudonym,a=e.items}if(a){Array.isArray(a)||(a=[]);for(let e=0;e<a.length;e++)a[e]instanceof W&&(a[e]=a[e]._internalProperties.file_signature)}o&&o.includes(`#(as)`)&&([o,r]=o.split(`#(as)`)),o||=puter.appName;let s=await this.#p({method:`launchApp`,callback:n,parameters:{app_name:o,file_paths:i,items:a,pseudonym:r,args:t}});return mr.from(s,this.puter,{messageTarget:this.messageTarget,appInstanceID:this.appInstanceID})};connectToInstance=async function(e){let t=await this.#p({method:`connectToInstance`,parameters:{app_name:e}});return mr.from(t,this.puter,{messageTarget:this.messageTarget,appInstanceID:this.appInstanceID})};parentApp(){return this.#t}createWindow(e,t){return new Promise(t=>{this.#u(`createWindow`,e=>{t(e.window)},{options:e??{}})})}menubar(){document.querySelectorAll(`style.puter-stylesheet`).forEach(function(e){e.remove()});let e=document.createElement(`style`);e.classList.add(`puter-stylesheet`),e.innerHTML=`
        .--puter-menubar {
            border-bottom: 1px solid #e9e9e9;
            background-color: #fbf9f9;
            padding-top: 3px;
            padding-bottom: 2px;
            display: inline-block;
            position: fixed;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            height: 31px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            z-index: 9999;
        }
        
        .--puter-menubar, .--puter-menubar * {
            user-select: none;
            -webkit-user-select: none;
            cursor: default;
        }
        
        .--puter-menubar .dropdown-item-divider>hr {
            margin-top: 5px;
            margin-bottom: 5px;
            border-bottom: none;
            border-top: 1px solid #00000033;
        }
        
        .--puter-menubar>li {
            display: inline-block;
            padding: 10px 5px;
        }
        
        .--puter-menubar>li>ul {
            display: none;
            z-index: 999999999999;
            list-style: none;
            background-color: rgb(233, 233, 233);
            width: 200px;
            border: 1px solid #e4ebf3de;
            box-shadow: 0px 0px 5px #00000066;
            padding-left: 6px;
            padding-right: 6px;
            padding-top: 4px;
            padding-bottom: 4px;
            color: #333;
            border-radius: 4px;
            padding: 2px;
            min-width: 200px;
            margin-top: 5px;
            position: absolute;
        }
        
        .--puter-menubar .menubar-item {
            display: block;
            line-height: 24px;
            margin-top: -7px;
            text-align: center;
            border-radius: 3px;
            padding: 0 5px;
        }
        
        .--puter-menubar .menubar-item-open {
            background-color: rgb(216, 216, 216);
        }
        
        .--puter-menubar .dropdown-item {
            padding: 5px;
            padding: 5px 30px;
            list-style-type: none;
            user-select: none;
            font-size: 13px;
        }
        
        .--puter-menubar .dropdown-item-icon, .--puter-menubar .dropdown-item-icon-active {
            pointer-events: none;
            width: 18px;
            height: 18px;
            margin-left: -23px;
            margin-bottom: -4px;
            margin-right: 5px;
        }
        .--puter-menubar .dropdown-item-disabled .dropdown-item-icon{
            display: inline-block !important;
        }
        .--puter-menubar .dropdown-item-disabled .dropdown-item-icon-active{
            display: none !important;
        }
        .--puter-menubar .dropdown-item-icon-active {
            display:none;
        }
        .--puter-menubar .dropdown-item:hover .dropdown-item-icon{
            display: none;
        }
        .--puter-menubar .dropdown-item:hover .dropdown-item-icon-active{
            display: inline-block;
        }
        .--puter-menubar .dropdown-item-hide-icon .dropdown-item-icon, .--puter-menubar .dropdown-item-hide-icon .dropdown-item-icon-active{
            display: none !important;
        }
        .--puter-menubar .dropdown-item a {
            color: #333;
            text-decoration: none;
        }
        
        .--puter-menubar .dropdown-item:hover, .--puter-menubar .dropdown-item:hover a {
            background-color: rgb(59 134 226);
            color: white;
            border-radius: 4px;
        }
        
        .--puter-menubar .dropdown-item-disabled, .--puter-menubar .dropdown-item-disabled:hover {
            opacity: 0.5;
            background-color: transparent;
            color: initial;
            cursor: initial;
            pointer-events: none;
        }
        
        .--puter-menubar .menubar * {
            user-select: none;
        }                
        `,(document.head||document.getElementsByTagName(`head`)[0]).appendChild(e),document.addEventListener(`click`,function(e){if(e.target.classList.contains(`dropdown-item-disabled`))return!1;e.target.classList.contains(`menubar-item`)||(document.querySelectorAll(`.menubar-item.menubar-item-open`).forEach(function(e){e.classList.remove(`menubar-item-open`)}),document.querySelectorAll(`.dropdown`).forEach(e=>e.style.display=`none`))}),window.addEventListener(`blur`,function(e){document.querySelectorAll(`.dropdown`).forEach(function(e){e.style.display=`none`}),document.querySelectorAll(`.menubar-item.menubar-item-open`).forEach(e=>e.classList.remove(`menubar-item-open`))});let t=function(e){let t=[];if(!e.parentNode)return t;let n=e.parentNode.firstChild;for(;n;)n.nodeType===1&&n!==e&&t.push(n),n=n.nextSibling;return t};document.querySelectorAll(`.menubar-item`).forEach(e=>e.addEventListener(`mousedown`,function(e){document.querySelectorAll(`.dropdown`).forEach(function(e){e.style.display=`none`}),document.querySelectorAll(`.menubar-item.menubar-item-open`).forEach(function(t){t!=e.target&&t.classList.remove(`menubar-item-open`)}),this.classList.contains(`menubar-item-open`)?document.querySelectorAll(`.menubar-item.menubar-item-open`).forEach(function(e){e.classList.remove(`menubar-item-open`)}):e.target.classList.contains(`dropdown-item`)||(this.classList.add(`menubar-item-open`),t(this).forEach(function(e){e.style.display=`block`}))})),document.querySelectorAll(`.--puter-menubar .menubar-item`).forEach(e=>e.addEventListener(`mouseover`,function(e){let t=document.querySelectorAll(`.menubar-item.menubar-item-open`);t.length>0&&t[0]!==e.target&&e.target.dispatchEvent(new Event(`mousedown`))}))}on(e,t){super.on(e,t),this.#o.includes(e)&&this.#s.has(e)&&t(this.#s.get(e))}#m=null;#h=null;showSpinner(e){if(this.#c)return;if(!document.getElementById(`puter-spinner-styles`)){let e=document.createElement(`style`);e.id=`puter-spinner-styles`,e.textContent=`
                .puter-loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
    
                .puter-loading-text {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    margin-top: 10px;
                    text-align: center;
                    width: 100%;
                }
    
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
    
                .puter-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 120px; 
                    background: #ffffff; 
                    border-radius: 10px;
                    padding: 20px;
                    min-width: 120px;
                }
            `,document.head.appendChild(e)}let t=document.createElement(`div`);t.classList.add(`puter-loading-overlay`),Object.assign(t.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,backgroundColor:`rgba(255, 255, 255, 0.8)`,zIndex:`2147483647`,display:`flex`,justifyContent:`center`,alignItems:`center`,pointerEvents:`all`});let n=document.createElement(`div`);n.classList.add(`puter-loading-container`),n.innerHTML=`
            <div class="puter-loading-spinner"></div>
            <div class="puter-loading-text">${e??`Working...`}</div>
        `,t.appendChild(n),document.body.appendChild(t),this.#c=!0,this.#m=Date.now(),this.#l=setTimeout(()=>{this.#l=null},1e3)}hideSpinner(){if(!this.#c)return;this.#l&&=(clearTimeout(this.#l),null);let e=Date.now()-this.#m,t=Math.max(0,1200-e);t>0?(this.#h&&clearTimeout(this.#h),this.#h=setTimeout(()=>{this.#g()},t)):this.#g()}#g(){let e=document.querySelector(`.puter-loading-overlay`);e&&e.parentNode?.removeChild(e),this.#c=!1,this.#m=null,this.#h=null}isWorkingActive(){return this.#c}getLanguage(){return this.env===`gui`?new Promise(e=>{e(window.locale)}):new Promise(e=>{this.#u(`getLanguage`,e,{})})}},gr=`9a9c83a4-7897-43a0-93b9-53217b84fde6`,_r=class{#e=1;constructor(){this.callbacks=new Map}register_callback(e){let t=this.#e++;return this.callbacks.set(t,e),t}attach_to_source(e){e.addEventListener(`message`,e=>{let{data:t}=e;if(t&&typeof t==`object`&&t.$SCOPE===`9a9c83a4-7897-43a0-93b9-53217b84fde6`){let{id:e,args:n}=t,r=this.callbacks.get(e);r&&r(...n)}})}},vr=class{constructor({callbackManager:e}){this.callbackManager=e}dehydrate(e){return this.dehydrate_value_(e)}dehydrate_value_(e){if(typeof e==`function`)return{$SCOPE:gr,id:this.callbackManager.register_callback(e)};if(Array.isArray(e))return e.map(this.dehydrate_value_.bind(this));if(typeof e==`object`&&e){let t={};for(let n in e)t[n]=this.dehydrate_value_(e[n]);return t}else return e}},yr=class{constructor({target:e}){this.target=e}hydrate(e){return this.hydrate_value_(e)}hydrate_value_(e){if(e&&typeof e==`object`&&e.$SCOPE===`9a9c83a4-7897-43a0-93b9-53217b84fde6`){let{id:t}=e;return(...e)=>{this.target.postMessage({$SCOPE:gr,id:t,args:e},`*`)}}else if(Array.isArray(e))return e.map(this.hydrate_value_.bind(this));else if(typeof e==`object`&&e){let t={};for(let n in e)t[n]=this.hydrate_value_(e[n]);return t}return e}},br=class{constructor(){this.rpc=new xr}},xr=class{constructor(){this.callbackManager=new _r,this.callbackManager.attach_to_source(globalThis)}getDehydrator(){return new vr({callbackManager:this.callbackManager})}getHydrator({target:e}){return new yr({target:e})}registerCallback(e){return this.callbackManager.register_callback(e)}send(e,t,...n){e.postMessage({$SCOPE:gr,id:t,args:n},`*`)}},Sr=class{constructor(e){this.authToken=e}async create(e,t,n){if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{throw`Authentication failed.`}let r;if(typeof n==`object`||n===void 0){let t=puter.whoami||await puter.getUser();if(t.is_user_token&&(n===void 0||n?.sandbox!==!1)){let n;try{n=await puter.apps.get(`sandbox-${e}`)}catch{n=await puter.apps.create(`sandbox-${e}`,`https://worker-sandbox.puter.com/`)}if(n.owner.uuid!==t.uuid)throw Error(`Sandbox context is not owned by you! This worker's sandbox is currently owned by: ${n.owner.username}`);r=n.uid}}typeof n==`string`&&(r=(await puter.apps.list()).find(e=>e.name===n).uid),e=e.toLocaleLowerCase();let i=await puter.kv.get(`user-workers`);i||={},t=F(t);let a=await N([`authorization`,`filePath`,`workerName`,`appId`],`workers`,`worker-service`,`create`)(puter.authToken,t,e,r);if(!a.success)throw Error(a?.errors||`Driver failed to execute, do you have the necessary permissions?`);return i[e]={filePath:t,url:a.url,deployTime:Date.now(),createTime:Date.now()},await puter.kv.set(`user-workers`,i),a}async exec(...e){if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{throw`Authentication failed.`}let t=new Request(...e);return!t.headers.get(`puter-auth`)&&!t.headers.get(`x-puter-no-auth`)&&t.headers.set(`puter-auth`,puter.authToken),t.headers.delete(`x-puter-no-auth`),fetch(t)}async list(){if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{throw`Authentication failed.`}return await N([],`workers`,`worker-service`,`getFilePaths`)()}async get(e){if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{throw`Authentication failed.`}return e=e.toLocaleLowerCase(),(await N([`workerName`],`workers`,`worker-service`,`getFilePaths`)(e))[0]}async delete(e){if(!puter.authToken&&puter.env===`web`)try{await puter.ui.authenticateWithPuter()}catch{throw`Authentication failed.`}e=e.toLocaleLowerCase();let t=await N([`authorization`,`workerName`],`workers`,`worker-service`,`destroy`)(puter.authToken,e);if(t.result){let t=await puter.kv.get(`user-workers`);return t||={},delete t[e],await puter.kv.set(`user-workers`,t),!0}else throw t.result,Error(t?.errors||`Driver failed to execute, do you have the necessary permissions?`)}async getLoggingHandle(e){let t=await N([],`workers`,`worker-service`,`getLoggingUrl`)(puter.authToken,e),n=new WebSocket(`${t}/${puter.authToken}/${e}`),r=new EventTarget;return r.onLog=e=>{},Object.defineProperty(r,"start",{enumerable:!1,value:async e=>{n.addEventListener(`message`,t=>{e.enqueue(JSON.parse(t.data))}),n.addEventListener(`close`,()=>{try{e.close()}catch{}})}}),Object.defineProperty(r,"cancel",{enumerable:!1,value:async()=>{n.close()}}),n.addEventListener(`message`,e=>{let t=new MessageEvent(`log`,{data:JSON.parse(e.data)});r.dispatchEvent(t),r.onLog(t)}),r.close=n.close,new Promise((e,t)=>{let i=!1;n.onopen=()=>{i=!0,e(r)},n.onerror=()=>{i||t(`Failed to open logging connection`)}})}},Cr=class extends Event{conn;user;constructor(e,t){super(`connection`),this.conn=e,this.user=t}},wr=class extends Event{data;constructor(e){super(`message`),this.data=e}},Tr=class extends Event{constructor(){super(`open`)}},Er=class extends Event{reason;constructor(e=void 0){super(`close`),this.reason=e}},Dr=class extends Event{error;constructor(e){super(`error`),this.error=e}},Or=class extends EventTarget{#e;#t;connections=new Map;inviteCode;#n;constructor(e){super(),this.#n=e,this.#e=new WebSocket(e.signallerUrl)}async start(){await new Promise((e,t)=>{this.#e.onopen=e,this.#e.onerror=t,this.#e.onclose=()=>{t(Error(`Connection closed unexpectedly`))}}),this.#e.onmessage=e=>{let t=JSON.parse(e.data);this.#r(t)},this.#e.onclose=()=>{},this.#e.send(JSON.stringify({server:{create:{authToken:this.#n.authToken}}}));let{inviteCode:e}=await new Promise((e,t)=>{this.#t=n=>{n.success?(e({inviteCode:n.invitecode}),this.#t=null,this.inviteCode=n.invitecode):t(Error(n.error))},setTimeout(()=>t(Error(`Server creation timed out`)),15e3)});return e}async#r(e){if(e.server){if(e.server.create){this.#t(e.server.create);return}if(e.server.connect){let t=e.server.connect.id,n=new kr(this.#n);this.connections.set(t,n),n.peerconnection.onicecandidate=e=>{e.candidate&&this.#e.send(JSON.stringify({server:{candidate:{id:t,candidate:e.candidate}}}))},this.dispatchEvent(new Cr(n,e.server.connect.user))}if(e.server.candidate){let t=e.server.candidate.id,n=this.connections.get(t);n&&await n.addIceCandidate(e.server.candidate.candidate)}if(e.server.offer){let t=e.server.offer.id,n=this.connections.get(t);n&&await n.setRemoteDescription(new RTCSessionDescription(e.server.offer.offer));let r=await n.createAnswer();this.#e.send(JSON.stringify({server:{answer:{id:t,answer:r}}}))}}}close(){for(let[e,t]of this.connections)t.close();this.#e.onclose=null,this.#e.close()}},kr=class extends EventTarget{#e;peerconnection;owner;#t;#n;connected=!1;closed=!1;#r=[];constructor(e){super(),this.#t=e,this.peerconnection=new RTCPeerConnection({iceServers:e.iceServers}),this.#n=this.peerconnection.createDataChannel(`channel-1`,{negotiated:!0,id:2}),this.#n.onmessage=e=>{this.dispatchEvent(new wr(e.data))},this.#n.onopen=()=>{this.connected=!0;for(let e of this.#r)this.send(e);this.#r=[],this.dispatchEvent(new Tr),this.#i()},this.#n.onclose=()=>{this.#a(void 0,void 0)},this.#n.onerror=e=>{this.#a(void 0,e.error)}}#i(){this.#e&&=(this.#e.onclose=null,this.#e.close(),null)}async connect(e){this.#e=new WebSocket(this.#t.signallerUrl),await new Promise((e,t)=>{this.#e.onopen=e,this.#e.onerror=t,this.#e.onclose=()=>{t(Error(`Connection closed unexpectedly`))}}),this.#e.onopen=null,this.#e.onerror=null,this.#e.onclose=()=>{this.#a(void 0,Error(`Connection closed unexpectedly before peer offer was sent`))},this.#e.send(JSON.stringify({client:{connect:{authToken:this.#t.authToken,invitecode:e}}})),this.peerconnection.onicecandidate=e=>{this.#e.send(JSON.stringify({client:{candidate:{candidate:e.candidate}}}))},this.#e.onmessage=async e=>{let t=JSON.parse(e.data).client;if(t){if(t.answer&&this.setRemoteDescription(t.answer.answer),t.candidate&&this.addIceCandidate(t.candidate.candidate),t.connect)if(t.connect.success){this.owner=t.connect.owner;let e=await this.createOffer();this.#e.send(JSON.stringify({client:{offer:{offer:e}}}))}else this.#a(void 0,Error(t.connect.error));t.disconnect&&!this.connected&&this.#a(t.disconnect.reason)}}}#a(e,t){this.closed||(this.closed=!0,this.connected=!1,this.#e&&this.#i(),this.#n&&(this.#n.onclose=null,this.#n.close()),this.peerconnection&&this.peerconnection.close(),t&&this.dispatchEvent(new Dr(t)),this.dispatchEvent(new Er(e)))}close(e){this.#a(e,void 0)}async createOffer(){let e=await this.peerconnection.createOffer();return await this.peerconnection.setLocalDescription(e),e}async createAnswer(){let e=await this.peerconnection.createAnswer();return await this.peerconnection.setLocalDescription(e),e}async setRemoteDescription(e){await this.peerconnection.setRemoteDescription(e)}async addIceCandidate(e){await this.peerconnection.addIceCandidate(e)}send(e){if(!this.connected){this.#r.push(e);return}this.#n.send(e)}},Ar=class{#e;#t;#n;#r;#i;#a;constructor(e){this.puter=e,this.authToken=e.authToken,this.APIOrigin=e.APIOrigin,this.appID=e.appID}setAuthToken(e){this.authToken=e}setAPIOrigin(e){this.APIOrigin=e}async ensureTurnRelays(){if(this.#a||this.#t&&Date.now()-this.#i<this.#r*1e3)return;let e=await fetch(`${this.APIOrigin}/peer/generate-turn`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${this.authToken}`}});if(!e.ok){this.#a=!0;return}let{iceServers:t,ttl:n,fallbackIce:r}=await e.json();this.#n=r,this.#t=t,this.#r=n,this.#i=Date.now()}async#o(){if(this.#e)return;let e=await fetch(`${this.APIOrigin}/peer/signaller-info`);if(!e.ok)throw Error(`Failed to get signaller info from Puter.`);let{url:t}=await e.json();this.#e=t}async#s(e){if(!(this.authToken||this.puter.env!==`web`))try{await this.puter.ui.authenticateWithPuter()}catch{throw Error(`Need authentication to ${e} but failed to authenticate with Puter.`)}}async#c(e){await this.#o();let t;return e?.iceServers?t=e.iceServers:(await this.ensureTurnRelays(),this.#t?t=this.#t:(t=this.#n,console.warn(`Unable to use TURN relays. Some connections may fail.`))),{authToken:this.authToken,iceServers:t,signallerUrl:this.#e}}async serve(e){await this.#s(`create a server`);let t=new Or(await this.#c(e));return await t.start(),t}async connect(e,t){await this.#s(`connect to a server`);let n=new kr(await this.#c(t));return await n.connect(e),n}},Y=class extends (globalThis.HTMLElement||Object){constructor(){super(),globalThis.HTMLElement!==void 0&&this.attachShadow({mode:`open`})}connectedCallback(){this._setupThemeWatchers(),this._applyTheme(),this._rerender()}disconnectedCallback(){this._teardownThemeWatchers()}_setupThemeWatchers(){globalThis.MutationObserver!==void 0&&!this._themeObserver&&(this._themeObserver=new globalThis.MutationObserver(()=>this._applyTheme()),this._themeObserver.observe(this,{attributes:!0,attributeFilter:[`theme`]})),typeof globalThis.matchMedia==`function`&&!this._themeMediaQuery&&(this._themeMediaQuery=globalThis.matchMedia(`(prefers-color-scheme: dark)`),this._themeMediaListener=()=>this._applyTheme(),this._themeMediaQuery.addEventListener&&this._themeMediaQuery.addEventListener(`change`,this._themeMediaListener))}_teardownThemeWatchers(){this._themeObserver&&=(this._themeObserver.disconnect(),null),this._themeMediaQuery&&this._themeMediaListener&&this._themeMediaQuery.removeEventListener&&this._themeMediaQuery.removeEventListener(`change`,this._themeMediaListener),this._themeMediaQuery=null,this._themeMediaListener=null}_applyTheme(){if(typeof this.getAttribute!=`function`)return;let e=this.getAttribute(`theme`),t;t=e===`dark`||e!==`light`&&typeof globalThis.matchMedia==`function`&&globalThis.matchMedia(`(prefers-color-scheme: dark)`).matches,this.classList.toggle(`puter-theme-dark`,t)}_rerender(){this.shadowRoot&&(this.shadowRoot.innerHTML=`<style>${this.getStyles()}</style>${this.render()}`,this.onReady())}getStyles(){return``}render(){return``}onReady(){}emitEvent(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}$(e){return this.shadowRoot?.querySelector(e)}$$(e){return this.shadowRoot?.querySelectorAll(e)}open(){let e=this.$(`dialog`);e&&!e.open&&e.showModal()}close(){let e=this.$(`dialog`);e&&e.close(),this.remove()}},X=`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;`${X}`;var jr=`
    /* Base button */
    .btn {
        color: #666666;
        font-size: 14px;
        text-align: center;
        line-height: 35px;
        height: 35px;
        padding: 0 30px;
        margin: 0;
        display: inline-block;
        appearance: none;
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid #b9b9b9;
        background: linear-gradient(#f6f6f6, #e1e1e1);
        box-shadow: inset 0px 1px 0px rgb(255 255 255 / 30%), 0 1px 2px rgb(0 0 0 / 15%);
        border-radius: 4px;
        outline: none;
        font-family: ${X};
    }
    .btn:active {
        background-color: #eeeeee;
        border-color: #cfcfcf;
        color: #a9a9a9;
        box-shadow: inset 0px 2px 3px rgb(0 0 0 / 36%), 0px 1px 0px white;
    }
    .btn:focus-visible {
        border-color: rgb(118 118 118);
    }

    /* Primary button */
    .btn-primary {
        border-color: #088ef0;
        background: linear-gradient(#34a5f8, #088ef0);
        color: white;
    }
    .btn-primary:active {
        background-color: #2798eb;
        border-color: #2798eb;
        color: #bedef5;
    }

    /* Danger button */
    .btn-danger {
        border-color: #f00808;
        background: linear-gradient(#ff4e4e, #ff4c4c);
        color: white;
    }

    /* Action/success button */
    .btn-success, .btn-action {
        border-color: #08bf4e;
        background: linear-gradient(#29d55d, #1ccd60);
        color: white;
    }

    /* Default button */
    .btn-default {
        color: #666666;
        border: 1px solid #b9b9b9;
        background: linear-gradient(#f6f6f6, #e1e1e1);
        box-shadow: inset 0px 1px 0px rgb(255 255 255 / 30%), 0 1px 2px rgb(0 0 0 / 15%);
    }

    /* Block button (full width) */
    .btn-block {
        width: 100%;
    }

    /* Normal size */
    .btn-normal {
        font-size: 16px;
        height: 40px;
        line-height: 38px;
        padding: 0 40px;
    }

    /* Disabled */
    .btn:disabled, .btn.disabled {
        background: #EEE !important;
        border: 1px solid #DDD !important;
        text-shadow: 0 1px 1px white !important;
        color: #CCC !important;
        cursor: default !important;
        pointer-events: none;
    }
`,Mr=e=>`data:image/svg+xml;base64,${btoa(e)}`,Nr={error:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#e53935"/>
  <rect x="22" y="12" width="4" height="16" rx="2" fill="#ffffff"/>
  <circle cx="24" cy="34" r="2.5" fill="#ffffff"/>
</svg>`,warning:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M24 5 L44 40 L4 40 Z" fill="#ffc107" stroke="#e0a800" stroke-width="1.5" stroke-linejoin="round"/>
  <rect x="22" y="18" width="4" height="12" rx="2" fill="#3f3f3f"/>
  <circle cx="24" cy="35" r="2" fill="#3f3f3f"/>
</svg>`,info:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2196f3"/>
  <circle cx="24" cy="14" r="2.5" fill="#ffffff"/>
  <rect x="22" y="20" width="4" height="16" rx="2" fill="#ffffff"/>
</svg>`,success:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#4caf50"/>
  <path d="M14 24 L21 31 L34 17" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,confirm:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2196f3"/>
  <path d="M18.5 18.5 Q18.5 12.5 24 12.5 Q29.5 12.5 29.5 18 Q29.5 22 25.5 24 Q24 24.8 24 27.5" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="34" r="2.25" fill="#ffffff"/>
</svg>`},Pr={error:Mr(Nr.error),warning:Mr(Nr.warning),info:Mr(Nr.info),success:Mr(Nr.success),confirm:Mr(Nr.confirm)},Fr=class extends Y{#e=null;#t=null;get buttons(){return this.#e}set buttons(e){this.#e=e}get options(){return this.#t}set options(e){this.#t=e}getStyles(){return`
            dialog {
                background: transparent;
                border: none;
                box-shadow: none;
                outline: none;
                padding: 0;
                max-width: 90vw;
            }
            dialog::backdrop {
                background: rgba(0, 0, 0, 0.5);
            }
            .alert-body {
                background-color: rgba(231, 238, 245, .95);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                border: none;
                border-radius: 4px;
                padding: 32px;
                box-shadow: 0px 0px 15px #00000066;
                font-family: ${X};
                color: #414650;
                width: 350px;
                max-width: calc(100vw - 32px);
                box-sizing: border-box;
                text-align: center;
            }
            .alert-icon {
                width: 64px;
                height: 64px;
                margin: 10px auto 20px;
                display: block;
            }
            .message {
                font-size: 15px;
                line-height: 1.5;
                color: #414650;
                text-shadow: 1px 1px #ffffff52;
                text-align: center;
                margin-top: 10px;
                margin-bottom: 20px;
            }
            .message p { margin: 0 0 10px; }
            .message p:last-child { margin-bottom: 0; }
            .buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 10px;
            }
            button {
                width: 100%;
                height: 35px;
                line-height: 35px;
                padding: 0;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
                cursor: pointer;
                font-family: ${X};
                box-sizing: border-box;
                outline: none;
                color: #666666;
                border: 1px solid #b9b9b9;
                background: linear-gradient(#f6f6f6, #e1e1e1);
            }
            button:active {
                background-color: #eeeeee;
                border-color: #cfcfcf;
                color: #a9a9a9;
                box-shadow: inset 0px 2px 3px rgb(0 0 0 / 36%), 0px 1px 0px white;
            }
            button:focus-visible {
                border-color: rgb(118 118 118);
            }
            .btn-primary {
                background: linear-gradient(#34a5f8, #088ef0);
                border: 1px solid #088ef0;
                color: white;
            }
            .btn-primary:active {
                background-color: #2798eb;
                border-color: #2798eb;
                color: #bedef5;
            }
            .btn-danger {
                background: linear-gradient(#ff4e4e, #ff4c4c);
                border: 1px solid #f00808;
                color: white;
            }
            .btn-success {
                background: linear-gradient(#29d55d, #1ccd60);
                border: 1px solid #08bf4e;
                color: white;
            }
            .btn-warning {
                background: linear-gradient(#ffb74d, #ffa000);
                border: 1px solid #ffa000;
                color: #333;
            }
            .btn-info {
                background: linear-gradient(#42a5f5, #1976d2);
                border: 1px solid #1976d2;
                color: white;
            }
            .btn-default {
                color: #666666;
                border: 1px solid #b9b9b9;
                background: linear-gradient(#f6f6f6, #e1e1e1);
            }
            @media (max-width: 480px) {
                .alert-body {
                    width: 100%;
                    padding: 24px 20px;
                }
                button {
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                }
            }
        `}render(){let e=this.getAttribute(`message`)||``,t=this.#t?.type||this.getAttribute(`type`)||``,n=this.#t?.body_icon||this.#t?.icon||this.getAttribute(`icon`)||Pr[t]||Pr.info,r=this.#e||[{label:`OK`,value:!0,type:`primary`}],i=`<img class="alert-icon" src="${this._escapeAttr(n)}" alt="">`,a=r.map((e,t)=>{let n=e.type||(t===r.length-1?`primary`:`default`),i=e.value===void 0?e.label:e.value;return`<button class="btn-${n}" data-value="${this._escapeAttr(String(i))}">${this._escapeHTML(e.label)}</button>`}).join(``);return`
            <dialog>
                <div class="alert-body">
                    ${i}
                    <div class="message">${this._renderMessage(e)}</div>
                    <div class="buttons">${a}</div>
                </div>
            </dialog>`}onReady(){let e=this.$(`dialog`),t=this.#e||[{label:`OK`,value:!0,type:`primary`}];this.$$(`button`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.dataset.value,r=t.find(e=>String(e.value===void 0?e.label:e.value)===n);this.emitEvent(`response`,r?r.value===void 0?r.label:r.value:n),this.close()})}),e.addEventListener(`click`,t=>{t.target===e&&(this.emitEvent(`response`,void 0),this.close())});let n=this.$$(`button`);n.length>0&&n[n.length-1].focus()}_renderMessage(e){return this._escapeHTML(e).replace(/&lt;strong&gt;/g,`<strong>`).replace(/&lt;\/strong&gt;/g,`</strong>`).replace(/&lt;p&gt;/g,`<p>`).replace(/&lt;\/p&gt;/g,`</p>`).replace(/&lt;br\s*\/?&gt;/g,`<br>`)}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}_escapeAttr(e){return String(e).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}},Ir=class extends Y{#e=null;get options(){return this.#e}set options(e){this.#e=e}getStyles(){return`
            dialog {
                background: transparent;
                border: none;
                box-shadow: none;
                outline: none;
                padding: 0;
                max-width: 90vw;
            }
            dialog::backdrop {
                background: rgba(0, 0, 0, 0.5);
            }
            .prompt-body {
                background-color: rgba(231, 238, 245, .95);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                border: none;
                border-radius: 8px;
                padding: 32px;
                box-shadow: 0px 0px 15px #00000066;
                font-family: ${X};
                color: #414650;
                width: 450px;
                max-width: calc(100vw - 32px);
                box-sizing: border-box;
            }
            @media (max-width: 480px) {
                .prompt-body {
                    width: 100%;
                    padding: 24px 20px;
                }
                input[type="text"] {
                    padding: 12px;
                    font-size: 16px;
                }
                input[type="text"]:focus {
                    padding: 11px;
                }
                button {
                    padding: 14px 20px;
                    font-size: 16px;
                }
                .btn-ok {
                    flex: 1;
                }
                .btn-cancel {
                    flex: 1;
                }
            }
            .message {
                font-size: 15px;
                line-height: 1.5;
                color: #414650;
                text-shadow: 1px 1px #ffffff52;
                text-align: left;
            }
            .input-container {
                margin-top: 20px;
            }
            input[type="text"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                color: #393f46;
                font-size: 14px;
                font-family: ${X};
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.15s;
            }
            input[type="text"]:focus {
                border: 2px solid #01a0fd;
                padding: 7px;
            }
            .buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }
            .btn-cancel {
                background: linear-gradient(#f6f6f6, #e1e1e1);
                border: 1px solid #b9b9b9;
                color: #666666;
                border-radius: 4px;
                height: 35px;
                line-height: 35px;
                padding: 0 24px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                font-family: ${X};
                box-shadow: inset 0px 1px 0px rgb(255 255 255 / 30%), 0 1px 2px rgb(0 0 0 / 15%);
            }
            .btn-cancel:active {
                background-color: #eeeeee;
                border-color: #cfcfcf;
                color: #a9a9a9;
                box-shadow: inset 0px 2px 3px rgb(0 0 0 / 36%), 0px 1px 0px white;
            }
            .btn-ok {
                background: linear-gradient(#34a5f8, #088ef0);
                border: 1px solid #088ef0;
                color: white;
                border-radius: 4px;
                height: 35px;
                line-height: 35px;
                padding: 0 24px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                font-family: ${X};
                min-width: 110px;
                box-shadow: inset 0px 1px 0px rgb(255 255 255 / 30%), 0 1px 2px rgb(0 0 0 / 15%);
            }
            .btn-ok:active {
                background-color: #2798eb;
                border-color: #2798eb;
                color: #bedef5;
            }
            button:focus-visible {
                outline: 2px solid #01a0fd;
                outline-offset: 2px;
            }
        `}render(){let e=this.getAttribute(`message`)||``,t=this.getAttribute(`placeholder`)||``,n=this.getAttribute(`default-value`)||``;return`
            <dialog>
                <div class="prompt-body">
                    <div class="message">${this._escapeHTML(e)}</div>
                    <div class="input-container">
                        <input type="text" class="prompt-input" placeholder="${this._escapeAttr(t)}" value="${this._escapeAttr(n)}">
                    </div>
                    <div class="buttons">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-ok">OK</button>
                    </div>
                </div>
            </dialog>`}onReady(){let e=this.$(`dialog`),t=this.$(`.prompt-input`),n=this.$(`.btn-ok`),r=this.$(`.btn-cancel`);setTimeout(()=>t.focus(),30),t.addEventListener(`keydown`,e=>{e.key===`Enter`?(this.emitEvent(`response`,t.value),this.close()):e.key===`Escape`&&(this.emitEvent(`response`,!1),this.close())}),n.addEventListener(`click`,()=>{this.emitEvent(`response`,t.value),this.close()}),r.addEventListener(`click`,()=>{this.emitEvent(`response`,!1),this.close()}),e.addEventListener(`click`,t=>{t.target===e&&(this.emitEvent(`response`,!1),this.close())})}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}_escapeAttr(e){return e?e.replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}},Z=[],Lr=12,Rr=24,zr=16;function Br(){let e=Rr;for(let t of Z)t.style.top=`${e}px`,e+=t.offsetHeight+Lr}var Vr={info:{bg:`linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)`,color:`#0284c7`},success:{bg:`linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)`,color:`#16a34a`},warning:{bg:`linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)`,color:`#d97706`},error:{bg:`linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)`,color:`#dc2626`},default:{bg:`linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)`,color:`#7c3aed`}},Hr={info:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`,success:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`,warning:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,error:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,default:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`},Ur=class extends Y{getStyles(){return`
            :host {
                position: fixed;
                right: ${zr}px;
                z-index: 999999;
                pointer-events: auto;
                transition: top 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                            opacity 0.3s ease,
                            transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .notification {
                width: 320px;
                border-radius: 11px;
                min-height: 54px;
                background: #ffffffcd;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                box-shadow: 0px 0px 17px -9px #000;
                border: 1px solid #d5d5d5;
                margin-bottom: 10px;
                display: flex;
                flex-direction: row;
                font-family: ${X};
                cursor: pointer;
                position: relative;
            }
            .notification:hover .close-btn {
                display: block;
            }
            .close-btn {
                position: absolute;
                background: white;
                border: none;
                border-radius: 100%;
                top: -6px;
                left: -6px;
                width: 13px;
                height: 13px;
                padding: 2px;
                filter: drop-shadow(0px 0px 0.5px rgb(51, 51, 51));
                display: none;
                cursor: pointer;
                font-size: 9px;
                line-height: 1;
                text-align: center;
                color: #666;
                z-index: 1;
            }
            .close-btn:hover {
                background: #f0f0f0;
                color: #222;
            }
            .icon-area {
                width: 40px;
                margin: 10px 5px 10px 15px;
                border-radius: 50%;
                filter: drop-shadow(0px 0px 0.5px rgb(51, 51, 51));
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .icon-area svg {
                width: 35px;
                height: 35px;
            }
            .icon-area img {
                width: 35px;
                height: 35px;
                object-fit: contain;
                border-radius: 50%;
            }
            :host([round-icon]) .icon-area img {
                border-radius: 50%;
            }
            .content {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                padding: 10px;
                min-width: 0;
            }
            .title {
                font-size: 12px;
                font-weight: 600;
                color: #333;
                line-height: 1.3;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .text {
                font-size: 12px;
                color: #555;
                margin-top: 4px;
                line-height: 1.4;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            /* Entrance animation */
            :host(.entering) {
                transform: translateX(110%) scale(0.95);
                opacity: 0;
            }
            :host(.visible) {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            /* Exit animation */
            :host(.exiting) {
                transform: translateX(110%) scale(0.95);
                opacity: 0;
            }
            @media (max-width: 480px) {
                :host {
                    right: 10px;
                    left: 10px;
                }
                .notification {
                    width: auto;
                }
            }
            :host(.puter-theme-dark) .notification {
                background: #2d2d2dcd;
                border-color: #3a3a3a;
                box-shadow: 0px 0px 17px -6px #000;
            }
            :host(.puter-theme-dark) .close-btn {
                background: #3a3a3a;
                color: #ccc;
                filter: drop-shadow(0px 0px 0.5px rgb(230, 230, 230));
            }
            :host(.puter-theme-dark) .close-btn:hover {
                background: #4a4a4a;
                color: #fff;
            }
            :host(.puter-theme-dark) .icon-area {
                filter: drop-shadow(0px 0px 0.5px rgb(230, 230, 230));
            }
            :host(.puter-theme-dark) .title {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .text {
                color: #b0b0b0;
            }
        `}render(){let e=this.getAttribute(`title`)||``,t=this.getAttribute(`text`)||``,n=this.getAttribute(`icon`)||``,r=this.getAttribute(`type`)||`default`,i;if(n)i=`<div class="icon-area"><img src="${this._escapeAttr(n)}" alt=""></div>`;else{let e=Vr[r]||Vr.default,t=Hr[r]||Hr.default;i=`<div class="icon-area" style="color: ${e.color}">${t}</div>`}return`
            <div class="notification">
                ${i}
                <div class="content">
                    ${e?`<div class="title">${this._escapeHTML(e)}</div>`:``}
                    ${t?`<div class="text">${this._escapeHTML(t)}</div>`:``}
                </div>
                <button class="close-btn" aria-label="Close">\u2715</button>
            </div>`}onReady(){Z.push(this),this.classList.add(`entering`),requestAnimationFrame(()=>{Br(),requestAnimationFrame(()=>{this.classList.remove(`entering`),this.classList.add(`visible`)})}),this.$(`.close-btn`).addEventListener(`click`,e=>{e.stopPropagation(),this._dismiss()}),this.$(`.notification`).addEventListener(`click`,()=>{this.emitEvent(`click`,{})});let e=parseInt(this.getAttribute(`duration`)??`5000`,10);e>0&&(this._dismissTimer=setTimeout(()=>this._dismiss(),e))}_dismiss(){this._dismissed||(this._dismissed=!0,this._dismissTimer&&clearTimeout(this._dismissTimer),this.classList.remove(`visible`),this.classList.add(`exiting`),setTimeout(()=>{let e=Z.indexOf(this);e!==-1&&Z.splice(e,1),Br(),this.emitEvent(`close`,{}),this.remove()},350))}disconnectedCallback(){super.disconnectedCallback(),this._dismissTimer&&clearTimeout(this._dismissTimer);let e=Z.indexOf(this);e!==-1&&Z.splice(e,1)}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}_escapeAttr(e){return e?e.replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}},Wr=class e extends Y{#e=[];#t=null;#n=null;#r=null;#i=[];#a=null;#o=`right`;#s=``;#c=null;#l=null;#u=null;get items(){return this.#e}set items(e){this.#e=e||[],this.shadowRoot&&this.isConnected&&this._rerender()}getStyles(){return`
            :host {
                position: fixed;
                z-index: 9999999999;
            }

            /* .context-menu — lines 1647-1666 of style.css */
            .context-menu {
                overflow: hidden;
                white-space: nowrap;
                font-family: sans-serif;
                background: #FFF;
                color: #333;
                border-radius: 4px;
                padding: 3px 0;
                min-width: 200px;
                background-color: rgb(255 255 255 / 92%);
                backdrop-filter: blur(3px);
                border: 1px solid #e6e4e466;
                box-shadow: 0px 3px 10px #00000044;
                margin-top: 5px;
                padding-left: 4px;
                padding-right: 4px;
                padding-top: 4px;
                padding-bottom: 4px;
                user-select: none;
                -webkit-user-select: none;
            }

            /* .context-menu-item:not(.context-menu-divider) — lines 1686-1694 */
            .menu-item {
                display: flex;
                align-items: center;
                padding: 5px;
                list-style-type: none;
                user-select: none;
                -webkit-user-select: none;
                font-size: 12px;
                height: 25px;
                box-sizing: border-box;
                position: relative;
                cursor: default;
                white-space: nowrap;
                color: #333;
            }

            /* .context-menu-item-active:not(.context-menu-divider) — lines 1742-1745 */
            .menu-item:hover:not(.disabled):not(.divider),
            .menu-item.focused:not(.disabled):not(.divider),
            .menu-item.has-open-submenu {
                background-color: hsl(213, 74%, 56%);
                color: white;
                border-radius: 4px;
            }

            /* Active item turns all children white.
               For .has-open-submenu the :hover branch above already covers
               the hovered case; in the non-hovered grey state we want the
               children to keep their default colors, so we don't include
               .has-open-submenu here. */
            .menu-item:hover:not(.disabled):not(.divider) .icon,
            .menu-item:hover:not(.disabled):not(.divider) .check,
            .menu-item:hover:not(.disabled):not(.divider) .submenu-arrow,
            .menu-item:hover:not(.disabled):not(.divider) .label,
            .menu-item:hover:not(.disabled):not(.divider) .shortcut,
            .menu-item.focused:not(.disabled):not(.divider) .icon,
            .menu-item.focused:not(.disabled):not(.divider) .check,
            .menu-item.focused:not(.disabled):not(.divider) .submenu-arrow,
            .menu-item.focused:not(.disabled):not(.divider) .label,
            .menu-item.focused:not(.disabled):not(.divider) .shortcut {
                color: white;
            }
            .menu-item:hover:not(.disabled):not(.divider) .icon svg,
            .menu-item.focused:not(.disabled):not(.divider) .icon svg {
                filter: brightness(0) invert(1);
            }
            .menu-item:hover:not(.disabled):not(.divider) .icon img,
            .menu-item.focused:not(.disabled):not(.divider) .icon img {
                filter: brightness(0) invert(1);
            }

            /* Safe-triangle: while the cursor traces a diagonal path toward
               an open submenu, suppress :hover highlight on intermediate
               items so they don't flash blue.
               Keyboard-nav: after a keyboard navigation, suppress :hover on
               the (now stale) item the mouse is still resting on so only
               the keyboard-focused item highlights. Cleared on next
               mousemove. .focused and .has-open-submenu (managed by JS)
               still highlight normally. */
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider),
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) {
                background-color: transparent;
                color: #333;
            }
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon,
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .check,
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .submenu-arrow,
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .label,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .check,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .submenu-arrow,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .label {
                color: #333;
            }
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .shortcut,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .shortcut {
                color: #999;
            }
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon svg,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon svg {
                filter: none;
            }
            .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon img,
            .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon img {
                filter: drop-shadow(0px 0px 0.3px rgb(51, 51, 51));
            }

            /* .has-open-context-menu-submenu — line 1738-1739 */
            .menu-item.has-open-submenu:not(:hover) {
                background-color: #dfdfdf;
                color: #333;
            }
            .menu-item.has-open-submenu:not(:hover) .icon,
            .menu-item.has-open-submenu:not(:hover) .icon svg,
            .menu-item.has-open-submenu:not(:hover) .icon img {
                filter: none;
                color: #333;
            }

            /* .context-menu-item-disabled — lines 1753-1758 */
            .menu-item.disabled {
                opacity: 0.5;
                background-color: transparent;
                color: initial;
                cursor: initial;
            }

            /* Danger items: no special color in puter.com default theme */
            .menu-item.danger {
                color: #333;
            }
            .menu-item.danger .icon {
                color: #333;
            }

            /* .context-menu-divider — lines 1681-1684 */
            .divider {
                padding-top: 5px;
                padding-bottom: 5px;
                cursor: default;
                height: auto;
            }
            .divider hr {
                border: none;
                background: #ccc;
                height: 1px;
                width: 100%;
                margin: 0;
            }

            /* .context-menu-item-icon — lines 1760-1767 */
            .icon {
                display: inline-block;
                width: 20px;
                text-align: center;
                margin-right: 5px;
                font-size: 14px;
                line-height: 5px;
                flex-shrink: 0;
                color: #333;
            }
            .icon svg {
                width: 15px;
                height: 15px;
                vertical-align: middle;
            }
            /* .ctx-item-icon — lines 1696-1703 */
            .icon img {
                width: 15px;
                height: 15px;
                object-fit: contain;
                filter: drop-shadow(0px 0px 0.3px rgb(51, 51, 51));
            }

            .label {
                flex: 1;
                font-weight: 400;
            }

            .check {
                width: 20px;
                text-align: center;
                margin-right: 5px;
                flex-shrink: 0;
                font-size: 14px;
                line-height: 5px;
                color: #333;
            }

            /* .submenu-arrow — lines 1705-1709 */
            .submenu-arrow {
                width: 15px;
                height: 15px;
                float: right;
                flex-shrink: 0;
                color: #555;
            }

            .shortcut {
                margin-left: 16px;
                font-size: 11px;
                color: #999;
                flex-shrink: 0;
                letter-spacing: 0.5px;
            }

            /* === iOS-style action sheet (mobile) ========================= */
            :host(.sheet-mode) {
                left: 0 !important;
                right: 0 !important;
                top: auto !important;
                bottom: 0 !important;
                padding: 0 8px calc(8px + env(safe-area-inset-bottom)) 8px;
                box-sizing: border-box;
                animation: puter-sheet-in 260ms cubic-bezier(0.22, 1, 0.36, 1);
            }

            :host(.sheet-mode.sheet-closing) {
                animation: puter-sheet-out 240ms cubic-bezier(0.4, 0, 1, 1) forwards;
            }

            @keyframes puter-sheet-in {
                from { transform: translateY(100%); }
                to   { transform: translateY(0); }
            }

            @keyframes puter-sheet-out {
                from { transform: translateY(0); }
                to   { transform: translateY(100%); }
            }

            :host(.sheet-mode) .context-menu {
                min-width: 0;
                width: 100%;
                border-radius: 14px;
                padding: 6px 0;
                background-color: rgb(255 255 255 / 96%);
                border: none;
                box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.18);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                             Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
            }

            :host(.sheet-mode) .menu-item {
                height: auto;
                min-height: 48px;
                padding: 12px 16px;
                font-size: 16px;
                border-radius: 0;
            }

            /* Keyboard shortcuts have no meaning on touch / small-screen
               devices — hide them so labels can use the full width. */
            @media (max-width: 480px), (pointer: coarse) {
                .shortcut {
                    display: none;
                }
            }

            :host(.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) {
                background-color: rgba(0, 122, 255, 0.1);
                color: inherit;
                border-radius: 0;
            }
            :host(.sheet-mode) .menu-item:active:not(.disabled):not(.divider) {
                background-color: rgba(0, 122, 255, 0.2);
            }
            :host(.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) .label,
            :host(.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) .icon,
            :host(.sheet-mode) .menu-item:active:not(.disabled):not(.divider) .label,
            :host(.sheet-mode) .menu-item:active:not(.disabled):not(.divider) .icon {
                color: #333;
            }
            :host(.sheet-mode) .menu-item:hover .icon svg,
            :host(.sheet-mode) .menu-item:active .icon svg,
            :host(.sheet-mode) .menu-item:hover .icon img,
            :host(.sheet-mode) .menu-item:active .icon img {
                filter: none;
            }

            :host(.sheet-mode) .divider {
                min-height: 24px;
                padding: 0;
                display: flex;
                align-items: center;
            }
            :host(.sheet-mode) .divider hr {
                background: rgba(60, 60, 67, 0.2);
            }

            :host(.sheet-mode) .icon {
                width: 24px;
                margin-right: 0px;
            }
            :host(.sheet-mode) .icon svg,
            :host(.sheet-mode) .icon img {
                width: 20px;
                height: 20px;
            }

            /* Dark theme — applied when system prefers dark and no light
               override is set, or when theme="dark" is forced. The base
               class toggles .puter-theme-dark on the host accordingly. */
            :host(.puter-theme-dark) .context-menu {
                background: #2d2d2d;
                background-color: rgb(45 45 45 / 94%);
                color: #e6e6e6;
                border-color: #00000080;
                box-shadow: 0px 0px 15px #000000aa;
            }
            :host(.puter-theme-dark) .menu-item {
                color: #e6e6e6;
            }
            /* Inactive items: icon/check/shortcut/arrow tones */
            :host(.puter-theme-dark) .icon,
            :host(.puter-theme-dark) .check {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .submenu-arrow {
                color: #b0b0b0;
            }
            :host(.puter-theme-dark) .shortcut {
                color: #888;
            }
            :host(.puter-theme-dark) .icon img {
                filter: drop-shadow(0px 0px 0.3px rgb(230, 230, 230));
            }
            /* Inactive icon SVGs use currentColor already; nothing to invert */

            /* Safe-triangle / keyboard-nav: non-active hover restored colors should match dark */
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider),
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon,
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .check,
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .submenu-arrow,
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .label,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .check,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .submenu-arrow,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .label {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .shortcut,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .shortcut {
                color: #888;
            }
            :host(.puter-theme-dark) .context-menu.safe-traverse .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon img,
            :host(.puter-theme-dark) .context-menu.keyboard-nav .menu-item:hover:not(.has-open-submenu):not(.focused):not(.disabled):not(.divider) .icon img {
                filter: drop-shadow(0px 0px 0.3px rgb(230, 230, 230));
            }

            /* Submenu-open parent (no hover): subtle dark highlight */
            :host(.puter-theme-dark) .menu-item.has-open-submenu:not(:hover) {
                background-color: #3f3f3f;
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .menu-item.has-open-submenu:not(:hover) .icon,
            :host(.puter-theme-dark) .menu-item.has-open-submenu:not(:hover) .icon svg,
            :host(.puter-theme-dark) .menu-item.has-open-submenu:not(:hover) .icon img {
                color: #e6e6e6;
            }

            /* Danger items */
            :host(.puter-theme-dark) .menu-item.danger,
            :host(.puter-theme-dark) .menu-item.danger .icon {
                color: #ff7b72;
            }

            /* Divider */
            :host(.puter-theme-dark) .divider hr {
                background: #444;
            }

            /* Sheet mode (mobile) */
            :host(.puter-theme-dark.sheet-mode) .context-menu {
                background-color: rgb(40 40 40 / 96%);
                box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.45);
            }
            :host(.puter-theme-dark.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) {
                background-color: rgba(0, 122, 255, 0.22);
            }
            :host(.puter-theme-dark.sheet-mode) .menu-item:active:not(.disabled):not(.divider) {
                background-color: rgba(0, 122, 255, 0.35);
            }
            :host(.puter-theme-dark.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) .label,
            :host(.puter-theme-dark.sheet-mode) .menu-item:hover:not(.disabled):not(.divider) .icon,
            :host(.puter-theme-dark.sheet-mode) .menu-item:active:not(.disabled):not(.divider) .label,
            :host(.puter-theme-dark.sheet-mode) .menu-item:active:not(.disabled):not(.divider) .icon {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark.sheet-mode) .divider hr {
                background: rgba(255, 255, 255, 0.15);
            }
        `}render(){return`<div class="context-menu">${this._renderItems(this.#e)}</div>`}_renderItems(e){let t=e.some(e=>e&&typeof e==`object`&&(e.icon||e.checked!==void 0));return e.map((e,n)=>{if(e===`-`||e.separator)return`<div class="menu-item divider"><hr></div>`;let r=[`menu-item`];e.disabled&&r.push(`disabled`),(e.type===`danger`||e.danger)&&r.push(`danger`);let i=e.items&&e.items.length>0,a=``;e.checked===void 0?e.icon?a=e.icon.startsWith(`<`)?`<span class="icon">${e.icon}</span>`:`<span class="icon"><img src="${this._escapeAttr(e.icon)}" alt=""></span>`:t&&(a=`<span class="icon"></span>`):a=`<span class="check">${e.checked?`✓`:``}</span>`;let o=i?`<svg class="submenu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`:``,s=e.shortcut?`<span class="shortcut">${this._escapeHTML(this._formatShortcut(e.shortcut))}</span>`:``;return`
                <div class="${r.join(` `)}" data-index="${n}" ${i?`data-has-submenu="true"`:``}>
                    ${a}
                    <span class="label">${this._escapeHTML(e.label||``)}</span>
                    ${s}
                    ${o}
                </div>`}).join(``)}onReady(){this._positionMenu(),this._bindEvents()}_positionMenu(){let e=this.$(`.context-menu`);if(!e)return;if(this._isMobile()){this.classList.add(`sheet-mode`),this.hasAttribute(`data-submenu`)||this._showBackdrop();return}let t=parseInt(this.getAttribute(`x`)||`0`,10),n=parseInt(this.getAttribute(`y`)||`0`,10);this.style.left=`${t}px`,this.style.top=`${n}px`,!this.hasAttribute(`data-parent-managed`)&&requestAnimationFrame(()=>{let n=e.getBoundingClientRect();n.right>window.innerWidth&&(this.style.left=`${Math.max(0,t-n.width)}px`),n.bottom>window.innerHeight&&(this.style.top=`${Math.max(0,window.innerHeight-n.height-10)}px`)})}_isMobile(){return window.innerWidth<=480||window.matchMedia&&window.matchMedia(`(pointer: coarse)`).matches&&window.innerWidth<768}_showBackdrop(){if(this._backdrop)return;let e=document.createElement(`div`);e.style.cssText=`
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 999999998;
            opacity: 0;
            transition: opacity 0.2s ease;
        `,document.body.appendChild(e),requestAnimationFrame(()=>{e.style.opacity=`1`}),e.addEventListener(`click`,()=>this._closeAll()),this._backdrop=e}_hideBackdrop(){if(!this._backdrop)return;let e=this._backdrop;e.style.opacity=`0`,setTimeout(()=>e.remove(),200),this._backdrop=null}_bindEvents(){this._outsideClickHandler&&document.removeEventListener(`pointerdown`,this._outsideClickHandler,!0),this._keyHandler&&document.removeEventListener(`keydown`,this._keyHandler,!0),this.#l&&=(document.removeEventListener(`mousemove`,this.#l),null),this.$$(`.menu-item.divider, .menu-item.disabled`).forEach(e=>{e.addEventListener(`mouseenter`,()=>{if(this.#t&&this._isMouseHeadingToSubmenu(this.#t.element)){this._setSafeTraverse(!0),this.#a&&=(clearTimeout(this.#a),null),this.#a=setTimeout(()=>this._submenuCloseCheck(),100);return}this._setSafeTraverse(!1),this._clearFocus(),clearTimeout(this.#n),this._cancelSubmenuClose(),this._hideActiveSubmenu()})}),this.$$(`.menu-item:not(.divider):not(.disabled)`).forEach(e=>{let t=parseInt(e.dataset.index,10),n=this.#e[t];n&&(e.addEventListener(`click`,t=>{if(t.stopPropagation(),n.items&&n.items.length>0){(!this.#t||this.#t.parentEl!==e)&&(clearTimeout(this.#n),this._cancelSubmenuClose(),this._showSubmenu(e,n.items));return}typeof n.action==`function`&&n.action(),this.emitEvent(`select`,n),this._closeAll()}),e.addEventListener(`mouseenter`,()=>{if(e.dataset.hasSubmenu===`true`){if(this.#t&&this.#t.parentEl!==e&&this._isMouseHeadingToSubmenu(this.#t.element)){this.#u=t,this._setSafeTraverse(!0),this.#a&&=(clearTimeout(this.#a),null),this.#a=setTimeout(()=>this._submenuCloseCheck(),100);return}this.#u=null,this._setSafeTraverse(!1),this._setFocusIndex(t),this._cancelSubmenuClose(),clearTimeout(this.#n),this.#t&&this.#t.parentEl!==e?this._showSubmenu(e,n.items):this.#t||(this.#n=setTimeout(()=>{this._showSubmenu(e,n.items)},200))}else if(this.#t){if(this._isMouseHeadingToSubmenu(this.#t.element)){this.#u=t,this._setSafeTraverse(!0),this.#a&&=(clearTimeout(this.#a),null),this.#a=setTimeout(()=>this._submenuCloseCheck(),100);return}this._setSafeTraverse(!1),this._setFocusIndex(t),this._scheduleSubmenuClose()}else this._setSafeTraverse(!1),this._setFocusIndex(t)}),e.addEventListener(`mouseleave`,()=>{this._isMobile()||(clearTimeout(this.#n),e.dataset.hasSubmenu===`true`&&this.#t&&this.#t.parentEl===e&&this._scheduleSubmenuClose())}))});let e=this.$(`.context-menu`);e&&e.addEventListener(`mouseleave`,()=>{this._clearFocus()}),this._outsideClickHandler=e=>{this._isEventInChain(e)||this._closeAll()},setTimeout(()=>{document.addEventListener(`pointerdown`,this._outsideClickHandler,!0)},0),this.#l=e=>{this.#i.push({x:e.clientX,y:e.clientY}),this.#i.length>3&&this.#i.shift(),this._setKeyboardNav(!1)},document.addEventListener(`mousemove`,this.#l),this._keyHandler=e=>{this.#t||this._handleKey(e)&&(this._setKeyboardNav(!0),e.preventDefault(),e.stopImmediatePropagation())},document.addEventListener(`keydown`,this._keyHandler,!0)}_handleKey(e){let t=e.key;if(e.metaKey||e.ctrlKey)return!1;switch(t){case`Escape`:return this._closeAll(),!0;case`ArrowDown`:return this._moveFocus(1),!0;case`ArrowUp`:if(!this._parentMenu){let e=this._focusableIndices();if(e.length&&this.#r===e[0])return this.dispatchEvent(new CustomEvent(`puter-menu-navigate`,{detail:{direction:`up`},bubbles:!0,composed:!0})),!0}return this._moveFocus(-1),!0;case`Home`:{let e=this._focusableIndices();return e.length&&this._setFocusIndex(e[0]),!0}case`End`:{let e=this._focusableIndices();return e.length&&this._setFocusIndex(e[e.length-1]),!0}case`Enter`:case` `:return this._activateFocused(),!0;case`ArrowRight`:return this._openFocusedSubmenu()||this._parentMenu||this.dispatchEvent(new CustomEvent(`puter-menu-navigate`,{detail:{direction:`right`},bubbles:!0,composed:!0})),!0;case`ArrowLeft`:if(this._parentMenu){this._parentMenu._hideActiveSubmenu();let e=this._parentItemEl;if(e){let t=parseInt(e.dataset.index,10);this._parentMenu._setFocusIndex(t)}return!0}return this.dispatchEvent(new CustomEvent(`puter-menu-navigate`,{detail:{direction:`left`},bubbles:!0,composed:!0})),!0;case`Tab`:return this._closeAll(),!0;default:return t.length===1&&!e.altKey&&this._typeahead(t)}}_focusableIndices(){let e=[];return this.#e.forEach((t,n)=>{t===`-`||t&&t.separator||t&&t.disabled||e.push(n)}),e}_setFocusIndex(e){this.#r=e,this.$$(`.menu-item`).forEach(t=>{let n=parseInt(t.dataset.index,10);t.classList.toggle(`focused`,n===e)});let t=this._itemEl(e);t&&typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`nearest`})}_clearFocus(){this.#r=null,this.$$(`.menu-item.focused`).forEach(e=>e.classList.remove(`focused`))}_itemEl(e){return this.$(`.menu-item[data-index="${e}"]`)}_moveFocus(e){let t=this._focusableIndices();if(!t.length)return;let n=t.indexOf(this.#r);n===-1&&(n=e>0?-1:t.length);let r=(n+e+t.length)%t.length;this._setFocusIndex(t[r])}_activateFocused(){if(this.#r===null)return;let e=this._itemEl(this.#r);e&&e.click()}_openFocusedSubmenu(){if(this.#r===null)return!1;let e=this.#e[this.#r];if(!e||!e.items||!e.items.length)return!1;let t=this._itemEl(this.#r);if(!t)return!1;clearTimeout(this.#n),this._cancelSubmenuClose();let n=!this.#t||this.#t.parentEl!==t;return n&&this._showSubmenu(t,e.items),requestAnimationFrame(()=>{let e=this.#t&&this.#t.element;if(e){if(n){let t=e._focusableIndices();t.length&&e._setFocusIndex(t[0])}typeof e._setKeyboardNav==`function`&&e._setKeyboardNav(!0)}}),!0}_typeahead(e){let t=e.toLowerCase();this.#s+=t,clearTimeout(this.#c),this.#c=setTimeout(()=>{this.#s=``},500);let n=this._focusableIndices();if(!n.length)return!1;let r=n.indexOf(this.#r),i=this.#s;for(let e=1;e<=n.length;e++){let t=n[(Math.max(0,r)+e)%n.length];if((this.#e[t]&&this.#e[t].label||``).toLowerCase().startsWith(i))return this._setFocusIndex(t),!0}if(i.length>1)for(let e=1;e<=n.length;e++){let i=n[(Math.max(0,r)+e)%n.length];if((this.#e[i]&&this.#e[i].label||``).toLowerCase().startsWith(t))return this._setFocusIndex(i),this.#s=t,!0}return!1}_showSubmenu(e,t){this._hideActiveSubmenu(),this._cancelSubmenuClose(),e.classList.add(`has-open-submenu`),e.classList.remove(`focused`);let n=document.createElement(`puter-context-menu`);n.setAttribute(`data-submenu`,``),n.setAttribute(`data-parent-managed`,``);let r=this.getAttribute(`theme`);r&&n.setAttribute(`theme`,r),n.items=t,n._parentMenu=this,n._parentItemEl=e;let i=e.getBoundingClientRect(),a=window.innerWidth<480;a?(n.setAttribute(`x`,String(i.left)),n.setAttribute(`y`,String(i.bottom+2)),this.#o=`below`):(n.setAttribute(`x`,String(i.right+2)),n.setAttribute(`y`,String(i.top)),this.#o=`right`),n.addEventListener(`select`,e=>{this.emitEvent(`select`,e.detail),this._closeAll()}),this.classList.contains(`sheet-mode`)&&(this.style.display=`none`,this._sheetHidden=!0),document.body.appendChild(n),this.#t={element:n,parentEl:e},requestAnimationFrame(()=>{if(!this.#t||this.#t.element!==n)return;let e=n.shadowRoot&&n.shadowRoot.querySelector(`.context-menu`);if(!e)return;let t=e.getBoundingClientRect(),r=t.width,o=t.height;if(a){let e=i.left;e+r>window.innerWidth&&(e=Math.max(0,window.innerWidth-r-4));let t=i.bottom+2;t+o>window.innerHeight-10&&(t=Math.max(0,window.innerHeight-o-10)),n.style.left=`${e}px`,n.style.top=`${t}px`}else{let e=i.right+2;e+r>window.innerWidth&&(e=Math.max(0,i.left-r-2),this.#o=`left`);let t=i.top;t+o>window.innerHeight-10&&(t=Math.max(0,window.innerHeight-o-10)),n.style.left=`${e}px`,n.style.top=`${t}px`}}),n.addEventListener(`mouseenter`,()=>{this._cancelSubmenuClose(),clearTimeout(this.#n)}),n.addEventListener(`mouseleave`,()=>{this._scheduleSubmenuClose()})}_scheduleSubmenuClose(){this._cancelSubmenuClose(),this.#a=setTimeout(()=>this._submenuCloseCheck(),50)}_cancelSubmenuClose(){this.#a&&=(clearTimeout(this.#a),null),this.#u=null,this._setSafeTraverse(!1)}_submenuCloseCheck(){if(this.#a=null,!this.#t){this._setSafeTraverse(!1);return}let e=this.#t.element,t=this.#t.parentEl,n=this.#i[this.#i.length-1];if(n&&(this._pointInElement(n,e)||this._pointInRect(n,t.getBoundingClientRect()))){this._setSafeTraverse(!1);return}if(this._isMouseHeadingToSubmenu(e)){this.#a=setTimeout(()=>this._submenuCloseCheck(),300);return}this._setSafeTraverse(!1),this._hideActiveSubmenu()}_setSafeTraverse(e){let t=this.$(`.context-menu`);t&&t.classList.toggle(`safe-traverse`,e)}_setKeyboardNav(e){let t=this.$(`.context-menu`);t&&t.classList.toggle(`keyboard-nav`,e)}_pointInRect(e,t){return e.x>=t.left&&e.x<=t.right&&e.y>=t.top&&e.y<=t.bottom}_pointInElement(e,t){let n=t.shadowRoot&&t.shadowRoot.querySelector(`.context-menu`);return n?this._pointInRect(e,n.getBoundingClientRect()):!1}_isMouseHeadingToSubmenu(e){if(this.#i.length<2)return!1;let t=e.shadowRoot&&e.shadowRoot.querySelector(`.context-menu`);if(!t)return!1;let n=t.getBoundingClientRect(),r=this.#i[this.#i.length-1],i=this.#i[0],a,o;switch(this.#o){case`left`:a={x:n.right,y:n.bottom},o={x:n.right,y:n.top};break;case`below`:a={x:n.right,y:n.top},o={x:n.left,y:n.top};break;default:a={x:n.left,y:n.top},o={x:n.left,y:n.bottom};break}let s=(e,t)=>(t.y-e.y)/(t.x-e.x),c=s(r,a),l=s(r,o),u=s(i,a),d=s(i,o);return c<u&&l>d}_hideSubmenu(e){this.#t&&this.#t.parentEl===e&&this._hideActiveSubmenu()}_hideActiveSubmenu(e=!0){if(this.#t&&=(this.#t.element._closing||this.#t.element.remove(),this.#t.parentEl.classList.remove(`has-open-submenu`),null),e&&this._sheetHidden&&(this.style.display=``,this._sheetHidden=!1),this.#u!==null){let e=this.#u;this.#u=null,this._setFocusIndex(e);let t=this.#e[e];if(t&&t.items&&t.items.length){let n=this._itemEl(e);n&&this._showSubmenu(n,t.items)}}this._setSafeTraverse(!1)}_closeAll(){if(this._closing)return;this._closing=!0,this._cancelSubmenuClose(),clearTimeout(this.#n),clearTimeout(this.#c);let e=this._sheetHidden;this._hideActiveSubmenu(!1),this._outsideClickHandler&&document.removeEventListener(`pointerdown`,this._outsideClickHandler,!0),this._keyHandler&&document.removeEventListener(`keydown`,this._keyHandler,!0),this.#l&&=(document.removeEventListener(`mousemove`,this.#l),null),this.emitEvent(`close`,{}),this.classList.contains(`sheet-mode`)?(this._hideBackdrop(),e?this.remove():(this.classList.add(`sheet-closing`),setTimeout(()=>this.remove(),250))):this.remove()}disconnectedCallback(){super.disconnectedCallback(),this._outsideClickHandler&&document.removeEventListener(`pointerdown`,this._outsideClickHandler,!0),this._keyHandler&&document.removeEventListener(`keydown`,this._keyHandler,!0),this.#l&&=(document.removeEventListener(`mousemove`,this.#l),null),this._cancelSubmenuClose(),clearTimeout(this.#n),clearTimeout(this.#c),this._hideActiveSubmenu(),this._hideBackdrop()}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}_escapeAttr(e){return e?e.replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}_formatShortcut(t){if(!t)return``;let n=e._isMac(),r=String(t).replace(/⌘/g,`Mod+`).replace(/⌃/g,`Ctrl+`).replace(/⌥/g,`Alt+`).replace(/⇧/g,`Shift+`).split(`+`).map(e=>e.trim()).filter(Boolean).map(e=>{switch(e.toLowerCase()){case`mod`:case`cmd`:case`command`:return n?`⌘`:`Ctrl`;case`ctrl`:case`control`:return n?`⌃`:`Ctrl`;case`alt`:case`option`:case`opt`:return n?`⌥`:`Alt`;case`shift`:return n?`⇧`:`Shift`;case`meta`:case`super`:case`win`:return n?`⌘`:`Win`;default:return e}});return n?r.join(``):r.join(`+`)}_getActiveSubmenu(){return this.#t}_isEventInChain(e){let t=e.target;if(!t)return!1;if(this.contains(t))return!0;let n=this.#t;for(;n&&n.element;){if(n.element.contains(t))return!0;n=n.element._getActiveSubmenu?n.element._getActiveSubmenu():null}return!1}static _isMac(){if(typeof navigator>`u`)return!1;let e=navigator.userAgentData;return e&&typeof e.platform==`string`?/mac/i.test(e.platform):/Mac|iPhone|iPad|iPod/i.test(navigator.platform||navigator.userAgent||``)}},Gr=class extends Y{getStyles(){return`
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: ${X};
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            :host(.visible) .overlay {
                opacity: 1;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #e0e0e0;
                border-top-color: #088ef0;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .text {
                margin-top: 16px;
                font-size: 14px;
                color: #666666;
                text-align: center;
                padding: 0 20px;
                max-width: 90vw;
            }
            @media (max-width: 480px) {
                .spinner {
                    width: 48px;
                    height: 48px;
                    border-width: 4px;
                }
                .text {
                    font-size: 16px;
                }
            }
        `}render(){let e=this.getAttribute(`text`)||``;return`
            <div class="overlay">
                <div class="spinner"></div>
                ${e?`<div class="text">${this._escapeHTML(e)}</div>`:``}
            </div>`}onReady(){requestAnimationFrame(()=>{this.classList.add(`visible`)})}open(){this.classList.add(`visible`)}close(){this.classList.remove(`visible`),setTimeout(()=>this.remove(),200)}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}},Kr=class extends Y{#e=[];#t=null;#n=null;#r=null;#i=!1;#a=!1;#o=!1;get items(){return this.#e}set items(e){this.#e=e||[],this.shadowRoot&&this.isConnected&&this._rerender()}getStyles(){return`
            :host {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                font-family: ${X};
                user-select: none;
                -webkit-user-select: none;
            }
            .menubar {
                display: flex;
                box-sizing: border-box;
                overflow: hidden;
                border-bottom: 1px solid #e3e3e3;
                background-color: #fafafa;
                padding: 2px 5px;
                align-items: center;
                height: 36px;
            }
            .menu-button {
                background: none;
                border: none;
                font-family: inherit;
                padding: 3px 10px;
                font-size: 13px;
                border-radius: 3px;
                cursor: default;
                color: #333;
                line-height: 1.2;
                margin: 0 1px;
            }
            /* Hover is driven by JS (.hovered) rather than :hover so we can
               clear stale keyboard focus the moment the mouse takes over and
               keep the two highlight sources from ever co-existing. */
            .menu-button.hovered,
            .menu-button.active,
            .menu-button.focused {
                background-color: #e2e2e2;
            }
            /* Suppress browser-native focus ring and tap highlight without
               touching background. CAUTION: setting background-color here
               would tie specificity with .menu-button.active and win by
               source order, which would erase the open-menu highlight as
               soon as the button takes DOM :focus from a click. */
            .menu-button:focus,
            .menu-button:focus-visible,
            .menu-button:active {
                outline: none;
                -webkit-tap-highlight-color: transparent;
            }
            @media (max-width: 480px) {
                .menubar {
                    height: 40px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .menubar::-webkit-scrollbar {
                    display: none;
                }
                .menu-button {
                    font-size: 14px;
                    padding: 6px 12px;
                    flex-shrink: 0;
                }
            }
            /* Dark theme — applied when system prefers dark and no light
               override is set, or when theme="dark" is forced. The base
               class toggles .puter-theme-dark on the host accordingly. */
            :host(.puter-theme-dark) .menubar {
                background-color: #2a2a2a;
                border-bottom-color: #3a3a3a;
            }
            :host(.puter-theme-dark) .menu-button {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .menu-button.hovered,
            :host(.puter-theme-dark) .menu-button.active,
            :host(.puter-theme-dark) .menu-button.focused {
                background-color: #3a3a3a;
            }
        `}render(){return`<div class="menubar">${(this.#e||[]).map((e,t)=>`<button class="menu-button" data-index="${t}">${this._escapeHTML(e.label||``)}</button>`).join(``)}</div>`}onReady(){this._keyHandler&&document.removeEventListener(`keydown`,this._keyHandler,!0),this._keyUpHandler&&document.removeEventListener(`keyup`,this._keyUpHandler,!0),this._docPointerDownHandler&&document.removeEventListener(`pointerdown`,this._docPointerDownHandler,!0),this._docFocusInHandler&&document.removeEventListener(`focusin`,this._docFocusInHandler,!0),this._winBlurHandler&&window.removeEventListener(`blur`,this._winBlurHandler),this._mouseMoveHandler&&document.removeEventListener(`mousemove`,this._mouseMoveHandler),this.$$(`.menu-button`).forEach(e=>{let t=parseInt(e.dataset.index,10),n=this.#e[t];n&&(e.addEventListener(`click`,r=>{if(r.stopPropagation(),this._suppressClickFor===e){this._suppressClickFor=null;return}if(this.#r=t,this.#i=!0,this.#n===e){this._closeDropdown(),this._deactivateMenubar();return}this._openDropdown(e,n)}),e.addEventListener(`mouseenter`,()=>{e.classList.add(`hovered`),this.#r!==null&&(this.#r=null,this._renderButtonFocus());let t=this.shadowRoot,r=t&&t.activeElement;r&&r!==e&&r.classList.contains(`menu-button`)&&r.blur(),this._setKeyboardNav(!1),this.#t&&this.#n!==e&&this._openDropdown(e,n)}),e.addEventListener(`mouseleave`,()=>{e.classList.remove(`hovered`)}))}),this._keyHandler=e=>this._onGlobalKeyDown(e),this._keyUpHandler=e=>this._onGlobalKeyUp(e),document.addEventListener(`keydown`,this._keyHandler,!0),document.addEventListener(`keyup`,this._keyUpHandler,!0),this._docPointerDownHandler=e=>{let t=typeof e.composedPath==`function`?e.composedPath():[];this.#n&&t.includes(this.#n)&&(this._suppressClickFor=this.#n,clearTimeout(this._suppressClickTimer),this._suppressClickTimer=setTimeout(()=>{this._suppressClickFor=null},400)),this.#i&&!this.#t&&!t.includes(this)&&this._deactivateMenubar()},document.addEventListener(`pointerdown`,this._docPointerDownHandler,!0),this._docFocusInHandler=e=>{this.#i&&(this.#t||(typeof e.composedPath==`function`?e.composedPath():[]).includes(this)||this._deactivateMenubar())},document.addEventListener(`focusin`,this._docFocusInHandler,!0),this._winBlurHandler=()=>{this.#i&&!this.#t&&this._deactivateMenubar(),this.#a=!1,this.#o=!1},window.addEventListener(`blur`,this._winBlurHandler),this._mouseMoveHandler=()=>this._setKeyboardNav(!1),document.addEventListener(`mousemove`,this._mouseMoveHandler)}_onGlobalKeyDown(e){if(e.key===`Alt`&&!e.repeat?(this.#a=!0,this.#o=!1):this.#a&&e.key!==`Alt`&&(this.#o=!0),e.key===`F10`){this.#i||this.#t?(this._closeDropdown(),this._deactivateMenubar()):this._activateMenubar(),e.preventDefault(),e.stopImmediatePropagation();return}if(!this.#t&&this.#i){switch(e.key){case`ArrowRight`:this._moveButtonFocus(1,{openDropdown:!0});break;case`ArrowLeft`:this._moveButtonFocus(-1,{openDropdown:!0});break;case`ArrowDown`:case`Enter`:case` `:this._openFocusedButton(!0);break;case`Escape`:case`Tab`:this._deactivateMenubar();break;default:return}e.preventDefault(),e.stopImmediatePropagation()}}_onGlobalKeyUp(e){if(e.key===`Alt`){let t=this.#a&&!this.#o;this.#a=!1,this.#o=!1,t&&(this.#i||this.#t?(this._closeDropdown(),this._deactivateMenubar()):this._activateMenubar(),e.preventDefault(),e.stopImmediatePropagation())}}_activateMenubar(){!this.#e||!this.#e.length||document.querySelector(`puter-context-menu`)||(this.#i=!0,this.#r=0,this._renderButtonFocus(),this._setKeyboardNav(!0))}_deactivateMenubar(){this.#i=!1,this.#r=null,this._renderButtonFocus(),this._setKeyboardNav(!1)}_renderButtonFocus(){this.$$(`.menu-button`).forEach(e=>{let t=parseInt(e.dataset.index,10);e.classList.toggle(`focused`,t===this.#r)})}_setKeyboardNav(e){let t=this.$(`.menubar`);t&&t.classList.toggle(`keyboard-nav`,e)}_moveButtonFocus(e,{swapDropdown:t=!0,openDropdown:n=!1}={}){if(!this.#e.length)return;let r=this.#e.length,i=((this.#r==null?e>0?-1:0:this.#r)+e+r)%r;this.#r=i,this._renderButtonFocus(),this._setKeyboardNav(!0);let a=this._buttonEl(i),o=this.#e[i];if(!(!a||!o)){if(t&&this.#t){this._openDropdown(a,o);return}n&&this._openFocusedButton(!1)}}_buttonEl(e){return this.$(`.menu-button[data-index="${e}"]`)}_openFocusedButton(e){if(this.#r==null)return;let t=this._buttonEl(this.#r),n=this.#e[this.#r];!t||!n||(this._openDropdown(t,n),e&&this.#t&&requestAnimationFrame(()=>{let e=this.#t;if(e&&typeof e._focusableIndices==`function`){let t=e._focusableIndices();t.length&&e._setFocusIndex(t[0]),typeof e._setKeyboardNav==`function`&&e._setKeyboardNav(!0)}}))}_openDropdown(e,t){if(this._closeDropdown(),typeof t.action==`function`&&(!t.items||t.items.length===0)){t.action(),this.emitEvent(`select`,t);return}if(!t.items||t.items.length===0)return;let n=e.getBoundingClientRect(),r=document.createElement(`puter-context-menu`);r.setAttribute(`data-submenu`,``);let i=this.getAttribute(`theme`);i&&r.setAttribute(`theme`,i),r.items=t.items,r.setAttribute(`x`,String(n.left)),r.setAttribute(`y`,String(n.bottom)),r.addEventListener(`select`,e=>{this.emitEvent(`select`,e.detail),this._closeDropdown(),this._deactivateMenubar()}),r.addEventListener(`close`,()=>{this.#t===r&&(e.classList.remove(`active`),this.#t=null,this.#n=null,this._deactivateMenubar())}),r.addEventListener(`puter-menu-navigate`,e=>{if(!e.detail)return;if(e.detail.direction===`up`){this._closeDropdown(),this._renderButtonFocus(),this._setKeyboardNav(!0);return}let t=e.detail.direction===`right`?1:-1;this._closeDropdown(),this._moveButtonFocus(t,{swapDropdown:!1,openDropdown:!0})}),document.body.appendChild(r),e.classList.add(`active`),this.#t=r,this.#n=e}_closeDropdown(){this.#n&&this.#n.classList.remove(`active`),this.#t&&this.#t.remove(),this.#t=null,this.#n=null}disconnectedCallback(){super.disconnectedCallback(),this._closeDropdown(),clearTimeout(this._suppressClickTimer),this._suppressClickFor=null,this._keyHandler&&document.removeEventListener(`keydown`,this._keyHandler,!0),this._keyUpHandler&&document.removeEventListener(`keyup`,this._keyUpHandler,!0),this._docPointerDownHandler&&document.removeEventListener(`pointerdown`,this._docPointerDownHandler,!0),this._docFocusInHandler&&document.removeEventListener(`focusin`,this._docFocusInHandler,!0),this._winBlurHandler&&window.removeEventListener(`blur`,this._winBlurHandler),this._mouseMoveHandler&&document.removeEventListener(`mousemove`,this._mouseMoveHandler)}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}},qr=`#000000.#434343.#666666.#999999.#b7b7b7.#cccccc.#d9d9d9.#efefef.#f3f3f3.#ffffff.#980000.#ff0000.#ff9900.#ffff00.#00ff00.#00ffff.#4a86e8.#0000ff.#9900ff.#ff00ff.#e6b8af.#f4cccc.#fce5cd.#fff2cc.#d9ead3.#d0e0e3.#c9daf8.#cfe2f3.#d9d2e9.#ead1dc.#dd7e6b.#ea9999.#f9cb9c.#ffe599.#b6d7a8.#a2c4c9.#a4c2f4.#9fc5e8.#b4a7d6.#d5a6bd.#cc4125.#e06666.#f6b26b.#ffd966.#93c47d.#76a5af.#6d9eeb.#6fa8dc.#8e7cc3.#c27ba0.#a61c00.#cc0000.#e69138.#f1c232.#6aa84f.#45818e.#3c78d8.#3d85c6.#674ea7.#a64d79.#85200c.#990000.#b45f06.#bf9000.#38761d.#134f5c.#1155cc.#0b5394.#351c75.#741b47.#5b0f00.#660000.#783f04.#7f6000.#274e13.#0c343d.#1c4587.#073763.#20124d.#4c1130`.split(`.`),Jr=class extends Y{#e=`#3b82f6`;getStyles(){return`
            dialog {
                background: transparent;
                border: none;
                box-shadow: none;
                outline: none;
                padding: 0;
                max-width: 90vw;
            }
            dialog::backdrop {
                background: rgba(0, 0, 0, 0.5);
            }
            .picker-body {
                background-color: rgba(231, 238, 245, .95);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                border: none;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0px 0px 15px #00000066;
                font-family: ${X};
                color: #414650;
                width: 350px;
                max-width: calc(100vw - 32px);
                box-sizing: border-box;
            }
            .header {
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 20px;
            }
            .preview {
                width: 56px;
                height: 56px;
                border-radius: 4px;
                border: 1px solid #b9b9b9;
                background: var(--current-color, #3b82f6);
                flex-shrink: 0;
                transition: background 0.15s ease;
            }
            .header-info {
                flex: 1;
                min-width: 0;
            }
            .header-label {
                font-size: 12px;
                color: #666666;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }
            .hex-input {
                width: 100%;
                padding: 8px;
                font-family: ui-monospace, "SF Mono", Menlo, monospace;
                font-size: 14px;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                color: #414650;
                box-sizing: border-box;
                outline: none;
                text-transform: uppercase;
                transition: border-color 0.15s ease;
            }
            .hex-input:focus {
                border: 2px solid #01a0fd;
                padding: 7px;
            }
            .native-color-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 18px;
                padding: 10px 12px;
                background: rgba(255, 255, 255, 0.5);
                border: 1px solid #b9b9b9;
                border-radius: 4px;
            }
            .native-color-row label {
                font-size: 13px;
                color: #666666;
                cursor: pointer;
                flex: 1;
            }
            input[type="color"] {
                width: 36px;
                height: 36px;
                padding: 0;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                cursor: pointer;
                background: transparent;
            }
            input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
            input[type="color"]::-webkit-color-swatch { border: none; border-radius: 2px; }
            .swatches {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 5px;
                margin-bottom: 20px;
            }
            .swatch {
                aspect-ratio: 1;
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid rgba(0, 0, 0, 0.06);
                transition: transform 0.1s ease;
            }
            .swatch:hover {
                transform: scale(1.15);
                z-index: 1;
            }
            .swatch.selected {
                outline: 2px solid #01a0fd;
                outline-offset: 2px;
            }
            .buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            ${jr}
            .btn-cancel {
                /* uses base .btn styles */
            }
            .btn-ok {
                border-color: #088ef0;
                background: linear-gradient(#34a5f8, #088ef0);
                color: white;
                min-width: 90px;
            }
            .btn-ok:active {
                background-color: #2798eb;
                border-color: #2798eb;
                color: #bedef5;
            }
            @media (max-width: 480px) {
                .picker-body {
                    width: 100%;
                    padding: 20px;
                }
                .swatches {
                    grid-template-columns: repeat(8, 1fr);
                }
                .btn {
                    padding: 0 20px;
                    font-size: 16px;
                    height: 40px;
                    line-height: 40px;
                    flex: 1;
                }
            }
            :host(.puter-theme-dark) .picker-body {
                background-color: rgba(40, 44, 52, .95);
                color: #e6e6e6;
                box-shadow: 0px 0px 15px #000000aa;
            }
            :host(.puter-theme-dark) .preview {
                border-color: #555;
            }
            :host(.puter-theme-dark) .header-label {
                color: #aaa;
            }
            :host(.puter-theme-dark) .hex-input {
                background-color: #1f1f1f;
                border-color: #555;
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .native-color-row {
                background: rgba(255, 255, 255, 0.05);
                border-color: #555;
            }
            :host(.puter-theme-dark) .native-color-row label {
                color: #aaa;
            }
            :host(.puter-theme-dark) input[type="color"] {
                border-color: #555;
            }
            :host(.puter-theme-dark) .swatch {
                border-color: rgba(255, 255, 255, 0.1);
            }
            :host(.puter-theme-dark) .btn {
                color: #e6e6e6;
                border-color: #555;
                background: linear-gradient(#4a4a4a, #3a3a3a);
                box-shadow: inset 0px 1px 0px rgb(255 255 255 / 8%), 0 1px 2px rgb(0 0 0 / 25%);
            }
            :host(.puter-theme-dark) .btn:active {
                background-color: #333;
                border-color: #444;
                color: #999;
            }
        `}render(){let e=this.getAttribute(`default-color`)||`#3b82f6`;this.#e=this._normalizeHex(e);let t=qr.map(e=>`<div class="swatch${e.toLowerCase()===this.#e.toLowerCase()?` selected`:``}"
                  data-color="${e}" style="background: ${e}"></div>`).join(``);return`
            <dialog>
                <div class="picker-body" style="--current-color: ${this.#e}">
                    <div class="header">
                        <div class="preview"></div>
                        <div class="header-info">
                            <div class="header-label">Hex</div>
                            <input class="hex-input" type="text" value="${this.#e.toUpperCase()}" maxlength="7">
                        </div>
                    </div>
                    <div class="native-color-row">
                        <label for="native-color">Pick any color</label>
                        <input id="native-color" type="color" value="${this.#e}">
                    </div>
                    <div class="swatches">${t}</div>
                    <div class="buttons">
                        <button class="btn btn-cancel">Cancel</button>
                        <button class="btn btn-ok">Select</button>
                    </div>
                </div>
            </dialog>`}onReady(){let e=this.$(`dialog`),t=this.$(`.hex-input`),n=this.$(`input[type="color"]`),r=this.$(`.btn-ok`),i=this.$(`.btn-cancel`);this.$$(`.swatch`).forEach(e=>{e.addEventListener(`click`,()=>{this._setColor(e.dataset.color)})}),t.addEventListener(`input`,e=>{let t=this._normalizeHex(e.target.value);t&&this._setColor(t,{fromHexInput:!0})}),n.addEventListener(`input`,e=>{this._setColor(e.target.value,{fromNative:!0})}),r.addEventListener(`click`,()=>{this.emitEvent(`response`,this.#e),this.close()}),i.addEventListener(`click`,()=>{this.emitEvent(`response`,null),this.close()}),e.addEventListener(`click`,t=>{t.target===e&&(this.emitEvent(`response`,null),this.close())}),e.addEventListener(`cancel`,e=>{this.emitEvent(`response`,null)})}_setColor(e,t={}){let n=this._normalizeHex(e);if(!n)return;this.#e=n;let r=this.$(`.picker-body`);if(r&&r.style.setProperty(`--current-color`,n),!t.fromHexInput){let e=this.$(`.hex-input`);e&&(e.value=n.toUpperCase())}if(!t.fromNative){let e=this.$(`input[type="color"]`);e&&(e.value=n)}this.$$(`.swatch`).forEach(e=>{e.classList.toggle(`selected`,e.dataset.color.toLowerCase()===n.toLowerCase())})}_normalizeHex(e){return e?(e=e.trim(),e[0]!==`#`&&(e=`#${e}`),/^#[0-9a-f]{3}$/i.test(e)&&(e=`#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}`),/^#[0-9a-f]{6}$/i.test(e)?e.toLowerCase():null):null}},Q=[{name:`System UI`,family:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,category:`System`},{name:`Arial`,family:`Arial, sans-serif`,category:`Sans Serif`},{name:`Helvetica`,family:`Helvetica, sans-serif`,category:`Sans Serif`},{name:`Verdana`,family:`Verdana, sans-serif`,category:`Sans Serif`},{name:`Tahoma`,family:`Tahoma, sans-serif`,category:`Sans Serif`},{name:`Trebuchet MS`,family:`"Trebuchet MS", sans-serif`,category:`Sans Serif`},{name:`Impact`,family:`Impact, sans-serif`,category:`Sans Serif`},{name:`Times New Roman`,family:`"Times New Roman", Times, serif`,category:`Serif`},{name:`Georgia`,family:`Georgia, serif`,category:`Serif`},{name:`Garamond`,family:`Garamond, serif`,category:`Serif`},{name:`Palatino`,family:`Palatino, "Palatino Linotype", serif`,category:`Serif`},{name:`Courier New`,family:`"Courier New", Courier, monospace`,category:`Monospace`},{name:`Consolas`,family:`Consolas, monospace`,category:`Monospace`},{name:`Monaco`,family:`Monaco, monospace`,category:`Monospace`},{name:`SF Mono`,family:`"SF Mono", ui-monospace, monospace`,category:`Monospace`},{name:`Brush Script`,family:`"Brush Script MT", cursive`,category:`Cursive`},{name:`Comic Sans`,family:`"Comic Sans MS", cursive`,category:`Cursive`}],Yr=[[`puter-alert`,Fr],[`puter-prompt`,Ir],[`puter-notification`,Ur],[`puter-context-menu`,Wr],[`puter-spinner`,Gr],[`puter-menubar`,Kr],[`puter-color-picker`,Jr],[`puter-font-picker`,class extends Y{#e=null;getStyles(){return`
            dialog {
                background: transparent;
                border: none;
                box-shadow: none;
                outline: none;
                padding: 0;
                max-width: 90vw;
                max-height: 90vh;
            }
            dialog::backdrop {
                background: rgba(0, 0, 0, 0.5);
            }
            .picker-body {
                background-color: rgba(231, 238, 245, .95);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                border: none;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0px 0px 15px #00000066;
                font-family: ${X};
                color: #414650;
                width: 350px;
                max-width: calc(100vw - 32px);
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                max-height: 80vh;
            }
            .header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }
            .title {
                font-size: 15px;
                font-weight: 600;
                color: #414650;
                text-shadow: 1px 1px #ffffff52;
                flex: 1;
            }
            .search {
                width: 100%;
                padding: 8px;
                font-size: 14px;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                outline: none;
                box-sizing: border-box;
                font-family: ${X};
                margin-bottom: 14px;
                transition: border-color 0.15s ease;
            }
            .search:focus {
                border: 2px solid #01a0fd;
                padding: 7px;
            }
            .font-list {
                height: 200px;
                overflow-y: scroll;
                background-color: white;
                padding: 0 10px;
                margin-bottom: 16px;
                border-radius: 4px;
                border: 1px solid #b9b9b9;
            }
            .font-item {
                padding: 10px;
                border-radius: 2px;
                margin: 10px 0;
                cursor: pointer;
                font-size: 16px;
                color: #414650;
                display: flex;
                align-items: baseline;
                gap: 12px;
                transition: background 0.08s ease;
            }
            .font-item:hover {
                background: rgba(0, 0, 0, 0.04);
            }
            .font-item.selected {
                color: white;
                background-color: #2b62f1;
            }
            .font-item.selected .font-name-label {
                color: rgba(255, 255, 255, 0.7);
            }
            .font-name-label {
                font-family: ${X};
                font-size: 12px;
                color: #888;
                flex-shrink: 0;
                margin-left: auto;
            }
            .preview {
                padding: 14px;
                background: white;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                font-size: 24px;
                margin-bottom: 16px;
                min-height: 40px;
                color: #414650;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            ${jr}
            .btn-cancel {
                /* uses base .btn styles */
            }
            .btn-ok {
                border-color: #088ef0;
                background: linear-gradient(#34a5f8, #088ef0);
                color: white;
                min-width: 90px;
            }
            .btn-ok:active {
                background-color: #2798eb;
                border-color: #2798eb;
                color: #bedef5;
            }
            .btn-ok:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                box-shadow: none;
            }
            @media (max-width: 480px) {
                .picker-body {
                    width: 100%;
                    padding: 20px;
                    max-height: 90vh;
                }
                .btn {
                    padding: 0 20px;
                    font-size: 16px;
                    height: 40px;
                    line-height: 40px;
                    flex: 1;
                }
            }
            :host(.puter-theme-dark) .picker-body {
                background-color: rgba(40, 44, 52, .95);
                color: #e6e6e6;
                box-shadow: 0px 0px 15px #000000aa;
            }
            :host(.puter-theme-dark) .title {
                color: #e6e6e6;
                text-shadow: none;
            }
            :host(.puter-theme-dark) .search {
                background-color: #1f1f1f;
                border-color: #555;
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .font-list {
                background-color: #1f1f1f;
                border-color: #555;
            }
            :host(.puter-theme-dark) .font-item {
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .font-item:hover {
                background: rgba(255, 255, 255, 0.06);
            }
            :host(.puter-theme-dark) .font-name-label {
                color: #888;
            }
            :host(.puter-theme-dark) .preview {
                background: #1f1f1f;
                border-color: #555;
                color: #e6e6e6;
            }
            :host(.puter-theme-dark) .btn {
                color: #e6e6e6;
                border-color: #555;
                background: linear-gradient(#4a4a4a, #3a3a3a);
                box-shadow: inset 0px 1px 0px rgb(255 255 255 / 8%), 0 1px 2px rgb(0 0 0 / 25%);
            }
            :host(.puter-theme-dark) .btn:active {
                background-color: #333;
                border-color: #444;
                color: #999;
            }
        `}render(){let e=this.getAttribute(`default-font`)||`System UI`;this.#e=Q.find(t=>t.name.toLowerCase()===e.toLowerCase()||t.family.toLowerCase().includes(e.toLowerCase()))||Q[0];let t=this._renderFontList(Q);return`
            <dialog>
                <div class="picker-body">
                    <div class="header">
                        <div class="title">Choose Font</div>
                    </div>
                    <input class="search" type="text" placeholder="Search fonts...">
                    <div class="preview" style="font-family: ${this.#e.family}">The quick brown fox</div>
                    <div class="font-list">
                        ${t}
                    </div>
                    <div class="buttons">
                        <button class="btn btn-cancel">Cancel</button>
                        <button class="btn btn-ok">Select</button>
                    </div>
                </div>
            </dialog>`}_renderFontList(e){return e.map(e=>`
            <div class="font-item${e.name===this.#e.name?` selected`:``}"
                 data-name="${this._escapeAttr(e.name)}"
                 style="font-family: ${e.family}">
                ${this._escapeHTML(e.name)}
            </div>
        `).join(``)}onReady(){let e=this.$(`dialog`),t=this.$(`.search`),n=this.$(`.font-list`),r=this.$(`.preview`),i=this.$(`.btn-ok`),a=this.$(`.btn-cancel`),o=()=>{this.$$(`.font-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Q.find(t=>t.name===e.dataset.name);t&&(this.#e=t,this.$$(`.font-item`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),r.style.fontFamily=t.family)}),e.addEventListener(`dblclick`,()=>{let t=Q.find(t=>t.name===e.dataset.name);t&&(this.#e=t,this.emitEvent(`response`,{fontFamily:t.family}),this.close())})})};o(),t.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase(),r=Q.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t));n.innerHTML=this._renderFontList(r),o()}),i.addEventListener(`click`,()=>{this.emitEvent(`response`,{fontFamily:this.#e.family}),this.close()}),a.addEventListener(`click`,()=>{this.emitEvent(`response`,null),this.close()}),e.addEventListener(`click`,t=>{t.target===e&&(this.emitEvent(`response`,null),this.close())})}_escapeHTML(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}_escapeAttr(e){return e?e.replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}}]];function Xr(){if(!(globalThis.HTMLElement===void 0||!globalThis.customElements))for(let[e,t]of Yr)customElements.get(e)||customElements.define(e,t)}var Zr=class e{constructor(e={}){this.fieldsObj=e,this.enabled=new Set}on(e){this.enabled.add(e)}fields(t={}){return new e({...this.fieldsObj,...t})}info(...e){console.log(...this._prefix(),...e)}warn(...e){console.warn(...this._prefix(),...e)}error(...e){console.error(...this._prefix(),...e)}debug(...e){console.debug(...this._prefix(),...e)}_prefix(){let e=Object.entries(this.fieldsObj);return e.length?[`[${e.map(([e,t])=>`${e}=${t}`).join(` `)}]`]:[]}},Qr=class{constructor(){this.locked=!1,this.queue=[]}async acquire(){if(!this.locked){this.locked=!0;return}await new Promise(e=>this.queue.push(e)),this.locked=!0}release(){let e=this.queue.shift();if(e){e();return}this.locked=!1}},$r=`https://puter.com`,ei=`puter.auth.token`,ti=`puter.auth.token.v2`,$=function(){class e{env;#e=`https://api.puter.com`;#t=`https://puter.com`;get defaultAPIOrigin(){return globalThis.PUTER_API_ORIGIN||globalThis.PUTER_API_ORIGIN_ENV||this.#e}set defaultAPIOrigin(e){this.#e=e}get defaultGUIOrigin(){return globalThis.PUTER_ORIGIN||globalThis.PUTER_ORIGIN_ENV||this.#t}set defaultGUIOrigin(e){this.#t=e}onAuth;puterAuthState={isPromptOpen:!1,authGranted:null,resolver:null};appInstanceID;parentInstanceID;static FSItem=W;eventHandlers={};_reauthInflight=null;debugMode=!1;quiet=!1;initSubmodules=function(){this.util=new br,this.registerModule(`auth`,Te),this.registerModule(`os`,lr),this.registerModule(`fs`,Bn),this.registerModule(`ui`,hr,{appInstanceID:this.appInstanceID,parentInstanceID:this.parentInstanceID}),this.registerModule(`hosting`,Vn),this.registerModule(`apps`,ye),this.registerModule(`ai`,ve),this.registerModule(`kv`,Kn),this.registerModule(`perms`,ur),this.registerModule(`drivers`,ke),this.registerModule(`debug`,Ee),this.registerModule(`peer`,Ar),this.path=u,Xr()};normalizeAuthTokenCandidate=function(e){if(typeof e!=`string`)return null;let t=e.trim();return!t||t===`null`||t===`undefined`?null:t};decodeJwtPayload=function(e){if(typeof e!=`string`)return null;let t=e.split(`.`);if(t.length<2)return null;let n=t[1];n=n.replace(/-/g,`+`).replace(/_/g,`/`);let r=n.length%4;r&&(n+=`=`.repeat(4-r));try{let e;if(typeof globalThis.atob==`function`)e=decodeURIComponent(Array.prototype.map.call(globalThis.atob(n),e=>`%${`00${e.charCodeAt(0).toString(16)}`.slice(-2)}`).join(``));else if(globalThis.Buffer!==void 0)e=globalThis.Buffer.from(n,`base64`).toString(`utf8`);else return null;let t=JSON.parse(e);return t&&typeof t==`object`?t:null}catch{return null}};normalizeStringCandidate=function(e){return typeof e==`string`&&e.trim()||null};decodeCompressedAppID=function(e){let t=this.normalizeStringCandidate(e);if(!t)return null;if(t.includes(`-`))return t;try{let e;if(globalThis.Buffer!==void 0)e=globalThis.Buffer.from(t,`base64`);else if(typeof globalThis.atob==`function`){let n=globalThis.atob(t);e=Uint8Array.from(n,e=>e.charCodeAt(0))}else return null;if(!e||e.length!==16)return null;let n=globalThis.Buffer!==void 0&&typeof globalThis.Buffer.isBuffer==`function`&&globalThis.Buffer.isBuffer(e)?e.toString(`hex`):Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``);return n.length===32?`app-${[n.slice(0,8),n.slice(8,12),n.slice(12,16),n.slice(16,20),n.slice(20)].join(`-`)}`:null}catch{return null}};getAppIDFromAuthToken=function(e){let t=this.decodeJwtPayload(e);return t?this.normalizeStringCandidate(t.app_uid)||this.decodeCompressedAppID(t.au):null};constructor(){this._cache=new i.default({dbName:`puter_cache`}),this._opscache=new i.default,this.modules_=[];let e=new URLSearchParams(globalThis.location?.search);e.has(`puter.app_instance_id`)?this.env=`app`:globalThis.puter_gui_enabled===!0?this.env=`gui`:globalThis.WorkerGlobalScope?(globalThis.ServiceWorkerGlobalScope?(this.env=`service-worker`,globalThis.XMLHttpRequest||(globalThis.XMLHttpRequest=k),globalThis.location||(globalThis.location=new URL(`https://puter.site/`))):this.env=`web-worker`,globalThis.localStorage||(globalThis.localStorage=p)):globalThis.process?(this.env=`nodejs`,globalThis.localStorage||(globalThis.localStorage=p),globalThis.XMLHttpRequest||(globalThis.XMLHttpRequest=k),globalThis.location||(globalThis.location=new URL(`https://nodejs.puter.site/`)),globalThis.addEventListener||(globalThis.addEventListener=()=>{})):this.env=`web`,this.env!==`gui`&&location.hostname.replace(/\.$/,``)===new URL($r).hostname&&(this.env=`gui`),e.has(`puter.args`)?this.args=JSON.parse(decodeURIComponent(e.get(`puter.args`))):this.args={},e.has(`puter.app_instance_id`)&&(this.appInstanceID=decodeURIComponent(e.get(`puter.app_instance_id`))),e.has(`puter.parent_instance_id`)&&(this.parentInstanceID=decodeURIComponent(e.get(`puter.parent_instance_id`))),e.has(`puter.app.id`)&&(this.appID=decodeURIComponent(e.get(`puter.app.id`))),e.has(`puter.app.name`)&&(this.appName=decodeURIComponent(e.get(`puter.app.name`))),this.appID&&(this.appDataPath=`~/AppData/${this.appID}`),this.APIOrigin=this.defaultAPIOrigin,e.has(`puter.api_origin`)&&this.env===`app`?this.APIOrigin=decodeURIComponent(e.get(`puter.api_origin`)):e.has(`puter.domain`)&&this.env===`app`&&(this.APIOrigin=`https://api.${e.get(`puter.domain`)}`);let t=new Zr;if(this.logger=t,this.apiCallLogger=new a({enabled:!1}),this.env===`gui`)this.authToken=window.auth_token,this.initSubmodules();else if(this.env===`app`){let t=this.normalizeAuthTokenCandidate(e.get(`puter.auth.token`)??e.get(`auth_token`));try{let e=t,n=!1;if(t)this.setAuthToken(t),n=!0;else{let t=this.normalizeAuthTokenCandidate(localStorage.getItem(ti));if(t)this.setAuthToken(t),e=t;else{let t=this.normalizeAuthTokenCandidate(localStorage.getItem(ei));t&&(this.setAuthToken(t),e=t,n=!0)}}if(n&&e&&this._silentMigrateV1Token(e),!this.getAppIDFromAuthToken(e)&&!this.appID){let e=localStorage.getItem(`puter.app.id`);e&&this.setAppID(e)}}catch(e){console.error(`Error accessing localStorage:`,e)}this.initSubmodules()}else if(this.env===`web`){this.initSubmodules();try{let e=this.normalizeAuthTokenCandidate(localStorage.getItem(ti));if(e)this.setAuthToken(e);else{let e=this.normalizeAuthTokenCandidate(localStorage.getItem(ei));e&&(this.setAuthToken(e),this._silentMigrateV1Token(e))}!this.appID&&localStorage.getItem(`puter.app.id`)&&this.setAppID(localStorage.getItem(`puter.app.id`))}catch(e){console.error(`Error accessing localStorage:`,e)}this.printDevCTA(),this.warnUnsupportedProtocol()}else(this.env===`web-worker`||this.env===`service-worker`||this.env===`nodejs`)&&this.initSubmodules();(async()=>{try{let e=`[${(await this.auth.whoami())?.app_name??this.appInstanceID??`HOST`}]`;t=t.fields({prefix:e}),this.logger=t}catch(e){this.debugMode&&console.error(`Failed to initialize prefix logger`,e)}})(),this.lock_rao_=new Qr,this.p_can_request_rao_=Promise.resolve(),this.rao_requested_=!1,this.net={generateWispV1URL:async()=>{let{token:e,server:t}=await(await fetch(`${this.APIOrigin}/wisp/relay-token/create`,{method:`POST`,headers:{Authorization:`Bearer ${this.authToken}`,"Content-Type":`application/json`},body:JSON.stringify({})})).json();return`${t}/${e}/`},Socket:rr,tls:{TLSSocket:ar},fetch:cr},this.workers=new Sr(this.authToken),this.initNetworkMonitoring()}async request_rao_(){if(await this.p_can_request_rao_,this.env===`gui`)return;if(await this.lock_rao_.acquire(),this.rao_requested_){this.lock_rao_.release();return}let e=!1;try{return await(await fetch(`${this.APIOrigin}/rao`,{method:`POST`,headers:{Authorization:`Bearer ${this.authToken}`,Origin:location.origin}})).json()}catch(t){e=!0,console.error(t)}finally{this.lock_rao_.release()}e||(this.rao_requested_=!0)}registerModule(e,t,n={}){let r=new t(this,n);r.puter=this,this.modules_.push(e),this[e]=r,r._init&&r._init({puter:this})}updateSubmodules(){for(let e of this.modules_)this[e]&&(this[e]?.setAuthToken?.(this.authToken),this[e]?.setAPIOrigin?.(this.APIOrigin))}setAppID=function(e){try{localStorage.setItem(`puter.app.id`,e)}catch(e){console.error(`Error accessing localStorage:`,e)}this.appID=e,this.appDataPath=e?`~/AppData/${e}`:void 0};setAuthToken=function(e){let t=this.normalizeAuthTokenCandidate(e);this.authToken=t;let n=this.getAppIDFromAuthToken(t);if(n&&this.setAppID(n),this.env===`web`||this.env===`app`)try{t?localStorage.setItem(ti,t):localStorage.removeItem(ti),localStorage.removeItem(ei)}catch(e){console.error(`Error accessing localStorage:`,e)}this.env===`gui`&&setInterval($.checkAndUpdateGUIFScache,1e4),this.updateSubmodules(),this.request_rao_(),this.getUser().then(e=>{this.whoami=e})};setAPIOrigin=function(e){this.APIOrigin=e,this.updateSubmodules()};runWhenPuterHappensCallbacks=function(){if(this.env!==`gui`||!globalThis.when_puter_happens)return;let e=Array.isArray(globalThis.when_puter_happens)?globalThis.when_puter_happens:[globalThis.when_puter_happens];for(let t of e)try{t({puter:this})}catch(e){this.debugMode&&console.error(`when_puter_happens callback failed`,e)}};resetAuthToken=function(){if(this.env===`worker`||this.env===`service-worker`)throw Error(`Sign out is not permitted from WebWorkers or ServiceWorkers`);if(this.authToken=null,this.env===`web`||this.env===`app`)try{localStorage.removeItem(ti),localStorage.removeItem(ei)}catch(e){console.error(`Error accessing localStorage:`,e)}this.updateSubmodules()};triggerReauth=async function(e={}){let{reason:t,auth_id:n}=e;if(this._reauthInflight)return this._reauthInflight;if(this._emitReauthEvent({reason:t,auth_id:n}),this.authToken=null,this.env===`web`||this.env===`app`)try{localStorage.removeItem(ti),localStorage.removeItem(ei)}catch(e){console.error(`Error accessing localStorage:`,e)}this.updateSubmodules(),this._reauthInflight=(async()=>{if(this.env!==`gui`){if(this.env===`web-worker`||this.env===`service-worker`||this.env===`nodejs`){let e=Error(`reauth_required`);throw e.code=`reauth_required`,e.reason=t,e.auth_id=n,e}if(this.env===`web`){await this.ui.authenticateWithPuter({auth_id:n,reason:t});return}if(this.env===`app`){try{globalThis.parent?.postMessage?.({msg:`reauth_required`,appInstanceID:this.appInstanceID,reason:t,auth_id:n},this.defaultGUIOrigin)}catch{}await new Promise((e,t)=>{let n=globalThis.parent,r=t=>{t.origin===this.defaultGUIOrigin&&(n&&t.source!==n||t.data?.msg===`puter.token`&&(globalThis.removeEventListener(`message`,r),e()))};globalThis.addEventListener?.(`message`,r),setTimeout(()=>{globalThis.removeEventListener?.(`message`,r),t(Error(`reauth_timeout`))},300*1e3)})}}})();try{await this._reauthInflight}finally{this._reauthInflight=null}};_emitReauthEvent=function({reason:e,auth_id:t}){try{let n=this.eventHandlers?.[`puter.auth.reauth_required`];if(Array.isArray(n))for(let r of n)try{r({reason:e,auth_id:t})}catch{}}catch{}};on=function(e,t){return this.eventHandlers[e]||(this.eventHandlers[e]=[]),this.eventHandlers[e].push(t),()=>this.off(e,t)};off=function(e,t){let n=this.eventHandlers[e];if(!n)return;let r=n.indexOf(t);r>=0&&n.splice(r,1)};_silentMigrateV1Token=async function(e){if(!e)return!1;try{let t=globalThis.location?.origin===this.defaultGUIOrigin,n=await fetch(`${this.defaultGUIOrigin}/auth/migrate-token`,{method:`POST`,headers:{Authorization:`Bearer ${e}`,"Content-Type":`application/json`},credentials:t?`include`:`omit`,body:JSON.stringify({})});if(!n.ok)return!1;let r=(await n.json().catch(()=>null))?.token;return typeof r==`string`&&r.length>0?(this.setAuthToken(r),!0):!1}catch{return!1}};exit=function(e=0){e&&typeof e!=`number`&&(console.warn(`puter.exit() requires status code to be a number. Treating it as 1`),e=1),globalThis.parent.postMessage({msg:`exit`,appInstanceID:this.appInstanceID,statusCode:e},`*`)};randName=function(e=`-`){let t=`helpful.sensible.loyal.honest.clever.capable.calm.smart.genius.bright.charming.creative.diligent.elegant.fancy.colorful.avid.active.gentle.happy.intelligent.jolly.kind.lively.merry.nice.optimistic.polite.quiet.relaxed.silly.victorious.witty.young.zealous.strong.brave.agile.bold`.split(`.`),n=`street.roof.floor.tv.idea.morning.game.wheel.shoe.bag.clock.pencil.pen.magnet.chair.table.house.dog.room.book.car.cat.tree.flower.bird.fish.sun.moon.star.cloud.rain.snow.wind.mountain.river.lake.sea.ocean.island.bridge.road.train.plane.ship.bicycle.horse.elephant.lion.tiger.bear.zebra.giraffe.monkey.snake.rabbit.duck.goose.penguin.frog.crab.shrimp.whale.octopus.spider.ant.bee.butterfly.dragonfly.ladybug.snail.camel.kangaroo.koala.panda.piglet.sheep.wolf.fox.deer.mouse.seal.chicken.cow.dinosaur.puppy.kitten.circle.square.garden.otter.bunny.meerkat.harp`.split(`.`);return t[Math.floor(Math.random()*t.length)]+e+n[Math.floor(Math.random()*n.length)]+e+Math.floor(Math.random()*1e4)};getUser=function(...e){let t;return t=typeof e[0]==`object`&&e[0]!==null?e[0]:{success:e[0],error:e[1]},new Promise((e,n)=>{let r=j(`/whoami`,this.APIOrigin,this.authToken,`get`);M(r,t.success,t.error,e,n),r.send()})};print=function(...e){let t={};e.length>0&&typeof e[e.length-1]==`object`&&e[e.length-1]!==null&&(`escapeHTML`in e[e.length-1]||`code`in e[e.length-1])&&(t=e.pop());for(let n of e)(t.escapeHTML===!0||t.code===!0)&&typeof n==`string`&&(n=n.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)),t.code===!0&&(n=`<code><pre>${n}</pre></code>`),document.body.innerHTML+=n};configureAPILogging=function(e={}){return this.apiCallLogger&&this.apiCallLogger.updateConfig(e),this};enableAPILogging=function(e={}){return this.apiCallLogger&&this.apiCallLogger.updateConfig({...e,enabled:!0}),this};disableAPILogging=function(){return this.apiCallLogger&&this.apiCallLogger.disable(),this};initNetworkMonitoring=function(){if(globalThis.navigator===void 0||typeof globalThis.addEventListener!=`function`)return;let e=navigator.onLine,t=()=>{let t=navigator.onLine;if(e&&!t){console.log(`Network connection lost - purging cache`);try{this._cache.flushall(),console.log(`Cache purged successfully`)}catch(e){console.error(`Error purging cache:`,e)}}e=t};globalThis.addEventListener(`online`,t),globalThis.addEventListener(`offline`,t),typeof document<`u`&&document.addEventListener(`visibilitychange`,()=>{setTimeout(t,100)})};printDevCTA=function(){if(this.quiet||globalThis.PUTER_QUIET)return;let e=globalThis.matchMedia&&globalThis.matchMedia(`(prefers-color-scheme: dark)`).matches,t=e?`#7c8cff`:`#000fd8`,n=e?`#cbd5f5`:`rgb(0, 57, 137)`,r=e?`#93c5fd`:`#3b82f6`,i=e?`#64748b`:`#94a3b8`;console.log(`%c ____  _   _ _____ _____ ____       _ ____  
|  _ \\| | | |_   _| ____|  _ \\     | / ___| 
| |_) | | | | | | |  _| | |_) | _  | \\___ \\ 
|  __/| |_| | | | | |___|  _ < | |_| |___) |
|_|    \\___/  |_| |_____|_| \\_(_)___/|____/ `,`color: ${t}; font-weight: bold; font-size: 14px; font-family: monospace;`),console.log(`%cSubmit this app to the Puter App Store:
%chttps://apps.puter.com/`,`color: ${n}; font-size: 18px; font-weight: bold;`,`color: ${r}; font-size: 18px; font-weight: bold; text-decoration: underline;`),console.log(`%cTo disable this message: %cputer.quiet = true`,`color: ${i}; font-size: 11px;`,`color: ${i}; font-size: 11px; font-style: italic;`)};warnUnsupportedProtocol=function(){if(globalThis.location?.protocol!==`file:`||this._fileProtocolWarned)return;this._fileProtocolWarned=!0;let e=()=>{let e=new we(()=>{},()=>{});document.body.appendChild(e),e.open()};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()};checkAndUpdateGUIFScache=function(){if($.env!==`gui`||!$.whoami)return;let e=$.whoami.username,t=`/${e}`,n=`/${e}/Desktop`,r=`/${e}/Documents`,i=`/${e}/Public`;$._cache.get(`item:${t}`)||(console.log(`/${e} item is not cached, refetching cache`),$.fs.stat(t)),$._cache.get(`item:${n}`)||(console.log(`/${e}/Desktop item is not cached, refetching cache`),$.fs.stat(n)),$._cache.get(`item:${r}`)||(console.log(`/${e}/Documents item is not cached, refetching cache`),$.fs.stat(r)),$._cache.get(`item:${i}`)||(console.log(`/${e}/Public item is not cached, refetching cache`),$.fs.stat(i)),$._cache.get(`readdir:${t}`)||(console.log(`/${e} is not cached, refetching cache`),$.fs.readdir(t)),$._cache.get(`readdir:${n}`)||(console.log(`/${e}/Desktop is not cached, refetching cache`),$.fs.readdir(n)),$._cache.get(`readdir:${r}`)||(console.log(`/${e}/Documents is not cached, refetching cache`),$.fs.readdir(r)),$._cache.get(`readdir:${i}`)||(console.log(`/${e}/Public is not cached, refetching cache`),$.fs.readdir(i))}}return new e}();globalThis.puter=$,$.runWhenPuterHappensCallbacks(),$.tools=[];var ni=$.ui.parentApp();globalThis.puterParent=ni,ni&&(console.log(`I have a parent, registering tools`),ni.on(`message`,async e=>{if(console.log(`Got tool req `,e),e.$===`requestTools`&&(console.log(`Responding with tools`),ni.postMessage({$:`providedTools`,tools:JSON.parse(JSON.stringify($.tools))})),e.$===`executeTool`){console.log(`xecuting tools`);let[t]=$.tools.filter(t=>t.function.name===e.toolName),n=await t.exec(e.parameters);ni.postMessage({$:`toolResponse`,response:n,tag:e.tag})}}),ni.postMessage({$:`ready`})),globalThis.addEventListener&&globalThis.addEventListener(`message`,async e=>{if(e.origin===$.defaultGUIOrigin){if(e.data.msg&&e.data.msg===`requestOrigin`)e.source.postMessage({msg:`originResponse`},`*`);else if(e.data.msg===`puter.token`){if($.setAuthToken(e.data.token),!$.getAppIDFromAuthToken(e.data.token)&&!$.appID){let t=$.normalizeStringCandidate(e.data.app_uid);t&&$.setAppID(t)}$.puterAuthState.authGranted=!0,$.onAuth&&typeof $.onAuth==`function`&&$.getUser().then(e=>{$.onAuth(e)}),$.puterAuthState.isPromptOpen=!1,$.puterAuthState.resolver&&($.puterAuthState.authGranted?$.puterAuthState.resolver.resolve():$.puterAuthState.resolver.reject(),$.puterAuthState.resolver=null)}}});async function ri(e){$.auth.isSignedIn()||await $.auth.signIn({attempt_temp_user_creation:!0});let t=(await $.ai.chat(e,{model:`openai/gpt-5.4-nano`}))?.message?.content??``;return typeof t==`string`?t.trim():null}export{ri as t};