import {
  createAppContainer, 
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator
} from 'react-navigation'

//screens
import Register from '../screens/Register'
import Signup from '../screens/Signup'
import Test from '../screens/Test'
import Signin from '../screens/Signin'
import Revenue from '../screens/Revenue'
import Expense from '../screens/Expense'
import Home from '../screens/Home'
import Transaction from '../screens/MyTransaction/MyTransaction'
import { Drawer } from 'native-base';

const HomeNav = createStackNavigator({
  Home: {
    screen: Home
  },
})

const RevenueNav = createStackNavigator({
  Revenue: {
    screen: Revenue
  },
})

const ExpenseNav = createStackNavigator({
  Expense: {
    screen: Expense
  }
})

const MyTransaction = createStackNavigator({
  MyTransaction: {
    screen: Transaction
  }
})

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeNav
  },
  Penjualan: {
    screen: RevenueNav
  },
  Pengeluaran: {
    screen: ExpenseNav
  },
  Transaksi: {
    screen: MyTransaction
  }
})

const rootNav = createSwitchNavigator({
  MainNavigation: {
    screen: DrawerNavigator
  },
  Register: Register,
  Signin: Signin,
  Signup: Signup,
  Test: Test,
}, {
    initialRouteName: 'Register'
  
})

export default createAppContainer(rootNav)