const initialState = {
    items: null,
    purchase: null
}
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CART_ITEMS':
            return { ...state,items: action.payload }
        case 'SET_PURCHASE_DETAILS':
            return { ...state,purchase: action.payload }
        default:
            return state;
    }

}

export default cartReducer;