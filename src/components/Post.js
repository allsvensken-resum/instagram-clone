import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';

export default function Post({ userPost, userComment, caption }) {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  caption = 'I heer beer.'

  const handleAddComment = (e) => {
    e.preventDefault();
    setComments([...comments, { userComment: userComment, comment: comment }]);
  }


  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='mr-3'></Avatar>
        <p className='vertical-center font-weight-bold'>{userPost}</p>
      </div>
      <div className='post__content'>
        <img src="https://i.insider.com/5f454a4242f43f001ddfee74?width=1100&format=jpeg&auto=webp" />
      </div>
      <div className="post__info">
        <div className="d-flex padding-lr-1 mt-3">
          <p className='mr-2 font-weight-bold'>{userPost}</p>
          <p>{caption}</p>
        </div>
        { comments && 
          comments.map(({userComment, comment}) => {
            return (<div className="d-flex padding-lr-1 ">
              <p className='mr-2 font-weight-bold'>{userComment}</p>
              <p>{comment}</p>
            </div>)
          })
        }
        <form className="add__comment padding-lr-1 padding-tb">
          <input value={comment} onChange={(e) => setComment(e.target.value)} className="w-100" placeholder='Add the comment'></input>
          <button onClick={handleAddComment} className="button-link">Post</button>
        </form>
      </div>
    </div>
  )
}
