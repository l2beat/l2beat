import { Button } from '@l2beat/frontend'

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">View project</Button>
      <Button variant="outline">Compare</Button>
      <Button variant="fill">Submit a project</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="fill" size="default">
        Default size
      </Button>
      <Button variant="fill" size="sm">
        Small size
      </Button>
    </div>
  )
}

// `asChild` swaps the rendered element while keeping the button styling —
// the idiomatic way to make a link look like a button.
export function AsLink() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="fill" asChild>
        <a href="https://l2beat.com/scaling/summary">Open Scaling summary</a>
      </Button>
      <Button variant="outline" asChild>
        <a href="https://l2beat.com/donate">Donate</a>
      </Button>
    </div>
  )
}
