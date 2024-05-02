import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import { useState } from "react";
import axios from "axios";
import PhotoUploader from "../PhotoUploader";

export default function PlacesFormPage(){
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [openHours, setOpenHours] = useState('');
    const [closeHours, setCloseHours] = useState('');
    const [numbPers, setNumbPers] = useState(1);
    
    function renderInputHeader(text) {
        return <h2 className="text-2xl mt-4" style={{ fontWeight: 'bold' }}>{text}</h2>;
    }

    function renderInputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>;
    }
    async function addNewPlace(ev){
        ev.preventDefault();
        //const placeData = {title,address,addedPhotos,description,perks,extraInfo,openHours,closeHours,numbPers};
        await axios.post('/places',
        {title,address,addedPhotos,description,perks,
         extraInfo,openHours,closeHours,numbPers
        });
         setRedirectToPlacesList(true);
   
        }
    return(
        <div>
                    <form onSubmit={addNewPlace}>
                        {renderInputHeader('Title')}
                        {renderInputDescription('Title for your place, choose a title short and catchy')}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, for example SBX" />

                        {renderInputHeader('Address')}
                        {renderInputDescription('Address to your place')}
                        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />

                        {renderInputHeader('Photos')}
                        <PhotoUploader/>

                        {renderInputHeader('Description')}
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

                        {renderInputHeader('Perks')}
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>

                        {renderInputHeader('Extra Info')}
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

                        {renderInputHeader('Open & Close hours')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Opening hours</h3>
                                <input type="text" value={openHours} onChange={ev => setOpenHours(ev.target.value)} placeholder="10 AM" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Closing at</h3>
                                <input type="text" value={closeHours} onChange={ev => setCloseHours(ev.target.value)} placeholder="12 AM" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Min number of guests</h3>
                                <input type="number" value={numbPers} onChange={ev => setNumbPers(ev.target.value)} placeholder="2 guests" />
                            </div>
                        </div>

                        <div>
                            <button className="primary my-3">Save</button>
                        </div>
                    </form>
                </div>
    );
}