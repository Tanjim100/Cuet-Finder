import React from 'react'
import { useEffect,useState } from 'react'
import Navbar from './Components/Navbar'
import { BrowserRouter,Route,Routes,useLocation,useNavigate } from 'react-router-dom'
import Home from './Components/Home'
import Lost from './Components/Lost'
import Found from './Components/Found'
import ReportLost from './Components/ReportLost'
import ReportFound from './Components/ReportFound'
import Footer from './Components/Footer'
import Login from './Components/Login'
import Signup from './Components/SignUp'
import Admin from './Components/Admin'
import Profile from './Components/Profile'
import { apiEndpoints } from './config/api'


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(apiEndpoints.validate, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <div>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/lost' element={<Lost/>}/>
        <Route path='/found' element={<Found/>}/>
        <Route path='/reportlost' element={<ReportLost/>}/>
        <Route path='/reportfound' element={<ReportFound/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

function AppWrapper(){
  return(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  )
}

export default AppWrapper
