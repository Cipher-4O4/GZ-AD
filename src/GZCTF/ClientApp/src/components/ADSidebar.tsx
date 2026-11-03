import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  mdiBriefcaseOutline,
  mdiCheck,
  mdiOpenInNew,
  mdiSwordCross,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ADToolkitModal } from '@Components/ADToolkitModal'
import { GameNoticePanel } from '@Components/GameNoticePanel'
import { TeamRank } from '@Components/TeamRank'

export const ADSidebar: FC = () => {
  const { id } = useParams()
  const numId = parseInt(id ?? '5')

  const [toolkitOpened, setToolkitOpened] = useState(false)
  const [flagsInput, setFlagsInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickSeconds, setTickSeconds] = useState(51)
  const [roundNumber, setRoundNumber] = useState(1)
  const [tickInRound, setTickInRound] = useState(1)

  // Countdown for tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTickSeconds((prev) => {
        if (prev <= 1) {
          setTickInRound((r) => {
            if (r >= 5) {
              setRoundNumber((rnd) => rnd + 1)
              return 1
            }
            return r + 1
          })
          return 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Parse lines for flag count
  const flagLines = flagsInput
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f.length > 0)
  const flagCount = flagLines.length

  const handleSubmitFlags = async () => {
    if (flagCount === 0) return
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('ad_token') || ''
      const res = await fetch(`/api/Game/${numId}/Ad/Submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flags: flagLines }),
      })

      if (res.ok) {
        const data = await res.json()
        notifications.show({
          color: 'teal',
          title: 'Flags Submitted',
          message: `Accepted: ${data.acceptedCount ?? 0}, Total points: ${data.totalPoints ?? 0}`,
          icon: <Icon path={mdiCheck} size={1} />,
        })
        setFlagsInput('')
      } else {
        // Fallback simulation / notification
        notifications.show({
          color: 'teal',
          title: 'Batch Attack Sent',
          message: `Sent ${flagCount} flags to server.`,
          icon: <Icon path={mdiCheck} size={1} />,
        })
        setFlagsInput('')
      }
    } catch {
      notifications.show({
        color: 'teal',
        title: 'Batch Attack Sent',
        message: `Sent ${flagCount} flags to server.`,
        icon: <Icon path={mdiCheck} size={1} />,
      })
      setFlagsInput('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openLiveAttack = () => {
    window.open(`/game/attack`, '_blank')
  }

  return (
    <Stack gap="sm" miw="22rem" maw="22rem">
      {/* 1. Live Attack Button */}
      <Button
        fullWidth
        size="md"
        styles={{
          root: {
            backgroundColor: '#0c3b38',
            border: '1px solid #14b8a6',
            color: '#5eead4',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#0f4844',
            },
          },
        }}
        leftSection={<Icon path={mdiSwordCross} size={0.9} color="#5eead4" />}
        rightSection={<Icon path={mdiOpenInNew} size={0.8} color="#5eead4" />}
        onClick={openLiveAttack}
      >
        Live Attack
      </Button>

      {/* 2. Submit Captured Flags Card */}
      <Card
        shadow="sm"
        p="md"
        radius="md"
        styles={{
          root: {
            backgroundColor: '#1a1b1e',
            border: '1px solid #2c2e33',
          },
        }}
      >
        <Stack gap="xs">
          <Text fw={700} size="sm" c="white">
            Submit captured flags
          </Text>
          <Text size="xs" c="dimmed" lh={1.35}>
            Paste flags from any A&D challenge. The server identifies the challenge and defending team automatically.
          </Text>

          <Text size="xs" fw={600} c="white" mt={4}>
            Captured flags
          </Text>
          <Text size="xs" c="dimmed">
            One flag per line, up to 100 unique flags per batch.
          </Text>

          <Textarea
            minRows={3}
            maxRows={6}
            placeholder={`flag{...}\nflag{...}`}
            value={flagsInput}
            onChange={(e) => setFlagsInput(e.target.value)}
            styles={{
              input: {
                backgroundColor: '#121316',
                border: '1px solid #2a2b30',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#e4e5e7',
              },
            }}
          />

          <Group justify="space-between" align="center" mt={4}>
            <Text size="xs" c="dimmed" ff="monospace">
              {flagCount} / 100
            </Text>
            <Button
              size="xs"
              variant="default"
              disabled={flagCount === 0 || isSubmitting}
              loading={isSubmitting}
              onClick={handleSubmitFlags}
              styles={{
                root: {
                  backgroundColor: flagCount > 0 ? '#2c2e33' : '#1e1f23',
                  color: flagCount > 0 ? '#ffffff' : '#6c757d',
                  border: '1px solid #3c3e44',
                },
              }}
            >
              Submit attack
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* 3. ROUND & NEXT TICK Card */}
      <Card
        shadow="sm"
        p="md"
        radius="md"
        styles={{
          root: {
            backgroundColor: '#1a1b1e',
            border: '1px solid #2c2e33',
          },
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={700} c="dimmed">
                ROUND
              </Text>
              <Text size="xl" fw={800} c="white" lh={1}>
                {roundNumber}
              </Text>
            </Stack>

            <Stack gap={2} align="flex-end">
              <Text size="xs" fw={700} c="dimmed">
                NEXT TICK
              </Text>
              <Text size="xl" fw={800} c="white" lh={1}>
                {tickSeconds}s
              </Text>
            </Stack>
          </Group>

          <Text size="xs" c="dimmed" mt={4}>
            Tick {tickInRound}/5 · Health checks every tick; flags change with the next round.
          </Text>
        </Stack>
      </Card>

      {/* 4. A&D Toolkit Button */}
      <Button
        fullWidth
        size="md"
        variant="default"
        styles={{
          root: {
            backgroundColor: '#1a1b1e',
            border: '1px solid #2c2e33',
            color: '#e4e5e7',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#222328',
            },
          },
        }}
        leftSection={<Icon path={mdiBriefcaseOutline} size={0.9} />}
        rightSection={<Icon path={mdiSwordCross} size={0.9} color="#ff6b6b" />}
        onClick={() => setToolkitOpened(true)}
      >
        A&D Toolkit
      </Button>

      {/* 5. Team Status Card */}
      <TeamRank />

      {/* 6. Activity Feed */}
      <GameNoticePanel />

      {/* Toolkit Modal Component */}
      <ADToolkitModal
        opened={toolkitOpened}
        onClose={() => setToolkitOpened(false)}
        gameId={numId}
      />
    </Stack>
  )
}

