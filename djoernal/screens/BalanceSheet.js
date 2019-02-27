import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Button
} from 'react-native'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler';
import { ref } from '../config/firebase'

const { baseUrl, gradient } = require('../helpers/helpers')

class BalanceSheet extends React.Component {
    state = {
        kas: 0,
        piutang: 0,
        productList: [],
        product: 0,
        totalAset: 0,
        hutang: 0,
        totalLiabilitas: 0,
        totalEkuitas: 0
    }

    static navigationOptions = () => {
        return {
            title: "Balance Sheet",
            headerStyle: {
                elevation: 2,
                backgroundColor: "#3CB371"
            },
        }
    }

    async componentDidMount() {
        this.getData()
    }

    getData = async () => {
        try {
            let ekuitas = 0
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
                    e.kredit.forEach(kredit => {
                        ekuitas += (kredit.price - kredit.hpp)
                    })
                } else if (e.debit.accountType === 'Piutang') {
                    piutangCount += e.debit.nominal
                }
            })

            //NGAMBIL CURRENT CASH USER                        
            let userData = await axios.get(`${baseUrl}/users`, {
                headers: {
                    token: await AsyncStorage.getItem("token")
                }
            })
            kasCount += userData.data.kas
            otherTransactionList.forEach((data) => {
                data.kredit.forEach((dataKredit) => {
                    kasCount -= dataKredit.nominal
                })
            })

            //SUBMIT
            await this.setState({
                kas: kasCount,
                piutang: piutangCount,
                productList: data,
                product: productCount,
                hutang: hutangCount,
                totalEkuitas: ekuitas,
                totalAset: (kasCount + piutangCount + productCount),
                totalLiabilitas: (this.state.hutang)
            })
            console.log(this.state)
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { kas, piutang, product, productList, hutang } = this.state
        return (
            <View>
                <ScrollView>
                    <View style={styles.accountWrapper}>
                        <Text style={styles.accountTitle}>Aset</Text>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={styles.accountTitle2}>Total Aset</Text>
                            <Text style={styles.accountTitle2}>{this.formatMoney(this.state.totalAset)}</Text>
                        </View>
                        {
                            Object.keys(this.state).map((key) => {
                                if (
                                    key == "kas" ||
                                    key == "piutang" ||
                                    key == "product") {
                                    let string = key
                                    let amount = this.state[key]
                                    if (amount > 0) {
                                        return (
                                            <View style={styles.account}>
                                                <Text style={styles.accountTitle}>{string.charAt(0).toUpperCase() + string.slice(1)}</Text>
                                                <Text style={styles.accountTitle}>{this.formatMoney(amount)}</Text>
                                            </View>
                                        )
                                    }
                                }
                            })
                        }
                    </View>
                    <View style={{
                        width: "100%",
                        borderWidth: 0.25,
                        borderColor: "black"
                    }}>
                    </View>
                    <View style={styles.accountWrapper}>
                        <Text style={styles.accountTitle}>Liabilitas</Text>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={styles.accountTitle2}>Total Liabilitas</Text>
                            <Text style={styles.accountTitle2}>{this.state.totalLiabilitas}</Text>
                        </View>
                        {
                            this.state.hutang > 0 &&
                            (
                                <View style={styles.account}>
                                    <Text style={styles.accountTitle}>Utang</Text>
                                    <Text style={styles.accountTitle}>{this.state.hutang}</Text>
                                </View>
                            )
                        }

                    </View>
                    <View style={styles.accountWrapper}>
                        <Text style={styles.accountTitle}>Ekutas</Text>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={styles.accountTitle2}>Total Ekuitas</Text>
                            <Text style={styles.accountTitle2}>{this.formatMoney((this.state.totalAset - this.state.totalLiabilitas))}</Text>
                        </View>

                    </View>
                    <Button title="COBA" onPress={() => this.generateCsv()}></Button>
                </ScrollView>
            </View>
        )
    }

    generateCsv() {
        console.log('generate csv');

        const rows = [
            ["name1", "city1", "some other info"],
            ["name2", "city2", "more info"]
        ]

        var csvContent = "dimitri"

        // rows.forEach(function (rowArray) {
        //     let row = rowArray.join(",");
        //     csvContent += row + "\r\n";
        // });

        const metadata = {
            contentType: 'text/csv'
        }

        ref.child('ayomanis.csv').putString(csvContent, 'raw', { contentType: 'text/csv' })
            .then(data => {
                console.log('data')
            })
            .catch(err => {
                console.log(err)
            })



    }

    formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;

        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
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
    },
    accountWrapper: {
        padding: 13
    },
    accountTitle: {
        fontSize: 16,
        color: "black",
        margin: 8
    },
    accountTitle2: {
        fontSize: 17,
        color: "black",
        margin: 8,
        fontWeight: "bold"
    },
    account: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})