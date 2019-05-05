import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Feedback, User, QuestionAndResponse } from '../../pages/_app';
import { GIVEN } from '.';
import MyFeedbackResponses from './MyFeedbackResponses';
import MyFeedbackList from './MyFeedbackList';

interface MyFeedbackContentProps {
  feedbacks: Feedback[];
  selectedView: boolean;
}

export interface RelevantFeedback {
  user: User;
  responses: QuestionAndResponse[];
}

const StyledMyFeedbackContent = styled.div`
  grid-area: content;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 50px;
`;

const StyledNoContentToDisplay = styled.div`
  padding: 50px;
  text-align: left;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);

  h1 {
    font-size: 31px;
    line-height: 36px;
  }
  h2 {
    font-size: 16px;
    line-height: 19px;
    color: #59636e;
    letter-spacing: 0.05em;
  }
`;

export default function MyFeedbackContent({ feedbacks, selectedView }: MyFeedbackContentProps) {
  const fb: RelevantFeedback[] = useMemo(
    () =>
      feedbacks.map((f) => {
        if (selectedView === GIVEN)
          return {
            user: f.for_user,
            responses: f.responses,
          };
        else
          return {
            user: f.given_by,
            responses: f.responses,
          };
      }),
    [feedbacks],
  );

  // show the first one by default
  const [selectedFbIdx, setSelectedFbIdx] = useState(fb.length > 0 ? 0 : null);

  useEffect(() => {
    setSelectedFbIdx(fb.length > 0 ? 0 : null);
  }, [fb]);

  function feedbackOnClick(e: React.MouseEvent<HTMLLIElement>) {
    setSelectedFbIdx(+e.currentTarget.id.split('-')[1]);
  }

  return selectedFbIdx !== null && fb.length > 0 ? (
    <StyledMyFeedbackContent>
      <MyFeedbackList
        fb={fb}
        selectedFbIdx={selectedFbIdx}
        selectedView={selectedView}
        feedbackOnClick={feedbackOnClick}
      />
      <MyFeedbackResponses fb={fb[selectedFbIdx]} />
    </StyledMyFeedbackContent>
  ) : (
    <StyledNoContentToDisplay>
      <h1>No feedback to display 🔮</h1>
      <h2>There is no feedback to display at this time – check back in a bit!</h2>
    </StyledNoContentToDisplay>
  );
}
