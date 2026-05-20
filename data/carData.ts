export const CAR = {
  model        : 'e-tron GT Race',
  brand        : 'Audi Sport',
  series       : 'Quattro Motorsport Series',
  class        : 'FIA GT3',
  season       : 'Season 2026',
  raceNumber   : '04',
  tagline      : 'Vorsprung Durch Technik',
  homologation : 'FIA GT3 Homologated',
} as const

export const SPECS = {
  power     : { label: 'POWER',     value: '630',     unit: 'PS'   },
  torque    : { label: 'TORQUE',    value: '740',     unit: 'NM'   },
  sprint    : { label: '0-100',     value: '3.4',     unit: 'SEC'  },
  topSpeed  : { label: 'TOP SPEED', value: '305',     unit: 'KM/H' },
  weight    : { label: 'WEIGHT',    value: '1490',    unit: 'KG'   },
  downforce : { label: 'DOWNFORCE', value: '350',     unit: 'KG'   },
  drive     : { label: 'DRIVE',     value: 'QUATTRO', unit: 'AWD'  },
  gears     : { label: 'GEARS',     value: '2-SPD',   unit: 'PDK'  },
  sprint200 : { label: '0-200',     value: '7.8',     unit: 'SEC'  },
} as const

export const GRID_SPECS = [
  { label: 'ENGINE',     value: 'e-tron Electric', unit: 'MOTOR' },
  { label: 'POWER',      value: '630',             unit: 'PS'    },
  { label: 'TORQUE',     value: '740',             unit: 'NM'    },
  { label: '0-100 KM/H', value: '3.4',             unit: 'SEC'   },
  { label: 'TOP SPEED',  value: '305',             unit: 'KM/H'  },
  { label: 'CLASS',      value: 'GT3',             unit: 'FIA'   },
] as const

export const FEATURES = [
  {
    id       : 'awd',
    title    : 'Quattro All-Wheel Drive',
    subtitle : 'SYSTEM 01 — DRIVETRAIN',
    body     : 'Permanent all-wheel drive with torque vectoring across both axles. Power distributed in milliseconds, not seconds. Zero slip. Zero compromise.',
  },
  {
    id       : 'aero',
    title    : 'Aerodynamic Package',
    subtitle : 'SYSTEM 02 — DOWNFORCE',
    body     : 'Active rear wing generates 350kg of downforce at 200km/h. Carbon front splitter, side skirts, and diffuser operate as a single unified aerodynamic system.',
  },
] as const

export const NAV_LINKS = ['LINEUP', 'TECHNOLOGY', 'RACING'] as const

export const TOTAL_FRAMES = 240
export const IMAGE_BASE   = '/images/audi-sequence'

/** Returns padded frame URL: /images/audi-sequence/ezgif-frame-001.png */
export function getFrameUrl(index: number): string {
  const padded = (index + 1).toString().padStart(3, '0')
  return `${IMAGE_BASE}/ezgif-frame-${padded}.png`
}
