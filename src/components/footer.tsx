import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer``;

const Footer = () => (
  <StyledFooter>
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
  </StyledFooter>
);

export default Footer;
