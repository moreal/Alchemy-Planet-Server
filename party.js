let myQuery = require('./myQuery');

exports.onMessageFindParties = (ws, data) => {
    findParties(data.playerId, (res) => {
        console.log('findParties: ' + res);
        let dataObj = [];
        for(let i = 0; i < res.length; i++) {
            dataObj[i] = { playerId: res[i].playerId, partyIndex: res[i].partyIndex, slotIndex: res[i].slotIndex, characterId: res[i].characterId };
        }
        let sendObj = { status: 'PlayerParty', data: JSON.stringify(dataObj) };
        ws.send(JSON.stringify(sendObj));
    });
}

exports.onMessageInsertParty = (ws, data) => {
    insertParty(data.playerId, data.partyIndex, data.slotIndex, data.characterId, (res) => {
        console.log('insertParty: ' + res);
    });
}

exports.onMessageDeleteParty = (ws, data) => {
    deleteParty(data.playerId, data.partyIndex, data.slotIndex, (obj) => {
        console.log('deleteParty: ' + obj);
    });
}

exports.onMessageDeleteParties = (ws, data) => {
    deleteParties(data.playerId, (obj) => {
        console.log('deleteParties: ' + obj);
    });
}

exports.onMessageUpdateParty = (ws, data) => {
    updateParty(data.playerId, data.partyIndex, data.slotIndex, data.characterId, (res) => {
        console.log('updateParty: ' + res);
    });
}

const findParties = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.findMany('Party', query, callback);
}

const insertParty = (playerId, partyIndex, slotIndex, characterId, callback) => {
    let obj = { playerId: playerId, partyIndex: partyIndex, slotIndex: slotIndex, characterId: characterId };
    myQuery.insertOne('Party', obj, callback);
}

const deleteParty = (playerId, partyIndex, slotIndex, callback) => {
    let query = { playerId: playerId, partyIndex: partyIndex, slotIndex: slotIndex };
    myQuery.deleteOne('Party', query, callback);
}

const deleteParties = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.deleteMany('Party', query, callback);
}

const updateParty = (playerId, partyIndex, slotIndex, characterId, callback) => {
    let query = { playerId: playerId, partyIndex: partyIndex, slotIndex: slotIndex };
    let values = { $set: { characterId: characterId } };
    myQuery.updateOne('Party', query, values, callback);
}