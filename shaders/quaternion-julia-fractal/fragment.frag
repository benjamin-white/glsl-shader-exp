// The solution below is by Inigo Quilez https://iquilezles.org/

#define AA 2 // Set AA to 1 if your machine is too slow
uniform vec2 u_resolution;
uniform float u_time;
const int numIterations = 11;

// square a quaterion
vec4 qsqr(in vec4 a) {
  return vec4(
    a.x * a.x - a.y * a.y - a.z * a.z - a.w * a.w,
    2.0 * a.x * a.y,
    2.0 * a.x * a.z,
    2.0 * a.x * a.w
  );
}

vec4 qmul(in vec4 a, in vec4 b) {
  return vec4(
    a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
    a.y * b.x + a.x * b.y + a.z * b.w - a.w * b.z,
    a.z * b.x + a.x * b.z + a.w * b.y - a.y * b.w,
    a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y
  );
}

vec4 qconj(in vec4 a) {
  return vec4(a.x, -a.yzw);
}

float qlength2(in vec4 q) {
  return dot(q, q);
}

float map(in vec3 p, out vec4 oTrap, in vec4 c) {
  vec4 z = vec4(p, 0.0);
  float md2 = 1.0;
  float mz2 = dot(z, z);
  vec4 trap = vec4(abs(z.xyz), dot(z, z));
  float n = 1.0;
  for (int i = 0; i < numIterations; i++) {
    // dz -> 2·z·dz, meaning |dz| -> 2·|z|·|dz|
    // Now we take the 2.0 out of the loop and do it at the end with an exp2
    md2 *= 4.0 * mz2;
    z = qsqr(z) + c;
    trap = min(trap, vec4(abs(z.xyz), dot(z, z)));
    mz2 = qlength2(z);
    if (mz2 > 4.0) break;
    n += 1.0;
  }
  oTrap = trap;
  return 0.25 * sqrt(mz2 / md2) * log(mz2);  // d = 0.5·|z|·log|z|/|z'|
}

vec3 calcNormal(in vec3 p, in vec4 c) {
  vec4 z = vec4(p, 0.0);
  // identity derivative
  vec4 J0 = vec4(1,0, 0,0);
  vec4 J1 = vec4(0,1, 0,0);
  vec4 J2 = vec4(0,0, 1,0);
  for (int i = 0; i < numIterations; i++) {
    vec4 cz = qconj(z);
    // chain rule of jacobians (removed the 2 factor)
    J0 = vec4(dot(J0, cz), dot(J0.xy, z.yx), dot(J0.xz, z.zx), dot(J0.xw, z.wx));
    J1 = vec4(dot(J1, cz), dot(J1.xy, z.yx), dot(J1.xz, z.zx), dot(J1.xw, z.wx));
    J2 = vec4(dot(J2, cz), dot(J2.xy, z.yx), dot(J2.xz, z.zx), dot(J2.xw, z.wx));
    // z -> z2 + c
    z = qsqr(z) + c; 
    if (qlength2(z) > 4.0) break;
  }
  vec3 v = vec3(
    dot(J0, z),
    dot(J1, z),
    dot(J2, z)
  );
  return normalize(v);
}

float intersect(in vec3 ro, in vec3 rd, out vec4 res, in vec4 c) {
  vec4 tmp;
  float resT = -1.0;
  float maxd = 10.0;
  float h = 1.0;
  float t = 0.0;
  for (int i = 0; i < 300; i++) {
    if (h < 0.0001 || t > maxd) break;
    h = map(ro + rd * t, tmp, c);
    t += h;
  }
  if (t < maxd) {
    resT = t;
    res = tmp;
  }
  return resT;
}

float softshadow(in vec3 ro, in vec3 rd, float mint, float k, in vec4 c) {
  float res = 1.0;
  float t = mint;
  for (int i = 0; i < 64; i++) {
    vec4 kk;
    float h = map(ro + rd * t, kk, c);
    res = min(res, k * h / t);
    if (res < 0.001) break;
    t += clamp(h, 0.01, 0.5);
  }
  return clamp(res, 0.0, 1.0);
}

