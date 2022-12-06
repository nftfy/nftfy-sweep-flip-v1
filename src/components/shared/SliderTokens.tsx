import { Slider } from 'antd'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import styled from 'styled-components'

interface SliderProps {
  amount: number
  minAmount?: number
  maxAmount: number
  onPlus: () => void
  onMinus: () => void
  onChangeAmount: (amount: number) => void

}

const SliderTokens = ({ amount, minAmount = 1, maxAmount, onPlus, onMinus, onChangeAmount }: SliderProps) => {
  return (
    <SliderContainer>
      <MinusIcon style={{ cursor: 'pointer', color: 'var(--primary-color)', width: '1rem' }} onClick={onMinus} />
      <Slider onChange={onChangeAmount} value={amount} style={{ width: '100%' }} min={minAmount} max={maxAmount} />
      <PlusIcon onClick={onPlus}/>
    </SliderContainer>
  )
}

const { MinusIcon, PlusIcon, SliderContainer } = {
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
}


export default SliderTokens