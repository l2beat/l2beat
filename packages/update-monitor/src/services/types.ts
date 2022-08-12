export interface BlockRow {
  BASE_FEE_PER_GAS: number | null // NUMBER(38,0) NULLABLE
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string | null // VARCHAR(66) NULLABLE
  CANONICAL: boolean | null // BOOLEAN NULLABLE
  GAS_LIMIT: number | null // NUMBER(38,0) NULLABLE
  GAS_USED: number | null // NUMBER(38,0) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  MINER: string | null // VARCHAR(42) NULLABLE
  PARENT_HASH: string | null // VARCHAR(66) NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TX_COUNT: number | null // NUMBER(38,0) NULLABLE
}

export interface CallRow {
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_DATA: string | null // VARCHAR(16777216) NULLABLE
  CALL_GAS: number | null // NUMBER(38,0) NULLABLE
  CALL_ID: string | null // VARCHAR(16777216) NULLABLE
  CALL_TYPE: string | null // VARCHAR(16777216) NULLABLE
  CALL_VALUE: number | null // NUMBER(38,0) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CREATED_ADDRESS: string | null // VARCHAR(42) NULLABLE
  EXCEPTION_ERROR: string | null // VARCHAR(16777216) NULLABLE
  FROM_ADDRESS: string | null // VARCHAR(42) NULLABLE
  GAS_REFUND: number | null // NUMBER(38,0) NULLABLE
  GAS_USED: number | null // NUMBER(38,0) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  MEMORY_WORD_COUNT: number | null // NUMBER(38,0) NULLABLE
  ORDER_INDEX: number | null // NUMBER(38,0) NULLABLE
  RETURN_VALUE: string | null // VARCHAR(16777216) NULLABLE
  REVERT_REASON: string | null // VARCHAR(16777216) NULLABLE
  STATUS: boolean | null // BOOLEAN NULLABLE
  STORAGE_ADDRESS: string | null // VARCHAR(42) NULLABLE
  SUCCESS: boolean | null // BOOLEAN NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TO_ADDRESS: string | null // VARCHAR(42) NULLABLE
  TX_HASH: string | null // VARCHAR(66) NULLABLE
}

export interface EventRow {
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_ID: string | null // VARCHAR(16777216) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CONTRACT: string | null // VARCHAR(42) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  LOG_DATA: string | null // VARCHAR(16777216) NULLABLE
  LOG_INDEX: number | null // NUMBER(38,0) NULLABLE
  ORDER_INDEX: number | null // NUMBER(38,0) NULLABLE
  STATUS: boolean | null // BOOLEAN NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TOPIC0: string | null // VARCHAR(66) NULLABLE
  TOPIC1: string | null // VARCHAR(66) NULLABLE
  TOPIC2: string | null // VARCHAR(66) NULLABLE
  TOPIC3: string | null // VARCHAR(66) NULLABLE
  TX_HASH: string // VARCHAR(66)
}

export interface StateDiffRow {
  ADDRESS: string | null // VARCHAR(42) NULLABLE
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_ID: string | null // VARCHAR(16777216) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CURR_VALUE: string | null // VARCHAR(66) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  ORDER_INDEX: number | null // NUMBER(38,0) NULLABLE
  PREV_VALUE: string | null // VARCHAR(66) NULLABLE
  REASON: string | null // VARCHAR(16777216) NULLABLE
  STATE_FIELD: string | null // VARCHAR(16777216) NULLABLE
  STATUS: boolean | null // BOOLEAN NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TX_HASH: string | null // VARCHAR(66) NULLABLE
}

export interface StorageDiffRow {
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_ID: string | null // VARCHAR(16777216) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CONTRACT: string | null // VARCHAR(42) NULLABLE
  CURR_VALUE: string | null // VARCHAR(66) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  LOCATION: string | null // VARCHAR(16777216) NULLABLE
  ORDER_INDEX: number | null // NUMBER(38,0) NULLABLE
  PREV_VALUE: string | null // VARCHAR(66) NULLABLE
  STATUS: boolean // BOOLEAN           Ye
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TX_HASH: string // VARCHAR(66)
}

export interface StorageReadRow {
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_ID: string | null // VARCHAR(16777216) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CONTRACT: string | null // VARCHAR(42) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  LOCATION: string | null // VARCHAR(16777216) NULLABLE
  ORDER_INDEX: number | null // NUMBER(38,0) NULLABLE
  STATUS: boolean | null // BOOLEAN NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TX_HASH: string // VARCHAR(66)
  VALUE: string | null // VARCHAR(66) NULLABLE
}

export interface TransactionRow {
  BLOCK: number // NUMBER(38,0)
  BLOCK_HASH: string // VARCHAR(66)
  CALL_DATA: string | null // VARCHAR(16777216) NULLABLE
  CANONICAL: boolean // BOOLEAN
  CHAIN_ID: number | null // NUMBER(38,0) NULLABLE
  CREATED_ADDRESS: string | null // VARCHAR(42) NULLABLE
  EXCEPTION_ERROR: string | null // VARCHAR(16777216) NULLABLE
  FROM_ADDRESS: string | null // VARCHAR(42) NULLABLE
  GAS_LIMIT: number | null // NUMBER(38,0) NULLABLE
  GAS_PRICE: number | null // NUMBER(38,0) NULLABLE
  GAS_REFUND: number | null // NUMBER(38,0) NULLABLE
  GAS_USED: number | null // NUMBER(38,0) NULLABLE
  LOAD_ID: Date // TIMESTAMP_NTZ(9)
  MAX_FEE_PER_GAS: number | null // NUMBER(38,0) NULLABLE
  MAX_PRIORITY_FEE_PER_GAS: number | null // NUMBER(38,0) NULLABLE
  RETURN_VALUE: string | null // VARCHAR(16777216) NULLABLE
  REVERT_REASON: string | null // VARCHAR(16777216) NULLABLE
  STATUS: boolean | null // BOOLEAN NULLABLE
  TIMESTAMP: Date // TIMESTAMP_NTZ(9)
  TO_ADDRESS: string | null // VARCHAR(42) NULLABLE
  TX_HASH: string // VARCHAR(66)
  TX_INDEX: number // NUMBER(38,0)
  TX_VALUE: number | null // NUMBER(38,0) NULLABLE
  TYPE: number | null // NUMBER(38,0) NULLABLE
}
