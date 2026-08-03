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

  // ---- scroll progress bar ----
  const progress = document.getElementById('scroll-progress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (scrolled/max)*100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---- typewriter ----
  const lines = ['whoami', 'echo "Christian Rosales — Junior Web & Mobile Developer"', 'status --available', 'npm run build', 'cd ./next-opportunity', 'cat about.txt'];
  const el = document.getElementById('typewriter');
  let li=0, ci=0, deleting=false;
  let twTimer;
  function tick(){
    const full = lines[li];
    if(!deleting){
      ci++;
      el.textContent = full.slice(0,ci);
      if(ci===full.length){ deleting=true; twTimer=setTimeout(tick, 1400); return; }
    } else {
      ci--;
      el.textContent = full.slice(0,ci);
      if(ci===0){ deleting=false; li=(li+1)%lines.length; }
    }
    twTimer = setTimeout(tick, deleting ? 28 : 55);
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

  // ---- interactive terminal ----
  const terminalEl = document.getElementById('terminal');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalMirror = document.getElementById('terminalMirror');
  const termCursor = document.getElementById('termCursor');
  const cmdHistory = [];
  let histIndex = 0;

  function resizeTerminalInput(){
    terminalMirror.textContent = terminalInput.value || '';
    terminalInput.style.width = Math.max(10, terminalMirror.offsetWidth + 6) + 'px';
  }
  terminalInput.addEventListener('input', resizeTerminalInput);

  function scrollToId(id){
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior:'smooth' });
  }
  function printLine(text, cls){
    const line = document.createElement('div');
    line.className = 'term-out-line' + (cls ? ' '+cls : '');
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.classList.add('open');
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  const commands = {
    help: ()=> "available: help, whoami, about, experience, skills, projects, contact, resume, clear · tip: press ? anywhere for keyboard shortcuts",
    whoami: ()=> 'Christian Rosales — Junior Web & Mobile Developer, Caloocan City, PH. Open to entry-level roles.',
    about: ()=>{ scrollToId('about'); return 'recent BS Information Technology grad, builds web & mobile products end to end → jumping to About'; },
    experience: ()=>{ scrollToId('experience'); return 'Junior Web Developer Intern @ Alpha Centauri Garments Corporation → jumping to Experience'; },
    skills: ()=>{ scrollToId('skills'); return 'JavaScript, TypeScript, Dart, Node.js/Express, React Native, Next.js, Flutter, PostgreSQL → jumping to Skills'; },
    projects: ()=>{ scrollToId('projects'); return '01 Employee Attendance Monitoring App · 02 Staycation Haven Property Platform → jumping to Projects'; },
    contact: ()=>{ scrollToId('contact'); return 'christianrosales489@gmail.com · 0999 515 8428 → jumping to Contact'; },
    resume: ()=>{ document.querySelector('.hero-actions a[download]')?.click(); return 'opening resume…'; },
    clear: ()=>{ terminalOutput.innerHTML=''; terminalOutput.classList.remove('open'); return null; },
  };

  function runCommand(raw){
    const cmd = raw.trim();
    if (!cmd) return;
    printLine('$ '+cmd, 'term-echo');
    cmdHistory.push(cmd);
    histIndex = cmdHistory.length;

    if (cmd.toLowerCase() === 'sudo hire christian'){
      printLine('[sudo] password for hr: ********');
      printLine('permission granted. redirecting to contact →', 'term-ok');
      scrollToId('contact');
      return;
    }
    const handler = commands[cmd.toLowerCase()];
    if (handler){
      const out = handler();
      if (out) printLine(out);
      return;
    }
    printLine(`command not found: ${cmd} — type 'help'`, 'term-err');
  }

  let terminalActive = false;
  function activateTerminal(){
    if (terminalActive){ terminalInput.focus(); return; }
    terminalActive = true;
    clearTimeout(twTimer);
    el.style.display = 'none';
    termCursor.style.display = 'none';
    terminalInput.style.display = 'inline-block';
    resizeTerminalInput();
    terminalInput.focus();
  }
  function deactivateTerminal(){
    if (!terminalActive) return;
    terminalActive = false;
    terminalInput.style.display = 'none';
    terminalInput.value = '';
    resizeTerminalInput();
    el.style.display = 'inline';
    termCursor.style.display = 'inline-block';
    tick();
  }

  terminalEl.addEventListener('click', activateTerminal);
  terminalEl.addEventListener('keydown', e=>{
    if (e.target === terminalEl && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); activateTerminal(); }
  });
  terminalInput.addEventListener('keydown', e=>{
    if (e.key === 'Enter'){
      runCommand(terminalInput.value);
      terminalInput.value = '';
      resizeTerminalInput();
    } else if (e.key === 'ArrowUp'){
      e.preventDefault();
      if (histIndex > 0){ histIndex--; terminalInput.value = cmdHistory[histIndex] || ''; resizeTerminalInput(); }
    } else if (e.key === 'ArrowDown'){
      e.preventDefault();
      histIndex = Math.min(histIndex+1, cmdHistory.length);
      terminalInput.value = cmdHistory[histIndex] || '';
      resizeTerminalInput();
    } else if (e.key === 'Escape'){
      terminalInput.blur();
      deactivateTerminal();
    }
  });
  terminalInput.addEventListener('blur', ()=>{
    if (!terminalInput.value) deactivateTerminal();
  });

  // ---- keyboard shortcuts (press ?) ----
  const shortcutsOverlay = document.getElementById('shortcutsOverlay');
  const shortcutsClose = document.getElementById('shortcutsClose');
  let awaitingG = false, gTimer;

  function isTypingContext(){
    const ae = document.activeElement;
    return ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
  }
  function openShortcuts(){ shortcutsOverlay.hidden = false; }
  function closeShortcuts(){ shortcutsOverlay.hidden = true; }

  window.addEventListener('keydown', e=>{
    if (e.key === 'Escape'){ closeShortcuts(); return; }
    if (isTypingContext()) { awaitingG = false; return; }
    if (e.key === '?'){
      e.preventDefault();
      shortcutsOverlay.hidden ? openShortcuts() : closeShortcuts();
      return;
    }
    if (awaitingG){
      awaitingG = false; clearTimeout(gTimer);
      const dest = { a:'about', e:'experience', p:'projects', s:'skills', c:'contact' }[e.key.toLowerCase()];
      if (dest) scrollToId(dest);
      return;
    }
    if (e.key.toLowerCase() === 'g'){
      awaitingG = true;
      gTimer = setTimeout(()=>{ awaitingG = false; }, 1000);
    }
  });
  shortcutsClose.addEventListener('click', closeShortcuts);
  shortcutsOverlay.addEventListener('click', e=>{ if (e.target === shortcutsOverlay) closeShortcuts(); });

  // ---- magnetic buttons + project card tilt (skipped for touch / reduced-motion) ----
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canHover && !reduceMotion){
    // magnetic pull on primary buttons
    document.querySelectorAll('.btn, .nav-cta').forEach(btn=>{
      btn.addEventListener('mousemove', e=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * 0.3;
        const y = (e.clientY - r.top - r.height/2) * 0.4;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
    });

    // tilt + cursor-tracked spotlight on project flip-cards
    document.querySelectorAll('.flip-card').forEach(card=>{
      card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width;
        const py = (e.clientY - r.top)/r.height;
        card.style.setProperty('--mx', (px*100)+'%');
        card.style.setProperty('--my', (py*100)+'%');
        card.style.transform = `perspective(900px) rotateX(${(0.5-py)*3}deg) rotateY(${(px-0.5)*3}deg)`;
      });
      card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
    });
  }

  // ---- click-to-flip project cards ----
  // Real 3D flip when hover+fine-pointer are available; a simple stacked
  // reveal (no 3D transform) otherwise, so it stays usable on touch and
  // respects prefers-reduced-motion.
  document.querySelectorAll('[data-flip-card]').forEach(card=>{
    if (!canHover || reduceMotion) card.classList.add('simple');
    if (card.classList.contains('simple')) return; // normal document flow, no fixed height needed

    const inner = card.querySelector('.flip-inner');
    const front = card.querySelector('.flip-front');
    const back = card.querySelector('.flip-back');
    if (!inner || !front || !back) return;

    function measureBackHeight(){
      const pos = back.style.position, tr = back.style.transform;
      back.style.position = 'static';
      back.style.transform = 'none';
      const h = back.scrollHeight;
      back.style.position = pos;
      back.style.transform = tr;
      return h;
    }
    function applyHeight(){
      inner.style.height = (card.classList.contains('flipped') ? measureBackHeight() : front.scrollHeight) + 'px';
    }

    applyHeight(); // starts sized to the front only

    function toggleFlip(){
      const flipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', flipped);
      applyHeight();
    }
    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', e=>{
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleFlip(); }
    });

    let resizeT;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeT);
      resizeT = setTimeout(applyHeight, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(applyHeight);
  });

  document.querySelectorAll('[data-flip-card].simple').forEach(card=>{
    function toggleFlip(){
      const flipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', flipped);
    }
    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', e=>{
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleFlip(); }
    });
  });

  // ---- a little something for anyone who checks the console ----
  console.log('%cChristian Rosales', 'font:600 20px "Space Grotesk",sans-serif;color:#FF8A3D;');
  console.log('%cThanks for peeking under the hood — figured a fellow curious mind would end up here...Please Hire me :(', 'font:13px "JetBrains Mono",monospace;color:#8A93A6;');
  console.log('%cOpen to entry-level Web & Mobile roles → %cchristianrosales489@gmail.com', 'font:13px "JetBrains Mono",monospace;color:#8A93A6;', 'font:600 13px "JetBrains Mono",monospace;color:#FF8A3D;');

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

  // ---- screenshot lightbox ----
  const lightbox = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;

  function openLightbox(img){
    lastFocused = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = img.alt || '';
    lightbox.hidden = false;
    lightboxClose.focus();
  }
  function closeLightbox(){
    lightbox.hidden = true;
    lightboxImg.src = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.screenshot-strip img').forEach(img=>{
    img.addEventListener('click', e=>{
      e.stopPropagation(); // don't let the click also flip the project card
      openLightbox(img);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e=>{ if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', e=>{
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  // ---- security popover on card back ----
  document.querySelectorAll('.security-toggle').forEach(btn=>{
    const popover = btn.nextElementSibling;
    if (!popover || !popover.classList.contains('security-popover')) return;

    function closePopover(){
      popover.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const open = popover.hidden;
      popover.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    popover.addEventListener('click', e=> e.stopPropagation());
    document.addEventListener('click', e=>{
      if (!popover.hidden && !popover.contains(e.target) && e.target !== btn) closePopover();
    });
    window.addEventListener('keydown', e=>{
      if (e.key === 'Escape' && !popover.hidden) closePopover();
    });
    // close it if the card gets flipped back to front
    const card = btn.closest('[data-flip-card]');
    if (card){
      card.addEventListener('click', ()=>{ if (!card.classList.contains('flipped')) closePopover(); });
    }
  });
})();