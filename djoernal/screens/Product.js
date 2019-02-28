import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Button,
  StatusBar,
  Platform
} from 'react-native';
import axios from 'axios'
import { Ionicons as Icon } from '@expo/vector-icons'
import Gradient from 'react-native-css-gradient'
import { Card } from 'react-native-elements'
import { Header } from 'react-navigation';
import { getAsyncIteratorMethod } from 'iterall';
const { baseUrl, gradient } = require('../helpers/helpers')
const { width, height } = Dimensions.get('window')

class Product extends React.Component {
  static navigationOptions(props) {
    return {
      title: 'List Produk / Jasa',
      headerStyle: {
        elevation: 2,
        backgroundColor: "#3CB371"
      },
      headerLeft: (
        <Icon name="md-menu" size={28} style={{
          margin: 17,
          color: "white"
        }} onPress={() => props.navigation.openDrawer()}></Icon>
      )
    }
  }

  async componentDidMount() {
    try {
      let { data } = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: data });
    } catch (err) {
      console.log(err.message)
    }
  }

  async get() {
    try {
      let { data } = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: data, loading: false, newName: '', newStock: '', newPrice: '', newHpp: '' });
    } catch (err) {
      console.log(err.message)
    }
  }

  state = {
    loading: true,
    list: [],
    newName: '',
    newStock: '',
    newPrice: '',
    newHpp: '',
    name: '',
    stock: 0,
    price: 0,
    hpp: 0,
    modalVisible: false,
  }
  
  formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    let result = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")
    return result
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  submit = async () => {
    let product = {
      name: this.state.newName,
      stock: this.state.newStock,
      price: this.state.newPrice,
      hpp: this.state.newHpp,
    }
    try {
      let token = await AsyncStorage.getItem("token")
      let kasAwal = await AsyncStorage.getItem("kas")
      let { data } = await axios.post(`${baseUrl}/product`, product, {
        headers: {
          token: token
        }
      })

      let kasUpdate = await axios.put(`${baseUrl}/users/kas`, {
        kas: Number(kasAwal) - (Number(this.state.newStock) * Number(this.state.newHpp))
      }, {
          headers: {
            token: token
          }
        })

      this.get()
      Alert.alert('Berhasil ditambahkan')
    } catch (error) {
      console.log(error)
    }
  }

  edit = async (e) => {
    let update = {
      name: this.state.name,
      stock: Number(this.state.stock),
      price: Number(this.state.price),
      hpp: Number(this.state.hpp)
    }
    try {
      let { data } = await axios.put(`${baseUrl}/product/${e}`, update, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.get()
      Alert.alert('Berhasil diupdate')
    } catch (error) {
      console.log(error)
    }
  }

  delete = async (e) => {
    try {
      let { data } = await axios.delete(`${baseUrl}/product/${e}`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.get()
      Alert.alert('Berhasil dihapus')
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={Header.HEIGHT + 20}
        style={styles.containerGrey}
        behavior="padding"
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
            marginTop: height / 6,
            marginLeft: width * 0.01,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
            <Gradient gradient='linear-gradient(to right, #868f96 0%, #596164 100%)' style={{ width: width * 0.9, height: height / 2, borderRadius: 20 }}>
              <TouchableHighlight
                style={styles.smallBtn}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>X</Text>
              </TouchableHighlight>
              <Text></Text>
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.text}>Nama:</Text>
                  <TextInput
                    style={styles.inputModal}
                    onChangeText={(name) => this.setState({ name: name })}
                    value={this.state.name}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.text}>Stock:</Text>
                  <TextInput
                    style={styles.inputModal}
                    onChangeText={(stock) => this.setState({ stock: stock })}
                    value={String(this.state.stock)}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.text}>Harga:</Text>
                  <TextInput
                    style={styles.inputModal}
                    onChangeText={(price) => this.setState({ price: price })}
                    value={String(this.state.price)}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.text}>HPP:</Text>
                  <TextInput
                    style={styles.inputModal}
                    onChangeText={(hpp) => this.setState({ hpp: hpp })}
                    value={String(this.state.hpp)}
                  />
                </View>
                <Text></Text>
                <TouchableHighlight
                  style={{
                    width: width *0.8,
                    height: 40,
                    borderRadius: 25,
                    backgroundColor: '#009efd',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.edit(this.state.id);
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Submit</Text>
                </TouchableHighlight>
              </View>
            </Gradient>
          </View>
        </Modal>
        <ScrollView>
          <View style={styles.containerGrey}>
            <View style={styles.containerWhite}>
              <View style={styles.box}>
                <Text style={styles.text}>Nama: </Text>
                <TextInput
                  style={styles.input}
                  placeholder={"nama"}
                  placeholderTextColor={'grey'}
                  value={this.state.newName}
                  onChangeText={(newName) => this.setState({ newName })}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>Stok: </Text>
                <TextInput
                  style={styles.input}
                  placeholder={"pcs.."}
                  placeholderTextColor={'grey'}
                  type='numeric'
                  value={this.state.newStock}
                  onChangeText={(newStock) => this.setState({ newStock })}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>Harga: </Text>
                <TextInput
                  style={styles.input}
                  placeholder={"IDR"}
                  placeholderTextColor={'grey'}
                  type='numeric'
                  value={this.state.newPrice}
                  onChangeText={(newPrice) => this.setState({ newPrice })}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>HPP: </Text>
                <TextInput
                  style={styles.input}
                  placeholder={"IDR"}
                  placeholderTextColor={'grey'}
                  value={this.state.newHpp}
                  onChangeText={(newHpp) => this.setState({ newHpp })}
                />
              </View>
              <View style={styles.box}>
              <TouchableOpacity style={{
                width: width *0.8,
                height: 45,
                borderRadius: 25,
                backgroundColor: '#009efd',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 10,
                marginLeft: 25
              }} onPress={this.submit}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Submit</Text>
              </TouchableOpacity>
            </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {this.state.list.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', textDecorationLine: 'underline' }}>{item.name}</Text>
                  <Text>Stock: {item.stock}</Text>
                  <Text>Price: {this.formatMoney(item.price)}</Text>
                  <Text>HPP: {this.formatMoney(item.hpp)}</Text>
                  <View style={styles.box}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ id: item._id, name: item.name, stock: item.stock, price: item.price, hpp: item.hpp });
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                      style={{
                        width: width / 3,
                        height: 30,
                        borderRadius: 25,
                        backgroundColor: '#009efd',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10
                      }}
                    >
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { this.delete(item._id) }}
                      style={{
                        width: width / 3,
                        height: 30,
                        borderRadius: 25,
                        backgroundColor: '#A80000',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10
                      }}
                    >
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Product;

const styles = StyleSheet.create({
  containerGrey: {
    flex: 1,
    backgroundColor: '#e1e2e1',
  },
  containerWhite: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: 14,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 4,
    paddingTop: 10
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  card: {
    flex: 1,
    width: width * 0.95,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10
  },
  input: {
    width: width * 0.7,
    height: 30,
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: '#ccebff',
    marginRight: 10,
    marginTop: 5,
  },
  inputModal: {
    width: width * 0.6,
    height: 30,
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: '#ccebff',
    margin: 5,
    marginRight: 10,
  },
  pickerItem: {
    marginTop: -10,
    marginLeft: -10
  },
  text: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 20
  },
  btn: {
    width: width *0.9,
    height: 35,
    borderRadius: 25,
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallBtn: {
    width: width / 6,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: width *0.7
  },
});
