import React from 'react'
import { Drawer,Comment, Tooltip, List,Spin,Col,Form,Button,Row } from 'antd';
import {useWindowSize} from "../../util/useWindowSize"
import {connect,useDispatch} from "react-redux";
import moment from 'moment';
import {createWorklog} from "../../util/redux/asyncActions"

import AddWorklog from "./AddWorklog"

const select = state => {
    let sProps={}
    sProps.loading=state.request.loading;
    sProps.ticketConfig=state.request.ticketConfig;
    sProps.worklogs=state.request.worklogs;
    return sProps

}
const WorkLogs=(props)=>{

    const {visible,handleClose,item,worklogs,ticketConfig,loading,history,userManager}=props
    const size=useWindowSize();
    const [data,setData]=React.useState();
    const [wlState,setWlState]=React.useState({});
    const ticketId=item && ticketConfig && item[ticketConfig.idField]
    const dispatch=useDispatch();

    React.useEffect(() => {



        let wlFields={}
        ticketConfig && ticketConfig.worklogs  && ticketConfig.worklogs.fields && ticketConfig.worklogs.fields.forEach(e => {
            wlFields[e.id] = ""

        })
        setWlState(wlFields)

    }, [props])

    React.useEffect(()=>{

        if (worklogs ){

            setData(worklogs.map(e=>({
                    submitter:e.values[ticketConfig.worklogs.displayFields.submitter],
                    text:(<p>{e.values[ticketConfig.worklogs.displayFields.text]}</p>),
                    date:(
                            <span>{moment(e.values[ticketConfig.worklogs.displayFields.date]).format(ticketConfig.dateFormat)}</span>
                   ),
                })
            ))
        }
    },[worklogs,item])

    return (
        <Drawer
            title={`${ticketId} Worklogs`}
            placement={"bottom"}
            closable={true}
            onClose={handleClose}
            visible={visible}
            key={"worklogs"}
            height={window.innerHeight/3*2}
        >
            <Row>
            <Col span={16}>
                <Spin spinning={loading}>
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <li>
                                <Comment

                                    author={item.submitter}

                                    content={item.text}
                                    datetime={item.date}
                                />
                            </li>
                        )}
                    />
                </Spin>
            </Col>
            <Col span={8}>
                <Form
                onFinish={()=>{
                    dispatch(createWorklog({ item,wlFields:wlState,worklogConfig:ticketConfig.worklogs, history,userManager }))
                }}
                >
                <AddWorklog
                    worklogs={true}
                    worklogConfig={ticketConfig && ticketConfig.worklogs}
                    setWlState={setWlState}
                    wlState={wlState}
                />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Worklog
                        </Button>

                    </Form.Item>
                </Form>
            </Col>
            </Row>
        </Drawer>

    )

}

export default connect(select)(WorkLogs)
