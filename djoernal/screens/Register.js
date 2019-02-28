import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Header, Left, Right, Icon } from 'native-base'
import Gradient from 'react-native-css-gradient'
const {gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Home extends React.Component {
  static navigationOptions = {
    headerStyle: {
      elevation: 0,
      backgroundColor: "white"
    },
    drawerIcon: ({tintColor}) => (
      <Icon name="home" style={{fontSize: 24, color: tintColor}} />
    )
  }
  render() {
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
        <View style={styles.container}>
          <Image source={require(`../assets/logo_transparent.png`)} style={{width: "50%", height: "50%"}}></Image>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('Signup')}
          >
            <Text style={styles.text}>
              Signup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('Signin')}
          >
            <Text style={styles.text}>
              Signin
            </Text>
          </TouchableOpacity>
        </View>
      </Gradient>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  btn: {
    width: width - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25,
    color: 'white'
  },
});
