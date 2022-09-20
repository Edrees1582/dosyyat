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
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.edit = async (req, res) => {
  try {
    await Subject.findOneAndUpdate({ id: req.params.id }, req.body.subject);
    res.redirect(`/subjects/${req.body.subject.id}`);
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.deleteSub = async (req, res) => {
  try {
    await Subject.deleteOne({ id: req.params.id });
    res.redirect('/subjects');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.createNotebookForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (subject) {
      res.render('subjects/notebooks/new', {
        subject,
        info: { title: 'Dosyyat - New notebook', currentUrl: req.originalUrl }
      });
    } else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.editNotebookForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      'subject.id': req.params.id,
      'notebooks._id': req.params.notebookId
    });
    if (subject) {
      const notebook = subject.notebooks.find((notebook) =>
        notebook._id.equals(req.params.notebookId)
      );
      if (notebook) {
        res.render('subjects/notebooks/edit', {
          subject,
          notebook,
          info: {
            title: `Dosyyat - ${subject.title} - ${notebook.name} - Edit`,
            currentUrl: req.originalUrl
          }
        });
      } else throw new Error('Notebook not found.');
    } else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or notebook not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or notebook not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.createVideoForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (subject) {
      res.render('subjects/videos/new', {
        subject,
        info: { title: 'Dosyyat - New video', currentUrl: req.originalUrl }
      });
    } else throw new Error('Subject not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.editVideoForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      id: req.params.id
    });
    if (subject) {
      const video = subject.videos.find((video) =>
        video._id.equals(req.params.videoId)
      );
      if (video) {
        res.render('subjects/videos/edit', {
          subject,
          video,
          info: {
            title: `Dosyyat - ${subject.title} - ${video.name} - Edit`,
            currentUrl: req.originalUrl
          }
        });
      } else throw new Error('Video not found.');
    } else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or video not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or video not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.createTestbankForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({ id: req.params.id });
    if (subject) {
      res.render('subjects/testbanks/new', {
        subject,
        info: { title: 'Dosyyat - New testbanks', currentUrl: req.originalUrl }
      });
    } else throw new Error('Subject not found.');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or testbank not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};

module.exports.editTestbankForm = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      'subject.id': req.params.id,
      'testBanks._id': req.params.testbankId
    });
    if (subject) {
      const testbank = subject.testBanks.find((testbank) =>
        testbank._id.equals(req.params.testbankId)
      );
      if (testbank) {
        res.render('subjects/testbanks/edit', {
          subject,
          testbank,
          info: {
            title: `Dosyyat - ${subject.title} - ${testbank.name} - Edit`,
            currentUrl: req.originalUrl
          }
        });
      }
    }
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or testbank not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
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
    if (subject) res.redirect(`/subjects/${subject.id}`);
    else throw new Error('Subject or testbank not found');
  } catch (err) {
    res.render('error', {
      info: {
        title: 'Dosyyat - Error',
        currentUrl: req.originalUrl,
        error: {
          message: err.message || 'Error occurred'
        }
      }
    });
  }
};
