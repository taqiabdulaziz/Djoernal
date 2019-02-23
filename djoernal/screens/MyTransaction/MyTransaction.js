import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TouchableNativeFeedback
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { baseUrl } from '../../helpers/helpers'

const styles = StyleSheet.create({
  card: {
    margin: 14,
    padding: 10,
    backgroundColor: "white",
    elevation: 4,
    flexDirection: "row"
  },
  detail: {
    flex: 1
  }
})

class MyTransaction extends React.Component {
  render() {
    const { transactionData } = this.props
    return (
      <View>
        {
          transactionData.map((transaction) => {
            const { transactionType, debit, kredit, receipt } = transaction
            return (
              <TouchableNativeFeedback>
                <View style={styles.card}>
                  <View style={styles.detail}>
                    <Text>{transactionType.accountType}</Text>
                    <Text>{transactionType.subAccount}</Text>
                    <Text>Rp {debit.nominal}</Text>
                  </View>
                  <View>

                  </View>
                </View>
              </TouchableNativeFeedback>
            )
          })
        }
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