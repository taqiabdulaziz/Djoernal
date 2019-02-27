import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlight,
  StatusBar,
  Platform,
  Modal
} from 'react-native';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
import { Ionicons as Icon } from '@expo/vector-icons'
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

export default class Transaction extends React.Component {
  static navigationOptions = {
    title: 'Transaksi Penjualan',
  }

  async componentDidMount() {
    try {
      let { data } = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      let pilihan = data.transactionList.filter(item => {
        return item.transactionType.accountType === "Revenue"
      })
      console.log(pilihan)
      this.setState({
        list: pilihan
      });
    } catch (err) {
      console.log(err.message)
    }
  }
  syncData = async () => {
    try {
      let { data } = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      let pilihan = await data.transactionList.filter(item => {
        return item.transactionType.accountType === "Revenue"
      })
      console.log(pilihan)
      await this.setState({
        list: pilihan
      });

    } catch (err) {
      console.log(err.message)
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  state = {
    list: [],
    selectedItem: [],
    profit: 0,
    modalVisible: false,
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* <Text>{JSON.stringify(this.state.list)}</Text> */}
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
            marginTop: height/6,
            marginLeft: width*0.01,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
            <Gradient gradient='linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' style={{width: width*0.9, height: height/2, borderRadius: 60}}>
            <TouchableHighlight
              style={styles.smallBtn}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text>X</Text>
            </TouchableHighlight>
            <Text></Text>
            <Text style={{padding: 10}}>HPP: </Text>
              {this.state.selectedItem.map((element, i) => {                  
                return (<View key={i} style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                  <Text style={{padding: 20}} >{element.product.name} ({element.q*-1}pcs):{element.product.hpp * (element.q*-1)}</Text>
                </View>)
              })}
            </Gradient>
          </View>
          </Modal>
        
          <TouchableOpacity onPress={this.syncData} style={styles.btn}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Sync Data</Text>
          </TouchableOpacity>
          {this.state.list.map((item, index )=> (
            <View key ={index} style={{backgroundColor: 'white', borderRadius: 20, width: width*0.8, alignItems:'flex-start', justifyContent: 'center', margin: 20}}>
              <Text style={{paddingLeft:20}}>{item.debit.accountType}:{item.debit.nominal}</Text>
              <Text style={{paddingLeft:50}}>Penjualan:{item.debit.nominal}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedItem: item.kredit });
                  this.setModalVisible(!this.state.modalVisible);
                }}
                style={styles.btn}
              >
              <Text style={{color: 'white', fontWeight: 'bold'}}>Detail</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 14,
    width: width,
    height: height * 0.8
  },
  boxWrapper: {
    width: width,
    height: height / 4,
    alignItems: 'flex-start',
    margin: 5,
  },
  box: {
    width: width * 0.95,
    height: 30,
    flexDirection: 'row',
    margin: 5
  },
  input: {
    width: width * 0.7,
    height: 30,
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: 'azure'
  },
  pickerItem: {
    marginTop: -10,
    marginLeft: -10
  },
  text: {
  },
  btn: {
    width: width /2,
    height: 30,
    backgroundColor: "#009efd",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
  smallBtn: {
    width: width / 4,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
});
