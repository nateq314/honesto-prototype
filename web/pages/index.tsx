import React, { useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Login from '../components/Login';
import ShareFeedback from '../components/ShareFeedback';
import { UserContext } from './_app';
import { NextContext } from 'next';

const StyledHome = styled.div``;

interface HomeProps {
  feedbackComplete?: boolean;
}

function Home({ feedbackComplete }: HomeProps) {
  const user = useContext(UserContext);

  return (
    <StyledHome>
      {user ? <ShareFeedback feedbackComplete={feedbackComplete} /> : <Login />}
    </StyledHome>
  );
}

Home.getInitialProps = async ({ req, res, query }: NextContext) => {
  if (query.feedbackComplete) {
    if (res) {
      res.writeHead(302, {
        Location: 'http://localhost:4000/',
      });
      res.end();
    } else {
      Router.push('/');
    }
  }
  return {
    feedbackComplete: query.feedbackComplete,
  };
};

export default Home;
