import classNames from 'classnames';
import React from 'react';
import styles from './PageHeader.css';
import { config } from './../../constants';

const PageHeader = ({ title, children, backPageLink }) => (
  <div className={styles.wrapper}>
    { backPageLink && <Link to={backPageLink} className={styles.back_link} title={'Back'} />}
    {!title && (
      <div className={styles.header_wrapper}>
        <h1>RAZORTHINK <span className={styles.headerContent}>{config.appName}</span></h1>
      </div>
    )}
    {title && (
      <div className={styles.header_wrapper_title}>
        <span className={classNames(styles.header, styles.header1)}>RAZORTHINK </span>
        <span className={styles.header}>{config.appName}</span>
        <div className={styles.pageTitle}>{title}</div>
      </div>
    )}
    {children}
  </div>
);

export default PageHeader;