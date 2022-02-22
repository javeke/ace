import type { NextPage as Page } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: Page = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ace</title>
        <meta name="description" content="Welcome to Ace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Ace</h1>
        <p>Welcome to the Ace Project.</p>
        <strong>Coming Soon. Stay Tuned!</strong>
      </main>
    </div>
  )
}

export default Home
