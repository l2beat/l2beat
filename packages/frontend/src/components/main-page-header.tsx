'use client'
import { InfoIcon } from '~/icons/info'
import { SvgIcon, type SvgIconProps } from '~/icons/svg-icon'
import { cn } from '~/utils/cn'
import { useRecategorisationPreviewContext } from './recategorisation-preview/recategorisation-preview-provider'
import { RecategorisationPreviewSwitch } from './recategorisation-preview/recategorisation-preview-switch'
import { SearchBarButton } from './search-bar/search-bar-button'
import { ShowMoreText } from './show-more-text'

interface Props {
  children: React.ReactElement | string
  className?: string
  description?: React.ReactElement | string
  warning?: React.ReactElement | string
}

export function MainPageHeader({
  children,
  className,
  description,
  warning,
}: Props) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()

  return (
    <div>
      <header
        className={cn(
          'ml-2 flex items-center justify-between py-5 max-lg:hidden',
          (!!description || !!warning) && 'pb-4',
          className,
        )}
      >
        <div className="flex flex-col justify-center">
          <h1 className="text-[26px] font-bold">{children}</h1>
        </div>
        <div className="flex items-center gap-5">
          {isScalingMainPage && <RecategorisationPreviewSwitch />}
          <SearchBarButton />
        </div>
      </header>
      {(!!description || !!warning) && (
        <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-3 lg:pl-2">
          {warning && <Warning>{warning}</Warning>}
          {description && (
            <ShowMoreText
              pageTitle={typeof children === 'string' ? children : ''}
              textClassName="text-xs font-normal text-secondary"
              className={cn('px-4 pt-3 md:p-0', !warning && 'pt-4')}
            >
              {description}
            </ShowMoreText>
          )}
        </div>
      )}
    </div>
  )
}

interface WarningProps {
  children: React.ReactNode
  className?: string
}

function Warning({ children, className }: WarningProps) {
  return (
    <div
      className={cn(
        'flex items-start border-x-0 border-y border-yellow-700   bg-yellow-200 px-4 py-2 align-top text-[13px] font-medium leading-normal text-yellow-900 md:rounded-lg md:border-x md:px-6',
        className,
      )}
    >
      <div className="hidden size-5 items-center justify-center md:flex">
        <InfoIcon className="mr-2 inline size-4 shrink-0" variant="yellow" />
      </div>
      <span>{children}</span>
    </div>
  )
}

