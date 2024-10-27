import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import UserLoginPage from './Page/Login/AdminLoginPage';
import HomePage from './Page/Home/HomePage';
import PrivateRoute from './components/private/Index';
function App() {
 

  return (
    <>
      <Provider store={store}>
     <Router>
<Routes>
<Route path="/admin-login" element={<UserLoginPage />} />
<Route element={<PrivateRoute />}>
<Route path="/" element={<HomePage />} />
           
            
          </Route>

    

</Routes>
</Router>
</Provider>
     
    </>
  )
}

export default App
