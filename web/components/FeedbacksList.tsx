import React from 'react';
import styled from 'styled-components';
import { User } from '../pages/_app';
import UserFeedbackListItem from './UserFeedbackListItem';
import { Query, QueryResult } from 'react-apollo';
import { FETCH_QUESTIONS } from '../other/queries';
import { FetchQuestionsQueryResult } from './CompleteFeedback';

const StyledFeedbacksList = styled.ul`
  list-style-type: none;
  margin: 0px;
  padding: 0px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
`;

interface FeedbacksListProps {
  users: User[];
}

export default function FeedbacksList({ users }: FeedbacksListProps) {
  return (
    <Query query={FETCH_QUESTIONS}>
      {({ error, loading, data }: QueryResult<FetchQuestionsQueryResult>) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        if (data) {
          const { questions } = data;
          return (
            <StyledFeedbacksList>
              {users.map((user) => (
                <UserFeedbackListItem key={user.id} user={user} questionsCount={questions.length} />
              ))}
            </StyledFeedbacksList>
          );
        }
      }}
    </Query>
  );
}
