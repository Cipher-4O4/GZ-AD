import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  mdiCircle,
  mdiCrosshairsGps,
  mdiFullscreen,
  mdiFullscreenExit,
  mdiNuke,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useRef, useState } from 'react'

export interface TeamNode {
  id: string
  name: string
  school: string
  score: number
  rank: number
  status: 'Operational' | 'Recovering' | 'Mumble' | 'Offline'
  teamCode: string
  logo: string
  islandName: string
  sector: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  color: string
  islandPath: string
  reefPath: string
}

export interface AttackEvent {
  id: string
  time: string
  service: string
  attacker: TeamNode
  victim: TeamNode
  pathD: string
  color: string
}

export const FINALIST_TEAMS: TeamNode[] = [
  {
    id: '1',
    name: 'United Shell-SCC',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 59087.1,
    rank: 1,
    status: 'Operational',
    teamCode: 'T401',
    logo: '/logos/smkn7-semarang.png',
    islandName: 'Northern Bastion',
    sector: 'SECTOR-01',
    x: 17.2,
    y: 25.0,
    color: '#38d9a9',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '2',
    name: 'rootsanctum',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 56274.3,
    rank: 2,
    status: 'Operational',
    teamCode: 'T402',
    logo: '/logos/smkn7-semarang.png',
    islandName: 'Sanctum Peninsula',
    sector: 'SECTOR-02',
    x: 40.0,
    y: 26.5,
    color: '#20c997',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '3',
    name: 'WilSec - Apa aja',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 52228.6,
    rank: 3,
    status: 'Operational',
    teamCode: 'T403',
    logo: '/logos/smkn1-jakarta.png',
    islandName: 'Circular Ring Atoll',
    sector: 'SECTOR-03',
    x: 63.7,
    y: 25.3,
    color: '#fab005',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '4',
    name: 'Maaf TKA Pilih CTF',
    school: 'MA NEGERI 3 JEMBER',
    score: 48517.1,
    rank: 4,
    status: 'Operational',
    teamCode: 'T404',
    logo: '/logos/man3-jember.png',
    islandName: 'Jember Highland',
    sector: 'SECTOR-04',
    x: 83.3,
    y: 27.4,
    color: '#ff922b',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '5',
    name: 'WilSec - BOEDOET 47',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 48381.4,
    rank: 5,
    status: 'Operational',
    teamCode: 'T405',
    logo: '/logos/smkn1-jakarta.png',
    islandName: 'Crescent Isle',
    sector: 'SECTOR-05',
    x: 18.8,
    y: 48.7,
    color: '#ff6b6b',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '6',
    name: 'kata magfi "bebas"',
    school: 'SMK NEGERI 21 JAKARTA',
    score: 47410.0,
    rank: 6,
    status: 'Operational',
    teamCode: 'T406',
    logo: '/logos/smkn21-jakarta.png',
    islandName: 'Star Citadel',
    sector: 'SECTOR-06',
    x: 49.2,
    y: 51.1,
    color: '#da77f2',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '7',
    name: 'Z3RODAY',
    school: 'SMK NEGERI 1 BOYOLANGU',
    score: 47177.1,
    rank: 7,
    status: 'Operational',
    teamCode: 'T407',
    logo: '/logos/smkn1-boyolangu.png',
    islandName: 'Z3RO Archipelago',
    sector: 'SECTOR-07',
    x: 70.1,
    y: 57.1,
    color: '#20c997',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '8',
    name: 'Gangantua',
    school: 'SMK NEGERI 3 TUBAN',
    score: 47150.0,
    rank: 8,
    status: 'Mumble',
    teamCode: 'T408',
    logo: '/logos/smkn3-tuban.png',
    islandName: 'Gargantua Fjord',
    sector: 'SECTOR-08',
    x: 22.1,
    y: 77.1,
    color: '#fcc419',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '9',
    name: 'WilSec - Panitia',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 44544.3,
    rank: 9,
    status: 'Operational',
    teamCode: 'T409',
    logo: '/logos/smkn1-jakarta.png',
    islandName: 'Linear Reef Base',
    sector: 'SECTOR-09',
    x: 56.8,
    y: 82.0,
    color: '#ff6b6b',
    islandPath: '',
    reefPath: '',
  },
  {
    id: '10',
    name: 'Duo Perncari Flag',
    school: 'SMKS MASKUMAMBANG 1 DUKUN',
    score: 44145.7,
    rank: 10,
    status: 'Operational',
    teamCode: 'T410',
    logo: '/logos/smk-maskumambang-dukun.png',
    islandName: 'Eastern Atoll',
    sector: 'SECTOR-10',
    x: 86.6,
    y: 73.6,
    color: '#339af0',
    islandPath: '',
    reefPath: '',
  },
]

export const AttackMap: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [round, setRound] = useState(19)
  const [tick, setTick] = useState(2)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([])
  const [teams, setTeams] = useState<TeamNode[]>(FINALIST_TEAMS)
  const [selectedTeam, setSelectedTeam] = useState<TeamNode>(FINALIST_TEAMS[6]) // Default Z3RODAY
  const [nukeDetonation, setNukeDetonation] = useState<TeamNode | null>(null)
  const [activeAttacker, setActiveAttacker] = useState<TeamNode | null>(null)


  const [activityLogs, setActivityLogs] = useState<
    { time: string; service: string; text: string; isNuke?: boolean }[]
  >([
    {
      time: '15.53.45',
      service: 'playground',
      text: 'Z3RODAY → WilSec - BOEDOET 47 (Flag captured!)',
      isNuke: true,
    },
    {
      time: '15.53.45',
      service: 'cpppp',
      text: 'United Shell-SCC → Maaf TKA Pilih CTF (Flag captured!)',
      isNuke: true,
    },
    {
      time: '15.53.44',
      service: 'classic-api',
      text: 'rootsanctum → WilSec - Apa aja (Flag captured!)',
      isNuke: true,
    },
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const processedAttackIds = useRef<Set<string>>(new Set(['atk_init_1', 'atk_init_2', 'atk_init_3']))

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Realtime Polling of Live Attack & Defense Engine
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/ad/state')
        if (!res.ok) return
        const data = await res.json()

        if (typeof data.round === 'number') setRound(data.round)
        if (typeof data.tick === 'number') setTick(data.tick)
        if (typeof data.secondsLeft === 'number') setSecondsLeft(data.secondsLeft)

        // Merge teams with island coordinates
        if (data.teams && Array.isArray(data.teams)) {
          setTeams((prev) => {
            const updated = prev.map((node) => {
              const remote = data.teams.find((t: any) => t.id === parseInt(node.id) || t.name === node.name)
              if (remote) {
                return {
                  ...node,
                  score: remote.score,
                  rank: remote.rank,
                  status: remote.status,
                }
              }
              return node
            })
            return updated.sort((a, b) => a.rank - b.rank)
          })
        }

        // Process any incoming attacks
        if (data.attacks && Array.isArray(data.attacks)) {
          for (const atk of data.attacks) {
            if (!processedAttackIds.current.has(atk.id)) {
              processedAttackIds.current.add(atk.id)

              const attackerNode = FINALIST_TEAMS.find((t) => parseInt(t.id) === atk.attackerId) || FINALIST_TEAMS[0]
              const victimNode = FINALIST_TEAMS.find((t) => parseInt(t.id) === atk.victimId) || FINALIST_TEAMS[1]

              // Parabolic trajectory arc calculation
              const x1 = attackerNode.x * 10.24
              const y1 = attackerNode.y * 5.71
              const x2 = victimNode.x * 10.24
              const y2 = victimNode.y * 5.71

              const midX = (x1 + x2) / 2
              const dist = Math.hypot(x2 - x1, y2 - y1)
              const arcElevation = Math.max(60, Math.min(150, dist * 0.35))
              const midY = Math.min(y1, y2) - arcElevation
              const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`

              const newAttackEvent: AttackEvent = {
                id: atk.id,
                time: atk.time,
                service: atk.service,
                attacker: attackerNode,
                victim: victimNode,
                pathD,
                color: atk.color || '#fab005',
              }

              setActiveAttacks((prev) => [...prev.slice(-3), newAttackEvent])
              setActiveAttacker(attackerNode)
              setNukeDetonation(victimNode)

              setActivityLogs((prev) => [
                {
                  time: atk.time,
                  service: atk.service,
                  text: atk.text,
                  isNuke: atk.isNuke,
                },
                ...prev.slice(0, 20),
              ])

              setTimeout(() => {
                setNukeDetonation(null)
                setActiveAttacker(null)
              }, 2500)
            }
          }
        }
      } catch (err) {
        // silent fetch error
      }
    }

    fetchState()
    const interval = setInterval(fetchState, 1500)
    return () => clearInterval(interval)
  }, [])


  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <Box
      ref={containerRef}
      style={{
        backgroundColor: '#050811',
        color: '#e4e5e7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shockwavePulse {
          0% { r: 10px; opacity: 1; stroke-width: 4px; }
          100% { r: 90px; opacity: 0; stroke-width: 1px; }
        }
        @keyframes missileDash {
          to { stroke-dashoffset: -120; }
        }
        @keyframes warheadTravel {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes waterRipple {
          0% { transform: scale(0.98); opacity: 0.6; }
          50% { transform: scale(1.02); opacity: 0.9; }
          100% { transform: scale(0.98); opacity: 0.6; }
        }
        @keyframes nukeHazardFlash {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.92); }
        }
      `}</style>

      {/* Top Header Bar */}
      <Box
        px="lg"
        py="xs"
        style={{
          borderBottom: '1px solid #162422',
          backgroundColor: '#0a1012',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          zIndex: 10,
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Stack gap={1}>
              <Text
                size="11px"
                ff="monospace"
                c="#627874"
                fw={700}
                style={{ letterSpacing: '0.08em' }}
              >
                ATTACK & DEFENSE · PUBLIC VIEW
              </Text>
              <Title order={3} c="#ffffff" fw={800} style={{ letterSpacing: '-0.01em' }}>
                Warm Up Final
              </Title>
            </Stack>
          </Group>

          <Group gap="md" align="center">
            {/* Arena Pill Badge */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #1a332d',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#0a1514',
              }}
            >
              <Box
                px={10}
                py={4}
                style={{
                  backgroundColor: '#16332c',
                  color: '#20c997',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Arena
              </Box>
              <Box
                px={12}
                py={4}
                style={{
                  color: '#e2e8f0',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Zero Arena
              </Box>
            </Box>

            {/* Divider */}
            <Box w="1px" h={26} bg="#1a2725" />

            {/* ROUND */}
            <Stack gap={0} align="flex-start">
              <Text size="9px" ff="monospace" c="#627874" fw={700} style={{ letterSpacing: '0.05em' }}>
                ROUND
              </Text>
              <Text size="15px" ff="monospace" c="#ffffff" fw={800} lh={1.2}>
                {round}
              </Text>
            </Stack>

            {/* Divider */}
            <Box w="1px" h={26} bg="#1a2725" />

            {/* TICK */}
            <Stack gap={0} align="flex-start">
              <Text size="9px" ff="monospace" c="#627874" fw={700} style={{ letterSpacing: '0.05em' }}>
                TICK
              </Text>
              <Group gap={3} align="baseline" style={{ lineHeight: 1.2 }}>
                <Text size="15px" ff="monospace" c="#ffffff" fw={800}>
                  0{tick}
                </Text>
                <Text size="11px" ff="monospace" c="#627874" fw={600}>
                  / 5
                </Text>
              </Group>
            </Stack>

            {/* Divider */}
            <Box w="1px" h={26} bg="#1a2725" />

            {/* NEXT TICK */}
            <Stack gap={0} align="flex-start">
              <Text size="9px" ff="monospace" c="#627874" fw={700} style={{ letterSpacing: '0.05em' }}>
                NEXT TICK
              </Text>
              <Text size="15px" ff="monospace" c="#20c997" fw={800} lh={1.2}>
                {formatCountdown(secondsLeft)}
              </Text>
            </Stack>

            {/* Fullscreen Button */}
            <ActionIcon
              variant="default"
              size="md"
              radius="sm"
              onClick={toggleFullscreen}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #1c2826',
                color: '#829490',
                marginLeft: '6px',
              }}
            >
              <Icon path={isFullscreen ? mdiFullscreenExit : mdiFullscreen} size={0.85} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* Main Area: Archipelago Map Canvas & Sidebar */}
      <Box style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Ocean Tactical Map with Provided Islands Background */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#071616',
            backgroundImage: `url('/islands-map.jpg')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
          }}
        >
          {/* Tactical Military HUD Overlays */}
          <Box
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(5, 16, 16, 0.75)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(32, 201, 151, 0.3)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Box
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#20c997',
                boxShadow: '0 0 12px #20c997',
              }}
            />
            <Text size="11px" fw={800} c="#20c997" ff="monospace" style={{ letterSpacing: '0.1em' }}>
              TACTICAL RADAR · 10 ARCHIPELAGO ATOLLS ONLINE
            </Text>
          </Box>

          {/* Coordinate Watermarks */}
          <Text
            size="10px"
            ff="monospace"
            c="rgba(100, 200, 180, 0.45)"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              zIndex: 1,
              backgroundColor: 'rgba(5, 16, 16, 0.65)',
              padding: '4px 10px',
              borderRadius: '6px',
              backdropFilter: 'blur(4px)',
            }}
          >
            GRID: LAT 07°15'S / LON 112°45'E · IONIC ATOLLS WARZONE · JAVA DEEP SEA
          </Text>

          {/* MASTER SVG CANVAS: Radar, Ballistic Missile Arcs, and Nuclear Detonations */}
          <svg
            viewBox="0 0 1024 571"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <defs>
              {/* Nuclear Shockwave Glow Filter */}
              <filter id="nuke-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Missile Plasma Arc Glow */}
              <filter id="plasma-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Sonar Rings */}
            <circle cx="512" cy="285" r="240" fill="none" stroke="rgba(32, 201, 151, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="512" cy="285" r="380" fill="none" stroke="rgba(32, 201, 151, 0.05)" strokeWidth="1" />

            {/* RENDER NUCLEAR SHOCKWAVES & TARGET CROSSHAIRS */}
            {teams.map((team) => {
              const cx = team.x * 10.24
              const cy = team.y * 5.71
              const isDetonating = nukeDetonation?.id === team.id
              const isSelected = selectedTeam.id === team.id

              return (
                <g key={`island-fx-${team.id}`} transform={`translate(${cx}, ${cy})`}>
                  {/* Subtle Tactical Crosshair / Degree Marks */}
                  <g opacity="0.35">
                    <line x1="-36" y1="0" x2="-30" y2="0" stroke="#38d9a9" strokeWidth="1.5" />
                    <line x1="30" y1="0" x2="36" y2="0" stroke="#38d9a9" strokeWidth="1.5" />
                    <line x1="0" y1="-36" x2="0" y2="-30" stroke="#38d9a9" strokeWidth="1.5" />
                    <line x1="0" y1="30" x2="0" y2="36" stroke="#38d9a9" strokeWidth="1.5" />
                  </g>

                  {/* Selected Island Ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="32"
                      fill="none"
                      stroke="#20c997"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  )}

                  {/* Nuclear Impact Shockwave Explosion Animation */}
                  {isDetonating && (
                    <g>
                      <circle
                        cx="0"
                        cy="0"
                        fill="none"
                        stroke="#ff6b6b"
                        filter="url(#nuke-glow)"
                        style={{ animation: 'shockwavePulse 1.2s infinite' }}
                      />
                      <circle
                        cx="0"
                        cy="0"
                        fill="none"
                        stroke="#ffa94d"
                        filter="url(#nuke-glow)"
                        style={{ animation: 'shockwavePulse 1.2s 0.3s infinite' }}
                      />
                      <circle cx="0" cy="0" r="22" fill="rgba(255, 107, 107, 0.55)" filter="url(#nuke-glow)" />
                    </g>
                  )}
                </g>
              )
            })}

            {/* PARABOLIC BALLISTIC MISSILE TRAJECTORIES */}
            {activeAttacks.map((atk) => (
              <g key={atk.id}>
                {/* Missile Outer Flame Trail */}
                <path
                  d={atk.pathD}
                  fill="none"
                  stroke={atk.color}
                  strokeWidth="3.5"
                  opacity="0.85"
                  filter="url(#plasma-glow)"
                  strokeDasharray="16 8"
                  style={{ animation: 'missileDash 0.8s linear infinite' }}
                />

                {/* Missile Core Ray */}
                <path
                  d={atk.pathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.95"
                />

                {/* Nuclear Missile Warhead */}
                <circle
                  cx={atk.victim.x * 10.24}
                  cy={atk.victim.y * 5.71}
                  r="6"
                  fill="#ff6b6b"
                  filter="url(#nuke-glow)"
                />
              </g>
            ))}
          </svg>

          {/* HTML TEAM FORTRESS NODES OVERLAY (Avatars & Interaction) */}
          {teams.map((team) => {
            const isAttacking = activeAttacker?.id === team.id
            const isDetonating = nukeDetonation?.id === team.id
            const isSelected = selectedTeam.id === team.id

            let ringColor = 'rgba(32, 201, 151, 0.4)'
            let ringGlow = '0 0 10px rgba(0,0,0,0.8)'

            if (isDetonating) {
              ringColor = '#ff6b6b'
              ringGlow = '0 0 0 4px #ff6b6b, 0 0 26px rgba(255, 107, 107, 0.95)'
            } else if (isAttacking) {
              ringColor = '#20c997'
              ringGlow = '0 0 0 4px #20c997, 0 0 24px rgba(32, 201, 151, 0.9)'
            } else if (isSelected) {
              ringColor = '#38d9a9'
              ringGlow = '0 0 0 3px #38d9a9, 0 0 18px rgba(56, 217, 169, 0.7)'
            }

            return (
              <Box
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                style={{
                  position: 'absolute',
                  left: `${team.x}%`,
                  top: `${team.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Tooltip
                  multiline
                  withArrow
                  transitionProps={{ duration: 150 }}
                  label={
                    <Stack gap={2} p={2}>
                      <Group gap={4}>
                        <Icon path={mdiCrosshairsGps} size={0.6} color="#38d9a9" />
                        <Text fw={800} size="sm" c="white">{team.islandName}</Text>
                      </Group>
                      <Text size="xs" fw={700} c="#ffffff">{team.name}</Text>
                      <Text size="xs" c="#94a3b8">{team.school}</Text>
                      <Text size="xs" fw={700} c="#20c997">
                        Rank #{team.rank} • {team.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })} pts
                      </Text>
                      <Text size="10px" c="#64748b">
                        Silo: {team.teamCode} • Status: {team.status}
                      </Text>
                    </Stack>
                  }
                >
                  <Stack align="center" gap={3}>
                    {/* Fortress Circular Bunker Logo */}
                    <Box
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#0a1414',
                        border: `2px solid ${ringColor}`,
                        boxShadow: ringGlow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '5px',
                        transition: 'all 0.25s ease',
                        transform: isDetonating ? 'scale(1.2)' : isAttacking || isSelected ? 'scale(1.12)' : 'scale(1)',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={team.logo}
                        alt={team.name}
                        w="100%"
                        h="100%"
                        fit="contain"
                        fallbackSrc="/favicon.webp"
                        style={{ borderRadius: '50%' }}
                      />

                      {/* Nuclear Impact Hazard Icon */}
                      {isDetonating && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            backgroundColor: '#ff6b6b',
                            borderRadius: '50%',
                            padding: '3px',
                            boxShadow: '0 0 12px #ff6b6b',
                          }}
                        >
                          <Icon path={mdiNuke} size={0.6} color="#ffffff" />
                        </Box>
                      )}
                    </Box>

                    {/* Team Name Label */}
                    <Box
                      style={{
                        backgroundColor: 'rgba(5, 15, 15, 0.75)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        border: '1px solid rgba(32, 201, 151, 0.25)',
                        backdropFilter: 'blur(4px)',
                        maxWidth: '130px',
                      }}
                    >
                      <Text
                        size="11px"
                        c="#ffffff"
                        fw={800}
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textShadow: '0 2px 6px #000',
                        }}
                      >
                        {team.name}
                      </Text>
                    </Box>
                  </Stack>
                </Tooltip>
              </Box>
            )
          })}

          {/* Bottom Right Selected Island Base Info Card removed in favor of sidebar card */}
        </Box>

        {/* Right Sidebar: OFFICIAL SCORES (Top 10 Finalis) */}
        <Box
          w="380px"
          style={{
            backgroundColor: '#0b1413',
            borderLeft: '1px solid #142521',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <Box px="md" py="sm" style={{ borderBottom: '1px solid #142521' }}>
            <Group justify="space-between" align="center">
              <Text size="11px" ff="monospace" c="#627874" fw={700} style={{ letterSpacing: '0.08em' }}>
                OFFICIAL SCORES
              </Text>
              <Text size="11px" ff="monospace" c="#627874" fw={700}>
                10 TEAMS
              </Text>
            </Group>
            <Title order={3} c="#ffffff" fw={800} mt={3}>
              Top 10
            </Title>
          </Box>

          {/* List of top 10 teams - stretches vertically to fill the entire sidebar height */}
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {[...teams].sort((a, b) => b.score - a.score).map((t, idx) => {
              const rankNum = idx + 1
              const isSelected = selectedTeam.id === t.id
              return (
                <Group
                  key={t.id}
                  justify="space-between"
                  px="md"
                  onClick={() => setSelectedTeam(t)}
                  style={{
                    flex: 1,
                    minHeight: '54px',
                    backgroundColor: isSelected ? 'rgba(32, 201, 151, 0.16)' : 'transparent',
                    borderBottom: '1px solid #142521',
                    borderLeft: isSelected ? '4px solid #20c997' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      size="sm"
                      ff="monospace"
                      fw={800}
                      c={rankNum === 1 ? '#fab005' : '#839290'}
                      style={{ width: '26px' }}
                    >
                      {rankNum < 10 ? `0${rankNum}` : rankNum}
                    </Text>
                    <Box
                      w={42}
                      h={42}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: '#0a1414',
                        border: '1px solid #1a332d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3px',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={t.logo} alt={t.name} w={34} h={34} fit="contain" fallbackSrc="/favicon.webp" />
                    </Box>
                    <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                      <Text
                        size="sm"
                        fw={800}
                        c="white"
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {t.name}
                      </Text>
                      <Group gap={6}>
                        <Icon
                          path={mdiCircle}
                          size={0.25}
                          color={t.status === 'Operational' ? '#20c997' : '#fab005'}
                        />
                        <Text
                          size="11px"
                          c="#6b7c78"
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {t.teamCode} · {t.status}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Text size="sm" ff="monospace" fw={800} c="#ffffff" style={{ flexShrink: 0 }}>
                    {t.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </Text>
                </Group>
              )
            })}
          </Box>

          {/* Bottom Card for Selected Team matching user reference */}
          <Box
            p="sm"
            style={{
              borderTop: '1px solid #142521',
              backgroundColor: '#091211',
            }}
          >
            <Box
              p="sm"
              style={{
                backgroundColor: '#0d1c19',
                border: '1px solid #1a362f',
                borderRadius: '8px',
              }}
            >
              <Text size="sm" fw={800} c="white">
                {selectedTeam.name}
              </Text>
              <Text size="11px" c="#627874" mt={2} ff="monospace">
                #{selectedTeam.rank} · {selectedTeam.school} · {selectedTeam.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} points
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Ticker: LIVE ACTIVITY matching exact user reference image */}
      <Box
        style={{
          borderTop: '1px solid #142521',
          backgroundColor: '#091010',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          height: '62px',
        }}
      >
        {/* Left Green Label */}
        <Box
          px="lg"
          style={{
            borderRight: '1px solid #142521',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0a1514',
            flexShrink: 0,
            gap: '8px',
          }}
        >
          <Box
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#20c997',
              boxShadow: '0 0 10px #20c997',
            }}
          />
          <Text
            size="12px"
            ff="monospace"
            fw={900}
            c="#20c997"
            style={{ letterSpacing: '0.12em', whiteSpace: 'nowrap' }}
          >
            LIVE ACTIVITY
          </Text>
        </Box>

        {/* Events Scroller */}
        <Box
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            flex: 1,
            alignItems: 'center',
          }}
        >
          {activityLogs.map((log, i) => (
            <Box
              key={i}
              px="lg"
              py={6}
              style={{
                borderRight: '1px solid #142521',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Text size="11px" c="#788e8a" ff="monospace" fw={600}>
                {log.time} · {log.service}
              </Text>
              <Text size="13px" fw={800} c={log.isMumble ? '#fab005' : '#ffffff'}>
                {log.text.includes('(Flag captured!)') ? (
                  <>
                    {log.text.replace(' (Flag captured!)', '')}{' '}
                    <Text span c="#20c997" fw={900}>
                      (Flag captured!)
                    </Text>
                  </>
                ) : (
                  log.text
                )}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
