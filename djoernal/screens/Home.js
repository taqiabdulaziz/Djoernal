import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    Platform,
    TouchableHighlight
} from 'react-native'
import Gradient from 'react-native-css-gradient'
import { Ionicons as Icon } from '@expo/vector-icons'
const { gradient } = require('../helpers/helpers')
const { width, height } = Dimensions.get('window')

class Home extends React.Component {
    static navigationOptions(props) {
        return {
            title: 'Homepage',
            headerStyle: {
                elevation: 0,
                backgroundColor: "#3CB371"
            },
            headerLeft: (
                <Icon name="md-menu" size={28} style={{
                    margin: 17
                }} onPress={() => props.navigation.openDrawer()}></Icon>
            )
        }
    }
    render() {
        return (
            <Gradient gradient={gradient} style={{ width: width, height: height }}>
                <View style={styles.container}>
                    <Image
                        style={{ width: width, height: 235 }}
                        source={{ uri: 'http://www.stickpng.com/assets/images/58aff217829958a978a4a6d2.png' }}
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
        //   paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
})