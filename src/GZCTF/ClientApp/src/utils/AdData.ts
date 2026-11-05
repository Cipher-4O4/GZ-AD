// Static demo data for the Attack & Defense prototype screens.
// The A&D backend does not exist yet, so every screen in this fork is driven by
// this file (and the bundled mock API for submissions).

import type { AdStatus } from '@Utils/Ad'

export interface AdTeam {
  id: number
  code: string
  name: string
  rank: number
  score: number
  status: AdStatus
  self?: boolean
}

export interface AdService {
  id: number
  key: string
  category: 'Crypto' | 'Pwn' | 'Web'
  color: string
  author: string
  description: string
  attachment: string
  target: string
  defendingFlag: string
  ssh: string
  checks: 'NO CHECKS YET' | 'OK' | 'RECOVERING'
}

export interface AdActivity {
  time: string
  service: string
  text: string
  color: string
}

export interface AdScoreCell {
  attack: number
  defense: number
  availability: number
}

export interface AdScoreRow {
  rank: number
  name: string
  code: string
  captures: number
  total: number
  self?: boolean
  services: Record<string, AdScoreCell>
}

export const SELF_TEAM = 'ZeroDay SMKN 1 Boyolangu'

const rawTeams: Array<[string, AdStatus?]> = [
  ['TOP - EsemkitaJayal'],
  ['Pungging Jaya'],
  ['SCS - DUO WIJAYA SIAP MELIBAS C...'],
  ['kevin melok kon melaku aja sambat'],
  ['pacman -Sybau'],
  ['gak_jago_sama_gak_jago_dapetin...'],
  ['NetRooties'],
  ['SCS - bingung pas mangan nggih...'],
  ['Keong Classix'],
  ['SCS - bingung totong buktikan na...'],
  ['dil saran jeneng tim'],
  ['kalau wajar, menang ajaib'],
  ['BedSec01'],
  ['Kak kita izin ga ngedit, mau di...'],
  ['Offset e offside'],
  ['kata hatinya namanya timnya black...'],
  ['Kata bu cindy semoga menang'],
  ['Lancar bin sukses'],
  ['menghimpun energi mengambil pos...'],
  ['Kurang tahu pak'],
  ['Opo yo enak e'],
  ['lethe cyber 1'],
  ['SandWorm'],
  ['Anonymous Tapi Ketahuan'],
  ['Ultraman Cosmos'],
  ['Klingkang Studio'],
  ['Zahwa'],
  ['Kepanjen Cyber'],
  ['PEOCOT CYBER'],
  ['Wimbeha'],
  ['ID_SMART'],
  ['SMASMA N1 AMBMO'],
  ['SMAPA 2', 'Mumble'],
  ['El Elxtron AZYZX'],
  ['Es Teh Jumbo'],
  ['SPPG SMASNA'],
  ['VALOVALO'],
  [SELF_TEAM, 'Offline'],
  ['GARDA DIGITAL'],
  ['PPLG HENGKER'],
]

// Scores for the first ten teams come from the design reference; the rest are
// generated so the ranking stays stable between renders.
const topScores = [22942.6, 22825.2, 18965.6, 18616.4, 18221.2, 16375.6, 14816.5, 14314.5, 10710.0, 9761.0]

export const AD_TEAMS: AdTeam[] = rawTeams.map(([name, status], idx) => {
  const rank = idx + 1
  const score = topScores[idx] ?? Math.max(1200, 7400 - (idx - 10) * 96 - (idx % 7) * 37)

  return {
    id: idx + 1,
    code: `T${401 + idx}`,
    name,
    rank,
    score,
    status: status ?? (rank > 12 && rank % 6 === 0 ? 'Recovering' : 'Operational'),
    self: name === SELF_TEAM,
  }
})

export const AD_TEAMS_BY_RANK = [...AD_TEAMS].sort((a, b) => a.rank - b.rank)

export const AD_SERVICES: AdService[] = [
  {
    id: 1,
    key: 'simple-crypto',
    category: 'Crypto',
    color: '#9775fa',
    author: 'rootkids',
    description: 'A tiny signing oracle. Recover the key before it rotates.',
    attachment: 'simple-crypto.tar.gz',
    target: '10.43.228.140:1337',
    defendingFlag: 'flag{mEKvqnBTLy8kbMFzrWPzAV5zGSaLhug-}',
    ssh: 'ssh 460143.198.202.181 -p 2222',
    checks: 'NO CHECKS YET',
  },
  {
    id: 2,
    key: 'simple-pwn',
    category: 'Pwn',
    color: '#fa5252',
    author: 'rootkids',
    description: 'Just a normal very very classic binary, right? No seccomp, no fun.',
    attachment: 'simple-pwn.tar.gz',
    target: '10.43.228.141:1337',
    defendingFlag: 'flag{pwn_9f2ab7c41de84a0fb3c2}',
    ssh: 'ssh 460143.198.202.181 -p 2223',
    checks: 'NO CHECKS YET',
  },
  {
    id: 3,
    key: 'simple-web',
    category: 'Web',
    color: '#4dabf7',
    author: 'rootkids',
    description: 'Just a normal very very classic api, right? this doesnt have a ui yet.',
    attachment: 'simple-web.tar.gz',
    target: '10.43.228.152:1337',
    defendingFlag: 'flag{mEKvqnBTLy8kbMFzrWPzAV5zGSaLhug-}',
    ssh: 'ssh 460143.198.202.181 -p 2222',
    checks: 'NO CHECKS YET',
  },
]

export const AD_ACTIVITY: AdActivity[] = [
  { time: '12:31:27', service: 'simple-pwn', text: `${SELF_TEAM} → PPLG HENGKER`, color: '#fab005' },
  { time: '12:31:22', service: 'simple-pwn', text: `${SELF_TEAM} → Keong Classix`, color: '#fab005' },
  { time: '12:31:11', service: 'simple-pwn', text: `${SELF_TEAM} → Opo yo enak e`, color: '#fab005' },
  { time: '12:30:58', service: 'simple-crypto', text: 'pacman -Sybau → TOP - EsemkitaJayal', color: '#fa5252' },
  { time: '12:30:41', service: 'simple-web', text: 'Offset e offside → Wimbeha', color: '#4dabf7' },
]

const seeded = (n: number, salt: number) => {
  const x = Math.sin((n + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const buildCells = (rank: number, base: number) => {
  const cell = (salt: number, weight: number) => ({
    attack: Math.round(Math.max(0, base * weight * (0.7 + seeded(rank, salt) * 0.55))),
    defense: Math.round(Math.max(0, 1190 * (0.6 + seeded(rank, salt + 1) * 0.7))),
    availability: Math.round(Math.max(0, base * weight * (0.55 + seeded(rank, salt + 2) * 0.6))),
  })

  return {
    'simple-crypto': cell(1, 0.19),
    'simple-pwn': cell(4, 0.15),
    'simple-web': cell(7, 0.19),
  }
}

export const AD_SCOREBOARD: AdScoreRow[] = AD_TEAMS_BY_RANK.map((team) => ({
  rank: team.rank,
  name: team.name,
  code: team.code,
  captures: Math.round(1400 + seeded(team.rank, 3) * 900),
  total: team.score,
  self: team.self,
  services: buildCells(team.rank, team.score),
}))

export const AD_MAX_CELL = Math.max(
  ...AD_SCOREBOARD.flatMap((row) => Object.values(row.services).flatMap((cell) => [cell.attack, cell.availability]))
)

export const formatPoints = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
