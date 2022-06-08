import styles from './Navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Navbar = ()=>{ 

  const router = useRouter();

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <Link href="/">
            <a><span className={styles.brandName}>Ace</span></a>
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navigation}>
            <li className={styles.navigation_item}><Link href="/dashboard"><a className={router.pathname === "/dashboard" ? styles.active : ""}>Dashboard</a></Link></li>
            <li className={styles.navigation_item}><Link href="#"><a className={router.pathname === "/projects" ? styles.active : ""}>Projects</a></Link></li>
            <li className={styles.navigation_item}><Link href="#"><a className={router.pathname === "/contact" ? styles.active : ""}>Contact</a></Link></li>
            <li className={styles.navigation_item}><Link href="#"><a className={router.pathname === "/about-us" ? styles.active : ""}>About Us</a></Link></li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Navbar;