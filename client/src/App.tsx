import React from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAppointment from './pages/SetAppointment';
import ProtectedRoute from './utils/ProtectedRoute';
import firebase from "firebase";
import UpdateAppointment from './pages/UpdateAppointment';

function App() {
  firebase.auth().onAuthStateChanged(res => {
    if (res) {
      localStorage.setItem('uid', res.uid);
    } else {
      localStorage.removeItem('uid');
    }
  });

  return (
    <BrowserRouter>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/set-appointment" exact component={SetAppointment} />
      <Route path="/appointments/:id" exact component={UpdateAppointment} />
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </BrowserRouter>
  );
}

export default App;
