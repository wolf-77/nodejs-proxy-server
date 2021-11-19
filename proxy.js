const net = require('net');
const proxy = net.createServer();

proxy.on("connection", (incomeing) => {
    incomeing.once('data', data => {
        console.log(data.toString());
        let req = data.toString().split(' ');
        let port = req[0] === 'GET' ? 80 : 443;
        let host = req[1].split(':')[0];

        const target = net.createConnection({host: host, port: port}, () => {
            console.log('Proxy Connected to Target');
        });

        if(port == 443) {
            incomeing.write("HTTP/1.1 200 OK\r\n\r\n");
        } else {
            target.write(data);
        }

        incomeing.pipe(target);
        target.pipe(incomeing);

        target.on('error', () => console.log('error from target'));
        incomeing.on('error', () => console.log('error from proxy'));
    });
});

proxy.on("error", (err) => {
    console.log("Some internal server error occurred");
    console.log(err);
});

proxy.on("close", () => {
    console.log("Client disconnected");
});

proxy.listen({host: '127.0.0.1', port: 3000},() => console.log(proxy.address()));