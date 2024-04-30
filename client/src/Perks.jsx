import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmoking } from '@fortawesome/free-solid-svg-icons';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { faChild } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
export default function Perks({selected,onChange}){
    return(
        <>
         
                    <label className="border p-4 flex rounded-2xl gap-2 items-center">
                        <input type="checkbox"/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>

                        <span>Wifi</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center " >
                        <input type="checkbox"/>
                        <div>
                         <FontAwesomeIcon icon={faCar} />
                        </div>
                        <span>Free parking</span>
                    </label>
                    
                    <label className="border p-4 flex rounded-2xl gap-2 items-center">
                        <input type="checkbox"/>
                        <div>
                        <FontAwesomeIcon icon={faSmoking} />
                        </div>
    
                        <span>Smoking</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center">
                        <input type="checkbox"/>
                        <div>
                         <FontAwesomeIcon icon={faChild} />
                        </div>
                        <span>Kids area</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center">
                        <input type="checkbox"/>
                        <div>
                             <FontAwesomeIcon icon={faPaw} />
                       </div>
                        <span>Pets</span>
                    </label >
                    <label className="border p-4 flex rounded-2xl gap-2 items-center">
                        <input type="checkbox"/>
                        <div>
                            <FontAwesomeIcon icon={faMicrophone} />
                        </div>
                        <span>Singer</span>
                    </label>
                

        </>
    );

}