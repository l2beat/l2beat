/**
 * Returns correct url to the static file. Because files are content-hashed in
 * production the urls cannot be known simply though filenames. An `example.png`
 * image file might become `example-5f78e32b.png` which enables caching but
 * requires careful handling of file urls.
 */
export function asset(file: string) {
  return `/dev-static/${file}`
}
