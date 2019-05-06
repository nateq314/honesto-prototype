import React, { useState } from 'react';
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

  .tooltip {
    width: 200px;
    position: absolute;
    color: #fff;
    visibility: hidden;
    padding: 8px;
    border-radius: 16px;
    border-top-left-radius: 0px;
    font-size: 12px;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.8);
    border-top-left-radius: 0;

    &.visible {
      visibility: visible;
    }
  }
`;

const RATINGS = ['low', 'med', 'high'];

export default function MultipleChoiceResponse({ resp, skipped }: ResponseProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mouseXY, setMouseXY] = useState({
    x: -1,
    y: -1,
  });

  function onMouseOver(e: React.MouseEvent<HTMLUListElement>) {
    setShowTooltip(true);
    setMouseXY({
      x: e.pageX + 10,
      y: e.pageY + 10,
    });
  }

  function onMouseOut() {
    setShowTooltip(false);
  }

  function onMouseMove(e: React.MouseEvent<HTMLUListElement>) {
    setMouseXY({
      x: e.pageX + 10,
      y: e.pageY + 10,
    });
  }

  return (
    <StyledMultipleChoiceResponse
      onMouseOver={!skipped ? onMouseOver : undefined}
      onMouseOut={!skipped ? onMouseOut : undefined}
      onMouseMove={!skipped ? onMouseMove : undefined}
    >
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
      <div
        className={`tooltip ${showTooltip ? 'visible' : ''}`}
        style={{
          top: mouseXY.y + 'px',
          left: mouseXY.x + 'px',
        }}
      >
        {(resp.question.choices as string[])[resp.multi as number]}
      </div>
    </StyledMultipleChoiceResponse>
  );
}
