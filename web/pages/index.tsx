import React, { useContext } from 'react';
import styled from 'styled-components';
import Login from '../components/Login';
import ShareFeedback from '../components/ShareFeedback';
import { UserContext } from './_app';

const StyledHome = styled.div``;

function Home() {
  const user = useContext(UserContext);
  return <StyledHome>{user ? <ShareFeedback /> : <Login />}</StyledHome>;
}

export default Home;
