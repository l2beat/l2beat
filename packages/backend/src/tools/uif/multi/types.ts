export interface Configuration<T> {
  id: string
  properties: T
  /** Inclusive */
  minHeight: number
  /** Inclusive */
  maxHeight: number | null
}

export interface UpdateConfiguration<T> extends Configuration<T> {
  hasData: boolean
}

export interface SavedConfiguration<T> extends Configuration<T> {
  currentHeight: number | null
}

export interface RemovalConfiguration<T> {
  id: string
  properties: T
  /** Inclusive */
  from: number
  /** Inclusive */
  to: number
}

export interface ConfigurationRange<T> {
  /** Inclusive */
  from: number
  /** Inclusive */
  to: number
  configurations: Configuration<T>[]
}
