import { createStore, combineReducers, applyMiddleware } from 'redux'
import Thunk from 'redux-thunk'

import mainReducer from './reducers/mainReducer'

let rootReducer = combineReducers({
    mainReducer
})

const store = createStore(rootReducer, {}, applyMiddleware(Thunk))

export default store