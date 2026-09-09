import {defineConfig} from 'vite';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
// Precache the complete production build, including the lazily loaded numerical worker.
export default defineConfig({plugins:[{
  name:'hp15c-offline',apply:'build',
  async closeBundle(){
    const root=resolve('dist');
    async function walk(path=''){const entries=await readdir(resolve(root,path),{withFileTypes:true});const lists=await Promise.all(entries.map(e=>e.isDirectory()?walk(path+e.name+'/'):e.name==='sw.js'?[]:[path+e.name]));return lists.flat();}
    const files=(await walk()).sort();const hash=createHash('sha256');for(const file of files)hash.update(await readFile(resolve(root,file)));
    const cache='hp15c-shell-'+hash.digest('hex').slice(0,16);
    await writeFile(resolve(root,'sw.js'),`const CACHE=${JSON.stringify(cache)};
const FILES=${JSON.stringify(files.map(f=>'/'+f))};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('hp15c-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const path=url.pathname==='/'?'/index.html':url.pathname;
  if(FILES.includes(path))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(path))||fetch(event.request)));
});
`);
  }
}]});
