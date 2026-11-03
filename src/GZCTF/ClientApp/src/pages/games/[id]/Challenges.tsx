import { Group } from '@mantine/core'
import { FC } from 'react'
import { ADSidebar } from '@Components/ADSidebar'
import { ChallengePanel } from '@Components/ChallengePanel'
import { WithGameTab } from '@Components/WithGameTab'
import { WithNavBar } from '@Components/WithNavbar'
import { WithRole } from '@Components/WithRole'
import { Role } from '@Api'

const Challenges: FC = () => {
  return (
    <WithNavBar width="90%">
      <WithRole requiredRole={Role.User}>
        <WithGameTab>
          <Group gap="md" justify="space-between" align="flex-start" wrap="nowrap">
            <ChallengePanel />
            <ADSidebar />
          </Group>
        </WithGameTab>
      </WithRole>
    </WithNavBar>
  )
}

export default Challenges
