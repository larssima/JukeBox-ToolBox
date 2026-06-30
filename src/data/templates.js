import bluegreen from '../assets/templates/jukecard-bluegreen-300x100.png'
import darkblue2 from '../assets/templates/jukecard-darkblue2-300x100.png'
import darkred from '../assets/templates/jukecard-darkred-300x100.png'
import lightgreen from '../assets/templates/jukecard-lightgreen-300x100.png'
import red from '../assets/templates/jukecard-red-300x100.png'

// Layout zones as a fraction of the 300x100 template, derived from the
// source artwork: a colored hexagonal band sits vertically centered, with
// open white space above and below it for the side-A / side-B titles.
const ZONES = {
  top: { yCenter: 0.23, top: 0.12, bottom: 0.34, xMin: 0.06, xMax: 0.94 },
  middle: { yCenter: 0.495, top: 0.37, bottom: 0.62, xMin: 0.17, xMax: 0.83 },
  bottom: { yCenter: 0.77, top: 0.66, bottom: 0.88, xMin: 0.06, xMax: 0.94 },
}

export const TEMPLATES = [
  { id: 'bluegreen', name: 'Blue/Green', src: bluegreen, zones: ZONES },
  { id: 'darkblue2', name: 'Dark Blue', src: darkblue2, zones: ZONES },
  { id: 'darkred', name: 'Dark Red', src: darkred, zones: ZONES },
  { id: 'lightgreen', name: 'Light Green', src: lightgreen, zones: ZONES },
  { id: 'red', name: 'Red', src: red, zones: ZONES },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
