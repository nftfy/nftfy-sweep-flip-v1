import { Button, Card, Col, Image, Modal, Row, Slider, Typography } from 'antd'
import { Tokens, useTokens } from 'src/hooks/useTokens'
import { useEffect, useState } from 'react'
import SliderTokens from './shared/SliderTokens'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import styled from 'styled-components'
import useCoinConversion from 'src/hooks/useCoinConversion'
import { formatDollar } from 'lib/numbers'
import { ReservoirCollection } from '../types/ReservoirCollection'
import { makeVar, useReactiveVar } from '@apollo/client'

const { Title, Text } = Typography
const { Meta } = Card

interface SweepModalProps {
  sweepAmount: number
  maxInput: number
  collection: ReservoirCollection | undefined
  tokens: Tokens | undefined
  onPlus: () => void
  onMinus: () => void
  onChangeAmount: (amount: number) => void
}

export const SweepModalVar = makeVar(false)

export function SweepModal({ sweepAmount, maxInput, collection, tokens, onPlus, onMinus, onChangeAmount }: SweepModalProps) {
  const sweepModal = useReactiveVar(SweepModalVar)
  const usdConversion = useCoinConversion('usd', 'ETH')

  const handleCancel = () => {
    SweepModalVar(false)
  }

  if (!collection || !tokens) return <></>

  return (
    <Modal
      width={700}
      title={
        <HeaderContainer>
          <Image preview={false} width='48px' style={{ borderRadius: '999px' }} src={collection.image} />
          <Title level={4}>{collection.name}</Title>
        </HeaderContainer>
      }
      footer={
        <FooterContainer>
          <Button block onClick={handleCancel}>
            Cancel
          </Button>
          <Button block type='primary'>
            Confirm
          </Button>
        </FooterContainer>
      }
      open={sweepModal}
      onCancel={handleCancel}
    >
      <>
        <Row gutter={16} align='middle'>
          <Col span={20}>
            <SliderTokens
              amount={sweepAmount}
              maxAmount={maxInput}
              onPlus={onPlus}
              onMinus={onMinus}
              onChangeAmount={onChangeAmount}
            />
          </Col>
          <Col span={3}>
            <CardContainer>
              <div style={{ display: 'flex', gap: '8px' }}>
                {tokens?.length} <Text type='secondary'>Items</Text>
              </div>
            </CardContainer>
          </Col>
        </Row>
        <Row justify={{ ['xs']: 'center', ['lg']: 'start' }} style={{ marginTop: '2.375rem', gap: '1.1rem', width: '100%' }}>
          {tokens?.map(nft => (
            <CardNftContainer
              key={nft.token?.tokenId}
              hoverable
              bordered={false}
              style={{ width: 94, padding: 0 }}
              cover={<Image preview={false} style={{ borderRadius: '16px', height: '100px' }} src={nft.token?.image} />}
            >
              <Meta
                style={{ padding: 0 }}
                title={
                  <ImgTextContainer>
                    <Image style={{ marginTop: '-2px' }} src='/icons/eth.svg' preview={false} />
                    <Text>{nft.market?.floorAsk?.price?.amount?.native}</Text>
                  </ImgTextContainer>
                }
              />
            </CardNftContainer>
          ))}
        </Row>
        <Row style={{ marginTop: '1.6rem ' }}>
          <Col style={{ marginTop: '1.6rem ', paddingLeft: '1rem' }} span={21}>
            <Text style={{ color: 'var(--gray-9)' }}>Total Price</Text>
          </Col>
          <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <strong style={{ fontSize: '1rem' }}>{sweepTotal?.toFixed(3)}</strong>
              {usdConversion && sweepTotal && <Text>{formatDollar(usdConversion * sweepTotal)}</Text>}
            </div> */}
          </Col>
        </Row>
      </>
    </Modal>
  )
}

const { HeaderContainer, FooterContainer, SliderContainer, PlusIcon, MinusIcon, CardContainer, CardNftContainer, ImgTextContainer } = {
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
  `,
  ImgTextContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  `
}
