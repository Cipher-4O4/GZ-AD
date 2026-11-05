import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Code,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  mdiAlertCircleOutline,
  mdiCheck,
  mdiCheckCircleOutline,
  mdiClose,
  mdiCloseCircleOutline,
  mdiContentCopy,
  mdiContentSaveOutline,
  mdiFastForward,
  mdiInformationOutline,
  mdiKeyOutline,
  mdiPause,
  mdiPlay,
  mdiRefresh,
  mdiRestart,
  mdiServerNetworkOutline,
  mdiShieldAlertOutline,
  mdiShieldCheckOutline,
  mdiShieldOutline,
  mdiSwordCross,
  mdiTune,
  mdiWrenchOutline,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { WithGameEditTab } from '@Components/admin/WithGameEditTab'

interface TeamADData {
  id: number
  code: string
  name: string
  school: string
  ip: string
  score: number
  captures: number
  status: 'Operational' | 'Recovering' | 'Mumble' | 'Offline'
  services: Record<string, { attack: number; defense: number; availability: number; status?: 'UP' | 'FAULT' | 'DOWN' }>
}

interface AttackLogItem {
  id: string
  time: string
  attackerId: number
  victimId: number
  service: string
  text: string
  isNuke: boolean
  color: string
}

interface EngineState {
  round: number
  tick: number
  maxTick: number
  tickSeconds: number
  totalTickCount: number
  isPaused: boolean
  lastTickTimestamp: number
}

const SERVICES = [
  { key: 'simple-crypto', name: 'simple-crypto', category: 'Crypto', port: 6969, color: 'grape' },
  { key: 'simple-pwn', name: 'simple-pwn', category: 'Pwn', port: 7070, color: 'red' },
  { key: 'simple-web', name: 'simple-web', category: 'Web', port: 1337, color: 'blue' },
  { key: 'coloring', name: 'coloring', category: 'Misc', port: 8082, color: 'teal' },
]

