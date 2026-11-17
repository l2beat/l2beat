# Maintenance page

[`index.html`](index.html) is a self-contained page that can be served while the
application and its asset servers are unavailable due to maintenance.
Upload only this file to your maintenance host, such as object storage, with
`Content-Type: text/html; charset=utf-8`.

There is no JavaScript, framework runtime, build step, or external asset request.
The file lives outside `static/` so the frontend's asset-hashing pipeline does not
rename it or include it in the application build. Its contents are maintained
directly; changes to the source assets below do not automatically update this page.

## How the assets are embedded

### Logo and illustration

The header logo is inline `<svg>` markup, not an image URL or a raster screenshot.
Its eight path definitions come from [`Logo.tsx`](../src/components/Logo.tsx), with
the full logo's `viewBox="0 0 1038 442"`. JSX attributes are converted to HTML/SVG
attributes (`className` to `class`, `fillRule` to `fill-rule`, and `clipRule` to
`clip-rule`). React props and the component's animation are omitted.

The central illustration reuses the first four paths, which form the heart and
its ETH lettering, with `viewBox="0 0 501 442"`. The surrounding circles and pulse
line are decorative SVG shapes drawn directly in this file. The heart has a
small CSS animation; `prefers-reduced-motion` disables it.

The SVG classes are styled locally using colors from
[`globals.css`](../src/styles/globals.css): pink `#ff3776`, white lettering, and
a `#0d0c0c` wordmark that becomes white in dark mode. No shared stylesheet is loaded.

### Favicon

The favicon contains the same four heart paths in a separate SVG document. That
document includes the SVG namespace, the heart viewBox, and explicit fill colors
because it cannot inherit the page's CSS. Its UTF-8 bytes are Base64-encoded and
placed in the icon link:

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,...">
```

The `data:` URL contains the image itself, so the browser does not need to fetch
a favicon file from the maintenance host or the application.

### Fonts

Roboto's Latin regular (400) and bold (700) WOFF2 files are embedded as Base64
data URLs in two `@font-face` rules. The source files are:

- [`roboto-v48-latin-400.woff2`](../static/fonts/roboto/roboto-v48-latin-400.woff2)
- [`roboto-v48-latin-700.woff2`](../static/fonts/roboto/roboto-v48-latin-700.woff2)

Each rule follows this structure, with the corresponding weight and encoded data:

```css
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,...) format("woff2");
}
```

The Roboto copyright notice and SIL Open Font License are retained in an HTML
comment. Keep them when updating or distributing the file. URLs in that comment
are attribution text, not resources the browser loads.

### Styles and behavior

All CSS is in the document's `<style>` element. Media queries handle narrow
screens, the system's light/dark preference, reduced motion, and forced colors.
The page has no automatic reload or redirects. Maintenance routing and the HTTP
response status are configured by the host; the HTML alone cannot return a 503.

## Updating the page

Edit copy and layout directly in `index.html`. When changing the branding, update
all three copies of the mark: the header logo, the illustration's heart, and the
encoded favicon. Preserve SVG path order, fill rules, and viewBoxes from the
source component, and check the local color rules against the frontend palette.

To encode an updated font or a standalone favicon SVG, run this command with
the source file's path, then paste the output after the relevant `base64,` prefix:

```sh
python3 -c 'import base64, pathlib, sys; print(base64.b64encode(pathlib.Path(sys.argv[1]).read_bytes()).decode("ascii"))' path/to/asset
```

Base64 embeds the original bytes; it does not compress or optimize them. Keep
only the font weights and artwork the page uses. Do not replace the inline
assets with references to the application, local asset files, or a CDN.

## Preview and verification

Open `index.html` directly in a browser. No dependency installation is required.
Before uploading an updated version:

- Check desktop and narrow mobile widths for clipping or horizontal scrolling.
- Check light mode, dark mode, and reduced motion.
- Reload with JavaScript disabled and the browser offline; the local file should
  still render with its logo and fonts.
- Inspect the Network panel for unexpected external requests. With HTTP hosting,
  the document is the only resource that needs a network request.
- If assets changed, compare SVG paths with `Logo.tsx` and decoded font data with
  the WOFF2 source files. The favicon can be decoded from its Base64 payload for
  the same comparison.

Only `index.html` is needed at runtime; this README is documentation for maintainers.
