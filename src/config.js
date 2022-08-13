
import bitcoin from "./assets/tokenImg/bitcoin.webp"
import inch from "./assets/tokenImg/1inch.webp"
import ave from "./assets/tokenImg/aave.webp"
import agur from "./assets/tokenImg/ageur.webp"
import argo from "./assets/tokenImg/aergo.webp"
import agld from "./assets/tokenImg/agld.webp"

let network = "matic";
let GET_GLOBAL_VARIABLES = "";

const tokenList_Mumbai = [
  {
    id: "s7e8se8r8",
    title: "Dai",
    name: "DAI",
    icon: bitcoin,
    symbol: "DAI",
    contractAddress: "0xcB1e72786A6eb3b44C2a2429e317c8a2462CFeb1",
    decimals: "18",
  },
  {
    id: "s7ef8se8r",
    title: "Sand",
    name: "Sand",
    icon: inch,
    symbol: "SAND",
    contractAddress: "0xE03489D4E90b22c59c5e23d45DFd59Fc0dB8a025",
    decimals: "18",
  },
  {
    id: "7ser8ers",
    title: "Usdc",
    name: "USDC",
    icon: ave,
    symbol: "USDC",
    contractAddress: "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
    decimals: "6",
  },
  {
    id: "ser88wer",
    title: "Usdt",
    name: "USDT",
    icon: argo,
    symbol: "USDT",
    contractAddress: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
    decimals: "6",
  },
  {
    id: "fse7r7s8er",
    title: "Wmatic",
    name: "WMATIC",
    icon: agur,
    symbol: "WMATIC",
    contractAddress: "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
    decimals: "18",
  },
  {
    id: "s7e7r8e",
    title: "Matic",
    name: "MATIC",
    icon: agld,
    symbol: "MATIC",
    contractAddress: "0xeth",
    decimals: "18",
  },
];
const tokenList_Matic = [
  {
    id: "s7e8se8r8",
    title: "Dai",
    name: "DAI",
    icon: bitcoin,
    symbol: "DAI",
    contractAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    decimals: "18",
  },
  {
    id: "s7ef8se8r",
    title: "Sand",
    name: "Sand",
    icon: inch,
    symbol: "SAND",
    contractAddress: "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
    decimals: "18",
  },
  {
    id: "7ser8ers",
    title: "Usdc",
    name: "USDC",
    icon: ave,
    symbol: "USDC",
    contractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    decimals: "6",
  },
  {
    id: "ser88wer",
    title: "Usdt",
    name: "USDT",
    icon: argo,
    symbol: "USDT",
    contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    decimals: "6",
  },
  {
    id: "fse7r7s8er",
    title: "Wmatic",
    name: "WMATIC",
    icon: agur,
    symbol: "WMATIC",
    contractAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    decimals: "18",
  },
  {
    id: "s7e7r8e",
    title: "Matic",
    name: "MATIC",
    icon: agld,
    symbol: "MATIC",
    contractAddress: "0xeth",
    decimals: "18",
  },
];

const GLOBAL_VARIABLES_POLYGON = {
  token_List: tokenList_Matic,
  NETWORK: "matic",
  EXCHANGE: "sushiswap",
  JSON_RPC:
    "https://polygon-mainnet.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80",
  SUBGRAPH_URL:
    "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange",
  ROUTER_ADDRESS: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
  FACTORY_ADDRESS: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
  MULTICALL_ADDRESS: "0xdcbff8b2fe085ea9a57384a15a2b1b7db48b8bc1",
  SWAP_ADDRESS: "0xdF56FFD9022dF77d79EBBE094FeBAC9DA9e38AF2",
  WMATIC_ADDRESS : "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
};

const GLOBAL_VARIABLES_MUMBAI= {
  token_List: tokenList_Mumbai,
  NETWORK: "mumbai",
  EXCHANGE: "sushiswap",
  JSON_RPC:
    "https://polygon-mumbai.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80",
  SUBGRAPH_URL:
    "https://api.thegraph.com/subgraphs/name/bhupesh-98/polygon-mumbai-sushiswap-exchange",
  ROUTER_ADDRESS: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
  FACTORY_ADDRESS: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
  MULTICALL_ADDRESS: "0xc3a47ff9cab108cc898ed9d7a20625e74c81e31d",
  SWAP_ADDRESS: "0x368F7421EE7eEddBf4Fa307Eb1DfB576C138df48",
  WMATIC_ADDRESS : "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
};

switch (network) {
  case "mumbai":
    GET_GLOBAL_VARIABLES = GLOBAL_VARIABLES_MUMBAI;
    break;
  case "matic":
    GET_GLOBAL_VARIABLES = GLOBAL_VARIABLES_POLYGON;
    break;
}

export const GLOBAL_VARIABLES = GET_GLOBAL_VARIABLES;
