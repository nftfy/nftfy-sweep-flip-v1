import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Checkbox, Form, Input, Image, Row, Typography, Alert } from 'antd'
import styled from 'styled-components'
import { CollectionImage } from '@components/shared/CollectionImage'
import { ArrowDownOutlined, ControlOutlined } from '@ant-design/icons'
import { FaAngleDown } from 'react-icons/fa'
import { useAccount, useBalance } from 'wagmi';
import { formatDollar, formatNumber, formatBN } from 'lib/numbers'
import { calculateProfit } from '../utils/index'
import useHandleeInputs from '../hooks/useHandleInputs'
import useCoinConversion from 'src/hooks/useCoinConversion'
import { CollectionSelectModal, CollectionSelectModalVar } from './collection-select/CollectionSelectModal'
import { useReactiveVar } from '@apollo/client'
import { Tokens, useTokens } from 'src/hooks/useTokens'
import { ReservoirCollection } from '../types/ReservoirCollection'
import SliderTokens from './shared/SliderTokens'
import { SweepModal, SweepModalVar } from './SweepModal'
import Link from 'antd/lib/typography/Link'
import useDebounce from 'src/hooks/useDebounce'

const CheckboxGroup = Checkbox.Group

const { Text } = Typography

interface FormCardProps {
  chainId: number
}

