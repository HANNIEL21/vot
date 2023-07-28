import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Root, Home, Error, Login, Signup} from './Export';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/home/:pollID/:userID' element={<Home />} />
          <Route path='/*' element={<Error />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
