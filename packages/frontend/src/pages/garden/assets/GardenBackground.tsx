import {
  type GardenFlower,
  GardenFlowers,
  GardenLandscape,
} from '~/components/garden/GardenSky'
import { PageBackdrop } from '~/layouts/PageBackdrop'

const FLOWERS: GardenFlower[] = [
  { left: '70%', bottom: '3%', width: 44 },
  { left: '78%', bottom: '4.5%', width: 52 },
  { left: '86%', bottom: '5.5%', width: 44 },
  { left: '93%', bottom: '6.5%', width: 48 },
]

/** The garden's landscape behind the whole page, the sun low over the hills. */
export function GardenBackground() {
  return (
    <PageBackdrop name="garden">
      <GardenLandscape
        lightClassName="top-[72%] left-[76%] size-[420px] max-md:size-60"
        ridgesClassName="h-56"
      >
        <GardenFlowers flowers={FLOWERS} />
      </GardenLandscape>
    </PageBackdrop>
  )
}
