import React,{useState, useEffect} from 'react';
import Axios from 'axios';

function SideVideo() {

    const [SideVideo,setSideVideo] = useState([]);

    useEffect(()=>{
        Axios.get('/api/video/getVideos').then(response => {
          if(response.data.success){
            console.log(response.data);
            setSideVideo(response.data.videos)
    
          } else {
            alert('비디오 가져오기 실패')
          }
        })
      },[])

    

    const renderSideVideo = SideVideo.map((video, index)=>{
        
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return ( 
        
            <div key={index} style={{display:'flex', marginBottom: '1rem', padding: '0 2rem'}}>
                <div style={{width:'40%', marginBottom:'1rem'}}>
                    <a href>
                        <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt=""/>
                    </a>
                </div>

                <div style={{width:'50%'}}>
                    <a href=""></a>
                    <span style={{fontSize:'1rem', color:'black'}}>{video.title}</span><br/>
                    <span>video.wirter.name</span><br/>
                    <span>video.views</span><br/>
                    <span>{minutes}:{seconds}</span><br/>
                </div>
            </div>  
        )
       
    })

    

    return (
        <React.Fragment>
            {renderSideVideo}
        </React.Fragment>
    
    )
}

export default SideVideo
