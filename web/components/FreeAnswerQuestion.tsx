import React from 'react';
import styled from 'styled-components';

interface FreeAnswerQuestionProps {
  updateValue: (value: string | null) => void;
  currentValue: string | null;
}

const StyledFreeAnswerQuestion = styled.ul`
  li.chosen {
    background-color: #222;
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
      />
    </StyledFreeAnswerQuestion>
  );
}
