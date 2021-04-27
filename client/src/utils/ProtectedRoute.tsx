import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface IProps {
  component: () => JSX.Element,
  path: string,
  exact: boolean
}

export default function ProtectedRoute(props: IProps) {
  const token = localStorage.getItem('uid');
  if (token) {
    return <Route path={props.path} component={props.component} />;
  } else {
    return <Redirect to="/login" />;
  }
}
