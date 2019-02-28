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
  AsyncStorage
} from 'react-native';
import Receipt from '../components/receipt'
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
      nominal: 10000
    }],
    itemName: '',
    itemAmount: '',
    totalAmount: 0
  }

  submit = async () => {
    let receiptImageUrl = await this.uploadImage()
    let transaksi = {
      transactionType: {
        accountType: "Pengeluaran",
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
      console.log(data);
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
    console.log(result.data.totalAmount);
    await this.setState({
      sourceAmount: String(result.data.totalAmount),
    })
    console.log(this.state)
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
      <Gradient gradient={gradient} style={{ width: width, height: height }}>
        <ScrollView>
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
            </View>
          </View>
        </ScrollView>
      </Gradient>
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