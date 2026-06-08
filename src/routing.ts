export function basePathFrom(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed === "/" ? "" : trimmed;
}

export function normalizeRoute(pathname: string, baseUrl = import.meta.env.BASE_URL) {
  const basePath = basePathFrom(baseUrl);
  if (basePath && pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped.startsWith("/") ? stripped || "/" : `/${stripped}`;
  }
  return pathname || "/";
}

export function routeHref(path: string, baseUrl = import.meta.env.BASE_URL) {
  const basePath = basePathFrom(baseUrl);
  return basePath ? `${basePath}${path}` : path;
}
