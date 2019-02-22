import {
  createAppContainer, 
  createDrawerNavigator
} from 'react-navigation'

//screens
import Home from '../screens/Home'
import Revenue from '../screens/Revenue'
import Signin from '../screens/Signin'

const rootNav = createDrawerNavigator({
  Home: Home,
  Revenue: Revenue,
  Signin: Signin
}, {
  initialRouteName: 'Home'
})

export default createAppContainer(rootNav)