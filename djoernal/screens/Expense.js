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
      amount: 10000
    }],
    itemName: '',
    itemAmount: ''
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

  imagePick = async () => {
    let receiptPath = await imagePick()
    if (receiptPath) {
      this.setState({
        receipt: receiptPath
      }, () => {
        console.log(this.state)
      })
    }
  }

  capture = async () => {
    let receiptPath = await capture()
    if (receiptPath) {
      this.setState({
        receipt: receiptPath
      }, () => {
        console.log(this.state)
      })
    }
  }

  uploadImage = async () => {
    let imageUrl = await uploadImage(this.state.receipt)
    return imageUrl
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
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
        >
          <Button style={styles.btn} onPress={() => this.imagePick()} title="Receipt Image"></Button>
          <Button style={styles.btn} onPress={() => this.capture()} title="Capture Receipt"></Button>
          <ScrollView>
            <View style={styles.box}>
              <Text style={styles.text}>Pengeluaran: </Text>
              <Picker
                selectedValue={this.state.expenseType}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ expenseType: itemValue })
                }>
                {this.state.expenseAccounts.map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah: </Text>
              <TextInput
                style={styles.input}
                placeholder={"IDR"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(expenseAmount) => this.setState({ expenseAmount })}
              />
            </View>

            <View style={styles.box}>
              <Text style={styles.text}>Sumber Dana: </Text>
              <Picker
                selectedValue={this.state.source}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ source: itemValue })
                }>
                {this.state.sourceAccounts.map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Jumlah: </Text>
              <TextInput
                style={styles.input}
                placeholder={"IDR"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(sourceAmount) => this.setState({ sourceAmount, diff: (sourceAmount - this.state.expenseAmount) * -1 })}
              />
            </View>
            {(this.state.diff > 0)
              ? (<View style={styles.box}>
                <Text style={styles.text}>Utang: </Text>
                <Text style={styles.input}>{(this.state.diff)} </Text>
              </View>)
              : <Text></Text>}
            <View style={styles.box}>
              <Text style={styles.text}>Receipt: </Text>
              <Text style={styles.input}>
                {this.state.receipt}
              </Text>
            </View>
            <View style={styles.box}>
              <View style={{ flex: 1 }}>
                <Text>Items: </Text>
              </View>
              <View style={{ flex: 3 }}>
                {
                  this.state.itemList.map((item, index) => {
                    return (
                      <View key={index} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>{item.name}</Text>
                        <Text>{item.amount}</Text>
                      </View>
                    )
                  })
                }
              </View>
            </View>
            <View style={styles.box}>
              <View style={{ flex: 1 }}>
                <Text>ADD ITEM:</Text>
              </View>
              <View style={{ flex: 3 }}>
                <View style={styles.input}>
                  <TextInput placeholder={"item name"} onChangeText={(text) => this.setState({ itemName: text })} value={ this.state.itemName }></TextInput>
                </View>
                <View style={styles.input}>
                  <TextInput placeholder={"amount"} onChangeText={(text) => this.setState({ itemAmount: text })} keyboardType="number-pad" value={ this.state.itemAmount }></TextInput>
                </View>
                <Button 
                  title="Add Item"
                  onPress={ this.addItem }
                ></Button>
                <Button title="Scan"></Button>
              </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={this.submit}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAwareScrollView>
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