const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("Subscribe Event function processing request");
  if (req.body) {
    let eventData = req.body;
    //connect to MongoDB
    mongo.connect(
      process.env.events_COSMOSDB,
      (err, client) => {
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("project4");
        speakerId = parseInt(req.query.id);
        db.collection("events").updateOne(
          { id: speakerId },
          {
            $set: {
              name: eventData.name,
              title: eventData.title,
              location: eventData.location,
              skill: eventData.skill,
              headshotUri: eventData.headshotUri,
              userid: 1,
              username: "Surya",
              email: "suryac.akasam@gmail.com"

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
