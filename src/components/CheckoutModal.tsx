import { makeVar, useReactiveVar } from '@apollo/client'
import { ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons'
import { ReservoirCollection } from '@appTypes/ReservoirCollection'
import { Button, Card, Col, Image, Modal, Row, Typography, Spin } from 'antd'
import Link from 'next/link'
import { useBuyTokens } from 'src/hooks/useBuyTokens'
import styled from 'styled-components'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { useEffect } from 'react'
import useCoinConversion from 'src/hooks/useCoinConversion'
import { formatDollar } from 'lib/numbers'
import { setToast } from './shared/setToast'

type Tokens = paths['/tokens/v5']['get']['responses']['200']['schema']['tokens']

interface CheckoutModalProps {
  collection?: ReservoirCollection
  tokens?: Tokens
  totalPrice?: number
  userBalanceEth?: string | number
  userBalanceNft?: number
  targetProfit?: number
  expectedProfit?: number
  marketplaceFee?: number
  onCallback?: () => void
}

export const CheckoutModalVar = makeVar(false)

export function CheckoutModal({
  collection,
  tokens,
  totalPrice = 0,
  userBalanceEth,
  userBalanceNft,
  targetProfit,
  expectedProfit,
  marketplaceFee,
  onCallback
}: CheckoutModalProps) {
  const CheckoutModal = useReactiveVar(CheckoutModalVar)
  const usdConversion = useCoinConversion('usd', 'ETH')
  const { execute, steps, loading } = useBuyTokens()
  const { Title, Text } = Typography

  const handleOk = () => {
    execute(tokens)
  }

  const handleCancel = () => {
    CheckoutModalVar(false)
  }

  useEffect(() => {
    if (steps) {
      const [finalStep] = steps?.slice(-1)
      const [step] = finalStep?.items || []
      if (!step) return

      if (step.status === 'complete') {
        setToast({
          message: `The transaction was completed hash: ${step.txHash.substring(0, 6)}...`,
          title: 'Success'
        })
        CheckoutModalVar(false)
        onCallback && onCallback()
      }
    }
  }, [steps])

  const nftSymbol = collection?.name ? collection?.name.split(' ')[0].toUpperCase() : 'NFT'
  const salePrice = expectedProfit ? (totalPrice + expectedProfit) / (tokens?.length || 1) : 0
  const rss = collection?.royalties?.bps ? collection.royalties?.bps / 10000 : 0
  const buyRoyality = totalPrice * rss

  const nameCollectionSize = collection?.name?.length || 0

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  return (
    <Modal
      title='Sweep & Flip'
      width={740}
      footer={
        !loading ? (
          <FooterContainer>
            <Button style={{ width: 210 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button style={{ width: 210 }} type='primary' onClick={handleOk}>
              Confirm order
            </Button>
          </FooterContainer>
        ) : (
          <FooterContainer>
            <Spin indicator={antIcon} />
          </FooterContainer>
        )
      }
      open={CheckoutModal}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <>
        <CheckoutContainer>
          <Col span={10}>
            <TokenContainer>
              <Text type='secondary'>
                <strong>Collection</strong>
              </Text>
              <Image width={200} preview={false} style={{ borderRadius: '12px' }} src={collection?.image} />
              <Title level={5}>{nameCollectionSize > 22 ? `${collection?.name?.slice(0, 22)}...` : collection?.name}</Title>
              <Text type='secondary'>NFTFY Top Collections</Text>
              <Card style={{ width: 240 }}>
                <CardContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Text type='secondary'>Floor price</Text>
                    <Text type='secondary'>Best offer</Text>
                    <Text type='secondary'>RSS</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Image style={{ marginTop: '-3px', width: '16px' }} src='/icons/circle-eth.svg' preview={false} />
                      <Text>{collection?.floorAsk?.price?.amount?.native?.toFixed(3)}</Text>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Image style={{ marginTop: '-3px', width: '16px' }} src='/icons/circle-eth.svg' preview={false} />
                      <Text style={{ textAlign: 'center', width: '100%' }}>{collection?.floorAsk?.price?.amount?.native}</Text>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>{rss}%</div>
                  </div>
                </CardContainer>
              </Card>
            </TokenContainer>
          </Col>
          <Col style={{ width: '100%' }}>
            <Card size='small'
              title={
                <>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Col>Pay</Col>
                    <Col>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <Image style={{ marginTop: '-3px', width: '16px' }} src='/icons/circle-eth.svg' preview={false} />
                        {totalPrice} ETH
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={{ fontSize: '12px' }} type='secondary'>
                        Balance: {userBalanceEth} ETH
                      </Text>
                      <Text style={{ fontSize: '12px' }} type='secondary'>
                        {usdConversion && formatDollar(Number(userBalanceEth) * usdConversion)}
                      </Text>
                    </Col>
                  </Row>
                  <ArrowContainer>
                    <Button style={{ position: 'absolute', transform: 'translate(498%,-2%)' }} size='middle' icon={<ArrowDownOutlined />} />
                  </ArrowContainer>
                </>
              }
              style={{ width: '100%', margin: '12px 0' }}
            >
              <>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Col style={{ fontWeight: 600 }}>Receive & Flip</Col>
                  <Col>
                    <div style={{ display: 'flex', gap: '5px', fontWeight: 600 }}>
                      <Image style={{ marginTop: '-3px', width: '16px' }} src={collection?.image} preview={false} />
                      {tokens?.length} {nftSymbol}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontWeight: 600 }}>
                    <Text style={{ fontSize: '12px' }} type='secondary'>
                      Balance: {userBalanceNft} {nftSymbol.length > 22 ? `${nftSymbol.slice(0, 22)}...` : nftSymbol}
                    </Text>
                    <Text style={{ fontSize: '12px' }} type='secondary'>
                      {usdConversion && formatDollar(Number(userBalanceEth) * usdConversion)}
                    </Text>
                  </Col>
                </Row>
              </>
            </Card>

            <Card size='small' style={{ width: '100%' }}>
              <div
                style={{
                  marginBottom: '8px',
                  backgroundColor: 'var(--green-1)',
                  border: '1px solid var(--green-6)',
                  borderRadius: '12px',
                  padding: '5px 12px'
                }}
              >
                <CardContainer>
                  <Col style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Text type='secondary'>Target Profit</Text>
                    <Text type='secondary'>Expected Profit</Text>
                  </Col>
                  <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <Text>{targetProfit}%</Text>
                    <Text>{expectedProfit?.toFixed(3)} ETH</Text>
                  </Col>
                </CardContainer>
              </div>
              <CardContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 12px' }}>
                  <Text type='secondary'>You will receive</Text>
                  <Text type='secondary'>Each NFT will be relisted at</Text>
                  <Text type='secondary'>Collection royalty</Text>
                  <Text type='secondary'>{nameCollectionSize > 22 ? `${collection?.name?.slice(0, 22)}...` : collection?.name} fee</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: '10px', padding: '0 12px' }}>
                  <Text>{expectedProfit?.toFixed(3)} ETH</Text>
                  <Text>{salePrice.toFixed(3)} ETH</Text>
                  <Text>{buyRoyality} ETH</Text>
                  <Text>{marketplaceFee} ETH</Text>
                </div>
              </CardContainer>
            </Card>
          </Col>
        </CheckoutContainer>
      </>
    </Modal>
  )
}

const { FooterContainer, TokenContainer, CardContainer, CheckoutContainer, ArrowContainer } = {
  FooterContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
  `,
  TokenContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  CardContainer: styled.div`
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
  `,
  CheckoutContainer: styled.div`
    display: flex;

    @media (max-width: 640px) {
      flex-direction: column;
    }
  `,
  ArrowContainer: styled.div`
    @media (max-width: 750px) {
      display: none;
    }
  `
}
