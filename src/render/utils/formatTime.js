export function formatTime(time){
	const today = new Date().getDate()
	const date = new Date(time)
	const Y = date.getFullYear() + '-'
	const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
	const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
	const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	if(Math.abs(today-date.getDate())==0){
		return h + m
	}else{
		return date.getFullYear().toString().substr(2,2) + '/' + ((date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/') + ((date.getDate() < 10 ? '0' + date.getDate() : date.getDate()))
	}
}