export interface HeadProps {
  title: string
  description: string
}

interface Font {
  family: string,
  style: string
  weight: number
  
}

export function Head(props: HeadProps) {
  const fontStyles = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/static/fonts/inter-regular.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/static/fonts/inter-medium.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/static/fonts/inter-semibold.woff2') format('woff2');
    }
  `;

  return (
    <>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
    </>
  )
}
