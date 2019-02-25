import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TouchableNativeFeedback
} from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    padding: 10,
    backgroundColor: "white",
    elevation: 4,
    flexDirection: "row",
    borderRadius: 4
  },
  detail: {
    flex: 2
  },
  status: {
    flex: 1,
    flexDirection: "row-reverse"
  }
})

class MyTransaction extends React.Component {
  render() {
    const { transactionData } = this.props
    console.log(transactionData);
    
    return (
      <View>
        <Text>ini transaction</Text>
      </View>
    )
  }

  componentDidMount = () => {
    console.log(this.props);

  }
}

const mapStateToProps = (state) => ({
  transactionData: state.mainReducer.transactionData
})

export default connect(mapStateToProps, null)(MyTransaction)