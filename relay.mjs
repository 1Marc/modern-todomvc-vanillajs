import { IoRemotesService } from '@m-ld/m-ld/ext/socket.io-server';
import { Server } from 'socket.io';

const io = new Server(3001, {
	cors: { origin: "*", methods: ["GET", "POST"] }
});
new IoRemotesService(io.sockets).on('error', console.error);
io.httpServer.on('listening', () => {
	console.log(`Relay service listening on ${io.httpServer.address().port}`);
});
