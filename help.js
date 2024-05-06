
function dot_product(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}
  
function subtract(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function modul(v){
	return Math.sqrt(dot_product(v,v));
}

function multiply(k, v){
	return [k*v[0], k*v[1], k*v[2]];
}

function multiply_colors(v1,v2){
	return [v1[0]*v2[0], v1[1]*v2[1], v1[2]*v2[2]]
}

function clamp(v){
	return [Math.min(255, Math.max(0, v[0])), 
			Math.min(255, Math.max(0, v[1])),
			Math.min(255, Math.max(0, v[2]))];
}

function reflect_direction(v, N){
	return subtract(multiply(2*dot_product(N, v), N), v);	
}

function rotate(rotation, direction){
	var rez = [0, 0, 0]
	for(let i = 0; i < 3; i+=1)
		for(let j = 0; j < 3; j+=1)
			rez[i] += rotation[i][j] * direction[j];
	return rez;
}

function matrix_multiply(a, b) {
    var result = [];
    for (var i = 0; i < a.length; i++) {
        result[i] = [];
        for (var j = 0; j < b[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function rotate_left(rotation, degrees) {
    var radians = degrees * Math.PI / 180;
    var rm = [
        [Math.cos(radians), 0, -Math.sin(radians)],
        [0, 1, 0],
        [Math.sin(radians), 0, Math.cos(radians)]
    ];
    return matrix_multiply(rm, rotation);
}

function rotate_right(rotation, degrees) {
    var radians = degrees * Math.PI / 180;
    var rm = [
        [Math.cos(-radians), 0, -Math.sin(-radians)],
        [0, 1, 0],
        [Math.sin(-radians), 0, Math.cos(-radians)]
    ];
    return matrix_multiply(rm, rotation);
}


function rotate_up(rotation, degrees) {
    var radians = degrees * Math.PI / 180;
    var rm = [
        [1, 0, 0],
        [0, Math.cos(radians), -Math.sin(radians)],
        [0, Math.sin(radians), Math.cos(radians)]
    ];
    return matrix_multiply(rm, rotation);
}


function rotate_down(rotation, degrees) {
    var radians = degrees * Math.PI / 180;
    var rm = [
        [1, 0, 0],
        [0, Math.cos(-radians), -Math.sin(-radians)],
        [0, Math.sin(-radians), Math.cos(-radians)]
    ];
    return matrix_multiply(rm, rotation);
}

function hex_to_rgb(hex) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

