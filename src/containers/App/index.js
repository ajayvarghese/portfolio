import React from 'react';
import styles from './App.css';
import Resume from './../../components/Resume';
import TRANSFORMERCONSOLE from './constants' 

const App = () => {
    React.useEffect(() => {
      console.log(TRANSFORMER)
    },[])
    return (
      <div className={styles.wrapper}>
        <Resume />
      </div>
    )

}

export default App;
