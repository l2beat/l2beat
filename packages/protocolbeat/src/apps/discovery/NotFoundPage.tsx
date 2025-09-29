import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export function NotFoundPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center justify-center gap-2">
        <img className="w-[100px] md:w-[200px]" src="/logo.svg" alt="DSCVRY" />
        <h1 className="font-bold text-2xl">Page Not Found</h1>
      </div>

      <Button>
        <Link to="/ui" className="text-blue-500">
          Go back to the home page
        </Link>
      </Button>
    </div>
  )
}
