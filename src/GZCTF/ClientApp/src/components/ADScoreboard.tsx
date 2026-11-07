import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiCrosshairsGps,
  mdiHeartPulse,
  mdiMagnify,
  mdiShieldOutline,
  mdiSwordCross,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useMemo, useState } from 'react'
import { AdColors, AdStatusColor, adHeat, type AdStatus } from '@Utils/Ad'
import { AD_MAX_CELL, AD_SCOREBOARD, AD_SERVICES, SELF_TEAM, formatPoints } from '@Utils/AdData'

const STATUSES: AdStatus[] = ['Operational', 'Recovering', 'Mumble', 'Offline']
const STATUS_LABEL: Record<AdStatus, string> = {
  Operational: 'Ok',
  Recovering: 'Recovering',
  Mumble: 'Mumble',
  Offline: 'Offline',
}

const SUB_COLUMNS = [
  { key: 'attack' as const, icon: mdiSwordCross, label: 'Attack points' },
  { key: 'defense' as const, icon: mdiShieldOutline, label: 'Defense points' },
  { key: 'availability' as const, icon: mdiHeartPulse, label: 'Availability points' },
]

const TeamAvatar: FC<{ logo?: string; name: string }> = ({ logo, name }) => {
  return (
    <Box
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: '#121820',
        border: '1px solid #202b38',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {logo ? (
        <Image src={logo} alt={name} w={22} h={22} fit="contain" fallbackSrc="/favicon.webp" />
      ) : (
        <Text fz={10} fw={800} c="white">
          {name.slice(0, 1).toUpperCase()}
        </Text>
      )}
    </Box>
  )
}

