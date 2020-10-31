import React, { useState, useEffect, useRef } from 'react'
import './Feed.css';
import { Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';
import { useHistory } from 'react-router-dom';
import Post from './Post';
import { db, storageRef } from '../firebase';
import { Dialog, DialogTitle, DialogContent, TextField } from '@material-ui/core';
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
  const [file, setFile] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map(doc => <Post key={doc.data().timestamp} userPost={doc.data().userPost} postID={doc.id} img={doc.data().img} caption={doc.data().caption} />))
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

      },

      (error) => {

      },

      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(dowloadURL => {
          db.collection('posts').add({
            userPost: user.displayName,
            caption: caption,
            img: dowloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          setCaption('');
          setLoading(false);
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
            {user && <Button disabled={loading} onClick={handleSignOut} variant='danger'>Log out</Button>}
          </div>
        </div>
      </nav>
      <div className="feed__main">
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><h5>Upload image</h5></DialogTitle>
          <DialogContent>
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
              />
              <input type='file' ref={fileRef} required />
              <Button type="submit" className="" disabled={(!caption || loading)} >Post</Button>
            </form>
          </DialogContent>
        </Dialog>
        {posts}
      </div>
    </div>
  )
}
