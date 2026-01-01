String.prototype.format = function (...args: string[]) {
	return this.toString().replace(/{(\d+)}/g, (match, index) => {
		return typeof args[index] !== "undefined" ? args[index] : match
	})
}

String.prototype.formatWithNumber = function (...args: number[]) {
	return this.toString().replace(/{(\d+)}/g, (match, index) => {
		return typeof args[index] !== "undefined" ? args[index].toLocaleString() : match
	})
}

export 	const formatNumber = (num: number) => {
	if (!num) return ""
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
