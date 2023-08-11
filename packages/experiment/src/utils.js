import fetch from "node-fetch";
import fs from "fs/promises";

export async function initDirectories() {
  await mkdirp("cache");
  await mkdirp("cache/contracts");
  await mkdirp("out");
}

export async function mkdirp(dir) {
  return fs.mkdir(dir, { recursive: true }).catch(() => {});
}

export async function getOrCache(fileName, get) {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch {
    const data = await get();
    await fs.writeFile(fileName, JSON.stringify(data));
    return data;
  }
}
export async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}
