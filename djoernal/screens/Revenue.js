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
  StatusBar,
  Platform
} from 'react-native';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Revenue extends React.Component {
  static navigationOptions = {
    title: 'Pendapatan'
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
    incomeAmount: 0,
    incomeAccounts: [
      "Kas",
      "Piutang"
    ],
    revenue: [],
    revenueName: '',
    revenueId: '5c7138e91c52404514e43b8d',
    revenueAmount: 0,
    revenueAccounts: []
  }

  submitRevenue = () => {
    this.setState({ revenue: [...this.state.revenue, {id: this.state.revenueId, name: this.state.revenueName, q: this.state.revenueAmount}] }) 
  }

  submit = async() => {
    let transaction = {
      transactionType: {
        accountType: 'Revenue',
        subAccount: this.state.incomeType
      },
      debit: {
        accountType: this.state.incomeType,
        nominal: this.state.incomeAmount
      },
      kredit: this.state.revenue
    }
    try {
      let {data} = axios.post(`${baseUrl}/transaction`, transaction, { 
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      console.log("sudah di add ke database", data)
    } catch (error){
      console.log(error)
    }
  }
  delete = (index) => {
    var array = [...this.state.revenue]; 
    array.splice(index, 1);
    this.setState({revenue: array});
  }

  render() {
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
        <View style={styles.container}>
          <View style= {styles.boxWrapper} >
            <View style={styles.box}>
              <Text>{this.state.incomeType}:{this.state.incomeAmount}</Text>
              <Text style={styles.text}>Debet: </Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={this.state.incomeType}
                  style={styles.pickerItem} 
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({incomeType: itemValue})
                  }>
                  {this.state.incomeAccounts.map((item, index)=> (
                    <Picker.Item style={styles.pickerItem} label={item} value={item} key={index} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah: </Text>
              <TextInput
                style={styles.input}
                placeholder={"Jumlah"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(incomeAmount) => this.setState({ incomeAmount })}
              />
            </View>
          </View>
          <View style={styles.boxWrapper}>
            {this.state.revenue.map((item, index )=> (
              <View key={index}>
                <Text>{item.name}:{item.q * -1}</Text>
                <TouchableOpacity style={styles.smallBtn} onPress={()=> this.delete(index)}>
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
                    this.setState({revenueName: itemValue, revenueId: this.state.revenueAccounts[itemIndex]._id})
                  }>
                  {this.state.revenueAccounts.map((item, index)=> (
                    <Picker.Item style={styles.pickerItem} label={item.name} value={item.name} key={index} />
                  ))}
                </Picker> 
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah(pcs): </Text>
              <TextInput ref={input => { this.textInput = input }} />
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
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.submit}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity> 
        </View>
      </Gradient>
    );
  }
}

export default Revenue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 20,
    fontFamily: 'serif',
    fontSize: 14,
  },
  boxWrapper: {
    width: width,
    height: height/4,
    alignItems: 'flex-start',
    margin: 5,
  },
  box: {
    flex: 1,
    width: width * 0.95,
    flexDirection: 'row'
  },
  input: {
    flex:2.5, 
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
    flex: 1, 
    paddingTop: 5, 
    paddingLeft: 20
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
    width: width/4,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
});
