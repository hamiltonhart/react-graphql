import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { InMemoryCache } from "apollo-boost";

import * as serviceWorker from "./serviceWorker";

// !Apollo Client is available to the entire app
// ! fetchOptions: {credentials: 'include' - means to include operation.headers (just below in the request)}
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
  // uri: "http://example.herokuapp.com/graphql/"
  cache,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("authToken") || "";
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("authToken")
  }
});

const ApolloApp = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(<ApolloApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
