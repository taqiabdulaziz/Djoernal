import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  View,
  KeyboardAvoidingView,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
const { baseUrl, gradient } = require('../helpers/helpers')
const { width, height } = Dimensions.get('window')

export default class Profit extends Component {
  async componentDidMount() {
    this.syncData()
  }

  state = {
    revenue: 0,
    expense: 0,
    profit: 0
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

  syncData = async () => {
    try {
      let { data } = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      let revenue = data.transactionList.filter(item => {
        return item.transactionType.accountType === "Revenue"
      })
      let expense = data.otherTransactionList.filter(item => {
        return item.transactionType.accountType === "Pengeluaran"
      })
      let totalRevenue = 0
      let totalHPP = 0
      let totalExpense = 0
      await revenue.map(item => {
        return totalRevenue += item.debit.nominal
      })
      await revenue.map(item => {
        return item.kredit.map(element => {
          return totalHPP += ((element.q * -1) * (element.product != null ? element.product.hpp : 0))
        })
      })
      await expense.map(item => {
        return totalExpense += item.debit.nominal
      })
      this.setState({
        revenue: totalRevenue,
        expense: totalExpense + totalHPP,
        profit: totalRevenue - (totalExpense + totalHPP)
      });
    } catch (err) {
      console.log(err.message)
    }
  }

  render() {
    const chart_wh = 155
    const series = [this.state.expense, this.state.profit]
    const sliceColor = ['#00c853', '#5efc82']
    return this.state.profit > 0 ? (
      <ScrollView>
        <View style={styles.containerWhite}>
          <StatusBar
            hidden={true}
          />
          <View style={{ justifyContent: "flex-start", flexDirection: "row", width: "100%" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Profit Chart</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            padding: 15,
            margin: 10,
            width: width * 0.9
          }}>
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
              <PieChart
                chart_wh={chart_wh}
                series={series}
                sliceColor={sliceColor}
              />
            </View>
            {/* <View style={{ marginLeft: 10 }}>
              <Text style={{ paddingLeft: 5, fontSize: 12 }}>Revenue: </Text>
              <Text style={{ marginBottom: 8 }}>Rp.{this.formatMoney(this.state.revenue)}</Text>
              <View style={styles.box}>
                <TouchableOpacity style={{ backgroundColor: '#00c853', width: 10, height: 10 }}></TouchableOpacity>
                <Text style={{ paddingLeft: 5, fontSize: 12 }}>Expense:</Text>
              </View>
              <Text>Rp. {this.formatMoney(this.state.expense)}</Text>
              <View style={styles.box}>
                <TouchableOpacity style={{ backgroundColor: '#5efc82', width: 10, height: 10 }}></TouchableOpacity>
                <Text style={{ paddingLeft: 5, fontSize: 12 }}>Profit: </Text>
              </View>
              <Text>Rp.{this.formatMoney(this.state.profit)}</Text>
            </View> */}
          </View>

        </View>

        <View style={{
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: "white",
          borderRadius: 4,
          elevation: 3,
          padding: 10
        }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Revenue</Text>
          <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.revenue)}</Text>
        </View>

        <View style={{
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: "white",
          borderRadius: 4,
          elevation: 3,
          flexDirection: "row"
        }}>
          <View style={{ backgroundColor: "#00c853", width: 50, height: "100%", borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
          </View>
          <View style={{ flexDirection: "column", padding: 10, }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Expenses</Text>
            <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.expense)}</Text>
          </View>
        </View>

        <View style={{
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: "white",
          borderRadius: 4,
          elevation: 3,
          flexDirection: "row"
        }}>
          <View style={{ backgroundColor: "#5efc82", width: 50, height: "100%", borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
          </View>
          <View style={{ flexDirection: "column", padding: 10, }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Profit</Text>
            <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.profit)}</Text>
          </View>
        </View>
        <View style={{ margin: 10 }}>
          <Button title="Sync" onPress={() => this.syncData()}></Button>
        </View>
      </ScrollView>
    ) : (
      <ScrollView>
      <View style={styles.containerWhite}>
        <StatusBar
          hidden={true}
        />
        <View style={{ justifyContent: "flex-start", flexDirection: "row", width: "100%" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Profit Chart</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          padding: 15,
          margin: 10,
          width: width * 0.9
        }}>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Text>Tidak ada data</Text>
          </View>
          {/* <View style={{ marginLeft: 10 }}>
            <Text style={{ paddingLeft: 5, fontSize: 12 }}>Revenue: </Text>
            <Text style={{ marginBottom: 8 }}>Rp.{this.formatMoney(this.state.revenue)}</Text>
            <View style={styles.box}>
              <TouchableOpacity style={{ backgroundColor: '#00c853', width: 10, height: 10 }}></TouchableOpacity>
              <Text style={{ paddingLeft: 5, fontSize: 12 }}>Expense:</Text>
            </View>
            <Text>Rp. {this.formatMoney(this.state.expense)}</Text>
            <View style={styles.box}>
              <TouchableOpacity style={{ backgroundColor: '#5efc82', width: 10, height: 10 }}></TouchableOpacity>
              <Text style={{ paddingLeft: 5, fontSize: 12 }}>Profit: </Text>
            </View>
            <Text>Rp.{this.formatMoney(this.state.profit)}</Text>
          </View> */}
        </View>

      </View>

      <View style={{
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "white",
        borderRadius: 4,
        elevation: 3,
        padding: 10
      }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Revenue</Text>
        <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.revenue)}</Text>
      </View>

      <View style={{
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "white",
        borderRadius: 4,
        elevation: 3,
        flexDirection: "row"
      }}>
        <View style={{ backgroundColor: "#00c853", width: 50, height: "100%", borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
        </View>
        <View style={{ flexDirection: "column", padding: 10, }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Expenses</Text>
          <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.expense)}</Text>
        </View>
      </View>

      <View style={{
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "white",
        borderRadius: 4,
        elevation: 3,
        flexDirection: "row"
      }}>
        <View style={{ backgroundColor: "#5efc82", width: 50, height: "100%", borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
        </View>
        <View style={{ flexDirection: "column", padding: 10, }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Profit</Text>
          <Text style={{ fontSize: 16 }}>Rp. {this.formatMoney(this.state.profit)}</Text>
        </View>
      </View>
      <View style={{ margin: 10 }}>
        <Button title="Sync" onPress={() => this.syncData()}></Button>
      </View>
    </ScrollView>
      )
  }
}

const styles = StyleSheet.create({
  containerWhite: {
    flex: 1,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 10,
    width: width - 20,
    borderRadius: 4,
    padding: 10
  },
  title: {
    fontSize: 23,
  },
  box: {
    width: width * 0.95,
    height: 17,
    flexDirection: 'row',
    paddingLeft: 5
  },
});

AppRegistry.registerComponent('Profit', () => Profit);