import React, { useState, useRef } from 'react'
import { Card, Form, FormControl, FormGroup, FormLabel, Button } from 'react-bootstrap';
import { cardStyle } from './Signup';
import { useAuth } from '../contexts/AuthProvider';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { storageRef } from '../firebase';
import { LinearProgress } from '@material-ui/core';

export default function UpdateProfile() {

  const [userName, setUserName] = useState('');
  const { user } = useAuth();
  const fileRef = useRef();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpdate = (e) => {
    e.preventDefault();
    const basePath = 'images/profile/'
    const fileName = fileRef.current.files[0].name;
    const path = `${basePath}${fileName}-${Date.now()}`;
    const uploadTask = storageRef.child(path).put(fileRef.current.files[0])
    let newProfileObj = {};
    if (userName) {
      newProfileObj = {
        displayName: userName
      }
    }
    setLoading(true);
    uploadTask.on('state_changed',
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {

      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((dowloadURL) => {
          firebase.auth().currentUser.updateProfile({
            ...newProfileObj,
            photoURL: dowloadURL
          })
        })
        setLoading(false);
      }
    )
  }

  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <h5 className="text-center mb-3">Update Profile</h5>
          {loading && <LinearProgress variant="determinate" value={progress} />}
          <Form onSubmit={handleUpdate}>
            <FormGroup>
              <FormLabel>Username</FormLabel>
              <FormControl placeholder={user.displayName} type='text' value={userName} onChange={(e) => setUserName(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl required type='file' ref={fileRef} />
            </FormGroup>
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button disabled={loading} type="submit" >Update</Button>
            </div>
            <Link to='/'>Go back</Link>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
