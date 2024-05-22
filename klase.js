class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
    this.destination = add(origin, direction);
  }
  current_destination(t) {
    return add(this.origin, multiply(t, this.direction));
  }
  reverse() {
    return new Ray(this.destination, multiply(-1, this.direction));
  }
  reflect(direction) {
    return new Ray(
      this.destination,
      subtract(
        multiply(2 * dot_product(direction, this.direction), direction),
        this.direction
      )
    );
  }
}

class Sphere {
  constructor(center, radius, color, specular = -1, reflective = 0) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
  }

  get_normal(point) {
    var normal = subtract(point, this.center);
    normal = multiply(1.0 / modul(normal), normal);
    return new Ray(point, normal);
  }

  intersect(ray) {
    var co = subtract(ray.origin, this.center);

    var a = dot_product(ray.direction, ray.direction);
    var b = 2 * dot_product(co, ray.direction);
    var c = dot_product(co, co) - this.radius * this.radius;

    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [Infinity, Infinity];
    }

    var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [t1, t2];
  }
}

class Paraboloid {
  constructor(center, a2, c2, size, color, specular = -1, reflective = 0) {
    this.center = center;
    this.a = a2;
    this.c = c2;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
    this.size = size;
  }

  get_normal(point) {
    var normal = [
      2 * (point[0] - this.center[0]),
      -1,
      2 * (point[2] - this.center[2]),
    ];
    normal = multiply(1.0 / modul(normal), normal);
    return new Ray(point, normal);
  }

  intersect(ray) {
    const A = ray.direction[0];
    const B = ray.direction[1];
    const C = ray.direction[2];

    const p = this.center[0];
    const q = this.center[1];
    const r = this.center[2];

    const x0 = ray.origin[0];
    const y0 = ray.origin[1];
    const z0 = ray.origin[2];

    var a = (A * A) / this.a + (C * C) / this.c;
    var b = 2 * ((x0 - p) / this.a) * A + 2 * ((z0 - r) / this.c) * C - B;
    var c =
      ((x0 - p) * (x0 - p)) / this.a +
      ((z0 - r) * (z0 - r)) / this.c -
      (y0 - q);

    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [Infinity, Infinity];
    }

    var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t_min = Math.min(t1, t2);
    const result = [A * t_min + x0, B * t_min + y0, C * t_min + z0];
    if (dot_product(result, result) > this.size) return [Infinity, Infinity];
    return [t1, t2];
  }
}

class Cone {
  constructor(center, a2, b2, c2, size, color, specular = -1, reflective = 0) {
    this.center = center;
    this.a = a2;
    this.b = b2;
    this.c = c2;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
    this.size = size;
  }

  get_normal(point) {
    var normal = [
      point[0] - this.center[0],
      point[1] - this.center[1],
      this.center[2] - point[2],
    ];
    normal = multiply(1.0 / modul(normal), normal);
    return new Ray(point, normal);
  }

  intersect(ray) {
    const A = ray.direction[0];
    const B = ray.direction[1];
    const C = ray.direction[2];

    const p = this.center[0];
    const q = this.center[1];
    const r = this.center[2];

    const x0 = ray.origin[0];
    const y0 = ray.origin[1];
    const z0 = ray.origin[2];

    var a = (A * A) / this.a - (B * B) / this.b + (C * C) / this.c;
    var b =
      2 *
      (((x0 - p) / this.a) * A -
        ((y0 - q) / this.b) * B +
        ((z0 - r) / this.c) * C);
    var c =
      ((x0 - p) * (x0 - p)) / this.a -
      ((y0 - q) * (y0 - q)) / this.b +
      ((z0 - r) * (z0 - r)) / this.c;

    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [Infinity, Infinity];
    }

    var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t_min = Math.min(t1, t2);
    const result = [A * t_min + x0, B * t_min + y0, C * t_min + z0];
    if (dot_product(result, result) > this.size) return [Infinity, Infinity];
    return [t1, t2];
  }
}

class Sadle {
  constructor(center, a2, c2, size, color, specular = -1, reflective = 0) {
    this.center = center;
    this.a = a2;
    this.c = c2;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
    this.size = size;
  }

  get_normal(point) {
    var normal = [
      2 * (point[0] - this.center[0]),
      -1,
      -2 * (point[2] - this.center[2]),
    ];
    normal = multiply(1.0 / modul(normal), normal);
    return new Ray(point, normal);
  }

  intersect(ray) {
    const A = ray.direction[0];
    const B = ray.direction[1];
    const C = ray.direction[2];

    const p = this.center[0];
    const q = this.center[1];
    const r = this.center[2];

    const x0 = ray.origin[0];
    const y0 = ray.origin[1];
    const z0 = ray.origin[2];

    var a = (A * A) / this.a - (C * C) / this.c;
    var b = 2 * ((x0 - p) / this.a) * A - 2 * ((z0 - r) / this.c) * C - B;
    var c =
      ((x0 - p) * (x0 - p)) / this.a -
      ((z0 - r) * (z0 - r)) / this.c -
      (y0 - q);

    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [Infinity, Infinity];
    }
    var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t_min = Math.min(t1, t2);
    const result = [A * t_min + x0, B * t_min + y0, C * t_min + z0];
    if (dot_product(result, result) > this.size) return [Infinity, Infinity];
    return [t1, t2];
  }
}

AMBIENT = 0;
POINT = 1;
DIRECTIONAL = 2;

class Light {
  constructor(type, color, intensity, position) {
    this.type = type;
    this.color = multiply(1.0 / 255, color);
    this.intensity = intensity;
    this.position = position;
  }
  compute_light(view, normal, specular = -1) {
    var color = [0, 0, 0];
    if (this.type == AMBIENT) return multiply(this.intensity, this.color);

    var temp, t_max;
    if (this.type == POINT) {
      temp = subtract(this.position, view.origin);
      t_max = 1.0;
    }
    if (this.type == DIRECTIONAL) {
      temp = this.position;
      t_max = Infinity;
    }

    if (
      has_shadow &&
      find_closest_object(new Ray(view.origin, temp), EPSILON, t_max)
    )
      return [0, 0, 0];

    var normal_dot_temp = dot_product(temp, normal);

    if (normal_dot_temp > 0)
      color = add(
        color,
        multiply(normal_dot_temp / (modul(normal) * modul(temp)), this.color)
      );

    if (specular != -1) {
      var r = reflect_direction(temp, normal);
      var r_dot_view = dot_product(r, view.direction);
      if (r_dot_view > 0)
        color = add(
          color,
          multiply(
            Math.pow(r_dot_view / (modul(r) * modul(view.direction)), specular),
            this.color
          )
        );
    }

    return multiply(this.intensity, color);
  }
}
