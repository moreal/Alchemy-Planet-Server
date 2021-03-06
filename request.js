let index = require('./index');
let myQuery = require('./myQuery');

exports.onMessageFindRequests = (ws, data, status) => {
    findRequests(data.playerId, (res) => {
        console.log('findRequests: ' + res);
        let dataObj = [];
        let sendObj;
        if(res == null) {
            sendObj = { status: status, data: null };
        } else {
            for(let i = 0; i < res.length; i++) {
                dataObj[i] = { playerId: res[i].playerId, requestId: res[i].requestId };
            }
            sendObj = { status: status, data: JSON.stringify(dataObj) };
        }
        ws.send(JSON.stringify(sendObj));
    });
}

exports.onMessageInsertRequest = (ws, data, status) => {
    insertRequest(data.playerId, data.requestId, (res) => {
        console.log('insertRequest: ' + res);
    });
}

exports.onMessageDeleteRequest = (ws, data, status) => {
    deleteRequest(data.playerId, data.requestId, (obj) => {
        console.log('deleteRequest: ' + obj);
    });
}

exports.onMessageDeleteRequests = (ws, data, status) => {
    deleteRequests(data.playerId, (obj) => {
        console.log('deleteRequests: ' + obj );
    });
}

const findRequests = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.findMany('Request', query, callback);
}

const insertRequest = (playerId, requestId, callback) => {
    let obj = { playerId: playerId, requestId: requestId };
    myQuery.insertOne('Request', obj, callback);
}

const deleteRequest = (playerId, requestId, callback) => {
    let query = { playerId: playerId, requestId: requestId };
    myQuery.deleteOne('Request', query, callback);
}

const deleteRequests = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.deleteMany('Request', query, callback);
}

index.MongoClient.connect(index.url, { useNewUrlParser: true }, (err, db) => {
    if(err) throw err;
    let dbo = db.db('mydb');
    dbo.createCollection('Request', (err, res) => {
        if(err) throw err;
        dbo.collection('Request').createIndex( { playerId: 1, requestId: 1 }, { unique: true } );
        db.close();
    });
});