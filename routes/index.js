module.exports = function (commonModules) {
  var defaultRoute = commonModules.express.Router();
  var uuid = commonModules.uuid;
  var multer = commonModules.multer;


  var storageOptions = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == 'profile_pic' && file.mimetype == 'image/jpeg') {
        cb(null, 'uploads/profile_pic/')
      }

      if (file.fieldname == 'profile_pic' && file.mimetype != 'image/jpeg') {
        console.log('please upload valid jpeg file');
        cb({ message: 'please upload valid jpeg file' }, null);
      }

      if (file.fieldname == 'text_data' && file.mimetype == 'text/plain') {
        cb(null, 'uploads/text_data/')
      }

      if (file.fieldname == 'text_data' && file.mimetype != 'text/plain') {
        console.log('please upload valid text file');
        cb({ message: 'please upload valid text file' }, null);
      }
    },
    filename: function (req, file, cb) {
      var fileparts = file.originalname.split('.');
      var ext = fileparts[fileparts.length - 1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
    }
  });

  /* GET home page. */
  defaultRoute.get('/', function (req, res, next) {
    var viewData = {
      title: 'Express',
      uploaded: []
    }
    res.render('index', viewData);
  });


  //GET
  defaultRoute.get('/upload', function (req, res, next) {
    console.log('GET:upload');

    var uploaded = [];

    var viewData = {
      title: 'Upload Demo',
      uploaded: uploaded,
      message: ''
    }
    res.render('upload', viewData);
  });

  //post
  var file_fields = [{ name: 'profile_pic', maxCount: 1 }, { name: 'text_data', maxCount: 1 }];
  var upload_fields = multer({
    storage: storageOptions,
    limits: {
      fileSize: 1000000
    }
  }).fields(file_fields);

  defaultRoute.post('/upload/field', function (req, res, next) {
    upload_fields(req, res, function (err) {
      var uploaded = [];
      var message = '';
      var viewData = {};

      if (err) {
        message = err.message;
      } else {
        uploaded.push(req.files.profile_pic[0].filename);
        uploaded.push(req.files.text_data[0].filename);
      }

      viewData = {
        title: 'Upload Demo',
        uploaded: uploaded,
        message: message
      }

      console.log(viewData);

      res.render('upload', viewData);
    });
  });

  //upload demo
  var uploadAny = multer({
    storage: storageOptions,
    limits: {
      fileSize: 1000000
    }
  }).any();
  
  defaultRoute.post('/upload', function (req, res, next) {
    uploadAny(req, res, function (err) {
      var uploaded = [];
      var errors = [];
      var message = '';
      var viewData = {};

      if (err) {
        message = err.message;
      } else {
        for (var i = 0; i < req.files.length; i++) {
          uploaded.push(req.files[i].filename);
        }
      }

      console.log(req.body.text);

      viewData = {
        title: 'Upload Demo',
        uploaded: uploaded,
        message: message
      }
      res.render('upload', viewData);
    })
  });

  commonModules.app.use('/', defaultRoute);
}