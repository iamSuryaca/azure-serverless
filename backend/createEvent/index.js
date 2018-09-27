const mongo = require("mongodb").MongoClient;

module.exports = function(context, req) {
  context.log("createEvent function processing request");
  context.log("req.body", req.body);
  if (req.body) {
    let eventData = req.body;
    //connect to Mongo and list the items
    mongo.connect(
      process.env.events_COSMOSDB,
      (err, client) => {
        context.log(err);
        context.log(client);
        let send = response(client, context);
        if (err) send(500, err.message);
        let db = client.db("project4");
        db.collection("events").insertOne(eventData, (err, eventData) => {
          if (err) send(500, err.message);

          send(200, eventData);
        });
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
