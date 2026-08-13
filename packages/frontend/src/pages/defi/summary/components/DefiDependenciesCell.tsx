import type { DefiDependency } from '~/server/features/defi/resolveDefiDependencies'

export function DefiDependenciesCell({
  dependencies,
}: {
  dependencies: DefiDependency[]
}) {
  if (dependencies.length === 0) {
    return <span className="font-medium text-sm">None</span>
  }

  return (
    <div className="-space-x-1.5 flex flex-row flex-nowrap items-center">
      {dependencies.map((dependency, index) => {
        const image = (
          <img
            src={dependency.icon}
            alt={`${dependency.name} logo`}
            title={dependency.name}
            width={20}
            height={20}
            className="relative size-5 min-w-5 rounded-full bg-white shadow"
            style={{ zIndex: dependencies.length - index }}
          />
        )

        if (!dependency.href) {
          return (
            <span key={`${dependency.name}:${dependency.icon}`}>{image}</span>
          )
        }

        return (
          <a
            key={`${dependency.name}:${dependency.icon}`}
            href={dependency.href}
          >
            {image}
          </a>
        )
      })}
    </div>
  )
}
