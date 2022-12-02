import { useState } from 'react'
import { Button, Card, Col, Checkbox, Form, Input, Image, Row } from 'antd'
import styled from 'styled-components'

interface FormCard {}

const CheckboxGroup = Checkbox.Group;

const FormCard = ({}: FormCard) => {
  const [form] = Form.useForm()
  const [profit, setProfit] = useState<number>(40)
  const plainOptions = ['Skip pending', 'Skip suspisious'];


  return (
    <Card
      title={`Sweep & Flip`}
      style={{ width: '100%' }}
      type='inner'
      // extra={}
    >
      <Row gutter={[23, 0]}>
        <Col span={24}>
          <Form layout="vertical" form={form} size='large'>
            <FormItem label="Pay">
              <Box>
                <Content></Content>
                <Left><InputWithouBorder placeholder="0" bordered={false} /></Left>
                <Right>
                  <Button icon={
                    <Image
                      src="/icons/eth.svg"
                      preview={false}
                      width={24}
                      height={24}
                      style={{ paddingRight: 2, paddingBottom: 2 }}
                    />
                  } size="large">
                    ETH
                  </Button>
                </Right>
              </Box>
            </FormItem>

            <FormItem label="Receive">
              <Box>
                <Content></Content>
                <Left><InputWithouBorder placeholder="0" bordered={false} /></Left>
                <Right></Right>
              </Box>
            </FormItem>

            <FormItem label="Set target profit">
              <Input
                placeholder='0%'
                style={{ textAlign: 'center' }}
                onChange={(text) => setProfit(Number(text.target.value.trim() || 0))}
              />
            </FormItem>
            <FormItem>
              <Div>
                <CheckGroup options={plainOptions} />
              </Div>
              <Button type="primary" block>{`Sweep & Flip`}</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

const { Box, Content, CheckGroup, Div, Left, Right, FormItem, InputWithouBorder } = {
  Div: styled.div`
    display: flex;
    flex-direction: row;
    justify-items: center;
    justify-content: space-around;
  `,
  Box: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid #D9D9D9;
    border-radius: 12px;
    padding: 8px;
    margin-bottom: 10px;
    gap: 4px;
    grid-template-areas: "left right"
                         "content content";
  `,
  FormItem: styled(Form.Item)`
    label {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
  `,
  Content: styled.div`
    grid-area: content;
  `,
  Left: styled.div`
    grid-area: left;
  `,
  Right: styled.div`
    grid-area: right;
    justify-self: end;
  `,
  InputWithouBorder: styled(Input)`
    font-size: 1.5rem;
    border: none;
    &::focus {
      border-color: none;
      outline: none;
    }
  `,
  CheckGroup: styled(CheckboxGroup)`
    .ant-checkbox-wrapper {
      font-size: 14px;
      font-weight: 400;
      color: #434343;
      line-height: 3;
    }
  `
}

export default FormCard