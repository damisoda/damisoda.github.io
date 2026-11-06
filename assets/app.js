const doc = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function updateThemeLabel() {
  themeButton?.setAttribute('aria-label', doc.dataset.theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환');
}
updateThemeLabel();
themeButton?.addEventListener('click', () => {
  doc.dataset.theme = doc.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', doc.dataset.theme); } catch {}
  updateThemeLabel();
});
const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  document.querySelector('#navigation')?.classList.toggle('open', open);
});
document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  document.querySelector('#navigation')?.classList.remove('open');
}));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  let count = 0;
  document.querySelectorAll('.filter').forEach(other => {
    const selected = other === button;
    other.classList.toggle('active', selected);
    other.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = button.dataset.filter !== '전체' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector('.work-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
}));
document.querySelector('.copy-email')?.addEventListener('click', async event => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(event.currentTarget.dataset.email);
    status.textContent = '이메일 주소를 복사했습니다.';
  } catch {
    status.textContent = '위 이메일 주소를 선택해 복사하거나 클릭해 메일을 보내주세요.';
  }
});

document.querySelectorAll('[data-product-tour]').forEach(tour => {
  tour.querySelectorAll('[data-tour-image-src]').forEach(button => {
    button.addEventListener('click', () => {
      const image = tour.querySelector('[data-tour-image]');
      image.src = button.dataset.tourImageSrc;
      image.alt = `${button.dataset.tourTitle} · 기존 앱의 예제 데이터 화면`;
      tour.querySelector('.tour-description [data-tour-title]').textContent = button.dataset.tourTitle;
      tour.querySelector('.tour-description [data-tour-description]').textContent = button.dataset.tourDescription;
      tour.querySelector('[data-tour-caption]').textContent = `${button.dataset.tourLabel} · 실제 앱 데모 화면`;
      tour.querySelectorAll('[data-tour-image-src]').forEach(other => {
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });
});
