import firebase from 'firebase'
import 'firebase/firestore'

var config = {
  apiKey: "AIzaSyBsAYpD91jQ6AZPx_9Rv3RhUsSZl1ns8AQ",
  authDomain: "djoernal-7119b.firebaseapp.com",
  databaseURL: "https://djoernal-7119b.firebaseio.com",
  projectId: "djoernal-7119b",
  storageBucket: "djoernal-7119b.appspot.com",
  messagingSenderId: "94097636966"
}

firebase.initializeApp(config)

const ref = firebase.storage().ref()

export {
  ref
}