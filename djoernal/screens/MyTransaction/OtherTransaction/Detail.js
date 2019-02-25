import React from 'react'
import {
    Text,
    View,
    Button
} from 'react-native'

class Detail extends React.Component {

    state = {
        modalVisibility: false
    }

    static navigationOptions() {
        return {
            title: "Expense Detail",
            headerStyle: {
                elevation: 2,
                backgroundColor: "#3CB371"
            }
        }
    }

    render() {
        return (
            <View>
                <Text>wew</Text>
                
            </View>
        )
    }
}

export default Detail