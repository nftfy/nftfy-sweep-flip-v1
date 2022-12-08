import { GetServerSideProps } from 'next'
import Layout from 'components/Layout'
import type { InferGetStaticPropsType, NextPage } from 'next'
import { networkIdByName } from '../../../lib/networkService'
import FormCard from '@components/FormCard'
import Content from '@components/Content'
import { CheckoutModal } from '@components/CheckoutModal'

type Props = InferGetStaticPropsType<typeof getServerSideProps>

const Home: NextPage<Props> = ({ chainId }) => (
  <Layout chainId={chainId}>
    {/* <Content>
      <FormCard chainId={chainId} />
    </Content> */}
    <CheckoutModal/>
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
