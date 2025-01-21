import type { DiscoLupeProject } from './src/model'

export function IndicatorContainer(_: DiscoLupeProject, str: string) {
  const LUT: Record<string, string> = {
    Yes: '✅',
    No: '❌',
  }
  const value = LUT[str] ?? '❓'
  return <div>{value}</div>
}
