import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Code,
  CopyButton,
  Divider,
  Group,
  NumberInput,
  Paper,
  Progress,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import {
  mdiCheck,
  mdiCircle,
  mdiContentCopy,
  mdiFastForward,
  mdiMinus,
  mdiNuke,
  mdiOpenInNew,
  mdiPause,
  mdiPlay,
  mdiPlus,
  mdiRefresh,
  mdiRocketLaunch,
  mdiShieldAlertOutline,
  mdiShieldCheckOutline,
  mdiSwordCross,
  mdiTimerOutline,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useState } from 'react'
import { AdminPage } from '@Components/admin/AdminPage'
import { AdColors, AdStatus } from '@Utils/Ad'

interface TeamData {
  id: number
  name: string
  school: string
  code: string
  logo: string
  rank: number
  score: number
  status: AdStatus
  captures: number
  ip: string
}

interface ActiveFlag {
  teamId: number
  teamName: string
  serviceKey: string
  flag: string
  plantedTick: number
  expiresTick: number
  capturedBy: number[]
}

interface AttackLog {
  id: string
  time: string
  attackerId: number
  victimId: number
  service: string
  text: string
  isNuke: boolean
  color: string
}

interface OverviewData {
  round: number
  tick: number
  maxTick: number
  tickSeconds: number
  secondsLeft: number
  totalTickCount: number
  isPaused: boolean
  teams: TeamData[]
  activeFlags: ActiveFlag[]
  attacks: AttackLog[]
  services: { key: string; name: string; port: number }[]
}

