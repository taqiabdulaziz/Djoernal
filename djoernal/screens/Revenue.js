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

<<<<<<< HEAD
class Revenue extends React.Component {
  static navigationOptions(props) {
    return {
      title: 'Pendapatan',
      headerStyle: {
        elevation: 2,
        backgroundColor: "#3CB371"
      },
      headerLeft: (
        <Icon name="md-menu" size={28} style={{
          margin: 17
        }} onPress={() => props.navigation.openDrawer()}></Icon>
      )
    }
=======
export default class Revenue extends React.Component {
  static navigationOptions = {
    title: 'Pendapatan'
>>>>>>> benerin revenue
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

<<<<<<< HEAD
  submitRevenue = () => {
    this.setState({ revenue: [...this.state.revenue, { id: this.state.revenueId, name: this.state.revenueName, q: this.state.revenueAmount, price: this.state.revenuePrice }] })
=======
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
>>>>>>> benerin revenue
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
<<<<<<< HEAD
      this.props.navigation.navigate('Revenue')
      this.setState({ revenue: [] })
    } catch (error) {
=======
      this.props.navigation.navigate('Revenue') 
      this.setState({revenue: [], revenueAmount: ''})
    } catch (error){
>>>>>>> benerin revenue
      console.log(error)
    }
  }
  delete = (index) => {
    var array = [...this.state.revenue];
    array.splice(index, 1);
    this.setState({ revenue: array });
  }

  render() {
    const pickerItems = this.state.revenueAccounts.map((item, index) => {
      return (
        <Picker.Item key={index} label={item.name} value={item.name} />
      )
    })
    return (
      <Gradient gradient={gradient} style={{ width: width, height: height }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Header.HEIGHT + 20}
          style={styles.container}
          behavior="padding"
        >
          <View style={styles.container}>
            <ScrollView>
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
                <View key={index}>
                  <Text>{item.name}:{item.q * -1}</Text>
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
<<<<<<< HEAD
              <View style={styles.box}>
                <Text style={styles.text}>Jumlah(pcs): </Text>
                <TextInput
                  style={styles.input}
                  placeholder={"Jumlah"}
                  placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                  onChangeText={(revenueAmount) => this.setState({ revenueAmount: revenueAmount * -1 })}
                />
              </View>
              <View style={styles.box}>
                <TouchableOpacity style={styles.smallBtn} onPress={this.submitRevenue}>
                  <Text style={styles.text}>Input</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.btn} onPress={this.submit}>
                <Text style={styles.text}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
=======
            ))}
            <View style={styles.box}>
              <Text style={styles.text}>Credit: </Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={this.state.revenueName}
                  style={styles.pickerItem} 
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({revenueName: itemValue, revenueId: this.state.revenueAccounts[itemIndex]._id, revenuePrice: this.state.revenueAccounts[itemIndex].price})
                  }>
                  {pickerItems}
                </Picker> 
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah(pcs): </Text>
              <TextInput
                style={styles.input}
                placeholder={"Jumlah"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                value={String(this.state.revenueAmount)}
                onChangeText={(revenueAmount) => this.setState({ revenueAmount })}
              />
            </View>
            <View style={styles.box}>
              <TouchableOpacity style={styles.smallBtn} onPress={this.submitRevenue}>
                <Text style={styles.text}>Input</Text>
              </TouchableOpacity> 
            </View>
            <TouchableOpacity style={styles.btn} onPress={this.submit}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity> 
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
>>>>>>> benerin revenue
      </Gradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: 'serif',
    fontSize: 14,
    width: width,
    height: height
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
    width: width - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#3CB371',
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
