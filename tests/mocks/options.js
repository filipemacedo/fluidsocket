const namespaces = {
	admin: {
		listeners: {
			user: {
				create: {
					action: ({ body }) => {
						console.log(body)
					},
					guards: []
					after: []
				}
			}	
		},
		guards: []
	}
}

module.exports = namespaces