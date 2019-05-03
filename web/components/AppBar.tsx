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
    padding-top: 25px;
  }

  .navLink {
    color: #031323;
    font-size: 18px;
    line-height: 19px;
    font-weight: bold;
    margin-right: 115px;

    &:last-of-type {
      margin-right: 0px;
    }
  }
`;

export default function AppBar() {
  const user = useContext(UserContext);
  return (
    <StyledAppBar className="AppBar">
      <div className="content">
        <a className="navLink" href="/">
          Share Feedback
        </a>
        <a className="navLink">My Feedback</a>
        <a className="navLink">Team Feedback</a>
        <a className="navLink">Teams</a>
      </div>
      <Logout />
    </StyledAppBar>
  );
}
