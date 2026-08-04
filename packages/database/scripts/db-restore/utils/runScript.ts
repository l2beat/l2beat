export function runScript(main: () => void): void {
  try {
    main()
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(
        'Error: a required tool was not found. Make sure psql, pg_dump and pg_restore are on your PATH.',
      )
    } else if (error instanceof Error && !('status' in error)) {
      // Only echo messages from our own throws — child-process failures
      // ('status' present) already printed their error via inherited stderr,
      // and their message embeds the full command line including the DB URL
      console.error(error.message)
    }
    console.error('❌ Restore failed.')
    process.exit(1)
  }
}
