import React from 'react';
import styled from 'styled-components';

interface MultipleChoiceQuestionProps {
  choices: string[];
  choose: (value: number) => void;
  currentlyChosen: number | null;
}

const StyledMultipleChoiceQuestion = styled.ul`
  margin: 0px;
  padding: 0px;
  list-style-type: none;

  li {
    border-radius: 3px;
    background-color: #f2f3f4;
    margin: 10px 0px;
    padding: 15px 30px;
    text-align: left;
    color: #031323;
    transition: 0.4s background-color, 0.4s color;
    cursor: pointer;

    &:first-of-type {
      margin-top: 0px;
    }
  }

  li.chosen {
    background-color: #59636e;
    color: #fff;
  }
`;

export default function MultipleChoiceQuestion({
  choices,
  choose,
  currentlyChosen,
}: MultipleChoiceQuestionProps) {
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
