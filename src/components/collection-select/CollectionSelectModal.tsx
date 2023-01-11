import { makeVar, useReactiveVar } from '@apollo/client'
import { ReservoirCollection } from '@appTypes/ReservoirCollection'
import { CollectionImage } from '@components/shared/CollectionImage'
import { Button, Input, Modal, Space, Spin, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCollections } from 'src/hooks/useCollection'
import { LoadingOutlined } from '@ant-design/icons'
import { paths } from '@reservoir0x/reservoir-kit-client'

type Collections = paths['/collections/v5']['get']['responses']['200']['schema']['collections']

export interface CollectionSelectModalProps {
  chainId: number
  onSelect: (value: ReservoirCollection | undefined) => void
}

export const collectionSelectModalVar = makeVar(false)

export function CollectionSelectModal({ chainId, onSelect }: CollectionSelectModalProps) {
  const collectionSelectModal = useReactiveVar(collectionSelectModalVar)
  const [mounted, setMounted] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCollection, setSelectedCollection] = useState<ReservoirCollection | undefined>(undefined)
  const [commonCollections, setCommonCollections] = useState<Collections | undefined>(undefined)

  const { fetchCollections, collections, hasMore, loading } = useCollections(chainId)

  useEffect(() => {
    setMounted(false)
    fetchCollections(false).then(() => {
      setMounted(true)
    })
  }, [fetchCollections])

  useEffect(() => {
    setCommonCollections(collections?.slice(0, 5) || undefined)
  }, [collections, mounted])

  const handleCancel = useCallback(() => {
    collectionSelectModalVar(false)
  }, [])

  const [id, setId] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)

  const handleSearch = (search: string) => {
    onSelect(undefined)
    if (search.match(/^0x[a-fA-F0-9]{40}$/g)) {
      setId(search)
    } else {
      setName(search)
    }
  }

  useEffect(() => {
    fetchCollections(false, id, name)
  }, [fetchCollections, id, name])

  const handleSelect = async (item: ReservoirCollection) => {
    onSelect(item)
    collectionSelectModalVar(false)
  }

  const handleFetchMore = async () => {
    fetchCollections(true, id, name)
  }

  const { Search } = Input
  const { Text } = Typography

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  return (
    <Modal
      title={<ModalTitle>Select a collection</ModalTitle>}
      footer=''
      open={collectionSelectModal}
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
        <Space direction='vertical'>
          {!mounted && <Spin indicator={antIcon} />}
          <Space wrap>
            {commonCollections &&
              commonCollections.length > 0 &&
              commonCollections.map((item: ReservoirCollection) => {
                return (
                  <Button
                    key={item.id}
                    type={selectedCollection?.id === item?.id ? 'primary' : undefined}
                    size='large'
                    onClick={() => handleSelect(item)}
                  >
                    <CollectionButtonContainer>
                      <CollectionImage
                        src={item?.image}
                        diameter={24}
                        address={item?.id}
                        loading={loading}
                        borderSize='1px'
                        borderColor='var(--gray-7)'
                      />
                      <Typography.Text>{item?.name}</Typography.Text>
                    </CollectionButtonContainer>
                  </Button>
                )
              })}
          </Space>
        </Space>
        <hr />
        {mounted &&
          collections &&
          collections.length > 0 &&
          collections.map((item: ReservoirCollection) => {
            if (selectedCollection?.id === item?.id) {
              return (
                <CollectionListContainer key={item.id} onClick={() => handleSelect(item)}>
                  <CollectionImage
                    src={item?.image}
                    diameter={32}
                    address={item?.id}
                    loading={loading}
                    borderSize='1px'
                    borderColor='var(--gray-7)'
                    selected
                  />
                  <TextCollectionListSelected>{item?.name}</TextCollectionListSelected>
                </CollectionListContainer>
              )
            }
            return (
              <CollectionListContainer key={item.id} onClick={() => handleSelect(item)}>
                <CollectionImage
                  src={item?.image}
                  diameter={32}
                  address={item?.id}
                  loading={loading}
                  borderSize='1px'
                  borderColor='var(--gray-7)'
                  selected={false}
                />
                <TextCollectionList>
                  <Text>{item?.name}</Text>
                </TextCollectionList>
              </CollectionListContainer>
            )
          })}
        {loading && <Spin indicator={antIcon} />}
        {hasMore && !loading && (
          <div>
            <LoadMoreContent>
              <Button block size='small' onClick={handleFetchMore}>
                Load More
              </Button>
            </LoadMoreContent>
          </div>
        )}
      </Content>
    </Modal>
  )
}

const {
  Content,
  ModalTitle,
  CollectionListContainer,
  TextCollectionList,
  TextCollectionListSelected,
  CollectionButtonContainer,
  LoadMoreContent
} = {
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
    color: black;
  `,
  TextCollectionListSelected: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: var(--gray-7);
  `,
  CollectionButtonContainer: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  `,
  LoadMoreContent: styled.div`
    text-align: center;
  `
}
