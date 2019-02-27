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
  ActivityIndicator,
  Alert
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Header } from 'react-navigation';
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')
 
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
          return totalHPP += ((element.q*-1) * element.product.hpp)
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

  state = {
    revenue: 0,
    expense: 0,
    profit: 0
  }

  render() {
    const chart_wh = 155
    const series = [this.state.expense,this.state.profit]
    const sliceColor = ['#F44336','#2196F3']
    return this.state.profit > 0 ? (
      <ScrollView>
        <View style={styles.containerWhite}>
          <StatusBar
            hidden={true}
          />
          <Text style={styles.title}>Profit Chart</Text>
          <View style={{
            flexDirection: 'row',
            padding: 15,
            margin: 10,
            borderWidth: 1,
            borderRadius: 20,
            width: width * 0.85
          }}>
            <View>
              <PieChart
                chart_wh={chart_wh}
                series={series}
                sliceColor={sliceColor}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={{paddingLeft: 5, fontSize: 12, marginBottom: 8}}>Revenue: {this.state.revenue}</Text>
              <View style= {styles. box}>
                <TouchableOpacity style={{backgroundColor: '#F44336', width: 10, height:10}}></TouchableOpacity>
                <Text style={{paddingLeft: 5, fontSize: 12}}>Expense: {this.state.expense}</Text>
              </View>
              <View style= {styles. box}>
                <TouchableOpacity style={{backgroundColor: '#2196F3', width: 10, height:10}}></TouchableOpacity>
                <Text style={{paddingLeft: 5, fontSize: 12}}>Profit: {this.state.profit}</Text>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>
    ) : <Text style={{
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        width: width * 0.8, 
        padding: 10,
        backgroundColor: 'white'
      }}>Anda belum memiliki data untuk diolah kedalam chart</Text>
  }
}

const styles = StyleSheet.create({
  containerWhite: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 10,
    width: width -20,
    borderRadius: 4,
    padding: 10
  },
  title: {
    fontSize: 23,
  },
  box: {
    width: width * 0.95,
    height: 15,
    flexDirection: 'row',
    margin: 5
  },
});
 
AppRegistry.registerComponent('Profit', () => Profit);