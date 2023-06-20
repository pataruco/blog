'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEvent, useState } from 'react';

import BrandLogo from '../logo';
import NavigationToggle from '../navigation-toggle';
import './style.css';

const Header = () => {
  const [navigationIsOpen, setNavigationIsOpen] = useState(false);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    setNavigationIsOpen(!navigationIsOpen);
  };

  const path = usePathname();

  return (
    <header className={navigationIsOpen ? 'has-nav' : ''}>
      <div className="header">
        <Link href="/" title="Pedro Martin Valera" className="branding">
          <BrandLogo />
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="navigation-toggle"
          onClick={handleClick}
        >
          <NavigationToggle />
        </button>
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
