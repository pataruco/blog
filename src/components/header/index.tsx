'use client';

import Link from 'next/link';

import BrandLogo from '../logo';
import './style.css';

import { usePathname } from 'next/navigation';
const Header = () => {
  const path = usePathname();

  return (
    <header>
      <div className="header">
        <Link href="/" title="Pedro Martin Valera" className="branding">
          <BrandLogo />
        </Link>
      </div>
      <nav className="navigation">
        <ul className="navigation-menu mask-links">
          <li className={path === '/blog' ? 'is-active' : ''}>
            <Link href="/blog">Blog</Link>
          </li>
          <li className={path === '/installfest' ? 'is-active' : ''}>
            <Link href="/installfest">Installfest</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
