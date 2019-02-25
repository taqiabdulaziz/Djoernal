import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList
} from 'react-native'

import OtherTransactionList from '../../../components/otherTransactionList'

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
      <View>
        <FlatList
          data={ transactionData.otherTransactionList }
          renderItem={ ({ item }) => <OtherTransactionList item={ item } /> }
          keyExtractor={ (item) => item._id }
        />
      </View>
    )
  }
}

const stateToProps = (state) => ({
  transactionData: state.mainReducer.transactionData
})

export default connect(stateToProps, null)(MyOther)