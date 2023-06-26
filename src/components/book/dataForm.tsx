import {Button, DatePicker, Form, FormInstance, Input, Select, Typography} from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import localeData from 'dayjs/plugin/localeData';
import {ChangeEvent, useEffect, useState} from "react";

import {genres} from "../../genres";

dayjs.extend(localeData);
dayjs.locale('uk');

const {TextArea} = Input;
const {Title} = Typography;
const {Option} = Select;

interface IProps {
    onFinish: (values: any) => void,
    type: string,
    form?: FormInstance,
    times: Date[],
    image: any,
    load: boolean,
    setTimes: (value: Date | any) => void,
    setImage: (value: any) => void,
}

const DataForm = ({onFinish, type, form, times, setTimes, image, setImage, load}: IProps) => {

    const config = {
        rules: [{type: 'object' as const, required: true, message: 'Please select time!'}],
    };
    const [time, setTime] = useState<any>(null);
   const [currentTimes, setCurrentTimes] = useState<any>([]);
    const addTime = () => {
        if (time) {
            setCurrentTimes([...times, time])
            setTime(null)
        }
    }

    useEffect(() => {
        if (currentTimes) {
            setTimes(currentTimes)
        }
    }, [currentTimes])

    const deleteTime = (index: number | any) => {
        console.log(index)
        setCurrentTimes(times.filter((_: any, i: any) => i !== index));
    };
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.files![0])
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Title level={2}>{type} movie</Title>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                alignItems: 'center',
                margin: '10px auto'
            }}>
                {
                    image?.name || (typeof image === 'string' && image?.length > 0) ? (
                        <img
                            style={{
                                width: '200px',
                                height: '300px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                            }}
                            alt={'image'}
                            src={typeof image === "string" ? image : URL.createObjectURL(image)}
                        />
                    ) : <label htmlFor={'file'} style={{
                        width: '200px',
                        height: '300px',
                        display: 'flex',
                        justifyContent: "center",
                        flexDirection: 'column',
                        padding: '20px',
                        alignItems: "center",
                        borderRadius: '10px',
                        border: '1px dashed silver',
                        cursor: "pointer",
                        transition: "300ms linear",
                    }}>
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>Upload</div>
                        <input
                            hidden
                            id={'file'}
                            accept={'image/*'}
                            type={'file'}
                            onChange={handleImageChange}
                        />
                    </label>
                }
                {
                    image &&
                    <Button
                        onClick={() => setImage(null)}
                        icon={<DeleteOutlined/>}
                    >
                        Delete
                    </Button>
                }
            </div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}
                style={{
                    maxWidth: '550px',
                    width: '100%'
                }}
                form={form ? form : undefined}
            >
                <Form.Item
                    name={'title'}
                    rules={[{required: true, message: 'Add title for movie'}]}
                >
                    <Input placeholder={'Title'}/>
                </Form.Item>
                <Form.Item
                    name={'description'}
                    rules={[{required: true, message: 'Add description for movie'}]}
                >
                    <TextArea rows={4} placeholder={'Description'}/>
                </Form.Item>
                <Form.Item
                    name={'duration'}
                    rules={[{required: true, message: 'Add duration for movie'}]}
                >
                    <Input placeholder={'Duration'}/>
                </Form.Item>
                <Form.Item
                    name={'category'}
                    hasFeedback
                    rules={[{required: true, message: 'Add a category for movie'}]}
                >
                    <Select placeholder={'Select a category'}>
                        {
                            genres?.map((genre, index) => (
                                <Option key={index} value={genre}>
                                    {genre}
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(100% - 100px)',
                                marginBottom: 0
                            }}
                            label="Time" {...config}>
                            <DatePicker
                                value={time ? dayjs(time) : null}
                                format={"DD/MM/YYYY HH:mm"}
                                showTime
                                onChange={(e) => setTime(e)}
                                style={{width: '100%'}}/>
                        </Form.Item>
                        <Button style={{width: '100px'}} icon={<PlusOutlined/>} onClick={addTime}>
                            Add time
                        </Button>
                    </div>

                    {
                        times?.length > 0 &&
                        <div style={{
                            display: 'flex',
                            width: '100%0',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: '10px',
                            margin: '20px auto'
                        }}>
                            {
                                times?.map((item, index: any) => (
                                    <div
                                        key={index}
                                        style={{
                                            fontSize: '14px',
                                            padding: '5px 10px',
                                            border: '1px solid silver',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: '10px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {dayjs(item).format('DD/MM/YYYY HH:mm')}
                                        <Button
                                            onClick={() => deleteTime(index)}
                                            icon={<DeleteOutlined/>}/>
                                    </div>
                                    // <Tag key={index}
                                    //      closable
                                    //      onClose={() => deleteTime(index)}
                                    //      style={{
                                    //          fontSize: '14px'
                                    //      }}
                                    // >
                                    // {/*{dayjs(item).format('DD/MM/YYYY HH:mm')}*/}
                                    // </Tag>
                                ))
                            }
                        </div>
                    }
                </div>
                <Form.Item>
                    <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button">
                        {
                            load ? 'Loading...' : type
                        }
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default DataForm
