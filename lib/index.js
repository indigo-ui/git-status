"use strict";

const spawno = require("spawno")
    , oargv = require("oargv")
    , parse = require("parse-git-status")
    ;

/**
 * gitStatus
 * A git-status wrapper.
 *
 * [`parse-git-status`](https://github.com/jamestalmage/parse-git-status) is used to parse the output.
 *
 * @name gitStatus
 * @function
 * @param {Object} options The `spawno` options.
 * @param {Object} [options.gitStatus] gitStatus options.
 * @param {Boolean} [options.gitStatus.ignore_LF_to_CRLF] Ignores LF to CRFL git warning.
 * @param {Function} cb The callback function.
 */
module.exports = function gitStatus (options, cb) {

    if (typeof options === "function") {
        cb = options;
        options = {};
    }

    spawno("git", ["status", "--porcelain", "-z"], options, (err, stdout, stderr) => {
        let showStderr = stderr;
        if (options.gitStatus && options.gitStatus.ignore_LF_to_CRLF) {
            const stderrLines = stderr.trim().split(/\n/);
            const stderrExceptLineEndingWarnings = stderrLines.filter(line => {
                return (line !== 'The file will have its original line endings in your working directory.' &&
                !line.startsWith('warning: LF will be replaced by CRLF in'));
            });
            showStderr = stderr && stderrExceptLineEndingWarnings.length;
        }

        if (err || showStderr) { return cb(err || stderr); }
        cb(null, parse(stdout));
    });
};