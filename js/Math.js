function rotateBodyAroundPoint(body, point, angle) {
	var x = point.x + (body.x - point.x) * Math.cos(angle) + (body.y - point.y) * Math.sin(angle);
	var y = point.y + (body.x - point.x) * Math.sin(angle) + (body.y - point.y) * Math.cos(angle);
	return new Point(x, y);
}