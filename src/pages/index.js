import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nft Project</title>
        <meta name="description" content="Simple Nft Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h2>WhiteList</h2>
          <Link href="/WhiteList">
            <a>Click Here</a>
          </Link>
        </div>
        <div className={styles.card}>
          <h2>Presale</h2>
          <Link href="/Presale">
            <a>Click Here</a>
          </Link>
        </div>
        <div className={styles.card}>
          <h2>Mint</h2>
          <Link href="/Mint">
            <a>Click Here</a>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
