/**
 * Messages between `JqRunner` (main thread) and `jqWorker.js`.
 *
 * The worker forwards jq's raw result instead of interpreting it, so the
 * runner owns every decision about what counts as success and can be tested
 * without a thread.
 */
export interface JqRequest {
  id: number
  filter: string
  /**
   * JSON text rather than a value: jq parses it itself, so integers above
   * 2^53 keep their literal precision instead of going through a JS number.
   */
  inputJson: string
}

export type JqResponse =
  | { id: number; ok: true; stdout: string; stderr: string; exitCode: number }
  | { id: number; ok: false; message: string }
