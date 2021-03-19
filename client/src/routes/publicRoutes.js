import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";

// Todo: здесь нужно будет редиректить пользователя, если он не залогинен.
// Todo: Добавить страницу showcase, которая будет показываться в первый раз незалогиненным пользователям

let publicRoutes = (
  <Switch>
    <Route exact path="/" component={App} key="home" />,
    <Route path="/login" component={LoginPage} key="login" />,
    <Route path="/register" component={RegisterPage} key="register" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default publicRoutes;
