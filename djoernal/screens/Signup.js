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
  TouchableOpacity
} from 'react-native'

var {baseUrl} = require(`../helpers/helpers`)
import axios from 'axios'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export default class signup extends Component {
  static navigationOptions = {
    title: 'Signup'
  }

  state = {
    showPass: true,
    press: false,
    email: '',
    password: '',
    company: '',
    phone: '',
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
      phone: this.state.phone
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
      <ImageBackground source={{ uri: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-548354.png' }} style={styles.container}>
        {/* <View style={styles.logoContainer}>
          <Image source={{ uri: 'http://www.proant.se/files/user/Bilder/Reference%20designs/Sphero/sphero_logo_full.png' }} style={styles.logo} />
        </View> */}
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
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  inputContainer: {
    margin: 7,
    justifyContent: "center",
    alignItems: "center"
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
    fontFamily: "serif"
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
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#432577',
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