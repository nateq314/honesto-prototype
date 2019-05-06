import React from 'react';
import styled from 'styled-components';
import { RelevantFeedback } from './MyFeedbackContent';
import { QuestionAndResponse, Question } from '../../pages/_app';
import { MULTI, NUMERICAL, TEXT } from '../QuestionResponseInputter';
import MultipleChoiceResponse from './MultipleChoiceResponse';
import NumericalResponse from './NumericalResponse';
import TextResponse from './TextResponse';
import { GIVEN, RECEIVED } from '.';

interface MyFeedbackResponsesProps {
  fb: RelevantFeedback;
  selectedView: boolean;
}

export interface ResponseProps {
  resp: QuestionAndResponse;
  skipped?: boolean;
}

const StyledMyFeedbackResponses = styled.ul`
  list-style-type: none;
  margin: 0px 0px 0px 0px;
  padding: 0px;
  text-align: left;
  width: 100%;
  border-left: 1px solid #ddd;

  li.response-list-header {
    font-size: 22px;
    line-height: 50px;
    padding: 0px 15px;
    border-bottom: 1px solid #ddd;
  }

  li.response {
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-height: 100px;

    &:last-of-type {
      border-bottom: none;
    }
  }

  .question-text {
    padding: 15px;
    width: 380px;
  }

  .skipped {
    margin-top: 0px;
  }

  .skipped span {
    display: inline-block;
    background-color: #acb1b6;
    color: #fff;
    padding: 0px 5px;
    border-radius: 4px;
    font-size: 12px;
  }
`;

export default ({ fb, selectedView }: MyFeedbackResponsesProps) => {
  return (
    <StyledMyFeedbackResponses>
      <li className="response-list-header">
        {selectedView === GIVEN && `My Feedback for ${fb.user.first_name} ${fb.user.last_name}`}
        {selectedView === RECEIVED && `${fb.user.first_name} ${fb.user.last_name}'s Feedback`}
      </li>
      {fb.responses.map((resp) => {
        const skipped =
          (resp.question.type === MULTI && resp.multi === null) ||
          (resp.question.type === NUMERICAL && resp.numerical === null) ||
          (resp.question.type === TEXT && resp.text === null);
        return (
          <li className="response" key={resp.question.id}>
            <div className="question-text">
              {resp.question.text}
              {skipped && (
                <div className="skipped">
                  <span>SKIPPED</span>
                </div>
              )}
            </div>
            {resp.question.type === MULTI && (
              <MultipleChoiceResponse resp={resp} skipped={skipped} />
            )}
            {resp.question.type === NUMERICAL && <NumericalResponse resp={resp} />}
            {resp.question.type === TEXT && <TextResponse resp={resp} />}
          </li>
        );
      })}
    </StyledMyFeedbackResponses>
  );
};
