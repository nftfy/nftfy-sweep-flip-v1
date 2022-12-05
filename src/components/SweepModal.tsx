import { Button, Card, Col, Image, Modal, Row, Slider, Typography } from 'antd'
import { Tokens, useTokens } from 'src/hooks/useTokens'
import { useEffect, useState } from 'react'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import styled from 'styled-components'
import useCoinConversion from 'src/hooks/useCoinConversion'
import { formatDollar } from 'lib/numbers'
import { ReservoirCollection } from '../types/ReservoirCollection'

const { Title, Text } = Typography
const { Meta } = Card

type SweepTokens = {
  nftId: number
  nftImage: string
  nftPrice: string
}

interface SweepModalProps {
  chainId: number
  collection: ReservoirCollection
}

export function SweepModal({ chainId, collection }: SweepModalProps) {
  const { tokens, fetchTokens } = useTokens(chainId)
  const usdConversion = useCoinConversion('usd', 'ETH')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sweepAmount, setSweepAmount] = useState<number>(1)
  const [sweepTokens, setSweepTokens] = useState<Tokens>([])
  const [maxInput, setMaxInput] = useState<number>(1)
  const [sweepTotal, setSweepTotal] = useState<number | undefined>(0)

  useEffect(() => {
    fetchTokens(collection.id)
  }, [])

  useEffect(() => {
    const availableTokens = tokens?.filter(
      token =>
        token !== undefined &&
        token?.token !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== undefined &&
        token?.market?.floorAsk?.price?.amount?.native !== null &&
        token?.market?.floorAsk?.price?.currency?.symbol === 'ETH'
    )
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
  }, [sweepAmount, tokens])

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
            <Image width='48px' style={{ borderRadius: '999px' }} src={collection.image} />
            <Title level={4}>{collection.name}</Title>
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
                <Slider onChange={setSweepAmount} value={sweepAmount} style={{ width: '100%' }} min={1} max={maxInput} />
                <PlusIcon onClick={handleAddOneSlider} />
              </SliderContainer>
            </Col>
            <Col span={3}>
              <CardContainer>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {sweepTokens?.length} <Text type='secondary'>Items</Text>
                </div>
              </CardContainer>
            </Col>
          </Row>
          <Row justify={{ ['xs']: 'center', ['lg']: 'start' }} style={{ marginTop: '2.375rem', gap: '1.1rem', width: '100%' }}>
            {sweepTokens?.map(nft => (
              <CardNftContainer
                key={nft.token?.tokenId}
                hoverable
                bordered={false}
                style={{ width: 94, padding: 0 }}
                cover={<Image preview={false} style={{ borderRadius: '16px', height: '100px' }} src={nft.token?.image} />}
              >
                <Meta title={nft.market?.floorAsk?.price?.amount?.native} style={{ padding: 0 }} />
              </CardNftContainer>
            ))}
          </Row>
          <Row style={{ marginTop: '1.6rem ' }}>
            <Col style={{ marginTop: '1.6rem ', paddingLeft: '1rem' }} span={21}>
              <Text style={{ color: 'var(--gray-9)' }}>Total Price</Text>
            </Col>
            <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <strong style={{ fontSize: '1rem' }}>{sweepTotal}</strong>
                {usdConversion && sweepTotal && <Text>{formatDollar(usdConversion * sweepTotal)}</Text>}
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
