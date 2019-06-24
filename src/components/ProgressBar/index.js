import React from 'react';
import styles from './ProgressBar.css';

const ProgressBar = ({ percentage }) => (
  <div className={styles.wrapper}>
    <div className={styles.thumb} style={{ width: percentage + "%"}} />
  </div>
)

export default ProgressBar;