const FormCard = ({ chainId }: FormCardProps) => {
  const account = useAccount()
  const usdConversion = useCoinConversion('usd', 'ETH')
  const modalCollection = useReactiveVar(CollectionSelectModalVar)
  const sweepModal = useReactiveVar(SweepModalVar)
  const { tokens, fetchTokens } = useTokens(chainId)
  const { value: ethAmount, setValue: setEthAmount, onChange: onChangeEthAmount, reset: resetEthAmount } = useHandleeInputs()
  const { value: sweepAmount, setValue: setSweepAmount, reset: resetSweepAmount } = useHandleeInputs()

  const { data: balance } = useBalance({ addressOrName: account.address })
  const [profit, setProfit] = useState<number>(40)
  const [expectedProfit, setExpectedProfit] = useState<number>(0)

  const [collectionData, setCollectionData] = useState<ReservoirCollection | undefined>(undefined)
  const [sweepTotalEth, setSweepTotalEth] = useState<number>(0)
  const [sweepTokens, setSweepTokens] = useState<Tokens>([])
  const [maxInput, setMaxInput] = useState<number>(1)
  const [isSufficientAmount, setIsSufficientAmount] = useState<boolean>(false)

  const plainOptions = ['Skip pending', 'Skip suspisious'];

  const addSweepAmountTotal = (amount: number) => {
    if (!sweepTokens?.length) return

    let total = 0
    let totalItems = 0
    for (const token of sweepTokens || []) {
      if (amount > 0 && total + Number(token?.market?.floorAsk?.price?.amount?.native) > amount) break;

      total += Number(token.market?.floorAsk?.price?.amount?.native)
      totalItems += 1
    }

    setSweepAmount(totalItems)
    setIsSufficientAmount(Number(balance?.value) < total)
    setSweepTotalEth(total)
  }

  const addEthAmountTotal = (sweepValue: number) => {
    if (!sweepTokens?.length) return

    let total = 0
    for (const token of sweepTokens?.slice(0, Number(sweepValue)) || []) {
      total += Number(token.market?.floorAsk?.price?.amount?.native)
    }

    setEthAmount(total)
    setIsSufficientAmount(Number(balance?.value) < total)
    setSweepTotalEth(total)
  }

  const handleSelectCollection = (data: ReservoirCollection | undefined) => setCollectionData(data)
  const handleEthAmount = (e) => {
    e.preventDefault()
    const amount = Number(e.target.value.trim())
    setEthAmount(amount)

    addSweepAmountTotal(amount)
  }
  const handleSweepChangeAmount = (value: number) => {
    setSweepAmount(value)
    addEthAmountTotal(value)
  }
  const handleAddOneSlider = () => {
    if (Number(sweepAmount) < maxInput) {
      const value = Number(sweepAmount) + 1
      setSweepAmount(value)

      addEthAmountTotal(value)
    }
  }
  const handleRemoveOneSlider = () => {
    if (Number(sweepAmount) > 1) {
      const value = Number(sweepAmount) - 1
      setSweepAmount(value)

      addEthAmountTotal(value)
    }
  }

  useEffect(() => {
    if (account.isDisconnected || !collectionData) return

    fetchTokens(collectionData.id)
  }, [collectionData])

  useEffect(() => {
    if (account.isDisconnected || !collectionData || !tokens) return
    const availableTokens = tokens?.filter(
      token =>
        token !== undefined &&
        token?.token !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== null &&
        token?.market?.floorAsk?.price?.currency?.symbol === 'ETH'
    )

    const orderTokens = availableTokens?.sort((one, two) => {
      if (Number(one.market?.floorAsk?.price?.amount?.native) < Number(two.market?.floorAsk?.price?.amount?.native)) {
        return -1
      }

      if (Number(one.market?.floorAsk?.price?.amount?.native) > Number(two.market?.floorAsk?.price?.amount?.native)) {
        return 1
      }

      return 0
    })

    setMaxInput(Number(availableTokens?.length))
    setSweepTokens(orderTokens)
  }, [tokens, maxInput])

  useEffect(() => {
    if (!profit) return

    setExpectedProfit()
  }, [sweepTotalEth])

  return (
    <>
      <Card
        title={`Sweep & Flip`}
        style={{ width: '100%' }}
        type='inner'
      >
        <Row gutter={[23, 0]}>
          <Col span={24}>
            <Form layout="vertical" size='large'>
              <FormItem label="Pay">
                <Box>
                  <Content>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text type="secondary">
                        {usdConversion && formatDollar(Number(ethAmount) * usdConversion) || 0}
                      </Text>
                      <Text type="secondary">{`Balance: ${formatBN(balance?.value || 0, 4, balance?.decimals || 2)}`}</Text>
                    </div>
                    { isSufficientAmount && <Text type="danger">Is not a suffcient Amount</Text>}
                  </Content>
                  <Left>
                    <InputWithoutBorder
                      bordered={false}
                      type="number"
                      value={ethAmount}
                      onChange={handleEthAmount}
                    />
                  </Left>
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
                            {maxInput >= 1 && <Link onClick={() => SweepModalVar(true) } style={{ margin: '0 auto' }}>See NFT</Link> }
                            {maxInput === 0 ? (
                              <Text type="danger" style={{ fontSize: 11 }}>No NFT availables</Text>
                            ) : (
                              <SliderTokens
                                amount={maxInput >= 1 ? Number(sweepAmount) : 0}
                                maxAmount={maxInput}
                                onPlus={handleAddOneSlider}
                                onMinus={handleRemoveOneSlider}
                                onChangeAmount={handleSweepChangeAmount}
                              />
                            )}
                          </Col>
                        )
                      }
                    </Content>
                    <Left>
                      <InputWithoutBorder placeholder="0" bordered={false} value={sweepAmount} />
                      <Text type="secondary">{usdConversion && formatDollar(Number(sweepTotalEth) * usdConversion)}</Text>
                    </Left>
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
                  value={profit}
                  onChange={(text) => setProfit(Number(text.target.value.trim() || 0))}
                />
              </FormItem>
              <FormItem>{sweepTotalEth && <ProfitAlert type="success" message={`Expected profit: ${expectedProfit.toFixed(8)}`} /> || '' }</FormItem>
              <FormItem>
                <Space>
                  <CheckGroup options={plainOptions} value={plainOptions} />
                </Space>
                <Button type="primary" block disabled={!account.isConnected || !ethAmount || !sweepTotalEth}>{`Sweep & Flip`}</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Card>

      {modalCollection && <CollectionSelectModal chainId={chainId} onSelect={handleSelectCollection} />}
      {sweepModal && <SweepModal { ...{
        sweepAmount: Number(sweepAmount),
        maxInput,
        collection: collectionData,
        tokens: sweepTokens,
        totalAmount: sweepTotalEth,
        onPlus: handleAddOneSlider,
        onMinus: handleRemoveOneSlider,
        onChangeAmount: handleSweepChangeAmount
      }} />}
    </>
  )
}

const { Box, Content, CheckGroup, ProfitAlert, Top, Space, Left, Right, FormItem, InputWithoutBorder } = {
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
  InputWithoutBorder: styled(Input)`
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
  `,
  ProfitAlert: styled(Alert)`
    text-align: center;
    padding: 0;
    .ant-alert-message {
      color: rgb(82, 196, 26);
    }
  `
}

export default FormCard