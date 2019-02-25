import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableHighlight,
  SafeAreaView,
  Platform,
  Alert,
  AsyncStorage,
  TouchableNativeFeedback
} from 'react-native';
import Receipt from '../components/receipt'
import { Header } from 'react-navigation';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var { baseUrl, gradient } = require('../helpers/helpers')
const { baseUrl, imagePick, capture, uploadImage } = require(`../helpers/helpers`)
const { width, height } = Dimensions.get('window')

class Revenue extends React.Component {
  componentDidMount() {
    this.state.diff = this.state.sourceAmount - this.state.expenseAmount
  }

  static navigationOptions = {
    title: 'Expense'
  }

  state = {
    source: 'Kas',
    sourceAmount: 0,
    expenseType: 'Persediaan',
    expenseAmount: 0,
    diff: 0,
    sourceAccounts: [
      "Kas",
      "Utang"
    ],
    expenseAccounts: [
      "Abodemen",
      "Asuransi",
      "Biaya bank",
      "Biaya hukum",
      "Biaya pembersihan",
      "Biaya umum",
      "Bunga bank",
      "Depresiasi",
      "Entertainment",
      "Gaji karyawan",
      "Persediaan",
      "Iklan",
      "Kendaraan",
      "Konsultasi & akuntansi",
      "Listrik",
      "Pajak",
      "Pengeluaran kantor",
      "Pengiriman & kurir",
      "Perangkat kantor",
      "Perangkat komputer",
      "Perjalanan",
      "Printing & alat tulis",
      "Reparasi & perbaikan",
      "Sewa",
      "Telepon & internet",
    ],
    receipt: '',
    itemList: [{
      name: "Mie Goreng",
      amount: 10000
    }],
    itemName: '',
    itemAmount: '',
    totalAmount: 0
  }

