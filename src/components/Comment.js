import React from 'react';

export default function Comment({ userComment, comment }) {


  return (
    <div className="d-flex pl-3">
      <p className='mr-2 font-weight-bold'>{userComment}</p>
      <p>{comment}</p>
    </div>
  )
}
