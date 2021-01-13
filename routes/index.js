var express = require('express');
var router = express.Router();

// execute shell commands (in this case, coder-cli)
const { exec } = require("child_process");

/* GET home page. */
router.get('/', function (req, res, next) {
  // get list of Coder workspaces via coder-cli
  exec("coder envs ls --output json", (error, stdout, stderr) => {
    if (error) {
      res.render(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.render(`stderr: ${stderr}`);
      return;
    }
    // no errors, render the index page
    let workspaces = JSON.parse(stdout)

    // pass on the workspaces list and our environment variables
    res.render('index', { workspaces, env: process.env });
  });
});

module.exports = router;
