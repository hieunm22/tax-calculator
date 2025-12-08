String.prototype.format = function(...args: any) {
	return this.toString().replace(/{(\d+)}/g, (match, index) => {
		return typeof args[index] !== "undefined" ? args[index] : match
	})
}
