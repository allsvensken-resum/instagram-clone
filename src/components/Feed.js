import React, { useState } from 'react'
import './Feed.css';
import { Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';
import { useHistory } from 'react-router-dom';
import Post from './Post';

export default function Feed() {

  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signOut();
      history.push('/login');
    } catch (error) {
      setError(error.message);
    }

    if (error) {
      alert(error);
    }
    setLoading(false);
  }

  return (
    <div className='feed'>
      <nav className='feed__nav'>
        <div className='feed__container'>
          <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
          <input className="form-control w-25 h-50" placeholder="Search" />
          {user && <Button disabled={loading} onClick={handleSignOut} variant='danger'>Log out</Button>}
        </div>
      </nav>
      <div className="feed__main">
        <Post userPost={user.email} userComment={user.email} />
      </div>
    </div>
  )
}
