import { gql, useQuery, NetworkStatus } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const UNISWAP_QUERY = gql`
  query {
    tokens(
      orderBy: txCount
      orderDirection: desc
      first: 9
      where: { txCount_gt: 3000 }
    ) {
      id
      symbol
      name
      txCount
      tradeVolumeUSD
    }
  }
`;

export const uniswapQueryVars = {
  first: 10,
};

export default function UniswapList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    UNISWAP_QUERY,
    {
      variables: uniswapQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
      context: { clientName: "uniswap" },
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: tokens.length,
      },
    });
  };

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

  const { tokens } = data;
  let keys = [];

  tokens.map((t, i) => keys.push(parseInt(t.tradeVolume)));
  console.log(keys);
  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <h1 style={{ marginTop: "1rem" }}>Top Swapped Tokens (TxCount)</h1>
        <BarChart
          instanceId="uniswapChart"
          width={900}
          height={600}
          data={tokens}
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip />

          <Bar dataKey="txCount" fill="#7865cb" fillOpacity="1" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 2400000]} dataKey="txCount" />
        </BarChart>
      </div>
    </>
  );
}