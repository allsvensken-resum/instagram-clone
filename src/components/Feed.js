import React, { useState, useEffect, useRef } from 'react'
import './Feed.css';
import { Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';
import { useHistory, Link } from 'react-router-dom';
import Post from './Post';
import { db, storageRef, auth } from '../firebase';
import { Dialog, DialogTitle, DialogContent, TextField, LinearProgress } from '@material-ui/core';
import firebase from 'firebase';

export default function Feed() {

  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const [posts, setPosts] = useState();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);


  //Listening to update post on feed.
  useEffect(() => {
    const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map(doc => <Post key={doc.data().timestamp}
          userPost={doc.data().userPost} postID={doc.id} img={doc.data().img} caption={doc.data().caption} />))
      })
    return unsubscribe;
  }, [])

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }


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

  const handleUpload = (e) => {
    e.preventDefault();
    const basePath = 'images/'
    const fileName = fileRef.current.files[0].name;
    const fullPath = `${basePath}/${Date.now()}-${fileName}`;
    const uploadTask = storageRef.child(fullPath).put(fileRef.current.files[0]);
    setLoading(true);
    uploadTask.on('state_changed',
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setBuffer(progress + 10);
      },

      (error) => {
        setLoading(false);
      },

      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(dowloadURL => {
          db.collection('posts').add({
            userPost: auth.currentUser.uid,
            caption: caption,
            img: dowloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          setLoading(false);
          setCaption('');
          setProgress(0);
          handleClose();
        })
      }
    )
  }

  return (
    <div className='feed'>
      <nav className='feed__nav'>
        <div className='feed__container'>
          <img className="mr-1" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
          <input className="feed__search form-control w-25 h-50" placeholder="Search" />
          <div className="feed__button">
            <Button onClick={() => handleOpen()} className='mr-2' variant='primary'>Upload</Button>
            {user && <Button onClick={handleSignOut} variant='danger'>Log out</Button>}

          </div>
        </div>
      </nav>
      <div className="feed__main">
        <Dialog open={open} onClose={handleClose}>
          {loading && <LinearProgress variant="determinate" value={progress} valueBuffer={buffer} />}
          <DialogTitle><h5>Upload image</h5></DialogTitle>
          <DialogContent>
            <Link to='/update-profile'>Update profile</Link>
            <form onSubmit={handleUpload} className='upload__form'>
              <TextField
                multiline
                rows={6}
                label="What is on your mind ? "
                style={{
                  width: '100%'
                }}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
              <input type='file' ref={fileRef} accept="image/*" required />
              <Button type="submit" className="" disabled={loading} >Post</Button>
            </form>
          </DialogContent>
        </Dialog>
        {posts}
      </div>
    </div>
  )
}
