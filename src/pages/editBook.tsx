import {Form} from "antd";
import {useEffect, useState} from "react";
import {axiosInstance} from "../context/authContext";
import {useNavigate, useParams} from "react-router-dom";
import DataForm from "../components/book/dataForm";
import {AxiosResponse} from "axios";
import {IMovie} from "../interfaces";

const EditMovie = () => {
    const [form] = Form.useForm();
    const {id} = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState<any>();
    const [load, setLoad] = useState(false);
    const [times, setTimes] = useState<Date[]>([] as Date[]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<IMovie, any> = await axiosInstance.get(`/movie/oneMovie/${id}`);
                const data = response.data;
                setImage(data?.image)
                setTimes(data?.times)
                form.setFieldsValue(data); // Встановлюємо значення полів форми
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [form]);

    const onFinish = async (values: any) => {
        const dataForm = new FormData();
        if (!image) {
            return alert('Add post image')
        }
        setLoad(true)
        if (image?.name) {
            dataForm.append('image', image as File);
        }
        dataForm.append('title', values?.title)
        dataForm.append('description', values?.description)
        dataForm.append('duration', values?.duration)
        dataForm.append('category', values?.category)
        dataForm.append('times', JSON.stringify(times))

        await axiosInstance.patch(`/movie/oneMovie/${id}`, dataForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        setLoad(false)
        navigate(-1);
    }
    return (
        <DataForm
            load={load}
            onFinish={onFinish}
            type={'Edit'}
            form={form}
            setTimes={setTimes}
            times={times}
            image={image}
            setImage={setImage}
        />
    );
};
export default EditMovie
