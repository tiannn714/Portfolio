import './style.css';

(function(){
  // ---- custom cursor ----
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
  });
  (function loop(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ ring.style.width='46px'; ring.style.height='46px'; ring.style.opacity='1'; });
    el.addEventListener('mouseleave', ()=>{ ring.style.width='32px'; ring.style.height='32px'; ring.style.opacity='.6'; });
  });

  // ---- typewriter ----
  const lines = ['whoami', 'echo "Christian Rosales — Web & Mobile Developer"', 'status --available'];
  const el = document.getElementById('typewriter');
  let li=0, ci=0, deleting=false;
  function tick(){
    const full = lines[li];
    if(!deleting){
      ci++;
      el.textContent = full.slice(0,ci);
      if(ci===full.length){ deleting=true; setTimeout(tick, 1400); return; }
    } else {
      ci--;
      el.textContent = full.slice(0,ci);
      if(ci===0){ deleting=false; li=(li+1)%lines.length; }
    }
    setTimeout(tick, deleting ? 28 : 55);
  }
  tick();

  // ---- reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el=>io.observe(el));

  // ---- count up stat ----
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count,10);
    const counterIO = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          let n=0;
          const step=()=>{ n++; el.textContent=n; if(n<target) requestAnimationFrame(step); };
          step();
          counterIO.unobserve(el);
        }
      });
    }, {threshold:0.5});
    counterIO.observe(el);
  });

  // ---- active nav link on scroll ----
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navlinks a[data-nav]');
  const navIO = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.navlinks a[href="#'+id+'"]');
      if(!link) return;
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s=>navIO.observe(s));

  // ---- mobile menu ----
  const toggle = document.getElementById('navtoggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', ()=>{
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    menu.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
  }));

  // ---- copy email ----
  const copyBtn = document.getElementById('copyEmail');
  const toast = document.getElementById('copyToast');
  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText('christianrosales489@gmail.com');
    }catch(e){}
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 1800);
  });
})();