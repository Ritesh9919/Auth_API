export const NotFoundMiddleware = (req, res)=> {
    return res.status(404).send('Route doest not exist please check out documentation for more info <a href="/api/docs">Documentation</a>')
}