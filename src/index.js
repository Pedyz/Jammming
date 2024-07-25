import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthBtn from './components/Auth/AuthBtn'
import App from './App'

const signInDiv = document.getElementById('signInDiv')
const signInDivRoot = ReactDOM.createRoot(signInDiv)
const rootDivEl = document.getElementById('root')
const rootDiv = ReactDOM.createRoot(rootDivEl)

const signInBtn = document.getElementById('signInBtn')

rootDiv.render(<App/>)

signInDivRoot.render(<AuthBtn/>)



