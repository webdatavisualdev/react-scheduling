import React, { useState, useEffect } from 'react';
import firebase from "firebase";
import { createUser } from '../fb-sdk';
import { useHistory, Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (password !== confirmPassword) {
      setErrors(['Confirm Password doesn\'t match']);
      return;
    }
    setErrors([]);
    setLoading(true);
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        setLoading(false);
        if (res.user) {
          createUser(res.user)
            .then((res: any) => {
              if (res.success) {
                history.push('/set-appointment');
              }
            })
            .catch(e => {
              setErrors([e.message]);
            });
        }
      })
      .catch(e => {
        setErrors([e.message]);
        setLoading(false);
      });
  }

  return (
    <div className="form">
      <h1>Register</h1>
      <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Confirm password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
      {
        errors.length ?
        errors.map(e => <p key={e} className="error-message">{e}</p>) :
        null
      }
      <button onClick={handleClick}>{loading ? <Loader /> : 'Submit'}</button>
      <Link to="/login">Already have an account? Go to Login</Link>
    </div>
  );
}
