import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from './core/Empty'
import { Spinner } from './core/Spinner'

export function LoadingState({ className }: { className?: string }) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading...</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
