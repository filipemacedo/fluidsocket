const namespaces = {
	admin: {
		listeners: {
			user: {
				create: {
					action: userService.create()
					guards: [ ifUsernameNotExists() ]
					after: [ userNamespaceAdmin.userCreated() ]
				}
			}	
		},
		guards: [ userIsAdmin() ]
	}
}

module.exports = namespaces