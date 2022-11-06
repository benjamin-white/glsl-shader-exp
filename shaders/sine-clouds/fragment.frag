#ifdef GL_ES
precision mediump float;
#endif
#define RADIANS 0.017453292519943295
uniform vec2 u_resolution;
uniform float u_time;
const int zoom = 40;
const float brightness = 0.975;

float cosRange(float degrees, float range, float minimum) {
  return (((1.0 + cos(degrees * RADIANS)) * 0.5) * range) + minimum;
}

void main() {
  float time = u_time * 1.25;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution.xy) / max(u_resolution.x, u_resolution.y);
  float ct = cosRange(time * 5.0, 3.0, 1.1);
  float xBoost = cosRange(time * 0.2, 5.0, 5.0);
  float yBoost = cosRange(time * 0.1, 10.0, 5.0);
  float fScale = cosRange(time * 15.5, 1.25, 0.5);

  for (int i = 1; i < zoom; i++) {
    float _i = float(i);
    p.x += 0.25 / _i * sin(_i * p.y + time * cos(ct) * 0.5 / 20.0 + 0.005 * _i) * fScale + xBoost;
    p.y += 0.25 / _i * sin(_i * p.x + time * ct * 0.3 / 40.0 + 0.03 * float(i + 15)) * fScale + yBoost;
  }

  vec3 col = vec3(
    0.5 * sin(3.0 * p.x) + 0.5,
    0.5 * sin(3.0 * p.y) + 0.5,
    sin(p.x + p.y)
  ) * brightness;

  gl_FragColor = vec4(col, 1);
}