interface FormatBytesOptions {
  decimals?: number
  unit?: 'B' | 'KiB' | 'MiB' | 'GiB'
}

export function formatBytes(bytes: number, opts?: FormatBytesOptions) {
  const decimals = opts?.decimals ?? 2
  const unit = opts?.unit

  if (unit) {
    const divisor = {
      B: 1,
      KiB: 1024,
      MiB: 1024 ** 2,
      GiB: 1024 ** 3,
    }[unit]

    return `${(bytes / divisor).toFixed(decimals)} ${unit}`
  }

  if (bytes < 1024) {
    return `${bytes.toFixed(decimals)} B`
  }
  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(decimals)} KiB`
  }
  if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 / 1024).toFixed(decimals)} MiB`
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(decimals)} GiB`
}

export function formatBpsToMbps(
  bps: number,
  opts?: { decimals?: number },
): string {
  const decimals = opts?.decimals ?? 5

  if (bps === 0) {
    return '0 MiB/s'
  }

  const mib = bps / 1024 ** 2
  const minimumValue = 10 ** -decimals
  if (mib < minimumValue) {
    return `<${minimumValue} MiB/s`
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })

  return `${formatter.format(mib)} MiB/s`
}
