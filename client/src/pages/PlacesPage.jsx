import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import { useState } from "react";
import axios from "axios";

export default function PlacesPage() {
    const {action}=useParams();
    const[title, setTitle] = useState('');
    const[address, setAddress] = useState('');
    const[addedPhotos, setAddedPhotos] = useState('');
    const[photLink, setPhotoLink] = useState('');
    const[description, setDescription] = useState('');
    const[perks,setPerks] = useState('');
    const[extraInfo, setExtraInfo] = useState('');
    const[openHours, setOpenHours]= useState('');
    const[closeHours, setCloseHours]= useState(''); 
    const[numbPers, setNumbPers]= useState(1);

    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4"style={{ fontWeight: 'bold' }}>{text}</h2>

        );
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>  
        );
    }
    function preInput (header,description){
        return(
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        );


    }


    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link',{link:photLink});
        setAddedPhotos(prev =>{
            return [...prev, filename];
        });
        setPhotoLink('');
    }
    return (
        <div>
            {action !== 'new' &&(
               <div className="text-center">
               <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                   </svg>
                   Add new place
               </Link> 
               </div> 
            )}
           {action ==='new' &&(
           <div>
            <form>
                {preInput('Title','Title for your place, choose a title short and catchy')}
               <input type="text" value={title} onChange={ev => setTitle(ev.target.value )} placeholder="title, for example SBX"/>

                {preInput('Address','Address to your place')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value )} placeholder="address"/>

                {preInput('Photos','More = Better')}
                
                <div className="flex gap-2">
                <input type="text" value={addedPhotos} onChange={ev => setPhotoLink(ev.target.value )} placeholder={'Add using link... (jpg)'}/>
                <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl"style={{ marginTop: '14px' }}>Add&nbsp;Photo</button>
                </div>
            
                <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {addedPhotos.length > 0 && addedPhotos.map(link =>(
                        <div>
                            <img className="rounded-2xl" src={'http://localhost:4000/uploads/'+ link} alt=""/>
                        </div>
                    ))}
                    <button className="flex justify-center border bg-transparent  rounded-2xl p-8 text-2xl text-black-600 gap-1">
                     
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload

                </button>
                </div>
                {preInput('Description','describe your place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value )}/>
                
                {preInput('Perks','Select,all the perks of your place')}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <Perks selected={perks} onChange={setPerks}/>
                </div>
                
              
                {preInput('Extra Info','extra information')}
               
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value )}/>
                {preInput('Open&Close hours','time where there open and close ')}
                <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                        <h3 className="mt-2 -mb-1">Openning hours</h3>
                        <input type="text" value={openHours} onChange={ev => setOpenHours(ev.target.value )} placeholder="10Am"/>
                    </div>
                    <div>
                        <h3  className="mt-2 -mb-1">Closing at</h3>
                        <input type="text"value={closeHours} onChange={ev => setCloseHours(ev.target.value )} placeholder="12Am"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">min number of guests</h3>
                        <input type="number" value={numbPers} onChange={ev => setNumbPers(ev.target.value )} placeholder="2guest"/>
                    </div>
                </div>
                <div>
                   <button className="primary my-3">Save</button>
                </div>
            </form>
           </div>
           )}
            
        </div>
    );
}
