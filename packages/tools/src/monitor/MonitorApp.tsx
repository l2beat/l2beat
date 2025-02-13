import { useQuery } from '@tanstack/react-query'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'
import { DISCORD_BOT_AVATAR_URL, DISCORD_BOT_NAME } from './api/const'
import { fetchData } from './api/fetchData'
import { DiffPreview } from './components/diff-preview'
import Message from './components/message'

export function MonitorApp() {
  const result = useQuery({
    queryKey: ['monitor-data'],
    queryFn: fetchData,
    staleTime: 1000 * 60, // 1 minute
  })

  console.log(result.data, result.isLoading, result.isError, result.error)

  if (result.isPending || result.isLoading) {
    return <LoadingState />
  }

  if (result.isError) {
    console.error(result.error)
    return <ErrorState />
  }

  const entries = result.data

  return (
    <div className="flex flex-col gap-2 p-4">
      {entries.map((entry) => {
        const diffs = splitAndClean(entry.message)

        const diffPreviews = diffs.map((diff, index) => (
          <DiffPreview key={index} diff={diff} />
        ))

        return (
          <div
            key={`${entry.projectName}-${entry.chain}-${entry.blockNumber}`}
            className="flex w-full gap-2"
          >
            <Message
              authorName={DISCORD_BOT_NAME}
              timestamp={new Date(entry.timestamp * 1000).toUTCString()}
              title={
                <>
                  Detected changes on{' '}
                  <span className="font-bold">{entry.projectName}</span> on{' '}
                  <span className="font-bold">{entry.chain}</span> at block{' '}
                  <span className="font-bold">{entry.blockNumber}</span>
                </>
              }
              content={diffPreviews}
              avatarUrl={DISCORD_BOT_AVATAR_URL}
            />
          </div>
        )
      })}
    </div>
  )
}

function splitAndClean(s: string) {
  return s
    .split('```diff')
    .filter(Boolean)
    .map((s) => s.replace(/```/g, '').trim())
}
