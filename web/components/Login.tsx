import React, { useRef } from 'react';
import styled from 'styled-components';
import firebase, { auth } from '../other/firebase';
import { Mutation, FetchResult, MutationFn } from 'react-apollo';
import gql from 'graphql-tag';
import * as Cookies from 'cookies-js';
import TextField from '@material-ui/core/TextField';
import AuthAppBackground from './AuthAppBackground';

interface LoginResponse {
  error?: string;
  user?: firebase.User;
}

const StyledLogin = styled.div`
  background-image: url('/static/background.svg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;

  .form-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
  }

  form {
    box-sizing: border-box;
    width: 400px;
    height: 450px;
    margin: 250px auto 0px auto;
    background-color: #fff;
    background-image: url('/static/app-icon.jpg');
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: 60px;
    background-size: 80px;
    padding: 170px 80px 0px 80px;
  }

  button {
    background-color: #ab61e5;
    border: none;
    padding: 10px 30px;
    color: #fff;
    font-size: 1.2em;
    border-radius: 8px;
    margin-top: 40px;
    width: 100%;
  }
`;

export const LOGIN = `
  mutation Login($idToken: String, $session: String) {
    login(idToken: $idToken, session: $session) {
      error
      user {
        avatar_url
        id
        email
        first_name
        last_name
        feedbacks_given {
          id
          for_user {
            avatar_url
            id
            email
            first_name
            last_name
          }
          responses {
            question {
              id
              text
              order
              choices
              type
            }
            multi
            numerical
            text
          }
        }
        feedbacks_received {
          id
          given_by {
            avatar_url
            id
            email
            first_name
            last_name
          }
          responses {
            question {
              id
              text
              order
              choices
              type
            }
            multi
            numerical
            text
          }
        }
      }
    }
  }
`;

/**
 * <Login /> intentionally does not handle the case of no user object.
 * So it should only ever be rendered in the context of no user.
 */
function Login() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  return (
    <Mutation mutation={gql(LOGIN)}>
      {(login: MutationFn) => {
        return (
          <StyledLogin>
            {/* <AuthAppBackground /> */}
            <div className="form-container">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const { user } = await firebase
                    .auth()
                    .signInWithEmailAndPassword(
                      (email.current as HTMLInputElement).value,
                      (password.current as HTMLInputElement).value,
                    );
                  // TODO: is login fail handled correctly here?
                  if (user) {
                    let idToken = await user.getIdToken();
                    // Only purpose of this call is to set the session cookie, not to get the user object
                    let response: void | FetchResult<any, Record<string, any>, Record<string, any>>;
                    try {
                      response = await login({
                        variables: { idToken },
                      });
                    } catch (error) {
                      const credential = auth.EmailAuthProvider.credential(
                        (email.current as HTMLInputElement).value,
                        (password.current as HTMLInputElement).value,
                      );
                      const result = await user.reauthenticateWithCredential(credential);
                      idToken = await user.getIdToken();
                      response = await login({
                        variables: { idToken },
                      });
                    }
                    if (response) {
                      const { error } = response.data.login as LoginResponse;
                      if (error) {
                        console.error(error);
                      } else {
                        // Then we know the API cookie has been set.
                        // Set a temporary cookie (expires in 1 sec), just enough for sth to be received by the server
                        // and used for login.
                        // TODO: look into other options ('secure', 'domain', etc.), see if any are applicable
                        Cookies.set('tempToken', idToken, { expires: 1 });
                        // * Redirect to this page (login) with said cookie
                        location.assign('/');
                      }
                    }
                  }
                }}
              >
                <div>
                  <TextField id="email" inputRef={email} label="Email" margin="normal" fullWidth />
                </div>
                <div>
                  <TextField
                    id="password"
                    type="password"
                    inputRef={password}
                    label="Password"
                    margin="normal"
                    fullWidth
                  />
                </div>
                {/* <div>
                  <input id="email" ref={email} />
                </div> */}
                <button type="submit">Log In</button>
              </form>
            </div>
          </StyledLogin>
        );
      }}
    </Mutation>
  );
}

export default Login;
