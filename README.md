# Fluid socket

*Package to create socket events dynamically and at high level.*

> The purpose of the package is to allow you to work with socketIO in a
> "fluent" (humanized) way


## How we solve the problem

No longer use your traditional code

    const io = require('socket.io').listen(3000)
	
	io
	  .of('/admin')
	  .on('connection', (client) => {
		  client.on('user.create', data => {
			  //code...
		  })
		  
		  client.on('user.update', data => {
			  //code...
		  })
	  })
	  
Now you can use our way

    {  
	    "admin":{  
		    "listeners":{  
			    "user":{  
				    "create": {  
					    "action": userService.create() 
				    },
					
					"update": {
						"action": userService.update()
					}  
			    }  
		    }  
	    }  
    }

## Namespace guards
*We constantly need to put a guard before releasing a new connection or even assign data in connection with the client.*

When it is your case, simply add the guard in the **guards attribute**.

    {
	    "admin": {
		    "listeners": {
			    //...
			},
			"guards": [
				isAdmin()
			] 
	    }
	}

The namespace guard function is given two parameters ***client and next***

| client | next |
|--|--|
| It is the object of the connection with the client, **you can add new attributes** in this object and redeem at any moment in the events.  | If you want to authorize the passage through that guard, just invoke the **next function** |

***Namespace Guard Example***

    const isAdmin = () => {
	    return (client, next) => {
		    client.isAdmin = true
			
			return next()
		}
	}

## Events
*You will always use one or more events while working with socket, our idea is just to facilitate this.*

***Guards***
The events also have guards and the purpose is to check if the data issued conforms to **the rule(s) of the guard(s)**.

When it is your case, simply add the guard in the **guards attribute**.

    {
	    "admin": {
		    "user": {
			    "create": {
				    "action": userService.create()
			    },
			    "guards": [
				    ifUsernameNotExists()
			    ]
		    }
	    }
	}


*Example*

> The guard may even remember the middleware, but it has the power to issue errors in real time.


    const ifUsernameNotExists = () => client => async (data, next) => {
		const { username } = data
		
		const hasUsername = await userCollection.hasUsername(username)
		
		return (! hasUsername)
					? next()
					: client
						.emit("customError", {
							"message": "username already registered."
						})
	}
