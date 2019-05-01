import React, { useContext } from 'react';
import styled from 'styled-components';
import Login from '../components/Login';
import Main from '../components/Main';
import { UserContext } from './_app';

const StyledFeedbackReceived = styled.div``;

function FeedbackReceived() {
  const user = useContext(UserContext);
  return <StyledFeedbackReceived>{user ? <Main /> : <Login />}</StyledFeedbackReceived>;
}

export default FeedbackReceived;
