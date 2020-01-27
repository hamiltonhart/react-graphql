import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import {TOKEN_AUTH_MUTATION} from '../../graphql/mutations/AuthMutations';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tokenAuth, { client }] = useMutation(TOKEN_AUTH_MUTATION);

  const handleSubmit = async (e, tokenAuth, client) => {
    e.preventDefault();
    const res = await tokenAuth({ variables: { username, password } });
    localStorage.setItem("authToken", res.data.tokenAuth.token);
    client.writeData({ data: { isLoggedIn: true } });
  };

  return (
    <form onSubmit={e => handleSubmit(e, tokenAuth, client)}>
      <input
        type="text"
        placeholder="username"
        onChange={e => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="password"
        placeholder="password"
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
