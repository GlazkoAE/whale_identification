import logo from './logo.svg';
import {PageContainer} from "./components/PageContainer/PageContainer";

import { Helmet } from 'react-helmet';
import './App.css';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>
          Whale identification
        </title>
      </Helmet>
        <PageContainer/>
    </div>
  );
}

export default App;
