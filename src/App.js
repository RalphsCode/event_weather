import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventForm from './EventForm';
import ConfirmInputs from './ConfirmInputs';
// import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <h1>Event Weather App</h1>
      <h2>Know the weather at the event</h2>
      <h3>100% FREE for all.</h3>
      
      {/* Use BrowserRouter to handle navigation */}
      <BrowserRouter>
        {/* <NavBar /> */}
        <Routes>
          <Route path="/form" element={<EventForm />} />
          <Route path="/confirm" element={<ConfirmInputs />} />
          <Route path="/" element={<EventForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );   }

export default App;
