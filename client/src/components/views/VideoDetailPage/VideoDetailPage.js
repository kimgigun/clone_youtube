import React, {useState, useEffect}from 'react';
import {Row, Col, List} from 'antd';
import Axios from 'axios';
import SideVideo from './Section/SideVideo'

function VideoDetailpage(props){

    const videoId = props.match.params.videoId;
    
    const variable = {videoId: videoId}
    
    console.log(variable);

    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(()=>{
        Axios.post('/api/video/getVideoDetail', variable).then(response =>{
            if(response.data.success){
                setVideoDetail(response.data.videoDetail);
                console.log(response.data.videoDetail);
            }else{
                alert('비디오 정보 가져오기 실패');
            }
        })
    },[]);

    if(VideoDetail.writer){
        return(
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>

                    <div style={{width:'100%', padding:'3rem 4rem'}}>
                        <video style={{width:"100%"}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls autoPlay/>
                        <List.Item >
                            <List.Item.Meta title={VideoDetail.writer.name} description={VideoDetail.description}/>
                        </List.Item>
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                 <SideVideo/>
                </Col>
            </Row>
        );
    }else {

        return(
            <div>...loading</div>
        );
        
    }
}

export default VideoDetailpage;