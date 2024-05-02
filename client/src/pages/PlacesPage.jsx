
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import { useState } from "react";
import axios from "axios";
import PhotoUploader from "../PhotoUploader";
import PlacesFormPage from "./PlacesFormPage";


export default function PlacesPage() {
    const { action } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [openHours, setOpenHours] = useState('');
    const [closeHours, setCloseHours] = useState('');
    const [numbPers, setNumbPers] = useState(1);
   
    // const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);

    //     if(redirectToPlacesList && action !== 'new'){
    //         return<Navigate to={'/account/places'}/>
    //     }
    return (
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}
            {action === 'new' && (
                <PlacesFormPage/>
                
            )}
        </div>
    );
}
