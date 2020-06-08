function scrollByPreds(predictions) {
  if(predictions == 0)
  {
    console.log("content.js - 0");
  }
  if(predictions == 1)
  {
    console.log("content.js - 1");
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'IMAGE_CLICK_PROCESSED') {
      scrollByPreds(message.preds);
    }
    if(message.preds ==1){
      sendResponse("scrolling my man");
    }
    if(message.preds ==0){
      sendResponse(" Still scrolling my man");
    }
  });

