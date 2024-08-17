import app from './app';

Bun.serve({
    port : process.env.PORT || 6150,
    fetch : app.fetch
})