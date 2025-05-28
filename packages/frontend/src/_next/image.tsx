import type { ImageProps } from '~/_next/image'

export default function Image({
  fill: _,
  ...props
}: ImageProps & { src: string }) {
  if (!props.src) {
    console.error('Image src is undefined', props)
  }
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />
}
