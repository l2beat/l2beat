export function getBaseUrl() {
  // TODO: probably should use some env variable
  return process.env.NODE_ENV === 'production'
    ? 'https://l2beat.com'
    : 'http://localhost:3000'
}
