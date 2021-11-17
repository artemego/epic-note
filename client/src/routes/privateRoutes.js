import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
const Notes = React.lazy(() => import("../pages/Notes"));

// Todo: добавить страницы настроек приложения, пользователя, ...

let privateRoutes = (
  <Switch>
    <Route exact path="/" component={Notes} key="home" />,
    <Route path="/:pageId" component={Notes} key="home" />,
    <Route render={() => <Redirect to={{ pathname: "/" }} />} />
  </Switch>
);

export default privateRoutes;
