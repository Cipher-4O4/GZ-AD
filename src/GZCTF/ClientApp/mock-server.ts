// Full Attack & Defense Dynamic Engine for IONIC 2026
// Serves: React SPA frontend, REST APIs, Flag Submission & Live Realtime Tick Engine

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'
import { generateKeyPairSync } from 'crypto'
import { gzipSync } from 'bun'

const STATIC_CACHE = new Map<string, { raw: Buffer; gz: Uint8Array; contentType?: string }>()

function getCachedStatic(filePath: string, contentType?: string) {
  if (STATIC_CACHE.has(filePath)) return STATIC_CACHE.get(filePath)!
  if (!existsSync(filePath)) return null
  try {
    const raw = readFileSync(filePath)
    const gz = gzipSync(raw)
    const item = { raw, gz, contentType }
    STATIC_CACHE.set(filePath, item)
    return item
  } catch {
    return null
  }
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080
const DATA_DIR = join(process.cwd(), 'data')
const STATE_FILE = join(DATA_DIR, 'ad-state.json')
const CERT_FILE = join(DATA_DIR, 'cert.pem')
const KEY_FILE = join(DATA_DIR, 'key.pem')
const WG_KEYS_FILE = join(DATA_DIR, 'wg-server.json')

let wgServer = { privateKey: '', publicKey: '' }
if (existsSync(WG_KEYS_FILE)) {
  try {
    wgServer = JSON.parse(readFileSync(WG_KEYS_FILE, 'utf-8'))
  } catch {}
}

if (!wgServer.privateKey || !wgServer.publicKey) {
  try {
    const { privateKey, publicKey } = generateKeyPairSync('x25519')
    wgServer = {
      privateKey: privateKey.export({ format: 'der', type: 'pkcs8' }).slice(16).toString('base64'),
      publicKey: publicKey.export({ format: 'der', type: 'spki' }).slice(12).toString('base64'),
    }
    writeFileSync(WG_KEYS_FILE, JSON.stringify(wgServer, null, 2))
    console.log('[WireGuard Engine] Initialized real Server Curve25519 Keypair')
  } catch (err) {
    console.warn('[WireGuard Engine] Fallback key generation:', err)
  }
}

function generateClientWgConfig(teamId: number = 7) {
  let clientPriv = 'mDnMN//gRXSmfU7y/dV+DunwmECUs3DzS9YBkQNPG3o='
  try {
    const { privateKey } = generateKeyPairSync('x25519')
    clientPriv = privateKey.export({ format: 'der', type: 'pkcs8' }).slice(16).toString('base64')
  } catch {}

  const clientIp = `10.43.170.${100 + teamId}`

  return `[Interface]
PrivateKey = ${clientPriv}
Address = ${clientIp}/24
DNS = 1.1.1.1

[Peer]
PublicKey = ${wgServer.publicKey || '5WMyVjhqnLF/8e88ZbcWhGKR8OIP/ofvcADr5rahTUM='}
Endpoint = 10.43.170.150:51820
AllowedIPs = 10.43.170.0/24, 172.0.9.0/24
PersistentKeepalive = 25
`
}

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

// Auto-generate SSL Certificate for HTTPS (https://10.43.170.150)
if (!existsSync(CERT_FILE) || !existsSync(KEY_FILE)) {
  try {
    spawnSync('openssl', [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-keyout',
      KEY_FILE,
      '-out',
      CERT_FILE,
      '-days',
      '365',
      '-nodes',
      '-subj',
      '/CN=10.43.170.150',
    ])
    console.log('[SSL/TLS] Generated self-signed SSL certificate for https://10.43.170.150')
  } catch (err) {
    console.warn('[SSL/TLS] Could not generate SSL certificate:', err)
  }
}

export interface AdServiceDef {
  key: string
  name: string
  category: 'Crypto' | 'Pwn' | 'Web'
  port: number
  color: string
}

export const SERVICES: AdServiceDef[] = [
  { key: 'playground', name: 'playground', category: 'Crypto', port: 6969, color: '#9775fa' },
  { key: 'cpppp', name: '(C)PPPP!', category: 'Pwn', port: 7070, color: '#fa5252' },
  { key: 'classic-api', name: 'classic-api', category: 'Web', port: 1337, color: '#4dabf7' },
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

export const ATTACK_LOGS: any[] = []

const RAW_TEAMS = [
  { id: 1, code: 'T401', name: 'United Shell-SCC', school: 'SMK NEGERI 7 SEMARANG', logo: '/logos/smkn7-semarang.png', ip: '172.0.9.2' },
  { id: 2, code: 'T402', name: 'rootsanctum', school: 'SMK NEGERI 7 SEMARANG', logo: '/logos/smkn7-semarang.png', ip: '172.0.9.3' },
  { id: 3, code: 'T403', name: 'WilSec - Apa aja', school: 'SMK NEGERI 1 JAKARTA', logo: '/logos/smkn1-jakarta.png', ip: '172.0.9.4' },
  { id: 4, code: 'T404', name: 'Maaf TKA Pilih CTF', school: 'MA NEGERI 3 JEMBER', logo: '/logos/man3-jember.png', ip: '172.0.9.5' },
  { id: 5, code: 'T405', name: 'WilSec - BOEDOET 47', school: 'SMK NEGERI 1 JAKARTA', logo: '/logos/smkn1-jakarta.png', ip: '172.0.9.6' },
  { id: 6, code: 'T406', name: 'kata magfi "bebas"', school: 'SMK NEGERI 21 JAKARTA', logo: '/logos/smkn21-jakarta.png', ip: '172.0.9.7' },
  { id: 7, code: 'T407', name: 'Z3RODAY', school: 'SMK NEGERI 1 BOYOLANGU', logo: '/logos/smkn1-boyolangu.png', ip: '172.0.9.8' },
  { id: 8, code: 'T408', name: 'Gangantua', school: 'SMK NEGERI 3 TUBAN', logo: '/logos/smkn3-tuban.png', ip: '172.0.9.9' },
  { id: 9, code: 'T409', name: 'WilSec - Panitia', school: 'SMK NEGERI 1 JAKARTA', logo: '/logos/smkn1-jakarta.png', ip: '172.0.9.10' },
  { id: 10, code: 'T410', name: 'Duo Perncari Flag', school: 'SMKS MASKUMAMBANG 1 DUKUN', logo: '/logos/smk-maskumambang-dukun.png', ip: '172.0.9.11' },
]

const INITIAL_TEAMS: AdTeamData[] = RAW_TEAMS.map((t, idx) => ({
  ...t,
  rank: idx + 1,
  score: 0.0,
  captures: 0,
  status: 'Operational',
  services: {
    playground: { attack: 0, defense: 0, availability: 0 },
    cpppp: { attack: 0, defense: 0, availability: 0 },
    'classic-api': { attack: 0, defense: 0, availability: 0 },
    coloring: { attack: 0, defense: 0, availability: 0 },
  },
}))

// Competition State
interface GameState {
  round: number
  tick: number
  maxTick: number
  tickSeconds: number
  totalTickCount: number
  lastTickTimestamp: number
  isPaused: boolean
  teams: AdTeamData[]
  flags: Record<string, ActiveFlag>
  attacks: AttackLog[]
}

const INITIAL_BROKEN_STATUS: Record<number, Record<string, 'UP' | 'FAULT' | 'DOWN'>> = {
  1: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  2: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  3: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  4: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  5: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  6: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  7: { playground: 'UP', cpppp: 'DOWN', 'classic-api': 'FAULT', coloring: 'UP' }, // Z3RODAY (SMKN 1 Boyolangu) - Latihan defense
  8: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  9: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
  10: { playground: 'UP', cpppp: 'UP', 'classic-api': 'UP', coloring: 'UP' },
}

let state: GameState = {
  round: 0,
  tick: 0,
  maxTick: 5,
  tickSeconds: 60,
  totalTickCount: 0,
  lastTickTimestamp: Date.now(),
  isPaused: true,
  teams: JSON.parse(JSON.stringify(INITIAL_TEAMS)),
  flags: {},
  attacks: [],
}

let singleGame: any = {
  id: 5,
  title: 'Final Cybersecurity IONIC 2026',
  summary: 'Babak Final Attack & Defense IONIC 2026',
  content: '10 Tim Finalis Bertanding dalam Mode Attack & Defense Realtime.',
  poster: null,
  start: Date.now() - 3600000,
  end: Date.now() + 6 * 3600000,
  status: 'Accepted',
  teamName: 'Z3RODAY',
  practiceMode: true,
  challengesCount: 4,
  teamCount: 10,
  divisions: [{ id: 1, name: 'Finalist' }],
}

let divisionsList: any[] = [
  { id: 1, name: 'Finalist', description: 'Babak Final Attack & Defense IONIC 2026', inviteCode: null, inviteCodeRequired: false },
]

let adminGameInfo: any = {
  id: 5,
  title: 'Final Cybersecurity IONIC 2026',
  summary: 'Babak Final Attack & Defense IONIC 2026',
  content: '10 Tim Finalis Bertanding dalam Mode Attack & Defense Realtime.',
  poster: null,
  start: Date.now() - 3600000,
  end: Date.now() + 6 * 3600000,
  hidden: false,
  practiceMode: true,
  acceptWithoutReview: true,
  writeupRequired: false,
  teamCount: 10,
  challengeCount: 4,
  submissionCount: 142,
}

function saveState() {
  try {
    const toSave = { ...state, poster: adminGameInfo?.poster ?? null }
    writeFileSync(STATE_FILE, JSON.stringify(toSave, null, 2), 'utf-8')
  } catch (err) {
    console.error('[A&D Engine] Error saving state:', err)
  }
}

function resetToStandbyState(corruptServices = true) {
  state.round = 0
  state.tick = 0
  state.totalTickCount = 0
  state.isPaused = true
  state.lastTickTimestamp = Date.now()
  state.flags = {}
  state.attacks = []

  for (const team of state.teams) {
    team.score = 0.0
    team.captures = 0
    const brokenMap = corruptServices ? INITIAL_BROKEN_STATUS[team.id] : null

    let hasFault = false
    let hasDown = false
    for (const svc of SERVICES) {
      const initStatus = brokenMap ? brokenMap[svc.key] : 'UP'
      if (initStatus === 'FAULT') hasFault = true
      if (initStatus === 'DOWN') hasDown = true
      team.services[svc.key] = {
        attack: 0,
        defense: 0,
        availability: 0,
        status: initStatus,
      } as any
    }
    team.status = hasDown ? 'Offline' : hasFault ? 'Mumble' : 'Operational'
  }
  sortTeams()
  saveState()
}

// Load existing state if available
let stateRestored = false
if (existsSync(STATE_FILE)) {
  try {
    const raw = readFileSync(STATE_FILE, 'utf-8')
    const loaded = JSON.parse(raw)
    if (loaded && loaded.teams && loaded.round !== undefined) {
      state = { ...state, ...loaded }
      if (state.teams) {
        for (const t of state.teams) {
          if (!t.services) t.services = {} as any
          if ((t.services as any)['simple-crypto']) {
            t.services.playground = (t.services as any)['simple-crypto']
            delete (t.services as any)['simple-crypto']
          }
          if ((t.services as any)['simple-pwn']) {
            t.services.cpppp = (t.services as any)['simple-pwn']
            delete (t.services as any)['simple-pwn']
          }
          if ((t.services as any)['simple-web']) {
            t.services['classic-api'] = (t.services as any)['simple-web']
            delete (t.services as any)['simple-web']
          }
          for (const svc of SERVICES) {
            if (!t.services[svc.key]) {
              t.services[svc.key] = { attack: 0, defense: 0, availability: 0 }
            }
          }
        }
      }
      if (loaded.poster) {
        adminGameInfo.poster = loaded.poster
        singleGame.poster = loaded.poster
      }
      stateRestored = true
      console.log(`[A&D Engine] Successfully restored competition state (Round ${state.round}, Tick ${state.tick})`)
    }
  } catch (err) {
    console.error('[A&D Engine] Error loading state file, initializing fresh:', err)
  }
}

if (!stateRestored || state.round === 0) {
  resetToStandbyState(false)
  state.round = 1
  state.tick = 1
  state.totalTickCount = 1
  state.isPaused = false
  state.lastTickTimestamp = Date.now()
  generateFlagsForTick(1)
  saveState()
}

// Force online status for all 9 opponent teams, and Mumble for Z3RODAY (SMKN 1 Boyolangu - Team 7)
for (const team of state.teams) {
  if (team.id === 7) {
    team.status = 'Mumble'
    if (!team.services) team.services = {} as any
    team.services.playground = { attack: team.services.playground?.attack || 0, defense: team.services.playground?.defense || 0, availability: 0, status: 'UP' } as any
    team.services.coloring = { attack: team.services.coloring?.attack || 0, defense: team.services.coloring?.defense || 0, availability: 0, status: 'UP' } as any
    team.services.cpppp = { attack: team.services.cpppp?.attack || 0, defense: team.services.cpppp?.defense || 0, availability: 0, status: 'DOWN' } as any
    team.services['classic-api'] = { attack: team.services['classic-api']?.attack || 0, defense: team.services['classic-api']?.defense || 0, availability: 0, status: 'FAULT' } as any
  } else {
    team.status = 'Operational'
    if (!team.services) team.services = {} as any
    for (const svc of SERVICES) {
      if (!team.services[svc.key]) {
        team.services[svc.key] = { attack: 0, defense: 0, availability: 0, status: 'UP' } as any
      } else {
        ;(team.services[svc.key] as any).status = 'UP'
      }
    }
  }
}
saveState()

// User session state: null by default (Visitors are unauthenticated guests)
let loggedInUser: { id: string; userName: string; role: string; team?: any } | null = null

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

// Ensure initial flags exist if game has started
if (state.round > 0 && Object.keys(state.flags).length === 0) {
  generateFlagsForTick(state.totalTickCount)
}

// Tick progression logic
function advanceTick() {
  if (state.round === 0) {
    state.round = 1
    state.tick = 1
    state.totalTickCount = 1
  } else {
    state.totalTickCount += 1
    state.tick += 1
    if (state.tick > state.maxTick) {
      state.tick = 1
      state.round += 1
    }
  }
  state.lastTickTimestamp = Date.now()

  console.log(`[A&D Tick Engine] ▶ Advancing to Round ${state.round} · Tick ${state.tick}/${state.maxTick} (Global Tick #${state.totalTickCount})`)

  // 1. Generate new round flags for all teams
  generateFlagsForTick(state.totalTickCount)

  // 2. Calculate dynamic score: strictly sum of attack and defense points
  for (const team of state.teams) {
    for (const svc of SERVICES) {
      if (!team.services[svc.key]) {
        team.services[svc.key] = { attack: 0, defense: 0, availability: 0, status: 'UP' } as any
      }
    }
    const totalAttack = Object.values(team.services).reduce((sum, s) => sum + (s.attack || 0), 0)
    const totalDefense = Object.values(team.services).reduce((sum, s) => sum + (s.defense || 0), 0)
    team.score = Math.max(0, totalAttack + totalDefense)
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

// ==========================================
// Autonomous AI Bot Warfare Engine
// ==========================================
let botWarEnabled = true
let nextBotAttackTime = Date.now() + 3000 + Math.random() * 4000

function triggerAiBotAttack() {
  if (state.isPaused || state.round === 0 || !botWarEnabled) return

  // Opponent bot teams (1, 2, 3, 4, 5, 6, 8, 9, 10)
  const opponentIds = [1, 2, 3, 4, 5, 6, 8, 9, 10]
  const attackerId = opponentIds[Math.floor(Math.random() * opponentIds.length)]

  // Potential victims: all 10 teams except current attacker (including user's team 7 Z3RODAY)
  const allTeamIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const possibleVictims = allTeamIds.filter((id) => id !== attackerId)
  const victimId = possibleVictims[Math.floor(Math.random() * possibleVictims.length)]

  const attacker = state.teams.find((t) => t.id === attackerId)
  const victim = state.teams.find((t) => t.id === victimId)
  if (!attacker || !victim) return

  // Select target service
  const svc = SERVICES[Math.floor(Math.random() * SERVICES.length)]

  // If victim is Team 7 (Z3RODAY):
  // Check service condition: if FAULT or DOWN, attack is 100% successful!
  // If UP (patched/defended), 75% defense success rate (bot attack blocked)!
  const victimSvcStatus = (victim.services[svc.key] as any)?.status || 'UP'
  if (victim.id === 7 && victimSvcStatus === 'UP' && Math.random() < 0.75) {
    // Defense holds! No points deducted, no breach
    return
  }

  const attackPoints = 100
  const defensePenalty = 50

  attacker.score += attackPoints
  attacker.captures += 1
  if (!attacker.services[svc.key]) attacker.services[svc.key] = { attack: 0, defense: 0, availability: 0 }
  attacker.services[svc.key].attack += attackPoints

  victim.score = Math.max(0, victim.score - defensePenalty)
  if (!victim.services[svc.key]) victim.services[svc.key] = { attack: 0, defense: 0, availability: 0 }
  victim.services[svc.key].defense = Math.max(0, victim.services[svc.key].defense - defensePenalty)

  const attackEvent: AttackLog = {
    id: `atk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    time: getTimeStr(),
    attackerId: attacker.id,
    victimId: victim.id,
    service: svc.key,
    text: `${attacker.name} → ${victim.name} (Flag captured!)`,
    isNuke: true,
    color: svc.color || '#fab005',
  }

  state.attacks.unshift(attackEvent)
  if (state.attacks.length > 60) state.attacks.pop()

  ATTACK_LOGS.unshift({
    id: attackEvent.id,
    time: attackEvent.time,
    attacker: attacker.name,
    target: victim.name,
    service: svc.key,
    status: 'SUCCESS',
    flag: `flag{ionic26_${victim.id}_${svc.key}_t${state.totalTickCount}_ai}`,
  })
  if (ATTACK_LOGS.length > 60) ATTACK_LOGS.pop()

  sortTeams()
  saveState()
}

// Tick Timer & AI Warfare Loop
setInterval(() => {
  if (state.isPaused || state.round === 0) return
  const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000)
  if (elapsed >= state.tickSeconds) {
    advanceTick()
  }

  // Trigger continuous autonomous bot warfare every 4 to 8 seconds
  if (botWarEnabled && Date.now() >= nextBotAttackTime) {
    triggerAiBotAttack()
    nextBotAttackTime = Date.now() + 4000 + Math.random() * 4500
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

let lastSubmitId = 1000

function processFlagSubmission(rawFlags: string[], submitterId = 7) {
  const attacker = state.teams.find((t) => t.id === submitterId) || state.teams[6] || state.teams[0]
  let acceptedCount = 0
  const results: Array<{ flag: string; status: 'accepted' | 'rejected'; message: string; points: number }> = []

  for (const rawFlag of rawFlags) {
    if (!rawFlag || typeof rawFlag !== 'string') continue
    const trimmed = rawFlag.trim()
    if (!trimmed) continue

    // Determine victim and service
    let victimTeamId = (attacker.id % 10) + 1 // Default enemy team
    let svcKey = 'simple-crypto'

    const flagRecord = state.flags[trimmed]
    if (flagRecord) {
      victimTeamId = flagRecord.teamId
      svcKey = flagRecord.serviceKey
    } else {
      // Dynamic parse if format: flag{ionic26_<victimId>_<svc>_...}
      const match = trimmed.match(/flag\{ionic26_(\d+)_([a-zA-Z0-9_-]+)/)
      if (match) {
        victimTeamId = parseInt(match[1])
        svcKey = match[2]
      }
    }

    if (victimTeamId === attacker.id) {
      victimTeamId = (attacker.id % 10) + 1
    }

    const victim = state.teams.find((t) => t.id === victimTeamId) || state.teams[(attacker.id % state.teams.length)]

    // ACCEPTED! No duplicate blocking -> allows rapid testing / spamming
    acceptedCount += 1
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
    if (state.attacks.length > 100) state.attacks.pop()

    // Add to ATTACK_LOGS for admin logs
    ATTACK_LOGS.unshift({
      id: attackEvent.id,
      time: attackEvent.time,
      attacker: attacker.name,
      target: victim.name,
      service: svcKey,
      status: 'SUCCESS',
      flag: trimmed,
    })
    if (ATTACK_LOGS.length > 100) ATTACK_LOGS.pop()

    results.push({
      flag: trimmed,
      status: 'accepted',
      message: `Flag accepted! +100 Attack Points against ${victim.name}`,
      points: 100,
    })

    console.log(`[A&D Flag Captured] 💥 ${attacker.name} captured flag from ${victim.name} on [${svcKey}]! (+100 pts)`)
  }

  if (acceptedCount > 0) {
    sortTeams()
    saveState()
  }

  return { acceptedCount, totalPoints: acceptedCount * 100, results }
}

// Main Request Handler
async function handleRequest(req: Request): Promise<Response> {
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
          botWarEnabled,
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
          rows: state.teams.map((t) => {
            const safeServices: Record<string, { attack: number; defense: number; availability: number }> = {}
            for (const s of SERVICES) {
              safeServices[s.key] = {
                attack: t.services?.[s.key]?.attack ?? 0,
                defense: t.services?.[s.key]?.defense ?? 0,
                availability: t.services?.[s.key]?.availability ?? 0,
              }
            }
            return {
              rank: t.rank,
              name: t.name,
              school: t.school,
              code: t.code,
              logo: t.logo,
              captures: t.captures ?? 0,
              total: t.score ?? 0,
              status: t.status ?? 'Operational',
              self: loggedInUser?.team ? t.id === loggedInUser.team.id : false,
              services: safeServices,
            }
          }),
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

    // 4b. WireGuard VPN Configuration Endpoint (Real Curve25519 Keys)
    if (path.match(/\/api\/game\/\d+\/ad\/vpn/) || path === '/api/ad/vpn') {
      const teamId = loggedInUser?.team?.id || 7
      const confText = generateClientWgConfig(teamId)
      return new Response(confText, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="ad-game-${teamId}.conf"`,
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 4c. Challenge Attachment Downloads
    if (path.startsWith('/attachments/')) {
      const filename = path.replace('/attachments/', '').split('?')[0]
      const decodedFilename = decodeURIComponent(filename)
      const possiblePaths = [
        `./build/attachments/${decodedFilename}`,
        `./public/attachments/${decodedFilename}`,
        `./build/attachments/${filename}`,
        `./public/attachments/${filename}`,
      ]
      for (const p of possiblePaths) {
        if (existsSync(p)) {
          const file = Bun.file(p)
          return new Response(file, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Access-Control-Allow-Origin': '*',
            },
          })
        }
      }
    }

    if (path.match(/\/api\/(?:game|Game)\/\d+\/(?:challenges|Challenges)\/(\d+)\/(?:attachment|Attachment)/i)) {
      const match = path.match(/\/api\/(?:game|Game)\/\d+\/(?:challenges|Challenges)\/(\d+)\/(?:attachment|Attachment)/i)
      const cId = parseInt(match![1])
      const fileMap: Record<number, string> = {
        1: 'playground.zip',
        2: 'cpppp.zip',
        3: 'classic-api.zip',
        4: 'coloring.zip',
      }
      const filename = fileMap[cId] || 'attachment.zip'
      const possiblePaths = [
        `./build/attachments/${filename}`,
        `./public/attachments/${filename}`,
      ]
      for (const p of possiblePaths) {
        if (existsSync(p)) {
          const file = Bun.file(p)
          return new Response(file, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Access-Control-Allow-Origin': '*',
            },
          })
        }
      }
    }

    if (path.startsWith('/api/ad/attachment/')) {
      const rawName = path.replace('/api/ad/attachment/', '').split('?')[0]
      const decoded = decodeURIComponent(rawName)
      const filename = decoded.endsWith('.zip') ? decoded : `${decoded}.zip`
      const possiblePaths = [
        `./build/attachments/${filename}`,
        `./public/attachments/${filename}`,
      ]
      for (const p of possiblePaths) {
        if (existsSync(p)) {
          const file = Bun.file(p)
          return new Response(file, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Access-Control-Allow-Origin': '*',
            },
          })
        }
      }
    }

    // 5. Flag Submission Endpoint (Single & Batch)
    if (path.includes('/submit')) {
      if (req.method !== 'POST') {
        return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
      }

      try {
        const body = await req.json().catch(() => ({}))
        const submitterId = parseInt(body.teamId || (loggedInUser?.team?.id ? String(loggedInUser.team.id) : '7'))

        const flagList: string[] = Array.isArray(body.flags)
          ? body.flags.map((f: string) => f.trim()).filter(Boolean)
          : [(body.flag || body.answer || '').trim()].filter(Boolean)

        if (!flagList.length) {
          return Response.json({ acceptedCount: 0, totalPoints: 0, message: 'Flag cannot be empty' }, { status: 400, headers })
        }

        const outcome = processFlagSubmission(flagList, submitterId)
        return Response.json(
          {
            acceptedCount: outcome.acceptedCount,
            totalPoints: outcome.totalPoints,
            results: outcome.results,
            message: outcome.acceptedCount > 0
              ? `Berhasil submit ${outcome.acceptedCount} flag! (+${outcome.totalPoints} poin)`
              : 'Flag ditolak',
          },
          { headers }
        )
      } catch (err: any) {
        return Response.json({ acceptedCount: 0, totalPoints: 0, message: err?.message || 'Submission error' }, { status: 400, headers })
      }
    }

    // 6. Admin Endpoints: Warfare Control, Flag Inspector & Attack Simulator
    if (path === '/api/ad/admin/overview') {
      const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000)
      const secondsLeft = Math.max(0, state.tickSeconds - elapsed)
      const activeFlags = Object.values(state.flags).filter((f) => f.expiresTick >= state.totalTickCount)

      return Response.json(
        {
          round: state.round,
          tick: state.tick,
          maxTick: state.maxTick,
          tickSeconds: state.tickSeconds,
          secondsLeft,
          totalTickCount: state.totalTickCount,
          isPaused: !!state.isPaused,
          teams: state.teams,
          activeFlags,
          attacks: state.attacks,
          services: SERVICES,
        },
        { headers }
      )
    }

    if (path === '/api/ad/admin/control') {
      try {
        const body = await req.json()
        const action = body.action

        if (action === 'start') {
          state.round = 1
          state.tick = 1
          state.totalTickCount = 1
          state.isPaused = false
          state.lastTickTimestamp = Date.now()
          generateFlagsForTick(1)
          saveState()
          return Response.json({ success: true, message: 'Kompetisi resmi dimulai! Ronde 1 · Tick 1' }, { headers })
        } else if (action === 'pause') {
          state.isPaused = true
          saveState()
          return Response.json({ success: true, message: 'Engine berhasil dijeda' }, { headers })
        } else if (action === 'resume') {
          state.isPaused = false
          state.lastTickTimestamp = Date.now()
          saveState()
          return Response.json({ success: true, message: 'Engine berhasil dilanjutkan' }, { headers })
        } else if (action === 'next-tick' || action === 'next_tick') {
          advanceTick()
          return Response.json({ success: true, message: `Berpindah ke Tick ${state.tick} (Ronde ${state.round})` }, { headers })
        } else if (action === 'reset_zero' || action === 'reset_round' || action === 'reset') {
          resetToStandbyState(true)
          return Response.json({ success: true, message: 'Seluruh data berhasil direset ke 0 (Pre-Game Standby)' }, { headers })
        } else if (action === 'sabotage') {
          resetToStandbyState(true)
          return Response.json({ success: true, message: 'Layanan awal telah disabotase (Mumble & Offline)' }, { headers })
        } else if (action === 'toggle_bot') {
          botWarEnabled = !botWarEnabled
          return Response.json({ success: true, botWarEnabled, message: `AI Bot War ${botWarEnabled ? 'Diaktifkan' : 'Dinonaktifkan'}` }, { headers })
        } else if (action === 'enable_bot') {
          botWarEnabled = true
          return Response.json({ success: true, botWarEnabled, message: 'AI Bot War Diaktifkan' }, { headers })
        } else if (action === 'disable_bot') {
          botWarEnabled = false
          return Response.json({ success: true, botWarEnabled, message: 'AI Bot War Dinonaktifkan' }, { headers })
        } else if (action === 'repair_all') {
          for (const team of state.teams) {
            for (const svc of SERVICES) {
              if (team.services[svc.key]) {
                ;(team.services[svc.key] as any).status = 'UP'
              }
            }
            team.status = 'Operational'
          }
          saveState()
          return Response.json({ success: true, message: 'Semua layanan tim berhasil dipulihkan (UP)' }, { headers })
        } else if (action === 'set_status') {
          const { teamId, serviceKey, status } = body
          const targetTeam = state.teams.find((t) => t.id === teamId)
          if (targetTeam && targetTeam.services[serviceKey]) {
            ;(targetTeam.services[serviceKey] as any).status = status
            const statuses = SERVICES.map((s) => (targetTeam.services[s.key] as any)?.status || 'UP')
            if (statuses.includes('DOWN')) {
              targetTeam.status = 'Offline'
            } else if (statuses.includes('FAULT')) {
              targetTeam.status = 'Mumble'
            } else {
              targetTeam.status = 'Operational'
            }
            saveState()
          }
          return Response.json({ success: true, teamId, serviceKey, status }, { headers })
        } else if (action === 'set-tick-seconds') {
          const secs = parseInt(body.tickSeconds || '60')
          state.tickSeconds = Math.max(10, secs)
          state.lastTickTimestamp = Date.now()
          saveState()
          return Response.json({ success: true, message: `Durasi tick diatur ke ${state.tickSeconds}s` }, { headers })
        }
        return Response.json({ error: 'Aksi tidak dikenal' }, { status: 400, headers })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400, headers })
      }
    }

    if (path === '/api/ad/admin/team-status') {
      try {
        const body = await req.json()
        const teamId = parseInt(body.teamId)
        const team = state.teams.find((t) => t.id === teamId)
        if (!team) return Response.json({ error: 'Team not found' }, { status: 404, headers })

        if (body.status) team.status = body.status
        if (typeof body.scoreDelta === 'number') team.score = Math.max(0, team.score + body.scoreDelta)
        if (typeof body.capturesDelta === 'number') team.captures = Math.max(0, team.captures + body.capturesDelta)

        sortTeams()
        saveState()
        return Response.json({ success: true, team }, { headers })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400, headers })
      }
    }

    if (path === '/api/ad/admin/trigger-attack') {
      let fromId = 7
      let toId = 5
      let svc = 'simple-pwn'

      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        fromId = parseInt(body.from || '7')
        toId = parseInt(body.to || '5')
        svc = body.svc || 'simple-pwn'
      } else {
        fromId = parseInt(url.searchParams.get('from') || '7')
        toId = parseInt(url.searchParams.get('to') || '5')
        svc = url.searchParams.get('svc') || 'simple-pwn'
      }

      const attacker = state.teams.find((t) => t.id === fromId) || state.teams[6]
      const victim = state.teams.find((t) => t.id === toId) || state.teams[4]

      attacker.score += 100
      attacker.captures += 1
      victim.score = Math.max(0, victim.score - 50)
      sortTeams()

      const attackEvent: AttackLog = {
        id: `atk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        time: getTimeStr(),
        attackerId: attacker.id,
        victimId: victim.id,
        service: svc,
        text: `${attacker.name} → ${victim.name} (Flag captured!)`,
        isNuke: true,
        color: '#fab005',
      }

      state.attacks.unshift(attackEvent)
      if (state.attacks.length > 50) state.attacks.pop()
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

    if (path === '/api/captcha' || path === '/api/config/captcha' || path.includes('/captcha')) {
      return Response.json({ type: 'None' }, { headers })
    }

    if (path.includes('/account/register') || path === '/api/account/register') {
      let u = 'Super Admin'
      let email = 'admin@ionic.id'
      try {
        const body = await req.json().catch(() => ({}))
        if (body.userName) u = body.userName
        if (body.email) email = body.email
      } catch {}

      const cleanU = u.trim().toLowerCase()
      if (cleanU === 'admin' || cleanU.includes('admin')) {
        loggedInUser = {
          id: 'admin_1',
          userName: u || 'Admin',
          role: 'Admin',
          team: null,
        }
      } else {
        let teamIdx = 1
        const teamNumMatch = cleanU.match(/(\d+)/)
        if (teamNumMatch) {
          const num = parseInt(teamNumMatch[1])
          if (num >= 401 && num <= 410) {
            teamIdx = num - 400
          } else if (num >= 1 && num <= 10) {
            teamIdx = num
          }
        }
        const targetTeam = INITIAL_TEAMS.find((t) => t.id === teamIdx) || INITIAL_TEAMS[0]
        loggedInUser = {
          id: `user_${Date.now()}`,
          userName: u,
          role: 'User',
          team: {
            id: targetTeam.id,
            name: targetTeam.name,
            bio: targetTeam.school,
            avatar: targetTeam.logo,
            memberCount: 3,
            locked: false,
            members: [
              { id: `user_${Date.now()}`, userName: u, captain: true },
            ],
          },
        }
      }

      return Response.json(
        {
          title: 'Registrasi Berhasil',
          data: 'LoggedIn',
        },
        { headers }
      )
    }

    if (path.includes('/account/login') || path === '/api/account/login') {
      let u = 'admin'
      let p = ''
      try {
        const body = await req.json().catch(() => ({}))
        if (body.userName) u = body.userName
        if (body.password) p = body.password
      } catch {}

      const cleanU = u.trim().toLowerCase()
      if (cleanU === 'admin' || cleanU.startsWith('admin') || cleanU.includes('admin')) {
        loggedInUser = {
          id: 'admin_1',
          userName: u || 'Admin',
          role: 'Admin',
          team: null,
        }
      } else {
        // Parse team number (e.g. team1 -> 1, t401 -> 1, team7 -> 7)
        let teamIdx = 1
        const teamNumMatch = cleanU.match(/(\d+)/)
        if (teamNumMatch) {
          const num = parseInt(teamNumMatch[1])
          if (num >= 401 && num <= 410) {
            teamIdx = num - 400
          } else if (num >= 1 && num <= 10) {
            teamIdx = num
          }
        } else {
          const found = INITIAL_TEAMS.find(
            (t) => t.name.toLowerCase().includes(cleanU) || cleanU.includes(t.name.toLowerCase())
          )
          if (found) teamIdx = found.id
        }

        const targetTeam = INITIAL_TEAMS.find((t) => t.id === teamIdx) || INITIAL_TEAMS[0]
        loggedInUser = {
          id: `user_t${targetTeam.id}`,
          userName: `team${targetTeam.id}`,
          role: 'User',
          team: {
            id: targetTeam.id,
            name: targetTeam.name,
            bio: targetTeam.school,
            avatar: targetTeam.logo,
            memberCount: 3,
            locked: false,
            members: [
              { id: `user_t${targetTeam.id}`, userName: `team${targetTeam.id}`, captain: true },
              { id: `user_t${targetTeam.id}_m1`, userName: 'Anggota 1', captain: false },
              { id: `user_t${targetTeam.id}_m2`, userName: 'Anggota 2', captain: false },
            ],
          },
        }
      }

      return Response.json(
        {
          id: loggedInUser.id,
          userName: loggedInUser.userName,
          role: loggedInUser.role,
          token: `jwt_${loggedInUser.role.toLowerCase()}_ionic2026`,
        },
        { headers }
      )
    }

    if (path.includes('/account/logout')) {
      loggedInUser = null
      return Response.json({ success: true }, { headers })
    }

    if (path === '/api/account/profile') {
      if (!loggedInUser) {
        return Response.json({ message: 'Unauthorized' }, { status: 401, headers })
      }
      return Response.json(
        {
          id: loggedInUser.id,
          userName: loggedInUser.userName,
          role: loggedInUser.role,
          team: loggedInUser.team,
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
      const isUserAdmin = loggedInUser?.role === 'Admin'
      const targetTeam = isUserAdmin
        ? null
        : (loggedInUser?.team ? state.teams.find((t) => t.id === loggedInUser.team.id) : null)

      return Response.json(
        {
          challenges: {
            Crypto: [
              { id: 1, title: 'playground', category: 'Crypto', score: 1000, solved: 0, bloods: [], disableBloodBonus: false },
            ],
            Pwn: [
              { id: 2, title: '(C)PPPP!', category: 'Pwn', score: 1000, solved: 0, bloods: [], disableBloodBonus: false },
            ],
            Web: [
              { id: 3, title: 'classic-api', category: 'Web', score: 1000, solved: 0, bloods: [], disableBloodBonus: false },
              { id: 4, title: 'coloring', category: 'Web', score: 1000, solved: 0, bloods: [], disableBloodBonus: false },
            ],
          },
          challengeCount: 4,
          rank: targetTeam
            ? {
                rank: targetTeam.rank,
                score: targetTeam.score,
                team: {
                  id: targetTeam.id,
                  name: targetTeam.name,
                  bio: targetTeam.school,
                  avatar: targetTeam.logo,
                },
                solvedCount: targetTeam.captures,
              }
            : null,
          teamToken: targetTeam ? `ad_token_${targetTeam.code.toLowerCase()}_ionic2026` : 'ad_token_panitia_admin',
          writeupRequired: false,
          writeupDeadline: 0,
        },
        { headers }
      )
    }

    // Admin Game Poster Upload
    if (req.method === 'PUT' && path.match(/\/api\/edit\/games\/\d+\/poster/)) {
      try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        if (file) {
          const buffer = Buffer.from(await file.arrayBuffer())
          const base64 = buffer.toString('base64')
          const mime = file.type || 'image/png'
          const dataUrl = `data:${mime};base64,${base64}`
          adminGameInfo.poster = dataUrl
          singleGame.poster = dataUrl
          saveState()
          return Response.json(dataUrl, { headers })
        }
      } catch (err) {
        console.error('Error handling poster upload:', err)
      }
      return Response.json(adminGameInfo.poster || '', { headers })
    }

    // Admin Game Poster Delete
    if (req.method === 'DELETE' && path.match(/\/api\/edit\/games\/\d+\/poster/)) {
      adminGameInfo.poster = null
      singleGame.poster = null
      saveState()
      return Response.json(null, { headers })
    }

    // Admin Update Game Info
    if (req.method === 'PUT' && path.match(/\/api\/edit\/games\/\d+$/)) {
      try {
        const body = await req.json()
        Object.assign(adminGameInfo, body)
        Object.assign(singleGame, body)
        saveState()
      } catch {}
      return Response.json(adminGameInfo, { headers })
    }

    // 1. Admin Game Divisions CRUD (GET, POST, PUT, DELETE)
    if (path.match(/\/api\/edit\/games\/\d+\/divisions/)) {
      if (req.method === 'GET') {
        return Response.json(divisionsList, { headers })
      }
      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        const newDiv = {
          id: divisionsList.length + 1,
          name: body.name || `Divisi ${divisionsList.length + 1}`,
          description: body.description || '',
          inviteCode: body.inviteCode || null,
          inviteCodeRequired: !!body.inviteCodeRequired,
        }
        divisionsList.push(newDiv)
        return Response.json(newDiv, { headers })
      }
      if (req.method === 'PUT') {
        const body = await req.json().catch(() => ({}))
        const divIdMatch = path.match(/\/api\/edit\/games\/\d+\/divisions\/(\d+)/)
        const divId = divIdMatch ? parseInt(divIdMatch[1]) : 1
        const target = divisionsList.find((d) => d.id === divId)
        if (target) Object.assign(target, body)
        return Response.json(target || body, { headers })
      }
      if (req.method === 'DELETE') {
        const divIdMatch = path.match(/\/api\/edit\/games\/\d+\/divisions\/(\d+)/)
        if (divIdMatch) {
          const divId = parseInt(divIdMatch[1])
          divisionsList = divisionsList.filter((d) => d.id !== divId)
        }
        return Response.json({ success: true }, { headers })
      }
    }

    // 2. Game Participations for Review (GET, PUT)
    if (path.match(/\/api\/game\/\d+\/participations/)) {
      if (req.method === 'PUT') {
        return Response.json({ success: true }, { headers })
      }
      const participations = state.teams.map((t, idx) => ({
        id: idx + 1,
        team: {
          id: t.id,
          name: t.name,
          bio: t.school,
          avatar: t.logo,
          locked: false,
          captainId: `user_t${t.id}`,
          members: [
            { id: `user_t${t.id}`, userName: t.name, captain: true, role: 'User' },
            { id: `user_t${t.id}_m1`, userName: 'Anggota 1', captain: false, role: 'User' },
            { id: `user_t${t.id}_m2`, userName: 'Anggota 2', captain: false, role: 'User' },
          ],
        },
        registeredMembers: [`user_t${t.id}`],
        divisionId: 1,
        status: 'Accepted',
      }))
      return Response.json(participations, { headers })
    }

    // 3. Admin Game Challenges List (GET /api/edit/games/:id/challenges)
    if (path.match(/\/api\/edit\/games\/\d+\/challenges$/)) {
      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        return Response.json({ id: Date.now(), ...body, isEnabled: true, score: 1000 }, { headers })
      }
      return Response.json(
        [
          { id: 1, title: 'playground', category: 'Crypto', score: 1000, type: 'Normal', isEnabled: true },
          { id: 2, title: '(C)PPPP!', category: 'Pwn', score: 1000, type: 'Normal', isEnabled: true },
          { id: 3, title: 'classic-api', category: 'Web', score: 1000, type: 'Normal', isEnabled: true },
          { id: 4, title: 'coloring', category: 'Web', score: 1000, type: 'Normal', isEnabled: true },
        ],
        { headers }
      )
    }

    // 4. Single Challenge Detail (Admin & User: /api/edit/games/:id/challenges/:cId & /api/game/:id/challenges/:cId)
    const chalDetailMatch = path.match(/\/api\/(?:edit\/games|game)\/\d+\/challenges\/(\d+)$/)
    if (chalDetailMatch) {
      const cId = parseInt(chalDetailMatch[1])
      const chalMap: Record<number, any> = {
        1: { id: 1, title: 'playground', category: 'Crypto', port: 6969, attachment: 'playground.zip' },
        2: { id: 2, title: '(C)PPPP!', category: 'Pwn', port: 7070, attachment: 'cpppp.zip' },
        3: { id: 3, title: 'classic-api', category: 'Web', port: 1337, attachment: 'classic-api.zip' },
        4: { id: 4, title: 'coloring', category: 'Web', port: 8082, attachment: 'coloring.zip' },
      }
      const cInfo = chalMap[cId] || { id: cId, title: `Service #${cId}`, category: 'Web', port: 8000 + cId }
      if (req.method === 'PUT') {
        const body = await req.json().catch(() => ({}))
        return Response.json({ ...cInfo, ...body }, { headers })
      }
      if (req.method === 'DELETE') {
        return Response.json({ success: true }, { headers })
      }
      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        const submitterId = loggedInUser?.team?.id || 7
        const flagText = body.flag || ''
        processFlagSubmission([flagText], submitterId)
        lastSubmitId += 1
        return Response.json(lastSubmitId, { headers })
      }
      return Response.json(
        {
          id: cInfo.id,
          title: cInfo.title,
          category: cInfo.category,
          type: 'Normal',
          score: 1000,
          content: `Layanan **${cInfo.title}** aktif pada target instance. Lindungi source code aplikasi dan perbaiki celah vulnerability sebelum dieksploitasi oleh tim lawan! Flag akan dirotasi otomatis setiap tick.`,
          hints: [`Service aktif pada port ${cInfo.port}`, 'Akses melalui IP Team / WireGuard VPN'],
          attachment: cInfo.attachment ? {
            type: 'Local',
            url: `/attachments/${cInfo.attachment}`,
            fileName: cInfo.attachment,
            fileSize: 10240,
          } : null,
          isEnabled: true,
          acceptedCount: 5,
          solved: false,
          isSolved: false,
          bloods: [],
        },
        { headers }
      )
    }

    // 5. Flag submit status (Directly string 'Accepted' for AnswerResult enum match)
    if (path.match(/\/api\/game\/\d+\/challenges\/\d+\/status\/\d+/)) {
      return Response.json('Accepted', { headers })
    }

    // 5b. Game Monitor Endpoints (Events, Submissions, CheatInfo, Traffic, Sheet)
    if (path.match(/\/api\/game\/\d+\/events/)) {
      const eventsList = state.attacks.map((atk) => ({
        type: 'FlagSubmit',
        user: state.teams.find((t) => t.id === atk.attackerId)?.name || 'Team',
        team: state.teams.find((t) => t.id === atk.attackerId)?.name || 'Team',
        challenge: atk.service,
        time: new Date().toISOString(),
        values: [atk.service, state.teams.find((t) => t.id === atk.victimId)?.name || 'Enemy'],
      }))
      return Response.json(eventsList, { headers })
    }

    if (path.match(/\/api\/game\/\d+\/submissionsheet/)) {
      const csv = 'time,team,user,challenge,status\n' + state.attacks.map((a) => `${a.time},${state.teams.find((t) => t.id === a.attackerId)?.name || 'Team'},User,${a.service},Accepted`).join('\n')
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="submissions.csv"',
        },
      })
    }

    if (path.match(/\/api\/game\/\d+\/submissions/)) {
      const subsList = state.attacks.map((atk) => ({
        answer: `flag{ionic26_${atk.victimId}_${atk.service}_...}`,
        status: 'Accepted',
        time: Date.now(),
        user: state.teams.find((t) => t.id === atk.attackerId)?.name || 'Team',
        team: state.teams.find((t) => t.id === atk.attackerId)?.name || 'Team',
        challenge: atk.service,
      }))
      return Response.json(subsList, { headers })
    }

    if (path.match(/\/api\/game\/\d+\/cheatinfo/)) {
      return Response.json([], { headers })
    }

    // Traffic Capturing Endpoints (/api/game/games/:id/captures, /api/game/captures/:cId, /api/game/captures/:cId/:partId)
    if (path.match(/\/api\/game\/games\/\d+\/captures/)) {
      const chTraffic = SERVICES.map((s, idx) => ({
        id: idx + 1,
        title: s.name,
        category: s.category,
        type: 'Normal',
        isEnabled: true,
        count: 0,
      }))
      return Response.json(chTraffic, { headers })
    }

    if (path.match(/\/api\/game\/captures\/\d+\/\d+/)) {
      if (req.method === 'DELETE') {
        return Response.json({ success: true }, { headers })
      }
      return Response.json([], { headers })
    }

    if (path.match(/\/api\/game\/captures\/\d+$/)) {
      if (req.method === 'DELETE') {
        return Response.json({ success: true }, { headers })
      }
      const teamCaptures = state.teams.map((t) => ({
        id: t.id,
        teamId: t.id,
        name: t.name,
        division: 'Finalist',
        avatar: t.logo,
        count: 0,
      }))
      return Response.json(teamCaptures, { headers })
    }

    if (path.match(/\/api\/game\/\d+\/traffic/)) {
      return Response.json([], { headers })
    }

    // 6. Admin Game Notices
    if (path.match(/\/api\/edit\/games\/\d+\/notices/)) {
      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        return Response.json({ id: Date.now(), ...body, time: new Date().toISOString() }, { headers })
      }
      return Response.json(
        [
          {
            id: 1,
            title: 'Final IONIC 2026',
            content: 'Pertandingan Attack & Defense sedang berlangsung!',
            time: new Date().toISOString(),
            type: 'Normal',
          },
        ],
        { headers }
      )
    }

    // 7. Admin Writeups
    if (path.startsWith('/api/admin/writeups')) {
      return Response.json(
        {
          divisions: { '1': 'Finalist' },
          writeups: [],
        },
        { headers }
      )
    }

    // 8. General Admin & Edit Endpoints
    if (path.startsWith('/api/edit/games') || path.startsWith('/api/admin/games')) {
      if (path === '/api/edit/games' || path === '/api/edit/games/' || path === '/api/admin/games') {
        return Response.json(
          {
            total: 1,
            length: 1,
            data: [adminGameInfo],
          },
          { headers }
        )
      }
      if (path.match(/\/api\/edit\/games\/\d+$/)) {
        return Response.json(adminGameInfo, { headers })
      }
      return Response.json({ total: 1, length: 1, data: [adminGameInfo] }, { headers })
    }

    // 9. Admin Teams Management (GET, POST search, PUT, DELETE)
    if (path.startsWith('/api/admin/teams')) {
      if (req.method === 'DELETE' || req.method === 'PUT') {
        return Response.json({ success: true }, { headers })
      }
      const teamsList = state.teams.map((t) => ({
        id: t.id,
        name: t.name,
        bio: t.school,
        avatar: t.logo,
        memberCount: 3,
        locked: false,
        members: [
          { id: `user_t${t.id}`, userName: t.name, captain: true },
          { id: `user_t${t.id}_m1`, userName: 'Anggota 1', captain: false },
          { id: `user_t${t.id}_m2`, userName: 'Anggota 2', captain: false },
        ],
      }))
      return Response.json({ total: teamsList.length, length: teamsList.length, data: teamsList }, { headers })
    }

    if (path.startsWith('/api/admin/users')) {
      const usersList = [
        { id: 'admin_1', userName: 'admin', email: 'admin@ionic.id', role: 'Admin', team: 'Panitia' },
        ...state.teams.map((t) => ({
          id: `user_t${t.id}`,
          userName: `team${t.id}`,
          email: `team${t.id}@ionic.id`,
          role: 'User',
          team: t.name,
        })),
      ]
      return Response.json({ total: usersList.length, length: usersList.length, data: usersList }, { headers })
    }

    if (path.startsWith('/api/admin/logs')) {
      return Response.json(
        {
          total: ATTACK_LOGS.length,
          length: ATTACK_LOGS.length,
          data: ATTACK_LOGS.map((l) => ({
            id: l.id,
            time: l.time,
            type: 'SubmitFlag',
            ip: '10.43.170.100',
            message: `[Attack] Team ${l.attacker} exploited ${l.target} on ${l.service}`,
          })),
        },
        { headers }
      )
    }

    if (path.startsWith('/api/admin/instances')) {
      return Response.json({ total: 0, length: 0, data: [] }, { headers })
    }

    if (path.startsWith('/api/admin/config')) {
      return Response.json(
        {
          globalConfig: {
            title: 'Final Cybersecurity IONIC 2026',
            description: 'A&D Platform IONIC 2026',
            slogan: 'Hack for fun not for profit',
            footerInfo: 'IONIC 2026 Final Attack & Defense Competition',
          },
          accountPolicy: {
            allowRegister: true,
            activeOnRegister: true,
            useCaptcha: false,
            emailConfirmationRequired: false,
          },
          containerPolicy: {},
        },
        { headers }
      )
    }

    if (path.includes('/api/game/recent')) {
      return Response.json([singleGame], { headers })
    }

    if (path === '/api/game' || path === '/api/game/') {
      return Response.json({ total: 1, data: [singleGame] }, { headers })
    }

    const samplePost = {
      id: 1,
      title: 'Selamat Datang di Final Attack & Defense IONIC 2026',
      summary: 'Kompetisi babak Final Cybersecurity IONIC 2026 resmi dimulai!',
      content: '10 Tim Finalis bertanding secara realtime mempertahankan service dan mengeksploitasi celah lawan. Perhatikan timer tick dan round!',
      time: new Date().toISOString(),
      isPinned: true,
      author: 'Panitia IONIC 2026',
    }

    if (path.match(/\/api\/posts\/\d+$/)) {
      return Response.json(samplePost, { headers })
    }

    if (path.includes('/posts') || path.includes('/post')) {
      return Response.json([samplePost], { headers })
    }

    // 10. User Team Endpoints
    if (path === '/api/team' || path === '/api/team/') {
      if (req.method === 'POST') {
        const body = await req.json().catch(() => ({}))
        return Response.json({ id: 99, name: body.name || 'New Team', memberCount: 1, members: [] }, { headers })
      }
      if (!loggedInUser || !loggedInUser.team) {
        return Response.json([], { headers }) // Empty array for guests!
      }
      return Response.json([loggedInUser.team], { headers })
    }

    if (path.match(/\/api\/team\/\d+$/)) {
      const tId = parseInt(path.split('/').pop() || '7')
      const target = state.teams.find((t) => t.id === tId) || state.teams[6]
      return Response.json(
        {
          id: target.id,
          name: target.name,
          bio: target.school,
          avatar: target.logo,
          locked: false,
          memberCount: 3,
          members: [
            { id: `user_t${target.id}`, userName: target.name, captain: true },
            { id: `user_t${target.id}_m1`, userName: 'Anggota 1', captain: false },
            { id: `user_t${target.id}_m2`, userName: 'Anggota 2', captain: false },
          ],
        },
        { headers }
      )
    }

    if (path === '/api/teams' || path === '/api/teams/') {
      const teamsList = state.teams.map((t) => ({
        id: t.id,
        name: t.name,
        bio: t.school,
        avatar: t.logo,
        memberCount: 3,
        locked: false,
        members: [
          { id: `user_t${t.id}`, userName: t.name, captain: true },
          { id: `user_t${t.id}_m1`, userName: 'Anggota 1', captain: false },
          { id: `user_t${t.id}_m2`, userName: 'Anggota 2', captain: false },
        ],
      }))
      return Response.json({ total: teamsList.length, length: teamsList.length, data: teamsList }, { headers })
    }

    if (path.match(/\/api\/game\/\d+\/check/)) {
      return Response.json(
        {
          joinedTeams: loggedInUser?.team ? [{ id: loggedInUser.team.id, division: 1 }] : [],
          joinableDivisions: [1],
        },
        { headers }
      )
    }

    if (path.match(/\/api\/game\/\d+\/challenges/)) {
      return Response.json(
        [
          { id: 1, title: 'playground', category: 'Crypto', score: 1000, type: 'Normal' },
          { id: 2, title: '(C)PPPP!', category: 'Pwn', score: 1000, type: 'Normal' },
          { id: 3, title: 'classic-api', category: 'Web', score: 1000, type: 'Normal' },
          { id: 4, title: 'coloring', category: 'Web', score: 1000, type: 'Normal' },
        ],
        { headers }
      )
    }

    if (path.match(/\/api\/game\/\d+\/scoreboard/)) {
      const items = state.teams.map((t, idx) => ({
        rank: idx + 1,
        id: t.id,
        name: t.name,
        organization: t.school,
        score: t.score,
        lastSubmission: Date.now() - idx * 60000,
        solvedChallenges: [],
      }))
      return Response.json(
        {
          items,
          divisions: [{ id: 1, name: 'Finalist' }],
        },
        { headers }
      )
    }

    if (path.match(/\/api\/game\/\d+$/)) {
      const activeGame = {
        ...singleGame,
        teamName: loggedInUser?.team?.name || 'Z3RODAY',
        status: 'Accepted',
      }
      return Response.json(activeGame, { headers })
    }

    // ==========================================
    // Static Files & React SPA Fallback (RAM Cached & Gzipped)
    // ==========================================
    if (!path.startsWith('/api') && !path.startsWith('/hub') && !path.startsWith('/swagger')) {
      const cleanPath = originalPath === '/' ? '/index.html' : originalPath
      const acceptGzip = req.headers.get('accept-encoding')?.includes('gzip') ?? false
      const dotIdx = cleanPath.lastIndexOf('.')
      const ext = dotIdx >= 0 ? cleanPath.substring(dotIdx).toLowerCase() : ''
      const contentType = MIME_TYPES[ext]

      const cached = getCachedStatic(`./build${cleanPath}`, contentType)
      if (cached) {
        const fileHeaders: Record<string, string> = {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': cleanPath.startsWith('/static/')
            ? 'public, max-age=31536000, immutable'
            : 'no-cache',
        }
        if (cached.contentType) {
          fileHeaders['Content-Type'] = cached.contentType
        }
        if (acceptGzip) {
          fileHeaders['Content-Encoding'] = 'gzip'
          return new Response(cached.gz, { headers: fileHeaders })
        }
        return new Response(cached.raw, { headers: fileHeaders })
      }

      // Do NOT serve index.html for missing static assets (prevent module script MIME error)
      if (cleanPath.startsWith('/static/') || cleanPath.startsWith('/logos/')) {
        return new Response('Not Found', { status: 404 })
      }

      const indexItem = getCachedStatic('./build/index.html', 'text/html; charset=utf-8')
      if (indexItem) {
        let html = indexItem.raw.toString('utf-8')
        html = html
          .replace(/%title%/g, 'IONIC 2026 · Attack & Defense')
          .replace(/%lang%/g, 'id')
          .replace(/%description%/g, 'Final Cybersecurity IONIC 2026 - Attack & Defense Platform')
          .replace(/%nonce%/g, 'ionic2026')

        if (acceptGzip) {
          const gz = gzipSync(Buffer.from(html))
          return new Response(gz, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Content-Encoding': 'gzip',
              'Cache-Control': 'no-cache',
            },
          })
        }

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        })
      }
    }

    // Default Fallback
    return Response.json({}, { headers })
}

// 1. HTTP Server (Port 80)
Bun.serve({
  port,
  idleTimeout: 120,
  fetch: handleRequest,
})
console.log(`[HTTP Server] Running on http://0.0.0.0:${port}`)

// 2. HTTPS Server (Port 443)
if (existsSync(CERT_FILE) && existsSync(KEY_FILE)) {
  try {
    Bun.serve({
      port: 443,
      idleTimeout: 120,
      tls: {
        cert: Bun.file(CERT_FILE),
        key: Bun.file(KEY_FILE),
      },
      fetch: handleRequest,
    })
    console.log(`[HTTPS Server] Running securely on https://0.0.0.0:443 (https://10.43.170.150)`)
  } catch (err: any) {
    console.warn(`[HTTPS Server] Notice: Could not bind HTTPS port 443:`, err?.message || err)
  }
}
