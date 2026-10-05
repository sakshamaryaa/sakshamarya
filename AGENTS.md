# Project decisions

- Keep the portfolio as a single animated React page and add new content as local sections rather than introducing separate routes, because the existing experience is designed as one continuous editorial journey.
- Keep portfolio content in `src/pages/Portfolio.tsx` as local typed data and section components, because the project is currently a static personal portfolio and does not need a backend for this update.
- Keep shared spatial effects in the existing React Three Fiber background and use CSS 3D for interface depth, because this delivers a coherent, lightweight 3D experience across device sizes.
