import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Picker,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import Gradient from 'react-native-css-gradient'
const {gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Revenue extends React.Component {
  static navigationOptions = {
    title: 'Pendapatan'
  }

  state = {
    incomeType: '',
    incomeAmount: 0,
    incomeAccounts: [
      "Kas",
      "Piutang"
    ],
    revenue: [],
    revenueType: '',
    revenueAmount: 0,
    revenueAccounts: [
      "Mie Goreng",
      "Mie Kuah",
      "Roti Bakar",
      "Jus jeruk"
    ]
  }

  submitRevenue = () => {
    this.setState({ revenue: [...this.state.revenue, {type: this.state.revenueType, amount: this.state.revenueAmount}] }) 
  }

  submit = () => {
    console.log("this is submit")
  }
  render() {
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
        <View style={styles.container}>
          <View style= {styles.boxWrapper} >
            <View style={styles.box}>
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
                placeholder={"Rp..."}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(incomeAmount) => this.setState({ incomeAmount })}
              />
            </View>
          </View>
          <View style={styles.boxWrapper}>
            {this.state.revenue.map((item, index )=> (
              <View key={index}>
                <Text>{item.type}:{item.amount}</Text>
              </View>
            ))}
            <View style={styles.box}>
              <Text style={styles.text}>Credit: </Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={this.state.revenueType}
                  style={styles.pickerItem} 
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({revenueType: itemValue})
                  }>
                  {this.state.revenueAccounts.map((item, index)=> (
                    <Picker.Item label={item} value={item} key={index} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah: </Text>
              <TextInput
                style={styles.input}
                placeholder={"Rp..."}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(revenueAmount) => this.setState({ revenueAmount })}
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
    width: width/2,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
});
