import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    Platform,
    TouchableHighlight,
    ScrollView,
} from 'react-native'
import Gradient from 'react-native-css-gradient'
import { Ionicons as Icon } from '@expo/vector-icons'
import Profit from '../components/profitChart'
const {gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

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
            <ScrollView>
                <View style={styles.containerGrey}>
                    <Profit/>
                </View>
            </ScrollView>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    containerGrey: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#e1e2e1',
    }
})