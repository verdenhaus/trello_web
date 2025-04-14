const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Authentication middleware
server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/boards') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    // In a real app, you would verify the token here
    next();
  } else {
    next();
  }
});

server.use(router);
server.listen(8080, () => {
  console.log('JSON Server is running');
});