export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset or hard-navigation URL for sub-path hosts. */
export function withBasePath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
