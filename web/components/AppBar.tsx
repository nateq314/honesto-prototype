import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../pages/_app';
import Logout from './Logout';

const StyledAppBar = styled.header`
  background-color: #f2f3f4;
  grid-area: appbar;
  /* position: relative; */

  .content {
    width: 800px;
    margin: 0px auto;
    text-align: left;
    padding-top: 0px;
  }

  .navLink {
    color: #031323;
    font-size: 18px;
    line-height: 19px;
    font-weight: bold;
    margin-right: 115px;
    border-bottom: 3px solid transparent;
    padding: 26px 0px 31px 0px;
    display: inline-block;

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
        <a className={`navLink ${active === 'share' ? 'active' : ''}`} href="/">
          Share Feedback
        </a>
        <a className={`navLink ${active === 'my_feedback' ? 'active' : ''}`}>My Feedback</a>
        <a className={`navLink ${active === 'team_feedback' ? 'active' : ''}`}>Team Feedback</a>
        <a className={`navLink ${active === 'teams' ? 'active' : ''}`}>Teams</a>
      </div>
      <Logout />
    </StyledAppBar>
  );
}
