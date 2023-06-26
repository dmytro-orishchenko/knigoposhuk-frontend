import {Outlet, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HeartOutlined,
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import {Layout as LayoutBody, Menu, Button, theme, Avatar} from 'antd';
import {useAppSelector} from "../hook";
import {ItemType, MenuItemType} from "antd/es/menu/hooks/useItems";

const {Header, Sider, Content} = LayoutBody;

const Layout = () => {

    const navigate = useNavigate();
    const {user} = useAppSelector(state => state.userReducer);
    const [path, setPath] = useState<any>();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    useEffect(() => {
        if (window.location.pathname) {
            const myPath = window.location.pathname?.split('/')[1];
            setPath(`/${myPath}`)
        }
    }, [window.location.pathname]);

    const users: ItemType<MenuItemType> | any = user?.status === 'admin' && {
        key: '/users',
        icon: <UsergroupAddOutlined/>,
        label: 'Users',
    }

    return (
        <LayoutBody style={{
            height: '100vh'
        }}>
            {
                user?._id &&
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical"/>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[path]}
                        defaultSelectedKeys={[path]}
                        onClick={({key}) => {
                            if (key === 'logout') {
                                localStorage.clear()
                                window.location.reload()
                            } else {
                                navigate(key)
                            }
                        }}
                        items={[
                            {
                                key: '/home',
                                icon: <HomeOutlined/>,
                                label: 'Home',
                            },
                            {
                                key: '/favorites',
                                icon: <HeartOutlined />,
                                label: 'Favorites',
                            },
                            users,
                            {
                                key: '/profile',
                                icon: <UserOutlined/>,
                                label: 'Profile',
                            },
                            {
                                key: 'logout',
                                icon: <LogoutOutlined/>,
                                label: 'LogOut',
                                danger: true
                            },
                        ]}
                    />
                </Sider>
            }
            <LayoutBody>
                <Header style={{
                    padding: 0, background: colorBgContainer,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: '20px',
                    paddingLeft: '0',
                    width: '100%'
                }}>
                    {
                        user?._id &&
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    }
                    {
                        user?._id &&
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                textTransform: 'uppercase'
                            }}>
                                {user?.name}
                            </div>
                            <Avatar
                                style={{
                                    cursor: 'pointer',

                                }}
                                onClick={() => navigate('/profile')}
                                icon={<UserOutlined/>}/>
                        </div>
                    }
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: "auto"
                    }}
                >
                    <Outlet/>
                </Content>
            </LayoutBody>
        </LayoutBody>
    );
};
export default Layout
