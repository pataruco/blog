'use client';
import Link from 'next/link';
import BrandLogo from './logo';

const Header = () => {
  return (
    <header>
      <div className="header">
        <Link href="/" title="Pedro Martin Valera" className="branding">
          <BrandLogo />
        </Link>
      </div>
      <nav className="navigation">
        <ul className="navigation-menu mask-links">
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
