import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editPhotoThunk } from '../../store/photos';
import './EditPhoto.css'

const EditPhotoForm = () => {
    const allPhotos = useSelector(state => state.photos)
    const editPhotoId = useParams().photoId
    const editPhoto = allPhotos[editPhotoId] || {};
    const sessionUser = useSelector((state) => state.session.user);
    const [content, setContent] = useState(editPhoto.content || '');
    const [photoUrl, setPhotoUrl] = useState(editPhoto.photoUrl || '');
    const [state, setState] = useState(editPhoto.state || '');
    const [city, setCity] = useState(editPhoto.city || '');
    const [zipCode, setZipcode] = useState(editPhoto.zipCode || '');
    const [lat, setLat] = useState(editPhoto.lat || '');
    const [lng, setLng] = useState(editPhoto.lng || '');

    const [errors, setErrors] = useState([]);
    const history = useHistory()
    const dispatch = useDispatch();

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const userId = sessionUser.id;

        const editingPhoto = {
            id: editPhoto.id,
            userId,
            content,
            photoUrl,
            state,
            city,
            zipCode,
            lat,
            lng
        }
        dispatch(editPhotoThunk(editingPhoto))
            .then(() => history.push('/'))
            .catch(async (res) => {
                const data = await res.json()
                if (data && errors) setErrors(data.errors)
            })
    }

    return (
        <>
            { sessionUser && sessionUser.id !== editPhoto.userId && <div>You do not have permission to edit this photo!</div> }
            { sessionUser && sessionUser.id === editPhoto.userId &&
                <form id='edit-photo-form' onSubmit={ e => handleOnSubmit(e) }>

                    <ul>
                        { errors.map((error, idx) => <li key={ idx }>{ error }</li>) }
                    </ul>
                    <label>Title:</label>
                    <input
                        name='title'
                        value={ content }
                        onChange={ e => setContent(e.target.value) }
                        type="text"
                        placeholder="Title your photo"
                    />
                    <label>Picture URL:</label>
                    <input
                        name="photoUrl"
                        type='text'
                        value={ photoUrl }
                        onChange={ e => setPhotoUrl(e.target.value) }
                        placeholder='Image Url'
                    />
                    <label>State:</label>
                    <input
                        name="state"
                        type='text'
                        value={ state }
                        onChange={ e => setState(e.target.value) }
                        placeholder='State of Photo'
                    />
                    <label>City:</label>
                    <input
                        name="city"
                        type='text'
                        value={ city }
                        onChange={ e => setCity(e.target.value) }
                        placeholder='City of Photo'
                    />
                    <label>ZipCode:</label>
                    <input
                        name="zipcode"
                        type='text'
                        value={ zipCode }
                        onChange={ e => setZipcode(e.target.value) }
                        placeholder='Photo Zipcode'
                    />
                    <label>Latitude:</label>
                    <input
                        name="latitude"
                        type='text'
                        value={ lat }
                        onChange={ e => setLat(e.target.value) }
                        placeholder='Photo Latitude'
                    />
                    <label>Longitude:</label>
                    <input
                        name="longitude"
                        type='text'
                        value={ lng }
                        onChange={ e => setLng(e.target.value) }
                        placeholder='Photo Longitude'
                    />
                    <button id="editPhoto-btn" type="submit">Submit</button>

                </form>
            }
        </>
    )
}

export default EditPhotoForm