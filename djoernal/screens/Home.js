import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    TouchableHighlight
} from 'react-native'
import Gradient from 'react-native-css-gradient'
const {gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Home extends React.Component {
    render() {
        return (
            <Gradient gradient={gradient} style={{width: width, height: height}}>
                <View style={styles.container}>
                    <Image
                        style={{width: width, height: 150}}
                        source={{uri: 'http://www.stickpng.com/assets/images/58aff217829958a978a4a6d2.png'}}
                    />
                </View>
            </Gradient>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
      fontFamily: 'serif',
      fontSize: 14,
    },
})