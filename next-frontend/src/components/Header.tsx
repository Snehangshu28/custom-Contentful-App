import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/landing/page-1">Page 1</Link>
        <Link href="/landing/page-2">Page 2</Link>
      </nav>
    </header>
  );
};

export default Header; 