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
  mdiRadioactive,
  mdiRocketLaunch,
  mdiShieldAlert,
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
    islandName: 'Shell Bastion',
    sector: 'SECTOR-01',
    x: 14,
    y: 22,
    color: '#38d9a9',
    islandPath: 'M -52,-18 C -58,-48 -18,-62 14,-54 C 48,-46 64,-18 56,18 C 48,50 16,62 -18,56 C -48,50 -46,12 -52,-18 Z',
    reefPath: 'M -65,-22 C -72,-60 -22,-78 18,-68 C 60,-58 80,-22 70,22 C 60,62 20,78 -22,70 C -60,62 -58,15 -65,-22 Z',
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
    islandName: 'Sanctum Isle',
    sector: 'SECTOR-02',
    x: 32,
    y: 32,
    color: '#20c997',
    islandPath: 'M -46,-24 C -54,-52 -10,-60 24,-52 C 58,-44 62,-8 50,26 C 38,60 -2,64 -32,52 C -62,40 -38,4 -46,-24 Z',
    reefPath: 'M -58,-30 C -68,-65 -12,-75 30,-65 C 72,-55 78,-10 62,32 C 48,75 -2,80 -40,65 C -78,50 -48,5 -58,-30 Z',
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
    islandName: 'WilSec Atoll',
    sector: 'SECTOR-03',
    x: 50,
    y: 20,
    color: '#fab005',
    islandPath: 'M -56,-14 C -60,-44 -26,-58 6,-56 C 38,-54 58,-28 54,12 C 50,52 24,62 -12,58 C -48,54 -52,16 -56,-14 Z',
    reefPath: 'M -70,-18 C -75,-55 -32,-72 8,-70 C 48,-68 72,-35 68,15 C 62,65 30,78 -15,72 C -60,68 -65,20 -70,-18 Z',
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
    islandName: 'Jember Citadel',
    sector: 'SECTOR-04',
    x: 68,
    y: 30,
    color: '#ff922b',
    islandPath: 'M -48,-28 C -52,-56 -12,-62 20,-50 C 52,-38 60,-4 52,28 C 44,60 4,64 -28,54 C -60,44 -44,0 -48,-28 Z',
    reefPath: 'M -60,-35 C -65,-70 -15,-78 25,-62 C 65,-48 75,-5 65,35 C 55,75 5,80 -35,68 C -75,55 -55,0 -60,-35 Z',
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
    islandName: 'Boedoet Outpost',
    sector: 'SECTOR-05',
    x: 86,
    y: 22,
    color: '#ff6b6b',
    islandPath: 'M -50,-16 C -54,-48 -16,-60 18,-52 C 52,-44 60,-12 52,22 C 44,56 12,62 -22,54 C -56,46 -46,16 -50,-16 Z',
    reefPath: 'M -62,-20 C -68,-60 -20,-75 22,-65 C 65,-55 75,-15 65,28 C 55,70 15,78 -28,68 C -70,58 -58,20 -62,-20 Z',
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
    islandName: 'Magfi Archipelago',
    sector: 'SECTOR-06',
    x: 14,
    y: 72,
    color: '#da77f2',
    islandPath: 'M -54,-12 C -58,-44 -20,-56 12,-52 C 44,-48 58,-22 52,16 C 46,54 18,60 -16,56 C -50,52 -50,20 -54,-12 Z',
    reefPath: 'M -68,-15 C -72,-55 -25,-70 15,-65 C 55,-60 72,-28 65,20 C 58,68 22,75 -20,70 C -62,65 -62,25 -68,-15 Z',
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
    islandName: 'Z3RO Fortress',
    sector: 'SECTOR-07',
    x: 32,
    y: 64,
    color: '#20c997',
    islandPath: 'M -52,-22 C -60,-50 -14,-62 20,-54 C 54,-46 62,-10 52,24 C 42,58 2,64 -26,56 C -54,48 -44,6 -52,-22 Z',
    reefPath: 'M -65,-28 C -75,-62 -18,-78 25,-68 C 68,-58 78,-12 65,30 C 52,72 2,80 -32,70 C -68,60 -55,8 -65,-28 Z',
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
    islandName: 'Gargantua Rock',
    sector: 'SECTOR-08',
    x: 50,
    y: 76,
    color: '#fcc419',
    islandPath: 'M -48,-18 C -54,-48 -18,-58 16,-52 C 50,-46 58,-14 52,20 C 46,54 10,60 -20,54 C -50,48 -42,12 -48,-18 Z',
    reefPath: 'M -60,-22 C -68,-60 -22,-72 20,-65 C 62,-58 72,-18 65,25 C 58,68 12,75 -25,68 C -62,60 -52,15 -60,-22 Z',
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
    islandName: 'WilSec Command',
    sector: 'SECTOR-09',
    x: 68,
    y: 66,
    color: '#ff6b6b',
    islandPath: 'M -52,-20 C -58,-50 -16,-60 18,-54 C 52,-48 60,-16 52,18 C 44,52 8,62 -22,54 C -52,46 -46,10 -52,-20 Z',
    reefPath: 'M -65,-25 C -72,-62 -20,-75 22,-68 C 65,-60 75,-20 65,22 C 55,65 10,78 -28,68 C -65,58 -58,12 -65,-25 Z',
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
    islandName: 'Maskumambang Isle',
    sector: 'SECTOR-10',
    x: 86,
    y: 74,
    color: '#339af0',
    islandPath: 'M -50,-16 C -54,-48 -14,-58 18,-52 C 50,-46 58,-16 52,18 C 46,52 14,60 -18,54 C -50,48 -46,16 -50,-16 Z',
    reefPath: 'M -62,-20 C -68,-60 -18,-72 22,-65 C 62,-58 72,-20 65,22 C 58,65 18,75 -22,68 C -62,60 -58,20 -62,-20 Z',
  },
]

