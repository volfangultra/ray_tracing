var canvas = document.getElementById("canvas");
var canvas_context = canvas.getContext("2d");
var canvas_buffer = canvas_context.getImageData(
  0,
  0,
  canvas.width,
  canvas.height
);
var canvas_pitch = canvas_buffer.width * 4;
var viewport_size = 1;
var projection_plane_z = 1;
var camera_position = [0, 0, 0];
var background_color = [255, 255, 255];

function put_pixel(x, y, color) {
  x = canvas.width / 2 + x;
  y = canvas.height / 2 - y - 1;

  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    return;
  }

  var offset = 4 * x + canvas_pitch * y;
  canvas_buffer.data[offset++] = color[0];
  canvas_buffer.data[offset++] = color[1];
  canvas_buffer.data[offset++] = color[2];
  canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}

function update_canvas() {
  canvas_context.putImageData(canvas_buffer, 0, 0);
}

function canvas_to_viewport(p2d) {
  return [
    (p2d[0] * viewport_size) / canvas.width,
    (p2d[1] * viewport_size) / canvas.height,
    projection_plane_z,
  ];
}

function find_closest_object(ray, t_min, t_max) {
  var closest_t = Infinity;
  var closest_object = null;
  for (var i = 0; i < objects.length; i++) {
    var ts = objects[i].intersect(ray);
    if (ts[0] < closest_t && t_min < ts[0] && ts[0] < t_max) {
      closest_t = ts[0];
      closest_object = objects[i];
    }
    if (ts[1] < closest_t && t_min < ts[1] && ts[1] < t_max) {
      closest_t = ts[1];
      closest_object = objects[i];
    }
  }
  if (closest_object) return [closest_object, closest_t];
  return null;
}

function trace(ray, t_min, t_max, dubina) {
  intersection = find_closest_object(ray, t_min, t_max);
  let local_color = null;
  if (!intersection) return background_color;

  closest_object = intersection[0];
  closest_t = intersection[1];

  ray.destination = ray.current_destination(closest_t);
  view = ray.reverse();

  normal = closest_object.get_normal(view.origin);

  if (has_light) {
    var light_power = [0, 0, 0];
    for (light of lights) {
      light_power = add(
        light_power,
        light.compute_light(view, normal.direction, closest_object.specular)
      );
    }

    local_color = multiply_colors(light_power, closest_object.color);
  } else local_color = closest_object.color;

  if (dubina <= 0 || closest_object.reflective <= 0) return local_color;

  var r = view.reflect(normal.direction);
  var help = closest_object.reflective;
  reflected_color = trace(r, EPSILON, Infinity, dubina - 1);
  return add(multiply(1 - help, local_color), multiply(help, reflected_color));
}

function start_ray_tracer() {
  for (var x = -canvas.width / 2; x < canvas.width / 2; x++) {
    for (var y = -canvas.height / 2; y < canvas.height / 2; y++) {
      var direction = rotate(camera_rotation, canvas_to_viewport([x, y]));
      var color = clamp(
        trace(
          new Ray(camera_position, direction),
          0.001,
          Infinity,
          num_reflections
        )
      );
      put_pixel(x, y, color);
    }
  }
}
