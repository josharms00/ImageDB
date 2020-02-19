var fs = require('fs');
let singleton = require('./Singleton');

var request;
var version;
var ResponseType;
var imgLength;
var imgData;
var image;
var img;

module.exports = {

    init: function(req) {
        
        version = req.slice(0,3);
        image = req.slice(4, 8);
        img = image.toString('utf8').replace(/\0/g, ''); //remove trailing whitespace from name
        request = req;

        ResponseType = 0;
        
    },

    //--------------------------
    //getlength: return the total length of the ITP packet
    //--------------------------
    getLength: function() {
        return request.length;
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function(func) {
        // interate through images until a match is found
        fs.readdir(__dirname + '\\images', function(err, items) {
            for (var i=0; i<items.length; i++) {
               if(items[i].toLowerCase().indexOf(img) !== -1){
                    ResponseType = 1;
                    // image found and extract image data    
                    fs.readFile(__dirname + '\\images\\' + items[i], function (err, data) {
                        if (err) console.log(err);
                        imgLength = data.length;
                        imgData = data;
                        // create new packet for header info
                        var packet = new Buffer.alloc(16);
                        packet.writeIntBE(version.readUIntBE(0, 3), 0, 3);
                        packet.writeUInt8(ResponseType, 3);
                        packet.writeUInt32BE(singleton.getSequenceNumber(), 4);
                        packet.writeUInt32BE(singleton.getTimestamp(), 8);
                        packet.writeUInt32BE(imgLength, 12);
                        var payload = new Buffer.from(imgData);
                        // encapsulate header info with payload into one packet
                        const buffPacket = Buffer.concat([packet, payload], 16 + imgLength);
                        // use callback function to return the packet
                        func(buffPacket);
                    });  
                }
                    
            }

            // if no match notify client
            if(ResponseType == 0) {
                var noImg = new Buffer.alloc(4);
                noImg.writeIntBE(version.readUIntBE(0, 3), 0, 3);
                noImg.writeUInt8(ResponseType, 3);
                func(noImg);
            }
            
        });

        
    }
};