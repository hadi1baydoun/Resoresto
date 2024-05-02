
import { useState } from "react";
import axios from "axios";

export default function PhotoUploader(){
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');

    async function addPhotoByLink(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.post('/api/upload-by-link', { link: photoLink });
            //  setAddedPhotos(prevPhotos=>[...addedPhotos, data.imageUrl]);
                setAddedPhotos(prevPhotos => [...prevPhotos, { url: data.imageUrl, type: 'link' }]);

            setPhotoLink('');
        } catch (error) {
            console.error('Error adding photo by link:', error.response.data.error);
        }
    }


 
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const formData = new FormData();
    
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }
    
        axios.post('/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            const { data } = response;
            // Log the filenames received from the server
            console.log('Uploaded filenames:', data);
    
            // Update the state 'addedPhotos' by adding the new filename(s) to the existing array
            setAddedPhotos(prevPhotos => [...prevPhotos, ...data]);
        }).catch(error => {
            console.error('Error uploading photos:', error);
            // Handle any error that occurs during the upload process
        });
    }
    
    return(
        <>
        <div className="flex gap-2">
                            <input type="text" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder="Add using link... (jpg)" />
                            <button onClick={addPhotoByLink} className="bg-gray-200 gap-1 px-4 rounded-2xl" style={{ marginTop: '14px' }}>Add&nbsp;Photo</button>
                        </div>
                
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length > 0 && addedPhotos.map((item, index) => (
                            <div className="file" key={index}>
                       

                       <img
                        key={index}
                        src={item.type === 'link' ? item.url : `http://localhost:4000/uploads/${item}`}
                        alt={`Uploaded ${index}`}
                        className={`rounded-lg w-full h-36 object-cover`} // Ensure classes are applied correctly
                        style={{
        
                        objectFit: 'cover', // Cover the container while maintaining aspect ratio
        
                             }}
                        />




                        </div>
                        ))}

                        </div>
    
                        {/* Input for uploading photos */}
                        <label className="inline-flex justify-center border bg-transparent rounded-2xl p-8 text-2xl text-black-600 gap-1" style={{ marginTop: '14px' }}>
                            <input type="file" className="hidden" onChange={uploadPhoto}/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                            Upload
                        </label>
        </>
    );
}