import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import App, { AppProps, Container } from 'next/app';
import * as React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import GlobalStyles from '../components/GlobalStyles';
import { FETCH_CURRENT_USER } from '../other/queries';
import withApolloClient from '../other/with-apollo-client';

export interface Question {
  id: string;
  text: string;
  type: number;
  order: number;
  choices?: string[];
}

export interface QResponse {
  multi: number | null;
  numerical: number | null;
  text: string | null;
}

export interface QuestionAndResponse extends QResponse {
  question: Question;
}

export interface Feedback {
  id: string;
  for_user: User;
  given_by: User;
  responses: QuestionAndResponse[];
}

export interface User {
  avatar_url: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  feedbacks_given: Feedback[];
  feedbacks_received: Feedback[];
  // actually a lot more than this but for now this is all we want to deal with
}

interface CurrentUserData {
  data?: {
    current_user: User;
  };
}

interface MyAppProps extends AppProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

/**
 * Yes the user object is stored in Apollo state but we don't want to have to
 * use <Query query={FETCH_CURRENT_USER}></Query> plus render props for
 * EVERY component that needs access to it. So we only do that once here, near
 * the top, then put the user object in React Context for ease of access.
 */
export const UserContext = React.createContext<User | null>(null);

class MyApp extends App<MyAppProps> {
  public render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <GlobalStyles />
        <ApolloProvider client={apolloClient}>
          <Query query={FETCH_CURRENT_USER}>
            {({ data }: CurrentUserData) => {
              const user = data ? data.current_user : null;
              return (
                <UserContext.Provider value={user}>
                  <Component {...pageProps} />
                </UserContext.Provider>
              );
            }}
          </Query>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
