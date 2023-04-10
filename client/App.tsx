import React, { useState } from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import { HomepageContext } from './Context';
import Homepage from './components/Homepage';
import Landing from './components/Landing';
import { Navigate } from 'react-router-dom';

const App = () => {
  const [submit, setSubmit] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [uri, setUri] = useState('');
  const [savedUri, setSavedUri] = useState('');
  const [dbCredentials, setDBCredentials] = useState({
    host: '',
    port: 0,
    dbUsername: '',
    dbPassword: '',
    database: '',
  });
  const [queryResponse, setQueryResponse] = useState([]);
  const [masterData, setMasterData] = useState({});
  const [renderedData, setRenderedData] = useState({});
  const [renderedDataPositions, setRenderedDataPositions] = useState({});
  const [errorMessages, setErrorMessages] = useState(['']);
  const [reset, setReset] = useState(false);

  return (
    <HomepageContext.Provider
      value={{
        submit,
        setSubmit,
        queryString,
        setQueryString,
        uri,
        setUri,
        savedUri,
        setSavedUri,
        dbCredentials,
        setDBCredentials,
        queryResponse,
        setQueryResponse,
        masterData,
        setMasterData,
        renderedData,
        setRenderedData,
        renderedDataPositions,
        setRenderedDataPositions,
        errorMessages,
        setErrorMessages,
        reset,
        setReset,
      }}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </HomepageContext.Provider>
  );
};

export default App;
