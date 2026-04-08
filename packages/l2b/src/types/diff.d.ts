declare module 'diff' {
  export interface Change {
    added?: boolean
    removed?: boolean
    value: string
  }

  export function diffLines(oldString: string, newString: string): Change[]
  export function diffWords(oldString: string, newString: string): Change[]
}