export const ADScoreboard: FC = () => {
  const [division, setDivision] = useState<string | null>('Semua Tim')
  const [search, setSearch] = useState('')
  const [round, setRound] = useState(26)
  const [tick, setTick] = useState(3)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [scoreboardRows, setScoreboardRows] = useState<AdScoreRow[]>(AD_SCOREBOARD)

  // Realtime Polling of Live Scoreboard from A&D Engine
  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const res = await fetch('/api/ad/scoreboard')
        if (res.ok) {
          const data = await res.json()
          if (data.rows && Array.isArray(data.rows)) {
            setScoreboardRows(data.rows)
          }
          if (typeof data.round === 'number') setRound(data.round)
          if (typeof data.tick === 'number') setTick(data.tick)
          if (typeof data.secondsLeft === 'number') setSecondsLeft(data.secondsLeft)
        }
      } catch (e) {
        // silent fetch error
      }
    }

    fetchScoreboard()
    const interval = setInterval(fetchScoreboard, 2000)
    return () => clearInterval(interval)
  }, [])

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query
      ? scoreboardRows.filter(
          (row) =>
            row.name.toLowerCase().includes(query) || row.school.toLowerCase().includes(query)
        )
      : scoreboardRows
  }, [search, scoreboardRows])

  const findSelf = () => {
    setSearch(SELF_TEAM)
    requestAnimationFrame(() => {
      document.getElementById('ad-self-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const headCell = {
    backgroundColor: '#0c1318',
    borderBottom: '1px solid #16242c',
    color: '#7a8e9e',
    fontFamily: AdColors.mono,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '8px 10px',
  } as const

  const bodyCell = {
    borderBottom: '1px solid #142028',
    fontFamily: AdColors.mono,
    fontSize: 12,
    color: '#e2e8f0',
    padding: '8px 10px',
  } as const

  return (
    <Box style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Banner Notice */}
      <Box
        px="md"
        py={6}
        mb="md"
        style={{
          backgroundColor: '#0a151b',
          border: '1px solid #142833',
          borderRadius: '6px',
        }}
      >
        <Text fz={11} style={{ color: '#8fa8be' }}>
          Recent points can change. Open a team to see settled and provisional totals.
        </Text>
      </Box>

      {/* Filter and Status Controls */}
      <Group justify="space-between" align="flex-end" wrap="nowrap" mb="md" gap="md">
        <Group gap="sm" wrap="nowrap">
          <Select
            value={division}
            onChange={setDivision}
            data={['Semua Tim', 'Zero Arena', 'Java Sea Islands']}
            size="sm"
            radius="md"
            leftSection={<Icon path={mdiCrosshairsGps} size={0.65} color="#20c997" />}
            styles={{
              input: {
                backgroundColor: '#0c151c',
                border: '1px solid #182c38',
                color: '#e2e8f0',
                fontSize: 12,
                minWidth: 180,
              },
            }}
          />
          <Button
            size="sm"
            radius="md"
            leftSection={<Icon path={mdiCrosshairsGps} size={0.7} />}
            onClick={findSelf}
            styles={{
              root: {
                backgroundColor: '#0d3b33',
                border: '1px solid rgba(32, 201, 151, 0.45)',
                color: '#20c997',
                fontSize: 12,
                fontWeight: 700,
              },
            }}
          >
            Cari Tim saya
          </Button>

          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Cari tim..."
            size="sm"
            radius="md"
            leftSection={<Icon path={mdiMagnify} size={0.65} color="#7a8e9e" />}
            styles={{
              input: {
                backgroundColor: '#0c151c',
                border: '1px solid #182c38',
                color: '#e2e8f0',
                fontSize: 12,
                minWidth: 220,
              },
            }}
          />
        </Group>

        {/* Right Info: Round & Countdown */}
        <Group gap="md" align="center" wrap="nowrap">
          <Group gap={6} align="center">
            <ActionIcon
              variant="default"
              size="sm"
              radius="sm"
              onClick={() => setRound((r) => Math.max(1, r - 1))}
              style={{ backgroundColor: '#0c151c', border: '1px solid #182c38', color: '#7a8e9e' }}
            >
              <Icon path={mdiChevronLeft} size={0.7} />
            </ActionIcon>
            <Text ff="monospace" fz={12} fw={800} c="white">
              Round {round}
            </Text>
            <ActionIcon
              variant="default"
              size="sm"
              radius="sm"
              onClick={() => setRound((r) => r + 1)}
              style={{ backgroundColor: '#0c151c', border: '1px solid #182c38', color: '#7a8e9e' }}
            >
              <Icon path={mdiChevronRight} size={0.7} />
            </ActionIcon>
          </Group>

          <Box w="1px" h={20} bg="#182c38" />

          <Text ff="monospace" fz={12} fw={700} c="#94a3b8">
            Tick <Text span c="white" fw={800}>0{tick}</Text> / 5
          </Text>

          <Box w="1px" h={20} bg="#182c38" />

          <Text ff="monospace" fz={11} fw={700} c="#7a8e9e">
            next tick <Text span c="#20c997" fw={800}>0:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</Text>
          </Text>
        </Group>
      </Group>

      {/* Status Legend & Category Filters */}
      <Group justify="space-between" align="center" mb="sm" wrap="nowrap">
        <Group gap={14} wrap="nowrap">
          <Text fz={11} fw={700} style={{ color: '#64748b' }}>
            Status
          </Text>
          {STATUSES.map((status) => (
            <Group key={status} gap={6} wrap="nowrap">
              <Box
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: AdStatusColor[status],
                  boxShadow: `0 0 6px ${AdStatusColor[status]}`,
                }}
              />
              <Text fz={11} fw={600} style={{ color: '#94a3b8' }}>
                {STATUS_LABEL[status]}
              </Text>
            </Group>
          ))}
        </Group>

        <Group gap="xs" wrap="nowrap">
          {AD_SERVICES.map((s) => (
            <Badge
              key={s.key}
              variant="outline"
              size="sm"
              radius="sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: '#1e293b',
                color: s.color,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              ● {s.category.toLowerCase()}
            </Badge>
          ))}
        </Group>
      </Group>

      {/* Main A&D Scoreboard Table */}
      <ScrollArea scrollbarSize={6} type="auto">
        <Table
          horizontalSpacing={8}
          verticalSpacing={6}
          highlightOnHover
          style={{ minWidth: 1100, border: '1px solid #142028', borderRadius: '8px', overflow: 'hidden' }}
          styles={{
            th: headCell,
            td: bodyCell,
            tr: { backgroundColor: 'transparent' },
            table: { backgroundColor: '#090e12' },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th rowSpan={2} style={{ width: 64, textAlign: 'center' }}>
                Overall
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 68, textAlign: 'center' }}>
                Ranking
              </Table.Th>
              <Table.Th rowSpan={2} style={{ minWidth: 240 }}>
                Tim
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 84, textAlign: 'right' }}>
                Captures
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 96, textAlign: 'right' }}>
                Total
              </Table.Th>
              {AD_SERVICES.map((service) => (
                <Table.Th
                  key={service.key}
                  colSpan={3}
                  ta="center"
                  style={{
                    ...headCell,
                    backgroundColor: service.color,
                    color: '#000000',
                    borderBottom: `2px solid ${service.color}`,
                    fontWeight: 900,
                  }}
                >
                  <Stack gap={0} align="center">
                    <Text fz={9} fw={800} style={{ color: 'rgba(0, 0, 0, 0.65)', fontFamily: AdColors.mono }}>
                      {service.category.toUpperCase()}
                    </Text>
                    <Text fz={11} fw={900} style={{ color: '#000000', fontFamily: AdColors.mono }}>
                      {service.key}
                    </Text>
                  </Stack>
                </Table.Th>
              ))}
            </Table.Tr>
            <Table.Tr>
              {AD_SERVICES.map((service) =>
                SUB_COLUMNS.map((column) => (
                  <Table.Th key={`${service.key}-${column.key}`} ta="center" style={{ width: 62 }}>
                    <Icon path={column.icon} size={0.55} color={service.color} />
                  </Table.Th>
                ))
              )}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {visible.map((row) => {
              const isSelected = row.self

              return (
                <Table.Tr
                  key={row.rank}
                  id={row.self ? 'ad-self-row' : undefined}
                  style={{
                    backgroundColor: isSelected ? 'rgba(32, 201, 151, 0.12)' : undefined,
                    boxShadow: isSelected ? 'inset 3px 0 0 #20c997' : undefined,
                  }}
                >
                  {/* Overall Rank */}
                  <Table.Td ta="center">
                    <Text
                      ff="monospace"
                      fz={12}
                      fw={800}
                      c={
                        row.rank === 1
                          ? '#fab005'
                          : row.rank === 2
                          ? '#ced4da'
                          : row.rank === 3
                          ? '#e8863f'
                          : '#64748b'
                      }
                    >
                      {row.rank}
                    </Text>
                  </Table.Td>

                  {/* Ranking with Status Dot */}
                  <Table.Td ta="center">
                    <Group gap={6} justify="center" wrap="nowrap">
                      <Box
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: AdStatusColor[row.status] ?? '#20c997',
                          boxShadow: `0 0 6px ${AdStatusColor[row.status] ?? '#20c997'}`,
                        }}
                      />
                      <Text ff="monospace" fz={12} fw={700} c="#94a3b8">
                        {row.rank}
                      </Text>
                    </Group>
                  </Table.Td>

                  {/* Team Column with School Logo */}
                  <Table.Td>
                    <Group gap={8} wrap="nowrap">
                      <TeamAvatar logo={row.logo} name={row.name} />
                      <Stack gap={1} style={{ minWidth: 0 }}>
                        <Text
                          fz={12}
                          fw={row.self ? 800 : 700}
                          truncate
                          style={{
                            color: row.self ? '#38d9a9' : '#ffffff',
                            maxWidth: 210,
                          }}
                        >
                          {row.name}
                        </Text>
                        <Text
                          fz={10}
                          c="#7a8e9e"
                          truncate
                          style={{ maxWidth: 210 }}
                        >
                          {row.school}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>

                  {/* Captures */}
                  <Table.Td ta="right" style={{ color: '#94a3b8', fontWeight: 600 }}>
                    {row.captures.toLocaleString('en-US')}
                  </Table.Td>

                  {/* Total Points */}
                  <Table.Td ta="right">
                    <Text ff="monospace" fz={12} fw={800} c="#ffffff">
                      {formatPoints(row.total)}
                    </Text>
                  </Table.Td>

                  {/* Service Specific Sub-columns (Attack, Defense, Availability) */}
                  {AD_SERVICES.map((service) => {
                    const cell = row.services?.[service.key] ?? { attack: 0, defense: 0, availability: 0 }

                    return SUB_COLUMNS.map((column) => {
                      const value = cell?.[column.key] ?? 0
                      const isAttack = column.key === 'attack'

                      return (
                        <Table.Td
                          key={`${row.rank}-${service.key}-${column.key}`}
                          ta="right"
                          style={{
                            backgroundColor:
                              isAttack && value > 0
                                ? adHeat(value, AD_MAX_CELL)
                                : 'transparent',
                            color: value === 0 ? '#475569' : '#e2e8f0',
                            fontWeight: isAttack ? 700 : 500,
                          }}
                        >
                          {value < 100 && value > 0 ? value.toFixed(1) : Math.round(value).toLocaleString('en-US')}
                        </Table.Td>
                      )
                    })
                  })}
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Text fz={11} mt="sm" style={{ color: '#64748b' }}>
        Catatan: Baris dengan sorotan hijau toska adalah tim Anda (Z3RODAY). Nilai poin terus diperbarui per tick.
      </Text>
    </Box>
  )
}
