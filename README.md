# Fluid socket

*Package to create socket events dynamically and at high level.*

> The purpose of the package is to allow you to work with socketIO in a
> "fluent" (humanized) way

## How to install

    npm i fluidsocket --s

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

    const fluidSocket = require('fluidsocket')(io)
   
    const options = {  
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
    
    fluidSocket(options)

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

## ***Events Guards***

The events also have guards and the purpose is to check if the data issued conforms to **the rule(s) of the guard(s)**.

When it is your case, simply add the guard in the **guards attribute**.

    {
	    "admin": {
		    "user": {
			    "create": {
				    "action": userService.create(),
				    "guards": [
					    ifUsernameNotExists()
				    ]
			    },
		    }
	    }
	}


***Example***

> The guard may even remember the middleware, but it has the power to issue errors in real time.
> > To learn more about emitting errors, click here.


    const ifUsernameNotExists = () => client => async (data, next) => {
		const { username } = data
		
		const hasUsername = await userCollection.hasUsername(username)
		
		return (! hasUsername)
					? next()
					: client
						.emit('customError', {
							"message": "username already registered."
						})
	}

## ***Event action***
The action is where you will carry out the business rule, remembering that it is mandatory to return a value, only so we will be able to issue after the execution.

**Example**
The data issued by the client can be retrieved in the body attribute.

    async create({ body }) {
		const userCreated = await userCollection.create(body)

		return userCreated
	}

It is also possible to signal that you want to issue error, even through actions.

## Actions making mistakes
Several times we will need to validate at runtime whether it is necessary to issue errors to the client ~~(and will often be necessary)~~.

*To signal that an error needs to be issued to the customer, you simply need to use the throw statement*

**Example**

     async buy({ body, userDocument }) {
		    
    		const hasCredits = userDocument.hasCredits(200)
			
			// is false
			if (! hasCredits) throw creditsException()
    		
    		//...
    	}
    	
A ***customError*** event will be issued automatically.
To receive this event on your customer just listen to the event.

    ...
     on('customError', (error) => console.log(error))

## After the events
After completing an action it is interesting to issue the result to the customers.

> It is necessary to always return a value of the executed action.

To use it is quite simple, just add the events that will be issued on the property after

    {
	    "admin": {
		    "user": {
			    "create": {
				    "action": userService.create(),
				    "after": [
						userNamespaceAdmin.created()
					],
				    "guards": [
					    ifUsernameNotExists()
				    ]
			    },
		    }
	    }
	}
	
**Building an event**
Events are separated into 3 categories

| primary | myNamespace | secondary |
|--|--| -- |
| The event will be in this category, when you want to send to the **sending client** or to **ALL other clients of the namespace, except to the sender**. | The event will be in this category, when you want to send to **all clients of the namespace**, including to the sending client. | The event will be in this category, when you want to send **to all clients in another namespace**.	|

All categories are given two parameters, the issuer and the result of the action.

**Primary**

    const { eventPrimary } = require('fluidsocket')
	
	module.exports = {
		created() {
			return eventPrimary((client, result) => {
				return client.emit('success', result)
			}) 
		}
	}

**My Namespace**

    const { eventMyNamespace } = require('fluidsocket')
    	
    	module.exports = {
    		created() {
    			return eventMyNamespace((io, result) => {
    				return io.emit('success', result)
    			}) 
    		}
    	}

**Secondary**

    const { eventSecondary } = require('fluidsocket')
    	
    module.exports = {
    	created() {
    		return eventSecondary((io, result) => {
    			return io
		    			.of('/player')
		    			.emit('success', result)
    		}) 
    	}
    }
