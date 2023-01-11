import { GetServerSideProps } from 'next'
import Layout from 'components/Layout'
import type { InferGetStaticPropsType, NextPage } from 'next'
import FormCard from '@components/FormCard'
import Content from '@components/Content'
import { networkIdByName } from '../../../lib/networkService'

type Props = InferGetStaticPropsType<typeof getServerSideProps>

// eslint-disable-next-line react/function-component-definition
const Home: NextPage<Props> = ({ chainId }) => (
  <Layout chainId={chainId}>
    <Content>
      <FormCard chainId={chainId} />
    </Content>
  </Layout>
)

export default Home

export const getServerSideProps: GetServerSideProps = async ctx => {
  const network = String(ctx?.query?.network)
  const chainId = Number(networkIdByName(network))

  if (!chainId) {
    return Promise.resolve({
      notFound: true
    })
  }

  return Promise.resolve({
    props: {
      chainId,
      network
    }
  })
}
