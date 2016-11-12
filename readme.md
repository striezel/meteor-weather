# Meteor Weather

"Whether the weather will weather, the wether does not know."

This readme is still incomplete and will be filled with relevant information
in the not so far future.

# Known issues

Not an issue of this app, but rather a Meteor issue:
When you start the app the first time (via `meteor run`), you might get an
error message like this:

    (STDERR) Error: The babel-runtime npm package could not be found in your node_modules
    (STDERR) directory. Please run the following command to install it:
    (STDERR)
    (STDERR)   meteor npm install --save babel-runtime

This seems to be a known issue with Meteor 1.4.2/1.4.2.1. See
<https://forums.meteor.com/t/meteor-1-4-2-1-is-an-important-patch-for-1-4-2-users/31190>
for more information as to why this error occurs. Long story short: Much of
the stuff in Meteor now depends on this NPM package.

The solution is - as the error message says - to install the missing package
by typing

    meteor npm install --save babel-runtime

After that the app will start.
