import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Platform
} from 'react-native';
import {Header, Left, Right, Icon } from 'native-base'

class Home extends React.Component {

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name="home" style={{fontSize: 24, color: tintColor}} />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>Home</Text>
        </View>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
