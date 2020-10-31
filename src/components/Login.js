import React, { useState } from 'react';
import { Card, Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const cardStyle = {
  margin: '100px auto',
  width: '90%',
  maxWidth: 450,
  padding: '2rem'
}

export default function Login() {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const { user, signIn, signOut } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false); 
    if (error) {
      alert(error);
    }
  }

  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <img className="d-block mx-auto mb-3" src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'></img>
          <Form>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl value={email} onChange={(e) => { setEmail(e.target.value) }} type='email'></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl value={password} onChange={(e) => { setPassword(e.target.value) }} type='password'></FormControl>
            </FormGroup>
            <Button disabled={loading} onClick={handleSignIn} className='w-100 mt-3'>Log in</Button>
            <p className='mt-3 text-center'>Don't have an account ? <Link to='/signup'>Sign up</Link></p>
          </Form>
          {user && <Button  variant='danger' onClick={handleSignOut} className='w-100 mt-3'>Log out</Button>}
        </Card.Body>
      </Card>
    </>
  )
}
