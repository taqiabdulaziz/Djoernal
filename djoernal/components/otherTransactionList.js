import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native'

export default class otherTransactionList extends Component {

  state = {
    modalVisibility: false,
    modalText: "wow"
  }

  render() {
    const { transactionType, debit, kredit, message, items, receipt, date } = this.props.item
    return (
      <View
        style={styles.container}
      >
        <TouchableNativeFeedback onPress={() => this.setState({
          modalVisibility: true
        })}>
          <View style={{
            backgroundColor: "white",
            elevation: 2,
            borderRadius: 4,
            padding: 10,
            flexDirection: "row",
          }}>
            <View style={{
              flex: 1
            }}>
              <Text>Rp. {debit.nominal}</Text>
              <Text>{debit.accountType}</Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}>
              {
                kredit.length == 2 || kredit[0].accountType == "Utang" ?
                  (
                    <Text style={{ color: "red" }}>Utang</Text>
                  ) : (
                    <Text style={{ color: "green" }}>Lunas</Text>
                  )
              }
            </View>
          </View>
        </TouchableNativeFeedback>
        {
          this.state.modalVisibility &&
          (
            <Modal
              animationType="fade"
              transparent={true}
              style={{
                height: 200,
              }}
              visible={this.state.modalVisibility}
              onRequestClose={() => console.log(`closed`)}
            >
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.61)" }}>
                <View style={{
                  backgroundColor: "white",
                  width: "80%",
                  borderRadius: 20,
                  padding: 10
                }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Items:</Text>
                    {
                      items.map((data, index) => {
                        return (
                          <View key={index} style={{justifyContent: "space-between", flexDirection: "row"}}>
                            <Text>- {data.name}</Text>
                            <Text>Rp. {data.nominal}</Text>
                          </View>
                        )
                      })
                    }
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Total:</Text>
                    <Text>Rp. {debit.nominal}</Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{fontSize: 17, fontWeight: "bold"}}>Tanggal:</Text>
                    <Text>{date}</Text>
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <Image
                      source={{ uri: receipt }}
                      style={{ width: 250, height: 300 }} />
                  </View>
                  <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Button title="close" onPress={() => this.setState({
                    modalVisibility: false
                  })}></Button>
                  </View>
                </View>
              </View>
            </Modal>
          )
        }
      </View>
    )
  }

  componentDidMount = () => {
    console.log(this.props)
    console.log(`test`);

  }

}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 120
  }
})
