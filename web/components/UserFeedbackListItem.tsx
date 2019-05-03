import React, { useContext } from 'react';
import styled from 'styled-components';
import { User, UserContext } from '../pages/_app';
import Button from './Button';

const StyledFeedbacksList = styled.li`
  border-bottom: 1px solid #ddd;
  text-align: left;

  &:last-of-type {
    border-bottom: none;
  }

  img {
    height: 60px;
    clip-path: ellipse(30px 30px at 30px 30px);
    vertical-align: middle;
    margin: 15px;
  }
  .user-name {
    margin-left: 20px;
    color: #59636e;
    vertical-align: middle;
    font-size: 1.3em;
    font-weight: bold;
  }
  a {
    float: right;
    margin-top: 24px;
    margin-right: 22px;
  }
  button {
    width: 160px;
  }
`;

interface UserFeedbackItemProps {
  questionsCount: number;
  user: User;
}

export default function UserFeedbackListItem({ questionsCount, user }: UserFeedbackItemProps) {
  const current_user = useContext(UserContext) as User;
  let buttonText: string;
  const feedback = user.feedbacks_received.find((f) => f.given_by.id === current_user.id);
  let responsesCount = 0;
  if (feedback) {
    responsesCount = feedback.responses.length;
  }
  if (responsesCount === 0) buttonText = 'Fill Out';
  else if (responsesCount < questionsCount) buttonText = 'Continue';
  else buttonText = 'View Submission';
  return (
    <StyledFeedbacksList>
      <img src={user.avatar_url} />
      <span className="user-name">
        {user.first_name} {user.last_name}
      </span>
      <a href={`/give-feedback?uid=${user.id}`}>
        <Button
          className={
            responsesCount < questionsCount ? (responsesCount === 0 ? 'honesto' : 'seagreen') : ''
          }
        >
          {buttonText}
        </Button>
      </a>{' '}
    </StyledFeedbacksList>
  );
}
