import React from 'react'

import {
    View, Text,
    Button
} from 'react-native'
import axios from 'axios'
import {baseUrl} from '../helpers/helpers'
import {capture, uploadImage, imagePick} from '../helpers/helpers'

class Test extends React.Component {
    state = {
        sourceAmount: 20,
        expenseAmount: 10,
        diff: 0,
        imageUri: '',
        imageUrl: '',
        imageData: []
    }

    imagePick = async () => {
        let uri = await imagePick()
        this.uploadImage(uri)
    }

    capture = (uri) => {

    }

    uploadImage = async (uri) => {
        let url = await uploadImage(uri)
        this.scan(url)
    }

    scan = async (url) => {
        let result = await axios.post(`${baseUrl}/googlevision`, {
            url: url
        })
        console.log(result.data);
        this.setState({
            imageData: result.data
        })
    }

    render() {
      return (
          <View>
              <Text>{this.state.diff}</Text>
              <Button onPress={() => this.imagePick()} title="pick image"></Button>
              <Text>{JSON.stringify(this.state.imageData)}</Text>
              <Button title="SCAN!" onPress={this.scan}></Button>
        </View>
      )
    }
    
    componentDidMount() {
        this.setState({
            diff: this.state.sourceAmount - this.state.expenseAmount
        })
    }
}

export default Test