import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Checkbox, Form, Input, Image, Row, Typography, Alert, Tooltip, InputNumber } from 'antd'
import styled from 'styled-components'
import { CollectionImage } from '@components/shared/CollectionImage'
import { ArrowDownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { FaAngleDown } from 'react-icons/fa'
import { useAccount, useBalance } from 'wagmi'
import { formatDollar, formatBN } from 'lib/numbers'
import { calculateProfit, OPENSEA_FEE } from '../utils/index'
import useHandleeInputs from '../hooks/useHandleInputs'
import useCoinConversion from 'src/hooks/useCoinConversion'
import { CollectionSelectModal, CollectionSelectModalVar } from './collection-select/CollectionSelectModal'
import { useReactiveVar } from '@apollo/client'
import { Tokens, useTokens } from 'src/hooks/useTokens'
import { ReservoirCollection } from '../types/ReservoirCollection'
import SliderTokens from './shared/SliderTokens'
import { SweepModal, SweepModalVar } from './SweepModal'
import Link from 'antd/lib/typography/Link'
import { CheckoutModal, CheckoutModalVar } from './CheckoutModal'

const CheckboxGroup = Checkbox.Group

const { Text } = Typography

interface FormCardProps {
  chainId: number
}

const FormCard = ({ chainId }: FormCardProps) => {
  const account = useAccount()
  const usdConversion = useCoinConversion('usd', 'ETH')
  const modalCollection = useReactiveVar(CollectionSelectModalVar)
  const modalCheckout = useReactiveVar(CheckoutModalVar)
  const sweepModal = useReactiveVar(SweepModalVar)
  const { tokens, fetchTokens } = useTokens(chainId)
  const { value: ethAmount, setValue: setEthAmount } = useHandleeInputs()
  const { value: sweepAmount, setValue: setSweepAmount } = useHandleeInputs()

  const { data: balance } = useBalance({ addressOrName: account.address })
  const [profit, setProfit] = useState<number | undefined>()
  const [expectedProfit, setExpectedProfit] = useState<number | undefined>()

  const [collectionData, setCollectionData] = useState<ReservoirCollection | undefined>(undefined)
  const [sweepTotalEth, setSweepTotalEth] = useState<number>(0)
  const [sweepTokens, setSweepTokens] = useState<Tokens>([])
  const [maxInput, setMaxInput] = useState<number>(1)
  const [insufficientAmount, setInsufficientAmount] = useState<boolean>(false)

  const insuficientBalance =
    formatBN(balance?.value || 0, 4, balance?.decimals || 2) < Number(ethAmount) || ethAmount === '0' || ethAmount === '0.'

  const plainOptions = ['Skip pending', 'Skip suspisious']

  const addSweepAmountTotal = (amount: number) => {
    if (!sweepTokens?.length) return

    let total = 0
    let totalItems = 0
    for (const token of sweepTokens || []) {
      if (amount > 0 && total + Number(token?.market?.floorAsk?.price?.amount?.native) > amount) break

      total += Number(token.market?.floorAsk?.price?.amount?.native)
      totalItems += 1
    }

    setSweepAmount(totalItems)
    setInsufficientAmount(Number(balance?.value) < total)
    setSweepTotalEth(total)
    addExpectedProfit(total)
  }

  const addEthAmountTotal = (sweepValue: number) => {
    if (!sweepTokens?.length) return

    let total = 0
    for (const token of sweepTokens?.slice(0, Number(sweepValue)) || []) {
      total += Number(token.market?.floorAsk?.price?.amount?.native)
    }

    setEthAmount(total)
    setInsufficientAmount(Number(balance?.value) < total)
    setSweepTotalEth(total)
    addExpectedProfit(total)
  }

  const addExpectedProfit = (total: number) => {
    if (!collectionData || !tokens || !profit) return

    setExpectedProfit(calculateProfit(total, profit))
  }

  const handleSelectCollection = (data: ReservoirCollection | undefined) => setCollectionData(data)

  const handleEthAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const amount = e.target.value.replace(/[^0-9.]/g, '').trim()
    setEthAmount(amount)

    addSweepAmountTotal(Number(amount))
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

  const resetFormData = () => {
    setSweepAmount(0)
    setEthAmount(0)
    setSweepTotalEth(0)
    setMaxInput(0)
    setCollectionData(undefined)
    setSweepTokens([])
  }

  useEffect(() => {
    if (account.isDisconnected || !collectionData) return

    fetchTokens(collectionData.id)
  }, [collectionData])

  useEffect(() => {
    if (!ethAmount || sweepAmount) {
      return
    }

    setSweepAmount(0)
  }, [ethAmount, sweepAmount])

  useEffect(() => {
    if (account.isDisconnected || !collectionData || !tokens) {
      return
    }

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

    const limit = Number(availableTokens?.length)
    setSweepAmount(0)
    setEthAmount(0)
    setSweepTotalEth(0)
    setMaxInput(limit)
    setSweepTokens(orderTokens)
  }, [tokens, maxInput])

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong>Sweep & Flip</Text>
            <Tooltip title='Sweep the floor price NFTs, set your desired target profit, and automatically flip them all at once to achieve your selling goals.'>
              <QuestionCircleOutlined size={24} />
            </Tooltip>
          </div>
        }
        style={{ width: '100%' }}
        type='inner'
      >
        <Row gutter={[23, 0]}>
          <Col span={24}>
            <Form layout='vertical' size='large'>
              <FormItem label='Pay'>
                <Box>
                  <Content>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <div>
                        <Text type='secondary'>{(usdConversion && formatDollar(Number(ethAmount || 0) * usdConversion)) || 0}</Text>
                        <Text type='secondary'>
                          {ethAmount !== sweepTotalEth && sweepTotalEth !== 0 && (
                            <Button type='link' onClick={() => setEthAmount(sweepTotalEth)}>
                              {`use: (${formatBN(sweepTotalEth, 4, 2)})`}
                            </Button>
                          )}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text type='secondary'>{`Balance: ${formatBN(balance?.value || 0, 4, balance?.decimals || 2)}`}</Text>
                        {insuficientBalance && (
                          <Text type='danger' style={{ fontSize: '12px' }}>
                            Insufficient balance
                          </Text>
                        )}
                      </div>
                    </div>
                    {insufficientAmount && <Text type='danger'>Insufficient amount</Text>}
                  </Content>
                  <Left>
                    <InputWithoutBorder
                      placeholder={'0'}
                      style={{ color: 'var(--gray-10)', padding: '0' }}
                      bordered={false}
                      value={ethAmount}
                      onChange={handleEthAmount}
                    />
                  </Left>
                  <Right>
                    <Button
                      icon={
                        <Image
                          src='/icons/eth-balance.svg'
                          preview={false}
                          width={24}
                          height={24}
                          style={{ paddingRight: 6, paddingBottom: 2 }}
                        />
                      }
                      size='large'
                    >
                      ETH
                    </Button>
                  </Right>
                </Box>
              </FormItem>
              <Space>
                <Button size='large' icon={<ArrowDownOutlined />} />
              </Space>
              <Top>
                <FormItem label='Receive'>
                  <Box>
                    <Content>
                      {collectionData && (
                        <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          {maxInput >= 1 && (
                            <Link onClick={() => SweepModalVar(true)} style={{ margin: '0 auto' }}>
                              See NFTs
                            </Link>
                          )}
                          {maxInput === 0 ? (
                            <Text type='danger' style={{ fontSize: 11 }}>
                              No NFT availables
                            </Text>
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
                      )}
                    </Content>
                    <Left>
                      <InputWithoutBorder
                        style={{ color: 'var(--gray-10)', padding: '0', marginBottom: '8px' }}
                        placeholder='0'
                        bordered={false}
                        value={sweepAmount}
                      />
                      <Text type='secondary'>{usdConversion && formatDollar(Number(sweepTotalEth) * usdConversion)}</Text>
                    </Left>
                    <Right>
                      {collectionData ? (
                        <Button size='large' onClick={() => CollectionSelectModalVar(true)}>
                          <Space>
                            <Image
                              preview={false}
                              src={collectionData?.image}
                              style={{ borderColor: 'var(--gray-7)', borderWidth: '1px', width: 24, height: 24, borderRadius: 12 }}
                            />
                            &nbsp;
                            <div>
                              {String(collectionData?.name).length > 10 ? `${collectionData?.name?.slice(0, 10)}...` : collectionData?.name}
                            </div>
                            <FaAngleDown />
                          </Space>
                        </Button>
                      ) : (
                        <Button type='primary' size='large' onClick={() => CollectionSelectModalVar(true)}>
                          <Space>
                            <div>Select collection</div> <FaAngleDown />
                          </Space>
                        </Button>
                      )}
                    </Right>
                  </Box>
                </FormItem>
              </Top>
              <FormItem label='Set target profit'>
                <TextNumber
                  placeholder='0%'
                  controls={false}
                  value={profit}
                  formatter={(value) => value ? `${value}%` : ''}
                  parser={(value) => value!.replace('%', '')}
                  onChange={value => {
                    setProfit(Number(value))
                    setExpectedProfit(calculateProfit(sweepTotalEth, Number(value)))
                  }}
                />
              </FormItem>
              {!!sweepTotalEth && !!profit && (
                <FormItem>
                  <ProfitAlert type='success' message={`Expected profit: ${expectedProfit?.toFixed(4)} ETH`} />
                </FormItem>
              )}
              <FormItem>
                <Space>
                  <CheckGroup options={plainOptions} value={plainOptions} />
                </Space>
                <Button
                  type='primary'
                  block
                  disabled={!account.isConnected || !ethAmount || !sweepTotalEth || insufficientAmount || insuficientBalance}
                  onClick={() => CheckoutModalVar(true)}
                >
                  {`Sweep & Flip`}
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Card>

      {modalCollection && <CollectionSelectModal chainId={chainId} onSelect={handleSelectCollection} />}
      {sweepModal && (
        <SweepModal
          {...{
            sweepAmount: Number(sweepAmount),
            maxInput,
            collection: collectionData,
            tokens: sweepTokens,
            totalAmount: sweepTotalEth,
            onPlus: handleAddOneSlider,
            onMinus: handleRemoveOneSlider,
            onChangeAmount: handleSweepChangeAmount
          }}
        />
      )}
      {modalCheckout && (
        <CheckoutModal
          collection={collectionData}
          tokens={sweepTokens?.slice(0, Number(sweepAmount))}
          totalPrice={sweepTotalEth}
          userBalanceEth={formatBN(balance?.value || 0, 4, balance?.decimals || 2).toString()}
          userBalanceNft={0}
          targetProfit={profit}
          expectedProfit={expectedProfit}
          marketplaceFee={OPENSEA_FEE}
          onCallback={resetFormData}
        />
      )}
    </>
  )
}

const { Box, Content, CheckGroup, ProfitAlert, Top, Space, Left, Right, FormItem, InputWithoutBorder, TextNumber } = {
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
    border: 1px solid var(--gray-5);
    border-radius: 12px;
    padding: 8px;
    margin-bottom: 10px;
    gap: 4px;
    grid-template-areas:
      'left right'
      'content content';
  `,
  Top: styled.div`
    margin-top: -36px;
  `,
  FormItem: styled(Form.Item)`
    label {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-10);
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
    &:focus {
      border-color: none;
      outline: none;
    }
  `,
  TextNumber: styled(InputNumber)`
    color: var(--gray-10);
    width: 100%;
    .ant-input-number-input {
      text-align: center;
    }
  `,
  CheckGroup: styled(CheckboxGroup)`
    .ant-checkbox-wrapper {
      font-size: 14px;
      font-weight: 400;
      color: var(--gray-9);
      line-height: 3;
    }
  `,
  ProfitAlert: styled(Alert)`
    text-align: center;
    padding: 0;
    .ant-alert-message {
      color: var(--green-6);
    }
  `
}

export default FormCard
