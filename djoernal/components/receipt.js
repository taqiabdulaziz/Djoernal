import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { ImagePicker, Permissions } from 'expo'
import uuid from 'uuid'

import { ref } from '../config/firebase'

export default class receipt extends Component {
  imagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync()
      console.log(result.uri)
      if (!result.cancelled) {
        this.uploadImage(result.uri)
      }
    } catch (err) {
      alert('error nih')
      console.log(err)
    }
  }

  capture = async () => {
    try {
      await Permissions.askAsync(Permissions.CAMERA)
      await Permissions.askAsync(Permissions.CAMERA_ROLL)
      let result = await ImagePicker.launchCameraAsync()
      if (!result.cancelled) {
        this.uploadImage(result.uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    let child = ref.child(uuid.v4())
    let snapshot = await child.put(blob)
    blob.close()
    let url = await snapshot.ref.getDownloadURL();
    console.log(url)
  }

  render() {
    return (
      <View>
        <Button 
          title="pick receipt"
          color="red"
          onPress={ this.imagePick }
        />
        <Button 
          title="camera receipt"
          color="red"
          onPress={ this.capture }
        />
      </View>
    )
  }
}
