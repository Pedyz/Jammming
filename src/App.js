import { useState, useEffect } from 'react'
import AuthBtn from './components/Auth/AuthBtn'
import SearchBar from './components/SearchBar/SearchBar'
import PlaylistsList from './components/PlaylistsList/PlaylistsList'
import Style from "./App.module.css"


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

    const [results, setResults] = useState([])
  
    return (
        <div id={Style.mainDiv}>
            {!token ? 
            <div className={Style.textDiv}>
                <h2>Create your own Spotify playlist with Jammming</h2>
                <AuthBtn/>
            </div>
            
            :
            <div id={Style.container}>
                <div className={Style.column}>
                    <SearchBar onResults={setResults}/>
                    <div className={Style.fullList}>
                        <ul className={Style.songList}>
                            {results.map(track => (
                                <li key={track.id} className={Style.song}>
                                    <img className={Style.albumImg} src={track.album.images[0].url}/>
                                    <div className={Style.songTxt}>
                                        <h2>{track.name}</h2>
                                        <h3>{track.artists.map(artist => artist.name).join(', ')}</h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className={Style.column}>
                    <PlaylistsList/>
                </div> 
            </div>
            }
        </div>
            
    )

}

export default App;
