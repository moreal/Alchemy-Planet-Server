let index = require('./index');
let myQuery = require('./myQuery');

exports.onMessageFindName = (ws, data) => {
    findName(data.playerId, (res) => {
        console.log('findName: ' + res);
        let dataObj = { playerId: res.playerId, playerName: res.playerName };
        let sendObj = { status: 'Name', data: JSON.stringify(dataObj) };
        ws.send(JSON.stringify(sendObj));
    });
}

exports.onMessageInsertName = (ws, data) => {
    insertName(data.playerId, data.playerName, (res) => {
        console.log('insertName: ' + res);
    });
}

exports.onMessageDeleteName = (ws, data) => {
    deleteName(data.playerId, (obj) => {
        console.log('deleteName: ' + obj);
    });
}

exports.onMessageUpdateName = (ws, data) => {
    updateName(data.playerId, data.playerName, (res) => {
        console.log('updateName: ' + res)
    });
}

const findName = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.findOne('Name', query, callback);
}

const insertName = (playerId, playerName, callback) => {
    let obj = { playerId: playerId, playerName: playerName };
    myQuery.insertOne('Name', obj, callback);
}

const deleteName = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.deleteOne('Name', query, callback);
}

const updateName = (playerId, playerName, callback) => {
    let query = { playerId: playerId };
    let values = { $set: { playerName: playerName } };
    myQuery.updateOne('Name', query, values, callback);
}

index.MongoClient.connect(index.url, { useNewUrlParser:true }, (err, db) => {
    if(err) throw err;
    let dbo = db.db('mydb');
    dbo.createCollection('Name', (err, res) => {
        if(err) throw err;
        dbo.collection('Name').createIndex( { playerId: 1 }, { unique: true } );
        db.close();
    });
});