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
import Product from '../screens/Product'
import Home from '../screens/Home'
import Transaction from '../screens/MyTransaction/MyTransaction'
import RevenueTransaction from '../screens/RevenueTransaction'
import Detail from '../screens/MyTransaction/Detail'
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
  },
  Detail: {
    screen: Detail
  }
})

const RevTransNav = createStackNavigator({
  RevenueTransaction: {
    screen: RevenueTransaction
  }
})

const ProductNav = createStackNavigator({
  Product: {
    screen: Product
  }
})

const TestGoogleVision = createStackNavigator({
  Test: {
    screen: Test
  }
})

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeNav
  },
  Pendapatan: {
    screen: RevenueNav
  },
  Pengeluaran: {
    screen: ExpenseNav
  },
  Transaksi: {
    screen: MyTransaction
  },
  Produk: {
    screen: Product
  },
  TestGoogleVision: {
    screen: TestGoogleVision
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
  initialRouteName: 'Signin'
})

export default createAppContainer(rootNav)