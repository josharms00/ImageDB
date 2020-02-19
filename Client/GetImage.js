
var net = require('net');
var fs = require('fs');
var ITPpacket = require('./ITPpacketRequest');

var opn = require('opn');

var version;
var resType;
var seqNum;
var ts;
var imgsize;

var name;
var ver;
var cached = false;

var net = require('net');
var HOST = '127.0.0.1';
var PORT = 3001;
var client = new net.Socket();


// iterate through command line argument to find version and image name
for(var i = 0; i < process.argv.length; i++){
    if(process.argv[i] == "-v")
        ver = process.argv[i + 1];
    else if(process.argv[i] == "-q")
        name = process.argv[i + 1].toLowerCase();
}
if (name == undefined)
    console.log("-q tag must be used to perform a query");
else{
    fs.readdir(__dirname + '\\image_cache', function(err, items) {
        for (var i=0; i<items.length; i++) {
            
            if (items[i] == name)
            {
                opn("image_cache/" + name).then(() => {});
                console.log("Image retrieved from cache.");
                cached = true;
            }              
        }
    });

    // set default version
    if(ver == undefined)
        ver = 3314;
    // initialize packet 
    ITPpacket.init(ver, name);
    var image = ITPpacket.getpacket();
}
client.connect(PORT, HOST, function() {
    console.log('Connected to ImageDB server on: ' + HOST + ':' + PORT);
    if(!cached)
        client.write(image);
});
client.on('data', function(data) {

    // extract packet data
    version = data.slice(0,3);
    resType = data.slice(3,4);
    
    // display packet data
    if(resType.readUInt8(0) == 1){
        // if image is attached extract this data
        seqNum = data.slice(4,8);
        ts = data.slice(8,12);
        imgsize = data.slice(12,16);
        
        // extract image data
        img = data.slice(16, imgsize.readUInt32BE(0));
       console.log('Server sends: \n\n' + "  --Version: " + 
       version.readUIntBE(0, 3) + "\n  --Response Type: " + resType.readUInt8(0)
       + "\n  --Sequence Number: " + seqNum.readUInt32BE(0)
       + "\n  --Timestamp: " + ts.readUInt32BE(0)
       + "\n  --Image Size: " + imgsize.readUInt32BE(0) + "\n\n");
       
       // open image in image viewer
       fs.writeFile("image_cache/" + name, img, function() {
            opn("image_cache/" + name).then(() => {});
       });
      
    } else 
        console.log("Image not found.");
     
    client.destroy();
});
client.on('close', function() {
    console.log('Connection closed');
});
client.on('error', function(){
    console.log('error');
})