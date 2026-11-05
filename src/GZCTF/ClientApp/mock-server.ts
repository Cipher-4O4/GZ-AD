// Full Attack & Defense Dynamic Engine for IONIC 2026
// Serves: React SPA frontend, REST APIs, Flag Submission & Live Realtime Tick Engine

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080
const DATA_DIR = join(process.cwd(), 'data')
const STATE_FILE = join(DATA_DIR, 'ad-state.json')

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

export interface AdServiceDef {
  key: string
  name: string
  category: 'Crypto' | 'Pwn' | 'Web'
  port: number
  color: string
}

export const SERVICES: AdServiceDef[] = [
  { key: 'simple-crypto', name: 'simple-crypto', category: 'Crypto', port: 6969, color: '#9775fa' },
  { key: 'simple-pwn', name: 'simple-pwn', category: 'Pwn', port: 7070, color: '#fa5252' },
  { key: 'simple-web', name: 'simple-web', category: 'Web', port: 1337, color: '#4dabf7' },
  { key: 'coloring', name: 'coloring', category: 'Web', port: 8082, color: '#40c057' },
]

export interface AdTeamData {
  id: number
  code: string
  name: string
  school: string
  rank: number
  score: number
  captures: number
  status: 'Operational' | 'Recovering' | 'Mumble' | 'Offline'
  logo: string
  ip: string
  services: Record<string, { attack: number; defense: number; availability: number }>
}

export interface ActiveFlag {
  flag: string
  teamId: number
  serviceKey: string
  plantedTick: number
  expiresTick: number
  capturedBy: number[] // team IDs that captured this flag
}

export interface AttackLog {
  id: string
  time: string
  attackerId: number
  victimId: number
  service: string
  text: string
  isNuke: boolean
  color: string
}

