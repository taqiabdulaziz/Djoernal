import { ImagePicker, Permissions } from 'expo'
import uuid from 'uuid'

import { ref } from '../config/firebase'

module.exports = {
<<<<<<< HEAD
    baseUrl: "http://10.107.191.79:3000",
=======
    baseUrl: "http://10.107.250.169:3000",
>>>>>>> add google vision test screen
    gradient: `linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)`,
    imagePick: async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync()
      //   console.log(result.uri)
        if (!result.cancelled) {
          return result.uri
        }
      } catch (err) {
        alert('error nih')
        console.log(err)
      }
    },
    capture: async () => {
      try {
        await Permissions.askAsync(Permissions.CAMERA)
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
        let result = await ImagePicker.launchCameraAsync()
        if (!result.cancelled) {
          return result.uri
        }
      } catch (err) {
        console.log(err)
      }
    },
    uploadImage: async (uri) => {
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
      return url
    }
};
