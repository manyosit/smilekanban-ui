import React from 'react';
import {Select} from 'antd';
import useQuery from "../../util/useQuery"
import {translateQuery} from "../../util/componentUtils"
const {Option}=Select

const SelectField = ( props)=>{

    const {menuValues,id,onChange,valueTarget,labelTarget,form,query,allFormValues,labelField,valueField,value}=props



    const [init,setInit]=React.useState(false)
    const [formQuery,setFormQuery]=React.useState()
    const [dynOptions,setdynOptions]=React.useState([])
    React.useEffect(()=>{
        if (query){
            setFormQuery(encodeURI(translateQuery(query,allFormValues)))

        }


    },[query,allFormValues])

    React.useEffect(()=>{

        if (formQuery){
            setInit(true)
        }


    },[formQuery])

    const data = useQuery({
            url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${form}?q=${formQuery}`,
            requestOptions:
                {
                    method:"GET",
                    headers:{"content-type":"application/json"}
                }
        },
        [init], init )

    React.useEffect(()=>{
        if(data && data.entries && data.entries.length>0){
            setInit(false)
            const options=data.entries.map((e,i)=>{return {key:i,label:e.values[labelField],value:e.values[valueField]}}).filter((x, i, a) => a.map(e=>e.value).indexOf(x.value) === i)


            setdynOptions(options)
            if (valueTarget){
                if (options.map(e=>e.value).indexOf(allFormValues[valueTarget])<0){
                    onChange(valueTarget,null)
                    labelTarget && onChange(labelTarget,null)

                }
            }else{
                if (options.map(e=>e.value).indexOf(allFormValues[id])<0){
                    onChange(id,null)
                    console.log(id,allFormValues)
                }
            }


        }


    },[data])





    return (
        <Select
            key={id}
            value={value}
            showSearch
            filterOption={(input,option)=>(option.label.toLowerCase().indexOf(input.toLowerCase())>=0)}
            onChange={(val,e)=>{
               
                if (valueTarget || labelTarget){
                    if (valueTarget){

                        onChange(valueTarget,e.value)
                    }
                    if (labelTarget){
                        onChange(labelTarget,e.label)
                    }
                }else{

                    onChange(id,val)
                }



            }}
            options={query?dynOptions:menuValues}
        />
    )
}

export default SelectField
