import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header``;

const Header = () => (
  <StyledHeader>
    <h1>Pedro Martin</h1>
    <nav>
      <ul>
        <li>
          <Link to="/blog">blog</Link>
        </li>
        <li>
          <Link to="/">about</Link>
        </li>
      </ul>
    </nav>
  </StyledHeader>
);

export default Header;
