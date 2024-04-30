// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// export const UserContext = createContext({});

// export function UserContextProvider({children}){
//     const [user, setUser]= useState(null);
//     useEffect(async () =>{
//         if (!user){
//             axios.get('/profile').then(({data}) => {
//                 setUser(data);

//             });
            
//         }
    
//     },[]);
    
//     return(
//        <UserContext.Provider value={{user,setUser}}>
//         {children} 
//        </UserContext.Provider>
//     );
// }
// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// export const UserContext = createContext({});

// export function UserContextProvider({ children }) {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const response = await axios.get('/profile');
//                 setUser(response.data);
//             } catch (error) {
//                 // Handle error, e.g., user not authenticated
//                 console.error('Error fetching user profile:', error);
//             }
//         };

//         if (!user) {
//             fetchUserProfile();
//         }
//     }, [user]);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// }

import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create a context to hold user state
export const UserContext = createContext({});

// Create a component to provide the UserContext
export function UserContextProvider({ children }) {
    // Initialize user state with null
    const [user, setUser] = useState(null);
    const [ready,setReady] = useState(false);

    // Use useEffect to fetch user profile when the component mounts
    useEffect(() => {
        // Define a function to fetch user profile
        const fetchUserProfile = async () => {
            try {
                // Make a GET request to '/profile' endpoint to fetch user profile
                const response = await axios.get('/profile');
                // Update user state with the fetched user data
                setUser(response.data.userData);
                setReady(true);
            } catch (error) {
                // Handle error if user profile cannot be fetched
                console.error('Error fetching user profile:', error);
                // Optionally, you can clear user state here if necessary
                setUser(null);
            }
        };

        // Check if user state is null (i.e., no user data has been fetched yet)
        if (!user) {
            // If user state is null, call fetchUserProfile function to fetch user profile
            fetchUserProfile();
        }
    }, []); // Empty dependency array to run effect only once when component mounts

    // Render the context provider with user state and setUser function as value
    return (
        <UserContext.Provider value={{ user, setUser,ready }}>
            {children}
        </UserContext.Provider>
    );
}
