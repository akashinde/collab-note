require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'local_public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/local_public/index.html"));
});

app.get("/token", (req, res) => {
    try {
        const identity = "contributor";

        syncGrant = new SyncGrant({
            serviceSid: process.env.SYNC_SERVICE_SID,
        });
        
        const token = new AccessToken(
            process.env.ACCOUNT_SID,
            process.env.API_KEY,
            process.env.API_SECRET,
            {identity: identity}
        );

        token.addGrant(syncGrant);
        token.identity = identity;

        res.send({
            identity: identity,
            token: token.toJwt()
        });
    } catch (error) {
        throw error
    }
});

app.listen(PORT, () => {
    console.log("Server is listening on PORT:", PORT);
});

const AccessToken = require("twilio").jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;