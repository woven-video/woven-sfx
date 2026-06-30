const baseUrl = import.meta.env.BASE_URL;

export const SITE_BASE_PATH = baseUrl.endsWith("/")
  ? baseUrl.slice(0, -1)
  : baseUrl;

export function withSiteBase(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_BASE_PATH}${normalizedPath}`;
}
