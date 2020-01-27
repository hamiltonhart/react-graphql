import React from "react";
import "./App.css";
import Auth from "./components/Auth";
import Primary from "./components/Primary";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const App = () => {
  const { data, loading, error } = useQuery(IS_LOGGED_IN_QUERY);

  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>Error: {error}</h1>;
  return data.isLoggedIn ? <Primary /> : <Auth />;
}

const IS_LOGGED_IN_QUERY = gql`
  {
    isLoggedIn @client
  }
`;

export default App;
