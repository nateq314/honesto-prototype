import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../pages/_app';
import Logout from './Logout';

const StyledAppBar = styled.header`
  background-color: #f2f3f4;
  grid-area: appbar;

  .content {
    width: 1180px;
    margin: 0px auto;
    padding-top: 0px;
    display: flex;
    justify-content: flex-start;
  }

  .honesto-logo {
    font-size: 36px;
    font-weight: bold;
    padding: 10px 0px;
    align-self: flex-start;
    position: relative;
    left: -10px;
  }

  .navLink {
    color: #031323;
    font-size: 18px;
    line-height: 19px;
    font-weight: bold;
    border-bottom: 3px solid transparent;
    padding: 26px 0px 31px 0px;
    display: inline-block;
    margin: 0px 0px 0px 85px;

    &:last-of-type {
      margin-right: 0px;
    }

    &.active {
      border-bottom: 3px solid #ab61e5;
    }
  }
`;

interface AppBarProps {
  active: 'share' | 'my_feedback' | 'team_feedback' | 'teams';
}

export default function AppBar({ active }: AppBarProps) {
  const user = useContext(UserContext);
  return (
    <StyledAppBar className="AppBar">
      <div className="content">
        <div className="honesto-logo">Honesto</div>
        <a className={`navLink ${active === 'share' ? 'active' : ''}`} href="/">
          Share Feedback
        </a>
        <a className={`navLink ${active === 'my_feedback' ? 'active' : ''}`} href="/my-feedback">
          My Feedback
        </a>
        <a className={`navLink ${active === 'team_feedback' ? 'active' : ''}`}>Team Feedback</a>
        <a className={`navLink ${active === 'teams' ? 'active' : ''}`}>Teams</a>
      </div>
      <Logout />
    </StyledAppBar>
  );
}
