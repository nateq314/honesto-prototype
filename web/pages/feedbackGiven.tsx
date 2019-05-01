import React, { useContext } from 'react';
import styled from 'styled-components';
import Login from '../components/Login';
import Main from '../components/ShareFeedback';
import { UserContext } from './_app';

const StyledFeedbackGiven = styled.div``;

function FeedbackGiven() {
  const user = useContext(UserContext);
  return <StyledFeedbackGiven>{user ? <Main /> : <Login />}</StyledFeedbackGiven>;
}

export default FeedbackGiven;