const INITIAL_TEAMS: AdTeamData[] = [
  {
    id: 1,
    code: 'T401',
    name: 'United Shell-SCC',
    school: 'SMK NEGERI 7 SEMARANG',
    rank: 1,
    score: 59087.1,
    captures: 14,
    status: 'Operational',
    logo: '/logos/smkn7-semarang.png',
    ip: '172.0.9.2',
    services: {
      'simple-crypto': { attack: 1420, defense: 480, availability: 120 },
      'simple-pwn': { attack: 1100, defense: 350, availability: 120 },
      'simple-web': { attack: 980, defense: 220, availability: 120 },
      coloring: { attack: 650, defense: 180, availability: 120 },
    },
  },
  {
    id: 2,
    code: 'T402',
    name: 'rootsanctum',
    school: 'SMK NEGERI 7 SEMARANG',
    rank: 2,
    score: 56274.3,
    captures: 12,
    status: 'Operational',
    logo: '/logos/smkn7-semarang.png',
    ip: '172.0.9.3',
    services: {
      'simple-crypto': { attack: 1250, defense: 420, availability: 120 },
      'simple-pwn': { attack: 1050, defense: 310, availability: 120 },
      'simple-web': { attack: 890, defense: 190, availability: 120 },
      coloring: { attack: 610, defense: 150, availability: 120 },
    },
  },
  {
    id: 3,
    code: 'T403',
    name: 'WilSec - Apa aja',
    school: 'SMK NEGERI 1 JAKARTA',
    rank: 3,
    score: 52228.6,
    captures: 10,
    status: 'Operational',
    logo: '/logos/smkn1-jakarta.png',
    ip: '172.0.9.4',
    services: {
      'simple-crypto': { attack: 1100, defense: 380, availability: 120 },
      'simple-pwn': { attack: 890, defense: 280, availability: 120 },
      'simple-web': { attack: 780, defense: 160, availability: 120 },
      coloring: { attack: 520, defense: 130, availability: 120 },
    },
  },
  {
    id: 4,
    code: 'T404',
    name: 'Maaf TKA Pilih CTF',
    school: 'MA NEGERI 3 JEMBER',
    rank: 4,
    score: 48517.1,
    captures: 9,
    status: 'Operational',
    logo: '/logos/man3-jember.png',
    ip: '172.0.9.5',
    services: {
      'simple-crypto': { attack: 950, defense: 320, availability: 120 },
      'simple-pwn': { attack: 810, defense: 240, availability: 120 },
      'simple-web': { attack: 710, defense: 140, availability: 120 },
      coloring: { attack: 480, defense: 110, availability: 120 },
    },
  },
  {
    id: 5,
    code: 'T405',
    name: 'WilSec - BOEDOET 47',
    school: 'SMK NEGERI 1 JAKARTA',
    rank: 5,
    score: 48381.4,
    captures: 8,
    status: 'Operational',
    logo: '/logos/smkn1-jakarta.png',
    ip: '172.0.9.6',
    services: {
      'simple-crypto': { attack: 910, defense: 300, availability: 120 },
      'simple-pwn': { attack: 790, defense: 220, availability: 120 },
      'simple-web': { attack: 680, defense: 130, availability: 120 },
      coloring: { attack: 450, defense: 100, availability: 120 },
    },
  },
  {
    id: 6,
    code: 'T406',
    name: 'kata magfi "bebas"',
    school: 'SMK NEGERI 21 JAKARTA',
    rank: 6,
    score: 47410.0,
    captures: 7,
    status: 'Operational',
    logo: '/logos/smkn21-jakarta.png',
    ip: '172.0.9.7',
    services: {
      'simple-crypto': { attack: 850, defense: 280, availability: 120 },
      'simple-pwn': { attack: 720, defense: 210, availability: 120 },
      'simple-web': { attack: 630, defense: 120, availability: 120 },
      coloring: { attack: 420, defense: 90, availability: 120 },
    },
  },
  {
    id: 7,
    code: 'T407',
    name: 'Z3RODAY',
    school: 'SMK NEGERI 1 BOYOLANGU',
    rank: 7,
    score: 47177.1,
    captures: 7,
    status: 'Operational',
    logo: '/logos/smkn1-boyolangu.png',
    ip: '172.0.9.8',
    services: {
      'simple-crypto': { attack: 840, defense: 270, availability: 120 },
      'simple-pwn': { attack: 710, defense: 200, availability: 120 },
      'simple-web': { attack: 620, defense: 110, availability: 120 },
      coloring: { attack: 410, defense: 85, availability: 120 },
    },
  },
  {
    id: 8,
    code: 'T408',
    name: 'Gangantua',
    school: 'SMK NEGERI 3 TUBAN',
    rank: 8,
    score: 47150.0,
    captures: 6,
    status: 'Mumble',
    logo: '/logos/smkn3-tuban.png',
    ip: '172.0.9.9',
    services: {
      'simple-crypto': { attack: 820, defense: 260, availability: 80 },
      'simple-pwn': { attack: 680, defense: 190, availability: 80 },
      'simple-web': { attack: 590, defense: 100, availability: 80 },
      coloring: { attack: 390, defense: 75, availability: 80 },
    },
  },
  {
    id: 9,
    code: 'T409',
    name: 'WilSec - Panitia',
    school: 'SMK NEGERI 1 JAKARTA',
    rank: 9,
    score: 44544.3,
    captures: 5,
    status: 'Operational',
    logo: '/logos/smkn1-jakarta.png',
    ip: '172.0.9.10',
    services: {
      'simple-crypto': { attack: 750, defense: 240, availability: 120 },
      'simple-pwn': { attack: 620, defense: 170, availability: 120 },
      'simple-web': { attack: 540, defense: 90, availability: 120 },
      coloring: { attack: 360, defense: 70, availability: 120 },
    },
  },
  {
    id: 10,
    code: 'T410',
    name: 'Duo Perncari Flag',
    school: 'SMKS MASKUMAMBANG 1 DUKUN',
    rank: 10,
    score: 44145.7,
    captures: 4,
    status: 'Operational',
    logo: '/logos/smk-maskumambang-dukun.png',
    ip: '172.0.9.11',
    services: {
      'simple-crypto': { attack: 710, defense: 220, availability: 120 },
      'simple-pwn': { attack: 580, defense: 150, availability: 120 },
      'simple-web': { attack: 500, defense: 80, availability: 120 },
      coloring: { attack: 340, defense: 60, availability: 120 },
    },
  },
]

