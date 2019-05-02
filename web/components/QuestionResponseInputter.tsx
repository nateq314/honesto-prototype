import React, { useState } from 'react';
import styled from 'styled-components';
import { Question, User } from '../pages/_app';
import { MutationFn } from 'react-apollo';
import {
  UpdateFeedbackMutationResult,
  ResponseInput,
  QuestionResponseMap,
} from './CompleteFeedback';

interface QuestionResponseInputterProps {
  currentIdx: number;
  forUser: User;
  questions: Question[];
  responses: QuestionResponseMap;
  updateFeedback: MutationFn<UpdateFeedbackMutationResult, ResponseInput>;
}

interface MultipleChoiceQuestionProps {
  choices: string[];
  choose: (value: number) => void;
  currentlyChosen?: number;
}

const StyledMultipleChoiceQuestion = styled.ul`
  li.chosen {
    background-color: #222;
  }
`;

function MultipleChoiceQuestion({ choices, choose, currentlyChosen }: MultipleChoiceQuestionProps) {
  return (
    <StyledMultipleChoiceQuestion>
      {choices.map((choice, idx) => {
        const chosen = currentlyChosen === idx;
        return (
          <li className={chosen ? 'chosen' : ''} key={idx} onClick={() => choose(idx)}>
            {choice}
          </li>
        );
      })}
    </StyledMultipleChoiceQuestion>
  );
}

function NumericalQuestion() {
  return <h2>Numerical Question</h2>;
}

function TextQuestion() {
  return <h2>Text Question</h2>;
}

const StyledQuestionResponseInputter = styled.div``;

export default function QuestionResponseInputter({
  currentIdx,
  forUser,
  questions,
  responses,
  updateFeedback,
}: QuestionResponseInputterProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(currentIdx);
  const question = questions[currentQuestionIdx];
  const response = responses[question.id];
  const [numericalResponse, setNumericalResponse] = useState(
    response ? response.multi || response.numerical : undefined,
  );
  const [textResponse, setTextResponse] = useState(response ? response.text : undefined);
  const subtitle = `SHARE YOUR FEDBACK FOR ${forUser.first_name} ${forUser.last_name}`;

  const handleNumericalResponse = (value: number) => {
    setNumericalResponse(value);
  };

  return (
    <StyledQuestionResponseInputter>
      <h1>{question.text}</h1>
      <span className="subtitle">{subtitle}</span>
      {question.type === 0 && (
        <MultipleChoiceQuestion
          choices={question.choices as string[]}
          currentlyChosen={numericalResponse}
          choose={handleNumericalResponse}
        />
      )}
      {question.type === 1 && <NumericalQuestion />}
      {question.type === 2 && <TextQuestion />}
    </StyledQuestionResponseInputter>
  );
}
