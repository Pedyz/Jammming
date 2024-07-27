import Style from './PlaylistsNav.module.css'
import { useState } from 'react'

function PlaylistsNav({ onChangeOption }) {
    const [selected, setSelected] = useState('all')

    const changeStyle = (el) => {
        setSelected(el)
        onChangeOption(el)
    }
    
    return (
        <div className={Style.playlistsNav}>
            <h2>Playlists</h2>
            <ul>
                <li className={selected === 'all' ? Style.selectedLi : Style.navLi} onClick={() => changeStyle('all')}>All</li>
                <li className={selected === 'public' ? Style.selectedLi : Style.navLi} onClick={() => changeStyle('public')}>Public</li>
                <li className={selected === 'private' ? Style.selectedLi : Style.navLi} onClick={() => changeStyle('private')}>Private</li>
            </ul>
        </div>
    )
}

export default PlaylistsNav