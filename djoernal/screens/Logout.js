import React from 'react'
import {
    View,
    Text,
    Button
} from 'react-native'

class Logout extends React.Component {
    render() {
      return (
          <View>
          <Button title="logout" onPress={() => this.props.navigation.navigate("Signin")}></Button>    
        </View>
      )
    }

    componentDidMount = () => {
        
    }
}

export default Logout
