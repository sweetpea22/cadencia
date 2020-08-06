import { gql, useQuery, NetworkStatus } from "@apollo/client";
import { Table, Tag } from "./antd";

export const BALANCER_QUERY = gql`
  query {
    pools(first: 10, orderBy: swapsCount, orderDirection: desc) {
      id
      totalWeight
      tokens {
        id
        name
        symbol
      }
    }
  }
`;

export const balancerQueryVars = {
  first: 10,
};

export default function BalancerList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    BALANCER_QUERY,
    {
      variables: balancerQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
      context: { clientName: "balancer" },
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: pools.length,
      },
    });
  };

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

  const { pools } = data;

  const tokens = pools.map((pool) => {
    let tokens = pool.tokens;
    tokens.map((token) => {
      return token.name;
    });
    return { pool: pool.id, tokens: pool.tokens };
  });

  const columns = [
    {
      title: "Pool Id",
      dataIndex: "pool",
      render: (pool) => (
        <p>
          {pool.substring(0, 7)}...{pool.substring(37, 42)}
        </p>
      ),
    },
    {
      title: "Holdings",
      dataIndex: "tokens",
      render: (tokens) => (
        <>
          {tokens.map((t, index) => {
            let colors = ["volcano", "geekblue", "cyan", "purple", "magenta"];
            let color = colors[index];
            if (t.symbol === "WETH") {
              color = "gold";
            }
            return (
              <Tag color={color} key={t.id}>
                {t.symbol}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "2.9rem", marginLeft: "4.5rem" }}>
      <h1>What the biggest Balancer Pools are holding</h1>

      <Table columns={columns} dataSource={tokens} pagination={false} />
    </div>
  );
}
