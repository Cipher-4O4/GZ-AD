// Static demo data for the Attack & Defense prototype screens.
// The A&D backend does not exist yet, so every screen in this fork is driven by
// this file (and the bundled mock API for submissions).

import type { AdStatus } from '@Utils/Ad'

export interface AdTeam {
  id: number
  code: string
  name: string
  school: string
  rank: number
  score: number
  status: AdStatus
  logo: string
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
  school: string
  code: string
  logo: string
  captures: number
  total: number
  status: AdStatus
  self?: boolean
  services: Record<string, AdScoreCell>
}

export const SELF_TEAM = 'Z3RODAY'

export const FINALIST_OFFICIAL_TEAMS: Array<{
  name: string
  school: string
  score: number
  logo: string
  status?: AdStatus
  self?: boolean
}> = [
  {
    name: 'United Shell-SCC',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 59087.1,
    logo: '/logos/smkn7-semarang.png',
    status: 'Operational',
  },
  {
    name: 'rootsanctum',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 56274.3,
    logo: '/logos/smkn7-semarang.png',
    status: 'Operational',
  },
  {
    name: 'WilSec - Apa aja',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 52228.6,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
  },
  {
    name: 'Maaf TKA Pilih CTF',
    school: 'MA NEGERI 3 JEMBER',
    score: 48517.1,
    logo: '/logos/man3-jember.png',
    status: 'Operational',
  },
  {
    name: 'WilSec - BOEDOET 47',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 48381.4,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
  },
  {
    name: 'kata magfi "bebas"',
    school: 'SMK NEGERI 21 JAKARTA',
    score: 47410.0,
    logo: '/logos/smkn21-jakarta.png',
    status: 'Operational',
  },
  {
    name: 'Z3RODAY',
    school: 'SMK NEGERI 1 BOYOLANGU',
    score: 47177.1,
    logo: '/logos/smkn1-boyolangu.png',
    status: 'Operational',
    self: true,
  },
  {
    name: 'Gangantua',
    school: 'SMK NEGERI 3 TUBAN',
    score: 47150.0,
    logo: '/logos/smkn3-tuban.png',
    status: 'Mumble',
  },
  {
    name: 'WilSec - Panitia',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 44544.3,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
  },
  {
    name: 'Duo Perncari Flag',
    school: 'SMKS MASKUMAMBANG 1 DUKUN',
    score: 44145.7,
    logo: '/logos/smk-maskumambang-dukun.png',
    status: 'Operational',
  },
]

export const AD_TEAMS: AdTeam[] = FINALIST_OFFICIAL_TEAMS.map((t, idx) => ({
  id: idx + 1,
  code: `T${401 + idx}`,
  name: t.name,
  school: t.school,
  rank: idx + 1,
  score: t.score,
  status: t.status ?? 'Operational',
  logo: t.logo,
  self: t.self,
}))

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
    target: '10.43.170.150:6969',
    defendingFlag: 'flag{ionic26_7_simple-crypto_defend}',
    ssh: 'nc 10.43.170.150 6969',
    checks: 'OK',
  },
  {
    id: 2,
    key: 'simple-pwn',
    category: 'Pwn',
    color: '#fa5252',
    author: 'rootkids',
    description: 'Just a normal very very classic binary, right? No seccomp, no fun.',
    attachment: 'simple-pwn.tar.gz',
    target: '10.43.170.150:7070',
    defendingFlag: 'flag{ionic26_7_simple-pwn_defend}',
    ssh: 'nc 10.43.170.150 7070',
    checks: 'OK',
  },
  {
    id: 3,
    key: 'simple-web',
    category: 'Web',
    color: '#4dabf7',
    author: 'rootkids',
    description: 'Classic API service with hidden endpoints and privilege escalation.',
    attachment: 'simple-web.tar.gz',
    target: 'http://10.43.170.150:1337',
    defendingFlag: 'flag{ionic26_7_simple-web_defend}',
    ssh: 'http://10.43.170.150:1337',
    checks: 'OK',
  },
  {
    id: 4,
    key: 'coloring',
    category: 'Web',
    color: '#20c997',
    author: 'rootkids',
    description: 'Collaborative live canvas painting service. Exploit the server logic to steal session flags.',
    attachment: 'coloring.tar.gz',
    target: 'http://10.43.170.150:8082',
    defendingFlag: 'flag{ionic26_7_coloring_defend}',
    ssh: 'http://10.43.170.150:8082',
    checks: 'OK',
  },
]

export const AD_ACTIVITY: AdActivity[] = [
  { time: '15:53:45', service: 'simple-pwn', text: 'Z3RODAY → WilSec - BOEDOET 47 (Flag captured!)', color: '#fab005' },
  { time: '15:53:45', service: 'simple-crypto', text: 'Offset e offside → SMAPa 2 (Flag captured!)', color: '#fab005' },
  { time: '15:53:45', service: 'simple-crypto', text: 'Gangantua - MUMBLE', color: '#ff922b' },
  { time: '15:53:44', service: 'simple-web', text: 'United Shell-SCC → WilSec - Apa aja (Flag captured!)', color: '#fa5252' },
  { time: '15:53:40', service: 'simple-pwn', text: 'rootsanctum → Maaf TKA Pilih CTF (Flag captured!)', color: '#4dabf7' },
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
  school: team.school,
  code: team.code,
  logo: team.logo,
  captures: Math.round(1400 + seeded(team.rank, 3) * 900),
  total: team.score,
  status: team.status,
  self: team.self,
  services: buildCells(team.rank, team.score),
}))

export const AD_MAX_CELL = Math.max(
  1,
  ...AD_SCOREBOARD.flatMap((row) =>
    row.services ? Object.values(row.services).flatMap((cell) => (cell ? [cell.attack ?? 0, cell.availability ?? 0] : [0, 0])) : [0]
  )
)

export const formatPoints = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
