// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { startServer } from './startServer'

async function main() {
  await startServer({ mode: 'development' })
}

main()
