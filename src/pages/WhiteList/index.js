import styles from "./styles.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Addresses from "../../constants/Adresses.json";
import WhitelistAbi from "../../constants/abi/WhiteList.json";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {useStateValue} from "../../contexts/StateProvider";

export default function WhiteList() {
  const WHITELIST_ADDRESS = Addresses["31337"].WhiteList;

  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null)
  const [leftSpots, setLeftSpots] = useState(2);
  const [maxWhiteListed, setMaxWhiteListed] = useState(2);
  const [state, dispatch] = useStateValue()

  const getWhiteListHandler = async () => {
    if (!state.userLogedIn) {
      window.alert("Please connect the metamask.")
      return;
    }

    try {
      const signer = await provider.getSigner()
      const newContract = await contract.connect(signer)
      await newContract.addToWhiteList();
    } catch (err) {
      window.alert(err.reason)
    }
  };

  const init = async () => {
    if (!window.ethereum) {
      window.alert("Please Download The Metamask")
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider)

    const whitelist = new ethers.Contract(
      WHITELIST_ADDRESS,
      WhitelistAbi,
      web3Provider
    );

    setContract(whitelist);

    const maxListed = await whitelist.getMaxWhiteList();
    const whiteListed = await whitelist.getNumOfWhiteListed();
    setMaxWhiteListed(maxListed);

    const lefts = maxListed - whiteListed
    setLeftSpots(lefts);
  };

  useEffect(() => {
    init();

  }, []);

  useEffect(() => {
    if(!contract) return

    contract.on("WhiteListed", (user, numWhiteListed) => {
      const spots = maxWhiteListed - numWhiteListed;
      setLeftSpots(spots);
    });

    return () => {
      contract.removeAllListeners();
      console.log("contract listeners removed");
    };
  }, [contract])

  // 1. add to whitelist
  // 2. whitelist counter
  return (
    <div>
      <Header />
      <div className={styles.main}>
        <div className={styles.container}>
          <h2 className={styles.header}>You Can Get Whitelist Here</h2>
          <button className={styles.button} onClick={getWhiteListHandler}>
            Get Whitelist
          </button>
        </div>
        <div className={styles.container}>
          <h2 className={styles.header}>Left Spots</h2>
          <span>{leftSpots}</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
