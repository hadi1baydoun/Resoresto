import { Route, Routes } from 'react-router-dom'

import IndexPage from './pages/Index'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/ProfilePage'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
 
  return (
    <UserContextProvider>
      <Routes>

        <Route path='/' element = {<Layout/>}>
        <Route index element = {<IndexPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/account/:subpage" element={<AccountPage />} />
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<PlacesFormPage />} />
        <Route path="/account/places/:id" element={<PlacesFormPage />} />
        
        
         
      </Route>

      </Routes>

    </UserContextProvider>
    

  )
}

export default App

