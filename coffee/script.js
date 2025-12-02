// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href=a.getAttribute('href');
    if(href.length>1){ e.preventDefault(); document.querySelector(href).scrollIntoView({behavior:'smooth'}); }
  })
});

// Accordion
document.querySelectorAll('.accordion .item').forEach(item=>{
  const btn=item.querySelector('button');
  const content=item.querySelector('.content');
  btn.addEventListener('click',()=>{
    const open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', String(!open));
    content.style.maxHeight = open ? '0' : (content.scrollHeight+8)+ 'px';
  });
});

// Lightbox
const lb=document.getElementById('lightbox');
const lbImg=document.getElementById('lightbox-img');
const gallery=document.getElementById('gallery');
if(gallery){
  gallery.addEventListener('click', (e)=>{
    const t=e.target.closest('img');
    if(!t) return;
    lbImg.src=t.src;
    lb.showModal();
  });
}
if(lb){ lb.addEventListener('click', ()=> lb.close()); }

// Counters
const counters=document.querySelectorAll('.counter .num');
const io=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target; const target=+el.dataset.target; let cur=0; const inc=Math.ceil(target/80);
      const tick=()=>{cur+=inc; if(cur>=target){el.textContent=target.toLocaleString('ru-RU');} else {el.textContent=cur.toLocaleString('ru-RU'); requestAnimationFrame(tick);} };
      tick(); io.unobserve(el);
    }
  })
},{threshold:.5});
counters.forEach(c=>io.observe(c));

// --- Slider (viewport width translate) ---
const track=document.getElementById('slides');
const btnNext=document.getElementById('next');
const btnPrev=document.getElementById('prev');
if(track && btnNext && btnPrev){
  let index=0;
  const total = track.children.length;
  const viewport = track.parentElement; // .slider
  const move = () => {
    const w = viewport.clientWidth;
    track.style.transition = 'transform .45s ease';
    track.style.transform = `translateX(${-index * w}px)`;
  };
  btnNext.addEventListener('click', ()=>{ index=(index+1)%total; move(); });
  btnPrev.addEventListener('click', ()=>{ index=(index-1+total)%total; move(); });
  window.addEventListener('resize', move);
  move();
}

// --- Soft RU phone mask +7 (___) ___-__-__ ---
(function(){
  const input = document.querySelector('input[name="phone"]');
  if(!input) return;

  const formatRU = (digits) => {
    if(!digits) return '';
    if(digits[0] === '8') digits = '7' + digits.slice(1);
    if(digits[0] !== '7') digits = '7' + digits; // assume RU
    let res = '+7';
    if(digits.length>1) res += ' (' + digits.slice(1,4);
    if(digits.length>=4) res += ') ' + digits.slice(4,7);
    if(digits.length>=7) res += '-' + digits.slice(7,9);
    if(digits.length>=9) res += '-' + digits.slice(9,11);
    return res;
  };

  const onInput = (e) => {
    const raw = e.target.value.replace(/\D/g,'');
    if(raw.length === 0){ e.target.value = ''; return; } // мягкая маска: можно стереть всё
    e.target.value = formatRU(raw.slice(0,11));
  };

  const onFocus = (e)=>{
    if(!e.target.value) e.target.value = '+7 ';
  };
  const onBlur = (e)=>{
    if(e.target.value.replace(/\D/g,'').length <= 1) e.target.value = ''; // если только +7 — очищаем
  };

  input.addEventListener('input', onInput);
  input.addEventListener('focus', onFocus);
  input.addEventListener('blur', onBlur);
})();

// Form (demo)
const form=document.getElementById('form');
const status=document.getElementById('form-status');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    status.textContent='Спасибо! Мы свяжемся с вами в ближайшее время.';
    status.style.display='inline-flex';
    form.reset();
  });
}