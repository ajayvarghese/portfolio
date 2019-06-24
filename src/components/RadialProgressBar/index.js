import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './RadialProgressBar.css';

export default class RadialProgressBar extends Component {
  calculateDashOffset = (percentage, { width, meterStrokeWidth, valueStrokeWidth }) => {
    const { type } = this.props;
    const strokeWidth = meterStrokeWidth > valueStrokeWidth ? meterStrokeWidth : valueStrokeWidth;
    const radius = width / 2 - strokeWidth / 2;
    const circleCircumference = 2 * Math.PI * radius;

    if ([1, 3].includes(type)) {
      this.setState({
        strokeDashOffset: circleCircumference * (1 - percentage / 100),
        radius,
        strokeWidth,
        circumference: circleCircumference,
      });
    } else {
      const sectorPerimeter = (100 / 360) * circleCircumference;
      const sectorCircumference = circleCircumference - sectorPerimeter;
      this.setState({
        strokeDashOffset: sectorPerimeter + sectorCircumference * (1 - percentage / 100),
        radius,
        strokeWidth,
        circumference: sectorCircumference + sectorPerimeter,
      });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      strokeDashOffset: 0,
      radius: 0,
      circumference: 0,
      strokeWidth: 0,
    };
  }

  componentWillReceiveProps(nxtProps) {
    if (nxtProps.percentage !== this.props.percentage) {
      this.calculateDashOffset(nxtProps.percentage, nxtProps);
    }
  }

  componentDidMount() {
    this.calculateDashOffset(this.props.percentage, this.props);
  }

  render() {
    const { strokeDashOffset, radius, circumference, strokeWidth } = this.state;
    const {
      percentage, width, height, meterStrokeWidth, valueStrokeWidth, type, running, runningRectColor,
      meterStrokeColor, valueStrokeColor, customContent, strokeLinecap, classes, maskBarWidth,
    } = this.props;
    const displayTextOffset = Number(strokeWidth) + 5 + 'px';

    let meterCircleCircum = {};
    if (type === 2) {
      meterCircleCircum = {
        strokeDasharray: circumference - ((100 / 360) * 2 * Math.PI * radius),
        strokeLinecap: 'round',
      };
    }
    let dim = {};
    let clipPathData = [];
    let initialRotate = 0;
    let clipPath = {};
    if (type === 3) {
      dim = {
        height: maskBarWidth,
        width: width / 2,
        y: height / 2,
        x: 0,
      };
      const circum = 2 * Math.PI * radius;

      clipPathData = Array(Math.round(circum / maskBarWidth))
        .fill(0)
        .map(_ => ({
          ...dim,
        }));

      initialRotate = -52;
      clipPath = { clipPath: 'url(#cut-off-bottom)' };
    }

    return (
      <div
        className={classNames(styles['radial-progress-bar'], classes.wrapper)}
        style={{ width: width + 'px', height: height + 'px' }}
      >
        <svg
          className={styles['progress']}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={type === 2 ? { transform: 'rotate(140deg)' } : { transform: 'rotate(-90deg)' }}
        >
          <defs>
            {type === 3 && <clipPath id="cut-off-bottom">
              {clipPathData.map((d, i) => (
                <rect
                  key={`ClipRect-${i}`}
                  {...d}
                  style={{
                    transformOrigin: `${width / 2}px ${height / 2}px`,
                    transform: `rotate(${initialRotate + i * (maskBarWidth * 2)}deg)`,
                  }}
                />
              ))}
            </clipPath>}
            <mask id="myMask">
              <rect width={width} height={height} fill="white" />
              <circle
                cx={width / 2}
                cy={height / 2}
                r={width / 2 - 14}
                fill="black"
              />
            </mask>
          </defs>
          <circle
            {...meterCircleCircum}
            className={styles['progress-meter']}
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={meterStrokeColor}
            strokeWidth={meterStrokeWidth}
            {...clipPath}
          />
          <circle
            className={styles['progress-value']}
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={valueStrokeColor}
            strokeWidth={valueStrokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashOffset}
            strokeLinecap={strokeLinecap}
            {...clipPath}
          />
          {type === 3 && running && (
            <rect
              mask="url(#myMask)"
              className={styles.rotate}
              {...dim}
              fill={runningRectColor}
              style={{
                transformOrigin: `${width / 2}px ${height / 2}px`
              }}
            />
          )}
        </svg>
        <div
          className={styles['display-text']}
          style={{
            top: displayTextOffset,
            left: displayTextOffset,
            right: displayTextOffset,
            bottom: displayTextOffset,
          }}
        >
          {customContent(percentage)}
        </div>
      </div>
    );
  }
}

RadialProgressBar.propTypes = {
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number,
  height: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square', 'inherit']),
  customContent: PropTypes.func,
  valueStrokeWidth: PropTypes.number,
  meterStrokeWidth: PropTypes.number,
  meterStrokeColor: PropTypes.string,
  valueStrokeColor: PropTypes.string,
  type: PropTypes.number,
  classes: PropTypes.instanceOf(Object),
  maskBarWidth: PropTypes.number,
  running: PropTypes.bool,
  runningRectColor: PropTypes.string
};

RadialProgressBar.defaultProps = {
  percentage: 0,
  width: 120,
  height: 120,
  strokeLinecap: 'round',
  customContent: perc => <span className={styles.text}>{perc + '%'}</span>,
  valueStrokeWidth: 14,
  meterStrokeWidth: 13,
  meterStrokeColor: '#eeeeee',
  valueStrokeColor: '#1BBC9B',
  type: 1,
  maskBarWidth: 3,
  classes: {
    wrapper: '',
  },
  running: false,
  runningRectColor: '#fff'
};