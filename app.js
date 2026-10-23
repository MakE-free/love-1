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
