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
  const tooltip = document.getElementById('waTooltip');
  if(tooltip) tooltip.textContent = lang==='en' ? 'Chat with us on WhatsApp!' : '¡Escríbenos por WhatsApp!';
}

// ── LIGHTBOX ──
// Construir lightbox al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Crear el overlay del lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div id="lb-backdrop"></div>
    <button id="lb-close" aria-label="Cerrar">✕</button>
    <button id="lb-prev" aria-label="Anterior">‹</button>
    <button id="lb-next" aria-label="Siguiente">›</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="">
      <p id="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  // Índice de imágenes visibles
  let currentIndex = 0;

  function getVisibleItems(){
    return [...document.querySelectorAll('.gal-item:not(.gal-placeholder):not(.hidden)')];
  }

  function openLightbox(index){
    const items = getVisibleItems();
    if(!items.length) return;
    currentIndex = ((index % items.length) + items.length) % items.length;
    const img = items[currentIndex].querySelector('img');
    const caption = items[currentIndex].querySelector('.gal-overlay span');
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt;
    document.getElementById('lb-caption').textContent = caption ? caption.textContent : '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Mostrar/ocultar flechas
    document.getElementById('lb-prev').style.display = items.length > 1 ? 'flex' : 'none';
    document.getElementById('lb-next').style.display = items.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox(){
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click en imágenes de galería
  document.getElementById('galleryGrid').addEventListener('click', e => {
    const item = e.target.closest('.gal-item:not(.gal-placeholder)');
    if(!item) return;
    const items = getVisibleItems();
    const index = items.indexOf(item);
    if(index !== -1) openLightbox(index);
  });

  // Controles
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); openLightbox(currentIndex - 1); });
  document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); openLightbox(currentIndex + 1); });

  // Teclado
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('active')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if(e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });

  // Swipe táctil
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  lb.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if(Math.abs(diff) > 50) diff > 0 ? openLightbox(currentIndex + 1) : openLightbox(currentIndex - 1);
  });
});