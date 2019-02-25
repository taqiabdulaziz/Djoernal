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
  ActivityIndicator,
  AsyncStorage,
  TouchableNativeFeedback,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
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

  static navigationOptions(props) {
    return {
      title: 'Expense',
      headerStyle: {
        elevation: 2,
        backgroundColor: "#3CB371"
      },
      headerLeft: (
        <Ionicons name="md-menu" size={28} style={{
          paddingLeft: 17,
          paddingTop: 17,
          paddingBottom: 17
        }} onPress={() => props.navigation.openDrawer()}></Ionicons>
      )
    }
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
    receiptUrl: null,
    itemList: [],
    itemName: '',
    itemAmount: '',
    totalAmount: 0,
    loading: false,
    modalVisible: false,
    modalVisibleItem: false,
    modalText: 'Uploading photos'
  }

  deleteItem = async (itemIndex) => {
    let newItemList = []
    this.state.itemList.forEach((item, index) => {
      if (index != itemIndex) {
        newItemList.push(item)
      }
    })
    await this.setState({
      itemList: newItemList
    })

  }

  submit = async () => {
    console.log(this.state)
    let receiptImageUrl = null
    if (!this.state.receiptUrl) {
      await this.setState({
        modalVisible: true
      })
      receiptImageUrl = await this.uploadImage()
    }

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
      receipt: receiptImageUrl || this.state.receiptUrl
    }

    if (this.state.diff > 0) {
      transaksi.kredit.push({
        accountType: "Utang",
        nominal: this.state.diff
      })
    }

    try {
      await this.setState({
        modalVisible: false
      })
      let { data } = await axios.post(`${baseUrl}/othertransaction`, transaksi, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      console.log(data)
      Alert.alert('Berhasil memasukkan data pengeluaran')
      await this.setState({
        itemList: [],
        sourceAmount: 0,
        expenseAmount: 0,
        receiptUrl: '',
        receipt: '',
        itemName: '',
        itemAmount: ''
      })
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
          this.setState({
            modalVisible: true
          })
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
      }, async () => {
        if (action) {
          await this.setState({
            modalVisibleItem: false
          })
          await this.setState({
            modalVisible: true
          })
          this.uploadImage(action)
        }
      })
    }
  }

  uploadImage = async (action) => {
    let imageUrl = await uploadImage(this.state.receipt)
    if (action) {
      await this.setState({
        receiptUrl: imageUrl
      })
      this.scan(imageUrl)
    } else {
      return imageUrl
    }
  }

  scan = async (url) => {
    console.log(url);
    await this.setState({
      modalText: "Generating items..."
    })
    let result = null
    try {
      result = await axios.post(`${baseUrl}/googlevision`, {
        url: url
      })
    } catch (error) {
      console.log(error)
    }
    let newData = []
    console.log(`di scan nih`);
    console.log(result.data);



    result.data.forEach((data) => {
      newData.push({
        name: data.name,
        nominal: Number(data.nominal)
      })
    })
    console.log(newData);

    await this.setState({
      modalVisible: false
    })
    await this.setState({
      itemList: newData
    })

    await this.setState({
      loading: false
    })

    let total = 0
    newData.forEach((data) => {
      total += Number(data.nominal)
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
        nominal: Number(itemAmount)
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
                  ></TextInput>
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
              marginTop: 4,
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
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ margin: 4 }}>
                          <TouchableHighlight style={{ width: 50, height: 50, backgroundColor: "#25d55f", elevation: 2, padding: 6, borderRadius: 4 }} onPress={() => this.imagePick()}>
                            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                              <Ionicons name="md-photos" size={20}></Ionicons>
                            </View>
                          </TouchableHighlight>
                          {/* <Button style={styles.btn} onPress={() => this.imagePick()} title="Receipt Image"></Button> */}
                        </View>
                        <View style={{ margin: 4 }}>
                          <TouchableHighlight style={{ width: 50, height: 50, backgroundColor: "#25d55f", elevation: 2, padding: 6, borderRadius: 4 }} onPress={() => this.capture()}>
                            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                              <Ionicons name="md-camera" size={20}></Ionicons>
                            </View>
                          </TouchableHighlight>
                          {/* <Button style={styles.btn} onPress={() => this.capture()} title="Capture Receipt"></Button> */}
                        </View>
                      </View>
                    ) : (
                      <View style={{ margin: 4 }}>
                        <Button style={styles.btn} onPress={() => this.setState({
                          receipt: '',
                          receiptUrl: null
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
                this.state.loading == false ?
                  this.state.itemList.map((data, index) => {
                    return (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 8 }} key={index}>
                        <Text>{data.name}</Text>
                        <Text>{data.amount}</Text>
                        <TouchableHighlight style={{
                          backgroundColor: "red",
                          borderRadius: 4,
                          elevation: 2,
                          padding: 4,
                        }}
                          onPress={() => this.deleteItem(index)}
                        >
                          <Text style={{ color: "white" }}>delete</Text>
                        </TouchableHighlight>
                      </View>
                    )
                  }) : (
                    <ActivityIndicator></ActivityIndicator>
                  )
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
                  <TextInput value={this.state.itemName} placeholder="Name" onChangeText={(text) => this.setState({ itemName: text })} style={{ flex: 1, padding: 4 }}></TextInput>
                </View>
                <View style={{
                  borderWidth: 0.25,
                  borderColor: "black",
                  borderRadius: 4,
                  flexDirection: "row",
                  margin: 4,
                  flex: 1
                }}>
                  <TextInput value={this.state.itemAmount} placeholder="Price" onChangeText={(text) => this.setState({ itemAmount: text })} style={{ flex: 1, padding: 4 }}></TextInput>
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
                    alignItems: "center",
                  }}
                    onPress={this.addItem}
                  >
                    <Text style={{ color: "white", width: 30, textAlign: "center" }}>+</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style={{ margin: 4 }}>
              <TouchableHighlight onPress={() => this.setState({
                modalVisibleItem: true
              })} style={{ width: "100%", height: 50, backgroundColor: "yellow", elevation: 2, padding: 6, borderRadius: 4 }}>
                <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                  <MaterialCommunityIcons name="clock-fast" size={20}></MaterialCommunityIcons>
                </View>
              </TouchableHighlight>
              <Button style={{ color: "green" }} onPress={() => this.imagePick(true)} title="Quick Mode"></Button>
            </View>
          </View>
        </Gradient>
        <Button title="SUBMIT" onPress={this.submit}></Button>

        <Modal
          animationType="fade"
          transparent={true}
          style={{
            height: 200,
          }}
          visible={this.state.modalVisibleItem}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.61)" }}>
            <View style={{
              backgroundColor: "white",
              width: "80%",
              height: "40%",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text>Quick Mode</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ margin: 4 }}>
                  <TouchableHighlight style={{ width: 50, height: 50, backgroundColor: "#25d55f", elevation: 2, padding: 6, borderRadius: 4 }} onPress={() => this.imagePick(true)}>
                    <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                      <Ionicons name="md-photos" size={20}></Ionicons>
                    </View>
                  </TouchableHighlight>
                  {/* <Button style={styles.btn} onPress={() => this.imagePick()} title="Receipt Image"></Button> */}
                </View>
                <View style={{ margin: 4 }}>
                  <TouchableHighlight style={{ width: 50, height: 50, backgroundColor: "#25d55f", elevation: 2, padding: 6, borderRadius: 4 }} onPress={() => this.capture(true)}>
                    <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                      <Ionicons name="md-camera" size={20}></Ionicons>
                    </View>
                  </TouchableHighlight>
                  {/* <Button style={styles.btn} onPress={() => this.capture()} title="Capture Receipt"></Button> */}
                </View>
                <View style={{
                  marginTop: 10
                }}>
                  <Button title="Close" onPress={() => this.setState({
                    modalVisibleItem: false
                  })}></Button>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          style={{
            height: 200,
          }}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
        }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.61)" }}>
            <View style={{
              backgroundColor: "white",
              width: "80%",
              height: "40%",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <ActivityIndicator></ActivityIndicator>
              <Text>{this.state.modalText}</Text>

            </View>
          </View>
        </Modal>
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