import Styles from './styles.css'
import { useEffect, useState } from 'react'

function AuthBtn() {

    const [token, setToken] = useState('')

    function authAccount() {
        const CLIENT_ID = 'd802386824eb4d23997c0b6c4bc3ec57'
        const REDIRECT_URI = 'http://localhost:3000'
        const RESPONSE_TYPE = 'token'
        const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'

        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
    } 

    function logOut() {
        window.localStorage.removeItem('token')
        window.location.reload()
    }


    useEffect( () => {

        if (window.localStorage.getItem('token') !== '') {
            setToken(window.localStorage.getItem('token'))
        }


    },[])
    
    return (
        <div>
            {!token ? <button onClick={authAccount} className={Styles.button} id="signInBtn">Sign In</button> : <button onClick={logOut} className={Styles.button} id="signInBtn">Logout</button>}
        </div>
    ) 
    
}

export default AuthBtn


