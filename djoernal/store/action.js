export function setTransaction(transactions) {
    return {
        type: "SET_TRANSACTION",
        payload: transactions
    }
}