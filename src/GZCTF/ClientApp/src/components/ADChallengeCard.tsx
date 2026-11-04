import { Box, Card, Group, Stack, Text, alpha, useMantineTheme } from '@mantine/core'
import { mdiClose } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC } from 'react'
import { AdColors } from '@Utils/Ad'
import { ChallengeCategoryItemProps } from '@Utils/Shared'

interface ADChallengeCardProps {
  title: string
  cateData?: ChallengeCategoryItemProps
  onClick?: () => void
}

export const ADChallengeCard: FC<ADChallengeCardProps> = ({ title, cateData, onClick }) => {
  const theme = useMantineTheme()
  const accent = alpha(theme.colors[cateData?.color ?? 'gray'][5], 0.9)

  return (
    <Card
      onClick={onClick}
      p="md"
      radius={8}
      mih={168}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: AdColors.surface,
        border: `1px solid ${AdColors.border}`,
        transition: 'border-color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3a3d45'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = AdColors.border
      }}
    >
      <Stack gap={8} style={{ position: 'relative', zIndex: 2 }}>
        <Group justify="space-between" wrap="nowrap" gap={6}>
          <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
            {cateData && <Icon path={cateData.icon} size={0.72} color={accent} />}
            <Text fz="0.95rem" fw={700} truncate style={{ color: AdColors.text }}>
              {title}
            </Text>
          </Group>
          <Icon path={mdiClose} size={0.66} color={AdColors.danger} />
        </Group>

        <Box style={{ height: 1, backgroundColor: accent, opacity: 0.8 }} />

        <Text
          fz={11}
          ta="center"
          py={10}
          style={{ color: AdColors.dim, letterSpacing: '0.01em' }}
        >
          Per-tick health checks · flag rounds
        </Text>
      </Stack>

      {cateData && (
        <Box
          style={{
            position: 'absolute',
            left: 14,
            bottom: -18,
            opacity: 0.18,
            transform: 'scale(3.4)',
            transformOrigin: 'left bottom',
            pointerEvents: 'none',
          }}
        >
          <Icon path={cateData.icon} size={0.9} color={accent} />
        </Box>
      )}
    </Card>
  )
}
