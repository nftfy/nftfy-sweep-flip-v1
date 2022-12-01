import { makeVar, useReactiveVar } from '@apollo/client'
import { ReservoirCollection } from '@appTypes/ReservoirCollection'
import { TokenImage } from '@components/shared/TokenImage'
import { Button, Input, Modal, Space, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCollections } from 'src/hooks/useCollection'

export const CollectionSelectModalVar = makeVar(true) // set false

export function CollectionSelectModal() {
  const CollectionSelectModal = useReactiveVar(CollectionSelectModalVar)
  const [mounted, setMounted] = useState<boolean>(false)

  const [selectedCollection, setSelectedCollection] = useState<ReservoirCollection | undefined>(undefined)
  const [commonCollections, setCommonCollections] = useState<any[] | undefined>(undefined)

  const { fetchCollections, collections, loading} = useCollections(5)

  useEffect(() => {
    setMounted(false)
    fetchCollections(false).then(() => {
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    setCommonCollections(collections?.slice(0, 5))
  }, [mounted])

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
    fetchCollections(false, id, name)
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
            {commonCollections && commonCollections.length > 0 && commonCollections.map((item: ReservoirCollection) => { 
              return <Button key={item.id} type={selectedCollection?.id === item?.id ? 'primary' : undefined} size='large' onClick={() => handleSelect(item)}>
                <CollectionButtonContainer>
                  <TokenImage
                    src={item?.image}
                    diameter={24}
                    address={item?.id}
                    loading={loading}
                    borderSize='1px'
                    borderColor='var(--gray-7)'
                  />
                  <Typography.Text>{item?.name}</Typography.Text>
                </CollectionButtonContainer>
              </Button>})}
          </Space>
        </Space>
        <hr/>
        {!loading && collections && collections.length > 0 && collections.map((item: ReservoirCollection) => {
          if(selectedCollection?.id === item?.id) { return <CollectionListContainer key={item.id} onClick={() => handleSelect(item)}>
          <TokenImage
            src={item?.image}
            diameter={32}
            address={item?.id}
            loading={loading}
            borderSize='1px'
            borderColor='var(--gray-7)'
            selected={true}
          />
          <TextCollectionListSelected>{item?.name}</TextCollectionListSelected>
        </CollectionListContainer>} else {
          return <CollectionListContainer key={item.id} onClick={() => handleSelect(item)}>
          <TokenImage
            src={item?.image}
            diameter={32}
            address={item?.id}
            loading={loading}
            borderSize='1px'
            borderColor='var(--gray-7)'
            selected={false}
          />
          <TextCollectionList><Text>{item?.name}</Text></TextCollectionList>
        </CollectionListContainer>
        }
         })}
      </Content>
      <br/>
      <div>{selectedCollection?.name}</div>
    </Modal>
  )
}

const { Content, ModalTitle, CollectionListContainer, TextCollectionList, TextCollectionListSelected, CollectionButtonContainer } = {
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
  CollectionListContainer: styled.a`
    display: flex;
    gap: 20px;
    align-items: center;
  `,
  TextCollectionList: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: black
`,
  TextCollectionListSelected: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: var(--gray-7)
  `,
  CollectionButtonContainer: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  `
}