import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  PasswordInput,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { mdiBriefcaseOutline, mdiCheck, mdiClose, mdiKey, mdiOpenInNew, mdiSwordCross } from '@mdi/js'
import { Icon } from '@mdi/react'
import dayjs from 'dayjs'
import { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { ADToolkitModal } from '@Components/ADToolkitModal'
import { AdColors } from '@Utils/Ad'
import { OnceSWRConfig } from '@Hooks/useConfig'
import { useGameTeamInfo } from '@Hooks/useGame'
import api, { NoticeType } from '@Api'

type FeedTab = 'all' | 'notice' | 'berita' | 'challenge'

const FEED_TABS: Array<{ key: FeedTab; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'notice', label: 'Notice' },
  { key: 'berita', label: 'Berita' },
  { key: 'challenge', label: 'Challenge' },
]

const cardStyle = {
  backgroundColor: AdColors.surface,
  border: `1px solid ${AdColors.border}`,
} as const

export const ADSidebar: FC = () => {
  const { id } = useParams()
  const numId = parseInt(id ?? '5')

  const { teamInfo } = useGameTeamInfo(numId)
  const { data: notices } = api.game.useGameNotices(numId, {}, OnceSWRConfig)

  const [toolkitOpened, setToolkitOpened] = useState(false)
  const [flagsInput, setFlagsInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickSeconds, setTickSeconds] = useState(60)
  const [roundNumber, setRoundNumber] = useState(19)
  const [tickInRound, setTickInRound] = useState(2)
  const [feedTab, setFeedTab] = useState<FeedTab>('all')

  // Realtime Polling from A&D Engine
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/ad/state')
        if (!res.ok) return
        const data = await res.json()
        if (typeof data.round === 'number') setRoundNumber(data.round)
        if (typeof data.tick === 'number') setTickInRound(data.tick)
        if (typeof data.secondsLeft === 'number') setTickSeconds(data.secondsLeft)
      } catch (e) {
        // ignore
      }
    }
    fetchState()
    const interval = setInterval(fetchState, 1500)
    return () => clearInterval(interval)
  }, [])

  const flagLines = flagsInput
    .split('\n')
    .map((flag) => flag.trim())
    .filter((flag) => flag.length > 0)

  const handleSubmitFlags = async () => {
    if (!flagLines.length) return
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('ad_token') || ''
      const res = await fetch(`/api/Game/${numId}/Ad/Submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ flags: flagLines }),
      })

      if (!res.ok) throw new Error('submit failed')

      const data = await res.json()
      notifications.show({
        color: 'teal',
        title: 'Flags submitted',
        message: `Accepted: ${data.acceptedCount ?? 0} · Points: ${data.totalPoints ?? 0}`,
        icon: <Icon path={mdiCheck} size={1} />,
      })
      setFlagsInput('')
    } catch {
      notifications.show({
        color: 'red',
        title: 'Submission gagal',
        message: 'Tidak dapat menghubungi server A&D.',
        icon: <Icon path={mdiClose} size={1} />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const feed = useMemo(() => {
    const list = notices ?? []
    const filtered = list.filter((notice) => {
      if (feedTab === 'all') return true
      if (feedTab === 'challenge')
        return notice.type === NoticeType.NewChallenge || notice.type === NoticeType.NewHint
      if (feedTab === 'berita') return notice.type === NoticeType.Normal
      return (
        notice.type === NoticeType.FirstBlood ||
        notice.type === NoticeType.SecondBlood ||
        notice.type === NoticeType.ThirdBlood
      )
    })

    return [...filtered].sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())
  }, [notices, feedTab])

  const rank = teamInfo?.rank
  const solvedRatio = (rank?.solvedCount ?? 0) / (teamInfo?.challengeCount || 1)

  return (
    <Stack gap="sm" w="21rem" miw="21rem">
      {/* 1. Live attack */}
      <Button
        fullWidth
        size="md"
        radius={6}
        leftSection={<Icon path={mdiSwordCross} size={0.85} color={AdColors.primaryText} />}
        rightSection={<Icon path={mdiOpenInNew} size={0.7} color={AdColors.primaryText} />}
        onClick={() => window.open('/game/attack', '_blank')}
        styles={{
          root: {
            backgroundColor: '#0d3b33',
            border: `1px solid rgba(18, 184, 134, 0.55)`,
            color: AdColors.primaryText,
            fontWeight: 600,
          },
          label: { color: AdColors.primaryText },
        }}
      >
        Live Attack
      </Button>

      {/* 2. Captured flags */}
      <Card p="md" radius={8} styles={{ root: cardStyle }}>
        <Stack gap={6}>
          <Text fz={13} fw={700} style={{ color: AdColors.text }}>
            Submit captured flags
          </Text>
          <Text fz={11} lh={1.45} style={{ color: AdColors.dim }}>
            Paste flags from any A&amp;D challenge. The server identifies the challenge and defending team
            automatically.
          </Text>

          <Text fz={11} fw={700} mt={4} style={{ color: AdColors.text }}>
            Captured flags
          </Text>
          <Text fz={11} style={{ color: AdColors.dim }}>
            One flag per line, up to 100 unique flags per batch.
          </Text>

          <Textarea
            minRows={3}
            maxRows={5}
            autosize
            placeholder={'flag{...}\nflag{...}'}
            value={flagsInput}
            onChange={(event) => setFlagsInput(event.currentTarget.value)}
            styles={{
              input: {
                backgroundColor: '#0d0e11',
                border: `1px solid ${AdColors.border}`,
                color: AdColors.text,
                fontFamily: AdColors.mono,
                fontSize: 11,
              },
            }}
          />

          <Group justify="space-between" align="center" mt={2}>
            <Text ff="monospace" fz={10} style={{ color: AdColors.dimmer }}>
              {flagLines.length} / 100
            </Text>
            <Button
              size="compact-sm"
              radius={6}
              disabled={!flagLines.length || isSubmitting}
              loading={isSubmitting}
              onClick={handleSubmitFlags}
              styles={{
                root: {
                  backgroundColor: flagLines.length ? '#2b2d33' : '#1b1c21',
                  border: `1px solid ${flagLines.length ? '#3c3f47' : AdColors.borderSoft}`,
                  color: flagLines.length ? '#f1f3f5' : AdColors.dimmer,
                  fontSize: 12,
                  fontWeight: 600,
                },
              }}
            >
              Submit attack
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* 3. Round / tick */}
      <Card p="md" radius={8} styles={{ root: cardStyle }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={2}>
            <Text ff="monospace" fz={9} fw={700} style={{ letterSpacing: '0.14em', color: AdColors.dimmer }}>
              ROUND
            </Text>
            <Text ff="monospace" fz="1.4rem" fw={800} lh={1} style={{ color: '#fff' }}>
              {roundNumber}
            </Text>
          </Stack>
          <Stack gap={2} align="flex-end">
            <Text ff="monospace" fz={9} fw={700} style={{ letterSpacing: '0.14em', color: AdColors.dimmer }}>
              NEXT TICK
            </Text>
            <Text ff="monospace" fz="1.4rem" fw={800} lh={1} style={{ color: '#fff' }}>
              {tickSeconds}s
            </Text>
          </Stack>
        </Group>
        <Text fz={11} mt={8} style={{ color: AdColors.dim }}>
          Tick {tickInRound}/5 · Health checks every tick; flags change with the next round.
        </Text>
      </Card>

      {/* 4. Toolkit */}
      <Button
        fullWidth
        size="md"
        radius={6}
        variant="default"
        leftSection={<Icon path={mdiBriefcaseOutline} size={0.85} color={AdColors.text} />}
        rightSection={<Icon path={mdiClose} size={0.75} color={AdColors.danger} />}
        onClick={() => setToolkitOpened(true)}
        styles={{
          root: { ...cardStyle, color: AdColors.text, fontWeight: 600 },
          label: { color: AdColors.text },
        }}
      >
        A&amp;D Toolkit
      </Button>

      {/* 5. Team card */}
      <Card p="md" radius={8} styles={{ root: cardStyle }}>
        <Group gap={10} wrap="nowrap" mb={10}>
          <Avatar size={44} radius="xl" src={rank?.avatar || undefined} color="teal">
            {rank?.name?.slice(0, 1) ?? 'T'}
          </Avatar>
          <Text fz={15} fw={700} truncate style={{ color: '#fff' }}>
            {rank?.name ?? 'Team'}
          </Text>
        </Group>

        <Group grow gap={4} ta="center" mb={10}>
          {[
            ['Overall', rank?.rank ?? '-'],
            ['Skor', rank?.score ?? 0],
            ['Solved', rank?.solvedCount ?? 0],
          ].map(([label, value]) => (
            <Stack key={String(label)} gap={2} align="center">
              <Text ff="monospace" fz={14} fw={800} style={{ color: '#fff' }}>
                {value}
              </Text>
              <Text fz={10} style={{ color: AdColors.dimmer }}>
                {label}
              </Text>
            </Stack>
          ))}
        </Group>

        <Progress
          value={solvedRatio * 100}
          size={5}
          radius={3}
          styles={{ section: { backgroundColor: AdColors.primary }, root: { backgroundColor: '#23252b' } }}
        />

        <PasswordInput
          mt={10}
          value={teamInfo?.teamToken ?? 'ad_token'}
          readOnly
          size="xs"
          leftSection={<Icon path={mdiKey} size={0.7} color={AdColors.dimmer} />}
          styles={{
            input: {
              backgroundColor: 'transparent',
              border: 'none',
              color: AdColors.dim,
              fontFamily: AdColors.mono,
              fontSize: 11,
              paddingLeft: 26,
            },
            innerInput: { color: AdColors.dim, fontFamily: AdColors.mono },
            section: { color: AdColors.dimmer },
          }}
        />
      </Card>

      {/* 6. Feed */}
      <Card p="md" radius={8} styles={{ root: cardStyle }}>
        <Group gap={0} mb={8} wrap="nowrap">
          {FEED_TABS.map((tab) => {
            const active = feedTab === tab.key
            return (
              <Box
                key={tab.key}
                onClick={() => setFeedTab(tab.key)}
                px={10}
                py={6}
                style={{
                  cursor: 'pointer',
                  borderRadius: 5,
                  backgroundColor: active ? AdColors.primary : 'transparent',
                }}
              >
                <Text fz={11} fw={700} style={{ color: active ? '#06231c' : AdColors.dim }}>
                  {tab.label}
                </Text>
              </Box>
            )
          })}
        </Group>

        <ScrollArea h={180} scrollbarSize={4}>
          <Stack gap={10}>
            {feed.map((notice) => (
              <Group key={notice.id} gap={8} align="flex-start" wrap="nowrap">
                <Box pt={2}>
                  <Icon
                    path={notice.type === NoticeType.Normal ? mdiCheck : mdiSwordCross}
                    size={0.55}
                    color={notice.type === NoticeType.Normal ? AdColors.primary : AdColors.warning}
                  />
                </Box>
                <Stack gap={2} style={{ minWidth: 0 }}>
                  <Text ff="monospace" fz={9} style={{ color: AdColors.dimmer }}>
                    {dayjs(notice.time).format('DD/MM/YY HH.mm.ss')}
                  </Text>
                  <Text fz={11} lh={1.4} style={{ color: AdColors.dim }}>
                    {notice.values?.join(' ')}
                  </Text>
                </Stack>
              </Group>
            ))}
            {!feed.length && (
              <Text fz={11} style={{ color: AdColors.dimmer }}>
                Belum ada aktivitas.
              </Text>
            )}
          </Stack>
        </ScrollArea>
      </Card>

      <ADToolkitModal opened={toolkitOpened} onClose={() => setToolkitOpened(false)} gameId={numId} />
    </Stack>
  )
}
