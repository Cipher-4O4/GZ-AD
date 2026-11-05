import {
  Box,
  Button,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { mdiCrosshairsGps, mdiHeartPulse, mdiMagnify, mdiShieldOutline, mdiSwordCross } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useMemo, useState } from 'react'
import { AdColors, AdStatusColor, adHeat, type AdStatus } from '@Utils/Ad'
import { AD_MAX_CELL, AD_SCOREBOARD, AD_SERVICES, AD_TEAMS, SELF_TEAM, formatPoints } from '@Utils/AdData'

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

const TeamDot: FC<{ name: string }> = ({ name }) => {
  const colors = ['#12b886', '#4dabf7', '#fab005', '#e64980', '#9775fa', '#ff922b']
  const color = colors[name.charCodeAt(0) % colors.length]

  return (
    <Box
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 800,
        color: '#0b0c0f',
        flexShrink: 0,
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </Box>
  )
}

export const ADScoreboard: FC = () => {
  const [division, setDivision] = useState<string | null>('Semua Tim')
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query ? AD_SCOREBOARD.filter((row) => row.name.toLowerCase().includes(query)) : AD_SCOREBOARD
  }, [search])

  const findSelf = () => {
    setSearch(SELF_TEAM)
    requestAnimationFrame(() => {
      document.getElementById('ad-self-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const headCell = {
    backgroundColor: '#101115',
    borderBottom: `1px solid ${AdColors.border}`,
    color: AdColors.dimmer,
    fontFamily: AdColors.mono,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.06em',
    padding: '6px 8px',
  } as const

  const bodyCell = {
    borderBottom: `1px solid ${AdColors.borderSoft}`,
    fontFamily: AdColors.mono,
    fontSize: 11,
    color: AdColors.text,
    padding: '5px 8px',
  } as const

  return (
    <Box>
      <Text fz={11} mb="sm" style={{ color: AdColors.dim }}>
        Recent points can change. Open a team to see settled and provisional totals.
      </Text>

      <Group justify="space-between" align="flex-end" wrap="nowrap" mb="sm" gap="md">
        <Group gap={8} wrap="nowrap">
          <Select
            value={division}
            onChange={setDivision}
            data={['Semua Tim', 'Arena', 'East Java']}
            size="sm"
            radius={6}
            leftSection={<Icon path={mdiCrosshairsGps} size={0.65} color={AdColors.dim} />}
            styles={{
              input: {
                backgroundColor: AdColors.surface,
                border: `1px solid ${AdColors.border}`,
                color: AdColors.text,
                fontSize: 12,
                minWidth: 190,
              },
            }}
          />
          <Button
            size="sm"
            radius={6}
            leftSection={<Icon path={mdiCrosshairsGps} size={0.7} />}
            onClick={findSelf}
            styles={{
              root: {
                backgroundColor: '#0d3b33',
                border: '1px solid rgba(18, 184, 134, 0.55)',
                color: AdColors.primaryText,
                fontSize: 12,
                fontWeight: 600,
              },
              label: { color: AdColors.primaryText },
            }}
          >
            Cari Tim saya
          </Button>
        </Group>

        <Group gap="md" align="flex-end" wrap="nowrap">
          <Stack gap={2} align="flex-end">
            <Group gap={10} wrap="nowrap">
              <Text ff="monospace" fz={11} fw={700} style={{ color: AdColors.text }}>
                Round 26
              </Text>
              <Text ff="monospace" fz={11} fw={700} style={{ color: AdColors.text }}>
                Tick 4/5
              </Text>
            </Group>
            <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
              next tick 0:22
            </Text>
          </Stack>

          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Cari tim"
            size="sm"
            radius={6}
            leftSection={<Icon path={mdiMagnify} size={0.65} color={AdColors.dim} />}
            styles={{
              input: {
                backgroundColor: AdColors.surface,
                border: `1px solid ${AdColors.border}`,
                color: AdColors.text,
                fontSize: 12,
                minWidth: 220,
              },
            }}
          />
        </Group>
      </Group>

      <Group gap={10} mb={6} wrap="nowrap">
        <Text fz={10} style={{ color: AdColors.dimmer }}>
          Status
        </Text>
        {STATUSES.map((status) => (
          <Group key={status} gap={5} wrap="nowrap">
            <Box
              style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: AdStatusColor[status] }}
            />
            <Text fz={10} style={{ color: AdColors.dim }}>
              {STATUS_LABEL[status]}
            </Text>
          </Group>
        ))}
      </Group>

      <ScrollArea h="calc(100vh - 21rem)" scrollbarSize={6} type="auto">
        <Table
          horizontalSpacing={6}
          verticalSpacing={2}
          highlightOnHover
          style={{ minWidth: 1080 }}
          styles={{
            th: headCell,
            td: bodyCell,
            tr: { backgroundColor: 'transparent' },
            table: { backgroundColor: '#101115' },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th rowSpan={2} style={{ width: 58 }}>
                Overall
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 62 }}>
                Ranking
              </Table.Th>
              <Table.Th rowSpan={2} style={{ minWidth: 190 }}>
                Tim
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 72 }}>
                Captures
              </Table.Th>
              <Table.Th rowSpan={2} style={{ width: 84 }}>
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
                    color: '#0b0c0f',
                    borderBottom: `1px solid ${service.color}`,
                  }}
                >
                  <Stack gap={1} align="center">
                    <Text fz={9} fw={700} style={{ color: 'rgba(11,12,15,0.75)', fontFamily: AdColors.mono }}>
                      {service.category}
                    </Text>
                    <Text fz={10} fw={800} style={{ color: '#0b0c0f', fontFamily: AdColors.mono }}>
                      {service.key}
                    </Text>
                  </Stack>
                </Table.Th>
              ))}
            </Table.Tr>
            <Table.Tr>
              {AD_SERVICES.map((service) =>
                SUB_COLUMNS.map((column) => (
                  <Table.Th key={`${service.key}-${column.key}`} ta="center" style={{ width: 56 }}>
                    <Icon path={column.icon} size={0.5} color={service.color} />
                  </Table.Th>
                ))
              )}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {visible.map((row) => {
              const team = AD_TEAMS.find((item) => item.rank === row.rank)

              return (
                <Table.Tr
                  key={row.rank}
                  id={row.self ? 'ad-self-row' : undefined}
                  style={{
                    backgroundColor: row.self ? 'rgba(18, 184, 134, 0.07)' : undefined,
                    boxShadow: row.self ? `inset 2px 0 0 ${AdColors.primary}` : undefined,
                  }}
                >
                  <Table.Td style={{ color: AdColors.dim }}>{row.rank}</Table.Td>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Box
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: team ? AdStatusColor[team.status] : AdColors.dimmer,
                        }}
                      />
                      <Text ff="monospace" fz={11} style={{ color: AdColors.dim }}>
                        {row.rank}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={7} wrap="nowrap">
                      <TeamDot name={row.name} />
                      <Text
                        fz={11}
                        fw={row.self ? 700 : 500}
                        truncate
                        style={{ color: row.self ? AdColors.primaryText : AdColors.text, maxWidth: 180 }}
                      >
                        {row.name}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ color: AdColors.dim }}>{row.captures.toLocaleString('en-US')}</Table.Td>
                  <Table.Td>
                    <Text ff="monospace" fz={11} fw={700} style={{ color: '#fff' }}>
                      {formatPoints(row.total)}
                    </Text>
                  </Table.Td>

                  {AD_SERVICES.map((service) => {
                    const cell = row.services[service.key]

                    return SUB_COLUMNS.map((column) => {
                      const value = cell[column.key]
                      return (
                        <Table.Td
                          key={`${row.rank}-${service.key}-${column.key}`}
                          ta="right"
                          style={{
                            backgroundColor: row.self ? 'transparent' : adHeat(value, AD_MAX_CELL),
                            color: value === 0 ? AdColors.dimmer : AdColors.text,
                          }}
                        >
                          {value < 100 && value > 0 ? value.toFixed(1) : Math.round(value)}
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

      <Text fz={10} mt={6} style={{ color: AdColors.dimmer }}>
        Catatan: baris tanpa warna adalah tim kamu. Poin dapat berubah hingga tick berikutnya.
      </Text>
    </Box>
  )
}
