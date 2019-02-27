import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Button,
    Linking,
    Dimensions
} from 'react-native'
import { FileSystem } from 'expo';
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler';
import { ref } from '../config/firebase'
import { setTransaction } from '../store/action'
import { bindActionCreators } from 'redux'

const { baseUrl, gradient } = require('../helpers/helpers')
const { width, height } = Dimensions.get('window')

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

    static navigationOptions = (props) => {
        return {
            title: "Balance Sheet",
            headerStyle: {
                elevation: 2,
                backgroundColor: "#3CB371"
            },
            headerLeft: (
                <Ionicons name="md-menu" size={28} style={{
                    paddingLeft: 17,
                    paddingTop: 17,
                    paddingBottom: 17,
                    color: "white"
                }} onPress={() => props.navigation.openDrawer()}></Ionicons>
            ),
            headerRight: (
                <Ionicons name="md-refresh" size={28} style={{
                    paddingRight: 17,
                    paddingTop: 17,
                    paddingBottom: 17,
                    color: "white"
                }} onPress={() => props.navigation.state.params.sync()}></Ionicons>
            )
        }
    }

    async componentDidMount() {
        this.props.navigation.setParams({ sync: this.getData })
        this.getData()
    }

    getData = async () => {
        try {
            let ekuitas = 0
            let userData = await axios.get(`${baseUrl}/users`, {
                headers: {
                    token: await AsyncStorage.getItem("token")
                }
            })

            let otherTransactionList = userData.data.otherTransactionList
            let transactionList = userData.data.transactionList
            //DARI TRANSACTION LIST
            // const { transactionList, otherTransactionList } = this.props.transactionData
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
                totalLiabilitas: hutangCount
            })
        } catch (err) {
            console.log(err)
        }
        console.log(`utank`);

        console.log(this.state.hutang)
    }

    generateCsv = async () => {

        let json = {
            ASET: {
                kas: this.state.kas,
                piutang: this.state.piutang,
                product: this.state.product
            },
            LIABILITAS: {
                utang: this.state.hutang
            },
            EKUITAS: {
                modal: (this.state.totalAset - this.state.totalLiabilitas)
            }
        }

        const rows = []
        let companyName = await AsyncStorage.getItem("company")
        rows.push([`Neraca ${companyName} per 1 feb - 31 maret`])

        for (const key in json) {
            let arr = [key]
            rows.push(arr)
            arr = []
            let total = 0
            for (const key2 in json[key]) {
                arr.push(key2)
                arr.push(`Rp. ${json[key][key2]}`)
                rows.push(arr)
                if (key2 == "modal") {
                    total += (Number(json[key][key2]) + json.LIABILITAS.utang)
                } else {
                    total += Number(json[key][key2])

                }
                arr = []
            }
            rows.push(["---------", `Rp. ${total}`])
            total = 0
            // rows.push(arr)
            arr = []
        }

        const name = await AsyncStorage.getItem("id")


        let { data } = await axios.post(`${baseUrl}/users/buffer`, {
            buffer: rows,
            name: `${name}.csv`
        })

        // FileSystem.downloadAsync(`${baseUrl}/${name}.csv`, FileSystem.documentDirectory + `${name}.csv`)
        //     .then((result) => {
        //         console.log(`berhasillll`);
        //         console.log(result);

        //     }).catch((err) => {
        //         console.log(err);

        //     });

        Linking.openURL(`${baseUrl}/${name}.csv`)

    }

    render() {
        const { kas, piutang, product, productList, hutang } = this.state
        return (
            <View>

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
                        <Text style={styles.accountTitle2}>{this.formatMoney(this.state.totalLiabilitas)}</Text>
                    </View>
                    {
                        this.state.hutang > 0 &&
                        (
                            <View style={styles.account}>
                                <Text style={styles.accountTitle}>Utang</Text>
                                <Text style={styles.accountTitle}>{this.formatMoney(this.state.hutang)}</Text>
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
                <View style={{
                    width: "100%",
                    borderWidth: 0.25,
                    borderColor: "black"
                }}>
                </View>

                <View style={styles.accountWrapper}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <Text style={styles.accountTitle2}>Total Liabilitas + Ekuitas</Text>
                        <Text style={styles.accountTitle2}>{this.formatMoney((this.state.totalAset - this.state.totalLiabilitas + this.state.totalLiabilitas))}</Text>
                    </View>

                </View>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "50%" }}>
                        <Button title="Import Data" onPress={() => this.generateCsv()}></Button>
                    </View>
                </View>
            </View>
        )
    }

    formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;

        let result = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")
        return result
    }
}

const stateProps = (state) => ({
    transactionData: state.mainReducer.transactionData
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ setTransaction }, dispatch)

export default connect(stateProps, mapDispatchToProps)(BalanceSheet)

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