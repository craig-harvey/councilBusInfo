const Alexa = require('ask-sdk-core');
const axios = require('axios');

var defaultStopId = '001429';  // Stop ID for the bus stop

var busToStopMapping = {
  377: '001429',
  375: '001338',
  378: '001338',
  61: '001338'
};

async function fetchBusInfo(busNumber) {
  var response = null;
  console.log('>>> fetching info ' + busNumber);

  try {
    if (!busNumber || !busToStopMapping[busNumber]) {
      console.log('Invalid bus number.');
      return {};
    }
    try {
      console.log('>>> Fetching bus information for bus stop:', busToStopMapping[busNumber]);
      response = await axios.get('https://jp.translink.com.au/api/stop/timetable/' + busToStopMapping[busNumber]);
      console.log('>>> Response:', response);
    } catch (err) {
      console.log('>>> ERRORT:', err);
      console.error(err);
    }

    if (!response || !response.data) {
      console.log('>>> No data returned.');
      return {};
    }

    if (!response.data.departures || response.data.departures.length === 0) {
      console.log('>>> No departures found.');
      return { "busNumber": response.data.routes[0].headSign };
    }
    console.log('>>> dataa:', response.data);

    const matchingDeparture = response.data.departures.find(
      dep => dep.headsign == busNumber
    );

    if (!matchingDeparture) {
      console.log('>>> No matching departure found.');
      return {};
    }
    console.log('>>> Matching departure:', matchingDeparture);
    var nextBus = {
        "busNumber": matchingDeparture.headsign,
        "due": matchingDeparture.departureDescription
    };
    console.log('>>> Next Bus:', nextBus);
    return nextBus;
  } catch (error) {
    console.log('>>>>> Error fetching bus information:', error);
    console.error(error);
  }
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('>>> LAUNCHED');

    const speechText = 'Welcome to the bus times skill.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Welcome to the bus times skill.', speechText)
      .getResponse();
  }
};

// Actual Handler to do the main work
const GetNextBusIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
           Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNextBus';
  },
  async handle(handlerInput) {
    console.log('>>> Handling Intent');
    //TODO: Add logic to get bus number from user input if needed
    const busInfo = await fetchBusInfo(375);

    let speechText;
    if (!busInfo.busNumber || !busInfo.due) {
      speechText = 'No more buses are scheduled for today.';
    } else {
      speechText = `The next bus is due ${busInfo.due}.`;
    }
    
    console.log('>>> HERE [' + speechText + ']');
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Next Bus Information', speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
           Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me for the next bus times at your designatedstop.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
           (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Goodbye', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log('>>> Session Ended');

    // Any clean-up logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I don\'t understand your command. Please say it again.')
      .reprompt('Sorry, I don\'t understand your command. Please say it again.')
      .getResponse();
  }
};

// Lambda handler function to route all inbound requests
let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        GetNextBusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context); 
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};

exports.fetchBusInfo = fetchBusInfo; // Export the function for testing purposes