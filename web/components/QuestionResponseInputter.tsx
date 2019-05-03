import React, { useState } from 'react';
import styled from 'styled-components';
import { MutationFn } from 'react-apollo';
import { Question, User, QResponse } from '../pages/_app';
import {
  SetFeedbackMutationResult,
  QuestionResponseMap,
  SetFeedbackVariables,
  ResponseInput,
} from './CompleteFeedback';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import NumericalQuestion from './NumericalQuestion';
import FreeAnswerQuestion from './FreeAnswerQuestion';
import Button from './Button';
import QuestionResponsesProgress from './QuestionResponsesProgress';

interface QuestionResponseInputterProps {
  forUser: User;
  questions: Question[];
  responses: QuestionResponseMap;
  responsesCount: number;
  setFeedback: MutationFn<SetFeedbackMutationResult, SetFeedbackVariables>;
}

const StyledQuestionResponseInputter = styled.div`
  margin-top: 50px;

  .back {
    color: #59636e;
    margin-bottom: 20px;
    text-align: left;

    a:visited {
      color: #59636e;
    }
  }

  h1 {
    font-size: 31px;
    text-align: left;
    line-height: 36px;
    width: 650px;
  }

  .subtitle {
    color: #acb1b6;
    font-size: 12px;
    text-align: left;
    letter-spacing: 0.15em;
    line-height: 14px;
  }

  .heading {
    position: relative;
    height: 152px;
  }

  img {
    position: absolute;
    top: 0px;
    right: 0px;
    height: 60px;
    clip-path: ellipse(30px 30px at 30px 30px);
    vertical-align: middle;
    margin: 15px;
  }

  .main {
    margin-top: 20px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    padding: 20px;
  }

  nav {
    margin: 40px 0px 30px 0px;
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 150px;
  }
`;

export const MULTI = 0;
export const NUMERICAL = 1;
export const TEXT = 2;

const TYPEMAP = ['multi', 'numerical', 'text'];

function responseHasChanged(
  currResponse: QResponse,
  currQuestion: Question,
  numericalResponse: number | null,
  textResponse: string | null,
) {
  const type = TYPEMAP[currQuestion.type] as 'multi' | 'numerical' | 'text';
  const legacyResponse = currResponse[type];
  if (currQuestion.type <= NUMERICAL && legacyResponse === numericalResponse) return false;
  if (currQuestion.type === TEXT && legacyResponse === textResponse) return false;
  return true;
}

export default function QuestionResponseInputter({
  forUser,
  questions,
  responses,
  responsesCount,
  setFeedback,
}: QuestionResponseInputterProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const currQuestion = questions[currentQuestionIdx];
  const currResponse = responses[currQuestion.id];
  const [numericalResponse, setNumericalResponse] = useState(
    currResponse ? currResponse[TYPEMAP[currQuestion.type] as 'multi' | 'numerical'] : null,
  );
  const [textResponse, setTextResponse] = useState(currResponse ? currResponse.text : null);
  const choiceHasBeenEntered =
    ((currQuestion.type === MULTI || currQuestion.type === NUMERICAL) &&
      typeof numericalResponse === 'number') ||
    (currQuestion.type === TEXT && typeof textResponse === 'string');

  const prevOnClick = () => {
    const prevQuestion = questions[currentQuestionIdx - 1];
    const prevResponse = responses[prevQuestion.id];
    setNumericalResponse(
      prevQuestion.type === MULTI || prevQuestion.type === NUMERICAL
        ? prevResponse[TYPEMAP[prevQuestion.type] as 'multi' | 'numerical']
        : null,
    );
    setTextResponse(prevQuestion.type === TEXT ? prevResponse.text : null);
    setCurrentQuestionIdx(currentQuestionIdx - 1);
  };

  const nextOnClick = async () => {
    if (
      !currResponse ||
      responseHasChanged(currResponse, currQuestion, numericalResponse, textResponse)
    ) {
      const response = { question_id: currQuestion.id } as ResponseInput;
      response.multi = currQuestion.type === MULTI ? numericalResponse : null;
      response.numerical = currQuestion.type === NUMERICAL ? numericalResponse : null;
      response.text = currQuestion.type === TEXT ? textResponse : null;
      const mutationResult = await setFeedback({
        variables: {
          for_user: forUser.id,
          response,
        },
      });
      if (!(mutationResult && mutationResult.data && mutationResult.data.setFeedback)) return;
    }
    if (currentQuestionIdx < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIdx + 1];
      const nextResponse = responses[nextQuestion.id];
      setNumericalResponse(
        (nextQuestion.type === MULTI || nextQuestion.type === NUMERICAL) && nextResponse
          ? nextResponse[TYPEMAP[nextQuestion.type] as 'multi' | 'numerical']
          : null,
      );
      setTextResponse(nextQuestion.type === TEXT && nextResponse ? nextResponse.text : null);
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      console.log('end of the road');
      // We've reached the end of the questions
      location.assign('/?feedbackComplete=true');
    }
  };

  const fullname = `${forUser.first_name} ${forUser.last_name}`;
  const subtitle = `SHARE YOUR FEDBACK FOR ${fullname.toUpperCase()}`;
  return (
    <StyledQuestionResponseInputter>
      <div className="back">
        <a href="/">{'< '}BACK</a>
      </div>
      <div className="heading">
        <h1>{currQuestion.text}</h1>
        <div className="subtitle">{subtitle}</div>
        <img src={forUser.avatar_url} />
      </div>
      <div className="main">
        {currQuestion.type === MULTI && (
          <MultipleChoiceQuestion
            choices={currQuestion.choices as string[]}
            currentlyChosen={numericalResponse}
            choose={setNumericalResponse}
          />
        )}
        {currQuestion.type === NUMERICAL && (
          <NumericalQuestion currentValue={numericalResponse} choose={setNumericalResponse} />
        )}
        {currQuestion.type === TEXT && (
          <FreeAnswerQuestion currentValue={textResponse} updateValue={setTextResponse} />
        )}
        <nav>
          <Button disabled={currQuestion.order === 1} onClick={prevOnClick}>
            Previous
          </Button>
          <Button onClick={nextOnClick} disabled={!!currResponse}>
            Skip
          </Button>
          <Button disabled={!choiceHasBeenEntered} onClick={nextOnClick}>
            Next
          </Button>
        </nav>
        <QuestionResponsesProgress
          currentIndex={currentQuestionIdx}
          responsesCount={responsesCount}
          questionsCount={questions.length}
        />
      </div>
    </StyledQuestionResponseInputter>
  );
}
