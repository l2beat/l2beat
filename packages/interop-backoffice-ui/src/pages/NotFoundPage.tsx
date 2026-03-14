import { Link } from 'react-router-dom'
import { Button } from '~/components/core/Button'

export function NotFoundPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-2xl">Page Not Found</h1>
      </div>

      <Button>
        <Link to="/">Go back to the home page</Link>
      </Button>
    </div>
  )
}
