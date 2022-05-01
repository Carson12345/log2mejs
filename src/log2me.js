
const l2mUrlParams = new URLSearchParams(window.location.search);

const l2mDebugId = window.l2m_dbg_id || l2mUrlParams.get('l2m_dbg_id');
const l2mReceiveMode = window.l2m_receive_mode || l2mUrlParams.get('l2m_receive_mode') || 'ui';
const l2mPID = window.l2m_web_rtc_pid || l2mUrlParams.get('l2m_web_rtc_pid');

var Log2MeJS = function (config) {
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

    // Simple: Make the DIV element draggable:
    // Reference https://www.w3schools.com/howto/howto_js_draggable.asp
    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }

        elmnt.addEventListener('touchmove', function (e) {
            // grab the location of touch
            var touchLocation = e.targetTouches[0];

            // assign box new coordinates based on the touch.
            elmnt.style.left = touchLocation.pageX + 'px';
            elmnt.style.top = touchLocation.pageY + 'px';
        })

        /* record the position of the touch
        when released using touchend event.
        This will be the drop position. */

        elmnt.addEventListener('touchend', function (e) {
            // current box position.
            const x = parseInt(elmnt.style.left);
            const y = parseInt(elmnt.style.top);
        })
    }

    let log2UI = function (message) {
        const dS = new Date().toISOString();
        console._original_console_log_func('triggered');
        const logger = document.getElementById('l2m-log-container-body');
        const wrapMsg = function (m) {
            return '<div style="padding: 10px; font-family: courier; font-size: 12px; display: flex;">' + '<span style="width: 15%;word-break: break-all; padding: 6px; border-right: 1px solid #DDD;">' + dS + '</span>' + '<span style="padding: 6px; width: 85%;word-break: break-all;">' + m + '</span>' + '</div>';
        };
        logger.innerHTML += wrapMsg(message);
        console._original_console_log_func(message);
    }

    return {
        loadPeerJS: function(callback) {
            loadDynamicScript('https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js', function(){
                callback();
            })
        },
        init: function (initConfig) {
            let processLog = function(message) {
                let raw = typeof message == 'object' ? message : {
                    message,
                    stack: ""
                };
                if (l2mReceiveMode === 'ui') {
                    log2UI(raw.message);
                }
                if (l2mReceiveMode === 'web_rtc') {
                    // Receive messages
                    initConfig.rtcConn.on('data', function(data) {
                        console.log('L2M_RTC_RECEIVED:', data);
                    });
                    // Send messages
                    initConfig.rtcConn.send({
                        url: window.location.href,
                        date: new Date().toISOString(),
                        ... raw,
                        debugId: l2mDebugId
                    });
                    // log2UI(raw.message);
                }
            }

            // ui init
            const logUIHtml = '<div id="l2m-log-container" style="max-height: 450px; position: fixed; z-index: 99999; bottom: 0px; left: 0px; width: 90%;"><div id="l2m-log-container-header" style="background-color: rgba(222,225,225,0.8); padding: 10px; border-bottom: 1px solid #DDD; font-size: 16px; cursor: pointer;">Console Log & Error (Drag to move me)</div><div id="l2m-log-container-body" style="max-height: 400px; overflow: scroll; background-color: rgba(240,240,240,0.8);"></div></div>';
            const con = document.createElement('div');
            con.innerHTML = logUIHtml;
            document.body.append(con);

            dragElement(document.getElementById("l2m-log-container"));

            // function init
            const old = console.log;
            console._original_console_log_func = old;
            console.log = processLog
            console.error = console.debug = console.info = console.log
            window.addEventListener('error', function (event) {
                processLog({
                    message: event.error.message,
                    stack: event.error.stack
                });
            });
            console.log("Log2Me Instance Connected");
        }
    }
}

// Only run if in debug mode
if (l2mDebugId) {
    try {
        window.addEventListener('DOMContentLoaded', function () {
            let l2m = Log2MeJS();
            if (l2mReceiveMode === 'web_rtc' && l2mPID) {
                l2m.loadPeerJS(function(){
                    console.log(l2mPID);
                    var peer = new Peer();
                    peer.on('open', function(id) {
                        console.log('My peer ID is: ' + id);
                        const conn = peer.connect(l2mPID);
                        conn.on('open', function() {
                            console.log("Started Connection ...");
                            l2m.init({
                                rtcConn: conn
                            });
                        });
                    });
                })
            } else {
                l2m.init();
            }
        });   
    } catch (error) {
        console.log("Unable to init Log2MeJS");
    }
}
