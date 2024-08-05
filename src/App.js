import { useState, useEffect } from 'react'
import AuthBtn from './components/Auth/AuthBtn'
import SearchBar from './components/SearchBar/SearchBar'
import PlaylistsList from './components/PlaylistsList/PlaylistsList'
import PlaylistCreation from './components/PlaylistCreation/PlaylistCreation'
import Style from "./App.module.css"


function App() {
    const [token, setToken] = useState('')

    useEffect(() => {
        const hash = window.location.hash
        let key = localStorage.getItem('token')

        if(key) {
            setToken(key)
        }
        

        if (!key && hash) {
            key = hash.substring(1).split('&').find(elem => elem.startsWith("access_token")).split('=')[1]

            window.location.hash = ''
            window.localStorage.setItem('token', key)
            
            setToken(key)
        } else {

            window.location.hash = ''

        }

    }, [])

    const [results, setResults] = useState([])

    const [isOpen, setIsOpen] = useState(false)

    const handleCreateBtn = (data) => {
        setIsOpen(data)
    }

    const closeCreateWindow = (data) => {
        setIsOpen(data)
    }

    const [playlistId, setPlaylistId] = useState(null)

    const handlePlaylistId = (id) => {
        setPlaylistId(id)
    }

    const [needUpdate, setNeedUpdate] = useState(false)

    const addSongToPlaylist = async (e) => {
        try {
            const trackUri = `spotify:track:${e.currentTarget.getAttribute('data-key')}`
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    uris: [
                        trackUri
                    ]
                })
                
            })

            if (!response.ok) {
                window.alert(`You can't add songs to this playlist!`)
            }
            
            const data = await response.json()
            setNeedUpdate(true)

            setTimeout(() => {
                setNeedUpdate(false);
            }, 100);

            return data

        } catch (error) {
            console.log(error)
        }
    }

    if(!token) {

        return (
            <div id={Style.mainDiv}>
                <div className={Style.textDiv}>
                    <h2>Create your own Spotify playlist with Jammming</h2>
                    <AuthBtn/>
                </div>
            </div>
        )

    } else {

        return (
            <div id={Style.mainDiv}>
                {isOpen ? <PlaylistCreation onCloseBtn={closeCreateWindow}/> : <></>}
                <div id={Style.container}>
                <div className={Style.column}>
                    <SearchBar onResults={setResults}/>
                    <div className={Style.fullList}>
                        <ul className={Style.songList}>
                            {results.map(track => (
                                <li onClick={playlistId ? addSongToPlaylist : null} data-key={track.id} key={track.id} className={Style.song}>
                                    <img className={Style.albumImg} src={track.album.images[0].url}/>
                                    <div className={Style.songTxt}>
                                        <h2>{track.name}</h2>
                                        <h3>{track.artists.map(artist => artist.name).join(', ')}</h3>
                                    </div>
                                    <button className={Style.songBtn} style={playlistId ? {display: 'flex'} : {display: 'none'}}>+</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className={Style.column}>
                    <PlaylistsList needUpdate={needUpdate} needReloadList={isOpen} onCreateBtn={handleCreateBtn} selectedId={handlePlaylistId} />
                </div> 
            </div>
            </div>
        )

    }

}

export default App;
