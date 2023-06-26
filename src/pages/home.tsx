import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {ILesson} from "../interfaces";
import {axiosInstance} from "../context/authContext";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import ScheduleCard from "../components/schedule/scheduleCard";
import dayjs from "dayjs";

const Search = () => {

    const [searchValue, setSearchValue] = useState('');
    const [allLesson, setAllLesson] = useState<ILesson[]>([] as ILesson[]);
    const [load, setLoad] = useState(true);

    const [debounceValue] = useDebounce(searchValue, 500);

    useEffect(() => {
        (async () => {
            setLoad(true)
            const axiosResponse = await axiosInstance.get(`/lesson/list?title=${debounceValue}`);
            if (axiosResponse) {
                setAllLesson(axiosResponse?.data)
                setLoad(false)
            }
        })()
    }, [debounceValue]);

    return (
        <div>
            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                margin: '20px auto'
            }}>
                <Input
                    style={{
                        maxWidth: '550px'
                    }}
                    prefix={<SearchOutlined/>}
                    placeholder={'Enter search value'}
                    value={searchValue ? searchValue : ''}
                    onChange={(e) => setSearchValue(e.target.value)}
                    size={'middle'}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
                margin: 'auto'
            }}>
                {
                    load ? <div>Loading...</div> : allLesson?.length > 0 ?
                        allLesson?.map((lesson) => (
                            <div key={lesson?._id} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'center',
                                width: '100%',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px'
                                }}>
                                    <div>
                                        {dayjs(lesson?.start).format('HH:mm')}
                                    </div>
                                    <div>
                                        {dayjs(lesson?.end).format('HH:mm')}
                                    </div>
                                </div>
                                <ScheduleCard lesson={lesson}/>
                            </div>
                        )) : <div>Lessons not found</div>
                }
            </div>
        </div>
    );
};
export default Search
