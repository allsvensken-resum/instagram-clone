import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';
import Comment from './Comment';
import firebase from 'firebase';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthProvider';

export default function Post({ userPost, caption, img, postID }) {

  const [comments, setComments] = useState();
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = db.collection('posts').doc(postID).collection('comments')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        setComments(snapshot.docs.map(doc =>
          <Comment key={doc.data().timestamp}
            userComment={doc.data().userComment} comment={doc.data().comment} />
        ))
      })

    return unsubscribe;
  }, [])

  const handleAddComment = (e) => {
    e.preventDefault();
    db.collection('posts').doc(postID).collection('comments').add({
      userComment: user.displayName,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(() =>
        setComment(''))
  }


  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar></Avatar>
        <p className='font-weight-bold'>{userPost}</p>
      </div>
      <div className='post__content'>
        <img src={img} />
      </div>
      <div className="post__info">
        <div className="d-flex padding-lr-1 mt-3">
          <p className='mr-2 font-weight-bold'>{userPost}</p>
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
