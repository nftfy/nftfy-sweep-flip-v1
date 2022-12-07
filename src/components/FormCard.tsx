import { useEffect, useState } from 'react'
import { Button, Card, Col, Checkbox, Form, Input, Image, Row, Typography } from 'antd'
import styled from 'styled-components'
import { CollectionImage } from '@components/shared/CollectionImage'
import { ArrowDownOutlined } from '@ant-design/icons'
import { FaAngleDown } from 'react-icons/fa'
import { useAccount } from 'wagmi';
import { CollectionSelectModal, CollectionSelectModalVar } from './collection-select/CollectionSelectModal'
import { useReactiveVar } from '@apollo/client'
import { Tokens, useTokens } from 'src/hooks/useTokens'
import { ReservoirCollection } from '../types/ReservoirCollection'
import SliderTokens from './shared/SliderTokens'
import { SweepModal, SweepModalVar } from './SweepModal'
import Link from 'antd/lib/typography/Link'

const CheckboxGroup = Checkbox.Group

const { Text } = Typography

interface FormCardProps {
  chainId: number
}

const FormCard = ({ chainId }: FormCardProps) => {
  const account = useAccount()
  const modalCollection = useReactiveVar(CollectionSelectModalVar)
  const sweepModal = useReactiveVar(SweepModalVar)
  const { tokens, fetchTokens } = useTokens(chainId)
  const [form] = Form.useForm()
  const [profit, setProfit] = useState<number>(40)
  const [collectionData, setCollectionData] = useState<ReservoirCollection | undefined>(undefined)
  const [sweepAmount, setSweepAmount] = useState<number>(1)
  const [sweepTokens, setSweepTokens] = useState<Tokens>([])
  const [maxInput, setMaxInput] = useState<number>(1)
  const [sweepTotal, setSweepTotal] = useState<number | undefined>(0)

  const plainOptions = ['Skip pending', 'Skip suspisious'];

  const handleSelectCollection = (data: ReservoirCollection | undefined) => setCollectionData(data)

  useEffect(() => {
    if (account.isDisconnected || !collectionData) return

    fetchTokens(collectionData.id)
  }, [collectionData])

  useEffect(() => {
    const availableTokens = tokens?.filter(
      token =>
        token !== undefined &&
        token?.token !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== null &&
        token?.market?.floorAsk?.price?.currency?.symbol === 'ETH'
    )
    console.log(availableTokens)
    setMaxInput(availableTokens?.length || 1)

    const sweepTokens = availableTokens?.slice(0, sweepAmount)

    setSweepTokens(sweepTokens)

    const total = sweepTokens?.reduce((total, token) => {
      if (token?.market?.floorAsk?.price?.amount?.native) {
        total += token.market.floorAsk.price.amount.native
      }
      return total
    }, 0)

    setSweepTotal(total)
  }, [sweepAmount, tokens, maxInput])

  const handleAddOneSlider = () => {
    if (sweepAmount < maxInput) {
      setSweepAmount(state => state + 1)
    }
  }

  const handleRemoveOneSlider = () => {
    if (sweepAmount > 1) {
      setSweepAmount(state => state - 1)
    }
  }

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
                        src="/icons/eth-balance.svg"
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
                    <Content>
                      {
                        collectionData && (
                          <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {maxInput >= 1 && <Link onClick={() => SweepModalVar(true) }>See NFT</Link> }
                            <SliderTokens
                              amount={sweepAmount}
                              maxAmount={maxInput}
                              onPlus={handleAddOneSlider}
                              onMinus={handleRemoveOneSlider}
                              onChangeAmount={setSweepAmount}
                            />
                          </Col>
                        )
                      }
                      <>{maxInput === 0 && <Text type="danger" style={{ fontSize: 11 }}>No NFT availables</Text>}</>
                    </Content>
                    <Left><InputWithouBorder placeholder="0" bordered={false} value={sweepAmount} /></Left>
                    <Right>
                      {collectionData ?
                        (
                          <Button size="large" onClick={() => CollectionSelectModalVar(true)}>
                            <Space>
                              <CollectionImage
                                src={collectionData?.image}
                                diameter={24}
                                address={collectionData?.id}
                                loading={false}
                                borderSize='1px'
                                borderColor='var(--gray-7)'
                              />&nbsp;
                              <div>{String(collectionData?.name).length > 10 ? `${collectionData?.name?.slice(0, 10)}...` : collectionData?.name}</div>
                              <FaAngleDown />
                            </Space>
                          </Button>
                        )
                        : (
                          <Button type="primary" size="large" onClick={() => CollectionSelectModalVar(true)}>
                            <Space>
                              <div>Select collection</div> <FaAngleDown />
                            </Space>
                          </Button>
                        )}
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

      {modalCollection && <CollectionSelectModal chainId={chainId} onSelect={handleSelectCollection} />}
      {sweepModal && <SweepModal { ...{
        sweepAmount,
        maxInput,
        collection: collectionData,
        tokens,
        onPlus: handleAddOneSlider,
        onMinus: handleRemoveOneSlider,
        onChangeAmount: setSweepAmount
      }} />}
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