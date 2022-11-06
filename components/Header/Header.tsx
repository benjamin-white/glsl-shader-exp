import Link from 'next/link'
import styles from './Header.module.css'

const pages = [
  {
    title: 'Home',
    slug: '/',
  },
  {
    title: 'Domain Warping',
    slug: 'domain-warping',
  },
  {
    title: 'Sine Clouds',
    slug: 'sine-clouds',
  },
  {
    title: 'Sphere Noise',
    slug: 'sphere-noise',
  },
  {
    title: 'Planet',
    slug: 'planet',
  },
  {
    title: 'Quaternion Julia Fractals',
    slug: 'quaternion-julia-fractals',
  }
]

const Header = () =>
  <header className={styles.header}>
    <ul className={styles.nav}>
      {pages.map(({ title, slug }) =>
        <li key={slug}><Link href={slug}>{title}</Link></li>
      )}
    </ul>
  </header>

export default Header