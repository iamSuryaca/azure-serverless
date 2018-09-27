
const axios = require("axios");
const uuid = require("uuid").v4;
const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("updateEvent function processing request");
  if (req.body) {
    let eventData = req.body;
    publishToEventGrid(eventData)
    //connect to MongoDB
    mongo.connect(
      process.env.events_COSMOSDB,
      (err, client) => {
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("project4");
        eventId = parseInt(req.query.id);
        db.collection("events").updateOne(
          { id: eventId },
          {
            $set: {
              name: eventData.name,
              title: eventData.title,
              location: eventData.location,
              skill: eventData.skill,
              headshotUri: eventData.headshotUri,
              userid: 1,
              username: "Surya",
              email: "suryac.akasam@gmail.com",
              subEventTime: new Date()

            }
          },
          (err, eventData) => {
            if (err) send(500, err.message);
            context.log("eventData", eventData);
            send(200, eventData);
          }
        );
      }
    );
  } else {
    context.res = {
      status: 400,
      body: "Please pass name in the body"
    };
  }
};
//Helper function to build the response
function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}

//Helper function to build the response
function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}

//Helper function to build the respond
//Helper function to publish event to eventGrid
function publishToEventGrid(eventData) {
  console.log("in publishToEventGrid function");
  const topicKey = process.env.eventgrid_TopicKey
  const topicHostName = "";
  let data = eventData;
  let events = [
    {
      id: uuid(),
      subject: "Event Subscribes Successfully",
      dataVersion: "1.0",
      eventType: "Microsoft.MockPublisher.TestEvent",
      eventTime: new Date(),
      data: eventData
    }
  ];
  console.log("Here is the event data: ", events[0].data);
  axios.post(topicHostName, events, {
    headers: { "aeg-sas-key": topicKey }
  });
}

