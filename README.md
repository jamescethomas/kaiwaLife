## kaiwaLife
Social networking web appliaction to connect teachers and learners of Japanese and English

###a Developer Installation

kaiwaLife using npm for package controll. Install [node.js and npm](https://docs.npmjs.com/getting-started/installing-node) to get going.

1. Once you've cloned the repository go to the folder and run
   ```
   npm install
   ```
   to download the necessary packages
2. Next it's time to install [MongoDB](http://docs.mongodb.org/master/installation/)
3. Once that's finished you'll need to create a folder for the database. 
   It's nice to have the database in a separate location to avoid commiting the data to git
4. Let's start up the database
   ```
   mongod --dbpath /PATH/TO/DB
   ```
5. Lastly start the node server
   ```
   node app.js
   ```

It's often useful to interface directly with the database.
This can be accomplished with the following
   ```
   $ mongo
   	> use kaiwalife
   ```