// Competition State
interface GameState {
  round: number
  tick: number
  maxTick: number
  tickSeconds: number
  totalTickCount: number
  lastTickTimestamp: number
  teams: AdTeamData[]
  flags: Record<string, ActiveFlag>
  attacks: AttackLog[]
}

let state: GameState = {
  round: 19,
  tick: 2,
  maxTick: 5,
  tickSeconds: 60,
  totalTickCount: 92,
  lastTickTimestamp: Date.now(),
  teams: JSON.parse(JSON.stringify(INITIAL_TEAMS)),
  flags: {},
  attacks: [
    {
      id: 'atk_init_1',
      time: '15.53.45',
      attackerId: 7, // Z3RODAY
      victimId: 5,   // WilSec - BOEDOET 47
      service: 'simple-pwn',
      text: 'Z3RODAY → WilSec - BOEDOET 47 (Flag captured!)',
      isNuke: true,
      color: '#fab005',
    },
    {
      id: 'atk_init_2',
      time: '15.53.45',
      attackerId: 1,
      victimId: 4,
      service: 'simple-crypto',
      text: 'United Shell-SCC → Maaf TKA Pilih CTF (Flag captured!)',
      isNuke: true,
      color: '#fab005',
    },
    {
      id: 'atk_init_3',
      time: '15.53.44',
      attackerId: 2,
      victimId: 3,
      service: 'simple-web',
      text: 'rootsanctum → WilSec - Apa aja (Flag captured!)',
      isNuke: true,
      color: '#20c997',
    },
  ],
}

// Load existing state if available
if (existsSync(STATE_FILE)) {
  try {
    const raw = readFileSync(STATE_FILE, 'utf-8')
    const loaded = JSON.parse(raw)
    if (loaded && loaded.teams && loaded.round) {
      state = { ...state, ...loaded }
      console.log(`[A&D Engine] Successfully restored competition state (Round ${state.round}, Tick ${state.tick})`)
    }
  } catch (err) {
    console.error('[A&D Engine] Error loading state file, initializing fresh:', err)
  }
}

function saveState() {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8')
  } catch (err) {
    console.error('[A&D Engine] Error saving state:', err)
  }
}

// Generate new flags for every team & service for the given tick
function generateFlagsForTick(tickNum: number) {
  for (const team of state.teams) {
    for (const svc of SERVICES) {
      const randHex = Math.random().toString(16).substring(2, 10)
      const flagStr = `flag{ionic26_${team.id}_${svc.key}_t${tickNum}_${randHex}}`

      state.flags[flagStr] = {
        flag: flagStr,
        teamId: team.id,
        serviceKey: svc.key,
        plantedTick: tickNum,
        expiresTick: tickNum + 2, // Valid for 3 ticks
        capturedBy: [],
      }
    }
  }

  // Prune flags expired more than 5 ticks ago
  for (const [key, f] of Object.entries(state.flags)) {
    if (f.expiresTick < tickNum - 3) {
      delete state.flags[key]
    }
  }
}

// Ensure initial flags exist
if (Object.keys(state.flags).length === 0) {
  generateFlagsForTick(state.totalTickCount)
}

// Tick progression logic
function advanceTick() {
  state.totalTickCount += 1
  state.lastTickTimestamp = Date.now()

  state.tick += 1
  if (state.tick > state.maxTick) {
    state.tick = 1
    state.round += 1
  }

  console.log(`[A&D Tick Engine] ▶ Advancing to Round ${state.round} · Tick ${state.tick}/${state.maxTick} (Global Tick #${state.totalTickCount})`)

  // 1. Generate new round flags for all teams
  generateFlagsForTick(state.totalTickCount)

  // 2. Award Availability SLA points to operational teams (+10 each)
  for (const team of state.teams) {
    if (team.status === 'Operational') {
      team.score += 40 // 10 per service
      for (const svc of SERVICES) {
        if (!team.services[svc.key]) {
          team.services[svc.key] = { attack: 0, defense: 0, availability: 0 }
        }
        team.services[svc.key].availability += 10
      }
    }
  }

  // 3. Re-sort ranking
  sortTeams()
  saveState()
}

