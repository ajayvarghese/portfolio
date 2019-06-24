import React, { Component } from 'react';
import styles from './DocumentViewer.css';

class DocumentViewer extends Component {

  state = { loading: true };

  removeQueryTags = window => query => {
    let tags = window.document.querySelectorAll(query);
    tags.forEach(tag => tag.parentNode.removeChild(tag));
  };

  hideQueryTags = window => query => {
    let tags = window.document.querySelectorAll(query);
    tags.forEach(tag => {
      tag.style.display = "none";
    });
  };

  getElementByXPath = window => path => {
    let evaluator = new window.XPathEvaluator();
    let result = evaluator.evaluate(
      path,
      window.document.documentElement,
      null,
      window.XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue;
  };

  cleanseDocument =(e) => {
    const iframe = e.target;
    if (document.location.href === iframe.src) return;

    console.log("Document loaded");
    let toRemoveQueries = [
      "script",
      "[id^=ntCOOLjs]",
      "[class^=clsCOOLjs]",
      "[id^=clsCOOLjs]"
    ];
    let toHideQueries = [
      "body > table:nth-child(1), body > table:nth-child(2)",
      "body > table:nth-child(3) > tbody > tr > td:nth-child(1)"
    ];
    toRemoveQueries.forEach(this.removeQueryTags(iframe.contentWindow));
    toHideQueries.forEach(this.hideQueryTags(iframe.contentWindow));
  };

  displayDocument = (e) => {
//    this.cleanseDocument(e);
    const iframe = e.target;

    const getElementByXPath = this.getElementByXPath;

    const highlight_fragment = (xpath) => {
      this.setState({ loading: false });
      if (!xpath) {
        console.error("Empty XPath!");
        return;
      }
      let node = getElementByXPath(iframe.contentWindow)(xpath);
      if (!node) console.error("highlight_fragment: Node not found", xpath);
      node.style.position = "relative";
      node.style.backgroundColor = "rgba(139, 255, 34, 0.4)";
      node.style.borderWidth = "2px";
      node.style.borderStyle = "solid";
      node.style.borderColor = "rgba(139, 255, 34, 0.4)";
      node.style.zIndex = 200;
      node.scrollIntoView({ block: "center", inline: "start", behavior: "smooth" });
    };

    const bodyElement = iframe.contentWindow.document.querySelector("body");

    function computeBoundingBox(xpaths) {
      return xpaths.reduce(
        function(acc, xpath) {
          if (!xpath) {
            console.error("DRAW_ERROR: Empty XPath!");
            return acc;
          }
          let node = getElementByXPath(iframe.contentWindow)(xpath);
          if (!node) {
            console.error("DRAW_ERROR: Node not found", xpath);
            return acc;
          }
          const nodeBox = node.getBoundingClientRect();
          const bodyBox = bodyElement.getBoundingClientRect();
          return {
            x1: Math.min(acc.x1, nodeBox.left),
            x2: Math.max(acc.x2, nodeBox.right),
            y1: Math.min(acc.y1, nodeBox.top),
            y2: Math.max(acc.y2, nodeBox.bottom)
          };
        },
        { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity }
      );
    }
    const activeXpaths = this.props.activeDocument.map( i => i.xpath);
    const highlightBoxBounds = computeBoundingBox(activeXpaths);
    const highlightElement = document.createElement("div");
    highlightElement.setAttribute("id", "highlight-box");
    bodyElement.appendChild(highlightElement);

    console.log("highlightBoxBounds", highlightBoxBounds);
    console.log(highlightElement);

    highlightElement.style.cssText = `
      background: rgba(34, 143, 255, 0.3);
      position: absolute;
      top: ${highlightBoxBounds.y1}px;
      left: ${highlightBoxBounds.x1}px;
      height: ${highlightBoxBounds.y2 - highlightBoxBounds.y1}px;
      width: ${highlightBoxBounds.x2 - highlightBoxBounds.x1}px;
      pointer-events: none;
      z-index: 100;
      `;

    highlightElement.scrollIntoView({ block: "center", inline: "start", behavior: "smooth" });
    iframe.style.opacity = "1";

    highlight_fragment(activeXpaths[0]);
  };

  componentDidUpdate(props) {
    if(props.activeDocument[0] && this.props.activeDocument[0] &&
      this.props.activeDocument[0].id !== props.activeDocument[0].id) {
     this.setState({
       loading: true,
     })
    }
  }

  render() {
    const { activeDocument } = this.props;
    return (
      <div className={styles.wrapper}>
        {activeDocument.length > 0 &&
          <iframe
            style={{ visibility: this.state.loading ? 'initial': 'initial'}}
            ref={n => { this.iframe = n }}
            className={styles.iframe}
            src={`/rest/document/${activeDocument[0].procedure}.html?id=${activeDocument[0].id}`}
            frameBorder={0}
            onLoad={this.displayDocument}
          />
        }
      </div>
    );
  }
}

export default DocumentViewer;