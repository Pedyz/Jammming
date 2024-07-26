import { useState, useEffect } from "react";
import Style from './PlaylistsList.module.css'

function PlaylistsList() {
    const [playlists, setPlaylists] = useState([])
    const token = localStorage.getItem('token')

    useEffect(() => {
        getList().then(playlists => {
            setPlaylists(playlists)
        })
    },[])

    const getList = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            console.log(data.items)
            return data.items

        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <ul className={Style.playlistsList}>
            {playlists.map(playlist => (
                <li key={playlist.id} className={Style.playlistsItem}>
                    <img src={playlist.images[0].url}/>
                    <h2>{playlist.name}</h2>
                </li>
            ))}
        </ul>
    )
    
}

export default PlaylistsList