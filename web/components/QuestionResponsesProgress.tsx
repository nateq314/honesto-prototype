import React from 'react';
import styled from 'styled-components';
import { User } from '../pages/_app';

interface QuestionResponsesProgressProps {
  forUser: User;
  responsesCount: number;
  questionsCount: number;
}

const StyledQuestionResponsesProgress = styled.div``;

export default function QuestionResponsesProgress({
  forUser,
  responsesCount,
  questionsCount,
}: QuestionResponsesProgressProps) {
  return (
    <StyledQuestionResponsesProgress>
      QUESTIONS COMPLETED
      <br />
      {responsesCount} / {questionsCount}
    </StyledQuestionResponsesProgress>
  );
}
