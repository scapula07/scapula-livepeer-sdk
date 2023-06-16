import React ,{useState,useEffect} from 'react'
import axios from 'axios'
import "./health.css"

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
    <div className='monitor-container'>
        <h5 className='heading-monitor'>Health Status</h5>

        <div className='status-div'>
            {[{
                type:"Status",
                state:"idle"
              },
              {
                type:"Transcoding",
                state:"---"
              },
              {
                type:"Realtime",
                state:"---"

              }
        
             ].map((state)=>{
                return(
                    <div className='types'>
                        <h5 className='type-h'>{state.type} :</h5>
                        <h5 className='type-h'>{state.state}</h5>

                     </div>
                )
            })

            }

        </div>
         
    </div>
  )
}
