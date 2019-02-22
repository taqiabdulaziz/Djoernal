import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import {Provider} from 'react-redux'
import RootNavigator from './navigators/RootNavigators'

const {width} = Dimensions.get('window')
export default class App extends React.Component {
  render() {
    return (
      <RootNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
