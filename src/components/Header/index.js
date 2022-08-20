import styles from "./styles.module.scss";
import Link from "next/link";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { truncateStr } from "../../utils";
import {useStateValue} from "../../contexts/StateProvider";
import {actionTypes, initialState} from "../../contexts/reducer";

export default function Header() {
  const [provider, setProvider] = useState(null);

  const [state, dispatch] = useStateValue()

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      await provider.send("eth_requestAccounts", []);
    } else {
      console.log("install the metamask");
    }
  };

  const init = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);

    const signer = web3Provider.getSigner();

    const id = await web3Provider.getNetwork()
    dispatch({
      type: actionTypes.SET_CHAIN_ID,
      chainId: id
    })

    signer.getAddress()
      .then(address => {

        dispatch({
          type: actionTypes.SET_USER_ADDRESS,
          userAddress: address
        })

        dispatch({
          type: actionTypes.SET_USER_LOGED_IN,
          userLogedIn: true
        })

      })
      .catch(e => {
        console.log("user not loged in")
        dispatch({
          type: actionTypes.SET_USER_ADDRESS,
          userAddress: initialState.userAddress
        })

        dispatch({
          type: actionTypes.SET_USER_LOGED_IN,
          userLogedIn: initialState.userLogedIn
          })
      });
  }


  useEffect(() => {
    if(!window.ethereum && !window.ethereum.isConnected()) return
    const ethereum = window.ethereum

    init()

    ethereum.on('accountsChanged', (accounts) => {
      console.log('account changed:', accounts)
      if(accounts.length > 0 && state.userAddress !== accounts[0]) {
        dispatch({
          type: actionTypes.SET_USER_ADDRESS,
          userAddress: accounts[0]
        })

        dispatch({
          type: actionTypes.SET_USER_LOGED_IN,
          userLogedIn: true
        })
      } else if(accounts.length === 0) {
        dispatch({
          type: actionTypes.SET_USER_ADDRESS,
          userAddress: initialState.userAddress
        })

        dispatch({
          type: actionTypes.SET_USER_LOGED_IN,
          userLogedIn: initialState.userLogedIn
        })
      }
    })

    ethereum.on('chainChanged', (id) => {
      const newId = parseInt(id)
      if(state.chainId === newId) return
      dispatch({
        type: actionTypes.SET_CHAIN_ID,
        chainId: newId
      })
    })

    ethereum.on('disconnect', (err) => {
        dispatch({
          type: actionTypes.SET_USER_ADDRESS,
          userAddress: initialState.userAddress
        })

        dispatch({
          type: actionTypes.SET_USER_LOGED_IN,
          userLogedIn: initialState.userLogedIn
        })
      console.log(err)
    })

    return () => {
      ethereum.removeAllListeners()
    }
  }, []);


  // 1. check if user connected
  // 2. if account changed
  // 3. if chain id changed

  return (
    <div className={styles.header}>
      <Link href="/">
        <a>NFT PROJECT</a>
      </Link>
      <button
        className={styles.button}
        onClick={!state.userLogedIn ? connectWalletHandler : null}
      >
        {state.userLogedIn ? `${truncateStr(state.userAddress || "", 15)}` : "Connect"}
      </button>
    </div>
  );
}
