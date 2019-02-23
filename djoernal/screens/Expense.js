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
  Platform,
  AsyncStorage
} from 'react-native';
import Receipt from '../components/receipt'
import axios from 'axios'
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
    expenseType: 'Harga pokok penjualan',
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
      "Harga pokok penjualan",
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
    receipt: ''
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

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={() => this.imagePick()} title="Receipt Image"></Button>
        <Button onPress={() => this.capture()} title="Capture Receipt"></Button>
        <View style={styles.boxWrapper}>
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
        </View>
        <View style={styles.boxWrapper} >
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
          <View style={styles.box}>
            <Text style={styles.text}>Receipt: </Text>
            <Text style={styles.input}>
              {this.state.receipt}
            </Text>
          </View>
          {(this.state.diff > 0)
            ? (<View style={styles.box}>
              <Text style={styles.text}>Utang: </Text>
              <Text style={styles.input}>{(this.state.diff)} </Text>
            </View>)
            : <Text></Text>}
          <TouchableOpacity style={styles.btn} onPress={this.submit}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity>
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
    justifyContent: 'flex-start',
    margin: 20
  },
  boxWrapper: {
    width: width,
    height: height / 4
  },
  box: {
    flex: 1,
    margin: 4,
    width: width * 0.95,
    height: 5,
    flexDirection: 'row'
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