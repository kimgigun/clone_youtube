const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require('fluent-ffmpeg');


//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination:(req, res, cb) =>{
        cb(null, "uploads/")
    },
    filename:(req, file, cb) =>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, cb) =>{
        const ext = path.extname(file.originalname)
        if(ext != '.mp4' || ext != '.mov'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({storage:storage}).single('file');


router.get('/getVideos', (req,res)=>{
    //비디오를 db에서 가져와서 클라이언테에게 보낸다

    Video.find().populate('writer').exec((err,videos)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success: true, videos})
    })
    
})


router.post('/getVideoDetail', (req, res)=>{
console.log("req")
console.log(req);
    Video.findOne({"_id":req.body.videoId}).populate('writer').exec((err,videos)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success: true, videoDetail:videos})
    })
    
})



router.post('/uploadfiles',(req, res) =>{

    upload(req, res, err =>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url:res.req.file.path, fileName:res.req.file.filename});
    })
})



router.post("/thumbnail", (req, res) => {

    let thumbsFilePath ="";
    let fileDuration ="";

    //비디오 정보가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })


    //썸네일 가져오기
    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

});

router.post('/uploadVideo',(req, res) =>{

    //비디오 정보를 저장한다.
    const video = new Video(req.body);
    video.save((err, video)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    });

})

module.exports = router;
