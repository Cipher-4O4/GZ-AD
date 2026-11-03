import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  mdiCheckCircle,
  mdiCircle,
  mdiFullscreen,
  mdiFullscreenExit,
  mdiSwordCross,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useRef, useState } from 'react'

interface TeamNode {
  id: string
  name: string
  score: number
  rank: number
  status: 'Operational' | 'Recovering' | 'Mumble' | 'Offline'
  teamCode: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  color: string
}

interface AttackEvent {
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

const DEFAULT_TEAMS: TeamNode[] = [
  { id: '1', name: 'pacman -Sybau', score: 22851.2, rank: 1, status: 'Operational', teamCode: 'T407', x: 80, y: 15, color: '#e03131' },
  { id: '2', name: 'TOP - EsemkitaJayal', score: 22527.6, rank: 2, status: 'Operational', teamCode: 'T403', x: 20, y: 15, color: '#2f9e44' },
  { id: '3', name: 'Offset e offside', score: 18434.2, rank: 3, status: 'Operational', teamCode: 'T417', x: 80, y: 40, color: '#1971c2' },
  { id: '4', name: 'lethe cyber 1', score: 18118.4, rank: 4, status: 'Operational', teamCode: 'T424', x: 35, y: 55, color: '#f59f00' },
  { id: '5', name: 'gak_jago_sama_gak_j...', score: 17892.5, rank: 5, status: 'Operational', teamCode: 'T408', x: 20, y: 35, color: '#e03131' },
  { id: '6', name: 'SMAPa 2', score: 16030.5, rank: 6, status: 'Mumble', teamCode: 'T435', x: 50, y: 70, color: '#f59f00' },
  { id: '7', name: 'dil saran jeneng tim', score: 14578.5, rank: 7, status: 'Operational', teamCode: 'T413', x: 20, y: 48, color: '#e03131' },
  { id: '8', name: 'SCS - bingung pas ma...', score: 14016.6, rank: 8, status: 'Operational', teamCode: 'T410', x: 50, y: 35, color: '#1971c2' },
  { id: '9', name: 'SCS - DUO WIJAYA SIAP...', score: 10571.4, rank: 9, status: 'Operational', teamCode: 'T405', x: 50, y: 15, color: '#e03131' },
  { id: '10', name: 'ZeroDay SMKN 1 Boyola...', score: 9575.2, rank: 10, status: 'Offline', teamCode: 'T440', x: 50, y: 85, color: '#2f9e44' },
  { id: '11', name: 'Pungging Jaya', score: 9200.0, rank: 11, status: 'Operational', teamCode: 'T409', x: 35, y: 15, color: '#1971c2' },
  { id: '12', name: 'Keong Classix', score: 8900.0, rank: 12, status: 'Operational', teamCode: 'T412', x: 65, y: 35, color: '#1971c2' },
  { id: '13', name: 'Opo yo enak e', score: 8500.0, rank: 13, status: 'Operational', teamCode: 'T414', x: 20, y: 65, color: '#e03131' },
  { id: '14', name: 'PPLG HENGKER', score: 8100.0, rank: 14, status: 'Operational', teamCode: 'T415', x: 80, y: 85, color: '#1971c2' },
  { id: '15', name: 'SandWorm', score: 7900.0, rank: 15, status: 'Operational', teamCode: 'T416', x: 50, y: 55, color: '#1971c2' },
  { id: '16', name: 'GARDA DIGITAL', score: 7500.0, rank: 16, status: 'Operational', teamCode: 'T418', x: 65, y: 85, color: '#1971c2' },
]

export const AttackMap: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [round, setRound] = useState(26)
  const [tick, setTick] = useState(1)
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([])
  const [activityLogs, setActivityLogs] = useState<
    { time: string; service: string; text: string }[]
  >([
    { time: '11.34.33', service: 'simple-pwn', text: 'ZeroDay SMKN 1 Boyolangu → PPLG HENGKER' },
    { time: '11.34.33', service: 'simple-pwn', text: 'ZeroDay SMKN 1 Boyolangu → Keong Classix' },
    { time: '11.34.33', service: 'simple-pwn', text: 'ZeroDay SMKN 1 Boyolangu → Opo yo enak e' },
    { time: '11.34.33', service: 'simple-crypto', text: 'pacman -Sybau → TOP - EsemkitaJayal' },
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
      const attacker = DEFAULT_TEAMS[Math.floor(Math.random() * DEFAULT_TEAMS.length)]
      const victim = DEFAULT_TEAMS[Math.floor(Math.random() * DEFAULT_TEAMS.length)]
      if (attacker.id === victim.id) return

      const services = ['simple-pwn', 'simple-web', 'simple-crypto']
      const service = services[Math.floor(Math.random() * services.length)]
      const colors = ['#ff922b', '#ff6b6b', '#20c997', '#339af0']
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
    }, 2000)

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
                Warm Up Final
              </Title>
            </Stack>

