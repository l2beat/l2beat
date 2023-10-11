/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
// eslint-disable-next-line import/no-default-export
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const res = await fetch("/api/scaling-tvl.json");

  const json: unknown = await res.json();

  response.status(200).send(json);
}
