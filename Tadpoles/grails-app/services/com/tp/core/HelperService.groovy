package com.tp.core

class HelperService {

	def getRandomColor() {
	    def rgb = new Random().nextInt(1 << 24) // A random 24-bit integer
	    def color = '#' + Integer.toString(rgb, 16).padLeft(6, '0')
		if (color == "#ffffff")
			getRandomColor()
		else
			return color
	}
}
