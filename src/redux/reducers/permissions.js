const initialState={
    camera:false
}


const permissionsReducer=(state=initialState,action)=>{
    switch (action.type) {
        case 'CAMERA_PERMISSION_GRANT':
            return{camera:true}
        case 'CAMERA_PERMISSION_FAIL':
            return{camera:false}
        default:
            return state;
    }

}

export default permissionsReducer;