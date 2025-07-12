// DashboardLayout.tsx
'use client';
import React, { useEffect } from 'react';
import Sidebar from './sidebar';
import HeaderLayout from './header';
import Layout from 'antd/es/layout/layout';
import { Footer } from 'antd/es/layout/layout';

export default function MainLayout({ children }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <HeaderLayout />
                {children}
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
}
