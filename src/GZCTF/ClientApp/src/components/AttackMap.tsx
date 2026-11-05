import {
  ActionIcon,
  Avatar,
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
  mdiFullscreen,
  mdiFullscreenExit,
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
  x: number // percentage 0-100
  y: number // percentage 0-100
  color: string
}

export interface AttackEvent {
  id: string
  time: string
  service: string
  attacker: string
  victim: string
  attackerX: number
  attackerY: number
  victimX: number
  victimY: number
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
    x: 15,
    y: 28,
    color: '#339af0',
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
    x: 32,
    y: 28,
    color: '#20c997',
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
    x: 50,
    y: 28,
    color: '#fab005',
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
    x: 68,
    y: 28,
    color: '#ff922b',
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
    x: 85,
    y: 28,
    color: '#ff6b6b',
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
    x: 15,
    y: 68,
    color: '#845ef7',
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
    x: 32,
    y: 68,
    color: '#20c997',
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
    x: 50,
    y: 68,
    color: '#fcc419',
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
    x: 68,
    y: 68,
    color: '#ff6b6b',
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
    x: 85,
    y: 68,
    color: '#339af0',
  },
]

export const AttackMap: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [round, setRound] = useState(26)
  const [tick, setTick] = useState(1)
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([])
  const [activityLogs, setActivityLogs] = useState<
    { time: string; service: string; text: string }[]
  >([
    { time: '11.34.33', service: 'simple-pwn', text: 'Z3RODAY → WilSec - BOEDOET 47' },
    { time: '11.34.30', service: 'simple-web', text: 'United Shell-SCC → Gangantua' },
    { time: '11.34.25', service: 'simple-crypto', text: 'rootsanctum → Maaf TKA Pilih CTF' },
    { time: '11.34.18', service: 'simple-pwn', text: 'WilSec - Apa aja → Duo Perncari Flag' },
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

  // Laser attack animation generator
  useEffect(() => {
    const interval = setInterval(() => {
      const attacker = FINALIST_TEAMS[Math.floor(Math.random() * FINALIST_TEAMS.length)]
      const victim = FINALIST_TEAMS[Math.floor(Math.random() * FINALIST_TEAMS.length)]
      if (attacker.id === victim.id) return

      const services = ['simple-pwn', 'simple-web', 'simple-crypto']
      const service = services[Math.floor(Math.random() * services.length)]
      const colors = ['#ff922b', '#ff6b6b', '#20c997', '#339af0', '#fab005']
      const color = colors[Math.floor(Math.random() * colors.length)]

      const attack: AttackEvent = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('id-ID'),
        service,
        attacker: attacker.name,
        victim: victim.name,
        attackerX: attacker.x,
        attackerY: attacker.y,
        victimX: victim.x,
        victimY: victim.y,
        color,
      }

      setActiveAttacks((prev) => [...prev.slice(-6), attack])
      setActivityLogs((prev) => [
        { time: attack.time, service: attack.service, text: `${attacker.name} → ${victim.name}` },
        ...prev.slice(0, 15),
      ])
    }, 2200)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box
      ref={containerRef}
      style={{
        backgroundColor: '#0c0d10',
        color: '#e4e5e7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Header Bar */}
      <Box
        px="lg"
        py="sm"
        style={{
          borderBottom: '1px solid #1f2127',
          backgroundColor: '#111216',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Stack gap={2}>
              <Text size="xs" ff="monospace" c="dimmed" fw={600}>
                ATTACK & DEFENSE · PUBLIC VIEW
              </Text>
              <Title order={3} c="white" fw={800}>
                Final Cybersecurity IONIC 2026
              </Title>
            </Stack>

            <Group gap="xs">
              <Badge variant="outline" color="gray" size="lg" radius="sm">
                Arena &nbsp;<Text span c="white" fw={700}>IONIC Arena</Text>
              </Badge>
              <Badge variant="outline" color="gray" size="lg" radius="sm">
                ROUND &nbsp;<Text span c="white" fw={700}>{round}</Text>
              </Badge>
              <Badge variant="outline" color="gray" size="lg" radius="sm">
                TICK &nbsp;<Text span c="teal" fw={700}>0{tick}</Text>&nbsp;/ 5
              </Badge>
              <Badge variant="outline" color="gray" size="lg" radius="sm">
                NEXT TICK &nbsp;<Text span c="teal" fw={600}>Awaiting next tick</Text>
              </Badge>
            </Group>
          </Group>

          <ActionIcon
            variant="default"
            size="lg"
            radius="sm"
            onClick={toggleFullscreen}
            style={{ backgroundColor: '#1a1b20', border: '1px solid #2e3036' }}
          >
            <Icon path={isFullscreen ? mdiFullscreenExit : mdiFullscreen} size={1} />
          </ActionIcon>
        </Group>
      </Box>

      {/* Main Area: Grid Canvas & Sidebar */}
      <Box style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Attack Map Canvas Area */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#0c0d10',
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(20, 80, 70, 0.18) 0%, transparent 75%), linear-gradient(#14161c 1px, transparent 1px), linear-gradient(90deg, #14161c 1px, transparent 1px)',
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
            overflow: 'hidden',
          }}
        >
          {/* SVG Lasers */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <defs>
              <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {activeAttacks.map((atk) => (
              <g key={atk.id}>
                {/* Outer Glow */}
                <line
                  x1={`${atk.attackerX}%`}
                  y1={`${atk.attackerY}%`}
                  x2={`${atk.victimX}%`}
                  y2={`${atk.victimY}%`}
                  stroke={atk.color}
                  strokeWidth="3.5"
                  opacity="0.8"
                  filter="url(#laser-glow)"
                />
                {/* Inner Core */}
                <line
                  x1={`${atk.attackerX}%`}
                  y1={`${atk.attackerY}%`}
                  x2={`${atk.victimX}%`}
                  y2={`${atk.victimY}%`}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.95"
                />
              </g>
            ))}
          </svg>

          {/* Team Nodes on the Map */}
          {FINALIST_TEAMS.map((team) => (
            <Box
              key={team.id}
              style={{
                position: 'absolute',
                left: `${team.x}%`,
                top: `${team.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <Tooltip
                multiline
                label={
                  <Stack gap={2}>
                    <Text fw={700} size="sm">{team.name}</Text>
                    <Text size="xs" c="dimmed">{team.school}</Text>
                    <Text size="xs" fw={600} c="teal">Rank #{team.rank} • {team.score.toLocaleString('id-ID')} pts</Text>
                  </Stack>
                }
              >
                <Stack align="center" gap={6}>
                  <Box
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: '#191b22',
                      border: `2px solid ${team.rank <= 3 ? '#fab005' : team.id === '7' ? '#20c997' : '#2b2d38'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      boxShadow: team.id === '7' ? '0 0 16px rgba(32, 201, 151, 0.4)' : '0 4px 14px rgba(0,0,0,0.6)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <Image
                      src={team.logo}
                      alt={team.name}
                      w="100%"
                      h="100%"
                      fit="contain"
                      fallbackSrc="/favicon.webp"
                    />
                  </Box>
                  <Stack gap={0} align="center">
                    <Text
                      size="11px"
                      c="#ffffff"
                      fw={700}
                      style={{
                        maxWidth: '120px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textShadow: '0 2px 4px rgba(0,0,0,0.95)',
                      }}
                    >
                      {team.name}
                    </Text>
                    <Text
                      size="9px"
                      c="#adb5bd"
                      fw={500}
                      style={{
                        maxWidth: '110px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {team.school}
                    </Text>
                  </Stack>
                </Stack>
              </Tooltip>
            </Box>
          ))}
        </Box>

        {/* Right Sidebar: OFFICIAL SCORES (Top 10 Finalis) */}
        <Box
          w="340px"
          style={{
            backgroundColor: '#101115',
            borderLeft: '1px solid #1f2127',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3,
          }}
        >
          {/* Header */}
          <Box p="md" style={{ borderBottom: '1px solid #1f2127' }}>
            <Group justify="space-between">
              <Text size="xs" ff="monospace" c="dimmed" fw={700}>
                OFFICIAL SCORES
              </Text>
              <Badge color="teal" variant="light" size="sm">
                10 FINALIS
              </Badge>
            </Group>
            <Title order={4} c="white" fw={700} mt={4}>
              Top 10 Finalis IONIC 2026
            </Title>
          </Box>

          {/* List of top 10 teams */}
          <ScrollArea style={{ flex: 1 }} p="xs">
            <Stack gap="xs">
              {FINALIST_TEAMS.map((t) => (
                <Group
                  key={t.id}
                  justify="space-between"
                  p="xs"
                  style={{
                    backgroundColor: t.id === '7' ? 'rgba(32, 201, 151, 0.12)' : 'transparent',
                    border: t.id === '7' ? '1px solid rgba(32, 201, 151, 0.4)' : '1px solid transparent',
                    borderRadius: '8px',
                  }}
                >
                  <Group gap="xs" wrap="nowrap">
                    <Text size="xs" ff="monospace" fw={700} c={t.rank <= 3 ? '#fab005' : 'dimmed'}>
                      {t.rank < 10 ? `0${t.rank}` : t.rank}
                    </Text>
                    <Box w={32} h={32} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={t.logo} alt={t.name} w={28} h={28} fit="contain" fallbackSrc="/favicon.webp" />
                    </Box>
                    <Stack gap={1} style={{ maxWidth: '145px' }}>
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
                          color={t.status === 'Operational' ? '#2f9e44' : '#fab005'}
                        />
                        <Text
                          size="9px"
                          c="dimmed"
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {t.school}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Text size="xs" ff="monospace" fw={700} c="white">
                    {t.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                  </Text>
                </Group>
              ))}
            </Stack>
          </ScrollArea>

          {/* Pinned Bottom Team: Z3RODAY */}
          <Box
            p="md"
            style={{
              borderTop: '1px solid #1f2127',
              backgroundColor: '#16181e',
            }}
          >
            <Group gap="sm" wrap="nowrap">
              <Box w={36} h={36} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/logos/smkn1-boyolangu.png" alt="Z3RODAY" w={32} h={32} fit="contain" />
              </Box>
              <Stack gap={1}>
                <Text size="sm" fw={700} c="white">
                  Z3RODAY
                </Text>
                <Text size="xs" c="dimmed">
                  #07 · SMK NEGERI 1 BOYOLANGU · 47.177,1 pts
                </Text>
              </Stack>
            </Group>
          </Box>
        </Box>
      </Box>

      {/* Bottom Ticker: LIVE ACTIVITY */}
      <Box
        px="md"
        py="xs"
        style={{
          borderTop: '1px solid #1f2127',
          backgroundColor: '#0d0e12',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Badge color="teal" variant="filled" size="sm" radius="xs" style={{ flexShrink: 0 }}>
          LIVE ACTIVITY
        </Badge>
        <Box
          style={{
            display: 'flex',
            gap: '24px',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
          }}
        >
          {activityLogs.map((log, i) => (
            <Group key={i} gap="xs" style={{ flexShrink: 0 }}>
              <Text size="xs" c="dimmed" ff="monospace">
                {log.time} · {log.service}
              </Text>
              <Text size="xs" fw={600} c="#90c2f7">
                {log.text}
              </Text>
            </Group>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
