import {serve} from 'bun';

serve({
    fetch(request) {

        const url = new URL(request.url);

        if (url.pathname === '/hello') {
            return new Response('Hello World!');
        } else if (url.pathname === '/goodbye') {
            return new Response('Goodbye World!');
        } else {
            return new Response('Not Found', { status: 404 });
        }
    },
    port: 3000,
    hostname: '127.0.0.1'
});