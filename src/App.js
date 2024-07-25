import { useState, useEffect } from 'react'
import AuthBtn from './components/Auth/AuthBtn'
import Style from "./styles.css"

function App() {
    const [token, setToken] = useState('')

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem('token')

        if (!token && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith("access_token")).split('=')[1]

            window.location.hash = ''
            window.localStorage.setItem('token', token)

            setToken(token)
        } else {

            window.location.hash = ''

        }

    }, [])
  
    return (
        <div id="mainDiv">
            {!token ? 
            <div className='textDiv'>
                <h2>Create your own Spotify playlist with Jammming</h2>
                <AuthBtn/>
            </div>
            
            : <h2></h2>
            }
        </div>
            
    )

}

export default App;
