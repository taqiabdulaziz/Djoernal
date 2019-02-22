import React from 'react'
import {
    View, Text,
    Button
} from 'react-native'

class Test extends React.Component {
    state = {
        sourceAmount: 20,
        expenseAmount: 10,
        diff: 0
    }


    render() {
      return (
          <View>
              <Text>{this.state.diff}</Text>
              <Button title="Test" onPress={() => this.setState({
                  sourceAmount: 90
              })}></Button>
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