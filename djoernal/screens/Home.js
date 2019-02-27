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
    TouchableOpacity,
} from 'react-native'
import Gradient from 'react-native-css-gradient'
import { Ionicons as Icon } from '@expo/vector-icons'
import Profit from '../components/profitChart'
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
                    paddingLeft: 17,
                    paddingTop: 17,
                    paddingBottom: 17,
                    color: "white"
                }} onPress={() => props.navigation.openDrawer()}></Icon>
            )
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.containerGrey}>
                    <Profit/>
                    <View style={{flexDirection:'row', marginTop:30, marginBottom:20}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Revenue')} style={{width: 110, height: 110, borderWidth:1}}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={{uri: 'https://cdn4.vectorstock.com/i/1000x1000/01/63/money-income-icon-vector-6110163.jpg'}}                                
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Expense')} style={{width: 110, height: 110, backgroundColor:'white', borderWidth:1}}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={{uri: 'https://cdn3.iconfinder.com/data/icons/money-management-color/64/expense-wallet-money-spend-512.png'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Transaksi')} style={{width: 110, height: 110,borderWidth:1}}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={{uri: 'https://png.pngtree.com/element_our/png_detail/20181114/transaction-icon-png_239785.jpg'}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', marginBottom: 20}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Product')} style={{width: 110, height: 110, backgroundColor:'white',borderWidth:1}}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={{uri: 'https://cdn4.iconfinder.com/data/icons/pretty_office_3/256/packing.png'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BalanceSheet')} style={{width: 115, height: 115,borderWidth:1}}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM6oRtq0Mvr4zPKsfn_0TQ8YVZU1OQhbQUdhgEd8G9Egr0Chrrow'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: 110, height: 110}}>
                            
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    containerGrey: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#e1e2e1',
        height: height
    }
})