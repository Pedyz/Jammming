import Style from './PlaylistCreation.module.css'

function PlaylistCreation({ onCloseBtn }) {

    const token = localStorage.getItem('token')

    const getUserId = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            const data = await response.json()
            return data.id

        } catch (error) {
            console.log(error)
        }
    }

    const createPlaylist = async () => {
        try {
            const plName = document.getElementById('creatorInput').value
            const plDescription = document.getElementById('creatorTextArea').value

            const userId = await getUserId()
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: plName,
                    description: plDescription,
                    public: true
                })
            })
            
        
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        
        closeWindow()
    }

    const closeWindow = () => {
        onCloseBtn(false)
    }

    return (
        <div className={Style.container}>
            <div className={Style.creator}>
                <h3 onClick={closeWindow} className={Style.closeBtn}>X</h3>
                <h2>Create your Playlist</h2>
                <input id="creatorInput" placeholder='Name' />
                <textarea id="creatorTextArea" className={Style.description} placeholder='Description' maxLength='300'></textarea>
                <button onClick={createPlaylist}>Create</button>
            </div>
        </div>
    )
}

export default PlaylistCreation