let myQuery = require('./myQuery');

exports.onMessageFindCharacters = (ws, data) => {
    findCharacters(data.playerId, (res) => {
        console.log('findCharacters: ' + res);
        let dataObj = [];
        for(let i = 0; i < res.length; i++) {
            dataObj[i] = { playerId: res[i].playerId, characterId: res[i].characterId, level: res[i].level, health: res[i].health, speed: res[i].speed, attackPower: res[i].attackPower };
        }
        let sendObj = { status: 'Character', data: JSON.stringify(dataObj) };
        ws.send(JSON.stringify(sendObj));
    });
}

exports.onMessageInsertCharacter = (ws, data) => {
    insertCharacter(data.playerId, data.characterId, data.level, data.health, data.speed, data.attackPower, (res) => {
        console.log('insertCharacter: ' + res);
    });
}

exports.onMessageDeleteCharacter = (ws, data) => {
    deleteCharacter(data.playerId, data.characterId, (obj) => {
        console.log('deleteCharacter: ', obj);
    });
}

exports.onMessageDeleteCharacters = (ws, data) => {
    deleteCharacters(data.playerId, (obj) => {
        console.log('deleteCharacters: ' + obj);
    });
}

exports.onMessageUpdateCharacter = (ws, data) => {
    updateCharacter(data.playerId, data.characterId, data.level, data.health, data.speed, data.attackPower, (res) => {
        console.log('updateCharacter: ' + res);
    });
}

const findCharacters = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.findMany('Character', query, callback);
}

const insertCharacter = (playerId, characterId, level, health, speed, attackPower, callback) => {
    let obj = { playerId: playerId, characterId: characterId, level: level, health: health, speed: speed, attackPower: attackPower };
    myQuery.insertOne('Character', obj, callback);
}

const deleteCharacter = (playerId, characterId, callback) => {
    let query = { playerId: playerId, characterId: characterId };
    myQuery.deleteOne('Character', query, callback);
}

const deleteCharacters = (playerId, callback) => {
    let query = { playerId: playerId };
    myQuery.deleteMany('Character', query, callback);
}

const updateCharacter = (playerId, characterId, level, health, speed, attackPower, callback) => {
    let query = { playerId: playerId, characterId: characterId };
    let values = { $set: { level: level, health: health, speed: speed, attackPower: attackPower } };
    myQuery.updateOne('Character', query, values, callback);
}