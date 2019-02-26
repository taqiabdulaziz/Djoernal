import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
  DrawerItems
} from 'react-navigation'
import React from 'react'
import { View, SafeAreaView, Button} from 'react-native'


//screens
import Register from '../screens/Register'
import Signup from '../screens/Signup'
import Test from '../screens/Test'
import Signin from '../screens/Signin'
import Revenue from '../screens/Revenue'
import Expense from '../screens/Expense'
import Product from '../screens/Product'
import Home from '../screens/Home'
import Transaction from '../screens/MyTransaction/Transaction/MyTransaction'
import OtherTransaction from '../screens/MyTransaction/OtherTransaction/MyOther'
import RevenueTransaction from '../screens/RevenueTransaction'
import OtherTransactionDtl from '../screens/MyTransaction/OtherTransaction/Detail'
import LogoutScreen from '../screens/Logout'
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

const TransactionList = createMaterialTopTabNavigator({
  Pendapatan: {
    screen: RevenueTransaction
  },
  PengeluaranList: {
    screen: OtherTransaction
  }
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#3CB371",
        elevation: 0
      },
      title: "Transactions"
    },
    tabBarOptions: {
      style: {
        backgroundColor: "#3CB371"
      }
    }
  })

const OtherTransactionDetail = createStackNavigator({
  OtherTransactionDtl: {
    screen: OtherTransactionDtl
  }
})

const Logout = createStackNavigator({
  Logout: {
    screen: LogoutScreen
  }
})

const MyTransaction = createStackNavigator({
  Transactions: {
    screen: TransactionList
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
  Logout: {
    screen: Logout
  },
  Pendapatan: {
    screen: Revenue
  },
  Pengeluaran: {
    screen: ExpenseNav
  },
  Transaksi: {
    screen: MyTransaction
  },
  Produk: {
    screen: ProductNav
  },
}, {
  contentComponent:(props) => (
    <View style={{flex:1}}>
      <SafeAreaView forceInset={{ top: 'never', horizontal: 'never' }}>
        <DrawerItems {...props} />
        <Button title="Logout" onPress={() => props.navigation.navigate('Signin')}/>
      </SafeAreaView>
    </View>
),
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