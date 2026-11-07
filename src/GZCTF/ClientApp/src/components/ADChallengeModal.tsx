import { Badge, Box, Button, Divider, Group, Modal, ModalProps, Stack, Text, useMantineTheme } from '@mantine/core'
import { mdiDownload, mdiRestore, mdiSsh } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC } from 'react'
import { AdColors } from '@Utils/Ad'
import type { AdService } from '@Utils/AdData'
import { ChallengeCategoryItemProps } from '@Utils/Shared'

interface ADChallengeModalProps extends ModalProps {
  service?: AdService
  cateData?: ChallengeCategoryItemProps
}

const Field: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Group gap={6} wrap="nowrap" align="flex-start">
    <Text fz={12} fw={700} style={{ color: AdColors.dim, minWidth: 72 }}>
      {label}
    </Text>
    {children}
  </Group>
)

export const ADChallengeModal: FC<ADChallengeModalProps> = ({ service, cateData, ...modalProps }) => {
  const theme = useMantineTheme()
  const accent = theme.colors[cateData?.color ?? 'teal'][5]

  if (!service) return null

  return (
    <Modal
      {...modalProps}
      size={560}
      radius={8}
      withCloseButton
      styles={{
        content: { backgroundColor: AdColors.surface, border: `1px solid ${AdColors.border}` },
        header: { backgroundColor: AdColors.surface, paddingBottom: 0 },
        body: { paddingTop: 4 },
        close: { color: AdColors.dim },
      }}
    >
      <Stack gap={10}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap={8} wrap="nowrap">
            {cateData && <Icon path={cateData.icon} size={0.8} color={accent} />}
            <Text fz="1rem" fw={700} style={{ color: '#fff' }}>
              {service.title || service.key}
            </Text>
          </Group>
          <Text fz={11} fw={800} style={{ color: AdColors.danger, letterSpacing: '0.12em' }}>
            LIVE
          </Text>
        </Group>

        <Text fz={12} style={{ color: AdColors.dim }}>
          Author: <span style={{ color: AdColors.text, fontWeight: 600 }}>{service.author}</span>
        </Text>

        <Text fz={13} style={{ color: AdColors.text }}>
          {service.description}
        </Text>

        <Divider color={AdColors.borderSoft} />

        <Group justify="space-between" align="center" wrap="nowrap">
          <Text fz={12} fw={700} style={{ color: AdColors.text }}>
            Download Lampiran
          </Text>
          <Button
            component="a"
            href={`/attachments/${service.attachment || `${service.key}.zip`}`}
            download={service.attachment || `${service.key}.zip`}
            target="_blank"
            rel="noopener noreferrer"
            size="compact-sm"
            radius={6}
            leftSection={<Icon path={mdiDownload} size={0.7} />}
            styles={{
              root: {
                backgroundColor: '#12362f',
                border: '1px solid rgba(18, 184, 134, 0.35)',
                color: AdColors.primaryText,
                fontFamily: AdColors.mono,
                fontSize: 11,
                fontWeight: 600,
                textDecoration: 'none',
              },
            }}
          >
            {service.attachment || `${service.key}.zip`}
          </Button>
        </Group>

        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap={8} wrap="nowrap">
            <Text fz={12} fw={700} style={{ color: AdColors.text }}>
              Your service
            </Text>
            <Badge
              size="xs"
              radius={4}
              styles={{
                root: {
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${AdColors.border}`,
                  color: AdColors.dim,
                  fontFamily: AdColors.mono,
                  fontSize: 9,
                  letterSpacing: '0.06em',
                },
              }}
            >
              {service.checks}
            </Badge>
          </Group>
          <Button
            size="compact-xs"
            radius={6}
            leftSection={<Icon path={mdiRestore} size={0.62} />}
            styles={{
              root: {
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid ${AdColors.border}`,
                color: AdColors.dim,
                fontSize: 11,
              },
            }}
          >
            Reset
          </Button>
        </Group>

        <Field label="Target:">
          <Text ff="monospace" fz={12} style={{ color: AdColors.text }}>
            {service.target}
          </Text>
        </Field>

        <Field label="Defending:">
          <Text ff="monospace" fz={12} style={{ color: AdColors.text, wordBreak: 'break-all' }}>
            {service.defendingFlag}
          </Text>
        </Field>

        <Group gap={6} wrap="nowrap" align="center">
          <Box style={{ display: 'flex', minWidth: 72 }}>
            <Icon path={mdiSsh} size={0.6} color={AdColors.dim} />
          </Box>
          <Text ff="monospace" fz={11} style={{ color: AdColors.dim }}>
            {service.ssh}
          </Text>
        </Group>
      </Stack>
    </Modal>
  )
}
