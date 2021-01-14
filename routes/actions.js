/** actions/
 * 
 * actually modifies stuff within a Coder deployment 
 *
 * */

var express = require('express');
var router = express.Router();

const axios = require('axios');

// execute shell commands (in this case, coder-cli)
const { exec } = require("child_process");

router.get('/', function (req, res, next) {
    res.status(403);
    res.send();
})


/* POST create workspace. */
router.post('/create_workspace', async (req, res, next) => {


    /**
     * [extremely hacky] attempt to find the Coder URL based off this web app's URL
     * this will not succeed if this is not hosted on a Coder workspace
     * 
     * extended for visibility
    */
    let coder_url = req.get("host"); // devurl.coder.tld
    coder_url = coder_url.split("."); // Array: [devurl, coder, tld] 
    coder_url.shift() // Array: [coder, tld]
    coder_url = coder_url.join("."); // coder.tld
    coder_url = "http://" + coder_url; // http://coder.tld (should forward to HTTPS if enabled, but is backwards-compatable)

    // split image:tag into two seperate vars
    const [image, tag] = req.body.image.split(":");
    const name = req.body.name;

    /** attempt to create a Coder workspace
     * 
     * this will not currently work for multi-organization deployments
     * (however, you can potentially fetch the default org by hitting ${coder_url}/api/private/orgs)
     *  */

    // output is JSON, so we put a |||| to split responses (hacky)
    exec(`coder envs create ${name} --image ${image} --tag ${tag}`, (error, stdout, stderr) => {

        // bad way to see if it succeeds
        if (stderr.includes("success")) {
            exec(`coder envs ls --output json`, (error, stdout, stderr) => {

                let envs = JSON.parse(stdout);

                // look for this environment by the name
                const this_env = envs.find(env => env.name == name);

                // let's redirect to the Coder screen now :)
                res.redirect(`${coder_url}/environments?env=${this_env.id}`)


            });

        } else {
            res.send(stderr + "<br /><hr /><a href=\"/\">Back</a>");
        }

    });
});

module.exports = router;
