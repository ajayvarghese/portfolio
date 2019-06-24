import React, { useState } from 'react';
import { AnimatedLoader } from '../../../../components/Loader';
import styles from './MessageBox.css';
import classNames from 'classnames';
import {getFormattedTime} from './../../../../utils/datetime';

export const MessageBox = ({ type, time, msg, source, confidence, setSelected, selected, fragmentSelected,
                             setActiveDocument, setActiveFragment, activeFragment, deleteQuery }) => {
//  const formattedTime = time ? new Date(time) : null;
  return (
  <div className={classNames(styles.wrapper, type && styles[type], selected && styles.selected)}>
      { time && <div className={styles.time}>
        {getFormattedTime(time, true)}
      </div> }
      { type !== "own" ?
        <button
          className={styles.button}
          type={"button"}
          onClick={setSelected}
        /> :
        <button
          className={classNames(styles.button, styles.delete)}
          type={"button"}
          onClick={deleteQuery ? deleteQuery : f => f }
        />
      }
      <div
        className={classNames(styles.message, fragmentSelected && styles.selected)}
        onClick={() => {
          setActiveDocument && setActiveDocument();
          setActiveFragment && setActiveFragment();
        }}
      >
        <span>{msg}</span>
        { (confidence || source) && <div className={styles.confidence}>
          <span>— {source}</span>
          <span>Score: {confidence ? Number(confidence.toFixed(4)) : '-'}</span></div>}
      </div>
  </div>
)};

const ResponseList = ({ responses, setActiveDocument, setActiveFragment, activeFragment, selectFeedbackFragment, queryInProgress }) => {
//  const [selected, setSelected] = useState(-1);
  const [visibleResponseCount, setVisibleResponseCount] = useState(3);
  return (
    <div className={styles.response_list}>
      {responses && responses.slice(0, visibleResponseCount).map((response, index) => {
        return <MessageBox
          key={`MessageBox-${response.fragments[0].id}`}
          time={index === 0 ? responses[0].time : null}
          msg={response.fragments[0].text}
          source={response.fragments[0].procedure}
          confidence={response.score}
          selected={response.feedbackRank === 0}
          setSelected={() => {
//            setSelected(index);
            selectFeedbackFragment(response.segmentId, response.feedbackRank === 0);
          }}
          setActiveDocument={() => setActiveDocument(response.fragments)}
          setActiveFragment={() => setActiveFragment({...response.fragments[0], time: responses[0].time })}
          fragmentSelected={activeFragment ? activeFragment.id === response.fragments[0].id && activeFragment.time === responses[0].time : false}
        />}
      )}
      {queryInProgress && responses.length <= visibleResponseCount &&
      <div className={styles.incoming_msg}>
        <AnimatedLoader className={styles.loader}/>
      </div>
      }
      { visibleResponseCount < responses.length &&
        <div className={styles.btn_wrapper}>
          {queryInProgress && responses.length > visibleResponseCount &&
            <div className={styles.incoming_msg}>
              <AnimatedLoader className={styles.loader}/>
            </div>
          }
          <button
            className={styles.show_more}
            onClick={() => setVisibleResponseCount(Math.min(visibleResponseCount + 1, responses.length))}
          >Show More</button>
        </div>}
    </div>
  )
}

export default ResponseList;