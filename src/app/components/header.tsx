import Link from 'next/link';

const Header = () => (
  <header>
    <Link href="/">
      <h1>Pataruco</h1>
    </Link>
    <nav>
      <ul>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