vec3 render(in vec3 ro, in vec3 rd, in vec4 c) {
  const vec3 sun = vec3(0.577, 0.577,  0.577);
  vec4 tra;
  vec3 col;
  float t = intersect(ro, rd, tra, c);
  if (t < 0.0) {
    col = vec3(0.7, 0.9, 1.0) * (0.7 + 0.3 * rd.y);
    col += vec3(0.8, 0.7, 0.5) * pow(clamp(dot(rd, sun), 0.0, 1.0), 48.0);
  } else {
    vec3 mate = vec3(1.0, 0.8, 0.7) * 0.3;
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos, c);
    float occ = clamp(2.5 * tra.w - 0.15, 0.0, 1.0);
    col = vec3(0.0);
    // sky
    {
      float co = clamp(dot(-rd, nor), 0.0, 1.0);
      vec3 ref = reflect(rd, nor);
      float sha = occ;
      sha *= smoothstep(-0.1, 0.1, ref.y);
      float fre = 0.1 + 0.9 * pow(1.0 - co, 5.0);
      col = mate * 0.3 * vec3(0.8, 0.9, 1.0) * (0.6 + 0.4 * nor.y) * occ;
      col += 2.0 * 0.3 * vec3(0.8, 0.9, 1.0) * (0.6 + 0.4 * nor.y) * sha * fre;
    }
    // sun
    {
      const vec3 lig = sun;
      float dif = clamp(dot(lig, nor), 0.0, 1.0);
      float sha = softshadow(pos, lig, 0.001, 64.0, c);
      vec3 hal = normalize(-rd + lig);
      float co = clamp(dot(hal, lig), 0.0, 1.0);
      float fre = 0.04 + 0.96 * pow(1.0 - co, 5.0);
      float spe = pow(clamp(dot(hal, nor), 0.0, 1.0), 32.0);
      col += mate * 3.5 * vec3(1.00, 0.90, 0.70) * dif * sha;
      col += 7.0 * 3.5 * vec3(1.00, 0.90, 0.70) * spe * dif * sha * fre;
    }
    // extra fill
    {
      const vec3 lig = vec3(-0.707, 0.000, -0.707);
      float dif = clamp(0.5 + 0.5 * dot(lig, nor), 0.0, 1.0);
      col += mate * 1.5 * vec3(0.14, 0.14, 0.14) * dif * occ;
    }
    // fake SSS
    {
      float fre = clamp(1. + dot(rd, nor), 0.0, 1.0);
      col += mate * mate * 0.6 * fre * fre * (0.2 + 0.8 * occ);
    }
  }
  return pow(col, vec3(0.4545));
}

void main() {
  // anim
  float time = u_time * .15;
  vec4 c = 0.45 * cos(vec4(0.5, 3.9, 1.4, 1.1) + time * vec4(1.2, 1.7, 1.3, 2.5)) - vec4(0.3, 0.0, 0.0, 0.0);
  // camera
  float r = 1.5+0.15*cos(0.0+0.29*time);
  vec3 ro = vec3(
    r * cos(0.3 + 0.37 * time), 
    0.3 + 0.8 * r * cos(1.0 + 0.33 * time),
    r * cos(2.2 + 0.31 * time)
  );
  vec3 ta = vec3(0.0, 0.0, 0.0);
  float cr = 0.1 * cos(0.1 * time);
  // render
  vec3 col = vec3(0.0);
  for (int j = 0; j < AA; j++) {
    for (int i = 0; i < AA; i++) {
      vec2 p = (-u_resolution.xy + 2.0 * (gl_FragCoord.xy + vec2(float(i), float(j)) / float(AA))) / u_resolution.y;
      vec3 cw = normalize(ta - ro);
      vec3 cp = vec3(sin(cr), cos(cr), 0.0);
      vec3 cu = normalize(cross(cw, cp));
      vec3 cv = normalize(cross(cu, cw));
      vec3 rd = normalize(p.x * cu + p.y * cv + 2.0 * cw);
      col += render(ro, rd, c);
    }
  }
  col /= float(AA * AA);
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  col *= 0.7 + 0.3 * pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.25);

  gl_FragColor = vec4(col, 1.0);
}