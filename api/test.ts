/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readdirSync } from "fs";
// eslint-disable-next-line import/no-default-export
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const apiDir = readdirSync("./api");
  const adm = readdirSync("../adm");
  const cache = readdirSync("../cache");
  const db = readdirSync("../db");
  const empty = readdirSync("../empty");
  const lib = readdirSync("../lib");
  const local = readdirSync("../local");

  const run = readdirSync("../run");
  const runtime = readdirSync("../runtime");

  response.status(200).json({
    apiDir,
    adm,
    cache,
    db,
    empty,
    lib,
    local,
    run,
    runtime,
  });
}
