/**
 * Where a templatizer run leaves its trail.
 *
 * A model-drafted template is only reviewable with the prompt that produced
 * it, the raw responses, and the findings and dry run of each round, so the
 * loop writes each of them as it goes rather than keeping them in memory
 * until the end (a killed run still leaves evidence). The sink is an
 * interface so the loop's tests read the trail from memory instead of a
 * temporary directory.
 */
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import fs from 'fs'
import path from 'path'

/** One directory per project and address, so a rerun replaces its own trail only. */
export function trailDirectory(
  artifactsRoot: string,
  project: string,
  address: ChainSpecificAddress,
): string {
  return path.join(artifactsRoot, project, address.toString())
}

export interface ArtifactSink {
  write(name: string, content: string): void
}

export class FileArtifactSink implements ArtifactSink {
  constructor(readonly directory: string) {}

  /**
   * A sink over an emptied directory: a rerun that takes fewer rounds must
   * not leave the earlier run's later rounds beside its own as evidence.
   */
  static fresh(directory: string): FileArtifactSink {
    fs.rmSync(directory, { recursive: true, force: true })
    return new FileArtifactSink(directory)
  }

  write(name: string, content: string): void {
    fs.mkdirSync(this.directory, { recursive: true })
    fs.writeFileSync(path.join(this.directory, name), content)
  }
}

export class MemoryArtifactSink implements ArtifactSink {
  readonly files = new Map<string, string>()

  write(name: string, content: string): void {
    this.files.set(name, content)
  }
}
