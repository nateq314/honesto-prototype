import React from 'react';
import styled from 'styled-components';

interface FreeAnswerQuestionProps {
  updateValue: (value: string | null) => void;
  currentValue: string | null;
}

const StyledFreeAnswerQuestion = styled.div`
  textarea {
    width: 715px;
    height: 231px;
    resize: none;
    border: 1px solid #d9dcd3;
    border-radius: 3px;
    font-size: 16px;
    line-height: 19px;
    color: #031323;
    padding: 20px;
    font-family: 'Open Sans', Helvetica, Helvetica, sans-serif;

    ::placeholder {
      color: #9d9d9d;
    }
  }
`;

export default function FreeAnswerQuestion({ updateValue, currentValue }: FreeAnswerQuestionProps) {
  return (
    <StyledFreeAnswerQuestion>
      <textarea
        value={currentValue || ''}
        onChange={(e) => {
          updateValue(e.target.value || null);
        }}
        placeholder="Enter your response here."
      />
    </StyledFreeAnswerQuestion>
  );
}
