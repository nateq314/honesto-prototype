import React, { useContext } from 'react';
import styled from 'styled-components';
import firebase from '../other/firebase';
import { Mutation, MutationFn } from 'react-apollo';
import { UserContext, User } from '../pages/_app';
import { LOGOUT } from '../other/mutations';

const StyledLogout = styled.span`
  position: absolute;
  right: 0px;
  top: 0px;
  margin-right: 20px;
  height: 80px;
  border-left: 1px solid #b0b0b0;

  img {
    height: 58px;
    clip-path: ellipse(29px 29px at 29px 29px);
    vertical-align: middle;
    margin: 10px 25px 10px 25px;
    vertical-align: middle;
  }

  .text {
    text-align: left;
    vertical-align: middle;
    display: inline-block;
    font-size: 16px;
  }

  a {
    cursor: pointer;
    margin-right: 0px;
    font-weight: bold;
    letter-spacing: 0.1em;
  }
`;

function Login() {
  const user = useContext(UserContext) as User;
  return user ? (
    <Mutation mutation={LOGOUT}>
      {(logout: MutationFn) => (
        <StyledLogout>
          <img src={user.avatar_url} />
          <div className="text">
            <div className="user-name">
              {user.first_name} {user.last_name}
            </div>
            <a
              onClick={async () => {
                // sign out from firebase
                await firebase.auth().signOut();
                // remove the API <-> CLIENT session token
                const response = await logout();
                // TODO: Remove the API <-> SSR session token
                location.assign(`/?logout=true`);
              }}
            >
              Log Out
            </a>
          </div>
        </StyledLogout>
      )}
    </Mutation>
  ) : null;
}

export default Login;
