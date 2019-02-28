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
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons'
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
const { baseUrl, gradient } = require('../helpers/helpers')
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux'

export default class Revenue extends React.Component {
  static navigationOptions(props) {
    return {
      title: 'Pendapatan',
      headerStyle: {
        elevation: 2,
        backgroundColor: "#3CB371"
      },
      headerLeft: (
        <Icon name="md-menu" size={28} style={{
          margin: 17,
          color: "white"
        }} onPress={() => props.navigation.openDrawer()}></Icon>
      )
    }
  }

  async componentDidMount() {
    try  {
      let {data} = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ revenueAccounts: data, revenueId: data[0]._id, revenueName: data[0].name });
    } catch (err) {
      console.log(err.message)
    }
  }

  state = {
    incomeType: 'Kas',
    incomeAccounts: [
      "Kas",
      "Piutang"
    ],
    revenue: [],
    revenueName: '',
    revenueId: '',
    revenuePrice: 0,
    revenueAmount: '',
    revenueAccounts: []
  }

  submitRevenue = async() => {
    let price = 0
    this.state.revenueAccounts.forEach(async (data) => {
      if (data.name == this.state.revenueName) {
        price = data.price
      }
    })

    await this.setState({ 
      revenue: [...this.state.revenue, 
        {
          id: this.state.revenueId, 
          name: this.state.revenueName, 
          q: this.state.revenueAmount *-1, 
          price: price
        }
      ] 
    }) 
  }

  submit = async () => {
    let incomeAmount = 0
    console.log(this.state.revenue)
    await this.state.revenue.map((item, index)=> {
      incomeAmount += ((item.q*-1) * item.price)
    })
    let transaction = {
      transactionType: {
        accountType: 'Revenue',
        subAccount: this.state.incomeType
      },
      debit: {
        accountType: this.state.incomeType,
        nominal: incomeAmount
      },
      kredit: this.state.revenue
    }
    try {
      let { data } = axios.post(`${baseUrl}/transaction`, transaction, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      Alert.alert('Berhasil memasukkan data pendapatan')
      this.props.navigation.navigate('Revenue') 
      this.setState({revenue: [], revenueAmount: ''})
    } catch (error){
      console.log(error)
    }
  }
  delete = (index) => {
    var array = [...this.state.revenue];
    array.splice(index, 1);
    this.setState({ revenue: array });
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
  render() {
    const pickerItems = this.state.revenueAccounts.map((item, index) => {
      return (
        <Picker.Item key={index} label={item.name} value={item.name} />
      )
    })
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={Header.HEIGHT - 60}
        style={styles.containerGrey}
        behavior="padding"
      >
        <ScrollView>
          <View style={styles.containerGrey}>
          <View style={styles.containerWhite}>
            <View style={styles.box}>
              <Text style={styles.text}>Debet: </Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={this.state.incomeType}
                  style={styles.pickerItem}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ incomeType: itemValue })
                  }>
                  {this.state.incomeAccounts.map((item, index) => (
                    <Picker.Item style={styles.pickerItem} label={item} value={item} key={index} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {this.state.revenue.map((item, index) => (
              <View key={index} style ={{
                width: 300,
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: "space-between",
                borderWidth: 1,
                padding: 10,
                borderRadius: 4,
              }}>
                <Text>{item.name}:  {item.q *-1}</Text>
                <TouchableOpacity style={styles.smallBtn} onPress={() => this.delete(index)}>
                  <Text style={styles.text}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.box}>
              <Text style={styles.text}>Credit: </Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={this.state.revenueName}
                  style={styles.pickerItem}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ revenueName: itemValue, revenueId: this.state.revenueAccounts[itemIndex]._id, revenuePrice: this.state.revenueAccounts[itemIndex].price })
                  }>
                  {this.state.revenueAccounts.map((item, index) => (
                    <Picker.Item style={styles.pickerItem} label={item.name} value={item.name} key={index} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah(pcs): </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={{
                    width: width /2,
                    height: 30,
                    borderRadius: 60,
                    paddingLeft: 20,
                    backgroundColor: '#ccebff',
                    marginRight: 10
                  }}
                  placeholder={"pcs.."}
                  placeholderTextColor={'grey'}
                  value={this.state.revenueAmount}
                  onChangeText={(revenueAmount) => this.setState({ revenueAmount })}
                />
                <TouchableOpacity style={styles.smallBtn} onPress={this.submitRevenue}>
                  <Text style={{color: '#484848', fontWeight: 'bold'}}>Input</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={this.submit}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Submit</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: width * 0.85,
    marginTop: 15,
    justifyContent: "space-between"
  },
  input: {
    width: width * 0.8,
    height: 30,
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: '#ccebff'
  },
  pickerItem: {
    marginTop: -10,
    marginLeft: -10
  },
  text: {
    margin: 5
  },
  btn: {
    width: width *0.8,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 25
  },
  smallBtn: {
    width: width / 4,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
