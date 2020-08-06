import { gql, useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
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

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;
  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: pools.length,
      },
    });
  };
  const { tokens } = data;

  return (
    <>
      <div style={{ marginTop: "2rem", marginLeft: "5rem" }}>
        <h1 style={{ marginTop: "1rem" }}>
          Most Swapped Tokens on Uniswap (TxCount)
        </h1>
        <BarChart
          instanceId="uniswapChart"
          width={900}
          height={600}
          data={tokens}
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip />

          <Bar dataKey="txCount" fill="#7865cb" fillOpacity="1" />
          <XAxis dataKey="symbol" position="insideBottom" />
          <Label value="token symbol" />
          <YAxis
            domain={[0, 2400000]}
            dataKey="txCount"
            label={{
              value: "# all-time swaps",
              angle: -90,
              position: "left",
              offset: 40,
            }}
          />
        </BarChart>
      </div>
    </>
  );
}
