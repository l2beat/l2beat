import { L2BEATLogo } from '~/icons/logos/l2beat'

export function Disclaimer() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="flex items-center gap-1.5 font-oswald text-xl font-bold">
        How the INSIGHT by{' '}
        <L2BEATLogo className="h-8 w-20" aria-label="L2BEAT" /> work?
      </h2>
      <p className="text-sm font-medium leading-[170%] text-white/80">
        This is a paragraph 2 ipsum dolor sit amet, consectetur adipiscing elit.
        Proin elementum nulla tortor, ac aliquet nisl this is a link pretium.
        Aliquam id eros ante. Suspendisse vehicula rutrum vehicula. Curabitur
        nec laoreet sapien. Donec quis vulputate magna, non suscipit felis.
      </p>
      <p className="text-sm font-medium leading-[170%] text-white/80">
        Duis bibendum elementum leo sit amet dignissim. Vestibulum ante ipsum
        primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Aliquam posuere neque sit amet nunc rutrum sollicitudin. Vestibulum at
        euismod tortor. Ut imperdiet mattis ullamcorper. Sed eu erat maximus,
        mollis odio et, porttitor massa. Aenean auctor quam in mauris tempus
        ullamcorper. Cras eget nisi et magna pharetra sagittis. In aliquet
        porttitor aliquet. Curabitur ac ligula aliquet, egestas neque a,
        bibendum magna. Nullam aliquet vestibulum lorem ac hendrerit. Proin
        dictum ultrices orci sit amet maximus. Cras et tincidunt nisl, sit amet
        tempor justo. Cras eget mauris orci. Nam dictum ligula nunc, at tempor
        tellus pretium a. Duis consectetur pharetra elementum.
      </p>
    </div>
  )
}