const ADAdmin: FC = () => {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [flagFilter, setFlagFilter] = useState('')

  // Warfare Simulator states
  const [simAttacker, setSimAttacker] = useState('7') // Z3RODAY default
  const [simVictim, setSimVictim] = useState('5') // WilSec - BOEDOET 47 default
  const [simService, setSimService] = useState('simple-pwn')
  const [simFiring, setSimFiring] = useState(false)

  // Polling data
  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/ad/admin/overview')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchOverview()
    const timer = setInterval(fetchOverview, 1500)
    return () => clearInterval(timer)
  }, [])

  // Admin Actions
  const handleControl = async (action: string, payload: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ad/admin/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      })
      const result = await res.json()
      if (res.ok) {
        notifications.show({
          color: 'teal',
          title: 'Kontrol Engine Sukses',
          message: result.message || 'Perubahan berhasil diterapkan.',
          icon: <Icon path={mdiCheck} size={1} />,
        })
        fetchOverview()
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Gagal Mengubah Engine',
        message: e.message || 'Terjadi kesalahan sistem.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFireStrike = async () => {
    setSimFiring(true)
    try {
      const res = await fetch('/api/ad/admin/trigger-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: parseInt(simAttacker),
          to: parseInt(simVictim),
          svc: simService,
        }),
      })
      const result = await res.json()
      if (result.success) {
        notifications.show({
          color: 'orange',
          title: '🚀 MISIL ICBM DILUNCURKAN!',
          message: `Serangan ${result.attack.text} berhasil ditrigger ke Attack Map proyektor!`,
          icon: <Icon path={mdiRocketLaunch} size={1} />,
        })
        fetchOverview()
      }
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Gagal Menembak Misil',
        message: e.message,
      })
    } finally {
      setSimFiring(false)
    }
  }

  const handleUpdateTeam = async (teamId: number, status?: AdStatus, scoreDelta?: number) => {
    try {
      const res = await fetch('/api/ad/admin/team-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status, scoreDelta }),
      })
      if (res.ok) {
        fetchOverview()
      }
    } catch {
      // ignore
    }
  }

  const confirmReset = () => {
    modals.openConfirmModal({
      title: 'Reset Seluruh Babak Final A&D?',
      children: (
        <Text size="sm">
          Aksi ini akan mereset skor semua tim kembali ke nilai awal (50.000 poin), mengembalikan Round ke 1 dan Tick ke
          1, serta menghapus riwayat serangan. Apakah Anda yakin?
        </Text>
      ),
      labels: { confirm: 'Ya, Reset Game', cancel: 'Batal' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleControl('reset'),
    })
  }

  const round = data?.round ?? 19
  const tick = data?.tick ?? 2
  const maxTick = data?.maxTick ?? 5
  const secondsLeft = data?.secondsLeft ?? 60
  const tickSeconds = data?.tickSeconds ?? 60
  const isPaused = data?.isPaused ?? false
  const teams = data?.teams ?? []
  const attacks = data?.attacks ?? []
  const activeFlags = data?.activeFlags ?? []
  const services = data?.services ?? [
    { key: 'simple-crypto', name: 'simple-crypto', port: 6969 },
    { key: 'simple-pwn', name: 'simple-pwn', port: 7070 },
    { key: 'simple-web', name: 'simple-web', port: 1337 },
    { key: 'coloring', name: 'coloring', port: 8082 },
  ]

  const progressPct = Math.max(0, Math.min(100, ((tickSeconds - secondsLeft) / tickSeconds) * 100))

  const filteredFlags = activeFlags.filter(
    (f) =>
      f.flag.toLowerCase().includes(flagFilter.toLowerCase()) ||
      f.teamName.toLowerCase().includes(flagFilter.toLowerCase()) ||
      f.serviceKey.toLowerCase().includes(flagFilter.toLowerCase())
  )

  return (
    <AdminPage>
      <Stack gap="md" w="100%" pb="3rem">
        {/* WAR ROOM TOP CONTROL DECK */}
        <Paper
          p="md"
          radius="md"
          style={{
            backgroundColor: '#0c1315',
            border: '1px solid #1a332d',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            {/* Status & Clock */}
            <Group gap="md">
              <ThemeIcon
                size="xl"
                radius="md"
                variant="filled"
                color={isPaused ? 'orange' : 'teal'}
                style={{
                  boxShadow: isPaused ? '0 0 15px rgba(253, 126, 20, 0.4)' : '0 0 15px rgba(32, 201, 151, 0.4)',
                }}
              >
                <Icon path={isPaused ? mdiPause : mdiNuke} size={1.2} />
              </ThemeIcon>

              <Stack gap={2}>
                <Group gap="xs">
                  <Title order={3} style={{ fontFamily: 'monospace', color: '#fff', letterSpacing: '0.04em' }}>
                    WAR ROOM · A&D ENGINE CONTROL
                  </Title>
                  <Badge
                    size="sm"
                    color={isPaused ? 'orange' : 'teal'}
                    variant="dot"
                    style={{ fontFamily: 'monospace', fontWeight: 800 }}
                  >
                    {isPaused ? 'ENGINE PAUSED' : 'LIVE RUNNING'}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  Babak Final Cybersecurity IONIC 2026 · Realtime Tick & Checker Orchestrator
                </Text>
              </Stack>
            </Group>

            {/* Quick Actions */}
            <Group gap="xs" wrap="wrap">
              <Button
                size="xs"
                variant="filled"
                color={isPaused ? 'teal' : 'yellow'}
                leftSection={<Icon path={isPaused ? mdiPlay : mdiPause} size={0.7} />}
                loading={loading}
                onClick={() => handleControl(isPaused ? 'resume' : 'pause')}
              >
                {isPaused ? 'Resume Engine' : 'Pause Engine'}
              </Button>

              <Button
                size="xs"
                variant="default"
                leftSection={<Icon path={mdiFastForward} size={0.7} />}
                loading={loading}
                onClick={() => handleControl('next-tick')}
              >
                Force Next Tick
              </Button>

              <Button
                size="xs"
                variant="subtle"
                color="red"
                leftSection={<Icon path={mdiRefresh} size={0.7} />}
                onClick={confirmReset}
              >
                Reset Match
              </Button>

              <Button
                size="xs"
                variant="gradient"
                gradient={{ from: 'teal', to: 'cyan' }}
                component="a"
                href="/game/attack"
                target="_blank"
                leftSection={<Icon path={mdiOpenInNew} size={0.7} />}
              >
                Layar Proyektor (Map)
              </Button>
            </Group>
          </Group>

          {/* Clock & Timer Indicators */}
          <Divider my="sm" color="#162723" />

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
            <Card p="xs" radius="sm" style={{ backgroundColor: '#070c0d', border: '1px solid #142421' }}>
              <Text size="xs" c="dimmed" fw={600}>
                CURRENT ROUND
              </Text>
              <Text size="xl" fw={900} ff="monospace" c="#20c997">
                Round {round}
              </Text>
            </Card>

            <Card p="xs" radius="sm" style={{ backgroundColor: '#070c0d', border: '1px solid #142421' }}>
              <Text size="xs" c="dimmed" fw={600}>
                TICK IN ROUND
              </Text>
              <Text size="xl" fw={900} ff="monospace" c="#4dabf7">
                Tick {tick} / {maxTick}{' '}
                <Text span size="xs" c="dimmed">
                  (Total #{data?.totalTickCount ?? 92})
                </Text>
              </Text>
            </Card>

            <Card p="xs" radius="sm" style={{ backgroundColor: '#070c0d', border: '1px solid #142421' }}>
              <Group justify="space-between" align="center">
                <Text size="xs" c="dimmed" fw={600}>
                  NEXT TICK IN
                </Text>
                <Text size="xs" fw={700} ff="monospace" c="#fab005">
                  {secondsLeft}s left
                </Text>
              </Group>
              <Progress value={progressPct} color="teal" size="sm" mt={6} radius="xl" animated={!isPaused} />
            </Card>

            <Card p="xs" radius="sm" style={{ backgroundColor: '#070c0d', border: '1px solid #142421' }}>
              <Group justify="space-between" align="center">
                <Text size="xs" c="dimmed" fw={600}>
                  TICK SPEED
                </Text>
                <Select
                  size="xs"
                  w={95}
                  data={[
                    { value: '30', label: '30 dtk' },
                    { value: '60', label: '60 dtk' },
                    { value: '120', label: '2 mnt' },
                    { value: '300', label: '5 mnt' },
                  ]}
                  value={tickSeconds.toString()}
                  onChange={(val) => val && handleControl('set-tick-seconds', { tickSeconds: parseInt(val) })}
                  styles={{
                    input: {
                      backgroundColor: '#0a1413',
                      borderColor: '#19332c',
                      color: '#20c997',
                      fontSize: '11px',
                    },
                  }}
                />
              </Group>
            </Card>
          </SimpleGrid>
        </Paper>

        {/* TABS SECTIONS */}
        <Tabs defaultValue="simulator" color="teal">
          <Tabs.List style={{ borderColor: '#162723' }}>
            <Tabs.Tab value="simulator" leftSection={<Icon path={mdiRocketLaunch} size={0.7} />}>
              Warfare Simulator (Tes Serangan)
            </Tabs.Tab>
            <Tabs.Tab value="flags" leftSection={<Icon path={mdiSwordCross} size={0.7} />}>
              Active Flags Vault ({activeFlags.length})
            </Tabs.Tab>
            <Tabs.Tab value="teams" leftSection={<Icon path={mdiShieldCheckOutline} size={0.7} />}>
              Tim & SLA Matrix ({teams.length})
            </Tabs.Tab>
            <Tabs.Tab value="logs" leftSection={<Icon path={mdiShieldAlertOutline} size={0.7} />}>
              Live Submission Log ({attacks.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: WARFARE SIMULATOR */}
          <Tabs.Panel value="simulator" pt="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#0b1315', border: '1px solid #162723' }}>
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Box>
                    <Title order={4} c="#20c997" ff="monospace">
                      🚀 ICBM MISSILE LAUNCH SIMULATOR
                    </Title>
                    <Text size="xs" c="dimmed">
                      Gunakan fitur ini untuk mensimulasikan tembakan serangan antar pulau secara instan. Berguna saat gladi
                      bersih atau mengetes tampilan animasi misil pada layar proyektor.
                    </Text>
                  </Box>
                </Group>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                  <Select
                    label="Tim Penyerang (Attacker)"
                    description="Pulau asal peluncuran misil"
                    data={teams.map((t) => ({ value: t.id.toString(), label: `#${t.rank} ${t.name} (${t.school})` }))}
                    value={simAttacker}
                    onChange={(val) => val && setSimAttacker(val)}
                  />

                  <Select
                    label="Tim Korban (Victim)"
                    description="Pulau target ledakan nuke"
                    data={teams.map((t) => ({ value: t.id.toString(), label: `#${t.rank} ${t.name} (${t.school})` }))}
                    value={simVictim}
                    onChange={(val) => val && setSimVictim(val)}
                  />

                  <Select
                    label="Layanan Target (Service)"
                    description="Service yang berhasil dieksploitasi"
                    data={services.map((s) => ({ value: s.key, label: `${s.name} (Port ${s.port})` }))}
                    value={simService}
                    onChange={(val) => val && setSimService(val)}
                  />
                </SimpleGrid>

                <Button
                  size="md"
                  color="teal"
                  loading={simFiring}
                  leftSection={<Icon path={mdiRocketLaunch} size={0.9} />}
                  onClick={handleFireStrike}
                  style={{
                    backgroundColor: '#20c997',
                    color: '#040b09',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                  }}
                >
                  TEMBAKKAN MISIL ICBM STRIKE SEKARANG
                </Button>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* TAB 2: ACTIVE FLAGS VAULT */}
          <Tabs.Panel value="flags" pt="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#0b1315', border: '1px solid #162723' }}>
              <Stack gap="sm">
                <Group justify="space-between" align="center" wrap="wrap">
                  <Box>
                    <Title order={4} c="#20c997" ff="monospace">
                      🔑 ACTIVE FLAGS VAULT (TICK #{data?.totalTickCount ?? 92})
                    </Title>
                    <Text size="xs" c="dimmed">
                      Semua flag yang sedang aktif ditanam pada tick ini. Flag akan otomatis berganti dan kedaluwarsa pada tick
                      berikutnya.
                    </Text>
                  </Box>

                  <TextInput
                    placeholder="Filter tim, service, atau flag..."
                    size="xs"
                    w={280}
                    value={flagFilter}
                    onChange={(e) => setFlagFilter(e.currentTarget.value)}
                  />
                </Group>

                <ScrollArea h={420}>
                  <Table highlightOnHover striped withTableBorder styles={{ table: { fontSize: '12px' } }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Tim Pemilik Service</Table.Th>
                        <Table.Th>Service</Table.Th>
                        <Table.Th>Flag Rahasia</Table.Th>
                        <Table.Th>Planted Tick</Table.Th>
                        <Table.Th>Expires Tick</Table.Th>
                        <Table.Th>Status Tangkapan</Table.Th>
                        <Table.Th>Aksi</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredFlags.map((item, idx) => (
                        <Table.Tr key={idx}>
                          <Table.Td>
                            <Text fw={700} size="xs">
                              {item.teamName}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge size="xs" color="cyan" variant="outline">
                              {item.serviceKey}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Code c="teal" fw={700}>
                              {item.flag}
                            </Code>
                          </Table.Td>
                          <Table.Td>#{item.plantedTick}</Table.Td>
                          <Table.Td>#{item.expiresTick}</Table.Td>
                          <Table.Td>
                            {item.capturedBy.length > 0 ? (
                              <Badge size="xs" color="red">
                                Dicuri {item.capturedBy.length} tim
                              </Badge>
                            ) : (
                              <Badge size="xs" color="green">
                                Aman (Uncaptured)
                              </Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <CopyButton value={item.flag}>
                              {({ copied, copy }) => (
                                <ActionIcon size="sm" variant="subtle" color={copied ? 'teal' : 'gray'} onClick={copy}>
                                  <Icon path={copied ? mdiCheck : mdiContentCopy} size={0.7} />
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* TAB 3: TIM & SLA MATRIX */}
          <Tabs.Panel value="teams" pt="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#0b1315', border: '1px solid #162723' }}>
              <Stack gap="sm">
                <Title order={4} c="#20c997" ff="monospace">
                  🛡️ STATUS SLA & SKOR TIM FINALIS
                </Title>
                <Text size="xs" c="dimmed">
                  Kelola status ketersediaan service tim dan penyesuaian skor manual secara langsung.
                </Text>

                <ScrollArea h={420}>
                  <Table highlightOnHover striped withTableBorder styles={{ table: { fontSize: '12px' } }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Rank</Table.Th>
                        <Table.Th>Nama Tim</Table.Th>
                        <Table.Th>Sekolah</Table.Th>
                        <Table.Th>IP Host</Table.Th>
                        <Table.Th>Skor Saat Ini</Table.Th>
                        <Table.Th>Status SLA</Table.Th>
                        <Table.Th>Koreksi Skor</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {teams.map((team) => (
                        <Table.Tr key={team.id}>
                          <Table.Td>
                            <Badge size="sm" color={team.rank <= 3 ? 'yellow' : 'gray'}>
                              #{team.rank}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={700} size="xs">
                              {team.name}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs" c="dimmed">
                              {team.school}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Code>{team.ip}</Code>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={800} c="teal" ff="monospace">
                              {team.score.toLocaleString()} pts
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              w={130}
                              data={['Operational', 'Mumble', 'Offline', 'Recovering']}
                              value={team.status}
                              onChange={(val) => val && handleUpdateTeam(team.id, val as AdStatus)}
                              styles={{
                                input: {
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color:
                                    team.status === 'Operational'
                                      ? '#20c997'
                                      : team.status === 'Mumble'
                                        ? '#fab005'
                                        : '#fa5252',
                                },
                              }}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <ActionIcon
                                size="sm"
                                color="teal"
                                variant="light"
                                onClick={() => handleUpdateTeam(team.id, undefined, 100)}
                              >
                                <Icon path={mdiPlus} size={0.7} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                color="red"
                                variant="light"
                                onClick={() => handleUpdateTeam(team.id, undefined, -100)}
                              >
                                <Icon path={mdiMinus} size={0.7} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* TAB 4: LIVE LOGS */}
          <Tabs.Panel value="logs" pt="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#0b1315', border: '1px solid #162723' }}>
              <Stack gap="sm">
                <Title order={4} c="#20c997" ff="monospace">
                  📡 LIVE WARFARE & SUBMISSION AUDIT LOG
                </Title>
                <Text size="xs" c="dimmed">
                  Daftar stream serangan dan flag capture terkini yang tercatat pada engine.
                </Text>

                <ScrollArea h={420}>
                  <Stack gap="xs">
                    {attacks.map((atk) => (
                      <Paper
                        key={atk.id}
                        p="xs"
                        radius="xs"
                        style={{
                          backgroundColor: '#070c0e',
                          border: '1px solid #132420',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                        }}
                      >
                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <Text c="dimmed" size="xs">
                              [{atk.time}]
                            </Text>
                            <Badge size="xs" color="teal" variant="filled">
                              {atk.service}
                            </Badge>
                            <Text fw={700} c="#e6e7e9">
                              {atk.text}
                            </Text>
                          </Group>
                          <Badge size="xs" color="orange" variant="light">
                            FLAG CAPTURED (+100 PTS)
                          </Badge>
                        </Group>
                      </Paper>
                    ))}
                    {!attacks.length && (
                      <Text size="xs" c="dimmed" ta="center" py="xl">
                        Belum ada serangan yang tercatat.
                      </Text>
                    )}
                  </Stack>
                </ScrollArea>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </AdminPage>
  )
}

export default ADAdmin
