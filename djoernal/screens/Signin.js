import React, { Component } from 'react'
import {
  View,
  Button,
  StyleSheet,
  Platform,
  Alert,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  AsyncStorage,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setTransaction } from '../store/action'
const { width, height } = Dimensions.get('window')
var { baseUrl } = require('../helpers/helpers')
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

class Signin extends Component {
  static navigationOptions = {
    title: 'Signin',
    headerStyle: {
      backgroundColor: "#25d55f",
      elevation: 0
    }
  }

  state = {
    showPass: true,
    press: false,
    email: 'T',
    password: 'T'
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  signin = async () => {
    let { setTransaction } = this.props
    try {
      var { data } = await axios.post(`${baseUrl}/users/login`, {
        email: this.state.email,
        password: this.state.password
      })

      var transactions = await axios.get(`${baseUrl}/users/${data._id}`)
      
      setTransaction(transactions.data.transactionList)
    
      await AsyncStorage.setItem("token", data.token)
      await AsyncStorage.setItem("id", data._id)

      this.props.navigation.navigate("MainNavigation")
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { navigation: { navigate } } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon name={'email'} size={28} color={'rgba(255, 255, 255, 0.7)'}
            style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={"Email"}
            placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
            onChangeText={(email) => this.setState({ email })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name={'lock'} size={28} color={'rgba(255, 255, 255, 0.7)'}
            style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={"Password"}
            secureTextEntry={this.state.showPass}
            placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
            onChangeText={(password) => this.setState({ password })}
          />
          <TouchableOpacity style={styles.btnEye}
            onPress={this.showPass.bind(this)}>
            <Icon name={this.state.press == false ? 'eye' : 'eye-off'}
              size={26} color={'rgba(255, 255, 255, 0.7)'} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.btnLogin} onPress={this.signin}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 20 }}>Dont have account?</Text>
        <Text style={{ fontWeight: "bold" }} onPress={() => navigate("Signup")}> Register</Text>
      </View>
    )
  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({ setTransaction }, dispatch)

export default connect(null, mapDispatchToProps)(Signin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: "100%",
    backgroundColor: "#25d55f",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    margin: 7,
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    margin: 20
  },
  logo: {
    width: WIDTH * 0.9,
    height: HEIGHT / 5.75
  },
  inputIcon: {
    position: 'absolute',
    top: 8,
    left: 37
  },
  btnEye: {
    position: 'absolute',
    top: 8,
    right: 37
  },
  btnLogin: {
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
  text: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center'
  }
});