            <Group gap="xs">
              <Badge variant="outline" color="gray" size="lg" radius="sm">
                Arena &nbsp;<Text span c="white" fw={700}>East Java</Text>
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

      {/* Main Area: Grid & Sidebar */}
      <Box style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Attack Map Canvas Area */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#0c0d10',
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(20, 80, 70, 0.15) 0%, transparent 70%), linear-gradient(#14161c 1px, transparent 1px), linear-gradient(90deg, #14161c 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
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
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
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
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#glow)"
                />
                {/* Inner Core */}
                <line
                  x1={`${atk.attackerX}%`}
                  y1={`${atk.attackerY}%`}
                  x2={`${atk.victimX}%`}
                  y2={`${atk.victimY}%`}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              </g>
            ))}
          </svg>

          {/* Team Nodes */}
          {DEFAULT_TEAMS.map((team) => (
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
              <Tooltip label={`${team.name} • Rank #${team.rank} • ${team.score.toLocaleString()} pts`}>
                <Stack align="center" gap={4}>
                  <Box
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#191b22',
                      border: `2px solid ${team.rank <= 3 ? '#fab005' : '#2b2d38'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <Avatar radius="sm" size={34} color={team.color}>
                      {team.name.slice(0, 2).toUpperCase()}
                    </Avatar>
                  </Box>
                  <Text
                    size="10px"
                    c="#c1c2c5"
                    fw={600}
                    style={{
                      maxWidth: '85px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                    }}
                  >
                    {team.name}
                  </Text>
                </Stack>
              </Tooltip>
            </Box>
          ))}
        </Box>

        {/* Right Sidebar: OFFICIAL SCORES (Top 10) */}
        <Box
          w="320px"
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
              <Text size="xs" c="dimmed" ff="monospace">
                40 TEAMS
              </Text>
            </Group>
            <Title order={4} c="white" fw={700} mt={4}>
              Top 10
            </Title>
          </Box>

          {/* List of top teams */}
          <ScrollArea style={{ flex: 1 }} p="xs">
            <Stack gap="xs">
              {DEFAULT_TEAMS.slice(0, 10).map((t) => (
                <Group
                  key={t.id}
                  justify="space-between"
                  p="xs"
                  style={{
                    backgroundColor: t.id === '10' ? 'rgba(47, 158, 68, 0.12)' : 'transparent',
                    border: t.id === '10' ? '1px solid rgba(47, 158, 68, 0.4)' : '1px solid transparent',
                    borderRadius: '6px',
                  }}
                >
                  <Group gap="xs" wrap="nowrap">
                    <Text size="xs" ff="monospace" fw={700} c={t.rank <= 3 ? '#fab005' : 'dimmed'}>
                      {t.rank < 10 ? `0${t.rank}` : t.rank}
                    </Text>
                    <Avatar size={28} radius="sm" color={t.color}>
                      {t.name.slice(0, 1)}
                    </Avatar>
                    <Stack gap={1} style={{ maxWidth: '130px' }}>
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
                          size={0.3}
                          color={t.status === 'Operational' ? '#2f9e44' : '#e03131'}
                        />
                        <Text size="10px" c="dimmed">
                          {t.teamCode} · {t.status}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Text size="xs" ff="monospace" fw={700} c="white">
                    {t.score.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </Text>
                </Group>
              ))}
            </Stack>
          </ScrollArea>

          {/* Pinned Bottom Team (Current User / Selected Team) */}
          <Box
            p="md"
            style={{
              borderTop: '1px solid #1f2127',
              backgroundColor: '#16181e',
            }}
          >
            <Text size="sm" fw={700} c="white">
              ZeroDay SMKN 1 Boyolangu
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              #10 · SMKN 1 Boyolangu · 9,575.2 points
            </Text>
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

