import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventForm from './EventForm';
import ConfirmInputs from './ConfirmInputs';
import GetWxData from './GetWxData';
import ResultsPage from './ResultsPage';

// import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <h1><img src="/android-chrome-192x192.png" alt='App Icon' width="50" text-align= "center" />
      &nbsp;Event Weather App</h1>
      
      <h3>Know the weather in advance!<br />
      100% FREE for all.</h3>

      {/* Use BrowserRouter to handle navigation */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/form" element={<EventForm />} />
          <Route path="/confirm" element={<ConfirmInputs />} />
          <Route path="/wxData" element={<GetWxData />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/" element={<EventForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );   }

export default App;
