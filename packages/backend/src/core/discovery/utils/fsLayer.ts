import { readdirSync } from 'fs'
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
  const filenames = readdirSync(dirname(path))
  if (!filenames.includes(basename(path))) {
    return false
  }

  return true
}
