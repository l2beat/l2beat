import { useId } from 'react'

export function useRosetteSvgLabel(description: string) {
  const titleId = useId()
  const descriptionId = useId()

  return {
    svgProps: {
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
    // Inside <defs> rather than directly under <svg>: browsers show a direct
    // <title> child as a native hover tooltip on top of the rosette's own one.
    label: (
      <defs>
        <title id={titleId}>Risk rosette</title>
        <desc id={descriptionId}>{description}</desc>
      </defs>
    ),
  }
}
