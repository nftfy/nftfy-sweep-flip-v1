import { useState } from 'react'
import { CheckCircleFilled } from '@ant-design/icons'
import { Card, Col, Form, Input, InputNumber, Radio, Row, Tag, Typography } from 'antd'
import styled from 'styled-components'

interface FormCard {

}

const FormCard = ({}: FormCard) => {
  const [form] = Form.useForm()
  const [profit, setProfit] = useState<number>(40)

  return (
    <Card
      title={`Sweep & Flip`}
      style={{ width: '100%' }}
      type='inner'
      // extra={}
    >
      <Row gutter={[23, 0]}>
        <Col span={24}>
          <Form layout="vertical" form={form}>
            <Form.Item label="Pay">
              <Box>
                <Content>Test2</Content>
                <InputWithouBorder placeholder="0.0" />
                <div>Test</div>
              </Box>
            </Form.Item>

            <Form.Item label="Receive">
              <Box>
                <Content>Test2</Content>
                <InputWithouBorder placeholder="0.0" />
                <div>Test</div>
              </Box>
            </Form.Item>

            <Form.Item label="Set target profit">
              <Input
                placeholder='0%'
                style={{ textAlign: 'center' }}
                onChange={(text) => setProfit(Number(text.target.value.trim() || 0))}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

const { Box, Content, InputWithouBorder } = {
  Box: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid #D9D9D9;
    border-radius: 12px;
  `,
  Content: styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
  `,
  InputWithouBorder: styled(Input)`

  `
}

export default FormCard