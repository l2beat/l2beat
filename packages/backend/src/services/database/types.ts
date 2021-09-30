export {}

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: string
    block_number: number
  }

  interface Tables {
    block_numbers: BlockNumberRow
  }
}
