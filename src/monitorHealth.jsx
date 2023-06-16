import React ,{useState,useEffect} from 'react'
import axios from 'axios'

export default function MonitorHealth({streamId,apiKey}) {

    const streamAPI = {
        getStatus: async function (streamId,apiKey) {
        const url=`https://livepeer.studio/data/${streamId}/health`
        const config = {
            headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
            },
            };
        
        try{
        const response= await axios.get(
            url,
            config
            )

            return response;
        }catch(e){
            console.log(e)
            }
    
        },
  }
     useEffect(() => {
          const getHealthStatus=async()=>{
            const status =await streamAPI.getStatus(streamId,apiKey)
            console.log(status)
          }
          getHealthStatus()
           
       }, [])
  
 

  return (
    <div>

    </div>
  )
}
