import { Box, Group, SimpleGrid, Stack, Switch, Text, useMantineTheme } from '@mantine/core'
import { mdiPuzzle } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { ADChallengeCard } from '@Components/ADChallengeCard'
import { ADChallengeModal } from '@Components/ADChallengeModal'
import { AdColors } from '@Utils/Ad'
import { AD_SERVICES } from '@Utils/AdData'
import { useChallengeCategoryLabelMap } from '@Utils/Shared'
import { useGameTeamInfo } from '@Hooks/useGame'
import { ChallengeCategory } from '@Api'

interface ADServiceItem {
  id: number
  title: string
  category: string
}

export const ADChallengePanel: FC = () => {
  const { id } = useParams()
  const numId = parseInt(id ?? '-1')
  const { teamInfo } = useGameTeamInfo(numId)
  const challengeCategoryLabelMap = useChallengeCategoryLabelMap()
  const theme = useMantineTheme()

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [hideSolved, setHideSolved] = useState(false)
  const [selected, setSelected] = useState<ADServiceItem | null>(null)

  const services = useMemo<ADServiceItem[]>(() => {
    const fromApi = teamInfo?.challenges
      ? Object.entries(teamInfo.challenges).flatMap(([category, list]) =>
          (list ?? []).map((challenge) => ({
            id: challenge.id!,
            title: challenge.title ?? '',
            category,
          }))
        )
      : []

    return fromApi.length
      ? fromApi
      : AD_SERVICES.map((service) => ({ id: service.id, title: service.key, category: service.category }))
  }, [teamInfo?.challenges])

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    services.forEach((service) => counts.set(service.category, (counts.get(service.category) ?? 0) + 1))
    return [...counts.entries()]
  }, [services])

  const visible = hideSolved
    ? services.filter(
        (service) => !teamInfo?.rank?.solvedChallenges?.some((challenge) => challenge.id === service.id)
      )
    : services

  const filtered = activeCategory === 'All' ? visible : visible.filter((s) => s.category === activeCategory)

  const activeService = selected
    ? (AD_SERVICES.find((service) => service.key === selected.title) ??
      AD_SERVICES.find((service) => service.category === selected.category))
    : undefined

  const chip = (key: string, label: string, count: number, color?: string, icon?: string) => {
    const active = activeCategory === key
    return (
      <Group
        key={key}
        gap={7}
        wrap="nowrap"
        px={11}
        py={6}
        onClick={() => setActiveCategory(key)}
        style={{
          cursor: 'pointer',
          borderRadius: 6,
          backgroundColor: active ? AdColors.primary : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${active ? AdColors.primary : AdColors.border}`,
          transition: 'background-color 0.12s ease',
        }}
      >
        {icon ? (
          <Icon path={icon} size={0.6} color={active ? '#06231c' : color} />
        ) : (
          <Icon path={mdiPuzzle} size={0.6} color={active ? '#06231c' : AdColors.dim} />
        )}
        <Text fz={12} fw={700} style={{ color: active ? '#06231c' : AdColors.text }}>
          {label}
        </Text>
        <Text fz={12} fw={700} style={{ color: active ? '#06231c' : AdColors.dimmer }}>
          {count}
        </Text>
      </Group>
    )
  }

  return (
    <Box style={{ flex: 1, minWidth: 0 }}>
      <Group justify="space-between" align="center" wrap="nowrap" mb="sm">
        <Group gap={8} wrap="wrap">
          {chip('All', 'All', services.length)}
          {categories.map(([category, count]) => {
            const cateData = challengeCategoryLabelMap.get(category as ChallengeCategory)
            return chip(
              category,
              cateData?.name ?? category,
              count,
              cateData ? theme.colors[cateData.color][5] : AdColors.dim,
              cateData?.icon
            )
          })}
        </Group>

        <Group gap={8} wrap="nowrap">
          <Switch
            size="sm"
            checked={hideSolved}
            onChange={(event) => setHideSolved(event.currentTarget.checked)}
            styles={{
              track: { backgroundColor: hideSolved ? AdColors.primary : '#2a2c32' },
              label: { color: AdColors.dim, fontSize: 12, fontWeight: 600 },
            }}
            label="Hide Solved"
          />
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {filtered.map((service) => (
          <ADChallengeCard
            key={service.id}
            title={service.title}
            cateData={challengeCategoryLabelMap.get(service.category as ChallengeCategory)}
            onClick={() => setSelected(service)}
          />
        ))}
      </SimpleGrid>

      {!filtered.length && (
        <Stack align="center" py="xl" gap={4}>
          <Text fz={13} style={{ color: AdColors.dim }}>
            Tidak ada service pada kategori ini.
          </Text>
        </Stack>
      )}

      <ADChallengeModal
        opened={!!selected}
        onClose={() => setSelected(null)}
        service={activeService}
        cateData={
          selected ? challengeCategoryLabelMap.get(selected.category as ChallengeCategory) : undefined
        }
      />
    </Box>
  )
}
