import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Picker,
  Dimensions,
  Platform
} from 'react-native';
const {width, height} = Dimensions.get('window')

class Revenue extends React.Component {
  static navigationOptions = {
    title: 'Revenue'
  }

  state = {
    type: 'Penjualan'
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.display}>
          <Text style={{flex: 1, paddingTop: 15}}>Type</Text>
          <Picker
            selectedValue={this.state.type}
            style={{flex:1, height: 50, width: width*0.7}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({type: itemValue})
            }>
            <Picker.Item label="Penjualan" value="Penjualan" />
            <Picker.Item label="Pendapatan lain-lain" value="Pendapatan lain-lain" />
          </Picker>
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
    justifyContent: 'center'
  },
  display: {
    width: width,
    height: height,
    flexDirection: 'row'
  }
});
