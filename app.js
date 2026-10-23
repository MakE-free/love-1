const modal = document.querySelector('#success');
document.querySelector('#yes').addEventListener('click', () => {
  modal.showModal();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('span');
      heart.className = 'confetti'; heart.textContent = ['♡', '✧', '♥'][i % 3];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDelay = Math.random() + 's';
      document.body.append(heart); setTimeout(() => heart.remove(), 4500);
    }
  }
});
for (const button of modal.querySelectorAll('button')) button.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) { const rect = modal.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close(); } });
document.querySelector('#think').addEventListener('click', () => {
  document.querySelector('#answer-hint').textContent = 'Можно подумать сколько хочется. Моё приглашение тебя подождёт ♡';
  document.querySelector('#think').textContent = 'Спасибо за понимание ♡';
});
function showCollage(src) {
  const bounds = [[74/379,24/807,244/379,275/807],[59/379,301/807,280/379,280/807],[59/379,583/807,280/379,224/807]];
  const image = new Image();
  image.onload = () => {
    document.querySelectorAll('[data-crop]').forEach((frame, i) => {
      const [x,y,w,h] = bounds[i];
      const canvas = document.createElement('canvas'); canvas.width = 560; canvas.height = 620;
      const ctx = canvas.getContext('2d');
      const sw = image.width*w, sh = image.height*h;
      const scale = Math.max(canvas.width/sw, canvas.height/sh);
      ctx.drawImage(image,image.width*x,image.height*y,sw,sh,(canvas.width-sw*scale)/2,(canvas.height-sh*scale)/2,sw*scale,sh*scale);
      const photo = document.createElement('img'); photo.src = canvas.toDataURL('image/jpeg', .92); photo.alt = ['Ты — самая красивая','Я тебя мяумяу','Котик с букетом для тебя'][i];
      photo.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block'; frame.replaceChildren(photo);
    });
    document.querySelector('#photo-status').textContent = 'Три маленькие истории — теперь с твоими фото ♡';
  };
  image.src = src;
}
document.querySelector('#collage-file').addEventListener('change', event => {
  const file = event.target.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { document.querySelector('#photo-status').textContent = 'Выбери, пожалуйста, изображение'; return; }
  const reader = new FileReader(); reader.onload = () => { showCollage(reader.result); try { localStorage.setItem('date-collage', reader.result); } catch {} }; reader.readAsDataURL(file);
});
try { const saved = localStorage.getItem('date-collage'); if (saved) showCollage(saved); else { const image = new Image(); image.onload = () => showCollage('assets/collage.jpg'); image.src = 'assets/collage.jpg'; } } catch {}

// Separate original photos take priority over the optional collage.
const originals = [
  ['assets/portrait.jpg', 'Самая красивая — это ты'],
  ['assets/meow.jpg', 'Я тебя мяумяу'],
  ['assets/moment.jpg', 'Наш маленький момент']
];
originals.forEach(([src, alt], index) => {
  const image = new Image();
  image.alt = alt;
  image.onload = () => {
    image.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
    if (index === 0) image.style.objectPosition = '35% center';
    if (index === 1) image.style.objectFit = 'contain';
    document.querySelectorAll('[data-crop]')[index].replaceChildren(image);
  };
  image.src = src;
});