  submit = async () => {
    let receiptImageUrl = await this.uploadImage()
    let transaksi = {
      transactionType: {
        accountType: "Expense",
        subAccount: this.state.expenseType
      },
      debit: {
        accountType: this.state.expenseType,
        nominal: this.state.expenseAmount
      },
      kredit: [{
        accountType: this.state.source,
        nominal: this.state.sourceAmount
      }],
      items: this.state.itemList,
      receipt: receiptImageUrl
    }

    if (this.state.diff != 0) {
      transaksi.kredit.push({
        accountType: "Utang",
        nominal: this.state.diff
      })
    }
    console.log(transaksi);

    try {
      let { data } = await axios.post(`${baseUrl}/othertransaction`, transaksi, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      Alert.alert('Berhasil memasukkan data pengeluaran')
      this.props.navigation.navigate('Expense') 
    } catch (error) {
      console.log(error);
    }
  }

  imagePick = async (action) => {
    let receiptPath = await imagePick()
    if (receiptPath) {
      this.setState({
        receipt: receiptPath
      }, () => {
        if (action) {
          this.uploadImage(action)
        }
      })
    }
  }

  capture = async (action) => {
    let receiptPath = await capture()
    if (receiptPath) {
      this.setState({
        receipt: receiptPath
      }, () => {
        console.log(this.state)
      })
    }
  }

  uploadImage = async (action) => {
    let imageUrl = await uploadImage(this.state.receipt)
    if (action) {
      this.scan(imageUrl)
    } else {
      return imageUrl
    }
  }

  scan = async (url) => {
    console.log(url);
    let result = await axios.post(`${baseUrl}/googlevision`, {
      url: url
    })
    await this.setState({
      itemList: result.data
    })
    let total = 0
    result.data.forEach((data) => {
      total += Number(data.amount)
    })
    console.log(total);
    total = String(total)
    await this.setState({
      sourceAmount: total,
      expenseAmount: total
    })
    

  }

  addItem = async () => {
    const { itemName, itemAmount, itemList } = this.state
    await this.setState({
      itemList: itemList.concat({
        name: itemName,
        amount: itemAmount
      })
    })
    await this.setState({
      itemName: '',
      itemAmount: ''
    })
  }

  render() {
    return (
      <ScrollView>
        <Gradient gradient={gradient} style={{ width: width, height: height }}>
          <View style={{ padding: 10 }}>
            <View style={{
              backgroundColor: "white",
              borderRadius: 4,
              elevation: 3,
              padding: 8
            }}>
              <View>
                <Picker
                  selectedValue={this.state.expenseType}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ expenseType: itemValue })
                  }>
                  {this.state.expenseAccounts.map((item, index) => (
                    <Picker.Item label={item} value={item} key={index} />
                  ))}
                </Picker>
                <View style={{
                  borderWidth: 0.25,
                  borderColor: "black",
                  borderRadius: 4
                }}>
                  <TextInput
                    style={{
                      padding: 8,
                    }}
                    placeholder={"IDR"}
                    value={this.state.expenseAmount}
                    placeholderTextColor="black"
                    onChangeText={(expenseAmount) => this.setState({ expenseAmount })}
                  />
                </View>
              </View>
            </View>
            <View style={{
              backgroundColor: "white",
              borderRadius: 4,
              elevation: 3,
              padding: 8,
              marginTop: 4
            }}>
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "bold"
                }}>Sumber Dana</Text>
                <Picker
                  selectedValue={this.state.source}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ source: itemValue })
                  }>
                  {this.state.sourceAccounts.map((item, index) => (
                    <Picker.Item label={item} value={item} key={index} />
                  ))}
                </Picker>
                <View style={{
                  borderWidth: 0.25,
                  borderColor: "black",
                  borderRadius: 4
                }}>
                  <TextInput
                    style={{
                      padding: 8
                    }}
                    placeholder={"IDR"}
                    value={this.state.sourceAmount}
                    placeholderTextColor="black"
                    onChangeText={(sourceAmount) => this.setState({ sourceAmount, diff: (sourceAmount - this.state.expenseAmount) * -1 })}
                  />
                </View>

                {
                  (this.state.diff > 0) ?
                    (
                      <View>
                        <Text style={{
                          margin: 8,
                          fontSize: 16,
                          fontWeight: "bold"
                        }}>Utang</Text>
                        <View style={{
                          borderWidth: 0.25,
                          borderColor: "red",
                          borderRadius: 4,
                          padding: 8
                        }}>
                          <Text style={{ color: "red" }}>{(this.state.diff)} </Text>
                        </View>
                      </View>
                    ) : (
                      <Text></Text>
                    )
                }
              </View>
            </View>
            <View style={{
              backgroundColor: "white",
              borderRadius: 4,
              elevation: 3,
              padding: 8,
              marginTop: 4
            }}>
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "bold"
                }}>Attachment</Text>
                <Text>{this.state.receipt}</Text>
                {
                  (this.state.receipt == '') ?
                    (
                      <View>
                        <View style={{ margin: 4 }}>
                          <Button style={styles.btn} onPress={() => this.imagePick()} title="Receipt Image"></Button>
                        </View>
                        <View style={{ margin: 4 }}>
                          <Button style={styles.btn} onPress={() => this.capture()} title="Capture Receipt"></Button>
                        </View>
                      </View>
                    ) : (
                      <View style={{ margin: 4 }}>
                        <Button style={styles.btn} onPress={() => this.setState({
                          receipt: ''
                        })} title="Delete"></Button>
                      </View>
                    )
                }
              </View>
            </View>
            <View style={{
              backgroundColor: "white",
              borderRadius: 4,
              elevation: 3,
              padding: 8,
              marginTop: 4
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold"
              }}>Item</Text>

              {
                this.state.itemList.map((data) => {
                  return (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 8 }}>
                      <Text>{data.name}</Text>
                      <Text>{data.amount}</Text>
                      <TouchableNativeFeedback>
                        <TouchableHighlight style={{
                          backgroundColor: "red",
                          borderRadius: 4,
                          elevation: 2,
                          padding: 4
                        }}>
                          <Text style={{ color: "white" }}>delete</Text>
                        </TouchableHighlight>
                      </TouchableNativeFeedback>
                    </View>
                  )
                })
              }
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <View style={{
                  borderWidth: 0.25,
                  borderColor: "black",
                  borderRadius: 4,
                  flexDirection: "row",
                  margin: 4,
                  flex: 1
                }}>
                  <TextInput placeholder="Name" style={{ flex: 1 }}></TextInput>
                </View>
                <View style={{
                  borderWidth: 0.25,
                  borderColor: "black",
                  borderRadius: 4,
                  flexDirection: "row",
                  margin: 4,
                  flex: 1
                }}>
                  <TextInput placeholder="Price" style={{ flex: 1 }}></TextInput>
                </View>
                <View style={{
                  flexDirection: "row-reverse",
                  flex: 1
                }}>
                  <TouchableHighlight style={{
                    backgroundColor: "green",
                    borderRadius: 4,
                    elevation: 2,
                    padding: 4,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <Text style={{ color: "white", width: 30, textAlign: "center" }}>+</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style={{ margin: 4 }}>
              <Button style={{ color: "green" }} onPress={() => this.imagePick(true)} title="Quick Mode"></Button>
            </View>
          </View>
        </Gradient>
      </ScrollView>
    );
  }
}

export default Revenue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'space-around',
  },
  boxWrapper: {
    width: width,
    height: height / 3
  },
  box: {
    flex: 1,
    margin: 4,
    width: width * 0.95,
    flexDirection: 'row',
    margin: 5
  },
  input: {
    flex: 2.5,
    height: 30,
    width: width,
    borderWidth: 1,
    paddingLeft: 10
  },
  text: {

  },
  btn: {
    borderRadius: 25,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    color: 'white'
  },
});