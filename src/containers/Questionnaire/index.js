import React, { Fragment } from 'react';
import { socketDisconnect } from '../../utils/socket';
import attachSocketListeners, { connectSocket } from '../../utils/socket';
import styles from './Questionnaire.css';
import ResponseList, { MessageBox }  from './components/MessageBox';
import { request } from './../../utils/request';
import { config } from './../../constants';
import { URLS } from './Questionnaire.constants';


class Questionnaire extends React.Component{
  state = {
    messages: [],
    activeFragment: {},
    queryInProgress: null,
  };

  setActiveFragment = activeFragment => this.setState({ activeFragment });

  fetchChatHistory = async () => {
    try {
      const response = await request(URLS.HISTORY);
      this.setState({
        messages: response,
        activeFragment: response[0] ? {
          ...response[0].responses[0].fragments[0],
          time: response[0].responses[0].time
        } : null
      });
      this.props.setActiveDocument(
        response.length > 0 ? response[0].responses[0].fragments : [],
        response.length > 0 ? response[0].query : '');
      console.log('Response', response)
    } catch(e) {
      console.log('Error', e);
    }
  };

  sendMessage = async (text) => {
    try {
      const body = {
        "query": text,
        ...config.queryConfig
      };
      const response = await request(URLS.RANK, { method: 'POST', body });
    } catch(e) {
      console.log('Error', e);
    }
  };

  selectFeedbackFragment = async (body, queryIndex, selected) => {
    try {
      const response = await request(URLS.FEEDBACK, { method: selected ? 'DELETE' : 'POST', body });
      this.setState({
        messages: this.state.messages.map((query, index) => (query.queryId === body.queryId && index === queryIndex) ? {
          ...query,
          responses: query.responses.map(segment => segment.segmentId === body.segmentId
            ? {
              ...segment,
              feedbackRank: selected ? 1 : 0,
            } : {
              ...segment,
              feedbackRank: selected ? 0 : 1,
            }
          )
        } : query)
      })
    } catch(e) {
      console.log('Error', e);
    }
  };

  deleteQuery = async (id) => {
    try{
      const response = await request(URLS.QUERY, { method: 'DELETE', body: {"queryId": id} });
      console.log(response);
      this.fetchChatHistory();
    } catch (e) {
      console.error('Error', e);
    }
  }

  inputKeyDownHandler = e => {
    if (e.keyCode === 13){
      this.sendMessage(e.target.value);
      e.target.value = "";
    }
  };

  queryAcknowledgmentHandler = acknowledgment => {
    console.log('acknowledgment', acknowledgment);
    this.setState({
      messages: [{ ...acknowledgment, responses: []}].concat(this.state.messages),
      queryInProgress: acknowledgment.queryId,
    });
    this.list.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  };

  queryResponseHandler = response => {
    console.log('response', response);
    this.setState({
      messages: this.state.messages.map((i, index) => index === 0
        ? { ...i, responses: i.responses.concat(response)} : i)
    }, () => {
      const { messages } = this.state;
      if(messages[0]) {
        this.setState({
          activeFragment: {
            ...messages[0].responses[0].fragments[0],
            time: messages[0].responses[0].time
          },
        });
        this.props.setActiveDocument(messages[0].responses[0].fragments, messages[0].query);
      }
    });
  };

  queryResponseEndHandler = endResponse => {
    console.log('endResponse', endResponse);
    this.setState({ queryInProgress: null})
  };

  componentDidMount() {
    this.fetchChatHistory();
    connectSocket();
    attachSocketListeners({
      'query-acknowledgement': this.queryAcknowledgmentHandler,
      'query-response': this.queryResponseHandler,
      'query-response-end': this.queryResponseEndHandler,
    });
  }

  componentWillUnmount() {
    socketDisconnect();
  }

  render(){
    const { setActiveDocument } = this.props;
    return(
      <div className={styles.wrapper}>
        <div className={styles.input_wrapper}>
          <input
            type={"text"}
            className={styles.question_input}
            placeholder="Type your question here"
            onKeyDown={this.inputKeyDownHandler}
          />
        </div>
        <div className={styles.list} ref={n => {this.list = n}}>
          {
            this.state.messages.length > 0 ? <>
              {this.state.messages.map( (message, index) =>
                <Fragment key={`MessageBox-${message.time}-${message.queryId}`}>
                  <MessageBox
                    type="own"
                    time={message.time || new Date()}
                    msg={message.query}
                    deleteQuery={() => this.deleteQuery(message.queryId)}
                  />
                  <ResponseList
                    responses={message.responses}
                    setActiveDocument={(segments) => setActiveDocument(segments, message.query)}
                    setActiveFragment={this.setActiveFragment}
                    activeFragment={this.state.activeFragment}
                    selectFeedbackFragment={(segmentId, selected) => this.selectFeedbackFragment({
                      queryId: message.queryId,
                      segmentId,
                    }, index, selected )}
                    queryInProgress={index === 0 && this.state.queryInProgress}
                  />
                </Fragment>
                )
              }
            </> : <div>Empty</div>
          }
        </div>
      </div>
    );
  }
}

export default Questionnaire;