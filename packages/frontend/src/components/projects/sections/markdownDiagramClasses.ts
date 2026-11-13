/**
 * Diagrams embedded in section markdown get DiagramImage's treatment:
 * on phones they keep a readable 720px and scroll sideways inside their own
 * box (shrunk to the screen their labels fell to 3–6px), with a hint above;
 * in dark mode the hue rotation undoes the inversion's colour swap.
 */
export const MARKDOWN_DIAGRAM_CLASSES = [
  '[&_img]:dark:hue-rotate-180',
  'max-md:[&_p:has(>img)]:-mx-4 max-md:[&_p:has(>img)]:overflow-x-auto max-md:[&_p:has(>img)]:px-4',
  'max-md:[&_p:has(>img)]:text-left max-md:[&_img]:w-[720px] max-md:[&_img]:max-w-none',
  "max-md:[&_p:has(>img)]:before:block max-md:[&_p:has(>img)]:before:text-label-value-13 max-md:[&_p:has(>img)]:before:text-secondary max-md:[&_p:has(>img)]:before:content-['Scroll_sideways_to_see_the_whole_diagram.']",
].join(' ')

/**
 * Headings inside a section's markdown sit on the section's sub-heading step
 * (16/18px semibold, like TechnologyChoices), not 24px bold under a 24px
 * section title. Important: markdown.css sets the raw heading sizes unlayered.
 * Written out in full so Tailwind finds every class.
 */
export const MARKDOWN_HEADING_CLASSES = [
  '[&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:font-semibold! [&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:text-heading-16! [&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:leading-6!',
  'md:[&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:text-heading-18!',
  '[&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:mt-6! [&_:is(.mdc-h1,.mdc-h2,.mdc-h3)]:mb-2! [&_:is(.mdc-h1,.mdc-h2,.mdc-h3):first-child]:mt-0!',
].join(' ')
