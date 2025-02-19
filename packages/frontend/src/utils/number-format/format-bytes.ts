export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatBpsToMbps(bps: number): string {
  if (bps === 0) {
    return '0 MiB/s'
  }

  const mib = bps / 1024 ** 2
  const formattedThroughput = Number(mib.toPrecision(4))

  return `${formattedThroughput} MiB/s`
}
