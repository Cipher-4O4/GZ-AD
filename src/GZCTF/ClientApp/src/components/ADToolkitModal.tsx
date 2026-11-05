import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Code,
  CopyButton,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  mdiBookOpenPageVariantOutline,
  mdiBriefcase,
  mdiCheck,
  mdiConsoleLine,
  mdiContentCopy,
  mdiCubeOutline,
  mdiDownload,
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiFileDocumentMultipleOutline,
  mdiKeyOutline,
  mdiLanConnect,
  mdiRefresh,
  mdiSwordCross,
  mdiTrashCanOutline,
  mdiUpload,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useState } from 'react'

interface ADToolkitModalProps {
  opened: boolean
  onClose: () => void
  gameId?: number
}

export const ADToolkitModal: FC<ADToolkitModalProps> = ({ opened, onClose, gameId = 5 }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('ad_token') || 'ad_KqcDuW9H-_HfhXtkdCI5TXLx9AQVfqIM7zUf-w8mjRE'
  })
  const [showToken, setShowToken] = useState(false)
  const [sshKeyInput, setSshKeyInput] = useState('')
  const [registeredKey, setRegisteredKey] = useState(
    'SHA256:Kz2YMhtnyJj8hdva+e2FYMtrdV9Q+cjL9OzHIAfqhPM (ssh-ed25519)'
  )
  const [sshTab, setSshTab] = useState<'paste' | 'generate'>('paste')

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/Game/${gameId}/Ad`
      : `https://jcc.jatimprov.go.id/api/Game/${gameId}/Ad`

  const rotateToken = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    const newToken = `ad_${randomHex.slice(0, 8)}-_${randomHex.slice(8, 20)}-${randomHex.slice(20)}`
    setToken(newToken)
    localStorage.setItem('ad_token', newToken)
    notifications.show({
      color: 'teal',
      title: 'Token Rotated',
      message: 'A new API token has been generated and saved locally.',
      icon: <Icon path={mdiCheck} size={1} />,
    })
  }

  const forgetToken = () => {
    localStorage.removeItem('ad_token')
    notifications.show({
      color: 'yellow',
      title: 'Token Removed',
      message: 'Token has been cleared from this browser session.',
    })
  }

  const downloadVpnConfig = () => {
    const dummyConfig = `[Interface]
PrivateKey = aDummyPrivateKeyForAandDGameUser=
Address = 10.43.228.152/24
DNS = 10.43.0.1

[Peer]
PublicKey = aDummyServerPublicKey=
Endpoint = 10.43.170.150:51820
AllowedIPs = 10.43.0.0/16, 172.0.0.0/8
PersistentKeepalive = 25`
    const blob = new Blob([dummyConfig], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ad-game-${gameId}.conf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const maskedToken = token.length > 12 ? `${token.slice(0, 8)}••••••${token.slice(-4)}` : token

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="md"
      title={
        <Group gap="xs">
          <ThemeIcon color="red" variant="filled" size="md" radius="sm">
            <Icon path={mdiBriefcase} size={0.8} />
          </ThemeIcon>
          <Text fw={700} size="md">
            Attack & Defense — Toolkit
          </Text>
        </Group>
      }
      styles={{
        header: {
          backgroundColor: '#18191c',
          borderBottom: '1px solid #2c2e33',
        },
        body: {
          backgroundColor: '#18191c',
          padding: '1.25rem',
        },
        content: {
          backgroundColor: '#18191c',
        },
      }}
    >
      <Stack gap="md">
        {/* Blue alert header */}
        <Box
          p="md"
          style={{
            backgroundColor: 'rgba(13, 40, 71, 0.85)',
            borderRadius: '8px',
            border: '1px solid rgba(28, 75, 122, 0.8)',
          }}
        >
          <Text size="sm" c="#90c2f7" fw={500} lh={1.4}>
            Prepare your API token, download your VPN configuration, and register SSH keys now. Challenges, targets, flag submissions and service shell access open when Round 1 starts.
          </Text>
        </Box>

        <Text size="xs" c="dimmed" lh={1.4}>
          Everything you need to play A&D: your personal API token, your VPN config, the API contract, and the rules. The first two sections are actionable — token rotation and VPN config download.
        </Text>

        <Accordion
          variant="separated"
          defaultValue="token"
          styles={{
            item: {
              backgroundColor: '#1f2024',
              border: '1px solid #2e3036',
              borderRadius: '8px',
            },
            control: {
              padding: '0.75rem 1rem',
              '&:hover': {
                backgroundColor: '#26272c',
              },
            },
            content: {
              padding: '1rem',
              borderTop: '1px solid #2a2b30',
            },
          }}
        >
          {/* SECTION 1: Your API token */}
          <Accordion.Item value="token">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Your API token
                </Text>
                <Icon path={mdiKeyOutline} size={0.9} color="#f59f00" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Text size="xs" c="dimmed">
                  A personal Bearer token scoped to you + this game. Your exploit scripts pass it as{' '}
                  <Code c="dimmed">Authorization: Bearer &lt;token&gt;</Code> when submitting captured flags. Every team member manages their own — rotating yours does not affect anyone else, and if you get kicked from the team your token stops working immediately.
                </Text>

                <Group justify="space-between" align="center" wrap="wrap">
                  <Text size="xs" fw={500}>
                    Your current token: <Code>{maskedToken}</Code>
                  </Text>
                  <Button
                    size="xs"
                    variant="default"
                    leftSection={<Icon path={mdiRefresh} size={0.7} />}
                    onClick={rotateToken}
                  >
                    Rotate token
                  </Button>
                </Group>

                <Text size="xs" c="dimmed">
                  Last used: never
                </Text>

                <Group justify="space-between" align="center" wrap="wrap" pt="xs">
                  <Group gap="xs">
                    <Text size="xs" fw={500}>
                      Saved token:
                    </Text>
                    <Code>{showToken ? token : maskedToken}</Code>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => setShowToken(!showToken)}
                    >
                      <Icon path={showToken ? mdiEyeOffOutline : mdiEyeOutline} size={0.8} />
                    </ActionIcon>
                  </Group>

                  <Group gap="xs">
                    <CopyButton value={token}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          variant="default"
                          leftSection={<Icon path={copied ? mdiCheck : mdiContentCopy} size={0.7} />}
                          onClick={copy}
                        >
                          {copied ? 'Copied' : 'Copy token'}
                        </Button>
                      )}
                    </CopyButton>
                    <Button size="xs" variant="subtle" color="gray" onClick={forgetToken}>
                      Forget
                    </Button>
                  </Group>
                </Group>

                <Text size="xs" c="dimmed">
                  Saved in THIS browser so your bot/scripts can reuse it — it survives reloads. Anyone with access to this browser can read it. "Rotate" issues a new token (invalidating this one); "Forget" removes it from this browser.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 2: VPN config */}
          <Accordion.Item value="vpn">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  VPN config
                </Text>
                <Icon path={mdiLanConnect} size={0.9} color="#22b8cf" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Text size="xs" c="dimmed">
                  Per-user WireGuard config. The first download generates a fresh keypair + assigns you an IP from the game subnet; subsequent downloads return the same file. Drop the .conf into wg-quick (or wireguard-tools / the WireGuard app) to join the A&D network.
                </Text>

                <div>
                  <Button
                    size="sm"
                    color="teal"
                    variant="filled"
                    leftSection={<Icon path={mdiDownload} size={0.9} />}
                    onClick={downloadVpnConfig}
                  >
                    Download .conf
                  </Button>
                </div>

                <Text size="xs" c="dimmed">
                  Linux: <Code>sudo wg-quick up ./ad-game-....conf</Code>. macOS / Windows: import via the official WireGuard app.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 3: Shell access (SSH) */}
          <Accordion.Item value="ssh">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Shell access (SSH)
                </Text>
                <Icon path={mdiConsoleLine} size={0.9} color="#cc5de8" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Text size="xs" c="dimmed">
                  Direct shell into your team's container for any A&D challenge — patch the binary, tail logs, inspect application data, install tools. Auth is your SSH key, identity is the SSH username (= the challenge id).
                </Text>

                <Group justify="space-between" align="center" wrap="wrap">
                  <Text size="xs" fw={500}>
                    Your registered key: <Code>{registeredKey}</Code>
                  </Text>
                  <Button
                    size="xs"
                    variant="default"
                    color="red"
                    leftSection={<Icon path={mdiTrashCanOutline} size={0.7} />}
                    onClick={() => setRegisteredKey('None')}
                  >
                    Revoke
                  </Button>
                </Group>

                <Group gap="xs" pt="xs">
                  <Button
                    size="xs"
                    variant={sshTab === 'paste' ? 'filled' : 'subtle'}
                    color="gray"
                    leftSection={<Icon path={mdiKeyOutline} size={0.7} />}
                    onClick={() => setSshTab('paste')}
                  >
                    Paste public key
                  </Button>
                  <Button
                    size="xs"
                    variant={sshTab === 'generate' ? 'filled' : 'subtle'}
                    color="gray"
                    leftSection={<Icon path={mdiRefresh} size={0.7} />}
                    onClick={() => setSshTab('generate')}
                  >
                    Generate keypair
                  </Button>
                </Group>

                <Text size="xs" c="dimmed">
                  Run <Code>cat ~/.ssh/id_ed25519.pub</Code> (or id_rsa.pub) locally and paste the single line below. The private half never leaves your machine.
                </Text>

                <TextInput
                  placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... your-comment"
                  value={sshKeyInput}
                  onChange={(e) => setSshKeyInput(e.target.value)}
                />

                <Group justify="flex-end">
                  <Button
                    size="xs"
                    variant="default"
                    leftSection={<Icon path={mdiUpload} size={0.7} />}
                    onClick={() => {
                      if (sshKeyInput.trim()) {
                        setRegisteredKey(sshKeyInput.slice(0, 40) + '...')
                        notifications.show({
                          color: 'teal',
                          message: 'Public key updated successfully.',
                        })
                        setSshKeyInput('')
                      }
                    }}
                  >
                    Replace
                  </Button>
                </Group>

                <Divider my="xs" />

                <Text size="xs" fw={700}>
                  Connect
                </Text>

                <Box
                  p="xs"
                  style={{
                    backgroundColor: '#121316',
                    borderRadius: '4px',
                    border: '1px solid #2a2b30',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                >
                  <Group justify="space-between">
                    <Text size="xs" ff="monospace">
                      ssh &lt;challenge-id&gt;@10.43.170.150 -p 2222 -i ~/.ssh/your-key
                    </Text>
                    <CopyButton value="ssh <challenge-id>@10.43.170.150 -p 2222 -i ~/.ssh/your-key">
                      {({ copied, copy }) => (
                        <Button
                          size="compact-xs"
                          variant="subtle"
                          leftSection={<Icon path={copied ? mdiCheck : mdiContentCopy} size={0.6} />}
                          onClick={copy}
                        >
                          {copied ? 'Tersalin' : 'Salin ke Papan Klip'}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Box>

                <Text size="xs" c="dimmed">
                  Replace &lt;challenge-id&gt; with the numeric id from the challenge card (visible in the URL and the "SSH access" hint inside each challenge). The username doubles as the target selector — <Code>ssh 76@host</Code> lands in your team's container for challenge 76.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 4: Rounds & flags */}
          <Accordion.Item value="rounds">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Rounds & flags
                </Text>
                <Icon path={mdiSwordCross} size={0.9} color="#ff6b6b" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  • A tick runs health and retained-flag checks. A round contains the configured number of ticks (for example, 5 ticks of 60 seconds). Flags change only at the start of a new round, when the tick counter returns to 1.
                </Text>
                <Text size="xs" c="dimmed">
                  • Protect the new flag and older flags until they expire. Retain their application records, accounts, and permissions; removing old data can reduce availability and defense points even when the newest flag works.
                </Text>
                <Text size="xs" c="dimmed">
                  • Flags stay valid for the configured number of rounds, including their creation round (default 5 rounds). For 5 ticks per round, a 5-round lifetime covers 25 ticks. Expired flags cannot be submitted for points.
                </Text>
                <Text size="xs" c="dimmed">
                  • Before Round 1, the platform provisions services and checkers. Challenges and service access stay hidden, while the A&D Toolkit, scoreboard and attack map remain available. Prepare tokens, VPN configuration and SSH keys during warmup; challenge access opens when Round 1 starts.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 5: How scoring works */}
          <Accordion.Item value="scoring">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  How scoring works
                </Text>
                <Icon path={mdiBookOpenPageVariantOutline} size={0.9} color="#51cf66" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" fw={700}>
                  Total = Attack + Defense + Availability
                </Text>
                <Text size="xs" c="dimmed">
                  • <Text span fw={600} c="teal">Attack:</Text> Capture other teams' flags. A flag captured by fewer teams has a higher base value. Attack points also include compensation for the defense credit that an attacker cannot earn against itself.
                </Text>
                <Text size="xs" c="dimmed">
                  • <Text span fw={600} c="pink">Defense:</Text> Earn points for resisting active attackers who capture other teams' flags. The reward depends on their success elsewhere and how consistently your flag stays retrievable while your service works. Being captured removes that defense opportunity; it does not subtract previously settled points.
                </Text>
                <Text size="xs" c="dimmed">
                  • <Text span fw={600} c="blue">Availability:</Text> Every tick checks functionality and all still-valid flags. Availability = 10 × retrieved valid flags ÷ flag lifetime in rounds, up to 10 points per tick. Missing previously stored older flags earns partial recovery credit; a missing previously stored current-round flag earns none. Unconfirmed flags earn no flag credit, but do not prolong recovery on later ticks. Functionality percentage counts Ok and Recovering checks separately.
                </Text>

                <Box
                  p="xs"
                  mt="xs"
                  style={{
                    backgroundColor: 'rgba(13, 40, 71, 0.7)',
                    borderRadius: '6px',
                    border: '1px solid rgba(28, 75, 122, 0.7)',
                  }}
                >
                  <Text size="xs" c="#90c2f7">
                    Recent points are provisional: additional captures and flag checks can change them, including downward. The scoreboard separates settled points from provisional points. Submit results are estimates, not an additional award on top of the scoreboard.
                  </Text>
                </Box>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 6: Find your targets */}
          <Accordion.Item value="targets">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Find your targets
                </Text>
                <Icon path={mdiSwordCross} size={0.9} color="#ff6b6b" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  A&D is attack-first — you need to know every other team's container IP per service. This endpoint is the canonical list. Excludes your own team and stays empty until Round 1 starts after warmup and readiness checks.
                </Text>

                <Text size="xs" fw={700}>
                  List request
                </Text>

                <Box
                  p="xs"
                  style={{
                    backgroundColor: '#121316',
                    borderRadius: '4px',
                    border: '1px solid #2a2b30',
                  }}
                >
                  <Text size="xs" ff="monospace">
                    curl -sS {baseUrl}/Targets \
                    <br />
                    &nbsp;&nbsp;-H "Authorization: Bearer {token}"
                  </Text>
                </Box>

                <Text size="xs" c="dimmed">
                  Replace &lt;your-token&gt; with the full ad_... string shown when you rotated. The hint above (e.g. ad_aDQR...ykTM) is just a recognizer — the server never has the full token after rotation.
                </Text>
                <Text size="xs" c="dimmed">
                  Poll once per tick (~tickSeconds) if you need live service changes. Container IPs are stable across ticks unless a team Resets or an admin Stops the container — then a fresh IP shows up here within ~15s.
                </Text>

                <Group justify="flex-start">
                  <CopyButton value={`curl -sS ${baseUrl}/Targets \\\n  -H "Authorization: Bearer ${token}"`}>
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        variant="default"
                        leftSection={<Icon path={copied ? mdiCheck : mdiContentCopy} size={0.7} />}
                        onClick={copy}
                      >
                        {copied ? 'Copied' : 'Copy curl'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>

                <Text size="xs" fw={700} pt="xs">
                  Response shape
                </Text>

                <Box
                  p="xs"
                  style={{
                    backgroundColor: '#121316',
                    borderRadius: '4px',
                    border: '1px solid #2a2b30',
                    maxHeight: '180px',
                    overflowY: 'auto',
                  }}
                >
                  <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace' }}>
{`{
  "currentRound": 7,
  "challenges": [
    {
      "challengeId": 76,
      "title": "Test A&D - nginx",
      "tickSeconds": 60,
      "teams": [
        { "participationId": 2, "teamName": "Team Bravo", "division": null, "ip": "172.0.9.4", "port": 80, "lastCheckStatus": "Ok" },
        { "participationId": 3, "teamName": "Team Charlie", "division": null, "ip": "172.0.9.5", "port": 80, "lastCheckStatus": "Mumble" }
      ]
    }
  ]
}`}
                  </pre>
                </Box>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 7: How to submit captured flags */}
          <Accordion.Item value="submit">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  How to submit captured flags
                </Text>
                <Icon path={mdiFileDocumentMultipleOutline} size={0.9} color="#cc5de8" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  Use the flag submission box on the challenges page, or let your exploit scripts batch captured flags and POST them to this API. Both use the same submission endpoint.
                </Text>

                <Text size="xs" fw={700}>
                  Submit request
                </Text>

                <Box
                  p="xs"
                  style={{
                    backgroundColor: '#121316',
                    borderRadius: '4px',
                    border: '1px solid #2a2b30',
                  }}
                >
                  <Text size="xs" ff="monospace">
                    curl -X POST {baseUrl}/Submit \
                    <br />
                    &nbsp;&nbsp;-H "Authorization: Bearer {token}" \
                    <br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \
                    <br />
                    &nbsp;&nbsp;-d '{'{"flags":["flag{captured_from_team_b}","flag{another}"]}'}'
                  </Text>
                </Box>

                <Text size="xs" c="dimmed">
                  Replace &lt;your-token&gt; with the full ad_... string shown when you rotated. The hint above (e.g. ad_aDQR...ykTM) is just a recognizer — the server never has the full token after rotation.
                </Text>
                <Text size="xs" c="dimmed">
                  Pass 1 to 100 flag strings per request. Results return in input order so you can correlate.
                </Text>

                <Group justify="flex-start">
                  <CopyButton
                    value={`curl -X POST ${baseUrl}/Submit \\\n  -H "Authorization: Bearer ${token}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"flags":["flag{captured_from_team_b}","flag{another}"]}'`}
                  >
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        variant="default"
                        leftSection={<Icon path={copied ? mdiCheck : mdiContentCopy} size={0.7} />}
                        onClick={copy}
                      >
                        {copied ? 'Copied' : 'Copy curl'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>

                <Text size="xs" fw={700} pt="xs">
                  Response shape
                </Text>

                <Box
                  p="xs"
                  style={{
                    backgroundColor: '#121316',
                    borderRadius: '4px',
                    border: '1px solid #2a2b30',
                    maxHeight: '180px',
                    overflowY: 'auto',
                  }}
                >
                  <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace' }}>
{`{
  "acceptedCount": 1,
  "totalPoints": 10.0,
  "results": [
    { "flag": "flag{captured_from_team_b}", "status": "accepted", "points": 10.0, "flagPlantedAtRound": 7 },
    { "flag": "flag{another}", "status": "wrong", "message": "flag not recognized" }
  ]
}`}
                  </pre>
                </Box>

                <Text size="xs" c="dimmed">
                  Per-flag status is one of: <Code>accepted</Code> | <Code>duplicate</Code> | <Code>wrong</Code> | <Code>expired</Code> | <Code>self_attack</Code> | <Code>not_started</Code>. Only accepted contributes to your score.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 8: Your container */}
          <Accordion.Item value="container">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Your container
                </Text>
                <Icon path={mdiCubeOutline} size={0.9} color="#845ef7" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  • The challenge modal shows your container IP:port — that's where checks run and where attackers point their exploits.
                </Text>
                <Text size="xs" c="dimmed">
                  • Flags live in application data created through normal service operations. The checker retrieves those records using their legitimate credentials or private handles, so patching the vulnerability must not break normal access.
                </Text>
                <Text size="xs" c="dimmed">
                  • Keep every still-valid flag record intact. The checker verifies historical records without recreating deleted data; preserving only the newest flag is not enough for full availability.
                </Text>
                <Text size="xs" c="dimmed">
                  • Patch your service live inside the container — the platform does not redeploy on its own. Your changes live ONLY in the running container; there is no persistent disk.
                </Text>
                <Text size="xs" c="dimmed">
                  • Your service runs under a supervisor (PID 1). If the service process crashes — or you restart it — it comes back automatically and your patches stay. Restarting the service is safe; but don't kill PID 1 (the supervisor): that drops the box back to the base image.
                </Text>
                <Text size="xs" c="dimmed">
                  • Reset rebuilds the box from the original image and removes local changes, including patches and retained flag data. Availability and defense credit can be reduced while the service recovers. Use it only when necessary, then re-apply your patches.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* SECTION 9: Do / Don't */}
          <Accordion.Item value="dodont">
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap" w="100%" pr="sm">
                <Text fw={600} size="sm">
                  Do / Don't
                </Text>
                <Icon path={mdiRefresh} size={0.9} color="#868e96" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="xs" fw={700} c="teal">
                  Do
                </Text>
                <Text size="xs" c="dimmed">
                  • Patch your service before the first attack lands.
                </Text>
                <Text size="xs" c="dimmed">
                  • Automate flag submission — paste into a loop that fetches the current flag from each target and POSTs the batch.
                </Text>
                <Text size="xs" c="dimmed">
                  • Watch your check status: Recovering means previously stored older flags are missing. Reset can cause this until those flags expire; restarting a process while preserving its data should not. Flags that were never confirmed stored earn no flag credit, but do not prolong recovery on later ticks.
                </Text>
                <Text size="xs" c="dimmed">
                  • Re-apply your patches after any reset — a reset reverts to the pristine, vulnerable image.
                </Text>

                <Text size="xs" fw={700} c="red" pt="xs">
                  Don't
                </Text>
                <Text size="xs" c="dimmed">
                  • Share your flags or your token with other teams — operators detect it and apply penalties.
                </Text>
                <Text size="xs" c="dimmed">
                  • DoS another team's service or the checker infrastructure — instant DQ.
                </Text>
                <Text size="xs" c="dimmed">
                  • Break legitimate user operations while patching. Fix the vulnerability while keeping normal registration, login, storage, and retrieval working.
                </Text>
                <Text size="xs" c="dimmed">
                  • Delete or overwrite valid flag records, or replace real application responses with hardcoded flags. The checker verifies each record independently throughout its lifetime.
                </Text>
                <Text size="xs" c="dimmed">
                  • Kill PID 1 (the supervisor) in your box — it resets you to the base image and wipes your patches.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Center pt="xs">
          <Text size="xs" c="dimmed" ff="monospace">
            Endpoint base: {baseUrl}
          </Text>
        </Center>
      </Stack>
    </Modal>
  )
}

