'use client'
import { BigPentagonRosette } from '../_components/rosette/pentagon/big-pentagon-rosette'
import { BigPizzaRosette } from '../_components/rosette/pizza/big-pizza-rosette'

export default function Page() {
  return (
    <div className="h-screen w-screen flex gap-20 items-center justify-center">
      <BigPizzaRosette
        values={[
          {
            name: 'Exit window',
            value: 'No bridge',
            sentiment: 'bad',
            description: 'TODO',
          },
          {
            name: 'Economic security',
            value: 'Staked assets',
            sentiment: 'good',
            description: 'TODO',
          },
          {
            name: 'Accessibility',
            value: 'External',
            sentiment: 'warning',
            description: 'TODO',
          },
          {
            name: 'Fraud detection',
            value: 'DAS with blobs reconstruction',
            sentiment: 'warning',
            description: 'TODO',
          },
          {
            name: 'Attestations',
            value: 'No bridge',
            sentiment: 'bad',
            description: 'TODO',
          },
        ]}
      />

      <BigPentagonRosette
        values={[
          {
            name: 'Exit window',
            value: 'No bridge',
            sentiment: 'bad',
            description: 'TODO',
          },
          {
            name: 'Economic security',
            value: 'Staked assets',
            sentiment: 'good',
            description: 'TODO',
          },
          {
            name: 'Accessibility',
            value: 'External',
            sentiment: 'warning',
            description: 'TODO',
          },
          {
            name: 'Fraud detection',
            value: 'DAS with blobs reconstruction',
            sentiment: 'warning',
            description: 'TODO',
          },
          {
            name: 'Attestations',
            value: 'No bridge',
            sentiment: 'bad',
            description: 'TODO',
          },
        ]}
      />
    </div>
  )
}
