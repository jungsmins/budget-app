function createRouter() {
  let page;
  const routes = {};

  function init(pageEl) {
    page = pageEl;
  }

  function route(el, path) {
    routes[path] = el;
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
    for (const route in routes) {
      if (matchRoute(route, location.pathname)) {
        page.replaceChildren(routes[route]);
        return;
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
