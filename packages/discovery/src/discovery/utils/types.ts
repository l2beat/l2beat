export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
