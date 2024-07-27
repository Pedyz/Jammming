import Styles from './SearchBar.module.css'
import { useState } from 'react'

function SearchBar( {onResults} ) {
    const [search, setSearch] = useState('')
    const token = localStorage.getItem('token')

    const searchItem = async (e) => {
        const newSearch = e.target.value
        setSearch(newSearch)

        if (newSearch.length > 2) {
            try {
                const response = await fetch(`https://api.spotify.com/v1/search?q=${newSearch}&type=track`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const data = await response.json()
                onResults(data.tracks.items)
            } catch (error) {
                console.log(error)
            }

        } else {
            onResults([])
        }
    }


    return (
        <input placeholder='Search here' className={Styles.searchBar} onChange={searchItem}/>
    )
}

export default SearchBar