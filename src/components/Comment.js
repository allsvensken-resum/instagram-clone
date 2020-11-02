import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

export default function Comment({ userComment, comment }) {

  const [userName, setUserName] = useState('');

  useEffect(async () => {
    const userDocs = await db.collection('users').where('email', '==', userComment).get();
    setUserName(userDocs.docs[0].data().displayName);
  }, [])


  return (userName && 
    <div className="d-flex pl-3">
      <p className='mr-2 font-weight-bold'>{userName}</p>
      <p>{comment}</p>
    </div>
  )
}
