import React, { Component } from 'react';
import { 
  AppRegistry, 
  StyleSheet, 
  ScrollView , 
  StatusBar, 
  Text, 
  View,
  KeyboardAvoidingView,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  Alert
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    margin: 10
  },
  box: {
    width: width * 0.95,
    height: 30,
    flexDirection: 'row',
    margin: 5
  },
});
 
export default class Profit extends Component {
  async componentDidMount() {
    try  {
      let {data} = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      let revenue= data.transactionList.filter(item => {
        return item.transactionType.accountType === "Revenue"
      })
      let expense = data.transactionList.filter(item => {
        return item.transactionType.accountType === "Expense"
      })
      let totalRevenue = 0
      let totalExpense = 0
      await revenue.map(item => {
        totalRevenue += item.debit.nominal
      })
      await expense.map(item => {
        totalExpense += item.debit.nominal
      })
      this.setState({ 
        revenue: totalRevenue,
        expense: totalExpense,
        profit: totalRevenue - totalExpense
      });
    } catch (err) {
      console.log(err.message)
    }
  }

  state = {
    revenue: 0,
    expense: 0,
    profit: 0
  }

  render() {
    const chart_wh = 250
    let chartData = [this.state.expense, 26000]
    const series = chartData
    const sliceColor = ['#F44336','#2196F3']
 
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
      <KeyboardAvoidingView
        keyboardVerticalOffset = {Header.HEIGHT + 20} // adjust the value here if you need more padding
        style = {styles.container}
        behavior = "padding" 
      >
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <StatusBar
            hidden={true}
          />
          <Text style={styles.title}>Income</Text>
          <View style= {styles. box}>
            <Text>Revenue:{this.state.revenue}</Text>
          </View>
          <View style= {styles. box}>
            <TouchableOpacity style={{backgroundColor: '#F44336', width: 10, height:10}}></TouchableOpacity>
            <Text>Expense:{this.state.expense}</Text>
          </View>
          <View style= {styles. box}>
            <TouchableOpacity style={{backgroundColor: '#2196F3', width: 10, height:10}}></TouchableOpacity>
            <Text>Profit:{this.state.profit}</Text>
          </View>
          <PieChart
            chart_wh={chart_wh}
            series={series}
            sliceColor={sliceColor}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      </Gradient>
    );
  }
}
 
AppRegistry.registerComponent('Profit', () => Profit);