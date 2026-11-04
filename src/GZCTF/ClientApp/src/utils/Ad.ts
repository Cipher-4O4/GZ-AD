// Shared design tokens for the Attack & Defense screens.
// The A&D screens keep their own dark "tournament" palette instead of the
// platform theme, so the look stays identical for every organizer.

export type AdStatus = 'Operational' | 'Recovering' | 'Mumble' | 'Offline'

export const AdColors = {
  bg: '#0a0b0d',
  bgAlt: '#0d0e12',
  surface: '#141518',
  surfaceRaised: '#181a1f',
  border: '#24262b',
  borderSoft: '#1b1d22',
  text: '#e6e7e9',
  dim: '#8b8d94',
  dimmer: '#63656d',
  primary: '#12b886',
  primarySoft: '#0e3b33',
  primaryText: '#63e6be',
  danger: '#fa5252',
  warning: '#fab005',
  info: '#4dabf7',
  gold: '#fab005',
  silver: '#ced4da',
  bronze: '#e8863f',
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const

export const AdStatusColor: Record<AdStatus, string> = {
  Operational: '#12b886',
  Recovering: '#fab005',
  Mumble: '#fd7e14',
  Offline: '#fa5252',
}

// The A&D prototype is served by the bundled mock API as game #5.
export const AD_GAME_ID = 5

export const isAdGame = (game?: { id?: number } | null) => game?.id === AD_GAME_ID

export const adHeat = (value: number, max: number) => {
  if (!value || !max) return 'transparent'
  const ratio = Math.min(value / max, 1)
  return `rgba(18, 184, 134, ${0.06 + ratio * 0.22})`
}
