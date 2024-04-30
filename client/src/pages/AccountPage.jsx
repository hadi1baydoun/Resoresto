
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import IndexPage from "./Index";
import PlacesPage from "./PlacesPage";

export default function AccountPage() {
    const { user,setUser } = useContext(UserContext);
    const [ready, setReady] = useState(false);
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams(); // Access subpage parameter
    if(subpage===undefined){
        subpage ='profile';
    }
   
    async function logout(){
        await axios.post('/logout');
        
        setUser(null);
        setRedirect('/');
        
    }
    useEffect(() => {
        // Set ready state to true when the component mounts
        setReady(true);
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // If user context is not ready, render loading message
    if (!ready) {
        return 'Loading...';
    }

    // Check if user exists and has a name property before accessing it
    if (!user || !user.name && !redirect) {
        return <Navigate to={'/login'} />; // Redirect to login page if user is not authenticated
    }

   

    function linkClasses(type) {
        
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
        if (type === subpage ) {
            classes += ' bg-red-500 text-white ';
        }else {
            classes += ' bg-gray-200';
        }
        
        // Return the computed classes
        return classes;
    }
    if (redirect){
        return <Navigate to={redirect}/>
    }
    return (
        <div>
            {redirect && <IndexPage />}
            <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                <Link className={linkClasses('profile')} to={'/account'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                My Profile
                </Link>

                <Link className={linkClasses('Reservation')} to={'/account/Reservation'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>   
                    My Reservation
                </Link>

                <Link className={linkClasses('places')} to={'/account/places'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
                    Recomendations
                </Link>
                
            </nav>
            {subpage ==='profile'&&(
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br/>
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places'&& (
                <PlacesPage/>

            )}
            
        </div>
    );
    
}
