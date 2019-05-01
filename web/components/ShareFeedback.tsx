import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import styled from 'styled-components';
import AppBar from './AppBar';
import { FETCH_USERS } from '../other/queries';
import { User } from '../pages/_app';

const StyledShareFeedback = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 70px auto;
  grid-template-areas: 'appbar' 'app_content';
`;

interface FetchUsersQueryResult {
  users: User[];
}

interface UserFeedbackItemProps {
  user: User;
}

function UserFeedbackItem({ user }: UserFeedbackItemProps) {
  return (
    <li>
      <span className="user_name">
        {user.first_name} {user.last_name}
      </span>
    </li>
  );
}

export default function ShareFeedback() {
  return (
    <Query query={FETCH_USERS}>
      {({ loading, error, data }: QueryResult<FetchUsersQueryResult>) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        if (data) {
          const { users } = data;
          if (users) {
            return (
              <StyledShareFeedback>
                <AppBar />
                <h1>Share Feedback</h1>
                <ul>
                  {users.map((user) => (
                    <UserFeedbackItem key={user.id} user={user} />
                  ))}
                </ul>
              </StyledShareFeedback>
            );
          }
        }
      }}
    </Query>
  );
}
