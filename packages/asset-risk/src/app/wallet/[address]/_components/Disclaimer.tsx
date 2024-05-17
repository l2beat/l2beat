import { Card } from '~/components/Card'

export function Disclaimer() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">
        How the Assets&apos; Risks Monitor work?
      </h2>
      <p className="text-sm font-medium text-zinc-500">
        This is a paragraph 2 ipsum dolor sit amet, consectetur adipiscing elit.
        Proin elementum nulla tortor, ac aliquet nisl this is a link pretium.
        Aliquam id eros ante. Suspendisse vehicula rutrum vehicula. Curabitur
        nec laoreet sapien. Donec quis vulputate magna, non suscipit felis.
      </p>
      <p className="text-sm font-medium text-zinc-500">
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
    </Card>
  )
}