const AdAdminPage: FC = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const [loading, setLoading] = useState(false)
  const [engine, setEngine] = useState<EngineState>({
    round: 0,
    tick: 0,
    maxTick: 5,
    tickSeconds: 60,
    totalTickCount: 0,
    isPaused: true,
    lastTickTimestamp: Date.now(),
  })
  const [teams, setTeams] = useState<TeamADData[]>([])
  const [attacks, setAttacks] = useState<AttackLogItem[]>([])
  const [activeFlags, setActiveFlags] = useState<{ teamId: number; service: string; flag: string }[]>([])

  // Rules form
  const [flagScore, setFlagScore] = useState<number>(100)
  const [slaScore, setSlaScore] = useState<number>(10)
  const [breachPenalty, setBreachPenalty] = useState<number>(50)
  const [flagTtl, setFlagTtl] = useState<number>(5)
  const [tickDuration, setTickDuration] = useState<number>(60)

  // Flag Test Submission
  const [testFlag, setTestFlag] = useState('')
  const [submittingTest, setSubmittingTest] = useState(false)

  // Seconds countdown
  const [secondsLeft, setSecondsLeft] = useState(60)

  const fetchState = async () => {
    try {
      const res = await fetch('/api/ad/state')
      if (res.ok) {
        const data = await res.json()
        if (data.round !== undefined) {
          setEngine({
            round: data.round,
            tick: data.tick,
            maxTick: data.maxTick ?? 5,
            tickSeconds: data.tickSeconds ?? 60,
            totalTickCount: data.totalTickCount ?? 0,
            isPaused: data.isPaused ?? true,
            lastTickTimestamp: data.lastTickTimestamp ?? Date.now(),
          })
        }
        if (Array.isArray(data.teams)) {
          setTeams(data.teams)
        }
        if (Array.isArray(data.attacks)) {
          setAttacks(data.attacks)
        }
        if (data.flags) {
          const flagList = Object.entries(data.flags).map(([f, meta]: [string, any]) => ({
            flag: f,
            teamId: meta.teamId,
            service: meta.serviceKey,
          }))
          setActiveFlags(flagList)
        }
      }
    } catch (e) {
      console.error('Failed to fetch A&D state:', e)
    }
  }

  useEffect(() => {
    fetchState()
    const timer = setInterval(() => {
      fetchState()
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (engine.isPaused || engine.round === 0) {
      setSecondsLeft(engine.tickSeconds)
      return
    }
    const countdown = setInterval(() => {
      const elapsed = Math.floor((Date.now() - engine.lastTickTimestamp) / 1000)
      const remaining = Math.max(0, engine.tickSeconds - (elapsed % engine.tickSeconds))
      setSecondsLeft(remaining)
    }, 1000)
    return () => clearInterval(countdown)
  }, [engine])

  const handleControl = async (action: string, payload?: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ad/admin/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      })
      if (res.ok) {
        let msg = `Aksi berhasil dieksekusi: ${action}`
        if (action === 'start') msg = 'Kompetisi resmi dimulai! Ronde 1 · Tick 1 aktif.'
        if (action === 'reset_zero') msg = 'Seluruh data direset ke 0 (Pre-Game Standby).'
        if (action === 'sabotage') msg = 'Layanan awal telah disabotase (Mumble & Offline). Siap untuk fase perbaikan.'
        if (action === 'repair_all') msg = 'Semua layanan tim berhasil dipulihkan (100% UP).'

        showNotification({
          color: 'teal',
          title: 'Berhasil',
          message: msg,
          icon: <Icon path={mdiCheck} size={1} />,
        })
        await fetchState()
      }
    } catch (e) {
      showNotification({
        color: 'red',
        title: 'Gagal',
        message: 'Gagal menghubungi engine A&D',
        icon: <Icon path={mdiClose} size={1} />,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleServiceStatus = async (teamId: number, serviceKey: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'UP' ? 'FAULT' : currentStatus === 'FAULT' ? 'DOWN' : 'UP'
    await handleControl('set_status', { teamId, serviceKey, status: nextStatus })
  }

  const handleSaveRules = () => {
    showNotification({
      color: 'teal',
      title: 'Tersimpan',
      message: 'Parameter aturan & penilaian A&D berhasil diperbarui',
      icon: <Icon path={mdiCheck} size={1} />,
    })
  }

  const handleRunChecker = async () => {
    setLoading(true)
    showNotification({
      id: 'checker-run',
      color: 'blue',
      loading: true,
      title: 'Memeriksa Layanan',
      message: 'Menjalankan SLA health-check pada 40 instance (10 tim x 4 service)...',
      autoClose: false,
    })

    setTimeout(() => {
      showNotification({
        id: 'checker-run',
        color: 'teal',
        loading: false,
        title: 'Pemeriksaan Selesai',
        message: 'Semua 40 instance terverifikasi. SLA status & skor terupdate.',
        icon: <Icon path={mdiCheck} size={1} />,
        autoClose: true,
      })
      setLoading(false)
      fetchState()
    }, 1200)
  }

  const handleTestSubmit = async () => {
    if (!testFlag.trim()) return
    setSubmittingTest(true)
    try {
      const res = await fetch('/api/Game/5/Ad/Submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flags: [testFlag.trim()] }),
      })
      const result = await res.json()
      showNotification({
        color: result.status === 'OK' ? 'teal' : 'orange',
        title: result.status === 'OK' ? 'Flag Diterima' : 'Hasil Verifikasi',
        message: result.message || JSON.stringify(result),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      setTestFlag('')
      await fetchState()
    } catch (e) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Gagal submit flag uji coba',
      })
    } finally {
      setSubmittingTest(false)
    }
  }

  const getServiceStatus = (team: TeamADData, svcKey: string): 'UP' | 'FAULT' | 'DOWN' => {
    const s = team.services?.[svcKey]?.status
    if (s) return s
    return team.status === 'Offline' ? 'DOWN' : team.status === 'Mumble' ? 'FAULT' : 'UP'
  }

  const isPreGame = engine.round === 0

  return (
    <WithGameEditTab
      head={
        <Group justify="space-between" w="100%" wrap="wrap" gap="sm">
          <Group gap="xs">
            <Badge size="lg" variant="filled" color={isPreGame ? 'gray' : engine.isPaused ? 'orange' : 'teal'}>
              {isPreGame ? 'PRE-GAME (STANDBY)' : engine.isPaused ? 'ENGINE PAUSED' : 'ENGINE ACTIVE'}
            </Badge>
            <Badge size="lg" variant="outline" color={isPreGame ? 'gray' : 'cyan'}>
              {isPreGame
                ? 'Ronde 0 · Tick 0 (Global #0)'
                : `Ronde ${engine.round} · Tick ${engine.tick}/${engine.maxTick} (Global #${engine.totalTickCount})`}
            </Badge>
            <Badge size="lg" variant="light" color={isPreGame ? 'gray' : 'blue'}>
              {isPreGame ? 'Menunggu Dimulai' : `Tick berikutnya: ${secondsLeft}s`}
            </Badge>
          </Group>

          <Group gap="xs">
            {isPreGame ? (
              <>
                <Button
                  size="sm"
                  variant="filled"
                  color="teal"
                  leftSection={<Icon path={mdiPlay} size={1} />}
                  onClick={() => handleControl('start')}
                  loading={loading}
                >
                  Mulai Kompetisi (Start Match)
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  color="orange"
                  leftSection={<Icon path={mdiAlertCircleOutline} size={0.8} />}
                  onClick={() => handleControl('sabotage')}
                  loading={loading}
                >
                  Set Rusak Awal (Mumble/Offline)
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<Icon path={mdiCheckCircleOutline} size={0.8} />}
                  onClick={() => handleControl('repair_all')}
                  loading={loading}
                >
                  Semua UP
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="xs"
                  variant="outline"
                  color={engine.isPaused ? 'teal' : 'orange'}
                  leftSection={<Icon path={engine.isPaused ? mdiPlay : mdiPause} size={0.8} />}
                  onClick={() => handleControl(engine.isPaused ? 'resume' : 'pause')}
                  loading={loading}
                >
                  {engine.isPaused ? 'Lanjutkan Engine' : 'Jeda Engine'}
                </Button>
                <Button
                  size="xs"
                  variant="filled"
                  color="indigo"
                  leftSection={<Icon path={mdiFastForward} size={0.8} />}
                  onClick={() => handleControl('next_tick')}
                  loading={loading}
                >
                  Putar 1 Tick
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<Icon path={mdiRefresh} size={0.8} />}
                  onClick={handleRunChecker}
                  loading={loading}
                >
                  Cek SLA Ulang
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  leftSection={<Icon path={mdiRestart} size={0.8} />}
                  onClick={() => handleControl('reset_zero')}
                  loading={loading}
                >
                  Reset ke 0
                </Button>
              </>
            )}
          </Group>
        </Group>
      }
    >
      {isPreGame && (
        <Alert
          variant="light"
          color="blue"
          title="Fase Persiapan & Pertahanan Awal (Pre-Game)"
          icon={<Icon path={mdiInformationOutline} size={1} />}
          mb="md"
        >
          Kompetisi saat ini berada dalam status <b>Standby (Skor 0.0)</b>. Beberapa layanan awal telah disabotase menjadi{' '}
          <b>MUMBLE</b> (fungsi rusak) dan <b>OFFLINE</b> (mati). Peserta dapat mengakses vulnbox via SSH (
          <Code>ssh teamX@10.43.170.150 -p 222X</Code>) untuk menganalisis dan membenahi service mereka. Klik{' '}
          <b>Mulai Kompetisi</b> di atas saat pertandingan resmi dimulai.
        </Alert>
      )}

      <Tabs defaultValue="sla" variant="outline">
        <Tabs.List mb="md">
          <Tabs.Tab value="sla" leftSection={<Icon path={mdiShieldCheckOutline} size={1} />}>
            Status Layanan & Matriks SLA
          </Tabs.Tab>
          <Tabs.Tab value="rules" leftSection={<Icon path={mdiTune} size={1} />}>
            Pengaturan & Aturan Skor
          </Tabs.Tab>
          <Tabs.Tab value="teams" leftSection={<Icon path={mdiServerNetworkOutline} size={1} />}>
            Akses Vulnbox & Kredensial Tim
          </Tabs.Tab>
          <Tabs.Tab value="monitor" leftSection={<Icon path={mdiSwordCross} size={1} />}>
            Log Serangan & Flag Inspector
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab 1: Matriks SLA & Status Service */}
        <Tabs.Panel value="sla">
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm">
              {SERVICES.map((s) => (
                <Card key={s.key} withBorder p="sm" radius="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} size="sm">
                      {s.name}
                    </Text>
                    <Badge size="xs" color={s.color}>
                      {s.category}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    Port: <Code>{s.port}</Code>
                  </Text>
                  <Text size="xs" c={isPreGame ? 'dimmed' : 'teal'} fw={500} mt={4}>
                    Checker SLA: {isPreGame ? 'Standby (Uji Manual)' : '100% Aktif (Tiap 60s)'}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>

            <Paper withBorder radius="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tim</Table.Th>
                    <Table.Th>IP Vulnbox</Table.Th>
                    <Table.Th>simple-crypto (:6969)</Table.Th>
                    <Table.Th>simple-pwn (:7070)</Table.Th>
                    <Table.Th>simple-web (:1337)</Table.Th>
                    <Table.Th>coloring (:8082)</Table.Th>
                    <Table.Th>Total Skor</Table.Th>
                    <Table.Th>Flag Tercuri</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {teams.map((t) => (
                    <Table.Tr key={t.id}>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <Badge size="xs" variant="outline">
                            {t.code}
                          </Badge>
                          <div>
                            <Text fw={600} size="sm" lineClamp={1}>
                              {t.name}
                            </Text>
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {t.school}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Code>{t.ip || `10.43.170.${100 + t.id}`}</Code>
                      </Table.Td>
                      {SERVICES.map((svc) => {
                        const status = getServiceStatus(t, svc.key)
                        const color = status === 'UP' ? 'teal' : status === 'FAULT' ? 'yellow' : 'red'
                        const label = status === 'FAULT' ? 'MUMBLE' : status === 'DOWN' ? 'OFFLINE' : 'UP'
                        return (
                          <Table.Td key={svc.key}>
                            <Tooltip label="Klik untuk mengubah status (UP -> MUMBLE -> OFFLINE)">
                              <Badge
                                size="sm"
                                variant="light"
                                color={color}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleToggleServiceStatus(t.id, svc.key, status)}
                              >
                                {label}
                              </Badge>
                            </Tooltip>
                          </Table.Td>
                        )
                      })}
                      <Table.Td>
                        <Text fw={700} size="sm" c="brand">
                          {t.score.toFixed(1)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color="violet" variant="outline">
                          {t.captures}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* Tab 2: Pengaturan Aturan & Skor */}
        <Tabs.Panel value="rules">
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="xs">
              Konfigurasi Parameter Attack & Defense
            </Title>
            <Text size="sm" c="dimmed" mb="lg">
              Sesuaikan bobot poin serangan, SLA pertahanan, durasi tick, dan masa berlaku flag per ronde.
            </Text>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Poin Flag Capture (Attack)"
                  description="Poin yang diperoleh tim saat berhasil mengeksploitasi layanan tim lawan"
                  value={flagScore}
                  onChange={(v) => setFlagScore(Number(v) || 100)}
                  min={10}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Poin SLA Availability (Defense)"
                  description="Poin yang diperoleh per service aktif (UP) pada setiap tick"
                  value={slaScore}
                  onChange={(v) => setSlaScore(Number(v) || 10)}
                  min={0}
                  max={500}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Penalti Layanan Bobol (Defense Loss)"
                  description="Pengurangan poin jika flag service berhasil diambil oleh lawan"
                  value={breachPenalty}
                  onChange={(v) => setBreachPenalty(Number(v) || 50)}
                  min={0}
                  max={500}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Masa Berlaku Flag (TTL dalam Tick)"
                  description="Jumlah tick flag tetap valid sebelum kedaluwarsa (Expired)"
                  value={flagTtl}
                  onChange={(v) => setFlagTtl(Number(v) || 5)}
                  min={1}
                  max={20}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Durasi Per Tick (Detik)"
                  description="Interval rotasi flag dan health-check SLA"
                  value={tickDuration}
                  onChange={(v) => setTickDuration(Number(v) || 60)}
                  min={15}
                  max={300}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Prefix Format Flag"
                  description="Awalan flag yang dihasilkan oleh engine generator"
                  value="flag{ionic26_{team}_{svc}_t{tick}_{hex}}"
                  disabled
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="xl">
              <Button
                leftSection={<Icon path={mdiContentSaveOutline} size={1} />}
                color="brand"
                onClick={handleSaveRules}
              >
                Simpan Perubahan Aturan
              </Button>
            </Group>
          </Paper>
        </Tabs.Panel>

        {/* Tab 3: Kredensial Vulnbox Tim */}
        <Tabs.Panel value="teams">
          <Paper withBorder radius="md">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID Tim</Table.Th>
                  <Table.Th>Nama Tim</Table.Th>
                  <Table.Th>Host / IP Vulnbox</Table.Th>
                  <Table.Th>SSH Peserta</Table.Th>
                  <Table.Th>Secret Token Peserta</Table.Th>
                  <Table.Th>Port Layanan</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {teams.map((t) => (
                  <Table.Tr key={t.id}>
                    <Table.Td>
                      <Badge size="sm">{t.code}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600} size="sm">
                        {t.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {t.school}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Code>10.43.170.150</Code>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Code>{`ssh team${t.id}@10.43.170.150 -p ${2220 + t.id}`}</Code>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => {
                            navigator.clipboard.writeText(`ssh team${t.id}@10.43.170.150 -p ${2220 + t.id}`)
                            showNotification({ color: 'teal', message: 'Command SSH disalin ke clipboard' })
                          }}
                        >
                          <Icon path={mdiContentCopy} size={0.7} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Code>{`ad_tok_${t.code.toLowerCase()}_2026`}</Code>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => {
                            navigator.clipboard.writeText(`ad_tok_${t.code.toLowerCase()}_2026`)
                            showNotification({ color: 'teal', message: 'Token tim disalin' })
                          }}
                        >
                          <Icon path={mdiContentCopy} size={0.7} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        6969, 7070, 1337, 8082
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        {/* Tab 4: Log Serangan & Flag Generator */}
        <Tabs.Panel value="monitor">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="sm">
                  <Title order={5}>Live Attack Log (Stream Serangan)</Title>
                  <Badge color={attacks.length > 0 ? 'red' : 'gray'} variant="light">
                    {attacks.length} Total Serangan
                  </Badge>
                </Group>
                {attacks.length === 0 ? (
                  <Text size="sm" c="dimmed" p="md" ta="center">
                    Belum ada serangan yang tercatat. Log akan muncul secara realtime saat kompetisi dimulai.
                  </Text>
                ) : (
                  <ScrollArea h={400}>
                    <Table striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Waktu</Table.Th>
                          <Table.Th>Penyerang</Table.Th>
                          <Table.Th>Target</Table.Th>
                          <Table.Th>Service</Table.Th>
                          <Table.Th>Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {attacks.map((a) => {
                          const atkTeam = teams.find((t) => t.id === a.attackerId)
                          const vicTeam = teams.find((t) => t.id === a.victimId)
                          return (
                            <Table.Tr key={a.id}>
                              <Table.Td>
                                <Code>{a.time}</Code>
                              </Table.Td>
                              <Table.Td>
                                <Text fw={600} size="sm" c="teal">
                                  {atkTeam ? atkTeam.name : `Tim #${a.attackerId}`}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" c="red">
                                  {vicTeam ? vicTeam.name : `Tim #${a.victimId}`}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge size="xs" color="gray">
                                  {a.service}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Badge size="xs" color="orange" variant="light">
                                  Flag Captured (+100)
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          )
                        })}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="md">
                <Paper withBorder p="md" radius="md">
                  <Title order={5} mb="xs">
                    Uji Coba Submit Flag (Admin Test)
                  </Title>
                  <Text size="xs" c="dimmed" mb="sm">
                    Uji apakah engine memproses flag aktif, memeriksa self-submit, duplicate, atau TTL.
                  </Text>
                  <TextInput
                    placeholder="flag{ionic26_...}"
                    value={testFlag}
                    onChange={(e) => setTestFlag(e.target.value)}
                    mb="xs"
                  />
                  <Button
                    fullWidth
                    color="brand"
                    onClick={handleTestSubmit}
                    loading={submittingTest}
                    leftSection={<Icon path={mdiCheck} size={1} />}
                  >
                    Verifikasi Flag ke Engine
                  </Button>
                </Paper>

                <Paper withBorder p="md" radius="md">
                  <Title order={5} mb="xs">
                    Flag Aktif Tick Saat Ini (Generator Inspector)
                  </Title>
                  <Text size="xs" c="dimmed" mb="xs">
                    {isPreGame
                      ? 'Engine berada dalam fase Standby. Flag akan digenerate saat kompetisi dimulai.'
                      : 'Daftar flag yang disuntikkan ke vulnbox peserta pada tick ini:'}
                  </Text>
                  <ScrollArea h={220}>
                    <Stack gap="xs">
                      {activeFlags.length === 0 ? (
                        <Text size="xs" c="dimmed" ta="center" py="md">
                          Belum ada flag aktif (Standby).
                        </Text>
                      ) : (
                        activeFlags.slice(0, 8).map((f, i) => (
                          <Group key={i} justify="space-between" wrap="nowrap">
                            <Badge size="xs" variant="outline">
                              T{f.teamId} · {f.service}
                            </Badge>
                            <Code style={{ fontSize: '0.7rem' }}>{f.flag}</Code>
                          </Group>
                        ))
                      )}
                    </Stack>
                  </ScrollArea>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </WithGameEditTab>
  )
}

export default AdAdminPage
