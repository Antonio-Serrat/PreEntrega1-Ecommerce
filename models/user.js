const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

class User {
    constructor() {
        this.nombreArchivo = path.join(__dirname, "../public/database/users.json");
    }

    async save(id, name, email, password) {
        let user = {
            id: id,
            name: name,
            email: email,
            password: password
        }
    }


// FUTURO LOGIN


}

module.exports = User;