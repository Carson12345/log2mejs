function loadDynamicScript(url, callback){
    let lId = 'l2m-peer-js';
    const existingScript = document.getElementById(lId);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = url;
      script.id = lId;
      document.head.appendChild(script);
      script.onload = function () {
        if (callback) {
            callback();
        }
      };
    }
    if (existingScript) {
        callback();
    }
};
var l2mReceiver = new Peer();
    l2mReceiver.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        document.getElementById('peer-id').innerHTML = id;
        l2mReceiver.on('connection', function(conn) {
            console.log('Connection Received: ', conn);
            conn.on('open', function() {
                console.log('Connection Opened: ', conn);
                // Receive messages
                conn.on('data', function(data) {
                    console.log("Received: ", data);
                    document.getElementById('l2m-received-container').innerHTML += '<pre>' + JSON.stringify(data,undefined, 2) + '</pre>';
                });
            });
        });
});