import { readdirSync, statSync } from 'fs'
import { basename, dirname } from 'path'

// NOTE(radomski): On some file systems, mainly Apple's AFS and Microsoft's
// NTFS the path names are not case sensitive. So while you can have a file
// named "README.md" and "readme.md" in two different directories you can't
// have them in the same directory. The only case sensitive file system is ext4
// used mainly on Linux. The node `fs` calls are going to apply the used file
// systems rules. So if you have a file called "README.md" but you do
// `fs.readFileSync("readme.MD")` it will still work on AFS or NTFS. To make
// sure that a given file exists with the same basename as provided in the path
// use this function.
export function fileExistsCaseSensitive(path: string): boolean {
  return listDirectory(dirname(path)).has(basename(path))
}

// Every project lookup lists the same large projects directory, which
// dominated config loading. A directory's mtime changes whenever an entry is
// added, removed or renamed, so a stat is enough to know the listing is fresh.
const directoryListings = new Map<
  string,
  { mtimeMs: number; names: Set<string> }
>()

function listDirectory(directory: string): Set<string> {
  const { mtimeMs } = statSync(directory)
  const cached = directoryListings.get(directory)
  if (cached?.mtimeMs === mtimeMs) {
    return cached.names
  }
  const names = new Set(readdirSync(directory))
  directoryListings.set(directory, { mtimeMs, names })
  return names
}
