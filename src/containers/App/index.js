import React from 'react';
import styles from './App.css';
import Resume from './../../components/Resume';

class App extends React.Component {
  render(){
    return (
      <div className={styles.wrapper}>
        <Resume />
    </div>)
  }
}

export default App;