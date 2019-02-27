import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
  DrawerItems,
  withNavigation
} from 'react-navigation'
import React from 'react'
import { 
  View, 
  SafeAreaView, 
  Button, 
  TouchableOpacity,
  Text,
} from 'react-native'
import { Ionicons as Icon } from '@expo/vector-icons'

//screens
import Register from '../screens/Register'
import Signup from '../screens/Signup'
import Test from '../screens/Test'
import Signin from '../screens/Signin'
import Revenue from '../screens/Revenue'
import Expense from '../screens/Expense'
import Product from '../screens/Product'
import Home from '../screens/Home'
import OtherTransaction from '../screens/MyTransaction/OtherTransaction/MyOther'
import RevenueTransaction from '../screens/RevenueTransaction'
import LogoutScreen from '../screens/Logout'
import BalanceSheet from '../screens/BalanceSheet'
import { Drawer } from 'native-base';

const HomeNav = createStackNavigator({
  Home: {
    screen: Home
  },
}, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
    }
  })

const RevenueNav = createStackNavigator({
  Revenue: {
    screen: Revenue
  },
}, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
    }
  })

const ExpenseNav = createStackNavigator({
  Expense: {
    screen: Expense
  }
}, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
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
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: "#3CB371",
        elevation: 0,
        color: 'white'
      },
      title: "Transactions",
      headerLeft: (
        <Icon name="md-menu" size={28} style={{
          margin: 17,
          color: 'white'
        }} onPress={() => navigation.openDrawer()} />
      )
    }),
    tabBarOptions: {
      style: {
        backgroundColor: "#3CB371"
      }
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
}, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
  }
})

const BalanceSheetNav = createStackNavigator({
  BalanceSheet: {
    screen: BalanceSheet
  }
}, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
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
  BalanceSheet: {
    screen: BalanceSheetNav
  },
  Produk: {
    screen: ProductNav
  },
}, {
  contentComponent:(props) => (
    <View style={{flex:1, backgroundColor: '#e1e2e1'}}>
      <SafeAreaView forceInset={{ top: 'never', horizontal: 'never' }}>
        <DrawerItems {...props} />
        {/* <Button title="Logout" onPress={() => props.navigation.navigate('Signin')}/> */}
        <TouchableOpacity style={{width: 220, height: 40, backgroundColor:'#009efd', marginLeft: 30, borderRadius:20, justifyContent: 'center', alignItems: 'center'}} onPress={() => props.navigation.navigate('Signin')}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
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