import { ActionIcon, Avatar, Box, Group, ScrollArea, Stack, Text, Title, Tooltip } from '@mantine/core'
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { AdColors, AdStatusColor } from '@Utils/Ad'
import { AD_ACTIVITY, AD_TEAMS, SELF_TEAM, type AdTeam, formatPoints } from '@Utils/AdData'
import { useGame } from '@Hooks/useGame'
import classes from '@Styles/AttackMap.module.css'

interface Beam {
  id: number
  from: AdTeam
  color: string
}

const COLS = 5
const ROWS = 8
const BEAM_COLORS = ['#fab005', '#fd7e14', '#fa5252']

const LOGO_BG = [
  'linear-gradient(145deg, #22415c, #16283a)',
  'linear-gradient(145deg, #3d2a5e, #241a38)',
  'linear-gradient(145deg, #28503a, #162c21)',
  'linear-gradient(145deg, #5c2b2b, #331818)',
  'linear-gradient(145deg, #4d3d1d, #2b2211)',
  'linear-gradient(145deg, #1f4a4a, #122a2a)',
]

const position = (index: number) => ({
  x: ((index % COLS) + 0.5) * (100 / COLS),
  y: 6 + Math.floor(index / COLS) * (88 / (ROWS - 1)),
})

const curve = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const offset = len * 0.14
  return `M ${from.x} ${from.y} Q ${mx + (-dy / len) * offset} ${my + (dx / len) * offset} ${to.x} ${to.y}`
}

const Pill: FC<{ label: string; value?: string; active?: boolean }> = ({ label, value, active }) => (
  <Group
    gap={6}
    wrap="nowrap"
    px={10}
    py={6}
    style={{
      border: `1px solid ${active ? 'rgba(18, 184, 134, 0.45)' : AdColors.border}`,
      backgroundColor: active ? 'rgba(18, 184, 134, 0.1)' : 'rgba(255, 255, 255, 0.02)',
      borderRadius: 6,
    }}
  >
    <Text
      ff="monospace"
      fz={10}
      fw={700}
      style={{ letterSpacing: '0.12em', color: active ? AdColors.primaryText : AdColors.dimmer }}
    >
      {label}
    </Text>
    {value && (
      <Text ff="monospace" fz={11} fw={700} style={{ color: active ? AdColors.primaryText : AdColors.text }}>
        {value}
      </Text>
    )}
  </Group>
)

