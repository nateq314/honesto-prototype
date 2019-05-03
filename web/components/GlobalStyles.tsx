import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Open+Sans");

  body {
    background-color: #ffffff;
    color: #000;
    text-align: center;
    font-family: "Open Sans", sans-serif;
    margin: 0;
  }

  h1 {
    margin-top: 0px;
  }
`;

export default GlobalStyles;
