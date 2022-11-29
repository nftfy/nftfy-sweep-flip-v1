import React from 'react'
import { Col, Row } from 'antd'
import styled from 'styled-components'

interface ContentProps {
  children: React.ReactNode
}

const Content = ({ children }: ContentProps) => (
  <Row>
    <Col lg={12} span={24} style={{ margin: '0 auto', height: '100%' }}>
      {children}
    </Col>
  </Row>
)

export default Content
