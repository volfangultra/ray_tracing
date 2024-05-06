var viewport_size = 1;
var projection_plane_z = 1;
var camera_position = [0, 0, 0];
var camera_rotation = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

var background_color = [0, 0, 0];
var spheres = [ new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2),
                new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3),
                new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4),
                new Sphere([0, -5001, 0], 5000, [255,255,0], 1000, 0.5)
              ];

var has_light = false;
var has_shadow = false;
var num_reflections = 0;
var objects = spheres


const EPSILON = 0.0001;
const MOVEMENT_SPEED = 0.5;
const ROTATION_SPEED = 20;

var lights = [new Light(AMBIENT, [255, 255, 255], 0.2, null),
			  new Light(POINT, [255, 255, 255], 0.6, [2,1,0]),
			  new Light(DIRECTIONAL, [255, 255, 255], 0.2, [1,4,4])];


function start(){
	start_ray_tracer(spheres);
	update_canvas();
}


var toggle_light = document.getElementById('toggle_light');
var toggle_shadow = document.getElementById('toggle_shadow');
var set_num_reflections = document.getElementById("num_reflections");

var set_ambient_color = document.getElementById('ambient_light');
var set_point_color = document.getElementById('point_light');
var set_directional_color = document.getElementById("directional_light");

var set_ambient_intensity = document.getElementById('ambient_intensity');
var set_point_intensity = document.getElementById('point_intensity');
var set_directional_intensity = document.getElementById("directional_intensity");

toggle_light.addEventListener('change', function() {
    has_light = this.checked;
    start();
});


toggle_shadow.addEventListener('change', function() {
    has_shadow = this.checked;
    start();
});

set_num_reflections.addEventListener("change", function(){
	num_reflections = this.value;
	start()
});

set_ambient_color.addEventListener('change', function() {
    lights[0].color = multiply(1.0/255, hex_to_rgb(this.value));
    start();
});

set_point_color.addEventListener('change', function() {
    lights[1].color = multiply(1.0/255, hex_to_rgb(this.value));
    start();
});

set_directional_color.addEventListener('change', function() {
    lights[2].color = multiply(1.0/255, hex_to_rgb(this.value));
    start();
});

set_ambient_intensity.addEventListener('change', function() {
    lights[0].intensity = this.value;
    start();
});

set_point_intensity.addEventListener('change', function() {
    lights[1].intensity = this.value;
    start();
});

set_directional_intensity.addEventListener('change', function() {
    lights[2].intensity = this.value;
    start();
});




document.addEventListener('keydown', (event) => {
		switch (event.key) {
		    case ' ':
		        camera_position[1] += MOVEMENT_SPEED;
		        break;
		    case 'ArrowLeft':
		    	camera_position = add(camera_position, multiply(-MOVEMENT_SPEED, rotate(camera_rotation, [1,0,0])));
		        break;
		    case 'ArrowRight':
		    	camera_position = add(camera_position, multiply(MOVEMENT_SPEED, rotate(camera_rotation, [1,0,0])));
		        break;
		    case 'ArrowUp':
		    	camera_position = add(camera_position, multiply(MOVEMENT_SPEED, rotate(camera_rotation, [0,0,1])));
		        break;
		    case 'ArrowDown':
		    	camera_position = add(camera_position, multiply(-MOVEMENT_SPEED, rotate(camera_rotation, [0,0,1])));
		        break;
		    case 'w':
		    	camera_rotation = rotate_up(camera_rotation, ROTATION_SPEED)
		        break;
		    case 'a':
		    	camera_rotation = rotate_left(camera_rotation, ROTATION_SPEED)
		        break;
		    case 's':
		    	camera_rotation = rotate_down(camera_rotation, ROTATION_SPEED)
		        break;
		    case 'd':
		    	camera_rotation = rotate_right(camera_rotation, ROTATION_SPEED)
		        break;
		}
		if(event.shiftKey)
			camera_position[1] -= MOVEMENT_SPEED
		
	start()
});


start()