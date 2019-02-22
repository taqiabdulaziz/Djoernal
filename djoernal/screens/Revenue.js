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
const {width, height} = Dimensions.get('window')

class Revenue extends React.Component {
  static navigationOptions = {
    title: 'Revenue'
  }

  state = {
    incomeType: 'Penjualan',
    incomeAmount: 0,
    revenueType: 'Revenue',
    revenueAmount: 0,
    incomeAccounts: [
      "Penjualan",
      "Bunga bank",
      "Pendapatan lain-lain"
    ],
    revenueAccounts: [
      "Pendapatan",
    ]
  }

  submit = () => {
    console.log("this is submit")
  }
  render() {
    return (
      <View style={styles.container}>
        <View style= {styles.boxWrapper} >
          <View style={styles.box}>
            <Text style={styles.text}>Debet: </Text>
            <Picker
              selectedValue={this.state.incomeType}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({incomeType: itemValue})
              }>
              {this.state.incomeAccounts.map((item, index)=> (
                <Picker.Item label={item} value={item} key={index} />
              ))}
            </Picker>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Jumlah: </Text>
            <TextInput
              style={styles.input}
              placeholder={"IDR"}
              placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
              onChangeText={(incomeAmount) => this.setState({ incomeAmount, revenueAmount: incomeAmount })}
            />
          </View>
        </View>
        <View style={styles.boxWrapper}>
          <View style={styles.box}>
            <Text style={styles.text}>Credit: </Text>
            <Picker
              selectedValue={this.state.revenueType}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({revenueType: itemValue})
              }>
              {this.state.revenueAccounts.map((item, index)=> (
                <Picker.Item label={item} value={item} key={index} />
              ))}
            </Picker>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Revenue: </Text>
            <Text style={styles.input}>{this.state.revenueAmount}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.submit}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity> 
        </View>
      </View>
    );
  }
}

export default Revenue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'flex-start',
    margin: 20
  },
  boxWrapper: {
    width: width,
    height: height/5
  },
  box: {
    flex: 1,
    width: width * 0.95,
    height: 5,
    flexDirection: 'row'
  },
  input: {
    flex:2.5, 
    height: 30, 
    width: width,
    borderWidth: 1,
    paddingLeft: 10
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
    marginHorizontal: 25,
    color: 'white'
  },
});
