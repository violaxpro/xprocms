import React from 'react'
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import logo from "../../../../assets/images/logo.png";
import { menuItems } from './menu-items';
import { Link } from "react-router-dom";

const Sidebar = () => {
    const renderMenuItems = (items) => {
        return items.map(item => {
            if (item.type === 'group') {
                // Jika item adalah grup (label abu-abu)
                return {
                    key: item.key,
                    label: item.label,
                    type: 'group',
                    children: item.children ? renderMenuItems(item.children) : undefined,
                };
            } else if (item.children) {
                // Jika item memiliki sub-menu (dropdown)
                return {
                    key: item.key,
                    icon: item.icon ? <item.icon /> : null,
                    label: item.label,
                    children: renderMenuItems(item.children), // Rekursif untuk sub-menu
                };
            } else {
                // Jika item adalah item tunggal (tanpa sub-menu)
                return {
                    key: item.key,
                    icon: item.icon ? <item.icon /> : null,
                    label: (
                        // Menggunakan Link dari react-router-dom jika ada href
                        item.href ?
                            <Link to={item.href} className="!text-inherit">
                                {item.label}
                            </Link> :
                            item.label // Jika tidak ada href, tampilkan label saja
                    ),
                };
            }
        });
    };

    const items = renderMenuItems(menuItems);

    return (
        <Sider
            // className='!bg-white'
            style={{ backgroundColor: "white" }}
            breakpoint="lg"
            collapsedWidth="0"
            width={250}
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="demo-logo-vertical my-2 ">
                <img src={logo} alt='logo' width={200} height={75} />
            </div>
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={items} style={{ width: 250 }} />
        </Sider>

    )
}

export default Sidebar
