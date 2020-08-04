import UniswapList, {
  UNISWAP_QUERY,
  uniswapQueryVars,
} from "../components/uniswap";
import { initializeApollo } from "../lib/apolloClient";
import BalancerList, {
  BALANCER_QUERY,
  balancerQueryVars,
} from "../components/balancer";

const IndexPage = () => (
  <div>
    <h1>Total Trade Volume</h1>
    <div style={{ display: "flex" }}>
      <UniswapList />
      <BalancerList />
    </div>
  </div>
);

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: UNISWAP_QUERY,
    variables: uniswapQueryVars,
  });

  await apolloClient.query({
    query: BALANCER_QUERY,
    variables: balancerQueryVars,
    context: {
      dataSrc: "balancer",
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default IndexPage;
