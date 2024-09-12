import { range } from 'lodash'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Skeleton } from '~/components/core/skeleton'
import { PentagonRosetteSkeleton } from '~/components/rosette/pentagon/pentagon-rosette-skeleton'
import { cn } from '~/utils/cn'

const classes = (className: string) =>
  cn(
    'bg-zinc-300 dark:bg-zinc-800 md:bg-gray-100 md:dark:bg-zinc-900',
    className,
  )

export default function DaProjectPageSkeleton({
  header,
}: { header: React.ReactNode }) {
  return (
    <div>
      <div className="max-md:hidden">
        <Desktop>{header}</Desktop>
      </div>
      <div className="md:hidden">
        <Mobile>{header}</Mobile>
      </div>
    </div>
  )
}

function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        {children}
        <div className="flex gap-10">
          <div className="w-full space-y-4">
            <HorizontalSeparator className="my-6" />
            <div className="flex gap-1.5">
              {range(3).map((i) => (
                <Skeleton key={i} className={classes('h-8 w-28')} />
              ))}
            </div>
            <Skeleton className={classes('h-[200px] w-full mt-4')} />
          </div>
          <PentagonRosetteSkeleton />
        </div>
        <HorizontalSeparator className="my-6" />
        <AboutSectionLoading lines={2} />
        <HorizontalSeparator className="my-6" />
      </div>

      <div className="gap-x-12 md:flex">
        <div className="mt-10 flex w-[242px] shrink-0 flex-col gap-3">
          {range(5).map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className={classes('size-6')} />
              <Skeleton className={classes('h-6 w-40')} />
            </div>
          ))}
        </div>
        <Skeleton className={classes('h-[800px] w-full mt-10')} />
      </div>
    </>
  )
}

function Mobile({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-[54px] flex-nowrap items-center space-x-3 px-4">
        {range(6).map((i) => (
          <Skeleton
            key={i}
            className={classes('shrink-0 w-28 my-auto h-[22px]')}
          />
        ))}
      </div>
      <div className="bg-gray-100 px-4 dark:bg-zinc-900">
        {children}
        <div className="w-full space-y-4">
          <AboutSectionLoading lines={5} />
          <HorizontalSeparator className="!my-6 -mx-4 w-screen" />
          <div className="flex flex-col gap-3">
            {range(5).map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className={classes('h-5 w-28')} />
                <Skeleton className={classes('h-[18px] w-40')} />
              </div>
            ))}
          </div>
        </div>

        <HorizontalSeparator className="-mx-4 mt-6 w-screen" />
        <div className="flex h-[54px] items-center">
          <Skeleton className={classes('w-[180px] h-[22px]')} />
        </div>
      </div>
      <div className="px-4">
        <Skeleton className={classes('h-[800px] w-full mt-6 px-4')} />
      </div>
    </div>
  )
}

function AboutSectionLoading({ lines }: { lines: number }) {
  return (
    <div>
      <Skeleton className={classes('w-[45px] h-5')} />
      {range(lines).map((i) => (
        <Skeleton key={i} className={classes('w-full h-6 mt-1 first:mt-2')} />
      ))}
    </div>
  )
}
