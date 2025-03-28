import { useQuery } from '@tanstack/react-query'
import type { LottieComponentProps } from 'lottie-react'
import { Suspense, lazy } from 'react'
import { Skeleton } from './core/skeleton'

const LazyLottieComponent = lazy(() => import('lottie-react'))

interface LottieProps<T extends Record<string, unknown>> {
  getJson: () => Promise<T>
  id: string
}

// Lotty uses obsolete navigator API and is not ssr friendly :(
// that's why we need to do such mumbo jumbo with lazy loading
export function LazyLottie<T extends Record<string, unknown>>({
  getJson,
  id,
  ...props
}: LottieProps<T> & Omit<LottieComponentProps, 'animationData'>) {
  const { data } = useQuery({
    queryKey: [id],
    queryFn: getJson,
    enabled: typeof window !== 'undefined',
  })

  if (!data) return <Skeleton className={props.className} />

  return (
    <Suspense fallback={<Skeleton className={props.className} />}>
      <LazyLottieComponent animationData={data} {...props} />
    </Suspense>
  )
}
