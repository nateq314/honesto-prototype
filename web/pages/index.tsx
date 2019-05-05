import React, { useContext } from 'react';
import Router from 'next/router';
import Login from '../components/Login';
import ShareFeedback from '../components/ShareFeedback';
import { UserContext } from './_app';
import { NextContext } from 'next';

interface HomeProps {
  feedbackComplete?: boolean;
}

function Home({ feedbackComplete }: HomeProps) {
  const user = useContext(UserContext);

  return user ? <ShareFeedback feedbackComplete={feedbackComplete} /> : <Login />;
}

Home.getInitialProps = async ({ req, res, query }: NextContext) => {
  if (query.feedbackComplete) {
    if (res) {
      res.writeHead(302, {
        Location: 'https://theorem-prototype.now.sh/',
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
