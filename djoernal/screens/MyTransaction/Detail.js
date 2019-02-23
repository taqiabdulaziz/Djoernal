import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

class Detail extends React.Component {
    render() {
        const { transactionType, debit, kredit, receipt } = this.props.navigation.state.params.transaction
        return (
            <View style={styles.wrapper}>
                <View style={styles.detail}>
                    <Text style={styles.title}>Detail</Text>  
                    <View>
                        {
                            kredit.length != 1 || kredit[0].accountType == "Utang" ?
                            (<Text style={{color: "red"}}>Belum Lunas</Text>) :
                            (<Text style={{color: "green"}}>Lunas</Text>)
                        }
                        
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 10
    },
    detail: {
        backgroundColor: "white",
        borderRadius: 4,
        elevation: 2,
        padding: 10,
    },
    title: {
        fontSize: 17,
        marginBottom: 4,
        fontWeight: "bold"
    }
})

export default Detail