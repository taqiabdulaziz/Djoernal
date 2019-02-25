import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

export default class otherTransactionList extends Component {
  render() {
    const { transactionType, debit, kredit, message, items, receipt, date } = this.props.item
    return (
      <View
        style={ styles.container }
      >
        <Text>Tipe Akun:{ transactionType.accountType }</Text>
        <Text>Sub Akun:{ transactionType.subAccount }</Text>
        <Text>Debit:</Text>
        <Text>Tipe Akun:{ debit.accountType }</Text>
        <Text>Nominal:{ debit.nominal }</Text>
        <Text>Kredit:</Text>
        <Text>Tipe Akun:{ kredit.accountType }</Text>
        <Text>Nominal:{ kredit.nominal }</Text>
        <Text>Message:{ message || '' }</Text>
        <Text>Item List:</Text>
        {
          items.map(e => {
            return (
              <View>
                <Text>Item Name: { e.name }</Text>
                <Text>Item Nominal: { e.nominal }</Text>
              </View>
            )
          })
        }
        <Text>Struk:</Text>
        <Image 
          style={ styles.image }
          source={{ uri: receipt }}
        />
        <Text>Date: { date }</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 5
  },
  image: {
    width: 50,
    height: 120
  }
})
