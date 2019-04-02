const { expect, assert } = require('chai')

const socket = require('socket.io')

const initSocket = require('./../core/init-sockets')
const namespaces = require('./mocks/options')

describe('Test initialize', () => {
	let io
	let initialize

	beforeEach(() => {
		io = socket.listen(3001)
		initialize = initSocket(io)(namespaces)[0]
	})

	afterEach(() => {
		io.close()
	})

	it('Creation of namespaces', () => {
		expect(initialize).to.have.property('name', '/admin')
	})

	it('Listen events', () => {
		assert.equal(initialize._eventsCount, 1)
	})
})