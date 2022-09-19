const { ObjectId } = require('mongodb');
const Subject = require('../models/subjectModel');

module.exports.index = async (req, res) => {
  try {
    let subjects = await Subject.find({}).sort({ title: 'asc' });
    if (req.query.search)
      subjects = await Subject.find({
        title: { $regex: req.query.search, $options: 'i' }
      }).sort({ title: 'asc' });
    res.render('subjects/index', {
      subjects,
      info: { title: 'Dosyyat', currentUrl: req.originalUrl }
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports.newForm = (req, res) => {
  res.render('subjects/new', {
    info: { title: 'Dosyyat - New subject', currentUrl: req.originalUrl }
  });
};

module.exports.create = async (req, res) => {
  const editedSubject = new Subject(req.body.subject);

  editedSubject.owner = req.user._id;

  try {
    await editedSubject.save();
    res.redirect(`/subjects/${editedSubject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.show = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id }).populate({
      path: 'owner'
    });
    if (subject)
      res.render('subjects/show', {
        subject,
        info: {
          title: `Dosyyat - ${subject.title}`,
          currentUrl: req.originalUrl
        }
      });
    else res.send('<h1>Not found.</h1>');
  } catch (error) {
    res.send(error);
  }
};

module.exports.editForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (subject) {
      res.render('subjects/edit', {
        subject,
        info: {
          title: `Dosyyat - ${subject.title} - Edit`,
          currentUrl: req.originalUrl
        }
      });
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports.edit = async (req, res) => {
  try {
    await Subject.findOneAndUpdate({ id: req.params.id }, req.body.subject);
    res.redirect(`/subjects/${req.body.subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.deleteSub = async (req, res) => {
  try {
    await Subject.deleteOne({ id: req.params.id });
    res.redirect('/subjects');
  } catch (error) {
    res.send(error);
  }
};

module.exports.createNotebookForm = (req, res) => {
  res.render('subjects/notebooks/new', {
    subject: { id: req.params.id },
    info: { title: 'Dosyyat - New notebook', currentUrl: req.originalUrl }
  });
};

module.exports.createNotebook = async (req, res) => {
  try {
    const notebook = {
      name: req.body.notebook.name,
      link: req.body.notebook.link,
      _id: new ObjectId()
    };
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $push: { notebooks: notebook } }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.editNotebookForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      'subject.id': req.params.id,
      'notebooks._id': req.params.notebookId
    });
    const notebook = subject.notebooks.find((notebook) =>
      notebook._id.equals(req.params.notebookId)
    );
    res.render('subjects/notebooks/edit', {
      subject,
      notebook,
      info: {
        title: `Dosyyat - ${subject.title} - ${notebook.name} - Edit`,
        currentUrl: req.originalUrl
      }
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports.editNotebook = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'notebooks._id': req.params.notebookId
      },
      {
        $set: {
          'notebooks.$.name': req.body.notebook.name,
          'notebooks.$.link': req.body.notebook.link
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.deleteNotebook = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'notebooks._id': req.params.notebookId
      },
      {
        $pull: {
          notebooks: { _id: req.params.notebookId }
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.createVideoForm = (req, res) => {
  res.render('subjects/videos/new', {
    subject: { id: req.params.id },
    info: { title: 'Dosyyat - New video', currentUrl: req.originalUrl }
  });
};

module.exports.createVideo = async (req, res) => {
  try {
    const video = {
      name: req.body.video.name,
      link: req.body.video.link,
      _id: new ObjectId()
    };
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $push: { videos: video } }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.editVideoForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      'subject.id': req.params.id,
      'videos._id': req.params.videoId
    });
    const video = subject.videos.find((video) =>
      video._id.equals(req.params.videoId)
    );
    res.render('subjects/videos/edit', {
      subject,
      video,
      info: {
        title: `Dosyyat - ${subject.title} - ${video.name} - Edit`,
        currentUrl: req.originalUrl
      }
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports.editVideo = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'videos._id': req.params.videoId
      },
      {
        $set: {
          'videos.$.name': req.body.video.name,
          'videos.$.link': req.body.video.link
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.deleteVideo = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'videos._id': req.params.videoId
      },
      {
        $pull: {
          videos: { _id: req.params.videoId }
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.createTestbankForm = (req, res) => {
  res.render('subjects/testbanks/new', {
    subject: { id: req.params.id },
    info: { title: 'Dosyyat - New testbanks', currentUrl: req.originalUrl }
  });
};

module.exports.createTestbank = async (req, res) => {
  try {
    const testbank = {
      name: req.body.testbank.name,
      link: req.body.testbank.link,
      _id: new ObjectId()
    };
    const subject = await Subject.findOneAndUpdate(
      { id: req.params.id },
      { $push: { testBanks: testbank } }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.editTestbankForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      'subject.id': req.params.id,
      'testBanks._id': req.params.testbankId
    });
    const testbank = subject.testBanks.find((testbank) =>
      testbank._id.equals(req.params.testbankId)
    );
    res.render('subjects/testbanks/edit', {
      subject,
      testbank,
      info: {
        title: `Dosyyat - ${subject.title} - ${testbank.name} - Edit`,
        currentUrl: req.originalUrl
      }
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports.editTestbank = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'testBanks._id': req.params.testbankId
      },
      {
        $set: {
          'testBanks.$.name': req.body.testbank.name,
          'testBanks.$.link': req.body.testbank.link
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};

module.exports.deleteTestbank = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        'subject.id': req.params.id,
        'testBanks._id': req.params.testbankId
      },
      {
        $pull: {
          testBanks: { _id: req.params.testbankId }
        }
      }
    );
    res.redirect(`/subjects/${subject.id}`);
  } catch (error) {
    res.send(error);
  }
};
