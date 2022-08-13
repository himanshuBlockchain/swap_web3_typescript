import React, { useRef, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiArrowNarrowDown } from "react-icons/hi";
import coin from "../../assets/walletImg/coinbase.webp";
import port from "../../assets/walletImg/portis.webp";
import Button from "../../component/UI/Button";
import { useClickOutside } from "../../hooks/useClickOutside";
import Modal from "../../component/UI/Modal";
import { erc20Abi, swapContractDetails } from "../../data";
import { useEffect } from "react";

// ------------------------------------ My imports ----------------------------------------
import Web3 from 'web3';
import { parseUnits, formatUnits } from '@ethersproject/units';
import { BigNumber } from 'bignumber.js';
import { optimalRoutePath } from "../../app/multihop/multihopScript";
import LoadingSpinner from "../../component/UI/Loader";
import { GLOBAL_VARIABLES } from "../../config";



const Home = () => {
  const tokenList =GLOBAL_VARIABLES.token_List;
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",tokenList,GLOBAL_VARIABLES)
  const [searchVal, setSearchVal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // wallet connect modal
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setOpenModal(false));

  // token connect modal
  const [openTokenModal, setTokenOpenModal] = useState(false);
  const tokenModalRef = useRef(null);
  useClickOutside(tokenModalRef, () => setTokenOpenModal(false));

  // swap modal
  const [openSwapModal, setOpenSwapModal] = useState(false);
  const swapModalRef = useRef(null);
  useClickOutside(swapModalRef, () => setOpenSwapModal(false));

  // setting popuu
  const [openSetting, setOpenSetting] = useState(false);
  const settingRef = useRef(null);
  useClickOutside(settingRef, () => setOpenSetting(false));

  // modal detect
  const [modalDetect, setModalDetect] = useState("");

  // -------------------------------- My states and constants -------------------------------------
  const web3 = new Web3(GLOBAL_VARIABLES.JSON_RPC);

  const ACTION_IN = 'IN';
  const ACTION_OUT = 'OUT';
  const ZERO_AMOUNT = '0';
  const EMPTY_AMOUNT = '';
  const BUTTON_DISABLE = true;
  const BUTTON_ENABLE = false;
  const SWAP = "Swap";
  const INSUFFICIENT_BALANCE = "Insufficient balance";
  const TOKEN_PAIR_NOT_EXISTS = "Token pair not exists";
  const PRICE_IMPACT_HIGH = "Price impact too high";
  const ENTER_AN_AMOUNT = "Enter an amount";
  const CONFIRM = "CONFIRM";
  const ETH_ADDRESS = '0xeth';
  const ETHER_ADDRESS = GLOBAL_VARIABLES.WMATIC_ADDRESS;
  const SLIPPAGE_DEDUCTED_PERCENT = '0.995';
  const ETH_DECIMALS = '18';


  const [inputPercentage, setInputPercentage] = useState(0);
  const [tokenIn, setTokenIn] = useState({ symbol: '' });
  const [tokenOut, setTokenOut] = useState({ symbol: '' });
  const [instanceOfSwapContract, setInstanceOfSwapContract] = useState({});
  const [instanceOfInputTokenContract, setInstanceOfInputTokenContract] =
    useState({});
  const [inputTokenBalance, setInputTokenBalance] = useState(ZERO_AMOUNT);
  const [inputAmountToSwap, setInputAmountToSwap] = useState(EMPTY_AMOUNT);
  const [outputAmountToSwap, setOutputAmountToSwap] = useState(EMPTY_AMOUNT);
  const [transactionFees, setTransactionFees] = useState(ZERO_AMOUNT);
  const [transactionFeesAmount, setTransactionFeesAmount] =
    useState(ZERO_AMOUNT);

  const [inputEquivalentOfOneOutput, setInputEquivalentOfOneOutput] =
    useState(ZERO_AMOUNT);
  const [swapAction, setSwapAction] = useState(ACTION_IN);
  const [tokenRoutesPath, setTokenRoutesPath] = useState(null);
  const [feeRoutesPath, setFeeRoutesPath] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(BUTTON_DISABLE);
  const [buttonMessage, setButtonMessage] = useState(ENTER_AN_AMOUNT);
  const [isSuccess, setIsSuccess] = useState(null);
  const [nativeToken, setNativeToken] = useState(false);
  const [loader, setLoader] = useState(false);

  const [transactionLoadingMessage, setTransactionLoadingMessage] = useState(EMPTY_AMOUNT);
  const [modelsubheaderMessage, setModelsubheaderMessage] = useState(EMPTY_AMOUNT);
  const [transactionLoader, setTransactionLoader] = useState(false);
  const transactionModalRef = useRef(null);


  // const loggedInUser = "0xEBB9603d319a8A55C05DE2dF3FaF0deb085372E6";// MUMBAI
  const loggedInUser = "0xF079F9040D099513D69F282200C80337F43F5ea3";// MATIC
  // const privateKey = "0x9c42423e2d4006205881c0b45885ac356502746190e381fa3456710412903bc6";//MUMBAI
  const privateKey = "0xe9922bda5d8d9d237d0d85d1763a6998af9f401d5d40f82899959ddc19ddfa40"; //MATC
  const approvalAmount = '9999999999999999999999999999999999999999999999999';

  const noExponents = function (num) {
    var data = String(num).split(/[eE]/);
    if (data.length === 1) return data[0];

    var z = '', sign = num < 0 ? '-' : '',
      str = data[0].replace('.', ''),
      mag = Number(data[1]) + 1;

    if (mag < 0) {
      z = sign + '0.';
      while (mag++) z += '0';
      // eslint-disable-next-line no-useless-escape
      return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
  }

  const convertToEther = (data, decimals) => {
    decimals = !!decimals ? decimals : 18
    data = noExponents(data);
    return (noExponents((formatUnits(data.toString(), decimals))))
  }

  const convertToWei = (data, decimals) => {
    decimals = !!decimals ? decimals : 18
    data = noExponents(data)
    return (noExponents(parseUnits(data.toString(), decimals)));
  }

  const contractConnection = (abi, contractAddress) => {
    try {
      return new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      throw new Error("Error in contract connection : ");
    }
  }

  const getUserBalance = async (contractInstance, decimals) => {
    try {
      let balanceInWei;
      if (contractInstance) {
        balanceInWei = await contractInstance.methods
          .balanceOf(loggedInUser)
          .call();
      } else {
        balanceInWei = await web3.eth.getBalance(loggedInUser);
      }
      return await convertToEther(balanceInWei, decimals);
    } catch (error) {
      throw new Error('Error in fetching user balance');
    }
  };

  const getTransactionFees = async instance => {
    try {
      let fees = await instance.methods.gieAppFees().call();
      let feesDecimals = await instance.methods.gieAppFeesDecimals().call();
      return (Number(fees) / Number(feesDecimals)).toString();
    } catch (error) {
      throw new Error("Error in fetching transaction fees");
    }
  };

  const calculateTransactionAmount = async (inputAmount, tokenPath, decimals) => {
    try {
      let fees;
      const amount = convertToWei(inputAmount, decimals);
      let result = await instanceOfSwapContract.methods
        .calculateFeesForTransaction(amount)
        .call();
      if (tokenPath.length === 0) {
        return convertToEther(result, decimals);
      } else {
        fees = await instanceOfSwapContract.methods
          .getAmountsOut(result, tokenPath)
          .call();
      }
      return convertToEther(fees[fees.length - 1], ETH_DECIMALS);
    } catch (error) {
      throw new Error("Error in calculate transaction amount : ", error);
    }
  };

  const initializeStates = () => {
    setInputAmountToSwap(EMPTY_AMOUNT);
    setOutputAmountToSwap(EMPTY_AMOUNT);
    setButtonMessage(ENTER_AN_AMOUNT);
    setButtonStatus(BUTTON_DISABLE);
    setInputEquivalentOfOneOutput(ZERO_AMOUNT);
    setTransactionFeesAmount(ZERO_AMOUNT);
  }

  const calculatePercentValue = (percentage) => {
    try {
      if (!!parseFloat(inputTokenBalance)) {
        const balanceInWei = convertToWei(inputTokenBalance, tokenIn.decimals);
        const result = (parseFloat(balanceInWei.toString()) * (parseFloat(percentage.toString())))
          / (parseFloat('100'));
        return convertToEther(result, tokenIn.decimals);
      } else {
        return ZERO_AMOUNT;
      }
    } catch (error) {
      throw new Error("Error in calculating percent value");
    }
  }

  const checkTokenPairExists = async (
    inputToken,
    outputToken,
    inputAmount,
    indicator,
  ) => {
    try {
      if (inputToken === ETH_ADDRESS) {
        inputToken = ETHER_ADDRESS;
      } else if (outputToken === ETH_ADDRESS) {
        outputToken = ETHER_ADDRESS;
      }

      // if both address are ether address 
      if (inputToken === ETHER_ADDRESS && outputToken === ETHER_ADDRESS) {
        return {
          path: [],
          amounts: [],
          pathPairs: undefined,
          symbols: [],
          priceImpact: 0,
          trade_status: 0
        }
      } else {
        return await optimalRoutePath(
          inputToken,
          outputToken,
          inputAmount,
          indicator,
        );
      }
    } catch (error) {
      throw new Error('Error in multi hop path');
    }
  };

  const checkBothPairs = async (inputAmount, inputToken, outputToken, indicator) => {
    try {
      let feesPairResult;
      const tokenPairResult = await checkTokenPairExists(inputToken, outputToken, inputAmount, indicator);
      if (outputToken === ETHER_ADDRESS || outputToken === ETH_ADDRESS) {
        feesPairResult = tokenPairResult;
      } else {
        feesPairResult = await checkTokenPairExists(inputToken, ETHER_ADDRESS, inputAmount, true);
      }
      return {
        firstPair: tokenPairResult,
        secondPair: feesPairResult,
        status: tokenPairResult.trade_status === 0 && feesPairResult.trade_status === 0 ? 0 : 1
      };
    } catch (error) {
      throw new Error('Error in checking both pair path');
    }
  }

  const updateStatesForChangeInInputField = (output, message, status) => {
    if (output != null) {
      setOutputAmountToSwap(output);
    }
    setButtonMessage(message);
    setButtonStatus(status);
  }

  const calculateEquivalentAmount = async (amount, actionOfSwap, tokensPath) => {
    try {
      let result;
      if (actionOfSwap === ACTION_IN) {
        result = await instanceOfSwapContract.methods
          .getAmountsOut(amount, tokensPath)
          .call();
      } else {
        result = await instanceOfSwapContract.methods
          .getAmountsIn(amount, tokensPath)
          .call();
      }
      if (result[result.length - 1] === ZERO_AMOUNT) {
        return ZERO_AMOUNT;
      }
      let test = new BigNumber(result[0])
        .dividedBy(new BigNumber(result[result.length - 1]))
        .toFixed()
        .toString();
      return test;
    } catch (error) {
      throw new Error(error);
    }
  }

  const updateStatesForChangeInOutputField = (input, message, status) => {
    if (input != null) {
      setInputAmountToSwap(input);
    }
    setButtonMessage(message);
    setButtonStatus(status);
  }

  const createDeadline = () => {
    return Math.floor(new Date().getTime() / 1000.0) + 1800;
  };

  const checkAllowance = async (tokenContractInstance) => {
    try {
      let inputInWei = convertToWei(inputAmountToSwap, tokenIn.decimals);
      let allowance = await tokenContractInstance.methods
        .allowance(loggedInUser, swapContractDetails.contractAddress)
        .call();
      return parseFloat(allowance) >= parseFloat(inputInWei) ? true : false;
    } catch (error) {
      throw new Error("Error in checkAllowance : ", error);
    }
  };

  const approveToSwapContract = async () => {
    try {
      const amountHex = web3.utils.toHex(approvalAmount);

      const gasLimit = await instanceOfInputTokenContract.methods
        .approve(swapContractDetails.contractAddress, approvalAmount)
        .estimateGas({ from: loggedInUser });

      const encodedData = instanceOfInputTokenContract.methods
        .approve(swapContractDetails.contractAddress, amountHex)
        .encodeABI();

      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee = parseFloat(gasPrice) * parseFloat(gasLimit);
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      const result = transactionFee <= parseFloat(balanceInWei) ? true : false;

      if (result) {
        const tx = {
          gas: web3.utils.toHex(gasLimit),
          to: tokenIn.contractAddress,
          value: "0x00",
          data: encodedData,
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return {
          status: true,
          message: `${tokenIn.symbol} approved successfully`,
        };
      } else {
        return { status: false, message: "Not enough ether for approval" };
      }
    } catch (error) {
      return { status: false, message: "Approval Transaction failed" };
    }
  };

  const executeTransaction = async (bufferedGasLimit, totalEthInWei, encodedData) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee = parseFloat(gasPrice) * parseFloat(bufferedGasLimit);
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      const overallEth = parseFloat(totalEthInWei) + transactionFee;
      if (overallEth <= parseFloat(balanceInWei)) {
        const tx = {
          gas: web3.utils.toHex(bufferedGasLimit),
          to: swapContractDetails.contractAddress,
          value: totalEthInWei.toString(),
          data: encodedData,
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return { status: true, message: "Swapped successfully" };
      } else {
        return { status: false, message: "Not enough matic for swapping" };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  const calculateGasLimit = (gasLimit) => {
    return Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2)
    );
  }

  const swapExactTokensForETHMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const slipageAmount = parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactTokensForETH(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactTokensForETH(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const swapTokensForExactETHMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const deadline = createDeadline();

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapTokensForExactETH(
          outputAmountInWei,
          amountInWei,
          path,
          loggedInUser,
          deadline
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapTokensForExactETH(
          outputAmountInWei,
          amountInWei,
          path,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const swapExactETHForTokensMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const slipageAmount = parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);
      const totalEth = parseFloat(inputAmountToSwap) + parseFloat(transactionFeesAmount);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(
        totalEth.toFixed(6),
        tokenIn.decimals
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactETHForTokens(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline
        )
        .estimateGas({ from: loggedInUser, value: totalEthInWei });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactETHForTokens(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const swapETHForExactTokensMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const totalEth = parseFloat(inputAmountToSwap) + parseFloat(transactionFeesAmount);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(totalEth.toFixed(6), ETH_DECIMALS);

      const gasLimit = await instanceOfSwapContract.methods
        .swapETHForExactTokens(
          amountInWei,
          outputAmountInWei,
          path,
          loggedInUser,
          deadline
        )
        .estimateGas({ from: loggedInUser, value: totalEthInWei });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapETHForExactTokens(
          amountInWei,
          outputAmountInWei,
          path,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const swapExactTokensForTokensMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const feePath = feeRoutesPath.path;

      const deadline = createDeadline();
      const slipageAmount = parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactTokensForTokens(
          amountInWei,
          slippageInWei,
          path,
          feePath,
          loggedInUser,
          deadline
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactTokensForTokens(
          amountInWei,
          slippageInWei,
          path,
          feePath,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const swapTokensForExactTokensMethod = async () => {
    try {

      const path = tokenRoutesPath.path;
      const feePath = feeRoutesPath.path;
      const deadline = createDeadline();

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapTokensForExactTokens(
          outputAmountInWei,
          amountInWei,
          path,
          feePath,
          loggedInUser,
          deadline
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapTokensForExactTokens(
          outputAmountInWei,
          amountInWei,
          path,
          feePath,
          loggedInUser,
          deadline
        )
        .encodeABI();

      return await executeTransaction(bufferedGasLimit, totalEthInWei, encodedData);

    } catch (error) {
      return { status: false, message: "Swap transaction failed" };
    }
  };

  const setSwappingCase = async () => {
    setTransactionLoader(true);
    setTransactionLoadingMessage("Transaction in process");
    try {
      if (
        (tokenIn.contractAddress === ETH_ADDRESS ||
          tokenIn.contractAddress === ETHER_ADDRESS) &&
        nativeToken
      ) {
        if (swapAction === ACTION_IN) {
          const result = await swapExactETHForTokensMethod();
          setModelsubheaderMessage(result.message);
          if (result.status) {
            setIsSuccess(true);
            setInputTokenBalance(
              await getUserBalance(
                instanceOfInputTokenContract,
                tokenIn.decimals
              )
            );
          } else {
            setIsSuccess(false);
          }
        } else {
          const result = await swapETHForExactTokensMethod();
          setModelsubheaderMessage(result.message);
          if (result.status) {
            setIsSuccess(true);
            setInputTokenBalance(
              await getUserBalance(
                instanceOfInputTokenContract,
                tokenIn.decimals
              )
            );
          } else {
            setIsSuccess(false);
          }
        }
      } else if (
        (tokenOut.contractAddress === ETH_ADDRESS ||
          tokenOut.contractAddress === ETHER_ADDRESS) &&
        !nativeToken
      ) {
        let result = await checkAllowance(instanceOfInputTokenContract);
        if (swapAction === ACTION_IN) {
          if (result) {
            const swapResult = await swapExactTokensForETHMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
              setInputTokenBalance(
                await getUserBalance(
                  instanceOfInputTokenContract,
                  tokenIn.decimals
                )
              );
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult.status) {
              const swapResult = await swapExactTokensForETHMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
                setInputTokenBalance(
                  await getUserBalance(
                    instanceOfInputTokenContract,
                    tokenIn.decimals
                  )
                );
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        } else {
          if (result) {
            const swapResult = await swapTokensForExactETHMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
              setInputTokenBalance(
                await getUserBalance(
                  instanceOfInputTokenContract,
                  tokenIn.decimals
                )
              );
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult.status) {
              const swapResult = await swapTokensForExactETHMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
                setInputTokenBalance(
                  await getUserBalance(
                    instanceOfInputTokenContract,
                    tokenIn.decimals
                  )
                );
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        }
      } else {
        let result = await checkAllowance(instanceOfInputTokenContract);
        if (swapAction === ACTION_IN) {
          if (result) {
            const swapResult = await swapExactTokensForTokensMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult) {
              setIsSuccess(true);
              setInputTokenBalance(
                await getUserBalance(
                  instanceOfInputTokenContract,
                  tokenIn.decimals
                )
              );
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult) {
              const swapResult = await swapExactTokensForTokensMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
                setInputTokenBalance(
                  await getUserBalance(
                    instanceOfInputTokenContract,
                    tokenIn.decimals
                  )
                );
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        } else {
          if (result) {
            const swapResult = await swapTokensForExactTokensMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
              setInputTokenBalance(
                await getUserBalance(
                  instanceOfInputTokenContract,
                  tokenIn.decimals
                )
              );
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult) {
              const swapResult = await swapTokensForExactTokensMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
                setInputTokenBalance(
                  await getUserBalance(
                    instanceOfInputTokenContract,
                    tokenIn.decimals
                  )
                );
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        }
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      // setTransactionLoader(false);
    }
  };

  // if percentage > 0 means % value , else normal input 
  const onChangeOfInputFieldOfInputToken = async (inputAmount, percentage) => {
    setLoader(true);
    setSwapAction(ACTION_IN);
    try {
      setInputPercentage(percentage);
      if (percentage !== 0) {
        inputAmount = calculatePercentValue(percentage);
      }
      setInputAmountToSwap(inputAmount);
      let value = !!parseFloat(inputAmount);
      if (value) {
        if (parseFloat(inputTokenBalance) >= parseFloat(inputAmount)) {
          const result = await checkBothPairs(inputAmount, tokenIn.contractAddress, tokenOut.contractAddress, true);
          if (result.status === 0) {
            if (Math.abs(result.firstPair.priceImpact) <= 15) {
              setTokenRoutesPath(result.firstPair);
              setFeeRoutesPath(result.secondPair);
              if (result.firstPair.amounts[result.firstPair.amounts.length - 1] === ZERO_AMOUNT) {
                updateStatesForChangeInInputField(null, PRICE_IMPACT_HIGH, BUTTON_DISABLE);
              } else {
                updateStatesForChangeInInputField(null, SWAP, BUTTON_ENABLE);
              }
            } else {
              updateStatesForChangeInInputField(null, PRICE_IMPACT_HIGH, BUTTON_DISABLE);
            }
            setOutputAmountToSwap(convertToEther(result.firstPair.amounts[result.firstPair.amounts.length - 1], tokenOut.decimals));
            setInputEquivalentOfOneOutput(await calculateEquivalentAmount(
              result.firstPair.amounts[0],
              ACTION_IN,
              result.firstPair.path
            ));
          } else {
            updateStatesForChangeInInputField(EMPTY_AMOUNT, TOKEN_PAIR_NOT_EXISTS, BUTTON_DISABLE);
          }
        } else {
          updateStatesForChangeInInputField(EMPTY_AMOUNT, INSUFFICIENT_BALANCE, BUTTON_DISABLE);
        }
      } else {
        updateStatesForChangeInInputField(EMPTY_AMOUNT, ENTER_AN_AMOUNT, BUTTON_DISABLE);
      }
    } catch (error) {
      // show popup with error message
    } finally {
      setLoader(false);
    }
  }

  const onChangeOfInputFieldOfOutputToken = async (outputAmount) => {
    setLoader(true);
    setSwapAction(ACTION_OUT);
    try {
      setInputPercentage(0);
      setOutputAmountToSwap(outputAmount);
      let value = !!parseFloat(outputAmount);
      if (value) {
        const result = await checkBothPairs(outputAmount, tokenIn.contractAddress, tokenOut.contractAddress, false);
        if (result.status === 0) {
          if (Math.abs(result.firstPair.priceImpact) <= 15) {
            if (parseFloat(inputTokenBalance) >= parseFloat(convertToEther(result.firstPair.amounts[0], tokenIn.decimals))) {
              setTokenRoutesPath(result.firstPair);
              setFeeRoutesPath(result.secondPair);
              updateStatesForChangeInOutputField(null, SWAP, BUTTON_ENABLE);
            } else {
              updateStatesForChangeInOutputField(null, INSUFFICIENT_BALANCE, BUTTON_DISABLE);
            }
          } else {
            updateStatesForChangeInOutputField(null, PRICE_IMPACT_HIGH, BUTTON_DISABLE);
          }
          setInputAmountToSwap(convertToEther(result.firstPair.amounts[0], tokenIn.decimals));
          setInputEquivalentOfOneOutput(await calculateEquivalentAmount(
            result.firstPair.amounts[result.firstPair.amounts.length - 1],
            ACTION_OUT,
            result.firstPair.path
          ));
        } else {
          updateStatesForChangeInOutputField(EMPTY_AMOUNT, TOKEN_PAIR_NOT_EXISTS, BUTTON_DISABLE);
        }
      } else {
        updateStatesForChangeInOutputField(EMPTY_AMOUNT, ENTER_AN_AMOUNT, BUTTON_DISABLE);
      }
    } catch (error) {
      // show error message in popup
    } finally {
      setLoader(false);
    }
  }

  // if its not null then select input amount else its interchange
  const onSelectOfInputToken = async (inputToken) => {
    try {
      setLoader(true);
      if (!inputToken) {
        let outputToken = tokenIn;
        inputToken = tokenOut;
        setTokenOut(outputToken);
      }
      setTokenIn(inputToken);
      let tokenInstance = inputToken.contractAddress === ETH_ADDRESS ? null : await contractConnection(erc20Abi, inputToken.contractAddress);
      setInstanceOfInputTokenContract(tokenInstance);
      setInputTokenBalance(await getUserBalance(tokenInstance));
      setNativeToken(inputToken.contractAddress === ETH_ADDRESS ? true : false);
      initializeStates();
    } catch (error) {
      // Show popup message with error
    } finally {
      setLoader(false);
    }
  }

  const onSelectOfOutputToken = (outputToken) => {
    setLoader(true);
    setTokenOut(outputToken);
    initializeStates();
    setLoader(false);
  }

  const onClickOfSwapButton = async () => {
    try {
      setLoader(true);
      if (buttonMessage === CONFIRM) {
        await setSwappingCase();
      } else {
        setTransactionFeesAmount(await calculateTransactionAmount(inputAmountToSwap, feeRoutesPath.path, tokenIn.decimals));
        setButtonMessage(CONFIRM);
      }
    } catch (error) {
      console.log("Error : ", error);
      // show popup with error message
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    try {
      setLoader(true);
      const initializeStatesOfSwap = async () => {
        // set loggedIn user here in Prajyot's code
        const inputToken = tokenList[0];
        setSwapAction(ACTION_IN);
        setTokenIn(inputToken);
        setTokenOut(tokenList[1]);
        const tokenInInstance = inputToken.contractAddress === ETH_ADDRESS ? null : await contractConnection(erc20Abi, inputToken.contractAddress);
        setInstanceOfInputTokenContract(tokenInInstance);
        setInputTokenBalance(await getUserBalance(tokenInInstance, inputToken.decimals));
        const swapInstance = await contractConnection(swapContractDetails.abi, swapContractDetails.contractAddress);
        setInstanceOfSwapContract(swapInstance);
        setTransactionFees(await getTransactionFees(swapInstance));
      };
      initializeStatesOfSwap();
    } catch (error) {
      // show error pop up : data loading failed
    } finally {
      setLoader(false);
    }
  }, []);

  return (
    <>
      <div className="home_page_container">
        <div className="container">
          <div className="home_container">
            <div className="home_form">
              <form onSubmit={handleSubmit}>
                <div className="swap_box_top">
                  <div className="swap_box">
                    <div
                      className="select_token"
                      onClick={() => {
                        setTokenOpenModal(!openTokenModal);
                        setModalDetect("from");
                      }}
                    >
                      <img src={tokenIn?.icon || coin} alt="logo" />
                      <span className="token_name">
                        {tokenIn?.name}
                      </span>
                      <MdOutlineKeyboardArrowDown />
                    </div>
                    <div className="percentage_btn">
                      <Button
                        onClick={() => onChangeOfInputFieldOfInputToken(inputAmountToSwap, 25)}
                        type="button"
                      >
                        25%
                      </Button>
                      <Button
                        onClick={() => onChangeOfInputFieldOfInputToken(inputAmountToSwap, 50)}
                        type="button"
                      >
                        50%
                      </Button>
                      <Button
                        onClick={() => onChangeOfInputFieldOfInputToken(inputAmountToSwap, 75)}
                        type="button"
                      >
                        75%
                      </Button>
                      <Button
                        onClick={() => onChangeOfInputFieldOfInputToken(inputAmountToSwap, 100)}
                        type="button"
                      >
                        100%
                      </Button>
                    </div>
                    <div className="token_balance">
                      <div className="value">
                        <input type="text" placeholder="0.00"
                          style={{ width: "6rem" }}
                          value={inputAmountToSwap ? inputAmountToSwap : EMPTY_AMOUNT}
                          onChange={(e) => {
                            setInputAmountToSwap(e.target.value);
                            onChangeOfInputFieldOfInputToken(e.target.value, 0);
                          }} />
                      </div>
                      <span>Balance: {parseFloat(inputTokenBalance).toFixed(5)}</span>
                    </div>
                  </div>
                  <span className="down_arrow">
                    <HiArrowNarrowDown
                      onClick={async () => {
                        await onSelectOfInputToken(null);
                      }}
                    />
                  </span>
                </div>
                <div className="swap_box_top">
                  <div className="swap_box">
                    <div
                      className="select_token"
                      onClick={() => {
                        setTokenOpenModal(!openModal);
                        setModalDetect("to");
                      }}
                    >
                      <img src={tokenIn?.icon || port} alt="logo" />
                      <span className="token_name">
                        {tokenOut?.name}
                      </span>
                      <MdOutlineKeyboardArrowDown />
                    </div>
                    <div className="token_balance">
                      <div className="value">
                        <input type="text" placeholder="0.00"
                          style={{ width: "70%" }}
                          value={outputAmountToSwap ? outputAmountToSwap : EMPTY_AMOUNT}
                          onChange={(e) => {
                            setOutputAmountToSwap(e.target.value);
                            onChangeOfInputFieldOfOutputToken(e.target.value);
                          }} />
                      </div>
                    </div>
                  </div>
                </div>
                {buttonMessage !== CONFIRM ? (
                  <div className="compare_value">
                    <p>
                      1 {tokenOut.symbol} = {parseFloat(inputEquivalentOfOneOutput).toFixed(5)} {tokenIn.symbol}
                    </p>
                  </div>
                ) : buttonMessage === CONFIRM ? (
                  <div>
                    <div className="compare_value">
                      <p>
                        Transaction Fees : {transactionFees} %
                      </p>
                    </div>
                    <div className="compare_value">
                      <p>
                        Rate : ~ {parseFloat(transactionFeesAmount).toFixed(8)} MATIC
                      </p>
                    </div>
                  </div>
                ) : ""}
                <div className="connect_btn">
                  <Button
                    disabled
                    onClick={() => onClickOfSwapButton()}
                    type="button"
                  >
                    {loader ? (<LoadingSpinner />) : buttonMessage}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal openModal={openTokenModal} modalRef={tokenModalRef}>
        <div className="title">
          <h2>Select a token</h2>
          <span onClick={() => setTokenOpenModal(false)}>&times;</span>
        </div>
        <div className="search_bar">
          <input
            type="text"
            name="search"
            placeholder="Search name or paste address"
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
        <div className="token_img">
          {tokenList
            .filter((val) => {
              if (searchVal === "") {
                return val;
              } else if (
                val.name.toLowerCase().includes(searchVal.toLowerCase())
              ) {
                return val;
              }
            })
            .map((d) => (
              <div
                className="img_box"
                key={d.id}
                onClick={async () => {
                  if (modalDetect === "from") {
                    await onSelectOfInputToken(d);
                  } else if (modalDetect === "to") {
                    onSelectOfOutputToken(d);
                  }
                  setTokenOpenModal(false);
                }}
              >
                <img src={d.icon} alt="icon" />
                <div className="label">
                  <p>{d.title}</p>
                  <h3>{d.name}</h3>
                </div>
              </div>
            ))}
        </div>
      </Modal>
      <Modal openModal={transactionLoader} modalRef={transactionModalRef}>
        <div>
          <div style={{ display: "flex", justifyContent: "center", color: "white" }}>
            <h2 style={{}}>Swap Transaction Status</h2>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "center", color: "white" }}>
            {loader ? (<LoadingSpinner />) : modelsubheaderMessage}
          </div>
          <div style={{ display: "flex", justifyContent: "center", color: "white" }}>
            {!loader ? (
              <div className="connect_btn">
                <Button
                  onClick={() => { setTransactionLoader(false) }}
                  type="button"
                >
                  Close
                </Button>
              </div>
            ) : ""}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
