import React from 'react';
import styles from './Loader.css';
import classNames from 'classnames';

export const AnimatedLoader = ({ className }) => <div className={classNames(styles.loader, className)}/>;

const Loader = () => (
  <div className={styles.wrapper}>
    <AnimatedLoader />
  </div>
);

export default Loader;