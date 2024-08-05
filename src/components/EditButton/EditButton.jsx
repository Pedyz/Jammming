import { useState, useEffect } from "react";
import Style from './EditButton.module.css'

function EditButton({ playlistId, reloadInfos }) {
    const token = localStorage.getItem('token')
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')
    const [playlistImg, setPlaylistImg] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)

    const getPlaylistInfo = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            setPlaylistName(data.name)
            setPlaylistDescription(data.description)
            setPlaylistImg(data.images[0].url)
        } catch (error) {
            console.log(error)
        }
    }

    const openWindow = () => {
        const background = document.getElementById('background')
        background.style.display = 'flex'
        getPlaylistInfo()
    }

    const closeWindow = () => {
        const background = document.getElementById('background')
        background.style.display = 'none'
    }

    const chooseImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.image-selector').src = e.target.result;
                setSelectedImage(e.target.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendImage = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'image/jpeg'
                },
                body: selectedImage
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const changeInfos = async () => {
        const nameInput = document.getElementById('nameInput')
        const descriptionInput = document.getElementById('descriptionInput')

        try {
            if(nameInput.value !== '' || descriptionInput.value !== '') {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        description: descriptionInput.value
                    })
                })
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const submitChanges = () => {
        if (selectedImage) {
            sendImage()
        }
        changeInfos()
        setSelectedImage(null)

        reloadInfos(true)

        closeWindow()
    }

    return (
        <div>
            <div id='background' className={Style.background}>
                <div id='editWindow' className={Style.container}>
                    <h3 onClick={closeWindow} className={Style.closeBtn}>X</h3>
                    <h2 className={Style.title}>Edit your playlist</h2>
                    <div className={Style.inputsDiv}>
                        <label for="fileInput">
                            <img src={playlistImg} alt="Click to select image" className="image-selector"/>
                        </label>
                        <input className={Style.fileInput} type="file" id="fileInput" accept="image/*" onChange={chooseImage}/>
                        <div className={Style.textInputs}>
                            <input placeholder={playlistName} id='nameInput' />
                            <textarea className={Style.descriptionInput} id='descriptionInput' placeholder={playlistDescription}></textarea>
                        </div>
                    </div>
                    <button onClick={submitChanges} className={Style.submitBtn}>Submit</button>
                </div>
            </div>
            <button onClick={openWindow} className={Style.editBtn}>Edit</button>
        </div>
    )
    
}

export default EditButton