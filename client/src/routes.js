import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";

// Todo: здесь нужно будет редиректить пользователя, если он не залогинен.
// Todo: Добавить страницу showcase, которая будет показываться в первый раз незалогиненным пользователям
// скорее всего перенаправлять пользователя мы будем в useEffect компонентов, а не в onEnter

let routes = (
  <Switch>
    <Route exact path="/" component={Home} key="home" />,
    <Route path="/login" component={LoginPage} key="login" />,
    <Route path="/register" component={RegisterPage} key="register" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default routes;
