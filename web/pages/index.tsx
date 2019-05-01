import React, { useContext } from 'react';
import styled from 'styled-components';
import Login from '../components/Login';
import Main from '../components/Main';
import { UserContext } from './_app';

const StyledShareFeedback = styled.div``;

function ShareFeedback() {
  const user = useContext(UserContext);
  return <StyledShareFeedback>{user ? <Main /> : <Login />}</StyledShareFeedback>;
}

export default ShareFeedback;
