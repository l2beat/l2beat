import type { TableReadyValue } from '@l2beat/config'
import { cva, type VariantProps } from 'class-variance-authority'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { SentimentText } from '../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'

type ProjectRisk = TableReadyValue & {
  regular?: Pick<TableReadyValue, 'value' | 'sentiment'>
}

interface Props extends Pick<VariantProps<typeof valueVariants>, 'variant'> {
  risk: ProjectRisk
}

const valueVariants = cva('font-medium', {
  variants: {
    variant: {
      table: 'text-base',
      rosette: 'text-heading-18',
    },
  },
  defaultVariants: {
    variant: 'table',
  },
})

const standaloneVariants = cva('', {
  variants: {
    variant: {
      table: '',
      rosette: 'flex flex-col gap-2',
    },
  },
  defaultVariants: {
    variant: 'table',
  },
})

const sectionDescriptionVariants = cva('mt-1 text-primary', {
  variants: {
    variant: {
      table: '',
      rosette: 'text-paragraph-13',
    },
  },
  defaultVariants: {
    variant: 'table',
  },
})

const standaloneDescriptionVariants = cva('text-primary', {
  variants: {
    variant: {
      table: 'mt-1',
      rosette: 'text-paragraph-13',
    },
  },
  defaultVariants: {
    variant: 'table',
  },
})

const warningVariants = cva('px-3 py-2', {
  variants: {
    variant: {
      table: 'mt-2',
      rosette: '',
    },
  },
  defaultVariants: {
    variant: 'table',
  },
})

export function ProjectRiskTooltipContent({ risk, variant }: Props) {
  const regular = risk.regular

  if (regular) {
    return (
      <div className="flex flex-col gap-3">
        <ProjectRiskTooltipSection
          label="Emergency"
          value={risk.value}
          sentiment={risk.sentiment ?? 'neutral'}
          description={risk.description}
          variant={variant}
        />
        <ProjectRiskTooltipSection
          label="Regular"
          value={regular.value}
          sentiment={regular.sentiment ?? 'neutral'}
          description={risk.warning?.value}
          variant={variant}
        />
      </div>
    )
  }

  return (
    <div className={standaloneVariants({ variant })}>
      <ProjectRiskTooltipSection
        value={risk.value}
        sentiment={risk.sentiment ?? 'neutral'}
        variant={variant}
      />
      {risk.warning && (
        <WarningBar
          className={warningVariants({ variant })}
          icon={RoundedWarningIcon}
          text={risk.warning.value}
          color={sentimentToWarningBarColor(risk.warning.sentiment)}
        />
      )}
      {risk.description && (
        <p className={standaloneDescriptionVariants({ variant })}>
          {risk.description}
        </p>
      )}
    </div>
  )
}

function ProjectRiskTooltipSection({
  label,
  value,
  sentiment,
  description,
  variant,
}: {
  label?: string
  value: string
  sentiment: NonNullable<TableReadyValue['sentiment']>
  description?: string
  variant: Props['variant']
}) {
  return (
    <div>
      <SentimentText
        sentiment={sentiment}
        vibrant={variant === 'rosette'}
        className={valueVariants({ variant })}
      >
        {label ? `${label}: ${value}` : value}
      </SentimentText>
      {description && (
        <p className={sectionDescriptionVariants({ variant })}>{description}</p>
      )}
    </div>
  )
}
