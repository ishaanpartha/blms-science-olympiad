// Simple active nav highlighter
(function(){
  const path = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const url = new URL(href, location.origin);
    if (url.pathname === path || (path === '/' && url.pathname.endsWith('/index.html'))) {
      a.classList.add('active');
    }
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// =============================================================
// DARK / LIGHT THEME
// =============================================================
(function(){
  const btn = document.getElementById('modeToggle');
  const lsKey = 'blms_theme';
  const saved = localStorage.getItem(lsKey);
  if(saved === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
  }

  function sync(){
    btn.setAttribute('aria-pressed',
      document.documentElement.getAttribute('data-theme') === 'dark'
    );
  }
  sync();

  btn.addEventListener('click', ()=>{
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem(lsKey, isDark ? 'light' : 'dark');
    sync();
  });
})();

// =============================================================
// Card hover light effect + whole-card click
// =============================================================
(function(){
  const cards = document.querySelectorAll('.card');
  cards.forEach(card=>{
    card.addEventListener('pointermove', e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });

    card.addEventListener('click', e=>{
      const direct = e.target.closest('a[href]');
      const href = direct?.getAttribute('href') || card.getAttribute('data-link');
      if(href) location.href = href;
    });
  });
})();

// =============================================================
// Keyboard shortcuts
// =============================================================
(function(){
  let leader=false, timer=null;
  function activate(){
    leader=true;
    clearTimeout(timer);
    timer=setTimeout(()=>leader=false, 1400);
  }

  document.addEventListener('keydown', e=>{
    if(e.key==='g'){ activate(); return; }
    if(e.key==='d'){ document.getElementById('modeToggle').click(); return; }
    if(!leader) return;

    if(e.key==='h') location.href='index.html';
    if(e.key==='r') location.href='roster.html';
    if(e.key==='t') location.href='attendance-tracker.html';
    if(e.key==='p') location.href='attendance-report.html';
  });
})();

// =============================================================
// ⭐ DYNAMIC ANNOUNCEMENTS LOADER ⭐
// =============================================================
(function(){
  const box = document.getElementById('announcements');
  if(!box) return;

  fetch('announcements.json')
    .then(r => r.json())
    .then(items => {
      box.innerHTML = "";
      items.forEach(item => {
        const row = document.createElement('div');
        row.style.padding = "12px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,.25)";
        row.innerHTML = `
          <div style="font-weight:700; opacity:.9; margin-bottom:4px;">
            ${item.date}
          </div>
          <div style="opacity:.95;">
            ${item.text}
          </div>
        `;
        box.appendChild(row);
      });
    })
    .catch(err=>{
      box.innerHTML = "<p style='opacity:.6;'>Unable to load announcements.</p>";
      console.error(err);
    });
})();
