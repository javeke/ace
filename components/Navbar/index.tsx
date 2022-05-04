import styles from './navbar.module.css';

const Navbar = ()=>{ 
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <a href="/">
          <span className={styles.brandName}>Ace</span>
        </a>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navigation}>
          <li className={styles.navigation_item}><a className={styles.navigation_item__link} href="/dashboard">Dashboard</a></li>
          <li className={styles.navigation_item}><a className={styles.navigation_item__link} href="#">Projects</a></li>
          <li className={styles.navigation_item}><a className={styles.navigation_item__link} href="#">Contact</a></li>
          <li className={styles.navigation_item}><a className={styles.navigation_item__link} href="#">About Us</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar;