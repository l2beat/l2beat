export function Fonts(props: { fonts: FontInfo[] }) {
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
`
  return <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
}
