import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import styled from 'styled-components';
import AppBar from './AppBar';

const StyledMain = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 70px auto;
  grid-template-areas: 'appbar' 'app_content';
`;

export default function Main() {
  return (
    // <Query query={FETCH_LISTS}>
    //   {({ loading, error, data }: QueryResult) => {
    //     if (loading) return 'Loading...';
    //     if (error) return `Error! ${error.message}`;

    //     return (
    //       <StyledMain>
    //         <AppBar />
    //       </StyledMain>
    //     );
    //   }}
    // </Query>
    <StyledMain>
      <AppBar />
    </StyledMain>
  );
}