const express = require('express');
const router = express.Router();

const {
  index,
  create,
  newForm,
  show,
  editForm,
  edit,
  deleteSub,
  createNotebookForm,
  createNotebook,
  editNotebookForm,
  editNotebook,
  deleteNotebook,
  createVideoForm,
  createVideo,
  editVideoForm,
  editVideo,
  deleteVideo,
  createTestbankForm,
  createTestbank,
  editTestbankForm,
  editTestbank,
  deleteTestbank,
  testApi
} = require('../controllers/subjectsController');
const { isSignedIn, isAuthorized } = require('../middleware');

router.route('/').get(index).post(isSignedIn, create);

router.get('/new', isSignedIn, newForm);

router.get('/testApi', testApi);

router
  .route('/:id/notebooks')
  .get(isSignedIn, createNotebookForm)
  .post(isSignedIn, createNotebook);

router
  .route('/:id/notebooks/:notebookId')
  .get(isSignedIn, editNotebookForm)
  .put(isSignedIn, editNotebook)
  .delete(isSignedIn, deleteNotebook);

router
  .route('/:id/videos')
  .get(isSignedIn, createVideoForm)
  .post(isSignedIn, createVideo);

router
  .route('/:id/videos/:videoId')
  .get(isSignedIn, editVideoForm)
  .put(isSignedIn, editVideo)
  .delete(isSignedIn, deleteVideo);

router
  .route('/:id/testbanks')
  .get(isSignedIn, createTestbankForm)
  .post(isSignedIn, createTestbank);

router
  .route('/:id/testbanks/:testbankId')
  .get(isSignedIn, editTestbankForm)
  .put(isSignedIn, editTestbank)
  .delete(isSignedIn, deleteTestbank);

router.route('/:id').get(show).delete(isSignedIn, isAuthorized, deleteSub);

router
  .route('/:id/edit')
  .get(isSignedIn, isAuthorized, editForm)
  .put(isSignedIn, isAuthorized, edit);

module.exports = router;
