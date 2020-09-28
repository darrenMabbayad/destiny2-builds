import React from "react";
import { Route, Switch } from "react-router-dom";
import "./css/styles.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Builds from "./pages/Builds";
import Editor from "./pages/Editor";
import { DestinyContextProvider } from "./context/DestinyContext";

function App() {
  return (
    <DestinyContextProvider>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/builds" component={Builds} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </Layout>
    </DestinyContextProvider>
  );
}

export default App;
