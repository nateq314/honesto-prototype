import Router from 'next/router';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext, User } from './_app';
import AppBar from '../components/AppBar';
import Footer from '../components/Footer';
import MyFeedback from '../components/MyFeedback';

interface FetchUserQueryResult {
  user: User;
}

const StyledMyFeedbackPage = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 80px auto 54px;
  grid-template-areas: 'appbar' 'app_content' 'footer';
`;

function MyFeedbackPage() {
  const user = useContext(UserContext) as User;
  if (typeof window !== 'undefined' && !user) Router.push('/');
  return (
    <StyledMyFeedbackPage>
      <AppBar active={'my_feedback'} />
      <MyFeedback
        feedbacksGiven={user.feedbacks_given}
        feedbacksReceived={user.feedbacks_received}
      />
      <Footer />
    </StyledMyFeedbackPage>
  );
}

export default MyFeedbackPage;
