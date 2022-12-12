import { ArrowDownOutlined } from '@ant-design/icons'
import { ReservoirCollection } from '@appTypes/ReservoirCollection'
import { Button, Card, Col, Image, Modal, Row, Typography } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

interface CheckoutModalProps {
  collection: ReservoirCollection
  tokens: any[]
  totalPrice: number
  userBalanceEth: string
  userBalanceNft: string
  targetProfit: number
}

export function CheckoutModal({ collection, tokens, totalPrice, userBalanceEth, userBalanceNft, targetProfit }: CheckoutModalProps) {
  // const { execute, steps, errors, loading } = useBuyTokens()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { Title, Text } = Typography

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    // execute(tokens)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const expectedProfit = (targetProfit / 100) * totalPrice
  const relisted = (totalPrice + expectedProfit) / tokens?.length
  const fee = totalPrice * 0.025

  return (
    <>
      <Button type='primary' onClick={showModal}>
        Open Modal
      </Button>

      <Modal
        title='Sweep & Flip'
        width={740}
        footer={
          <FooterContainer>
            <Button style={{ width: 210 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button style={{ width: 210 }} type='primary' onClick={handleOk}>
              Confirm order
            </Button>
          </FooterContainer>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <>
          <CheckoutContainer>
            <Col span={10}>
              <TokenContainer>
                <Text type='secondary'>
                  <strong>Collection</strong>
                </Text>
                <Image width={200} preview={false} style={{ borderRadius: '12px' }} src={collection?.image} />
                <Title level={5}>{collection?.name}</Title>
                <Text type='secondary'>NFTFY Top Collections</Text>
                <Card style={{ width: 240 }}>
                  <CardContent>
                    <Row>
                      <Col span={19}>
                        <Text type='secondary'>Floor price</Text>
                      </Col>
                      <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Text>{collection?.floorAsk?.price?.amount?.native}</Text>
                      </Col>
                      <Col span={1}>
                        <Image style={{ marginTop: '-3px', width: '16px' }} src='/icons/circle-eth.svg' preview={false} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={19}>
                        <Text type='secondary'>Best offer</Text>
                      </Col>
                      <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', width: '100%' }}>0</Text>
                      </Col>
                      <Col span={1}>
                        <Image style={{ marginTop: '-3px', width: '16px' }} src='/icons/circle-eth.svg' preview={false} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={20}>
                        <Text type='secondary'>RSS</Text>
                      </Col>
                      <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        10%
                      </Col>
                    </Row>
                  </CardContent>
                </Card>
              </TokenContainer>
            </Col>
            <Col style={{ width: '100%' }}>
              <Card
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
                          $230.94
                        </Text>
                      </Col>
                    </Row>
                    <ArrowContainer>
                      <Button
                        style={{ position: 'absolute', transform: 'translate(390%,-5%)' }}
                        size='large'
                        icon={<ArrowDownOutlined />}
                      />
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
                        {tokens?.length}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontWeight: 600 }}>
                      <Text style={{ fontSize: '12px' }} type='secondary'>
                        Balance: {userBalanceNft} {collection?.name}
                      </Text>
                      <Text style={{ fontSize: '12px' }} type='secondary'>
                        $237.04
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Link href=''>
                        <Text
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '0px',
                            color: 'var(--primary-color)'
                          }}
                        >
                          See NFTs
                        </Text>
                      </Link>
                    </Col>
                  </Row>
                </>
              </Card>

              <Card style={{ width: '100%' }}>
                <div
                  style={{
                    marginLeft: '-7px',
                    marginBottom: '8px',
                    backgroundColor: 'var(--green-1)',
                    border: '1px solid var(--green-6)',
                    borderRadius: '12px',
                    padding: '5px 8px'
                  }}
                >
                  <CardContainer>
                    <Col style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Text type='secondary'>Target Profit</Text>
                      <Text type='secondary'>Expected Profit</Text>
                    </Col>
                    <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <Text>{targetProfit}%</Text>
                      <Text>{expectedProfit} ETH</Text>
                    </Col>
                  </CardContainer>
                </div>
                <CardContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Text type='secondary'>You will receive</Text>
                    <Text type='secondary'>Each NFT will be relisted at</Text>
                    <Text type='secondary'>Collection royalty</Text>
                    <Text type='secondary'>{collection?.name} fee</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: '8px' }}>
                    <Text>0.2955 ETH</Text> {/* You will receive */}
                    <Text>{relisted} ETH</Text>
                    <Text>0.0328332 ETH</Text> {/* Collection royalty */}
                    <Text>{fee} ETH</Text> {/* Collection fee */}
                  </div>
                </CardContainer>
              </Card>
            </Col>
          </CheckoutContainer>
        </>
      </Modal>
    </>
  )
}

const { FooterContainer, TokenContainer, CardContent, CardContainer, CheckoutContainer, ArrowContainer } = {
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

  CardContent: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  CardContainer: styled.div`
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
  `,
  CheckoutContainer: styled.div`
    display: flex;

    @media (max-width: 638px) {
      flex-direction: column;
    }
  `,
  ArrowContainer: styled.div`
    @media (max-width: 638px) {
      display: none;
    }
  `
}