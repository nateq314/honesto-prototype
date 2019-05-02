import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Query, QueryResult, Mutation, MutationFn } from 'react-apollo';
import { FETCH_QUESTIONS } from '../other/queries';
import { UserContext, User, Feedback, Question, QuestionResponse } from '../pages/_app';
import { UPDATE_FEEDBACK } from '../other/mutations';
import QuestionResponseInputter from './QuestionResponseInputter';

interface CompleteFeedbackProps {
  forUser: User;
  responses: QuestionResponse[];
}

interface FetchQuestionsQueryResult {
  questions: Question[];
}

export interface QuestionResponseMap {
  [key: string]: {
    multi?: number;
    numerical?: number;
    text?: string;
  };
}

export interface UpdateFeedbackMutationResult {
  success: boolean;
  message?: string;
}

export interface ResponseInput {
  question_id: string;
  multi?: number;
  numerical?: number;
  text?: string;
}

const StyledCompleteFeedback = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 70px auto;
  grid-template-areas: 'appbar' 'app_content';
`;

type QuestionType = 'multi' | 'numerical' | 'text';
const QTYPES: QuestionType[] = ['multi', 'numerical', 'text'];

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
          <Mutation mutation={UPDATE_FEEDBACK}>
            {(updateFeedback: MutationFn<UpdateFeedbackMutationResult, ResponseInput>) => {
              return (
                <QuestionResponseInputter
                  currentIdx={responsesCount + 1}
                  forUser={forUser}
                  questions={sortedQuestions}
                  responses={questionResponseMap}
                  updateFeedback={updateFeedback}
                />
              );
            }}
          </Mutation>
        );
      }}
    </Query>
  );
}
