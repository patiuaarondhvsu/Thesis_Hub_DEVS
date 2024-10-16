import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './MainPage';

function App() {
  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));