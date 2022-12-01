import { Button, Card, Col, Image, Modal, Row, Slider, Typography } from 'antd'
import { useState } from 'react'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import styled from 'styled-components'

const { Title, Text } = Typography
const { Meta } = Card

export function SweepModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  const handleAddOneSlider = () => {
    if (sliderValue < 20) {
      setSliderValue(state => state + 1)
    }
  }

  const handleRemoveOneSlider = () => {
    if (sliderValue > 1) {
      setSliderValue(state => state - 1)
    }
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleConfirm = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={showModal}>Open</Button>
      <Modal
        width={700}
        title={
          <HeaderContainer>
            <Image width='48px' style={{ borderRadius: '999px' }} src='https://github.com/JoaoMarcelo-J.png' />
            <Title level={4}>Azuki</Title>
          </HeaderContainer>
        }
        footer={
          <FooterContainer>
            <Button block onClick={handleCancel}>
              Cancel
            </Button>
            <Button block type='primary' onClick={handleConfirm}>
              Confirm
            </Button>
          </FooterContainer>
        }
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <>
          <Row gutter={16} align='middle'>
            <Col span={20}>
              <SliderContainer>
                <MinusIcon style={{ cursor: 'pointer', color: 'var(--primary-color)', width: '1rem' }} onClick={handleRemoveOneSlider} />
                <Slider style={{ width: '100%' }} min={1} max={20} onChange={setSliderValue} value={sliderValue} />
                <PlusIcon onClick={handleAddOneSlider} />
              </SliderContainer>
            </Col>
            <Col span={3}>
              <CardContainer>
                <div style={{ display: 'flex', gap: '8px' }}>
                  14 <Text type='secondary'>Items</Text>
                </div>
              </CardContainer>
            </Col>
          </Row>
          <Row justify={{ ['xs']: 'center', ['lg']: 'start' }} style={{ marginTop: '2.375rem', gap: '1.1rem', width: '100%' }}>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>

            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
            <CardNftContainer
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={
                <Image
                  preview={false}
                  style={{ borderRadius: '16px', height: '100px' }}
                  alt='example'
                  src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                />
              }
            >
              <Meta title='11.376' style={{ padding: 0 }} />
            </CardNftContainer>
          </Row>
          <Row style={{ marginTop: '1.6rem ' }}>
            <Col style={{ marginTop: '1.6rem ', paddingLeft: '1rem' }} span={21}>
              <Text style={{ color: 'var(--gray-9)' }}>Total Price</Text>
            </Col>
            <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <strong style={{ fontSize: '1rem' }}>240.05</strong>
                <Text>$380,936.16</Text>
              </div>
            </Col>
          </Row>
        </>
      </Modal>
    </>
  )
}

const { HeaderContainer, FooterContainer, SliderContainer, PlusIcon, MinusIcon, CardContainer, CardNftContainer } = {
  HeaderContainer: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
  `,
  FooterContainer: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `,
  SliderContainer: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 5px;
  `,
  PlusIcon: styled(FiPlusCircle)`
    cursor: pointer;
    color: var(--primary-color);
    width: 1rem;

    :hover {
      opacity: 70%;

      transition: opacity 0.2s;
    }
  `,
  MinusIcon: styled(FiMinusCircle)`
    cursor: pointer;
    color: var(--primary-color);
    width: 1rem;

    :hover {
      opacity: 70%;

      transition: opacity 0.2s;
    }
  `,
  CardContainer: styled(Card)`
    width: 90px;
    .ant-card-body {
      padding: 4px 12px 4px 12px !important;
    }
  `,
  CardNftContainer: styled(Card)`
    width: 100%;

    .ant-card-body {
      width: 100%;
      padding: 8px !important;
      display: flex;
      justify-content: center;
    }
  `
}
