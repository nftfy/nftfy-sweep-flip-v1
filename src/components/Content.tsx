import React, { useMemo, useState } from 'react'
import { Card, Col, Row , Tabs, TabsProps} from 'antd'
import SweepFlipFormCard from '@components/SweepFlipFormCard'
import SweepFormCard from '@components/SweepForm'
import styled from 'styled-components'


interface ContentProps {
  chainId: number
}

const Content = ({ chainId }: ContentProps) => {
  const [currentTab, setCurrentTab] = useState('sweepFlip')
  const onChangeKey = (tabName: string) => {
    setCurrentTab(tabName)
  }

  const items: TabsProps['items'] = [
    {
      key: 'sweepFlip',
      label: `Sweep's Flip`,
      children: <SweepFlipFormCard key={1} chainId={chainId} activeTab={currentTab} />
    },
    {
      key: 'sweep',
      label: `Sweep`,
      children: <SweepFlipFormCard key={2} chainId={chainId} activeTab={currentTab} />
    },
  ]

  return (
    <Row>
      <Col lg={9} span={22} style={{ margin: '0 auto', height: '100%' }}>
        <CardContent style={{ width: '100%' }} type='inner'>
          <TabsContent
            defaultActiveKey="sweepFlip"
            items={items}
            tabBarExtraContent={{ right: (<>Test</>) }}
            onChange={onChangeKey}
          />
        </CardContent>
      </Col>
    </Row>
  )
}

const { CardContent, TabsContent } = {
  CardContent: styled(Card)`
    .ant-card-body {
      padding: 0px;
    }
  `,
  TabsContent: styled(Tabs)`
    .ant-tabs-nav {
      padding-left: 12px;
      padding-right: 12px;
    }
    .ant-tabs-content {
      padding: 24px;
    }
  `
}

export default Content
