import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import axios from 'axios'

const { baseUrl, gradient } = require('../helpers/helpers')

class BalanceSheet extends React.Component {
    state = {
        kas: 0,
        piutang: 0,
        productList: [],
        product: 0,
        hutang: 0
    }

    async componentDidMount() {
        try {

            //DARI TRANSACTION LIST
            const { transactionList, otherTransactionList } = this.props.transactionData
            let { data } = await axios.get(`${baseUrl}/product`, {
                headers: {
                    token: await AsyncStorage.getItem("token")
                }
            })
            let productCount = 0
            data.map(e => {
                productCount += e.hpp * e.stock
            })
            let hutangCount = 0
            otherTransactionList.map(e => {
                if (e.kredit.length > 1) {
                    hutangCount += e.kredit[1].nominal
                }
            })
            let kasCount = 0
            let piutangCount = 0
            transactionList.map(e => {
                if (e.transactionType.accountType === 'Revenue') {
                    kasCount += e.debit.nominal
                } else if (e.debit.accountType === 'Piutang') {
                    piutangCount += e.debit.nominal
                }
            })

            //DARI KEUNTUNGAN SALES                                       

            //SUBMIT
            await this.setState({
                kas: kasCount,
                piutang: piutangCount,
                productList: data,
                product: productCount,
                hutang: hutangCount
            })
            console.log(this.state)
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { kas, piutang, product, productList, hutang } = this.state
        return (
            <View
                style={styles.container}
            >
                <Text>Products</Text>
                {
                    productList.map(e => {
                        return <Text>{e.name} ------ {e.hpp} * {e.stock}</Text>
                    })
                }
                <Text>Kas: {kas}</Text>
                <Text>Piutang: {piutang}</Text>
                <Text>________________________</Text>
                <Text>Total: {kas + piutang + product}</Text>
                <Text>Hutang: {hutang}</Text>
            </View>
        )
    }
}

const stateProps = (state) => ({
    transactionData: state.mainReducer.transactionData
})

export default connect(stateProps, null)(BalanceSheet)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})