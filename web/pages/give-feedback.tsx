import { NextContext } from 'next';
import Router from 'next/router';
import React, { useContext } from 'react';
import CompleteFeedback from '../components/CompleteFeedback';
import { UserContext, User } from './_app';
import { Query, QueryResult } from 'react-apollo';
import { FETCH_USER } from '../other/queries';

interface GiveFeedbackPageProps {
  forUserID: string;
}

interface FetchUserQueryResult {
  user: User;
}

function GiveFeedbackPage({ forUserID }: GiveFeedbackPageProps) {
  const user = useContext(UserContext) as User;
  if (typeof window !== 'undefined' && !user) Router.push('/');
  const feedback = (user as User).feedbacks_given.find((f) => f.for_user.id === forUserID);
  const responses = feedback ? feedback.responses : [];
  return (
    <Query query={FETCH_USER} variables={{ id: forUserID }}>
      {({ error, loading, data }: QueryResult<FetchUserQueryResult>) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        if (data) {
          const { user } = data;
          return <CompleteFeedback forUser={user} responses={responses} />;
        }
      }}
    </Query>
  );
}

GiveFeedbackPage.getInitialProps = async ({ req, res, query }: NextContext) => {
  if (req) {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const matches = cookieHeader.match(/session=(.+)/);
      if (matches && matches.length >= 1 && query.uid) {
        // This is enough to at least assume that there's a session and return the page.
        // If the session token isn't valid, then 'user' will still be not present on
        // the page and we can redirect from there.
        if (query.uid) {
          return {
            forUserID: query.uid,
          };
        }
      }
    }
  }
  if (res) {
    res.writeHead(302, {
      Location: 'https://theorem-prototype.now.sh/',
    });
    res.end();
  } else {
    Router.push('/');
  }
  return {};
};

export default GiveFeedbackPage;
