const namespaces = {
	admin: {
		listeners: {
			create: {
				action: ({ body }) => {
					console.log(body)
				},
				guards: []
				after: []
			}
			
		},
		guards: []
	}
}

module.exports = namespaces