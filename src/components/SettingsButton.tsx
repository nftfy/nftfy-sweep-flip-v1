import React from 'react'
import { Checkbox, Popover, Typography } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { listingMarketplacesVar, sweepRulesSettingsVar } from '@graphql/variables/SettingsVariables'

interface SettingsProps {
  settingsType: 'sweep' | 'sweepFlip'
}

function SettingsButton({ settingsType }: SettingsProps) {
  const { Text } = Typography

  const sweepRules = [
    { label: 'Skip Pending', value: 'skipPending' },
    { label: 'Skip Suspicious', value: 'skipSuspicious' }
  ]

  const listingMarketplaces = [
    { label: 'Open Sea', value: 'opensea' },
    { label: 'X2Y2', value: 'x2y2' },
    { label: 'Blur', value: 'blur' },
    { label: 'Looks Rare', value: 'looksRare' }
  ]

  const settingsMenu = (
    <SettingsContainer>
      <div>
        <Text strong>Sweep Rules</Text>
        <Checkbox.Group options={sweepRules} onChange={checkedValues => sweepRulesSettingsVar(checkedValues as string[])} />
      </div>
      {settingsType === 'sweepFlip' && (
        <div>
          <Text strong>Listing Marketplaces</Text>
          <Checkbox.Group
            options={listingMarketplaces}
            defaultValue={['opensea']}
            onChange={checkedValues => listingMarketplacesVar(checkedValues as string[])}
          />
        </div>
      )}
    </SettingsContainer>
  )

  return (
    <Popover content={settingsMenu} placement='topLeft' trigger='click'>
      <SettingOutlined />
    </Popover>
  )
}

const { SettingsContainer } = {
  SettingsContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-items: baseline;
    gap: 8px;

    .ant-checkbox-group {
      display: flex !important;
      flex-direction: column !important;
      margin-left: 15px;
    }
  `
}

export default SettingsButton
