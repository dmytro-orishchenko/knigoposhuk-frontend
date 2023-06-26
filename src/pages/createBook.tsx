import DataForm from "../components/book/dataForm";
import {axiosInstance} from "../context/authContext";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IMovie} from "../interfaces";
import {useAppSelector} from "../hook";


const CreateMovie = () => {

    const {user} = useAppSelector(state => state.userReducer);
    const navigate = useNavigate();

    const [load, setLoad] = useState(false);
    const [image, setImage] = useState<any>()
    const [times, setTimes] = useState<Date[]>([] as Date[]);

    useEffect(() => {
        if (user?.status !== 'admin') {
            navigate(-1)
        }
    }, [user])

    const onFinish = async (values: IMovie) => {
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
        dataForm.append('userId', user?._id)
        dataForm.append('times', JSON.stringify(times))

        await axiosInstance.post('/movie/createMovie', dataForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        setLoad(false)
        navigate('/home')
    }
    return (
        <DataForm
            onFinish={onFinish}
            type={'Create'}
            times={times}
            image={image}
            setImage={setImage}
            load={load}
            setTimes={setTimes}
        />
    );
};
export default CreateMovie
