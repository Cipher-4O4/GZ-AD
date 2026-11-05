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
  const [round, setRound] = useState(19)
  const [tick, setTick] = useState(2)
  const [secondsLeft, setSecondsLeft] = useState(22)
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamNode>(FINALIST_TEAMS[6]) // Default Z3RODAY
  const [attackerId, setAttackerId] = useState<string | null>(null)
  const [victimId, setVictimId] = useState<string | null>(null)

  const [activityLogs, setActivityLogs] = useState<
    { time: string; service: string; text: string }[]
  >([
    { time: '10:54:05', service: 'simple-web', text: 'Z3RODAY → WilSec - BOEDOET 47' },
    { time: '10:54:05', service: 'simple-crypto', text: 'United Shell-SCC → Gangantua' },
    { time: '10:54:05', service: 'simple-pwn', text: 'rootsanctum → Maaf TKA Pilih CTF' },
    { time: '10:54:04', service: 'simple-web', text: 'WilSec - Apa aja → Duo Perncari Flag' },
    { time: '10:54:03', service: 'simple-crypto', text: 'kata magfi "bebas" → WilSec - Panitia' },
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

  // Laser attack animation generator
  useEffect(() => {
    const interval = setInterval(() => {
      const attackerIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      let victimIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      while (victimIdx === attackerIdx) {
        victimIdx = Math.floor(Math.random() * FINALIST_TEAMS.length)
      }

      const attacker = FINALIST_TEAMS[attackerIdx]
      const victim = FINALIST_TEAMS[victimIdx]

      const services = ['simple-pwn', 'simple-web', 'simple-crypto']
      const service = services[Math.floor(Math.random() * services.length)]
      const colors = ['#20c997', '#ff6b6b', '#ff922b', '#339af0', '#fcc419']
      const color = colors[Math.floor(Math.random() * colors.length)]

      const attack: AttackEvent = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        service,
        attacker: attacker.name,
        victim: victim.name,
        attackerX: attacker.x,
        attackerY: attacker.y,
        victimX: victim.x,
        victimY: victim.y,
        color,
      }

      setAttackerId(attacker.id)
      setVictimId(victim.id)

      setActiveAttacks((prev) => [...prev.slice(-4), attack])
      setActivityLogs((prev) => [
        { time: attack.time, service: attack.service, text: `${attacker.name} → ${victim.name}` },
        ...prev.slice(0, 15),
      ])
    }, 2400)

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
        backgroundColor: '#0a0b0e',
        color: '#e4e5e7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Header Bar */}
      <Box
        px="lg"
        py="sm"
        style={{
          borderBottom: '1px solid #181a20',
          backgroundColor: '#0e1015',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Stack gap={2}>
              <Text size="11px" ff="monospace" c="#6c7280" fw={700} style={{ letterSpacing: '0.08em' }}>
                ATTACK & DEFENSE • PUBLIC VIEW
              </Text>
              <Title order={3} c="#ffffff" fw={800} style={{ letterSpacing: '-0.02em' }}>
                Warm Up Final
              </Title>
            </Stack>

            <Group gap="xs">
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: 'rgba(32, 201, 151, 0.08)',
                  borderColor: 'rgba(32, 201, 151, 0.3)',
                  color: '#20c997',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                ARENA&nbsp;&nbsp;<Text span c="white" fw={700}>IONIC 2026</Text>
              </Badge>
              <Badge
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  backgroundColor: '#14161d',
                  borderColor: '#242731',
                  color: '#9ca3af',
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
                  backgroundColor: '#14161d',
                  borderColor: '#242731',
                  color: '#9ca3af',
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
                  backgroundColor: '#14161d',
                  borderColor: '#242731',
                  color: '#9ca3af',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                NEXT TICK&nbsp;&nbsp;<Text span c="#20c997" fw={700} ff="monospace">{formatCountdown(secondsLeft)}</Text>
              </Badge>
            </Group>
          </Group>

          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={toggleFullscreen}
            style={{ backgroundColor: '#14161d', border: '1px solid #242731', color: '#9ca3af' }}
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
            backgroundColor: '#0a0b0e',
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(16, 75, 65, 0.14) 0%, transparent 75%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 52px 52px, 52px 52px',
            overflow: 'hidden',
          }}
        >
          {/* Status Indicator Live */}
          <Box
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
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
            <Text size="11px" fw={700} c="#20c997" ff="monospace" style={{ letterSpacing: '0.08em' }}>
              LIVE
            </Text>
          </Box>

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
              <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {activeAttacks.map((atk) => (
              <g key={atk.id}>
                {/* Laser Glow */}
                <line
                  x1={`${atk.attackerX}%`}
                  y1={`${atk.attackerY}%`}
                  x2={`${atk.victimX}%`}
                  y2={`${atk.victimY}%`}
                  stroke={atk.color}
                  strokeWidth="3.5"
                  opacity="0.85"
                  filter="url(#laser-glow)"
                />
                {/* Laser Core */}
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

          {/* Team Circular Nodes on the Map */}
          {FINALIST_TEAMS.map((team) => {
            const isAttacking = attackerId === team.id
            const isVictim = victimId === team.id
            const isSelected = selectedTeam.id === team.id

            let ringColor = 'rgba(255, 255, 255, 0.12)'
            let ringGlow = '0 4px 14px rgba(0,0,0,0.7)'

            if (isAttacking) {
              ringColor = '#20c997'
              ringGlow = '0 0 0 3px #20c997, 0 0 20px rgba(32, 201, 151, 0.8)'
            } else if (isVictim) {
              ringColor = '#ff6b6b'
              ringGlow = '0 0 0 3px #ff6b6b, 0 0 20px rgba(255, 107, 107, 0.8)'
            } else if (isSelected) {
              ringColor = '#20c997'
              ringGlow = '0 0 0 2px #20c997, 0 0 14px rgba(32, 201, 151, 0.4)'
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
                  zIndex: 2,
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
                      <Text fw={700} size="sm" c="white">{team.name}</Text>
                      <Text size="xs" c="dimmed">{team.school}</Text>
                      <Text size="xs" fw={700} c="#20c997">
                        Rank #{team.rank} • {team.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })} pts
                      </Text>
                      <Text size="10px" c="#9ca3af">
                        Code: {team.teamCode} • Status: {team.status}
                      </Text>
                    </Stack>
                  }
                >
                  <Stack align="center" gap={6}>
                    {/* Circular Logo Node */}
                    <Box
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#12141a',
                        border: `2px solid ${ringColor}`,
                        boxShadow: ringGlow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        transition: 'all 0.25s ease',
                        transform: isAttacking || isVictim || isSelected ? 'scale(1.1)' : 'scale(1)',
                        overflow: 'hidden',
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
                    </Box>

                    {/* Team Name Label */}
                    <Text
                      size="11px"
                      c="#ffffff"
                      fw={700}
                      style={{
                        maxWidth: '120px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textShadow: '0 2px 5px rgba(0,0,0,0.95)',
                      }}
                    >
                      {team.name}
                    </Text>
                  </Stack>
                </Tooltip>
              </Box>
            )
          })}

          {/* Bottom Right Selected Team Info Card */}
          <Box
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: '#12141c',
              border: '1px solid #222634',
              borderRadius: '8px',
              padding: '12px 16px',
              zIndex: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
              maxWidth: '320px',
            }}
          >
            <Group gap="sm" wrap="nowrap">
              <Box
                w={40}
                h={40}
                style={{
                  borderRadius: '50%',
                  backgroundColor: '#181b24',
                  border: '1px solid #2a2f40',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  flexShrink: 0,
                }}
              >
                <Image src={selectedTeam.logo} alt={selectedTeam.name} w={32} h={32} fit="contain" />
              </Box>
              <Stack gap={1} style={{ overflow: 'hidden' }}>
                <Text size="sm" fw={800} c="white" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedTeam.name}
                </Text>
                <Text size="xs" c="#9ca3af" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  #{selectedTeam.rank} • {selectedTeam.school} • {selectedTeam.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })} points
                </Text>
              </Stack>
            </Group>
          </Box>
        </Box>

        {/* Right Sidebar: OFFICIAL SCORES (Top 10 Finalis) */}
        <Box
          w="360px"
          style={{
            backgroundColor: '#0d0f14',
            borderLeft: '1px solid #181a20',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3,
          }}
        >
          {/* Header */}
          <Box p="md" style={{ borderBottom: '1px solid #181a20' }}>
            <Group justify="space-between" align="center">
              <Text size="11px" ff="monospace" c="#6c7280" fw={700} style={{ letterSpacing: '0.08em' }}>
                OFFICIAL SCORES
              </Text>
              <Text size="11px" ff="monospace" c="#6c7280" fw={700}>
                10 TEAMS
              </Text>
            </Group>
            <Title order={3} c="#ffffff" fw={800} mt={4}>
              Top 10
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
                        c={t.rank === 1 ? '#fab005' : t.rank === 2 ? '#20c997' : '#6c7280'}
                        style={{ width: '20px' }}
                      >
                        {t.rank < 10 ? `0${t.rank}` : t.rank}
                      </Text>
                      <Box
                        w={32}
                        h={32}
                        style={{
                          borderRadius: '50%',
                          backgroundColor: '#161822',
                          border: '1px solid #242938',
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
                            {t.teamCode} • {t.status}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>

                    <Text size="xs" ff="monospace" fw={700} c="#ffffff" style={{ flexShrink: 0 }}>
                      {t.score.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                    </Text>
                  </Group>
                )
              })}
            </Stack>
          </ScrollArea>
        </Box>
      </Box>

      {/* Bottom Ticker: LIVE ACTIVITY */}
      <Box
        px="md"
        py="xs"
        style={{
          borderTop: '1px solid #181a20',
          backgroundColor: '#0b0c10',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Badge
          color="teal"
          variant="filled"
          size="sm"
          radius="xs"
          style={{
            flexShrink: 0,
            backgroundColor: '#20c997',
            color: '#000000',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          LIVE ACTIVITY
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
              <Text size="xs" c="#6c7280" ff="monospace">
                {log.time} · {log.service}
              </Text>
              <Text size="xs" fw={600} c="#81a6f8">
                {log.text}
              </Text>
            </Group>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
