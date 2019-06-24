import React from 'react';
import styles from './SidePanel.css';
import logo from './../../assets/images/logo.svg';
import classNames from 'classnames';

const SideBar = () => (
  <div className={styles.wrapper}>
    <div className={styles.logo}>
      <img alt="logo" src={logo} />
    </div>
  </div>
);

export default SideBar;