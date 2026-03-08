  // REVEAL ON SCROLL
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*80); });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  // SMOOTH NAV
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const t=document.querySelector(link.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
  });

  // GALLERY FILTER
  function filterGallery(cat,btn){
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gal-item').forEach(item=>{
      item.classList.toggle('hidden', cat!=='all' && item.dataset.cat!==cat);
    });
  }

  // RESPONSIVE GALLERY COLUMNS
  function updateColumns(){
    const g=document.querySelector('.gallery-masonry');
    if(!g) return;
    g.style.columns = window.innerWidth<600?'1':window.innerWidth<900?'2':'3';
  }
  updateColumns();
  window.addEventListener('resize',updateColumns);

  // IDIOMA ES / EN
  function setLang(lang, btn){
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('[data-es]').forEach(el=>{
      const text = el.getAttribute('data-'+lang);
      if(text) el.innerHTML = text;
    });
    document.title = lang==='en'
      ? 'Sanin Mai – Shipibo Conibo Healing Center'
      : 'Sanin Mai – Centro de Sanación Shipibo Conibo';
    document.documentElement.lang = lang;
    // Actualiza tooltip WhatsApp
    const tooltip = document.getElementById('waTooltip');
    if(tooltip) tooltip.textContent = lang==='en' ? 'Chat with us on WhatsApp!' : '¡Escríbenos por WhatsApp!';
  }