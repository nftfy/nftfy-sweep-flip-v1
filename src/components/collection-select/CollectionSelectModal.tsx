import { makeVar, useReactiveVar } from '@apollo/client'
import { TokenImage } from '@components/shared/TokenImage'
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Slider, Switch, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export const CollectionSelectModalVar = makeVar(true) // set false

interface CollectionSelectModalProps {
  chainId: number
}

export function CollectionSelectModal({ chainId }: CollectionSelectModalProps) {
  const CollectionSelectModal = useReactiveVar(CollectionSelectModalVar)
  const [selectedCollections, setSelectedCollections] = useState<String[]>([])

  const { Search } = Input
  const { Text, Title } = Typography

  const handleCancel = useCallback(() => {
    setSelectedCollections([])
    CollectionSelectModalVar(false)
  }, [setSelectedCollections])

  const handleSearch = async () => {
    //
  }

  return (
    <Modal
      title={<ModalTitle>Select a collection</ModalTitle>}
      footer=''
      open={CollectionSelectModal}
      onCancel={handleCancel}
      afterClose={handleCancel}
      destroyOnClose
    >
      <Content>
        <Search
          placeholder='Search name or paste address'
          onSearch={handleSearch}
          loading={undefined}
          allowClear
          style={{ width: '100%' }}
        />
        <Text>Common collections</Text>
        
        <hr/>
        <NftContainer>
          <TokenImage
            src={undefined}
            diameter={32}
            address='0x0000000000000000000000000000000000000000'
            loading={undefined}
            borderSize='1px'
            borderColor='var(--gray-7)'
          />
          <Typography.Text>Collection Name</Typography.Text>
        </NftContainer>
      </Content>
    </Modal>
  )
}

const { Content, ModalTitle, NftContainer } = {
  Content: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 26px;
    > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 26px;
    }
  `,
  ModalTitle: styled.div`
    font-size: 20px;
  }
  `,
  NftContainer: styled.a`
    display: flex;
    gap: 20px;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
  `,
}