export const AttackMap: FC = () => {
  const { id } = useParams()
  const { game } = useGame(parseInt(id ?? '-1'))

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [beams, setBeams] = useState<Beam[]>([])
  const [activity, setActivity] = useState(AD_ACTIVITY)
  const beamId = useRef(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const selfTeam = AD_TEAMS.find((team) => team.self)!
  const selfPos = position(AD_TEAMS.indexOf(selfTeam))
  const topTeams = [...AD_TEAMS].sort((a, b) => a.rank - b.rank).slice(0, 10)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Attacks are simulated: every couple of seconds a random team fires at us.
  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = AD_TEAMS.filter((team) => !team.self)
      const from = candidates[Math.floor(Math.random() * candidates.length)]
      const color = BEAM_COLORS[Math.floor(Math.random() * BEAM_COLORS.length)]
      const id = ++beamId.current

      setBeams((prev) => [...prev.slice(-5), { id, from, color }])
      setActivity((prev) => [
        {
          time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
          service: ['simple-pwn', 'simple-crypto', 'simple-web'][Math.floor(Math.random() * 3)],
          text: `${from.name} → ${SELF_TEAM}`,
          color,
        },
        ...prev.slice(0, 6),
      ])

      setTimeout(() => setBeams((prev) => prev.filter((beam) => beam.id !== id)), 2600)
    }, 1700)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box ref={containerRef} className={classes.root}>
      {/* Header */}
      <Box
        px="lg"
        py="sm"
        style={{ borderBottom: `1px solid ${AdColors.borderSoft}`, backgroundColor: AdColors.bgAlt }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap="md">
          <Stack gap={2}>
            <Text
              ff="monospace"
              fz={10}
              fw={700}
              style={{ letterSpacing: '0.16em', color: AdColors.dimmer }}
            >
              ATTACK &amp; DEFENSE · PUBLIC VIEW
            </Text>
            <Title order={3} fz="1.35rem" fw={800} style={{ color: '#fff' }}>
              {game?.title ?? 'Warm Up Final'}
            </Title>
          </Stack>

          <Group gap={8} wrap="nowrap">
            <Pill label="ARENA" active />
            <Pill label="East Java" />
            <Pill label="ROUND" value="26" />
            <Pill label="TICK" value="01 / 5" />
            <Pill label="NEXT TICK" value="Awaiting next tick" />
            <ActionIcon
              size="lg"
              radius="sm"
              onClick={toggleFullscreen}
              style={{ border: `1px solid ${AdColors.border}`, backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <Icon path={isFullscreen ? mdiFullscreenExit : mdiFullscreen} size={0.9} color={AdColors.dim} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* Map + scores */}
      <Box style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Box className={classes.canvas} style={{ flex: 1 }}>
          <Group gap={6} px="lg" py="sm" style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}>
            <Box className={classes.liveDot} />
            <Text ff="monospace" fz={10} fw={700} style={{ letterSpacing: '0.18em', color: AdColors.primaryText }}>
              LIVE
            </Text>
          </Group>

          {/* Attack beams */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
          >
            <defs>
              <filter id="ad-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {beams.map((beam) => {
              const from = position(AD_TEAMS.indexOf(beam.from))
              const path = curve(from, selfPos)

              return (
                <g key={beam.id} className={classes.beam}>
                  <path
                    d={path}
                    fill="none"
                    stroke={beam.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.55}
                    filter="url(#ad-glow)"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={path}
                    className={classes.beamCore}
                    fill="none"
                    stroke={beam.color}
                    strokeWidth={1}
                    strokeLinecap="round"
                    opacity={0.95}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )
            })}
          </svg>

          {/* Team nodes */}
          {AD_TEAMS.map((team, index) => {
            const pos = position(index)
            const isSelf = !!team.self

            return (
              <Tooltip
                key={team.id}
                label={`${team.name} · #${team.rank} · ${formatPoints(team.score)} pts · ${team.status}`}
                withArrow
                position="top"
                styles={{ tooltip: { backgroundColor: AdColors.surfaceRaised, border: `1px solid ${AdColors.border}` } }}
              >
                <Box
                  className={`${classes.node} ${isSelf ? classes.self : ''}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <Box
                    className={classes.nodeLogo}
                    style={{
                      background: LOGO_BG[index % LOGO_BG.length],
                      borderColor: team.rank <= 3 ? AdColors.gold : undefined,
                      color: team.rank <= 3 ? AdColors.gold : '#dfe1e5',
                    }}
                  >
                    {team.code.replace('T', '')}
                  </Box>
                  <Text className={classes.nodeName}>{team.name}</Text>
                </Box>
              </Tooltip>
            )
          })}
        </Box>

        {/* Official scores */}
        <Box
          w={320}
          style={{
            backgroundColor: AdColors.bgAlt,
            borderLeft: `1px solid ${AdColors.borderSoft}`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3,
          }}
        >
          <Box px="md" py="sm" style={{ borderBottom: `1px solid ${AdColors.borderSoft}` }}>
            <Group justify="space-between">
              <Text ff="monospace" fz={10} fw={700} style={{ letterSpacing: '0.14em', color: AdColors.dimmer }}>
                OFFICIAL SCORES
              </Text>
              <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
                {AD_TEAMS.length} TEAMS
              </Text>
            </Group>
            <Text fz="0.95rem" fw={700} mt={2} style={{ color: '#fff' }}>
              Top 10
            </Text>
          </Box>

          <ScrollArea style={{ flex: 1 }} scrollbarSize={4}>
            <Stack gap={0} p={6}>
              {topTeams.map((team) => (
                <Group
                  key={team.id}
                  justify="space-between"
                  wrap="nowrap"
                  gap={8}
                  px={8}
                  py={6}
                  style={{
                    borderRadius: 6,
                    backgroundColor: team.self ? 'rgba(18, 184, 134, 0.08)' : 'transparent',
                    borderLeft: `2px solid ${team.self ? AdColors.primary : 'transparent'}`,
                  }}
                >
                  <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
                    <Text ff="monospace" fz={11} fw={700} style={{ color: team.rank <= 3 ? AdColors.gold : AdColors.dimmer }}>
                      {String(team.rank).padStart(2, '0')}
                    </Text>
                    <Avatar size={26} radius="xl" styles={{ root: { background: LOGO_BG[team.id % LOGO_BG.length] } }}>
                      <Text ff="monospace" fz={9} fw={700} style={{ color: '#dfe1e5' }}>
                        {team.code.replace('T', '')}
                      </Text>
                    </Avatar>
                    <Stack gap={1} style={{ minWidth: 0 }}>
                      <Text fz={12} fw={600} truncate style={{ color: AdColors.text }}>
                        {team.name}
                      </Text>
                      <Group gap={4} wrap="nowrap">
                        <Box
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: AdStatusColor[team.status],
                          }}
                        />
                        <Text ff="monospace" fz={9} style={{ color: AdColors.dimmer }}>
                          {team.code} · {team.status}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                  <Text ff="monospace" fz={11} fw={700} style={{ color: AdColors.text }}>
                    {formatPoints(team.score)}
                  </Text>
                </Group>
              ))}
            </Stack>
          </ScrollArea>

          <Box px="md" py="sm" style={{ borderTop: `1px solid ${AdColors.borderSoft}`, backgroundColor: AdColors.surface }}>
            <Text fz={12} fw={700} style={{ color: '#fff' }}>
              {selfTeam.name}
            </Text>
            <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
              #{selfTeam.rank} · SMKN 1 Boyolangu · {formatPoints(selfTeam.score)} points
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Live activity ticker */}
      <Box
        style={{
          borderTop: `1px solid ${AdColors.borderSoft}`,
          backgroundColor: '#0b0c0f',
          display: 'flex',
          alignItems: 'stretch',
          height: 44,
          overflow: 'hidden',
        }}
      >
        <Group
          gap={6}
          px="md"
          wrap="nowrap"
          style={{ borderRight: `1px solid ${AdColors.borderSoft}`, flexShrink: 0 }}
        >
          <Box className={classes.liveDot} />
          <Text ff="monospace" fz={10} fw={700} style={{ letterSpacing: '0.14em', color: AdColors.dim }}>
            LIVE ACTIVITY
          </Text>
        </Group>

        <Group gap={0} wrap="nowrap" style={{ flex: 1, overflowX: 'auto' }}>
          {activity.map((log, index) => (
            <Group
              key={`${log.time}-${index}`}
              gap={8}
              wrap="nowrap"
              px="md"
              style={{ borderRight: `1px solid ${AdColors.borderSoft}`, height: '100%', flexShrink: 0 }}
            >
              <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
                {log.time}
              </Text>
              <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
                {log.service}
              </Text>
              <Text fz={11} fw={600} style={{ color: log.color }}>
                {log.text}
              </Text>
            </Group>
          ))}
        </Group>
      </Box>
    </Box>
  )
}
