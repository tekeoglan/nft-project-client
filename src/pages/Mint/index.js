import {useEffect, useRef} from "react"
import styles from "./styles.module.scss"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { ethers } from "ethers"
import {useStateValue} from "../../contexts/StateProvider"
import Addresses from "../../constants/Adresses.json"
import nftProjectAbi from "../../constants/abi/NftProject.json"


export default function Mint() {
  const provider = useRef(null)
  const contract = useRef(null)
  const initialized = useRef(null)
  const [state, dispatch] = useStateValue()

  const NFT_PROJECT_ADDRESS = Addresses["31337"].NftProject

  const mintHandler = async () => {
    console.log("mint")
    if(!initialized.current || !state.userLogedIn) return

    try {
      await contract.current.mint({value: ethers.utils.parseEther("0.01")})
    } catch(err) {
      window.alert(err)
    }
  }

  const userChangingHandler = async () => {
    if(!initialized.current || !state.userLogedIn) return

    const signer = await provider.current.getSigner()
    contract.current = contract.current.connect(signer)
  }

  const init = () => {
    if(!window.ethereum) return
    provider.current = new  ethers.providers.Web3Provider(window.ethereum)
    contract.current = new ethers.Contract(NFT_PROJECT_ADDRESS, nftProjectAbi, provider.current)
    initialized.current = true
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    userChangingHandler()
  }, [state.userAddress, state.userLogedIn, initialized.current])

  return (
    <div>
      <Header />
      <div className={styles.main}>
        <div className={styles.container}>
          <button className={styles.button} onClick={mintHandler}>
            Mint
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}


