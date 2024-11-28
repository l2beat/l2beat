export interface Config {
  name: string
  isLocal: boolean
  port: number
  database?: DatabaseConfig
}

export interface DatabaseConfig {
  connection: {
    connectionString: string
    ssl?: {
      rejectUnauthorized?: boolean
    }
  }
  connectionPoolSize: {
    min: number
    max: number
  }
}
