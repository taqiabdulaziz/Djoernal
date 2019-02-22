import {
  createAppContainer, 
  createStackNavigator
} from 'react-navigation'

//screens
import Home from '../screens/Home'
import Signup from '../screens/Signup'
import Signin from '../screens/Signin'
import Revenue from '../screens/Revenue'
import Expense from '../screens/Expense'

const rootNav = createStackNavigator({
  Home: Home,
  Signin: Signin,
  Signup: Signup,
  Revenue: Revenue,
  Expense: Expense
}, {
  initialRouteName: 'Home'
})

export default createAppContainer(rootNav)