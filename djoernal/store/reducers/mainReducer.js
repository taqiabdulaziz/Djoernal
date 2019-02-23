const defaultState = {
    transactionData: []
}

export default function (state = defaultState, action) {
    const { type, payload } = action
    switch (type) {
        case "SET_TRANSACTION":
            console.log(true);
            
            return ({
                ...state,
                transactionData: payload
            })
            break;
    
        default:
            return state
            break;
    }
}