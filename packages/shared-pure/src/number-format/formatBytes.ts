interface FormatBytesOptions {
  decimals?: number
  unit?: 'B' | 'KiB' | 'MiB' | 'GiB' | 'TiB'
}

export function formatBytes(bytes: number | bigint, opts?: FormatBytesOptions) {
  const decimals = opts?.decimals ?? 2
  const unit = opts?.unit
  const value = Number(bytes)

  if (unit) {
    const divisor = {
      B: 1,
      KiB: 1024,
      MiB: 1024 ** 2,
      GiB: 1024 ** 3,
      TiB: 1024 ** 4,
    }[unit]

    return `${(value / divisor).toFixed(decimals)} ${unit}`
  }

  if (value < 1024) {
    return `${value.toFixed(decimals)} B`
  }
  if (value < 1024 ** 2) {
    return `${(value / 1024).toFixed(decimals)} KiB`
  }
  if (value < 1024 ** 3) {
    return `${(value / 1024 / 1024).toFixed(decimals)} MiB`
  }
  if (value < 1024 ** 4) {
    return `${(value / 1024 / 1024 / 1024).toFixed(decimals)} GiB`
  }

  return `${(value / 1024 / 1024 / 1024 / 1024).toFixed(decimals)} TiB`
}
