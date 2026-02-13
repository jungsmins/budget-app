function createRouter() {
  let page;
  const routes = {};

  function init(pageEl) {
    page = pageEl;
  }

  function route(handler, path) {
    routes[path] = handler;
  }

  function matchRoute(routePath, currentPath) {
    const routeSegments = routePath.split('/');
    const currentSegments = currentPath.split('/');

    if (routeSegments.length !== currentSegments.length) {
      return false;
    }

    return routeSegments.every((routeSegment, i) => {
      return (
        routeSegment.startsWith(':') || routeSegment === currentSegments[i]
      );
    });
  }

  function render() {
    const oldEl = page.firstElementChild;
    if (oldEl?.cleanup) {
      oldEl.cleanup();
    }

    for (const route in routes) {
      if (matchRoute(route, location.pathname)) {
        const handler = routes[route];
        const el = typeof handler === 'function' ? handler() : handler;
        page.replaceChildren(el);
        return;
      }
    }
  }

  function navigate(path) {
    history.pushState(null, '', path);
    render();
  }

  window.addEventListener('popstate', () => {
    render();
  });

  return {
    init,
    route,
    render,
    navigate,
  };
}

const router = createRouter();

export default router;
