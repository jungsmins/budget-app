function createRouter() {
  let page;
  const routes = {};

  function init(pageEl) {
    page = pageEl;
  }

  function route(el, path) {
    routes[path] = el;
  }

  function render() {
    for (const route in routes) {
      if (location.pathname === route) {
        page.replaceChildren(routes[route]);
      }
    }
  }

  function navigate(path) {
    history.pushState(null, '', path);
    render();
  }

  return {
    init,
    route,
    render,
    navigate,
  };
}

const router = createRouter();

export default router;
