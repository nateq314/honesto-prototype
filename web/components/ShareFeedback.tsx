import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import styled from 'styled-components';
import AppBar from './AppBar';
import { FETCH_USERS } from '../other/queries';
import { User } from '../pages/_app';
import FeedbacksList from './FeedbacksList';
import Footer from './Footer';

const StyledShareFeedback = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 80px auto 54px;
  grid-template-areas: 'appbar' 'app_content' 'footer';

  .main-content {
    width: 800px;
    margin: 0px auto;
  }

  .heading {
    margin-top: 50px;
    text-align: left;
  }
`;

interface FetchUsersQueryResult {
  users: User[];
}

interface ShareFeedbackProps {
  feedbackComplete?: boolean;
}

export default function ShareFeedback({ feedbackComplete }: ShareFeedbackProps) {
  return (
    <Query query={FETCH_USERS}>
      {({ loading, error, data }: QueryResult<FetchUsersQueryResult>) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { users } = data as FetchUsersQueryResult;
        if (users) {
          return (
            <StyledShareFeedback>
              <AppBar />
              <div className="main-content">
                <div className="heading">
                  {feedbackComplete ? (
                    <>
                      <h1>Thank you for sharing your feedback!</h1>
                      <div className="subheading">
                        Continue to give feedback to other team members.
                      </div>
                    </>
                  ) : (
                    <h1>Share Feedback</h1>
                  )}
                </div>
                <FeedbacksList users={users} />
              </div>
              <Footer />
            </StyledShareFeedback>
          );
        }
      }}
    </Query>
  );
}
