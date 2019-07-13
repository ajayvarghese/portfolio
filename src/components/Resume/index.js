import React from 'react';
import styles from './Resume.css';
import PropTypes from 'prop-types';
import data from './../../constants/data';
import classNames from 'classnames';
import Timeline from './../Timeline';
import dp from './../../assets/images/dp.jpeg';
import RadialProgressBar from './../../components/RadialProgressBar';
import ProgressBar from './../../components/ProgressBar';
import icons from './../../constants/icons';
import ContactMe from './../../components/ContactMe';

const LeftPanel = () => (
  <aside className={styles.left_panel}>
    <div className={styles.avatar}>
      <div className={styles.image_wrapper}>
        <img src={dp} className={styles.profile_pic} alt={'Profile pic'}/>
      </div>
      <div className={styles.name_desig}>
        <div className={styles.name}>
          <span className={styles.light}>{data.firstname}</span>
          {" "}{data.lastname}
        </div>
        <div className={styles.desig}>{data.designation}</div>
      </div>
    </div>
    <div className={styles.meta_wrapper}>
      <div className={styles.left_panel__section}>
        <h2 className={styles.section_header}>ABOUT ME</h2>
        <p>{data.description}</p>
      </div>
      <div className={styles.left_panel__section}>
        <h2 className={styles.section_header}>CONTACT</h2>
        <ul className={styles.left_panel__section_list}>
          <li className={"flex"}>
            <span className={classNames(styles.icon, styles.location_ico, icons.location)}/>
            <span>{data.location}</span>
          </li>
          <li className={"flex"}>
            <span className={classNames(styles.icon, styles.phone_ico, icons.phone)}/>
            <span>{data['contact-no']}</span>
          </li>
          <li className={"flex"}>
            <span className={classNames(styles.icon, styles.email, icons.mail)}/>
            <span>{data.email}</span>
          </li>
        </ul>
      </div>
      <div className={styles.left_panel__section}>
        <h2 className={styles.section_header}>FOLLOW ME</h2>
        <ul className={styles.left_panel__section_list}>
          <li>
            <a href={data.stackoverflow} target="_blank" className={styles.follow_link}>
              <span className={classNames(styles.icon, styles.email, icons.stackoverflow)}/>
              <span>Stack overflow</span>
            </a>
          </li>
          <li>
            <a href={data.linkedin} target="_blank" className={styles.follow_link}>
              <span className={classNames(styles.icon, styles.email, icons.linkedin)}/>
              <span>Linkedin</span>
            </a>
          </li>
          <li>
            <a href={data['github#1']} target="_blank" className={styles.follow_link}>
              <span className={classNames(styles.icon, styles.email, icons.github)}/>
              <span>Github</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className={styles.disclaimer}>
      <i>*</i>Basic portfolio site done using React, Webpack, NodeJS and HTML, CSS and Webpack Setup are made from scratch, No external frameworks used.
      <a href="https://github.com/ajayvarghese/portfolio" target="_blank">Github Link</a>
    </div>
  </aside>
);

const Main = () => (
  <main className={styles.right_panel}>
    <section>
      <h2 className={styles.section_header}>EXPERIENCE</h2>
      <Timeline
        data={data.experience}
        rightComp={({ year, designation, company, desc, link }) =>{
          const comp = <div className={styles.timeline_body}>
            <h4>{company}</h4>
            <span>{designation}</span>
            <p>{desc}</p>
          </div>
          return link ? <a href={link} target={"_blank"} className={styles.timeline_link}>
              {comp}
          </a> : <div>{comp}</div>
        }}
      />
    </section>
    <section>
      <h2 className={styles.section_header}>EDUCATION</h2>
      <Timeline
        data={data.education}
        rightComp={({ institution, degree}) => <div className={styles.timeline_body}>
          <h4>{institution}</h4>
          <span>{degree}</span>
        </div>}
      />
    </section>
    <section>
      <h2 className={styles.section_header}>SKILLS</h2>
      <div className={styles.skills_wrapper}>
        {Object.keys(data.skills).map(category => (<div className={styles.skill_category}>
          <h3>{category}</h3>
          <ul className={styles.skill_list}>
            {Object.keys(data.skills[category]).map(skill =>
              <li
              title={skill}
              className={classNames(styles.skill_item)}>
                <div className={classNames(styles.skill_icon, styles[skill.toLowerCase()])} />
                <div className={styles.skill_info}>
                  <h3>{skill}</h3>
                  <ProgressBar percentage={data.skills[category][skill]} />
                </div>
                
                {/* <RadialProgressBar
                 percentage={data.skills[category][skill]}
                 valueStrokeWidth={4}
                 meterStrokeWidth={1}
                 meterStrokeColor="rgb(76, 196, 240)"
                 valueStrokeColor="rgb(76, 196, 240)"
                 customContent={() => <div />}
                /> */}
              </li>
            )}
          </ul>
        </div>))
        }
      </div>
    </section>
  </main>
);

const Resume = () => (
  <div className={styles.wrapper}>
    <LeftPanel />
    <Main />
    <ContactMe />
  </div>
);

export default Resume;