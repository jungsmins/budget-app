import header from './components/header';
import footer from './components/footer';
import homePage from './pages/homePage';
import ledgerPage from './pages/ledgerPage';
import router from './router';

const headerEl = header();
const footerEl = footer();

const homePageEl = homePage();
const ledgerPageEl = ledgerPage();

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
  router.route(homePageEl, '/ledgers');
  router.route(ledgerPageEl, '/ledgers/:id');
  router.render();

  return appEl;
}

export default app;
