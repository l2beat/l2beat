import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";

// eslint-disable-next-line import/no-default-export
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const x = readFileSync("../packages/frontend/build/api/acrossv2-tvl.json");
  const json: unknown = JSON.parse(x.toString());
  response.status(200).json(json);
}
