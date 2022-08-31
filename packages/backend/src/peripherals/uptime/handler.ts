type UptimeResult =
  | { active: boolean; time: bigint } // TODO: remove
  | { active: true; time: number }
  | { active: false; error: string }

interface Handler<T extends { type: string }> {
  canHandle(x: { type: string }): x is T
  handle: (x: T) => Promise<UptimeResult>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UptimeHandlers = Handler<any>[]

export function makeHandler<T extends { type: string }>(
  type: T['type'],
  handle: (uptime: T) => Promise<UptimeResult>,
) {
  return {
    canHandle(uptime: { type: string }): uptime is T {
      return uptime.type === type
    },
    handle,
  }
}
