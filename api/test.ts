import type { VercelRequest, VercelResponse } from "@vercel/node";

// eslint-disable-next-line import/no-default-export
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.status(200).json({ path: __dirname });
}
