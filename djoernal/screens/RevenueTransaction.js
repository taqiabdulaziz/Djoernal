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
    title: 'Penjualan'
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

  formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    let result = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")
    return result
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
      <View style={styles.containerGrey}>
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
            <Gradient gradient='linear-gradient(to right, #868f96 0%, #596164 100%)' style={{
              width: width*0.9, 
              height: height/2, 
              borderRadius: 20, 
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <TouchableHighlight
              style={styles.smallBtn}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>X</Text>
            </TouchableHighlight>
            <Text></Text>
            <Text style={{color: "white", fontWeight: "bold"}}>HPP: </Text>
              {this.state.selectedItem.map((element, i) => {                  
                return (                
                  <Text style={{padding: 10, color: "white", fontWeight: "bold"}} key={i}>{element.product.name} ({element.q*-1}pcs): {this.formatMoney(element.product.hpp * (element.q*-1))}</Text>
                )
              })}
            </Gradient>
          </View>
          </Modal>
        
          <TouchableOpacity onPress={this.syncData} style={{
            width: width *0.95,
            height: 36,
            backgroundColor: "#009efd",
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 6,
            borderRadius: 4,
          }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>SYNC DATA</Text>
          </TouchableOpacity>
          {this.state.list.map((item, index )=> (
            <TouchableOpacity 
              key ={index} 
              onPress={() => {
                this.setState({ selectedItem: item.kredit });
                this.setModalVisible(!this.state.modalVisible);
              }}
              style={{
                backgroundColor: 'white', 
                borderRadius: 4, 
                width: width*0.9, 
                alignItems:'flex-start', 
                justifyContent: 'flex-start', 
                marginTop: 10,
                marginLeft: 15
            }}>
              <View style={{flexDirection:'row'}}>
                <Text style={{paddingTop:10, paddingLeft:10}}>Rp. {this.formatMoney(item.debit.nominal)}</Text>
                <Text style={{marginLeft: 168, marginTop:7, color:'green'}}>{item.debit.accountType}</Text>
              </View>
              <Text style={{paddingLeft:10, paddingBottom:10}}>Penjualan</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerGrey: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    backgroundColor: '#e1e2e1',
  },
  containerWhite: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 14,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 4
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
    width: width / 6,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: width *0.7
  },
});
