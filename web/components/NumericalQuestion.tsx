import React, { useState } from 'react';
import styled from 'styled-components';

interface NumericalQuestionProps {
  choose: (value: number) => void;
  currentValue: number | null;
}

const StyledNumericalQuestion = styled.div`
  /* height: 100px; */
  margin: 20px 0px;
  text-align: center;

  .valueSelector {
    width: 660px;
    display: inline-block;
  }

  .bar {
    display: inline-block;
    width: 60px;
    height: 60px;
    border: 3px solid #fff;
    transition: 0.2s background-color;
    cursor: pointer;

    &.out-of-range {
      background-color: #f2f3f4;
    }

    &.pending-in-range {
      background-color: #d5baed;
    }

    &.pending-out-of-range {
      background-color: #aa65e2;
    }

    &.in-range {
      background-color: #7f0fd7;
    }
  }

  .quickSummary {
    text-align: right;
    margin-right: 5px;
  }
`;

export default function NumericalQuestion({ choose, currentValue }: NumericalQuestionProps) {
  const [mouseIsOverIdx, setMouseIsOverIdx] = useState(-1);

  return (
    <StyledNumericalQuestion>
      <div className="valueSelector">
        <div className="bars">
          {Array(10)
            .fill('')
            .map((_, idx) => {
              let barType = '';
              if (typeof currentValue === 'number' && idx <= currentValue) {
                if (mouseIsOverIdx >= 0 && idx > mouseIsOverIdx) barType = 'pending-out-of-range';
                else barType = 'in-range';
              } else if (idx <= mouseIsOverIdx) barType = 'pending-in-range';
              else barType = 'out-of-range';

              return (
                <span
                  key={idx}
                  className={`bar ${barType}`}
                  onMouseOver={() => {
                    setMouseIsOverIdx(idx);
                  }}
                  onMouseOut={() => {
                    setMouseIsOverIdx(-1);
                  }}
                  onClick={() => {
                    choose(idx);
                  }}
                />
              );
            })}
        </div>
        <div className="quickSummary">
          {typeof currentValue === 'number' ? `${currentValue + 1}/10` : '(No value selected)'}
        </div>
      </div>
    </StyledNumericalQuestion>
  );
}
