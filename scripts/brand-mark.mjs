/**
 * ZarishNoksha brand mark — single source of truth.
 *
 * A two-glyph ZN monogram cut from angular slabs: "zarish" (daughter's middle
 * name) + "noksha" (নকশা, Bengali for design / blueprint). Flat vectors that
 * fill with currentColor so the mark inherits whatever color the surface uses
 * (kinpaku gold on near-black, ink on light).
 *
 * viewBox is 0 0 24 24; the letters sit on a shared cap/baseline with even
 * gutters. Use MARK_PATHS to inline the <path> elements, or markSvg() for the
 * full <svg> fragment.
 */

export const MARK_PATHS = [
  "M2 2.5h8.5v3H2zM10.5 6.8v3l-8 10.7v-3zM2 18.5h8.5v3H2z",
  "M13.5 2.5h3v19h-3zM19 2.5h3v19h-3zM16 2.5l3.5 17l-2.25.47l-3.5-17z",
];

export const MARK_VIEWBOX = "0 0 24 24";

/**
 * @param {object} [opts]
 * @param {string} [opts.viewBox]
 * @param {string} [opts.fill] fill color, defaults to currentColor so the mark
 *   inherits its surroundings.
 * @returns {string} complete <svg> fragment.
 */
export function markSvg({ viewBox = MARK_VIEWBOX, fill = "currentColor" } = {}) {
  const paths = MARK_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<svg viewBox="${viewBox}" fill="${fill}" aria-hidden="true">${paths}</svg>`;
}
