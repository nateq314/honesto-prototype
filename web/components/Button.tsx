import * as React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s background-color;
  border: 1px solid #ddd;
  font-size: 1em;
  background-color: transparent;

  &:hover {
    background-color: #f0f0f0;
  }

  &.honesto {
    background-color: #ab61e5;
    color: #fff;

    &:hover {
      background-color: #8249ae;
    }
  }

  &.seagreen {
    background-color: #2bbf69;
    color: #fff;

    &:hover {
      background-color: #24a058;
    }
  }

  &[disabled] {
    color: #aaa;
    cursor: default;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

interface ButtonProps {
  [key: string]: any;
}

export default (props: ButtonProps) => <Button {...props}>{props.children}</Button>;
