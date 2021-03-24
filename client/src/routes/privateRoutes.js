import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import App from "../App";
import Notes from "../pages/Notes";

// Todo: добавить страницы настроек приложения, пользователя, ...

let privateRoutes = (
  <Switch>
    <Route exact path="/" component={Notes} key="home" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default privateRoutes;
