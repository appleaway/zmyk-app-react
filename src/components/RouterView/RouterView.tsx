
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { RouteConfig } from "../../router/index";

export interface RouteProps {
  routes: RouteConfig[];
  to?: string;
  from?: string;
  [key: string]: any;
}

function RouterView(props: RouteProps) {
  console.log("RouterView props", props)
  const { from, to } = props;
  const children = props.routes || [];
  const Loading = <p>Loading...</p>


  return (
    <BrowserRouter>
      <Switch>
        {(from && to) && <Redirect from={from} to={to} exact />}
        {
          children.map((route, index) => {
            return (
              <Route sensitive strict key={index} path={route.path} render={
                (props) => <Suspense fallback={Loading}><route.component {...props} routes={route.children} /></Suspense>
              }></Route>
            );
          })
        }
      </Switch>
    </BrowserRouter>
  );
}

export default RouterView;