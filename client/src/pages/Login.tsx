import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import firebase from 'firebase';
import Loader from '../components/Loader';
import { AppContext } from '../App';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AppContext);

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      history.push('/set-appointment');
    }
  }, []);

  const handleClick = () => {
    if (!email || !password) {
      setErrors(['Email and Password is required']);
      return;
    }
    setErrors([]);
    setLoading(true);
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        setLoading(false);
        if (res.user) {
          dispatch({
            type: 'setUser',
            payload: res.user,
          });
          localStorage.setItem('uid', res.user.uid);
          history.push('/set-appointment');
        }
      })
      .catch(e => {
        setLoading(false);
        setErrors([e.message]);
      });
  }

  return (
    <div className="form">
      <h1>Login</h1>
      <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      {
        errors.length ?
        errors.map(e => <p key={e} className="error-message">{e}</p>) :
        null
      }
      <button onClick={handleClick}>{loading ? <Loader /> : 'Submit'}</button>
      <Link to="/register">Create an account</Link>
    </div>
  );
}
