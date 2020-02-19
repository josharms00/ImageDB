# ImageDB
A project I made in school using node.js. The server has a database of images that a client can connect and request. If the image exists then it will save it in the client directory and display it. 

To run server navigate to server directory and type:
  node ImageDB 

To request an image from the server navigate to the client directory and type:
  node GetImage -s 127.0.0.1:3000 -q <image-name> [-v <version>]
  
The server can host multiple clients and handle multiple requests. 
