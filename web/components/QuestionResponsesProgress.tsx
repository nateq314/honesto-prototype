import React from 'react';
import styled from 'styled-components';

interface QuestionResponsesProgressProps {
  currentIndex: number;
  responsesCount: number;
  questionsCount: number;
}

const StyledQuestionResponsesProgress = styled.div`
  .progressBar {
    height: 5px;
    width: 100%;
    background-color: #f2f3f4;
    margin-bottom: 10px;
  }

  .progress {
    height: 5px;
    background: linear-gradient(to right, #1edebc, #98fffb);
  }

  .text {
    text-align: left;
    color: #031323;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.15em;
    font-weight: bold;
  }

  .completed {
  }
`;

export default function QuestionResponsesProgress({
  currentIndex,
  responsesCount,
  questionsCount,
}: QuestionResponsesProgressProps) {
  const progressPercent = (responsesCount / questionsCount) * 100;

  return (
    <StyledQuestionResponsesProgress>
      <div className="progressBar">
        <div
          className="progress"
          style={{
            width: `${progressPercent}%`,
          }}
        />
      </div>
      <div className="text">
        QUESTION {currentIndex + 1} / {questionsCount}
        <br />
        <span className="completed">TOTAL COMPLETED: {responsesCount}</span>
      </div>
    </StyledQuestionResponsesProgress>
  );
}
