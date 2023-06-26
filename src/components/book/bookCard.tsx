import {IMovie} from "../../interfaces";
import {Button} from "antd";
import {EyeOutlined, EditOutlined, ClockCircleOutlined, HeartFilled, HeartOutlined, CalendarOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hook";
import {CSSProperties, useEffect, useState} from "react";
import {axiosInstance} from "../../context/authContext";
import dayjs from "dayjs";
import {userActions} from "../../redux";

interface IProps {
    movie: IMovie
}

const MovieCard = ({movie}: IProps) => {
    const {user} = useAppSelector(state => state.userReducer);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isInclude, setIsInclude] = useState(false);

    useEffect(() => {
        if (user?.favoritesMovie?.length > 0) {
            setIsInclude(user?.favoritesMovie?.includes(movie?._id));
        }
    }, [user]);

    const addRemoveFavorite = async () => {
        const data = await axiosInstance.patch(`/user/updateFavoritesMovie/${movie?._id}`);
        if (data?.data?.user) {
            await dispatch(userActions.newUserData({user: data?.data?.user}))
        }
        setIsInclude(!isInclude)
    }
    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px'
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            flexWrap: 'wrap',
            gap: '10px',
            background: '#dfdfea'
        }}>
            <div style={{
                borderRadius: '10px 10px 0 0',
                width: '100%',
                position: 'relative'
            }}>
                <img
                    alt={'image'}
                    src={movie?.image}
                    style={{
                        width: '100%',
                        height: '275px',
                        borderRadius: '10px 10px 0 0',
                        objectFit: 'cover'
                    }}
                />
                <Button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 10
                    }}
                    icon={isInclude ? <HeartFilled/> : <HeartOutlined/>}
                    onClick={addRemoveFavorite}
                />
            </div>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '15px',
                gap: '10px'
            }}>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 600
                }}>
                    {movie?.title}
                </div>
                <div>
                    {movie?.category}
                </div>
                <div style={style}>
                    <ClockCircleOutlined/>
                    {movie?.duration}
                </div>
                <div style={style}>
                    <CalendarOutlined/>
                    {dayjs(movie?.times[0]).format('DD/MM/YYYY HH:mm')}...
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '5px',
                    width: '100%',
                    justifyContent: 'end'
                }}>
                    {
                        (user?.status === 'admin' || user?._id === movie?.createdBy) &&
                        <Button shape={'circle'} onClick={() => navigate(`/home/edit/${movie?._id}`)}>
                            <EditOutlined/>
                        </Button>
                    }
                    <Button shape={'circle'} onClick={() => navigate(`/home/show/${movie?._id}`)}>
                        <EyeOutlined/>
                    </Button>

                </div>
            </div>
        </div>
    );
};
export default MovieCard
