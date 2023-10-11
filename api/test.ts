import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";

// eslint-disable-next-line import/no-default-export
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const file = path.join(process.cwd(), "files", "test.json");
  response.status(200).json({ path: file });
}
