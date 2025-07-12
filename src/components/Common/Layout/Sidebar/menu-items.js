import {
    DatabaseOutlined,
    QuestionCircleOutlined,
    ProjectOutlined,
    SettingOutlined,
    CustomerServiceOutlined,
    CommentOutlined,
    BookOutlined,
    TeamOutlined,

} from '@ant-design/icons';

export const menuItems = [
    {
        key: 'group-dashboard',
        label: 'Dashboard',
        type: 'group',
        children: [
            {
                key: 'dashboard',
                label: 'Dashboard',
                icon: DatabaseOutlined,
                href: '/dashboard',
                children: [
                    {
                        key: 'visitor-traffic',
                        label: 'Visitor Traffic',
                        href: '/visitor-traffic',
                    },
                    {
                        key: 'customer-engagement',
                        label: 'Customer Engagement',
                        href: '/customer-enggagement',
                    },
                    {
                        key: 'callback-inquiries',
                        label: 'Callback Inquiries',
                        href: '/callback-inquiries',
                    },
                    {
                        key: 'google-analytic',
                        label: 'Google Analytics Traffic',
                        href: '/google-analytic',
                    },
                ],
            }
        ]
    },
    {
        key: 'group-callback',
        label: 'Callback Request',
        type: 'group',
        children: [
            {
                key: 'callback',
                label: 'Callback Request',
                icon: CustomerServiceOutlined,
                children: [
                    {
                        key: 'customer-request',
                        label: 'Customer Request',
                        href: '/customer-request',
                    },
                ],
            }
        ]
    },
    {
        key: 'group-pages-setting',
        label: 'Pages Setting',
        type: 'group',
        children: [
            {
                key: 'pages-setting',
                label: 'Pages Setting',
                icon: SettingOutlined,
                children: [
                    {
                        key: 'homepage-setting',
                        label: 'Homepage Setting',
                        href: '/homepage-setting',
                    },
                    {
                        key: 'categories',
                        label: 'Category',
                        href: '/categories',
                    },
                    {
                        key: 'pages',
                        label: 'Pages',
                        href: '/pages',
                    },
                    {
                        key: 'about-us',
                        label: 'About Us',
                        href: '/about-use',
                    },
                    {
                        key: 'brands',
                        label: 'Brand',
                        href: '/brands',
                    },
                ]
            }
        ],
    },
    {
        key: 'group-faq',
        label: 'FAQ',
        type: 'group',
        children: [
            {
                key: 'faq',
                label: 'FAQ',
                icon: QuestionCircleOutlined,
                children: [
                    {
                        key: 'faqs-list',
                        label: 'List',
                        href: '/faqs',
                    },
                    {
                        key: 'faq-categories',
                        label: 'Category',
                        href: '/faq-categories',
                    },
                ]
            }

        ],
    },
    {
        key: 'group-projects',
        label: 'Projects',
        type: 'group',
        children: [
            {
                key: 'projects',
                label: 'Projects',
                href: '/projects',
                icon: ProjectOutlined
            }
        ]
    },
    {
        key: 'group-testimonial',
        label: 'Testimonial',
        type: 'group',
        children: [
            {
                key: 'testimonial',
                label: 'Testimonial',
                icon: CommentOutlined,
                href: '/testimonials',
            }
        ]
    },
    {
        key: 'group-blog',
        label: 'Blog',
        type: 'group',
        children: [
            {
                key: 'blog',
                label: 'Blog',
                icon: BookOutlined,
                children: [
                    {
                        key: 'blogs',
                        label: 'Post',
                        href: '/blogs',
                    },
                    {
                        key: 'blog-categories',
                        label: 'Category',
                        href: '/blog-categories',
                    },
                ]
            }
        ],
    },
    {
        key: 'group-partner',
        label: 'Partner',
        type: 'group',
        children: [
            {
                key: 'partner',
                label: 'Partner',
                icon: TeamOutlined,
                children: [
                    {
                        key: 'partner-list',
                        label: 'Partner',
                        href: '/partner',
                    },
                    {
                        key: 'continent',
                        label: 'Continent',
                        href: '/continent',
                    },
                ]
            }

        ],
    },
    {
        key: 'group-settings',
        label: 'Settings',
        type: 'group',
        children: [
            {
                key: 'settings',
                label: 'Settings',
                href: '/settings',
                icon: SettingOutlined,
            }
        ]
    },
];
