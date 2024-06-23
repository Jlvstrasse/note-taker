const clog = (req, res, next) => {
    console.info(`${req.method} request to ${req.path}`);
    next();
  };
  
  module.exports = { clog };
  