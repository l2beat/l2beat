/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readdirSync } from "fs";
// eslint-disable-next-line import/no-default-export
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const currentDir = readdirSync("./");
  const currentDir2 = readdirSync(__dirname);
  const prevDir = readdirSync("../");
  const prevPrevDir = readdirSync("../../");
  const prevPrevPrevDir = readdirSync("../../../");

  response.status(200).json({
    currentDir,
    currentDir2,
    prevDir,
    prevPrevDir,
    prevPrevPrevDir,
  });
}
