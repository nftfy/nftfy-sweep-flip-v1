import { Image as AntImage, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled, { css } from 'styled-components'
// import { useCollectionDetails } from '../../hooks/query/erc721Collection/useCollectionDetails'
// import { TokenTypeEnum } from '../../types/models/enums/TokenTypeEnum'
import { imageFailedFallback } from './ImageFailedFallback'

interface Erc721CollectionImageProps {
  src?: string
  address: string
  diameter: number
  borderSize?: string
  borderColor?: string
  shape?: 'circle' | 'square'
  className?: string
  loading?: boolean
  selected?: boolean
}

export function TokenImage({
  address,
  src,
  className = '',
  diameter,
  loading = false,
  shape = 'circle',
  borderSize = '0',
  borderColor = 'transparent',
  selected = false
}: Erc721CollectionImageProps) {
  const [hasFailed, setHasFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(loading)
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (src) {
      const img = new Image()

      img.src = src

      img.onload = () => {
        setHasFailed(false)
        setLoadedSrc(src)
        setIsLoading(false)
      }

      img.onerror = () => {
        setHasFailed(true)
        setIsLoading(false)
      }
      return
    }
    else {
      setHasFailed(true)
      setIsLoading(false)
      return
    }
  }, [src, isLoading, hasFailed])

  return (
    <ContainerImg shape={shape} diameter={diameter} borderSize={borderSize} borderColor={borderColor}>
      {isLoading && <Skeleton.Avatar active size={diameter} />}
      {(hasFailed || !src) && shape === 'circle' && <Jazzicon seed={jsNumberForAddress(address || '')} diameter={diameter} />}
      {(hasFailed || !src) && shape === 'square' && (
        <AntImage width={diameter} height={diameter} src='error' fallback={imageFailedFallback} />
      )}
      {!hasFailed && !isLoading && <Img src={loadedSrc} className={className} diameter={diameter} selected={selected || false} />}
    </ContainerImg>
  )
}

const { ContainerImg, Img } = {
  ContainerImg: styled.div<{ shape: 'circle' | 'square'; diameter: number; borderSize: string; borderColor: string }>`
    overflow: hidden;
    min-width: ${({ diameter }) => diameter}px;
    height: ${({ diameter }) => diameter}px;
    width: ${({ diameter }) => diameter}px;
    border-width: ${({ borderSize }) => borderSize};
    border-color: ${({ borderColor }) => borderColor};
    border-style: solid;
    ${({ shape }) =>
      shape === 'circle'
        ? css`
            border-radius: 50%;
            overflow: hidden;
          `
        : css`
            border-radius: 12px;
          `};
  `,
  Img: styled.img<{ selected: boolean, diameter: number }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
    ${({ selected }) =>
    selected
      ? css`
          filter: opacity(50%);
        `
      : css``
    };
  `
}
