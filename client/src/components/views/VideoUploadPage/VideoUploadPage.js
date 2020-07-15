import React, {useState} from 'react';
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux';

const {Title} = Typography;
const {TextArea} = Input;

const PrivateOption = [
    {value:0, label:"Private"},
    {value:1, label:"Public"},
]

const CategoryOption = [
    {value:0, label:"Film & Animation"},
    {value:1, label:"Music"},
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilepath] = useState('');
    const [Duration, setDuration] = useState('');
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (e) =>{
        setVideoTitle(e.currentTarget.value);    
    }

    const onDescChange = (e) =>{
        setDescription(e.currentTarget.value);    
    }

    const onPrivateChange = (e) =>{
        setPrivate(e.currentTarget.value);
    }

    const onCategoryChange = (e) =>{
        setCategory(e.currentTarget.value);
    }

    const onSubmit = (e) =>{
        e.preventDefault();
    
        const variables = {
            writer:user.userData._id,
            title:VideoTitle,
            description:Description,
            privacy:Private,
            filePath:FilePath,
            category:Category,
            duration:Duration,
            thumbnail:ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo',variables).then(response => {
            if(response.data.success){

                console.log("업로드 true");
                message.success('성공적으로 업로드 했습니다.');

                setTimeout(()=>{
                    props.history.push('/');
                }, 3000);
                
            } else {
                console.log("업로드 failed");
            }
        })
    }

    const onDrop = (files)=>{

        let formData = new FormData;
        
        const config ={
            header: {'content-type':'multy/form-data'}
        }

        formData.append('file',files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response =>{
            if(response.data.success){
                console.log(response.data);
                alert('파일 업로드를 성공 하였습니다.');

                let variable = {
                    filePath:response.data.url,
                    fileName:response.data.fileName
                }
                
                setFilepath(response.data.url);
                Axios.post('/api/video/thumbnail', variable).then(response =>{
                    if(response.data.success){
                        console.log(response.data)
                        console.dir(response.data)
                        setDuration(response.data.fileDuration);
                        setThumbnailPath(response.data.thumbsFilePath);
                    } else {
                        alert('썸네일 생성에 실패 했습니다.')
                    }
                })
            }else{
                alert('파일 업로드를 실패 했습니다.')
                console.log(response.data);
             }
         }) 
    }

    return (
   
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>upload Video</Title>
            </div>
         
            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    {/* dropzone */}

                    <Dropzone
                    onDrop={onDrop}
                    multyple={false}
                    maxSize={100000000000}>{({getRootProps, getInputProps}) => (
                        <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex'
                        ,alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{fontSize:'3rem'}}/>
                        </div>
                    )}
                    
                    </Dropzone>
                    {/* thumnail */}
                    {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail"></img>
                    </div>
                    }
                </div>

                <br/>
                <br/>

                <label>Title</label>
                <Input type="text" onChange={onTitleChange} value={VideoTitle}/>

                <br/>
                <br/>

                <label>Description</label>
                <TextArea type="text" onChange={onDescChange} value={Description}/>

                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOption.map((item, index) =>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                    
                </select>

                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOption.map((item, index) =>(
                            <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    submit
                </Button>
            </Form>  
        </div>
    )
}

export default VideoUploadPage;

