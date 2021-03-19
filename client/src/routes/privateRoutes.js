import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import App from "../App";

// Todo: добавить страницы настроек приложения, пользователя, ...

let privateRoutes = (
  <Switch>
    <Route exact path="/" component={App} key="home" />,
    <Route exact path="/notes" component={App} key="notes" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default privateRoutes;
