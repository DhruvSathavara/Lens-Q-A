import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Question Answer

import Questiondetail from './components/Q and A/Questiondetail';
import AskQuestion from './components/Q and A/AskQuestion';
import CreateQuestion from './components/Lens/createQuestion';
import QuestionDetails from './components/Lens/QuestionDetails';


function App() {
  return (
    <div className="App">
      <Header />
      {/* <Navbar/> */}

      {/* <ChatBox /> */}
      <Routes>
        <Route path="/question" element={<CreateQuestion />} />
        <Route path="/questionDetail/:id" element={<QuestionDetails />} />

        





        {/* Question detail */}
        <Route path="/askQue" element={<AskQuestion />} />
        <Route path="/question-detail/:id" element={<Questiondetail />} />


       
      </Routes>

      {/* <Footer /> */}
    </div>
  );
}

export default App;