import { useState, useEffect } from "react";
import Style from './PlaylistsList.module.css'
import PlaylistsNav from "../PlaylistsNav/PlaylistsNav";

function PlaylistsList() {
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [playlistImg, setPlaylistImg] = useState('')
    const [playlistName, setPlaylistName] = useState('')
    const [filterOption, setFilterOption] = useState('all')
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!selectedPlaylist) {
            getList().then(playlists => {
                setPlaylists(playlists);
            });
            setPlaylistImg('')
        } else {
            fetchPlaylistTracks(selectedPlaylist).then(tracks => {
                setTracks(tracks);
            });
            getPlaylistImg(selectedPlaylist).then(img => {
                setPlaylistImg(img)
            })
            getPlaylistName(selectedPlaylist).then(data => {
                setPlaylistName(data)
            })
        }
    }, [selectedPlaylist]);

    const getList = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            return data.items

        } catch (error) {
            console.log(error)
        }
    } 

    const fetchPlaylistTracks = async (key) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${key}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            return data.items

        } catch (error) {
            console.log(error)
        }
    }

    const getPlaylistImg = async (key) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${key}/images`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            return data[0].url
        } catch (error) {
            console.log(error)
        }
    }

    const getPlaylistName = async (key) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${key}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            return data.name
        } catch (error) {
            console.log(error)
        }

    }

    const handlePlaylistClick = (playlistId) => {
        setSelectedPlaylist(playlistId);
    };

    const goBack = () => {
        setSelectedPlaylist(null);
    };

    const handleChangeOption = (option) => {
        setFilterOption(option)
    }

    const filteredPlaylists = () => {
        let filter 
        if (filterOption == 'all') {
            filter = playlists.map(playlist => (
                <li 
                    onClick={() => handlePlaylistClick(playlist.id)} 
                    key={playlist.id} 
                    className={Style.playlistsItem}
                >
                    <img src={playlist.images ? playlist.images[0].url : 'https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg'} alt={playlist.name} />
                    <h2>{playlist.name}</h2>
                </li>
            ))
            return filter
        } else if (filterOption == 'public') {
            let filtered = playlists.filter(playlist => playlist.public === true)
            filter = filtered.map(playlist => (
                <li 
                    onClick={() => handlePlaylistClick(playlist.id)} 
                    key={playlist.id} 
                    className={Style.playlistsItem}
                >
                    <img src={playlist.images ? playlist.images[0].url : 'https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg'} alt={playlist.name} />
                    <h2>{playlist.name}</h2>
                </li>
            ))
            return filter
        } else {
            let filtered = playlists.filter(playlist => playlist.public === false)
            filter = filtered.map(playlist => (
                <li 
                    onClick={() => handlePlaylistClick(playlist.id)} 
                    key={playlist.id} 
                    className={Style.playlistsItem}
                >
                    <img src={playlist.images ? playlist.images[0].url : 'https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg'} alt={playlist.name} />
                    <h2>{playlist.name}</h2>
                </li>
            ))
            return filter
        }
    }
    
    return (
        <div className={Style.topDiv}>
            
            {!selectedPlaylist ? (
                <div>
                    <PlaylistsNav onChangeOption={handleChangeOption}/>
                    <ul className={Style.playlistsList}>
                    {filteredPlaylists()}
                    </ul>
                </div>
                
            ) : (
                <div className={Style.topDiv}>
                    <button onClick={goBack} className={Style.backButton}>
                        Go Back
                    </button>
                    <img className={Style.playlistIcon} src={playlistImg}/>
                    <input placeholder={playlistName} className={Style.nameInput}/>
                    <h2 id={Style.trackH2}>Tracks</h2>
                    {tracks.length > 0 ? (
                        <ul className={Style.tracksList}>
                            {tracks.map(track => (
                                <li key={track.track.id} className={Style.tracksItem}>
                                    <img src={track.track.album.images[0].url}/>
                                    <div className={Style.tracksTxt}>
                                        <h2>{track.track.name}</h2>
                                        <h3>{track.track.artists.map(artist => artist.name).join(', ')}</h3>
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading tracks...</p>
                    )}
                </div>
            )}
        </div>
    );
    
}

export default PlaylistsList