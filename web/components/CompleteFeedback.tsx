import React, { useContext, useMemo } from 'react';
import { Query, QueryResult, Mutation, MutationFn, FetchResult } from 'react-apollo';
import styled from 'styled-components';
import { FETCH_QUESTIONS, FETCH_CURRENT_USER } from '../other/queries';
import { UserContext, User, Question, QuestionAndResponse, Feedback } from '../pages/_app';
import { SET_FEEDBACK } from '../other/mutations';
import QuestionResponseInputter from './QuestionResponseInputter';
import { DataProxy } from 'apollo-cache';
import AppBar from './AppBar';

const StyledCompleteFeedback = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 60px auto;
  grid-template-areas: 'appbar' 'app_content';

  .main-content {
    width: 800px;
    margin: 0px auto;
  }
`;

interface CompleteFeedbackProps {
  forUser: User;
  responses: QuestionAndResponse[];
}

export interface FetchQuestionsQueryResult {
  questions: Question[];
}

export interface QuestionResponseMap {
  [key: string]: {
    multi: number | null;
    numerical: number | null;
    text: string | null;
  };
}

export interface SetFeedbackMutationResult {
  setFeedback: Feedback;
}

export interface ResponseInput {
  question_id: string;
  multi: number | null;
  numerical: number | null;
  text: string | null;
}

export interface SetFeedbackVariables {
  for_user: string;
  response: ResponseInput;
}

export default function CompleteFeedback({ responses, forUser }: CompleteFeedbackProps) {
  const user = useContext(UserContext) as User;
  const questionResponseMap = useMemo(() => {
    return responses.reduce(
      (allResponses, response) => {
        allResponses[response.question.id] = response;
        return allResponses;
      },
      {} as QuestionResponseMap,
    );
  }, [responses]);

  return (
    <Query query={FETCH_QUESTIONS}>
      {({ error, loading, data }: QueryResult<FetchQuestionsQueryResult>) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { questions } = data as FetchQuestionsQueryResult;
        const sortedQuestions = [...questions].sort((qA, qB) => (qA.order < qB.order ? -1 : 1));
        const responsesCount = responses.length;
        return (
          <Mutation
            mutation={SET_FEEDBACK}
            update={(cache: DataProxy, mutationResult: FetchResult<SetFeedbackMutationResult>) => {
              if (mutationResult && mutationResult.data && mutationResult.data.setFeedback) {
                const { setFeedback } = mutationResult.data;
                const idx = user.feedbacks_given.findIndex((f) => f.id === setFeedback.id);
                cache.writeQuery({
                  query: FETCH_CURRENT_USER,
                  data: {
                    current_user: {
                      ...user,
                      feedbacks_given:
                        idx >= 0
                          ? [
                              ...user.feedbacks_given.slice(0, idx),
                              setFeedback,
                              ...user.feedbacks_given.slice(idx + 1),
                            ]
                          : user.feedbacks_given.concat(setFeedback),
                    },
                  },
                });
              }
            }}
          >
            {(setFeedback: MutationFn) => {
              return (
                <StyledCompleteFeedback>
                  <AppBar />
                  <div className="main-content">
                    <QuestionResponseInputter
                      forUser={forUser}
                      questions={sortedQuestions}
                      responses={questionResponseMap}
                      responsesCount={responses.length}
                      setFeedback={setFeedback}
                    />
                  </div>
                </StyledCompleteFeedback>
              );
            }}
          </Mutation>
        );
      }}
    </Query>
  );
}
