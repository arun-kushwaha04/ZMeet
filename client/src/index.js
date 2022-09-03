import React from 'react';
// import ReactDOM from 'react-dom/client';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import 'semantic-ui-css/semantic.min.css';

import './index.css';
import App from './App';
import Meetpage from './components/meetpage/Meetpage';

render(
 <BrowserRouter>
  <Routes>
   <Route path='/' element={<App />} />
   <Route path=':meetId' element={<Meetpage />} />
   {/* <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route> */}
  </Routes>
 </BrowserRouter>,
 document.getElementById('root'),
);
