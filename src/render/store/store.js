import { createStore } from 'redux'
import { appReducers } from './reducer'

let store = createStore(appReducers)
export default store
