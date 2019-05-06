import React from 'react';
import styled from 'styled-components';
import { RelevantFeedback } from './MyFeedbackContent';
import { GIVEN } from '.';

interface MyFeedbackListProps {
  fb: RelevantFeedback[];
  selectedView: boolean;
  selectedFbIdx: number;
  feedbackOnClick: (e: React.MouseEvent<HTMLLIElement>) => void;
}

const StyledMyFeedbackList = styled.ul`
  list-style-type: none;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  width: 380px;
  text-align: left;
  height: 100%;

  li {
    padding-left: 10px 0px 10px 15px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;

    &:first-of-type {
      cursor: default;
      font-size: 12px;
      height: 20px;
      letter-spacing: 0.15em;
      color: #59636e;
      font-weight: bold;
      padding: 17px 0px 13px 15px;
    }
  }

  .selected {
    background-color: #eee;
  }

  img {
    height: 60px;
    clip-path: ellipse(30px 30px at 30px 30px);
    vertical-align: middle;
    margin: 15px;
  }
`;

export default ({ fb, selectedView, selectedFbIdx, feedbackOnClick }: MyFeedbackListProps) => {
  return (
    <StyledMyFeedbackList>
      <li>FEEDBACK {selectedView === GIVEN ? 'GIVEN' : 'RECEIVED'}</li>
      {fb.map((f, idx) => {
        return (
          <li
            key={f.user.id}
            className={selectedFbIdx === idx ? 'selected' : ''}
            id={`feedback-${idx}`}
            onClick={feedbackOnClick}
          >
            <img src={f.user.avatar_url} />
            <span className="user-name">
              {f.user.first_name} {f.user.last_name}
            </span>
          </li>
        );
      })}
    </StyledMyFeedbackList>
  );
};
