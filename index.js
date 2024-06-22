var fs = require('fs')
var multer = require('multer')
var mongoose = require('mongoose')
var express = require('express')
var cors = require('cors')
import { loginValidation, postCreateValidation, registerValidation } from './validations.js'

import { PostController, UserController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'


mongoose
    .connect("mongodb+srv://admin:wwwwww@cluster0.rz3cyv2.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

// const PORT = process.env.PORT || 4444

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'));


app.post('/api/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/api/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/api/auth/me', checkAuth, UserController.getMe);

app.post('/api/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.get('/api/tags', PostController.getLastTags);

app.get('/api/posts', PostController.getAll);
app.get('/api/posts/tags', PostController.getLastTags);
app.get('/api/posts/:id', PostController.getOne);
app.post('/api/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/api/posts/:id', checkAuth, PostController.remove);
app.patch('/api/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});


