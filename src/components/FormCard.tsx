import { useState } from 'react'
import { Button, Card, Col, Checkbox, Form, Input, Image, Row } from 'antd'
import styled from 'styled-components'
import { ArrowDownOutlined } from '@ant-design/icons'
import { FaAngleDown } from 'react-icons/fa'
import { useAccount } from 'wagmi';
import { CollectionSelectModal, CollectionSelectModalVar } from './collection-select/CollectionSelectModal'
import { useReactiveVar } from '@apollo/client'

const CheckboxGroup = Checkbox.Group;

interface FormCardProps {
  chainId: number
}

const FormCard = ({ chainId }: FormCardProps) => {
  const [form] = Form.useForm()
  const modalCollection = useReactiveVar(CollectionSelectModalVar)
  const account = useAccount()
  const [profit, setProfit] = useState<number>(40)
  const plainOptions = ['Skip pending', 'Skip suspisious'];


  return (
    <>
      <Card
        title={`Sweep & Flip`}
        style={{ width: '100%' }}
        type='inner'
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
              <Space><Button size="large" icon={<ArrowDownOutlined />} /></Space>
              <Top>
                <FormItem label="Receive">
                  <Box>
                    <Content>{/* select */}</Content>
                    <Left><InputWithouBorder placeholder="0" bordered={false} /></Left>
                    <Right>
                      <Button type="primary" size="large" onClick={() => CollectionSelectModalVar(true)}>
                        <Space>
                          <div>Select collection</div> <FaAngleDown />
                        </Space>
                      </Button>
                    </Right>
                  </Box>
                </FormItem>
              </Top>

              <FormItem label="Set target profit">
                <Input
                  placeholder='0%'
                  style={{ textAlign: 'center' }}
                  onChange={(text) => setProfit(Number(text.target.value.trim() || 0))}
                />
              </FormItem>
              <FormItem>
                <Space>
                  <CheckGroup options={plainOptions} />
                </Space>
                <Button type="primary" block disabled={!account.isConnected}>{`Sweep & Flip`}</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Card>

      {modalCollection && <CollectionSelectModal chainId={chainId} />}
    </>
  )
}

const { Box, Content, CheckGroup, Top, Space, Left, Right, FormItem, InputWithouBorder } = {
  Space: styled.div`
    display: flex;
    flex-direction: row;
    justify-items: baseline;
    align-items: center;
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
  Top: styled.div`
    margin-top: -36px;
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