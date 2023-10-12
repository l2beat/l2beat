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
  const games = readdirSync("../games");
  const gopher = readdirSync("../gopher");
  const kerberos = readdirSync("../kerberos");
  const lang = readdirSync("../lang");
  const lib = readdirSync("../lib");
  const local = readdirSync("../local");
  const lock = readdirSync("../lock");
  const log = readdirSync("../log");
  const mail = readdirSync("../mail");
  const nis = readdirSync("../nis");
  const opt = readdirSync("../opt");
  const preserve = readdirSync("../preserve");
  const rapid = readdirSync("../rapid");
  const run = readdirSync("../run");
  const runtime = readdirSync("../runtime");
  const spool = readdirSync("../spool");
  const task = readdirSync("../task");
  const telemetry = readdirSync("../telemetry");
  const tmp = readdirSync("../tmp");
  const tracer = readdirSync("../tracer");
  const yp = readdirSync("../yp");

  response.status(200).json({
    apiDir,
    adm,
    cache,
    db,
    empty,
    games,
    gopher,
    kerberos,
    lang,
    lib,
    local,
    lock,
    log,
    mail,
    nis,
    opt,
    preserve,
    rapid,
    run,
    runtime,
    spool,
    task,
    telemetry,
    tmp,
    tracer,
    yp,
  });
}
