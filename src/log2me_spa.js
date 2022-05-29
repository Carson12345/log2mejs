import Log2MeJS from "./log2me_sender.js";

export default {
    init: () => {
        try {
            const l2m = Log2MeJS();
            const l2mConfig = l2m.getConfig();
            window.l2mEarlyLogs = [];
            l2m.init({});
            window.addEventListener('DOMContentLoaded', function () {
                if (l2mConfig.l2mReceiveMode === 'web_rtc' && l2mConfig.l2mPID) {
                    l2m.loadPeerJS(function () {
                        var peer = new Peer();
                        peer.on('open', function (id) {
                            console.log('My peer ID is: ' + id);
                            const conn = peer.connect(l2mConfig.l2mPID);
                            conn.on('open', function () {
                                console.log("Started Connection ...");
                                l2m.init({
                                    rtcConn: conn,
                                    domReady: true
                                });
                            });
                        });
                    })
                } else {
                    l2m.init({
                        domReady: true
                    });
                }
            });
        } catch (error) {
            console.log(error);
            console.log("Unable to init Log2MeJS");
        }
    }
}