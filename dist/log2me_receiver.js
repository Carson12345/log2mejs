'use strict';

var l2mReceiver = new Peer();
    l2mReceiver.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        document.getElementById('peer-id').innerHTML = id;

        document.getElementById('code-to-paste').innerText = `<script src="https://unpkg.com/log2mejs@latest/dist/log2me.js"></script>`;

        document.getElementById('url-to-go').innerText = `<your-original-url>?l2m_dbg_id=L2M&l2m_receive_mode=web_rtc&l2m_web_rtc_pid=${id}`;

        document.getElementById('url-to-go-ui').innerText = `<your-original-url>?l2m_dbg_id=L2M&l2m_receive_mode=ui`;

        l2mReceiver.on('connection', function(conn) {
            console.log('Connection Received: ', conn);
            conn.on('open', function() {
                console.log('Connection Opened: ', conn);
                // Receive messages
                conn.on('data', function(data) {
                    console.log("Received: ", data);
                    if (data.url) {
                        document.getElementById('peer-url').innerText = data.url;
                    }
                    delete data.url;
                    delete data.debugId;
                    document.getElementById('l2m-received-container').innerHTML += '<code class="text-sm w-pre-wrap d-block mb-2 border-bottom p-2">' + JSON.stringify(data,undefined, 2) + '</code>';
                });
            });
        });
});
