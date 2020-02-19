
// Some code needs to added that are common for the module
var timer = Math.floor(Math.random() * 999);
var sequence = Math.floor(Math.random() * 999);

module.exports = {
    init: function() {
       // init function needs to be implemented here //
       
       setInterval(function(){
        timer++;
       }, 10);
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
      // Enter your code here //
        sequence++;
        return sequence;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timer;
    }


};