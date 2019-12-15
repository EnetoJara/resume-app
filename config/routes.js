const fs = require("fs");
const path = require("path");

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop-qrstuvwxyz-0123456789-_";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

fs.writeFileSync(
    path.join(__dirname, "../.env.routes"),
    `ROUTE_REGISTER=${makeid(40)}
ROUTE_LOGIN=${makeid(40)}
ROUTE_GET_ALL_USERS=${makeid(40)}
ROUTE_GET_SKILLS=${makeid(40)}
ROUTE_GET_SKILL_TYPE_BY_ID=${makeid(40)}
ROUTE_PARAM_SKILL=${makeid(5)}`
);
