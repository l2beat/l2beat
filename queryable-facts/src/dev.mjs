import { doctor } from './doctor.mjs'

// Check before loading the server, including when solc is not installed yet.
if (await doctor()) {
  const { startServer } = await import('./server.mjs')
  startServer({ setupChecked: true })
} else process.exitCode = 1
