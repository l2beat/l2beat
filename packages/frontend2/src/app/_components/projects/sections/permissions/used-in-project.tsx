import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { type UsedInProject } from './contract-entry.'
import Link from 'next/link'
import Image from 'next/image'

export function UsedInProjectEntry({
  label,
  implementations,
}: { label: string; implementations: UsedInProject[] }) {
  return (
    <div className="mt-2 flex flex-row items-center">
      <p className="text-gray-850 dark:text-gray-400">
        <strong className="text-black dark:text-white">{label}: </strong>
      </p>
      <div className="flex flex-row items-center">
        {implementations.map((project, i) => (
          // TODO: disabledOnMobile - see source
          <Tooltip key={i}>
            <TooltipTrigger>
              <Link
                href={`/${project.hrefRoot}/projects/${project.slug}/#${project.targetName}`}
              >
                <Image
                  width={20}
                  height={20}
                  key={i}
                  src={project.iconPath}
                  alt="Project icon"
                  className="mx-1 inline"
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <div>{project.name}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
