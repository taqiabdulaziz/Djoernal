import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import {Header, Left, Right, Icon } from 'native-base'
const {width, height} = Dimensions.get('window')

class Home extends React.Component {
  static navigationOptions = {
    headerStyle: {
      elevation: 0,
      backgroundColor: "#25d55f"
    },
    drawerIcon: ({tintColor}) => (
      <Icon name="home" style={{fontSize: 24, color: tintColor}} />
    )
  }
  render() {
    return (
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
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25d55f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  text: {
    color: 'white',
    fontSize: 18,
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
