import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands'

// https://teachablemachine.withgoogle.com/models/oAxkpeRby
const URL = "https://teachablemachine.withgoogle.com/models/MTCLbEj-a/";
console.log(URL);
// const URL = "file:///Users/arth/Desktop/SnapScroll/model/";
 var extension_id = chrome.runtime.id;

 // Haha, it seems we no longer need getUserMedia() ...
chrome.contentSettings['microphone'].set({'primaryPattern':'*://' + extension_id + '/*','setting':'allow'});


async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL);

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();
  console.log(recognizer);
  return recognizer;
}

async function init() {
  let message;
  let preds;
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  // const labelContainer = document.getElementById("label-container");
  // for (let i = 0; i < classLabels.length; i++) {
  //     labelContainer.appendChild(document.createElement("div"));
  // }

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
          const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
          // labelContainer.childNodes[i].innerHTML = classPrediction;
          if(result.scores[1].toFixed(2)>0.9)
          {
              preds = 0;
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        {code: 'console.log("Life is VGood, oh Snap!"); window.scrollBy(0, -200);'});
                  });
              // console.log("Snap");
          }
          if(result.scores[0].toFixed(2)>0.9)
          {
              preds = 1;
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        {code: 'console.log("Life is Good Hmm");window.scrollBy(0, 200);'});
                  });
              // console.log("Hmm....");
          }

          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   chrome.tabs.sendMessage(tabs[0].id, {action: 'IMAGE_CLICK_PROCESSED',preds}, function(response) {console.log(response);});
          // });


          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   var currTab = tabs[0].id;
          //   var url = "";
          //   if (currTab) { // Sanity check
          //     message = {action: 'IMAGE_CLICK_PROCESSED',url,preds};
          //     chrome.tabs.sendMessage(currTab, message);
          //   }
          // });
          // Break if found
      }
  }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
  });
  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}


 chrome.runtime.onInstalled.addListener(function() {
    // chrome.storage.sync.set({color: '#3aa757'}, function() {
    //   console.log('The color is green.');
    // });
    init();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'developer.chrome.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