// Sort teams by score and update ranks
function sortTeams() {
  state.teams.sort((a, b) => b.score - a.score)
  state.teams.forEach((t, i) => {
    t.rank = i + 1
  })
}

// Tick Timer loop running every 1000ms
setInterval(() => {
  const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000)
  if (elapsed >= state.tickSeconds) {
    advanceTick()
  }
}, 1000)

// Helper to get time string
function getTimeStr() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false }).replace(/:/g, '.')
}

const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.html': 'text/html; charset=utf-8',
}

// Main HTTP Server
Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)
    const originalPath = url.pathname
    const path = originalPath.toLowerCase()

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    // ==========================================
    // Realtime Attack & Defense Endpoints
    // ==========================================

    // 1. Full Live A&D State for AttackMap & Scoreboard
    if (path === '/api/ad/state' || path === '/api/game/ad/state') {
      const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000)
      const secondsLeft = Math.max(0, state.tickSeconds - elapsed)

      return Response.json(
        {
          round: state.round,
          tick: state.tick,
          maxTick: state.maxTick,
          tickSeconds: state.tickSeconds,
          secondsLeft,
          teams: state.teams,
          attacks: state.attacks.slice(0, 15),
          services: SERVICES,
        },
        { headers }
      )
    }

    // 2. Scoreboard Detailed Matrix Table
    if (path === '/api/ad/scoreboard' || path === '/api/scoreboard') {
      const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000)
      const secondsLeft = Math.max(0, state.tickSeconds - elapsed)

      return Response.json(
        {
          round: state.round,
          tick: state.tick,
          secondsLeft,
          rows: state.teams.map((t) => ({
            rank: t.rank,
            name: t.name,
            school: t.school,
            code: t.code,
            logo: t.logo,
            captures: t.captures,
            total: t.score,
            status: t.status,
            self: t.name === 'Z3RODAY',
            services: t.services,
          })),
        },
        { headers }
      )
    }

    // 3. Targets list for participants
    if (path === '/api/ad/targets' || path.includes('/targets')) {
      return Response.json(
        {
          currentRound: state.round,
          currentTick: state.tick,
          services: SERVICES.map((svc) => ({
            key: svc.key,
            name: svc.name,
            category: svc.category,
            port: svc.port,
            targets: state.teams.map((t) => ({
              teamId: t.id,
              teamName: t.name,
              school: t.school,
              ip: t.ip,
              port: svc.port,
              status: t.status,
            })),
          })),
        },
        { headers }
      )
    }

    // 4. Defending Flags for participant team (Default team 7 Z3RODAY)
    if (path === '/api/ad/my-flags') {
      const teamId = parseInt(url.searchParams.get('teamId') || '7')
      const myFlags = Object.values(state.flags)
        .filter((f) => f.teamId === teamId && f.expiresTick >= state.totalTickCount)
        .map((f) => ({
          service: f.serviceKey,
          flag: f.flag,
          plantedTick: f.plantedTick,
          expiresTick: f.expiresTick,
        }))

      return Response.json({ teamId, flags: myFlags }, { headers })
    }

    // 5. Flag Submission Endpoint (Single & Batch)
    if (path.includes('/submit')) {
      if (req.method !== 'POST') {
        return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
      }

      try {
        const body = await req.json()
        const submitterId = parseInt(body.teamId || '7') // Default submitter: Team 7 (Z3RODAY)
        const attacker = state.teams.find((t) => t.id === submitterId) || state.teams[6]

        const flagList: string[] = Array.isArray(body.flags)
          ? body.flags.map((f: string) => f.trim()).filter(Boolean)
          : [(body.flag || body.answer || '').trim()].filter(Boolean)

        if (!flagList.length) {
          return Response.json({ acceptedCount: 0, totalPoints: 0, message: 'Flag cannot be empty' }, { status: 400, headers })
        }

        const results: Array<{ flag: string; status: 'accepted' | 'rejected'; message: string; points: number }> = []
        let acceptedCount = 0

        for (const rawFlag of flagList) {
          const flagRecord = state.flags[rawFlag]

          if (!flagRecord) {
            results.push({ flag: rawFlag, status: 'rejected', message: 'Invalid flag or unknown service', points: 0 })
            continue
          }

          if (flagRecord.teamId === submitterId) {
            results.push({ flag: rawFlag, status: 'rejected', message: 'Cannot submit flag from your own service!', points: 0 })
            continue
          }

          if (flagRecord.expiresTick < state.totalTickCount) {
            results.push({ flag: rawFlag, status: 'rejected', message: 'Flag has expired for this tick', points: 0 })
            continue
          }

          if (flagRecord.capturedBy.includes(submitterId)) {
            results.push({ flag: rawFlag, status: 'rejected', message: 'You have already captured this flag!', points: 0 })
            continue
          }

          // ACCEPTED!
          flagRecord.capturedBy.push(submitterId)
          acceptedCount += 1

          const victim = state.teams.find((t) => t.id === flagRecord.teamId) || state.teams[0]
          const svcKey = flagRecord.serviceKey

          attacker.score += 100
          attacker.captures += 1
          if (!attacker.services[svcKey]) attacker.services[svcKey] = { attack: 0, defense: 0, availability: 0 }
          attacker.services[svcKey].attack += 100

          victim.score = Math.max(0, victim.score - 50)
          if (!victim.services[svcKey]) victim.services[svcKey] = { attack: 0, defense: 0, availability: 0 }
          victim.services[svcKey].defense = Math.max(0, victim.services[svcKey].defense - 50)

          const attackEvent: AttackLog = {
            id: `atk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            time: getTimeStr(),
            attackerId: attacker.id,
            victimId: victim.id,
            service: svcKey,
            text: `${attacker.name} → ${victim.name} (Flag captured!)`,
            isNuke: true,
            color: '#fab005',
          }

          state.attacks.unshift(attackEvent)
          if (state.attacks.length > 50) state.attacks.pop()

          results.push({
            flag: rawFlag,
            status: 'accepted',
            message: `Flag accepted! +100 Attack Points against ${victim.name}`,
            points: 100,
          })

          console.log(`[A&D Flag Captured] 💥 ${attacker.name} captured flag from ${victim.name} on [${svcKey}]!`)
        }

        if (acceptedCount > 0) {
          sortTeams()
          saveState()
        }

        return Response.json(
          {
            acceptedCount,
            totalPoints: acceptedCount * 100,
            results,
            message: acceptedCount > 0
              ? `Berhasil submit ${acceptedCount} flag! (+${acceptedCount * 100} poin)`
              : results[0]?.message || 'Flag ditolak',
          },
          { headers }
        )
      } catch (err: any) {
        return Response.json({ acceptedCount: 0, totalPoints: 0, message: err.message || 'Submission error' }, { status: 400, headers })
      }
    }

    // 6. Admin test trigger attack (useful for testing missile arcs live)
    if (path === '/api/ad/admin/trigger-attack') {
      const fromId = parseInt(url.searchParams.get('from') || '7')
      const toId = parseInt(url.searchParams.get('to') || '5')
      const svc = url.searchParams.get('svc') || 'simple-pwn'

      const attacker = state.teams.find((t) => t.id === fromId) || state.teams[6]
      const victim = state.teams.find((t) => t.id === toId) || state.teams[4]

      attacker.score += 100
      attacker.captures += 1
      victim.score = Math.max(0, victim.score - 50)
      sortTeams()

      const attackEvent: AttackLog = {
        id: `atk_${Date.now()}`,
        time: getTimeStr(),
        attackerId: attacker.id,
        victimId: victim.id,
        service: svc,
        text: `${attacker.name} → ${victim.name} (Flag captured!)`,
        isNuke: true,
        color: '#fab005',
      }

      state.attacks.unshift(attackEvent)
      saveState()

      return Response.json({ success: true, attack: attackEvent }, { headers })
    }

    // 7. General GZCTF compatibility routes
    if (path === '/api/config') {
      return Response.json(
        {
          title: 'IONIC 2026 Attack & Defense',
          compiler: 'GZCTF A&D Engine v2',
          icp: 'IONIC 2026',
        },
        { headers }
      )
    }

    if (path === '/api/account/profile') {
      return Response.json(
        {
          id: 'user_z3roday',
          userName: 'rootkids',
          role: 'User',
          team: {
            id: 7,
            name: 'Z3RODAY',
            bio: 'SMK NEGERI 1 BOYOLANGU',
            avatar: '/logos/smkn1-boyolangu.png',
          },
        },
        { headers }
      )
    }

    if (path.includes('/notices')) {
      const liveNotices = state.attacks.slice(0, 10).map((atk, idx) => ({
        id: idx + 1,
        title: atk.service,
        content: atk.text,
        time: new Date().toISOString(),
        type: 'FirstBlood',
      }))
      return Response.json(liveNotices, { headers })
    }

    if (path.includes('/details')) {
      const z3roday = state.teams.find((t) => t.id === 7) || state.teams[6]
      return Response.json(
        {
          challenges: {
            Crypto: [
              { id: 1, title: 'simple-crypto', category: 'Crypto', score: 1000, solved: 3, bloods: [], disableBloodBonus: false },
            ],
            Pwn: [
              { id: 2, title: 'simple-pwn', category: 'Pwn', score: 1000, solved: 2, bloods: [], disableBloodBonus: false },
            ],
            Web: [
              { id: 3, title: 'simple-web', category: 'Web', score: 1000, solved: 4, bloods: [], disableBloodBonus: false },
              { id: 4, title: 'coloring', category: 'Web', score: 1000, solved: 1, bloods: [], disableBloodBonus: false },
            ],
          },
          challengeCount: 4,
          rank: {
            rank: z3roday.rank,
            score: z3roday.score,
            team: {
              id: z3roday.id,
              name: z3roday.name,
              bio: z3roday.school,
              avatar: z3roday.logo,
            },
            solvedCount: z3roday.captures,
          },
          teamToken: 'ad_token_z3roday_final_ionic2026',
          writeupRequired: false,
          writeupDeadline: 0,
        },
        { headers }
      )
    }

    if (path.match(/\/api\/game\/\d+$/) || path.includes('/api/game/recent') || path === '/api/game') {
      return Response.json(
        {
          id: 5,
          title: 'Final Cybersecurity IONIC 2026',
          summary: 'Babak Final Attack & Defense IONIC 2026',
          content: '10 Tim Finalis Bertanding dalam Mode Attack & Defense Realtime.',
          start: Date.now() - 3600000,
          end: Date.now() + 6 * 3600000,
          status: 'Accepted',
          practiceMode: true,
          challengesCount: 4,
          divisions: [],
        },
        { headers }
      )
    }

    // ==========================================
    // Static Files & React SPA Fallback
    // ==========================================
    if (!path.startsWith('/api') && !path.startsWith('/hub') && !path.startsWith('/swagger')) {
      const cleanPath = originalPath === '/' ? '/index.html' : originalPath
      const directFile = Bun.file(`./build${cleanPath}`)
      if (await directFile.exists()) {
        const dotIdx = cleanPath.lastIndexOf('.')
        const ext = dotIdx >= 0 ? cleanPath.substring(dotIdx).toLowerCase() : ''
        const contentType = MIME_TYPES[ext]
        const fileHeaders: Record<string, string> = {
          'Access-Control-Allow-Origin': '*',
        }
        if (contentType) {
          fileHeaders['Content-Type'] = contentType
        }
        return new Response(directFile, { headers: fileHeaders })
      }

      // Do NOT serve index.html for missing static assets (prevent module script MIME error)
      if (cleanPath.startsWith('/static/') || cleanPath.startsWith('/logos/')) {
        return new Response('Not Found', { status: 404 })
      }

      const indexFile = Bun.file('./build/index.html')
      if (await indexFile.exists()) {
        let html = await indexFile.text()
        html = html
          .replace(/%title%/g, 'IONIC 2026 · Attack & Defense')
          .replace(/%lang%/g, 'id')
          .replace(/%description%/g, 'Final Cybersecurity IONIC 2026 - Attack & Defense Platform')
          .replace(/%nonce%/g, 'ionic2026')

        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
    }

    // Default Fallback
    return Response.json({}, { headers })
  },
})

console.log(`[A&D Realtime Engine] Running successfully on http://0.0.0.0:${port}`)
