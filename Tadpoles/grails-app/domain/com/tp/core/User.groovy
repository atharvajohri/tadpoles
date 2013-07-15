package com.tp.core

class User {

	transient springSecurityService

	String username
	String password
	boolean enabled
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	int points = 0
	Date dateCreated
	Long fid
	String email
	Boolean connected = false
	Attacar attacar
	
	static constraints = {
		username blank: false, unique: true
		password blank: false
		email email:true, nullable:true
		fid nullable:true
		attacar nullable:true
	}

	static mapping = {
		password column: '`password`'
	}

	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this).collect { it.role } as Set
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService.encodePassword(password)
	}
}
