/** actions/
 * 
 * actually modifies stuff within a Coder deployment 
 *
 * */

var express = require('express');
var router = express.Router();

// execute shell commands (in this case, coder-cli)
const { exec } = require("child_process");

router.get('/', function (req, res, next) {
    res.status(403);
    res.send();
})


/* POST create workspace. */
router.post('/create_workspace', function (req, res, next) {
    // get list of Coder workspaces and images via coder-cli
    // output is JSON, so we put a |||| to split responses (hacky)
    exec("coder images ls --output json && echo \"|||||\" && coder envs ls --output json", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        // no errors, render the index page

        // seperate responses by our "|||||"
        let responses = stdout.split("|||||");

        // parse the first block of JSON (images)
        let images = JSON.parse(responses[0]);
        // parse the second block of JSON (workspaces)
        let workspaces = JSON.parse(responses[1]);

        // pass on the workspaces list and our environment variables
        res.send("hello");
    });
});

module.exports = router;
