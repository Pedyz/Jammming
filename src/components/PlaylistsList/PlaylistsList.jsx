import { useState, useEffect } from "react";
import Style from './PlaylistsList.module.css'
import PlaylistsNav from "../PlaylistsNav/PlaylistsNav";

function PlaylistsList({ needUpdate, needReloadList, onCreateBtn, selectedId }) {
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [playlistImg, setPlaylistImg] = useState('')
    const [playlistName, setPlaylistName] = useState('')
    const [filterOption, setFilterOption] = useState('all')
    const [updateAgain, setUpdateAgain] = useState(false)
    const token = localStorage.getItem('token')

    useEffect(() => {
       if (needReloadList == false) {
        getList().then(playlists => {
            setPlaylists(playlists)
        })
       } 
    },[needReloadList])

    useEffect(() => {
        if (needUpdate || updateAgain) {
            fetchPlaylistTracks(selectedPlaylist).then(newTracks => {
                setTracks(newTracks)
            })
        } 
    }, [needUpdate, updateAgain])

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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }    

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
        setSelectedPlaylist(playlistId)
        selectedId(playlistId)
    };

    const goBack = () => {
        setSelectedPlaylist(null)
        selectedId(null)
    };

    const handleChangeOption = (option) => {
        setFilterOption(option)
    }

    const filteredPlaylists = () => {
        let filter 
        if(playlists) {
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
        }

        const handleUpdateList = (data) => {
            onCreateBtn(data)
        }

        const deleteTrack = async (e) => {
            const trackUri = `spotify:track:${e.currentTarget.getAttribute('data-key')}`
            try {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,{
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tracks: [
                            {
                                uri: trackUri
                            }
                        ]
                    })
                })

                if (!response.ok) {
                    window.alert(`You can't remove songs from this playlist!`)
                }
            
                const data = await response.json()
                setUpdateAgain(true)
                setTimeout(() => {
                    setUpdateAgain(false)
                }, 100)
                return data
            } catch (error) {
                console.log(error)
            }
        }
        
    
    return (
        <div className={Style.topDiv}>
            {!selectedPlaylist ? (
                <div>
                    <PlaylistsNav onPlaylistCreation={handleUpdateList} onChangeOption={handleChangeOption}/>
                    <div className={Style.container}>
                        <ul className={Style.playlistsList}>
                            {filteredPlaylists()}
                        </ul>
                    </div>
                    
                </div>
                
            ) : (
                <div className={Style.topContainer}>
                    <button onClick={goBack} className={Style.backButton}>
                        Return
                    </button>
                    <img className={Style.playlistIcon} src={playlistImg ? playlistImg : 'https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg'}/>
                    <input placeholder={playlistName} className={Style.nameInput}/>
                    <h2 id={Style.trackH2}>Tracks</h2>
                    {tracks.length > 0 ? (
                        <ul className={Style.tracksList}>
                            {tracks.map(track => (
                                <li onClick={deleteTrack} data-key={track.track.id} key={track.track.id} className={Style.tracksItem}>
                                    <img src={track.track.album.images[0].url}/>
                                    <div className={Style.tracksTxt}>
                                        <h2>{track.track.name}</h2>
                                        <h3>{track.track.artists.map(artist => artist.name).join(', ')}</h3>
                                    </div>
                                    <button className={Style.removeBtn}>-</button>
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