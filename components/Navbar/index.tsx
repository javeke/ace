import styles from '../../styles/Navbar.module.css';
import Link from 'next/link';

const Navbar = ()=>{ 
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <Link href="/">
          <a><span className={styles.brandName}>Ace</span></a>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navigation}>
          <li className={styles.navigation_item}><Link href="/dashboard"><a>Dashboard</a></Link></li>
          <li className={styles.navigation_item}><Link href="#"><a>Projects</a></Link></li>
          <li className={styles.navigation_item}><Link href="#"><a>Contact</a></Link></li>
          <li className={styles.navigation_item}><Link href="#"><a>About Us</a></Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar;