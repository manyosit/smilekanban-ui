import React from "react"
import {Drawer, Comment, Tooltip, Form, Input, Button,Radio} from 'antd';
import {useWindowSize} from "../../util/useWindowSize"
import moment from 'moment';
import Select from '../Select/Select'
import AddWorklog from '../WorkLogs/AddWorklog'
const {TextArea}=Input


export default function StatusFields(props) {

    const element = {
        "text": Input,
        "select": Select,
        "textArea":TextArea,
        "radio":Radio.Group
    }
    

    const size = useWindowSize();
    const {visible, handleClose, fields, item, status, constants, worklogs, worklogConfig,ticketConfig} = props
    const [form] = Form.useForm();
    const [state, setState] = React.useState({});
    const [wlState, setWlState] = React.useState({});
    const onFinish = (values) => {
       
        handleClose({item, fields: {...values, ...constants}, status,worklogConfig,wlFields:wlState})
    }

    console.log(item)
    React.useEffect(() => {

        let initState = {}
        fields.forEach(e => {
            initState[e.id] = item[e.id]
            form.setFieldsValue({[e.id]: item[e.id]});
        })
        setState(initState)

        let wlFields={}
        worklogConfig && worklogConfig.fields && worklogConfig.fields.forEach(e => {
            wlFields[e.id] = ""

        })
        setWlState(wlFields)

    }, [fields, item, status])


    return (
        <Drawer
            title={ticketConfig && ticketConfig.idField && item && item[ticketConfig.idField] && `${item[ticketConfig.idField]} Details`}
            placement={"right"}
            closable={true}
            onClose={handleClose}
            visible={visible}
            key={"fields"}
            width={size.height / 3 * 2}
        >
            <Form
                style={{marginTop:15}}
                form={form}
                name="fields-ref"
                onFinish={onFinish}

                onValuesChange={(_, allFields) => {

                    setState(allFields);
                    console.log(allFields)
                }}
            >
                {
                    ticketConfig && ticketConfig.cardFields && Object.keys(ticketConfig.cardFields).map((field,index)=>{

                        const FieldElement = element["text"]
                        const onChange = (field, val) => {

                            form.setFieldsValue({[field]: val})
                        }
                        <Form.Item
                            key={`ticketFields-${index}`}
                            name={field}
                            label={field}


                        >
                            <FieldElement {...field} onChange={onChange} allFormValues={state} value={state[field]}/>
                        </Form.Item>
                    })
                }
                {
                    fields && fields.map((e, i) => {

                        const FieldElement = element[e.type]
                        const onChange = (field, val) => {

                            form.setFieldsValue({[field]: val})
                        }
                        return (<Form.Item
                            key={i}
                            name={e.id}
                            label={e.name}
                            hidden={e.hidden}
                            rules={[
                                {
                                    required: e.required,
                                },
                            ]}
                        >


                            <FieldElement {...e} onChange={onChange} allFormValues={state} value={state[e.id]}/>

                        </Form.Item>)
                    })
                }
                <AddWorklog
                    worklogs={worklogs}
                    worklogConfig={worklogConfig}
                    setWlState={setWlState}
                    wlState={wlState}
                />



                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button htmlType="button" onClick={handleClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>

    )

}
