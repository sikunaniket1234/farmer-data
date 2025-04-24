module.exports = (roles) => (req, res, next) => {
    console.log('RestrictTo middleware: User role:', req.user.role, 'Allowed roles:', roles);
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('RestrictTo middleware: Access denied');
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('RestrictTo middleware: Access granted');
    next();
  };