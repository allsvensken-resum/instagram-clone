import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';
import Comment from './Comment';
import firebase from 'firebase';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthProvider';

export default function Post({ userPost, caption, img, postID }) {

  const [comments, setComments] = useState();
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  //Listening for user update profile.
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userPost).onSnapshot(userDocs => {
      setUserName(userDocs.data().displayName);
      setUserImage(userDocs.data().photoURL);
    })
    return unsubscribe;
  }, [])

  //Listening for comment data on the post.
  useEffect(() => {
    const unsubscribe = db.collection('posts').doc(postID).collection('comments')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        setComments(snapshot.docs.map(doc =>
          <Comment userComment={doc.data().userComment} key={doc.data().timestamp} comment={doc.data().comment} />
        ))
      })
    return unsubscribe;
  }, [])

  const handleAddComment = (e) => {
    e.preventDefault();
    db.collection('posts').doc(postID).collection('comments').add({
      userComment: auth.currentUser.uid,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        setComment('')
      }
      )
  }



  return (userName &&
    <div className='post'>
      <div className='post__header'>
        <Avatar src={userImage}></Avatar>
        <p className='font-weight-bold'>{userName}</p>
      </div>
      <div className='post__content'>
        <img src={img} />
      </div>
      <div className="post__info">
        <div className="d-flex padding-lr-1 mt-3">
          <p className='mr-2 font-weight-bold'>{userName}</p>
          <p>{caption}</p>
        </div>
        {
          comments
        }
        <form className="add__comment padding-lr-1 padding-tb">
          <input value={comment} onChange={(e) => setComment(e.target.value)} className="w-100" placeholder='Add the comment'></input>
          <button disabled={!comment} onClick={handleAddComment} className="button-link">Post</button>
        </form>
      </div>
    </div>
  )
}
