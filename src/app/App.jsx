import React from "react";
import { Helmet } from "react-helmet";
import Routers from "../routes";
import Web3 from 'web3'
import {GLOBAL_VARIABLES} from './multihop/config'
import  {optimalRoutePath}  from './multihop/multihopScript'
import { useEffect } from "react";
const App = () => {
  const web3 =new Web3("https://mainnet.infura.io/v3/681332a2c23a4ce8ac972bfbdfa75555")
  console.log(web3)
  console.log(GLOBAL_VARIABLES)
  // console.log()

  useEffect(() => {
      const swapContractConnection = async () => {
  let x=        await optimalRoutePath(
          // CODE-------NOT WORKING
          "0xe03489d4e90b22c59c5e23d45dfd59fc0db8a025", // SAND
          "0xcb1e72786a6eb3b44c2a2429e317c8a2462cfeb1", // DAI
          "1",
          true
        );
        console.log(x);
      };
      swapContractConnection();
  }, []);
  return (
    <>
      <Helmet>
        <title>Swap | Sushi</title>
        {/* google font family */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      {/* Routers */}
      <Routers />
    </>
  );
};

export default App;
