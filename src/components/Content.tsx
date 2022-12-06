import React from 'react'
import { Col, Row } from 'antd'

interface ContentProps {
  children: React.ReactNode
}

const Content = ({ children }: ContentProps) => (
  <Row>
    <Col lg={9} span={22} style={{ margin: '0 auto', height: '100%' }}>
      {children}
    </Col>
  </Row>
)

export default Content
