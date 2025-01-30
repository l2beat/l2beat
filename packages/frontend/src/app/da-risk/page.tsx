import type { Metadata } from 'next'
import { getDefaultMetadata } from '~/utils/metadata'

export const metadata: Metadata = getDefaultMetadata({
  title: 'L2BEAT - Data Availability Risk Framework',
  description: 'L2BEAT - Data Availability Risk Framework',
})

export default function Page() {
  return (
    <iframe
      src="https://drive.google.com/file/d/1sV1n8CGmxb96If7ey-qRvdmVXPI-h1aY/preview"
      className="h-screen w-full"
    />
  )
}
