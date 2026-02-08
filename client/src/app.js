import header from './components/header';
import footer from './components/footer';
import homePage from './pages/homePage';
import transactionPage from './pages/transactionPage';
import router from './router';

const headerEl = header();
const footerEl = footer();

const homePageEl = homePage();
const transactionEl = transactionPage();

function app() {
  const appEl = document.createElement('div');
  appEl.className = 'app';
  const pageEl = document.createElement('div');
  pageEl.className = 'page';

  router.init(pageEl);

  appEl.appendChild(headerEl);
  appEl.appendChild(pageEl);
  appEl.appendChild(footerEl);

  router.route(homePageEl, '/');
  router.route(transactionEl, '/transactions');
  router.render();

  return appEl;
}

export default app;
