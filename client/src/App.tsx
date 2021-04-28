import React, { useReducer, useEffect } from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAppointment from './pages/SetAppointment';
import InvitedAppointments from './pages/InvitedAppointments';
import ProtectedRoute from './utils/ProtectedRoute';
import firebase from "firebase";
import UpdateAppointment from './pages/UpdateAppointment';
import { appReducer, initialState } from './app-reducer';

export class IContext {
  state: any;
  dispatch: any;
}

const context = new IContext();

export const AppContext = React.createContext(context);

function App() {
  const [ state, dispatch ] = useReducer(appReducer, initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((res: any) => {
      if (res) {
        if (!state.user) {
          dispatch({
            type: 'setUser',
            payload: res
          });
        }
        localStorage.setItem('uid', res.uid);
      } else {
        localStorage.removeItem('uid');
      }
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <ProtectedRoute path="/set-appointment" exact component={SetAppointment} />
        <ProtectedRoute path="/invited-appointments" exact component={InvitedAppointments} />
        <Route path="/appointments/:id" exact component={UpdateAppointment} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
