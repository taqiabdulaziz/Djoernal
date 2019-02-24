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
        imageData: [],
        itemList: [{
            name: "Mie",
            amount: 20000
        }],
        totalAmount: 0
    }

    imagePick = async () => {
        let uri = await imagePick()
        this.uploadImage(uri)
    }

    capture = async () => {
        let uri = await capture()
        this.uploadImage(uri)
    }

    uploadImage = async (uri) => {
        let url = await uploadImage(uri)
        this.scan(url)
    }

    scan = async (url) => {
        let result = await axios.post(`${baseUrl}/googlevision`, {
            url: url
        })
        this.process(result.data)
        this.setState({
            totalAmount: result.data.totalAmount
        })
    }

    process = async (data) => {
        console.log(data)
    }

    render() {
      return (
          <View>
              <Text>{this.state.diff}</Text>
              <Button onPress={() => this.imagePick()} title="pick image"></Button>
              <Text>Total: Rp. {this.state.totalAmount}</Text>
              <Button title="SCAN!" onPress={this.capture}></Button>
              {
                  this.state.itemList.map((item) => {
                      return (
                          <View>
                              <Text>{item.name}</Text>
                              <Text>{item.amount}</Text>
                          </View>
                      )
                  })
              }
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