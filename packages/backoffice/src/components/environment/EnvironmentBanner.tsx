import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '~/utils/cn'
import { type Environment, useEnvironment } from './EnvironmentContext'

export function EnvironmentBanner() {
  const { environment, setEnvironment, config, allConfigs } = useEnvironment()

  return (
    <SelectPrimitive.Root
      value={environment}
      onValueChange={(value) => setEnvironment(value as Environment)}
    >
      <SelectPrimitive.Trigger
        className={cn(
          'group sticky top-0 z-999 flex h-environment-banner w-full items-center justify-center gap-1.5 font-medium font-mono text-sm text-white uppercase leading-none outline-none transition-opacity hover:opacity-90 focus-visible:opacity-90',
          config.classNames.dot,
        )}
      >
        <span>{config.label}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          collisionPadding={0}
          avoidCollisions={false}
          className={cn(
            'relative z-[998] w-(--radix-select-trigger-width) overflow-hidden shadow-lg',
            'data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-full data-[state=open]:animate-in',
            'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-full data-[state=closed]:animate-out',
          )}
        >
          <SelectPrimitive.Viewport>
            {allConfigs.map(({ id, config }) => {
              if (id === environment) {
                return null
              }
              return (
                <SelectPrimitive.Item
                  key={id}
                  value={id}
                  className={cn(
                    'flex h-environment-banner w-full cursor-pointer items-center justify-center font-medium font-mono text-sm text-white uppercase leading-none outline-none transition-opacity data-[highlighted]:opacity-90',
                    config.classNames.dot,
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {config.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              )
            })}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
