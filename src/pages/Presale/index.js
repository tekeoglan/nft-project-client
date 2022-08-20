import styles from "./styles.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {useEffect, useRef, useState} from "react";
import {ethers} from "ethers"
import nftProjectAbi from "../../constants/abi/NftProject.json"
import Addresses from "../../constants/Adresses.json"
import {useStateValue} from "../../contexts/StateProvider";
import {getPresaleTimer} from "../../utils"

export default function Presale() {
  const [presaleStarted, setPresaleStarted] = useState(false)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const provider = useRef(null)
  const contract = useRef(null)
  const initialized = useRef(false)

  const [state, dispatch] = useStateValue()

  const NFT_PROJECT_ADDRESS = Addresses["31337"].NftProject

  const startPresaleHandler = async () => {
    if(!state.userLogedIn) {
      window.alert("Please connect the metamask")
      return
    }

    if(!initialized.current) {
      window.alert("Wait for the initializing of site")
      return
    }

    try {
      await contract.current.startPresale()
    } catch(err) {
      window.alert(err.reason)
    }
  }

  const startCountDown = (timestamp) => {
    let leftTime = getPresaleTimer(timestamp)
    console.log("letftime:", leftTime)

    if( leftTime === 0 ) return 0

    const intervalId = setInterval(() => {
      let minutes = Math.floor(leftTime/60)
      let seconds = leftTime%60
      setMinutes(minutes)
      setSeconds(seconds)
      leftTime--
      if(leftTime < 0) {
        clearInterval(intervalId)
      }
    }, 1000)

    return intervalId
  }

  const getBlockTimestamp = async () => {
    let interval, listener

    if(presaleStarted) {
      const log = await contract.current.queryFilter("PresaleStarted")
      if(log.length > 0) {
        console.log("query log:", log)
        const blockNumber = log[0].blockNumber
        const block = await provider.current.getBlock(blockNumber)
        console.log("block:", block)
        const stamp = block.timestamp
        interval = startCountDown(stamp)
      }
    } else {
      listener = contract.current.once("PresaleStarted", (timestamp) => {
        console.log("presale started:", timestamp)
        interval = startCountDown(parseInt(timestamp._hex))
        setPresaleStarted(true)
      })
    }

    return {interval, listener}
  }


  const premintHandler = async () => {
    if(!state.userLogedIn) {
      window.alert("Please connect the metamask")
      return
    }

    try {
      await contract.current.presaleMint({ value: ethers.utils.parseEther("0.01")})
    } catch(err) {
      window.alert(err.reason)
    }
  }

  const userChangingHandler = async () => {
    if(!initialized.current || !state.userLogedIn) return

    const signer = await provider.current.getSigner()
    contract.current = await contract.current.connect(signer)
  }

  const init = async () => {
    if(!window.ethereum) return
    provider.current = new ethers.providers.Web3Provider(window.ethereum)

    contract.current = new ethers.Contract(NFT_PROJECT_ADDRESS, nftProjectAbi, provider.current)
    const started = contract.current.presaleStarted()
    setPresaleStarted(started)

    initialized.current = true
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    userChangingHandler()
  }, [state.userAddress, state.userLogedIn, initialized.current])


  useEffect(() => {
    if(!initialized.current) return

    const {interval, listener} = getBlockTimestamp()

    return () => {
      if(listener) {
        contract.current.off("PresaleStarted", listener)
      }
      if(interval) {
        console.log("interval cleared")
        clearInterval(interval)
      }
    }
  }, [initialized.current])

  return (
    <div>
      <Header />
      <div className={styles.main}>
        <div className={styles.header}>
          <h2>Count Down</h2>
          <span>{`${minutes}:${seconds}`}</span>
        </div>
        <div className={styles.container}>
          <button className={styles.button} onClick={startPresaleHandler}>
            Start Presale
          </button>
          <button className={styles.button} onClick={premintHandler}>
            Premint
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
