import { ImagePicker, Permissions } from 'expo'
import uuid from 'uuid'
import { ref } from '../config/firebase'

module.exports = {
    baseUrl: "http://35.187.225.61",
    gradient: `linear-gradient(to top, #0ba360 0%, #3cba92 100%)`,
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

      // console.log(`mau compress`);
      
      // let data = new Compressor(blob, {
      //   quality: 0.8,
      //   success(result) {
      //     console.log(result);
      //     console.log(`hehehe`);
          
          
      //     return result
      //   }
      // })
      // console.log(`masuk sini`);
      // console.log(data);
      
      

      let snapshot = await child.put(blob)
      blob.close()
      let url = await snapshot.ref.getDownloadURL();
      return url
    }
};
