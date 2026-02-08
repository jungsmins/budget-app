import './header.css';
import router from '../router';

function header() {
  const headerEl = document.createElement('header');
  headerEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('title')) router.navigate('/');
  });

  headerEl.innerHTML = `
    <h1 class="title">가계부</h1>
  `;

  return headerEl;
}

export default header;
