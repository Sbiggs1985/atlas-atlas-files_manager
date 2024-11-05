<h3>atlas-atlas-files_manager</h3>

<h2>Project Steps</h2>
<ul>
  <li>
    0. 0. Redis Utils
    Creating the RedisClient class in redis.js, we imported the redis library and set up Redis client methods to manage connections, retrieve, set, and delete values.
  </li>
  <li>
    1. MongoDB Utils
    We are imlementing the DBClient class, so we imported mongodb, read environments variables for MongoDB connection details, and define the required methods to check the connection and count documents in specific collections.
  </li>
  <li>
    2. First API
    Created server.js; this file will set up the express server, load environment variables, and listen on the specific port. Created the index.js indie the routes folder. This file will define the routes for GET/STAUS and GET/Stats endpoints. Created controllers/AppController.js; to define the logic for getStatus and getStats endpoints. It will use redisClient and dbClient utilities to check the status of Redis and MongoDB and count the documents in the users and files collections.
  </li>
  <li>
    3. Create a new user
    NEED CONTENT
  </li>
</ul>
