import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

const LoginPage = React.lazy(() => import("../pages/login/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/register/RegisterPage"));

// Todo: здесь нужно будет редиректить пользователя, если он не залогинен.
// Todo: Добавить страницу showcase, которая будет показываться в первый раз незалогиненным пользователям

let publicRoutes = (
  <Switch>
    <Route
      exact
      path="/"
      render={() => <Redirect to={{ pathname: "/login" }} />}
      key="home"
    />
    ,
    <Route path="/login" component={LoginPage} key="login" />,
    <Route path="/register" component={RegisterPage} key="register" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default publicRoutes;
