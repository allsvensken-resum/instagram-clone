import React, { useState } from 'react';
import { Card, Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { db, auth } from '../firebase';

export const cardStyle = {
  margin: '100px auto',
  width: '90%',
  maxWidth: 450,
  padding: '2rem'
}

export default function Signup() {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();
  const [userName, setUserName] = useState('');

  const { signUp, user } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Check your password and password confirmation ! ')
      return setError("Check your password and password confirmation !")
    }

    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
      auth.currentUser.updateProfile({
        displayName: userName
      })
      db.collection('users').doc(auth.currentUser.uid).set({
        displayName: userName,
        photoURL: '',
        email: email
      })
      history.push('/');
    } catch (error) {
      setError(error.message);
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <img className="d-block mx-auto mb-3" src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'></img>
          <Form onSubmit={handleSignUp}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl required type='email' value={email} onChange={(e) => setEmail(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Username</FormLabel>
              <FormControl required type='text' value={userName} onChange={(e) => setUserName(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl required type='password' value={password} onChange={(e) => setPassword(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Password confirmation</FormLabel>
              <FormControl required type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></FormControl>
              <Button disabled={loading} type='submit' className='w-100 mt-3'>Sign up</Button>
            </FormGroup>
            <p className='mt-3 text-center'>Have an account ? <Link to='/login'>Log in</Link></p>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
