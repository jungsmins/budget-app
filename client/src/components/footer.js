import './footer.css';

function footer() {
  const footerEl = document.createElement('footer');

  footerEl.innerHTML = `
    <div>가계부 앱</div>
  `;

  return footerEl;
}

export default footer;
