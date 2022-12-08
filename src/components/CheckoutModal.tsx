import { Button, Card, Col, Image, Modal, Row, Typography } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

export function CheckoutModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { Title, Text } = Typography

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

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
              Confirm
            </Button>
          </FooterContainer>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <>
          <Row>
            <Col span={10}>
              <TokenContainer>
                <Text type='secondary'>
                  <strong>Collection</strong>
                </Text>
                <Image width={200} preview={false} style={{ borderRadius: '12px' }} src='https://github.com/joaomarcelo-J.png' />
                <Title level={5}>BEANZ</Title>
                <Text type='secondary'>NFTFY Top Collections</Text>
                <Card style={{ width: 240 }}>
                  <CardContent>
                    <Row>
                      <Col span={19}>
                        <Text type='secondary'>Floor price</Text>
                      </Col>
                      <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Text>1</Text>
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
            <Col span={14}></Col>
          </Row>
        </>
      </Modal>
    </>
  )
}

const { FooterContainer, TokenContainer, CardContent } = {
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
  `
}
