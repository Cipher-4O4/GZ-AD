import { Group } from '@mantine/core'
import { FC } from 'react'
import { useParams } from 'react-router'
import { ADChallengePanel } from '@Components/ADChallengePanel'
import { ADSidebar } from '@Components/ADSidebar'
import { ChallengePanel } from '@Components/ChallengePanel'
import { WithGameTab } from '@Components/WithGameTab'
import { WithNavBar } from '@Components/WithNavbar'
import { WithRole } from '@Components/WithRole'
import { isAdGame } from '@Utils/Ad'
import { useGame } from '@Hooks/useGame'
import { Role } from '@Api'

const Challenges: FC = () => {
  const { id } = useParams()
  const { game } = useGame(parseInt(id ?? '-1'))

  return (
    <WithNavBar width="90%">
      <WithRole requiredRole={Role.User}>
        <WithGameTab>
          {isAdGame(game) ? (
            <Group gap="lg" justify="space-between" align="flex-start" wrap="nowrap">
              <ADChallengePanel />
              <ADSidebar />
            </Group>
          ) : (
            <ChallengePanel />
          )}
        </WithGameTab>
      </WithRole>
    </WithNavBar>
  )
}

export default Challenges
