import React, {useContext} from 'react';

const Connect = React.createContext()

export function Provider({children, store}) {

    return (
        <Connect.Provider value={store}>
            {children}
        </Connect.Provider>
    )
}

export function connect(mapStateToProps, mapDispatchToProps) {
    const {store} = useContext(Connect)
    const {getState} = store 
    const newState = mapStateToProps(getState())

    const newDispatch = mapDispatchToProps()
    return function(cmp) {
        return (
            <cmp {...newState} {...newDispatch}/>
        )
    }
}

export function useSelector() {

}

export function useDispatch() {


    
}