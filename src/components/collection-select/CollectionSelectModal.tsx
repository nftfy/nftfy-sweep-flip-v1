import { makeVar, useReactiveVar } from '@apollo/client'
import { ReservoirCollection } from '@appTypes/ReservoirCollection'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { TokenImage } from '@components/shared/TokenImage'
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Slider, Space, Switch, Typography } from 'antd'
import usePaginatedCollections from '../../hooks/usePaginatedCollections'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCollections } from 'src/hooks/useCollection'

export const CollectionSelectModalVar = makeVar(true) // set false

type Collections = paths['/collections/v5']['get']['responses']['200']['schema']

export function CollectionSelectModal() {
  const CollectionSelectModal = useReactiveVar(CollectionSelectModalVar)

  const [selectedCollection, setSelectedCollection] = useState<ReservoirCollection | undefined>(undefined)
  const [commonCollections, setCommonCollections] = useState<any[] | undefined>(undefined)

  const { fetchCollections, collections, loading} = useCollections(5)

  useEffect(() => {
    fetchCollections().then(() => setCommonCollections(collections?.slice(0, 5)))
  }, [])

  const handleCancel = useCallback(() => {
    CollectionSelectModalVar(false)
  }, [])

  const [id, setId] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)

  const handleSearch = (search: string) => {
    setSelectedCollection(undefined)
    if(search.match(/^0x[a-fA-F0-9]{40}$/g)) {
      setId(search)
    } else {
      setName(search)
    }
  }

  useEffect(() => {
    fetchCollections(id, name)
  }, [id, name])

  const handleSelect = async (item: ReservoirCollection) => {
    setSelectedCollection(item)
  }

  const { Search } = Input
  const { Text } = Typography

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
          onSearch={text => handleSearch(text)}
          loading={loading}
          allowClear
          size='large'
          style={{ width: '100%' }}
        />
        <Text>Common collections</Text>
        <Space direction="vertical">
          <Space wrap>
            {commonCollections && commonCollections.length > 0 && commonCollections.map((item: any) => { 
              return <Button type={selectedCollection?.id === item?.id ? 'primary' : undefined} size='large' onClick={() => handleSelect(item)}>
                <NftButtonContainer>
                  <TokenImage
                    src={item?.image}
                    diameter={24}
                    address={item?.id}
                    loading={loading}
                    borderSize='1px'
                    borderColor='var(--gray-7)'
                  />
                  <Typography.Text>{item?.name}</Typography.Text>
                </NftButtonContainer>
              </Button>})}
          </Space>
        </Space>
        <hr/>
        {!loading && collections && collections.length > 0 && collections.map((item: any) => {
          if(selectedCollection?.id === item?.id) { return <NftListContainer onClick={() => handleSelect(item)}>
          <TokenImage
            src={item?.image}
            diameter={32}
            address={item?.id}
            loading={loading}
            borderSize='1px'
            borderColor='var(--gray-7)'
          />
          <TextNftListSelected>{item?.name}</TextNftListSelected>
        </NftListContainer>} else {
          return <NftListContainer onClick={() => handleSelect(item)}>
          <TokenImage
            src={item?.image}
            diameter={32}
            address={item?.id}
            loading={loading}
            borderSize='1px'
            borderColor='var(--gray-7)'
          />
          <TextNftList><Text>{item?.name}</Text></TextNftList>
        </NftListContainer>
        }
         })}
      </Content>
      <br/>
      <div>{selectedCollection?.name}</div>
    </Modal>
  )
}

const { Content, ModalTitle, NftListContainer, TextNftList, TextNftListSelected, NftButtonContainer } = {
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
  NftListContainer: styled.a`
    display: flex;
    gap: 20px;
    align-items: center;
  `,
  TextNftList: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: black
`,
  TextNftListSelected: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: var(--gray-7)
  `,
  NftButtonContainer: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  `
}