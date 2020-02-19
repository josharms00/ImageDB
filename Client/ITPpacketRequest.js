
const packet = Buffer.alloc(12);


module.exports = {


    init: function(version, image) {
        
        img = image.replace('.jpg', ''); 
        packet.writeIntBE(version, 0, 3); //assign 3 bytes for version
        packet.writeUInt8(1, 3); //1 byte for request type
        packet.write(img.toString(), 4, 8);
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getpacket: function() {
        return packet;
    }


};

