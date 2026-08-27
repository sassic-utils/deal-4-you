const BASE_URL = import.meta.env.BASE_URL;

export function getPathname() {
  let pathname = window.location.pathname;

  if (pathname.startsWith(BASE_URL)) {
    pathname = pathname.slice(BASE_URL.length);
  }

  return `/${pathname}`.replace(/\/+/g, "/");
}

export function buildHref(path: string) {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
}

export function navigate(path: string) {
  window.history.pushState({}, "", buildHref(path));
  window.dispatchEvent(new PopStateEvent("popstate"));
}
