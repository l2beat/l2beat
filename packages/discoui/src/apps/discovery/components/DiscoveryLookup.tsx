import { useTheme } from '../../../theme'
import { renderAnsi } from '../panel-terminal/renderAnsi'
import { useTerminalStore } from '../panel-terminal/store'

type Props = {
  lines: number
}

export function DiscoveryLookup({ lines }: Props) {
  const { output, command } = useTerminalStore()
  const theme = useTheme()

  if (!command.inFlight) {
    return
  }

  return (
    <div className="overflow-x-hidden text-xs">
      <div className="border-coffee-400 border-b font-mono opacity-50">
        Outputs
      </div>
      <pre
        dangerouslySetInnerHTML={{
          __html: renderAnsi(output, theme)
            .split('\n')
            .slice(-lines)
            .join('\n'),
        }}
      />
    </div>
  )
}
