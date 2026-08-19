/* Shared by every page that paints a garden scenery behind its content. */

/* The garden background is a fixed full-viewport layer at z-index -1, just
   above the html canvas background. body, the sidebar layout wrapper, and the
   side nav panel all repeat the same opaque background color, which would
   hide it or cut it off at the nav edge - make them transparent on these pages
   only so the garden runs under the entire viewport. */
export const GARDEN_SURFACES_CSS = `
body{background:transparent}
.group\\/sidebar-wrapper{background:transparent}
[data-role="nav-sidebar"]>div{background:transparent}
`

/* Plant growth, idle motion and scenery animations. Referenced by name from
   inline styles in CropBadge and the background components, so both pages need
   these declared even if they only render some of the plants. */
export const GARDEN_ANIMATIONS_CSS = `
@keyframes garden-grow{0%{transform:scaleY(.02);opacity:0}55%{opacity:1}100%{transform:scaleY(1);opacity:1}}
@keyframes garden-leaf{0%{transform:scale(.01)}100%{transform:scale(1)}}
@keyframes garden-bloom{0%{transform:scale(0);opacity:0}70%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes garden-pop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.09)}100%{transform:scale(1);opacity:1}}
@keyframes garden-sway{0%,100%{transform:rotate(-2.6deg)}50%{transform:rotate(2.6deg)}}
@keyframes garden-sway-s{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes garden-wilt{0%,100%{transform:rotate(-.5deg) translateY(0)}50%{transform:rotate(1.6deg) translateY(.5px)}}
@keyframes garden-ghost{0%,100%{opacity:.5}50%{opacity:.82}}
@keyframes garden-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
`
