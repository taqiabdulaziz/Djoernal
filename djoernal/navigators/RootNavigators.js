import {
  createAppContainer, 
  createStackNavigator
} from 'react-navigation'

//screens
import Home from '../screens/Home'
import Revenue from '../screens/Revenue'
import Signin from '../screens/Signin'
import Signup from '../screens/Signup'
import Test from '../screens/Test'

const rootNav = createStackNavigator({
  Home: Home,
  Revenue: Revenue,
  Signin: Signin,
  Signup: Signup,
  Test: Test
}, {
  initialRouteName: 'Home'
})

export default createAppContainer(rootNav)