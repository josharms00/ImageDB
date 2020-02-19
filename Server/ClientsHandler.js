var ITPpacket = require('./ITPpacketResponse'),
    singleton = require('./Singleton');

module.exports = {

    handleClientJoining: function (sock) {
        console.log('CLIENT-' + sock.remotePort + ' is connected at timestamp: ' + singleton.getTimestamp());
        sock.on('data', readRespond);
        sock.on('close', function(err, data) {
            if(err) throw err;
            sock.destroy();
            console.log('CLIENT-' + sock.remotePort + ' closed the connection.');
        });
        function readRespond(data) {
            var version = data.slice(0,3);
            var req = data.slice(3, 4);
            var imgName = data.slice(4, 12).toString('utf8').replace(/\0/g, '');;
            console.log('CLIENT-' + sock.remotePort + " Request: \n\n" + 
                    "  --Verson: " + version.readUIntBE(0, 3) + 
                    "\n  --Request Type: " + req.readUInt8(0) +
                    "\n  --Image Name: " + imgName + ".jpg" + "\n\n");
            ITPpacket.init(data);
            ITPpacket.getPacket(function(packet){
                if(ITPpacket.getLength() == 12)
                   sock.write(packet);
                else
                  console.log("oops");
            });

        }
    }
};


