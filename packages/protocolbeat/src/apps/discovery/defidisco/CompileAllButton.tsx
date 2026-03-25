import { useState } from 'react'
import { compileAllReviews } from '../../../api/api'
import { IconRefresh } from '../../../icons/IconRefresh'

export function CompileAllButton() {
  const [compiling, setCompiling] = useState(false)

  function handleCompileAll() {
    setCompiling(true)
    compileAllReviews()
      .then((data) => {
        const compiled = data.results.filter((r) => r.status === 'success')
        const failed = data.results.filter((r) => r.status === 'error')
        alert(
          `Compiled ${compiled.length} review${compiled.length !== 1 ? 's' : ''}` +
            (failed.length > 0
              ? `, ${failed.length} failed: ${failed.map((f) => f.project).join(', ')}`
              : ''),
        )
      })
      .catch((err) => {
        alert(`Failed to compile reviews: ${err.message}`)
      })
      .finally(() => setCompiling(false))
  }

  return (
    <button
      className="flex items-center justify-center self-stretch border border-coffee-600 px-4 text-coffee-400 transition-colors duration-100 hover:cursor-pointer hover:bg-coffee-600 disabled:opacity-50"
      disabled={compiling}
      onClick={handleCompileAll}
      title="Recompile all reviews"
    >
      <IconRefresh className={compiling ? 'animate-spin' : undefined} />
    </button>
  )
}
