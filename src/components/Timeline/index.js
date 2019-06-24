import React from 'react';
import styles from './Timeline.css';

const Timeline = ({data, rightComp }) => {
  return (
  <div className={styles.wrapper}>
    {data.map(item => <div className={styles.item}>
      <div className={styles.left}>{item.year}</div>
      <div className={styles.right}>
        {rightComp(item)}
      </div>
    </div>)
    }
  </div>
)};

export default Timeline;