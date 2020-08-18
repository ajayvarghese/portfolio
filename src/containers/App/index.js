import React from 'react';
import styles from './App.css';
import Resume from './../../components/Resume';
import { TRANSFORMER } from './../../constants/console' 

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
