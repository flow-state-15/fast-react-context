import React, { useContext, createContext, useState } from 'react'

export const FormContext = createContext(null)

export const useFormContext = () => useContext(FormContext)

export default function FormProvider(props) {
    const formState = useState({
        first: '',
        last: ''
    })

    return (
        <FormContext.Provider value={formState}>
            {props.children}
        </FormContext.Provider>
    )
}
