const auth = {
  required: (req, res, next) => {
    if (req.user) return next();
    return res.status(401).json({
      error: "User not authenticated"
    });
  },
  optional: (req, res, next) => {
    next();
  }
};

module.exports = auth;
