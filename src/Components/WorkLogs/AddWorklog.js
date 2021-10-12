import React from 'react'
import { Input,Form,Radio} from 'antd';

import Select from '../Select/Select'

const {TextArea}=Input


const element = {
    "text": Input,
    "select": Select,
    "textArea":TextArea,
    "radio":Radio.Group
}

const AddWorklog=(props)=>{
    const {worklogs,worklogConfig,setWlState,wlState}=props
    
    
    return (
        <>
            {
                worklogs && worklogs && worklogConfig.fields && <h3>Add Worklog</h3>
            }{

            worklogs && worklogConfig  &&  worklogConfig.fields &&  worklogConfig.fields.map((e,i)=>{

                const FieldElement = element[e.type]
                const onChange=(field,val)=>{

                    let tmp={...wlState}
                    tmp[field]=val

                    setWlState(tmp)

                }

                return( <Form.Item
                    key={"wl-"+i}
                    label={e.name}
                    hidden={e.hidden}
                    rules={[
                        {
                            required: e.required,
                        },
                    ]}
                >

                    <FieldElement

                        onChange={(el,val)=>{
                            if (el.target && el.target.value){
                                onChange(e.id,el.target.value)
                            }else{

                                onChange(e.id,val)
                            }

                        }}

                        {...e}
                        value={wlState[e.id]}

                    />

                </Form.Item>)
            })


        }
        </>
    )
}

export default AddWorklog
