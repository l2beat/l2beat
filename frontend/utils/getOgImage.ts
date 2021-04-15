import captureWebsite from 'capture-website';
import memoize from 'lodash/memoize';
export function getImage_(project?: string) {
  const url = process.env.VERCEL_URL || `http://localhost:3000`;
  console.log("RUN", project, process.env.VERCEL_URL, url)
  return captureWebsite.buffer(`${url}/og/${project || ''}`, { width: 1200, height: 620 });
}
export const getOgImage = memoize(getImage_);
