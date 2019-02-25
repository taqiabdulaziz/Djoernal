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
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Transaction extends React.Component {
  static navigationOptions = {
    title: 'Transaksi Penjualan'
  }

  async componentDidMount() {
    try  {
      let {data} = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: data.transactionList });
    } catch (err) {
      console.log(err.message)
    }
  }

  state = {
    list: []
  }

  render() {
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
      <KeyboardAvoidingView
        keyboardVerticalOffset = {Header.HEIGHT + 20} // adjust the value here if you need more padding
        style = {styles.container}
        behavior = "padding" 
      >
        <View style={styles.container}>
          <ScrollView>
            <Text>{JSON.stringify(this.state.list)}</Text>
          {/* {this.state.list.map((item, index )=> (
              <View key={index}>
                <View style={styles.box}>
                  <Text>{JSON.stringify(item)}</Text>
                </View>
              </View>
            ))} */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      </Gradient>
    );
  }
}

export default Transaction;

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
    height: height/4,
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
    width: width *0.7,
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
