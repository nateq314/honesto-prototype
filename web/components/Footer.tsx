import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const StyledFooter = styled.footer`
  grid-area: footer;
  background-color: #031323;
  height: 54px;
  color: #fff;
  padding: 0px 20px;
  text-align: center;

  .content {
    height: 54px;
    margin: 0px auto;
    width: 1180px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  svg {
    fill: #fff;
    height: 20px;
  }

  .copyright {
    font-size: 12px;
    color: #fff;
  }

  .company-name {
    font-weight: bold;
    color: #fff;
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <div className="content">
        <Logo />
        <span className="copyright">
          Copyright © 2018 <span className="company-name">Theorem</span>, LLC. All Rrights Reserved.
        </span>
      </div>
    </StyledFooter>
  );
}
