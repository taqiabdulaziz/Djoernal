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
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native'

var { baseUrl, gradient } = require(`../helpers/helpers`)
import { Header } from 'react-navigation';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default class signup extends Component {
  static navigationOptions = {
    title: 'Signup',
    headerStyle: {
      backgroundColor: "#25d55f",
      elevation: 0
    }
  }

  state = {
    showPass: true,
    press: false,
    email: '',
    password: '',
    company: '',
    phone: '',
    kas: ''
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  signup = () => {
    console.log(this.state)
    axios.post(`${baseUrl}/users`, {
      email: this.state.email,
      password: this.state.password,
      company: this.state.company,
      phone: this.state.phone,
      kas: this.state.kas
    }).then((result) => {
      console.log(result.data);

      this.props.navigation.navigate("Signin", result.data)

    }).catch((err) => {
      console.log(err.message);

    });
  }

  render() {
    const { navigation: { navigate } } = this.props
    return (
      <Gradient gradient={gradient} style={{ width: width, height: height }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Header.HEIGHT - 60} // adjust the value here if you need more padding
          style={styles.container}
          behavior="padding"
        >
          <ScrollView>
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
                <Icon name={'office-building'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                  style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={"Company"}
                  placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                  onChangeText={(company) => this.setState({ company })}
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons name="attach-money" size={28} color={'rgba(255, 255, 255, 0.7)'}
                  style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={"Modal Awal"}
                  placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                  onChangeText={(kas) => this.setState({ kas })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name={'phone'} size={28} color={'rgba(255, 255, 255, 0.7)'}
                  style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={"Phone"}
                  placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                  onChangeText={(phone) => this.setState({ phone })}
                />
              </View>
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.btnLogin} onPress={this.signup}>
                  <Text style={styles.text}>Signup </Text>
                </TouchableOpacity>
              </View>

              <Text style={{ marginTop: 20 }}>already have account?</Text>
              <Text style={{ fontWeight: "bold" }} onPress={() => navigate("Signin")}> Signin</Text>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Gradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    margin: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width: width - 55,
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
    width: width * 0.9,
    height: height / 5.75
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
    backgroundColor: '#006699',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
  text: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center'
  }
});