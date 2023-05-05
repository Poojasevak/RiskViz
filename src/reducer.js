const initialState = {
    locations: [],
    selectedDecade: ''
}
const mainReducer = (state=initialState, action) => {
    switch( action.type) {
        case 'SAVE_LOCATIONS':
            return { ...state, locations: action.payload };
        case 'SET_SELECTED_DECADE':
            return { ...state, selectedDecade: action.payload };
        default:
            return state;
    }
};
export default mainReducer;