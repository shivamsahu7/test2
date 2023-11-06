const allowDartUserAgent = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  
  if (userAgent && userAgent.includes('Dart')) {
    return next(); 
  }

  return res.status(403).json({ message: 'Access denied' });
};

module.exports = allowDartUserAgent