export function PizzaIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 128 128"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M20.24 47.26s-5.48 3.45-6.11 6.89c-.63 3.45.63 7.52 2.35 10.18s3.76 4.86 6.27 5.8s4.7.78 4.7.78s5.8 6.58 16.13 15.51S67.08 106 81.96 114.3s20.21 10.34 24.28 10.34s3.92-6.11 3.45-7.99s-26.63-31.01-26.63-31.01L20.24 47.26z"
        fill="#ff8e00"
      ></path>
      <path
        d="M31.21 62.46l-3.92-4.23s-4.07-7.68-7.83-7.68s-5.33 3.6-5.33 3.6s-.47-3.92 4.23-11.43s10.65-13.47 15.98-17.23s11.9-8.15 16.29-10.65S64.57 9.2 70.06 7.32c5.48-1.88 17.39-4.23 22.87-3.13c5.48 1.1 7.83 4.86 7.83 8.77s-.94 6.58-1.72 7.36s-5.95 5.17-5.95 5.17L31.21 62.46z"
        fill="#f5b03e"
      ></path>
      <path
        d="M42.2 45.95l-9.71 6.27l-4.07 7.99s.78 2.66 2.04 4.07c1.25 1.41 11.74 11.46 19.25 17.88c5.86 5.01 18.35 15.64 18.35 15.64s.51 5.34 1.1 9.09c.47 2.98.5 7.95 3.64 7.81c3.96-.18 1.68-8.2 4.82-8.12c6.27.16.05 17.12 6.79 17.03c5.37-.07 1.96-9.34 4.65-10.92c1.46-.86 4.36 2.79 9.09 4.86c5.84 2.55 9.4 4.48 11.28 3.6c3.97-1.86-4.4-45.23-5.34-52.59c-.94-7.36-5.62-45.16-5.94-46.41s-6.74-1.41-6.74-1.41l-9.87 3.45l-14.1 1.88l-16.6 9.87l-8.64 10.01z"
        fill="#ffcc8a"
      ></path>
      <path
        d="M39.75 44.38c-3.08 1.74-7.05 2.71-10.4 8.23c-2.79 4.6-3.53 9.31-1.54 9.67c1.99.36 3.5-6.58 6.15-9.22c4.25-4.25 7.69-4.7 10.13-6.96s5.11-8.4 15.28-13.83c11.85-6.33 18.93-4.66 21.7-5.7c3.62-1.36 4.6-3.58 9.13-4.52c4.79-.99 8.12.92 8.12.92s1.09-2.53-.36-3.71c-1.45-1.18-4.12-2.1-8.58-1.19c-4.88.99-8.5 4.25-9.49 4.34s-11.12-.45-23.15 6.42s-14.28 14.01-16.99 15.55z"
        fill="#cb6c22"
      ></path>
      <path
        d="M53.58 55.32L37.4 58.85s-.25 3.07-.09 3.98c.54 3.07 4.61 7.96 7.05 8.77s7.41.9 9.04.18c1.63-.72 6.51-4.25 7.14-6.15c.63-1.9.46-9.85-.8-11.12c-1.26-1.26-6.16.81-6.16.81z"
        fill="#db0d27"
      ></path>
      <path
        d="M42.19 50.26c-1.73 1.34-5.06 5.88-4.79 9.13c.27 3.26 5.88 8.95 7.41 9.49s6.51.63 7.78.27s6.15-3.98 6.87-5.24c.72-1.27 1.36-8.32.18-9.58s-4.7-4.97-7.5-5.79c-2.81-.81-8.32.45-9.95 1.72z"
        fill="#ed6d30"
      ></path>
      <path
        d="M83.6 65.45s-14.32-1.03-14.5-.13s-.51 4.38.4 7.18c.64 1.99 2.17 5.43 6.87 7.41s9.22-.18 10.4-1.09c2.21-1.7 3.62-3.8 3.98-5.06c.36-1.26-7.15-8.31-7.15-8.31z"
        fill="#db0d27"
      ></path>
      <path
        d="M76.64 57.94c-2.21.8-7.5 4.07-7.6 7.69c-.09 3.62 2.53 8.05 3.89 9.04s5.88 3.62 9.22 3.44c3.35-.18 7.96-2.89 8.59-4.34c.63-1.45.9-5.7.63-7.87s-4.97-7.05-7.32-7.78c-2.35-.72-5.42-.9-7.41-.18z"
        fill="#ed6d30"
      ></path>
      <path
        d="M76.1 91.76s-13.11-3.62-13.29-3.35c-.18.27-1.99 2.53-1.54 3.62c.45 1.09 5.06 4.79 6.96 6.42c1.9 1.63 7.64 5 8.32 4.88c1.63-.27 2.89-2.89 2.89-2.89l-3.34-8.68z"
        fill="#db0d27"
      ></path>
      <path
        d="M77.27 86.24c-3.2-2.35-7.87-2.17-10.4-.99c-2.53 1.18-4.07 2.71-4.34 3.89c-.27 1.18 1.82 3.45 2.64 4.08c.81.63 3.27 2.49 3.27 2.49s3.65 2.86 5 3.9c1.88 1.45 4.24 2.27 4.87 2.36c.63.09 3.57-3.71 3.03-8.78c-.28-2.59-1.38-4.97-4.07-6.95z"
        fill="#ed6d30"
      ></path>
      <path
        d="M100.06 79.01l-4.88-.18s-1.99 3.71-.63 7.87c1.11 3.4 3.44 5.43 7.32 6.51c3.89 1.09 6.06.7 6.06.7l.06-2.73l-7.93-12.17z"
        fill="#db0d27"
      ></path>
      <path
        d="M104.76 72.77s-6.02-.71-9.13 4.88c-2.38 4.29-.72 7.87 1.18 9.95c1.9 2.08 4.79 3.44 6.96 3.62s4.27.01 4.27.01s-.84-5.55-1.66-10.19c-.5-2.78-1.62-8.27-1.62-8.27z"
        fill="#ed6d30"
      ></path>
      <path
        d="M87.22 33.62s-11.66.36-12.39 1.54s-.72 6.42-.36 8.5s3.53 7.14 9.86 7.23c6.33.09 8.56-1.49 11.02-6.27c2.46-4.78-.1-10.13-.1-10.13l-8.03-.87z"
        fill="#db0d27"
      ></path>
      <path
        d="M87.31 28.28c-2.53-.49-6.06.54-7.78 1.72c-1.72 1.18-4.52 3.62-4.7 5.43c-.18 1.81 1.45 7.05 2.08 8.05c.63.99 3.25 3.68 4.07 4.07c1.9.9 7.14.45 8.68-.09s5.79-3.98 6.24-5.79s.99-4.88-1.09-8.59s-5.15-4.34-7.5-4.8z"
        fill="#ed6d30"
      ></path>
      <path
        d="M103.78 104.17l-10.41-.45s-1.4 2.81-.98 5.27c.34 2.04 2.03 4.82 5.06 5.99c1.72.66 6.22.23 7.32-.52c2.22-1.52 2.93-4.28 2.86-5.7c-.03-.74-3.85-4.59-3.85-4.59z"
        fill="#db0d27"
      ></path>
      <path
        d="M101.51 99.75c-2.7-.41-5.81 1.05-7.15 2.44c-1.34 1.39-1.61 3.13-1.1 5.23c.93 3.84 3.39 4.93 4.53 5.52c1.69.87 6.33.7 7.79-.41c1.45-1.1 2.55-2.98 2.21-5.87c-.35-2.9-1.63-6.21-6.28-6.91z"
        fill="#ed6d30"
      ></path>
      <path
        d="M36 31.03c.09 2.16 3.87 1.79 5.36 1.64c1.19-.12 4.17-.37 4.17-2.31s-2.6-1.93-4.54-1.86c-1.87.07-5.07.82-4.99 2.53z"
        fill="#fcc12b"
      ></path>
      <path
        d="M56.31 18.31c0 1.42 1.56 1.56 2.53 1.64c.97.07 2.23-.3 2.31-1.41c.07-1.12-.89-1.79-2.31-1.86c-1.49-.09-2.53.43-2.53 1.63z"
        fill="#fcc12b"
      ></path>
      <path
        d="M65.61 21.73c1.43 1.55 3.57-.52 4.32-1.49c.74-.97.89-2.46.07-3.2c-.82-.74-2.38.07-3.42 1.04s-1.86 2.68-.97 3.65z"
        fill="#fcc12b"
      ></path>
      <path
        d="M81.76 13.84c1.74 1.97 4.61-1.34 5.8-2.46c1.19-1.12 2.16-2.68 1.04-3.94c-1.12-1.26-3.65.52-4.61 1.64c-.97 1.11-3.35 3.5-2.23 4.76z"
        fill="#fcc12b"
      ></path>
      <path
        d="M26.92 47.25c1.69.4 2.24-1.6 2.53-3.13c.3-1.56.3-3.05-.97-3.27c-1.44-.25-2.23 1.19-2.46 2.6c-.19 1.27-.66 3.43.9 3.8z"
        fill="#fcc12b"
      ></path>
    </SvgIcon>
  )
}
