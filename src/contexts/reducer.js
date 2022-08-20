export const initialState = {
  userAddress: "",
  userLogedIn: false,
  chainId: 0
}

export const actionTypes = {
  SET_USER_ADDRESS: "SET_USER_ADDRESS",
  SET_USER_LOGED_IN: "SET_USER_LOGED_IN",
  SET_CHAIN_ID: "SET_CHAIN_ID"
}

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_ADDRESS:
      return {
        ...state,
        userAddress: action.userAddress
      }
    case actionTypes.SET_USER_LOGED_IN:
      return {
        ...state,
        userLogedIn: action.userLogedIn
      }
    case actionTypes.SET_CHAIN_ID:
      return {
        ...state,
        chainId: action.chainId
      }
    default:
      return state
  }
}

export default reducer
