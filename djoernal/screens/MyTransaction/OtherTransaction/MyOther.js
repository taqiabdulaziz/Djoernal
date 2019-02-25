import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  Button,
  AsyncStorage
} from 'react-native'
import { setTransaction } from '../../../store/action'
import { bindActionCreators } from 'redux'
import OtherTransactionList from '../../../components/otherTransactionList'
import axios from 'axios'
import {baseUrl} from '../../../helpers/helpers'

class MyOther extends React.Component {
  componentDidMount () {
  }

  static navigationOptions = {
    title: 'Expense',
    tabBarStyle: {
      backgroundColor: "white"
    }
}

  render() {
    const { transactionData } = this.props
    return (
      <View style={{margin: 8}}>
        <Button title="Sync Data" onPress={this.sync}></Button>
        <FlatList
          data={ transactionData.otherTransactionList }
          renderItem={ ({ item }) => <OtherTransactionList item={ item } /> }
          keyExtractor={ (item) => item._id }
        />
      </View>
    )
  }

  sync = async () => {
    let { setTransaction } = this.props
    try {
      
      var transactions = await axios.get(`${baseUrl}/users`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      
      setTransaction({
        transactionList: transactions.data.transactionList,
        otherTransactionList: transactions.data.otherTransactionList
      })
    } catch (error) {
      // this.props.navigation.navigate("MainNavigation")
      console.log(error);
    }
  }
}

const stateToProps = (state) => ({
  transactionData: state.mainReducer.transactionData
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ setTransaction }, dispatch)

export default connect(stateToProps, mapDispatchToProps)(MyOther)