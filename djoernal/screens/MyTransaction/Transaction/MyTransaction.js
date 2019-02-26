import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl
} from 'react-native'
import { setTransaction } from '../../../store/action'
import { bindActionCreators } from 'redux'
import OtherTransactionList from '../../../components/otherTransactionList'
import axios from 'axios'
import { baseUrl } from '../../../helpers/helpers'
import TransactionList from '../../../components/transactionList'

class MyTransaction extends React.Component {

  state = {
    refreshing: false
  }

  componentDidMount() {
    console.log(this.props.transactionData)
  }

  static navigationOptions = {
    title: 'Pengeluaran',
    tabBarStyle: {
      backgroundColor: "white"
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    sync().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const { transactionData } = this.props
    return (
      <View style={{ margin: 8 }}>
        <ScrollView refreshControl={
          <RefreshControl onRefresh={this._onRefresh} enabled={true}>
            <Button title="Sync Data" onPress={this.sync}></Button>
            <FlatList
              data={transactionData.transactionList}
              renderItem={({ item }) => <TransactionList item={item} />}
              keyExtractor={(item) => item._id}
            />
          </RefreshControl>
        }
          
        >

        </ScrollView>
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

export default connect(stateToProps, mapDispatchToProps)(MyTransaction)