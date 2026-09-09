export function setupPresentation(onResize) {
  const logo=document.querySelector('#view-menu-trigger');
  const menu=document.querySelector('#view-menu');
  const choices=[...menu.querySelectorAll('[data-view]')];
  function close(restoreFocus=false){menu.hidden=true;logo.setAttribute('aria-expanded','false');if(restoreFocus)logo.focus();}
  function setView(view){
    document.documentElement.dataset.view=view;
    const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url);
    close();onResize();
  }
  function open(x,y){
    choices.forEach(button=>button.setAttribute('aria-checked',String(button.dataset.view===document.documentElement.dataset.view)));
    menu.hidden=false;logo.setAttribute('aria-expanded','true');
    const rect=menu.getBoundingClientRect();
    menu.style.left=Math.max(8,Math.min(x,innerWidth-rect.width-8))+'px';
    menu.style.top=Math.max(8,Math.min(y,innerHeight-rect.height-8))+'px';
    choices.find(button=>button.getAttribute('aria-checked')==='true').focus();
  }
  logo.addEventListener('contextmenu',event=>{event.preventDefault();open(event.clientX,event.clientY);});
  logo.addEventListener('click',()=>{const r=logo.getBoundingClientRect();open(r.left,r.bottom+6);});
  logo.addEventListener('keydown',event=>{if(event.key==='ContextMenu'||(event.shiftKey&&event.key==='F10')){event.preventDefault();const r=logo.getBoundingClientRect();open(r.left,r.bottom+6);}});
  choices.forEach(button=>button.addEventListener('click',()=>{setView(button.dataset.view);document.querySelector('#calculator').focus({preventScroll:true});}));
  menu.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close(true);}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
      event.preventDefault();const current=choices.indexOf(document.activeElement);
      const index=event.key==='Home'?0:event.key==='End'?choices.length-1:(current+(event.key==='ArrowDown'?1:-1)+choices.length)%choices.length;
      choices[index].focus();
    }
    if(event.key==='Tab')close();
  });
  document.addEventListener('pointerdown',event=>{if(!menu.contains(event.target)&&!logo.contains(event.target))close();});
  window.addEventListener('resize',()=>close());
  document.addEventListener('scroll',()=>close(),true);
  // Keep menu navigation from being interpreted as calculator number entry.
  menu.addEventListener('keydown',event=>event.stopPropagation());
  if('serviceWorker' in navigator && import.meta.env.PROD)navigator.serviceWorker.register('/sw.js').catch(error=>console.warn('Offline setup unavailable:',error));
  return setView;
}
