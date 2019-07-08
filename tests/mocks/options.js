const namespaces = {
	admin: {
		connect: (socket) => {
			console.log(socket.id)
		},
		disconnect: (socket) => {
			console.log(socket)
		},
		listeners: {
			user: {
				create: {
					action: () => {},
					guards: [ ],
					after: [ ]
				}
			}	
		},
		guards: [ ]
	}
}

module.exports = namespaces