export const AttackMap: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [round, setRound] = useState(19)
  const [tick, setTick] = useState(2)
  const [secondsLeft, setSecondsLeft] = useState(22)
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamNode>(FINALIST_TEAMS[6]) // Default Z3RODAY
  const [nukeDetonation, setNukeDetonation] = useState<TeamNode | null>(null)
  const [activeAttacker, setActiveAttacker] = useState<TeamNode | null>(null)

  const [activityLogs, setActivityLogs] = useState<
    { time: string; service: string; text: string; isNuke?: boolean }[]
  >([
    {
      time: '11:21:42',
      service: 'ICBM-PWN',
      text: 'Z3RODAY launched ICBM at WilSec - BOEDOET 47 [DIRECT HIT]',
      isNuke: true,
    },
    {
      time: '11:21:38',
      service: 'TORPEDO-WEB',
      text: 'United Shell-SCC struck Gangantua Rock [SHIELD DOWN]',
      isNuke: false,
    },
    {
      time: '11:21:30',
      service: 'BALLISTIC-CRYPTO',
      text: 'rootsanctum launched warhead at Maaf TKA Pilih CTF [DETONATED]',
      isNuke: true,
    },
    {
      time: '11:21:22',
      service: 'ICBM-PWN',
      text: 'WilSec - Apa aja fired missile at Duo Perncari Flag [INTERCEPTED]',
      isNuke: false,
    },
  ])

  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Next Tick countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTick((t) => (t >= 5 ? 1 : t + 1))
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Ballistic Nuclear Missile Strike Generator
  useEffect(() => {
    const interval = setInterval(() => {
      const attackerIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      let victimIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      while (victimIdx === attackerIdx) {
        victimIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      }

      const attacker = FINALIST_TEAMS[attackerIdx]
      const victim = FINALIST_TEAMS[victimIdx]

      // Parabolic ballistic trajectory arc calculation
      const x1 = attacker.x * 10
      const y1 = attacker.y * 6.5
      const x2 = victim.x * 10
      const y2 = victim.y * 6.5

      const midX = (x1 + x2) / 2
      const dist = Math.hypot(x2 - x1, y2 - y1)
      const arcElevation = Math.max(70, Math.min(160, dist * 0.35))
      const midY = Math.min(y1, y2) - arcElevation

      const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`

      const services = ['ICBM-PWN', 'BALLISTIC-WEB', 'CRUISE-CRYPTO', 'TACTICAL-NUKE']
      const service = services[Math.floor(Math.random() * services.length)]
      const colors = ['#ff6b6b', '#ff922b', '#20c997', '#339af0', '#fab005']
      const color = colors[Math.floor(Math.random() * colors.length)]

      const attack: AttackEvent = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        service,
        attacker,
        victim,
        pathD,
        color,
      }

      setActiveAttacker(attacker)
      setNukeDetonation(victim)

      setActiveAttacks((prev) => [...prev.slice(-3), attack])
      setActivityLogs((prev) => [
        {
          time: attack.time,
          service: attack.service,
          text: `${attacker.name} ➔ ${victim.name} [NUCLEAR DETONATION]`,
          isNuke: true,
        },
        ...prev.slice(0, 15),
      ])

      // Clear detonation effect after 2s
      setTimeout(() => {
        setNukeDetonation(null)
      }, 2000)
    }, 2800)

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
        py="sm"
        style={{
          borderBottom: '1px solid #142033',
          backgroundColor: '#080d1a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          zIndex: 10,
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Stack gap={2}>
              <Group gap="xs">
                <Icon path={mdiRadioactive} size={0.7} color="#ff6b6b" />
                <Text
                  size="11px"
                  ff="monospace"
                  c="#ff6b6b"
                  fw={800}
                  style={{ letterSpacing: '0.1em', animation: 'nukeHazardFlash 1.5s infinite' }}
                >
                  DEFCON 1 · NUCLEAR ARCHIPELAGO WARFARE
                </Text>
              </Group>
              <Title order={3} c="#ffffff" fw={900} style={{ letterSpacing: '-0.02em' }}>
                IONIC 2026 · Tactical Island Arena
              </Title>
            </Stack>

            <Group gap="xs">
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: 'rgba(32, 201, 151, 0.08)',
                  borderColor: 'rgba(32, 201, 151, 0.35)',
                  color: '#20c997',
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                THEATER&nbsp;&nbsp;<Text span c="white" fw={800}>Java Sea Islands</Text>
              </Badge>
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                ROUND&nbsp;&nbsp;<Text span c="white" fw={700}>{round}</Text>
              </Badge>
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                TICK&nbsp;&nbsp;<Text span c="#20c997" fw={700}>0{tick}</Text>&nbsp;/ 5
              </Badge>
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                NEXT STRIKE TICK&nbsp;&nbsp;
                <Text span c="#20c997" fw={800} ff="monospace">
                  {formatCountdown(secondsLeft)}
                </Text>
              </Badge>
            </Group>
          </Group>

          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={toggleFullscreen}
            style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8' }}
          >
            <Icon path={isFullscreen ? mdiFullscreenExit : mdiFullscreen} size={1} />
          </ActionIcon>
        </Group>
      </Box>

      {/* Main Area: Archipelago Map Canvas & Sidebar */}
      <Box style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Ocean Tactical Map */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#050a14',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(14, 52, 68, 0.25) 0%, transparent 80%),
              linear-gradient(rgba(30, 60, 85, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30, 60, 85, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 64px 64px, 64px 64px',
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
              TACTICAL RADAR · ONLINE (10 ATOLLS DETECTED)
            </Text>
          </Box>

          {/* Coordinate Watermarks */}
          <Text
            size="10px"
            ff="monospace"
            c="rgba(100, 140, 180, 0.3)"
            style={{ position: 'absolute', bottom: '16px', left: '20px', zIndex: 1 }}
          >
            GRID: LAT 07°15'S / LON 112°45'E · DEPTH: -3,240m · JAVA PACIFIC TRENCH
          </Text>

          {/* MASTER SVG CANVAS: Islands, Radar, Ballistic Missile Arcs, and Nuclear Detonations */}
          <svg
            viewBox="0 0 1000 650"
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

              {/* Island Land Gradient */}
              <linearGradient id="island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1b2a38" />
                <stop offset="60%" stopColor="#121d27" />
                <stop offset="100%" stopColor="#0c141d" />
              </linearGradient>

              {/* Island Coastal Reef Water Gradient */}
              <radialGradient id="reef-grad" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stopColor="rgba(26, 92, 90, 0.45)" />
                <stop offset="80%" stopColor="rgba(18, 64, 78, 0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Ocean Sonar Rings */}
            <circle cx="500" cy="325" r="280" fill="none" stroke="rgba(40, 90, 120, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="500" cy="325" r="420" fill="none" stroke="rgba(40, 90, 120, 0.06)" strokeWidth="1" />

            {/* RENDER ISLANDS FOR EACH TEAM */}
            {FINALIST_TEAMS.map((team) => {
              const cx = team.x * 10
              const cy = team.y * 6.5
              const isDetonating = nukeDetonation?.id === team.id
              const isAttacking = activeAttacker?.id === team.id
              const isSelected = selectedTeam.id === team.id

              return (
                <g key={`island-${team.id}`} transform={`translate(${cx}, ${cy})`}>
                  {/* Island Shallow Water Reef Glow */}
                  <path
                    d={team.reefPath}
                    fill="url(#reef-grad)"
                    stroke="rgba(32, 201, 151, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    style={{ animation: 'waterRipple 4s infinite ease-in-out' }}
                  />

                  {/* Island Landmass Contour */}
                  <path
                    d={team.islandPath}
                    fill="url(#island-grad)"
                    stroke={
                      isDetonating
                        ? '#ff6b6b'
                        : isAttacking
                        ? '#20c997'
                        : isSelected
                        ? '#38d9a9'
                        : '#233748'
                    }
                    strokeWidth={isDetonating ? '3' : isSelected ? '2.5' : '1.5'}
                    filter={isDetonating ? 'url(#nuke-glow)' : undefined}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Topographical Elevation Rings */}
                  <circle cx="0" cy="0" r="38" fill="none" stroke="rgba(60, 110, 140, 0.25)" strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx="0" cy="0" r="46" fill="none" stroke="rgba(60, 110, 140, 0.15)" strokeWidth="1" />

                  {/* Island Sector Name Banner in Ocean */}
                  <text
                    x="0"
                    y="58"
                    textAnchor="middle"
                    fill="#7593af"
                    fontSize="9px"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="0.08em"
                  >
                    {team.sector} · {team.islandName}
                  </text>

                  {/* Tactical Crosshair / Radar Degree Ring */}
                  <g opacity="0.4">
                    <line x1="-50" y1="0" x2="-44" y2="0" stroke="#4a7090" strokeWidth="1" />
                    <line x1="44" y1="0" x2="50" y2="0" stroke="#4a7090" strokeWidth="1" />
                    <line x1="0" y1="-50" x2="0" y2="-44" stroke="#4a7090" strokeWidth="1" />
                    <line x1="0" y1="44" x2="0" y2="50" stroke="#4a7090" strokeWidth="1" />
                  </g>

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
                      <circle cx="0" cy="0" r="16" fill="rgba(255, 107, 107, 0.6)" filter="url(#nuke-glow)" />
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
                  opacity="0.8"
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
                  cx={atk.victim.x * 10}
                  cy={atk.victim.y * 6.5}
                  r="6"
                  fill="#ff6b6b"
                  filter="url(#nuke-glow)"
                />
              </g>
            ))}
          </svg>

          {/* HTML TEAM FORTRESS NODES OVERLAY (Avatars & Interaction) */}
          {FINALIST_TEAMS.map((team) => {
            const isAttacking = activeAttacker?.id === team.id
            const isDetonating = nukeDetonation?.id === team.id
            const isSelected = selectedTeam.id === team.id

            let ringColor = '#1f3448'
            let ringGlow = '0 4px 14px rgba(0,0,0,0.8)'

            if (isDetonating) {
              ringColor = '#ff6b6b'
              ringGlow = '0 0 0 4px #ff6b6b, 0 0 24px rgba(255, 107, 107, 0.9)'
            } else if (isAttacking) {
              ringColor = '#20c997'
              ringGlow = '0 0 0 4px #20c997, 0 0 24px rgba(32, 201, 151, 0.9)'
            } else if (isSelected) {
              ringColor = '#38d9a9'
              ringGlow = '0 0 0 3px #38d9a9, 0 0 16px rgba(56, 217, 169, 0.6)'
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
                        Silo: {team.teamCode} • Island Status: {team.status}
                      </Text>
                    </Stack>
                  }
                >
                  <Stack align="center" gap={4}>
                    {/* Fortress Circular Bunker Logo */}
                    <Box
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: '#0c141e',
                        border: `2px solid ${ringColor}`,
                        boxShadow: ringGlow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        transition: 'all 0.25s ease',
                        transform: isDetonating ? 'scale(1.2)' : isAttacking || isSelected ? 'scale(1.1)' : 'scale(1)',
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
                            top: '-12px',
                            right: '-12px',
                            backgroundColor: '#ff6b6b',
                            borderRadius: '50%',
                            padding: '3px',
                            boxShadow: '0 0 10px #ff6b6b',
                          }}
                        >
                          <Icon path={mdiNuke} size={0.6} color="#ffffff" />
                        </Box>
                      )}
                    </Box>

                    {/* Team Name Label */}
                    <Text
                      size="11px"
                      c="#ffffff"
                      fw={800}
                      style={{
                        maxWidth: '125px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textShadow: '0 2px 6px rgba(0,0,0,1)',
                      }}
                    >
                      {team.name}
                    </Text>
                  </Stack>
                </Tooltip>
              </Box>
            )
          })}

          {/* Bottom Right Selected Island Base Info Card */}
          <Box
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: '#0c1524',
              border: '1px solid #1c2e44',
              borderRadius: '10px',
              padding: '12px 16px',
              zIndex: 5,
              boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
              maxWidth: '350px',
            }}
          >
            <Group gap="sm" wrap="nowrap">
              <Box
                w={44}
                h={44}
                style={{
                  borderRadius: '50%',
                  backgroundColor: '#111d2e',
                  border: '2px solid #284462',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                  flexShrink: 0,
                }}
              >
                <Image src={selectedTeam.logo} alt={selectedTeam.name} w={32} h={32} fit="contain" />
              </Box>
              <Stack gap={1} style={{ overflow: 'hidden' }}>
                <Group gap={6}>
                  <Text size="xs" fw={800} c="#38d9a9" ff="monospace">
                    {selectedTeam.sector}
                  </Text>
                  <Text size="xs" c="dimmed">·</Text>
                  <Text size="xs" fw={700} c="#94a3b8">
                    {selectedTeam.islandName}
                  </Text>
                </Group>
                <Text size="sm" fw={800} c="white" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedTeam.name}
                </Text>
                <Text size="11px" c="#94a3b8" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  #{selectedTeam.rank} · {selectedTeam.school} · {selectedTeam.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })} pts
                </Text>
              </Stack>
            </Group>
          </Box>
        </Box>

        {/* Right Sidebar: OFFICIAL SCORES (Top 10 Finalis) */}
        <Box
          w="360px"
          style={{
            backgroundColor: '#080d1a',
            borderLeft: '1px solid #142033',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <Box p="md" style={{ borderBottom: '1px solid #142033' }}>
            <Group justify="space-between" align="center">
              <Text size="11px" ff="monospace" c="#64748b" fw={700} style={{ letterSpacing: '0.08em' }}>
                WARFARE SCOREBOARD
              </Text>
              <Text size="11px" ff="monospace" c="#64748b" fw={700}>
                10 ATOLLS
              </Text>
            </Group>
            <Title order={3} c="#ffffff" fw={800} mt={4}>
              Top 10 Finalis
            </Title>
          </Box>

          {/* List of top 10 teams */}
          <ScrollArea style={{ flex: 1 }} p="xs">
            <Stack gap={4}>
              {FINALIST_TEAMS.map((t) => {
                const isSelected = selectedTeam.id === t.id
                return (
                  <Group
                    key={t.id}
                    justify="space-between"
                    p="xs"
                    onClick={() => setSelectedTeam(t)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(32, 201, 151, 0.1)' : 'transparent',
                      border: isSelected ? '1px solid rgba(32, 201, 151, 0.35)' : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="xs"
                        ff="monospace"
                        fw={800}
                        c={t.rank === 1 ? '#fab005' : t.rank === 2 ? '#20c997' : '#64748b'}
                        style={{ width: '20px' }}
                      >
                        {t.rank < 10 ? `0${t.rank}` : t.rank}
                      </Text>
                      <Box
                        w={32}
                        h={32}
                        style={{
                          borderRadius: '50%',
                          backgroundColor: '#0c141e',
                          border: '1px solid #1c2e44',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '3px',
                          flexShrink: 0,
                        }}
                      >
                        <Image src={t.logo} alt={t.name} w={24} h={24} fit="contain" fallbackSrc="/favicon.webp" />
                      </Box>
                      <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                        <Text
                          size="xs"
                          fw={700}
                          c="white"
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {t.name}
                        </Text>
                        <Group gap={4}>
                          <Icon
                            path={mdiCircle}
                            size={0.25}
                            color={t.status === 'Operational' ? '#20c997' : '#fab005'}
                          />
                          <Text
                            size="10px"
                            c="#868e96"
                            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {t.teamCode} · {t.islandName}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>

                    <Text size="xs" ff="monospace" fw={800} c="#ffffff" style={{ flexShrink: 0 }}>
                      {t.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                    </Text>
                  </Group>
                )
              })}
            </Stack>
          </ScrollArea>
        </Box>
      </Box>

      {/* Bottom Ticker: LIVE MISSILE ACTIVITY */}
      <Box
        px="md"
        py="xs"
        style={{
          borderTop: '1px solid #142033',
          backgroundColor: '#060a14',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Badge
          color="red"
          variant="filled"
          size="sm"
          radius="xs"
          style={{
            flexShrink: 0,
            backgroundColor: '#ff6b6b',
            color: '#000000',
            fontWeight: 900,
            letterSpacing: '0.05em',
          }}
        >
          ICBM RADAR
        </Badge>
        <Box
          style={{
            display: 'flex',
            gap: '28px',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
          }}
        >
          {activityLogs.map((log, i) => (
            <Group key={i} gap="xs" style={{ flexShrink: 0 }}>
              <Text size="xs" c="#64748b" ff="monospace">
                {log.time} · {log.service}
              </Text>
              <Text size="xs" fw={700} c={log.isNuke ? '#ffa8a8' : '#81a6f8'}>
                {log.text}
              </Text>
            </Group>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
