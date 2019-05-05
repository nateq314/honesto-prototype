import React from 'react';
import styled from 'styled-components';
import { ResponseProps } from './MyFeedbackResponses';

const StyledNumericalResponse = styled.div`
  flex-grow: 2;
  text-align: left;
  padding-left: 15px;

  ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
  }

  li {
    display: inline-block;
    padding: 0px;
    width: 9%;
    height: 32px;
    background-color: #f2f3f4;
    margin: 0px 1px;

    &.rating-1 {
      background-color: #de521d;
    }
    &.rating-2 {
      background-color: #e47518;
    }
    &.rating-3 {
      background-color: #ea9812;
    }
    &.rating-4 {
      background-color: #efba0d;
    }
    &.rating-5 {
      background-color: #f5dd07;
    }
    &.rating-6 {
      background-color: #cdd71b;
    }
    &.rating-7 {
      background-color: #a4d12f;
    }
    &.rating-8 {
      background-color: #7ccb42;
    }
    &.rating-9 {
      background-color: #53c556;
    }
    &.rating-10 {
      background-color: #2bbf6a;
    }
  }

  .legend {
    font-size: 12px;
    padding-left: 2px;
    font-weight: bold;
    color: #59636e;
  }
`;

const RATINGS = ['low', 'med', 'high'];

export default function NumericalResponse({ resp }: ResponseProps) {
  return (
    <StyledNumericalResponse>
      <ul>
        {Array(10)
          .fill('')
          .map((_, idx) => {
            return (
              <li
                key={idx}
                className={idx <= (resp.numerical as number) ? `rating-${resp.numerical}` : ''}
              />
            );
          })}
      </ul>
      <div className="legend">{(resp.numerical as number) + 1} / 10</div>
    </StyledNumericalResponse>
  );
}
