import Link from 'next/link';

const Header = () => (
  <header>
    <Link href="/">
      <p>@pataruco</p>
    </Link>
    <nav>
      <ul>
        <li>
          <Link href="/blog">blog</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
