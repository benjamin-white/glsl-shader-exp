This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Main Libraries In Use

+ Webpack `raw-loader` and `glslify-loader` to handle `.vert` and `.frag` files
+ `lamina` to simplify the creation of layered and shaded materials
+ `three` to simplify working with WebGL
+ `@react-three/fiber` as a convenient declarative React wrapper over ThreeJS
+ `next` to handle routing, page structure and SSR

## Credits

A lot of GLSL code was pulled from [Inigo Quilez](https://iquilezles.org/) and [Maxime Heckel](https://r3f.maximeheckel.com/).