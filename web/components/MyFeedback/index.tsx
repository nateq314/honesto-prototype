import React, { useState } from 'react';
import styled from 'styled-components';
import { Feedback, Question } from '../../pages/_app';
import MyFeedbackContent from './MyFeedbackContent';

interface MyFeedbackProps {
  feedbacksGiven: Feedback[];
  feedbacksReceived: Feedback[];
  questions: Question[];
}

const StyledMyFeedback = styled.section`
  width: 1180px;
  margin: 30px auto 0px auto;
  display: grid;
  grid-template-rows: 50px auto;
  grid-template-areas: 'header' 'content';

  header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-content: flex-end;

    h1 {
      margin: 0px;
      height: 20px;
    }

    h2 {
      display: inline-block;
      margin: 0px 0px 0px 20px;
      border-radius: 8px;
      padding: 0px 10px;
      cursor: pointer;
    }
  }
  h2.selected {
    background-color: #ab61e5;
    color: #fff;
  }
`;

export const GIVEN = true;
export const RECEIVED = false;

export default function MyFeedback({
  feedbacksGiven,
  feedbacksReceived,
  questions,
}: MyFeedbackProps) {
  const [selectedView, setSelectedView] = useState(GIVEN);
  const feedbacks = selectedView === RECEIVED ? feedbacksReceived : feedbacksGiven;

  return (
    <StyledMyFeedback className={selectedView === GIVEN ? 'feedbacks-given' : 'feedbacks-received'}>
      <MyFeedbackHeader
        selectedView={selectedView}
        toggleView={() => setSelectedView(!selectedView)}
      />
      <MyFeedbackContent
        questionCount={questions.length}
        feedbacks={feedbacks}
        selectedView={selectedView}
      />
    </StyledMyFeedback>
  );
}

interface MyFeedbackHeaderProps {
  selectedView: boolean;
  toggleView: () => void;
}

function MyFeedbackHeader({ selectedView, toggleView }: MyFeedbackHeaderProps) {
  const isGivenView = selectedView === GIVEN;
  const isReceivedView = selectedView === RECEIVED;
  return (
    <header>
      <h1>My Feedback</h1>
      <div className="selectView">
        <h2 className={isGivenView ? 'selected' : ''} onClick={toggleView}>
          Feedback Given
        </h2>
        <h2 className={isReceivedView ? 'selected' : ''} onClick={toggleView}>
          Feedback Received
        </h2>
      </div>
    </header>
  );
}
