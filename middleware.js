const Subject = require('./models/subjectModel');

module.exports.isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/signin');
  next();
};

module.exports.isSignedOut = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/subjects');
  next();
};

module.exports.isAuthorized = async (req, res, next) => {
  const subjectId = req.params.id;
  const subject = await Subject.findOne({ id: subjectId });
  if (!subject.owner.equals(req.user._id))
    return res.redirect(`/subjects/${subjectId}`);
  next();
};
