import React from 'react';
import styled from 'styled-components';
import { ResponseProps } from './MyFeedbackResponses';

const StyledMultipleChoiceResponse = styled.ul`
  flex-grow: 2;
  list-style-type: none;
  margin: 0px;
  padding: 0px 0px 0px 15px;
  text-align: left;

  li {
    display: inline-block;
    padding: 0px;
    width: 30%;
    height: 32px;
    background-color: #f2f3f4;
    margin: 0px 4px;

    &.low {
      background-color: #de521d;
    }

    &.med {
      background-color: #f5dd07;
    }

    &.high {
      background-color: #2bbf6a;
    }
  }
`;

const RATINGS = ['low', 'med', 'high'];

export default function MultipleChoiceResponse({ resp }: ResponseProps) {
  return (
    <StyledMultipleChoiceResponse>
      {Array(3)
        .fill('')
        .map((_, idx) => {
          return (
            <li
              key={idx}
              className={idx <= (resp.multi as number) ? RATINGS[resp.multi as number] : ''}
            />
          );
        })}
    </StyledMultipleChoiceResponse>
  );
}
