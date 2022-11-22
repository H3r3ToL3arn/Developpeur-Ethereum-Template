import React from 'react'
import { useState } from "react"

export default function Button({ buttonText, actionOnSubmit }) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputValue(e.target.value)
    };

    return (
        <>
            <input type="text" onChange={handleInputChange} />
            <button
                type="button"
                onClick={() => actionOnSubmit(inputValue)}
            >{buttonText}</button>
        </>
    )
}

