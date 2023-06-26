import {Link, useNavigate, useParams} from "react-router-dom";
import {CSSProperties, useEffect, useMemo, useState} from "react";
import {Button, Col, Row, Typography} from 'antd';
import {EditOutlined, HeartOutlined, HeartFilled} from "@ant-design/icons";

import {IMovie} from "../interfaces";
import {axiosInstance} from "../context/authContext";
import {useAppSelector} from "../hook";
import dayjs from "dayjs";

const {Title, Text} = Typography;

const ShowMovie = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.userReducer);

    const [isInclude, setIsInclude] = useState(false);
    const [load, setLoad] = useState(true);
    const [movieData, setMovieData] = useState<IMovie>({} as IMovie);

    useEffect(() => {
        if (id) {
            (async () => {
                axiosInstance.get(`/movie/oneMovie/${id}`)
                    .then((res) => {
                        if (res) {
                            setMovieData(res.data)
                        }
                    })
                    .catch((error) => console.log(error))
                setLoad(false)
            })()
        }
    }, [id]);

    const movie = useMemo(() => movieData, [movieData]);

    const ml = '20px';
    const level = 4;

    useEffect(() => {
        if (user?.favoritesMovie?.length > 0) {
            setIsInclude(user?.favoritesMovie?.includes(id));
        }
    }, [user?.favoritesMovie, id]);

    const addRemoveFavorites = async () => {
        const data = await axiosInstance.patch(`/user/updateFavoritesMovie/${id}`);
        if (data?.data?.user) {
            localStorage.setItem('user', JSON.stringify(data?.data?.user))
        }
        setIsInclude(!isInclude)
    }

    if (load) return <div>Loading...</div>

    return (
        <div>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'end',
                gap: '10px'
            }}>

                <Button icon={isInclude ? <HeartFilled/> : <HeartOutlined/>}
                        onClick={addRemoveFavorites}
                >
                    {isInclude ? 'Remove from favorites' : 'Add to favorites'}
                </Button>
                {
                    (user?.status === 'admin' || user?._id === movie?.createdBy) && (
                        <Button
                            icon={<EditOutlined/>}
                            onClick={() => navigate(`/home/edit/${movie?._id}`)}
                        >
                            Edit
                        </Button>
                    )
                }
            </div>
            <Row gutter={{xs: 8, md: 16}}>
                <Col xs={{span: 16}} md={{span: 16}} style={{
                    marginTop: '26.6px'
                }}>
                    <img
                        src={movie?.image}
                        alt={'image'}
                        style={{
                            width: '90%',
                            maxWidth: '400px',
                            height: '80%',
                            maxHeight: '500px',
                            objectFit: 'cover',
                            borderRadius: '15px'
                        }}
                    />
                </Col>
                <Col xs={{span: 16}} md={{span: 8}}>
                    {
                        (!movie._id && load) ? <div>Loading...</div> : movie?._id && (
                            <>
                                <Title level={level}>
                                    Title
                                </Title>
                                <Text style={{
                                    marginLeft: ml,
                                    fontSize: '18px'
                                }}>
                                    {movie?.title}
                                </Text>
                                <Title level={level}>
                                    Genre
                                </Title>
                                <Link to={`/home?title=&category=${movie?.category}`} style={{
                                    marginLeft: ml
                                }}>
                                    {movie?.category}
                                </Link>
                                <Title level={level}>
                                    Duration
                                </Title>
                                <Text style={{
                                    marginLeft: ml
                                }}>
                                    {movie?.duration}
                                </Text>
                                <Title level={level}>
                                    Times
                                </Title>
                                <Text style={{
                                    marginLeft: ml
                                }}>
                                    {
                                        movie?.times?.map((item, index) => (
                                            <div key={index}>
                                                {time(item)}
                                            </div>
                                        ))
                                    }
                                </Text>
                                <Title level={level}>
                                    Description
                                </Title>
                                <Text style={{
                                    marginLeft: ml,
                                    whiteSpace: 'break-spaces'
                                }}>
                                    {movie?.description}
                                </Text>
                            </>
                        )
                    }
                </Col>
            </Row>
        </div>
    );
};

function time(date: Date) {
    return `${dayjs(date).format('DD/MM/YYYY HH:mm')}`
}

export default ShowMovie
