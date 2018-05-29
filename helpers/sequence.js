// broken code, let use mogoose as well
const appConfig = require('../config.js');
const MongoClient = require('mongodb').MongoClient;

function getNextSequence(name) {
  let url;
  const {
    authEnabled, username, password, host, mongodb,
  } = appConfig.database.mongo;

  if (authEnabled) {
    url = `mongodb://${username}:${password}@${host}/${mongodb}?authSource=admin`;
  } else {
    url = `mongodb://${host}`;
  }

  console.log(' Mongo URL::::::::::::::::', url);

  const seq = MongoClient.connect(url, (err, client) => {
    if (err) {
      return Math.random().toString(10).substring(3, 12);
    }

  console.log(' getNextSequence: ', name);
    const db = client.db(mongodb);
    const find = db.counters.find();
    console.log( '  find .........................', JSON.stringify(find));


    const ret = db.counters.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
    );


    db.close();
    console.log(' callback ret.seq', ret.seq);
    return ret.seq;
  });

  console.log(' getNextSequence SEQ: ', seq);

  return seq;
}

module.exports = { getNextSequence };
