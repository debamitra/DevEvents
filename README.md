
 People can use this app to discover technology-centered events happening online in the near future.
 This webapp is a side/practice project to learn javascript and build an app end to end.

Deployed here : https://discover-tech-meets-app.herokuapp.com/

## Tech Stack :
  * MongoDB
  * Express
  * React
  * Node

## Local Setup
1. Clone project
2. Install Node environment
3. Setup  a MongoDB database, get the URL, create a .env file inside project directory and copy the URL to this :
     ```  MONGODB_URL= "" ```
5. Repace the package.json scripts content with : ( This is because of a bug, temporary fix)
       ```
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject",
       "start-server": "node server/index.js",
       "start-app": "npm run build && npm run start-server"
       ```
       
4. Execute the following commands in root directory of the project.
 ```
   npm install
   npm run start-app
 ```




