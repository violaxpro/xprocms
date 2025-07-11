import React, { useState, useEffect, cloneElement } from 'react';
import Breadcrumbs from "components/Common/Breadcrumb";
import { Button, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
import CreateUpdate from './Action/CreateUpdate';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Router, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import SetCategoryPage from './Action/SetCategoryPage';
import DeleteConfirmation from 'components/Common/DeleteConfirmation';
import { del } from 'helpers/api_helper';
import { getImageUrl, showToast } from 'helpers/utils';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { HolderOutlined } from '@ant-design/icons';
import { CSS } from "@dnd-kit/utilities";
import { Pagination, Table } from "antd";

const RowDrag = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props["data-row-key"]
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1
      }
    )?.replace(/translate3d\(([^,]+),/, "translate3d(0,"),
    transition,
    ...(isDragging
      ? {
        position: "relative",
        zIndex: 9999
      }
      : {})
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {children.length > 0 && children?.map((child) => {
        if (child.key === "sort") {
          return cloneElement(child, {
            children: (
              <HolderOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "pointer"
                }}
                {...listeners}
              />
            )
          });
        }
        return child;
      })}
    </tr>
  );
};

const Category = () => {
  const { id } = useParams()
  const [deleteId, setDeleteId] = useState(null)
  const [modal, setModal] = useState(false);
  const [modalPage, setModalPage] = useState(false);
  const [modalData, setModalData] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showDelete, setShowDelete] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const { data, refetch: getData, isLoading } = useQuery(['categories', search, page, id], () => api.categories({
    params: {
      id: id,
      page: page,
      search: search,
    }
  }), {
    refetchOnWindowFocus: false,
  });

  const toggle = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  const togglePage = () => {
    if (modalPage) {
      setModalPage(false);
    } else {
      setModalPage(true);
    }
  };

  const handleCreateModal = () => {
    setModalData(null)
    toggle();
  };

  const handleUpdateModal = (data) => {
    setModalData(data)
    toggle();
  };

  const handleActiveCategory = async (data) => {
    try {
      const newStatus = data.status === 1 ? 0 : 1;

      const formData = new FormData();

      formData.append('_method', 'put');
      formData.append('parent_id', data.parent_id);
      formData.append('page_id', data.page_id);
      formData.append('name', data.name);
      formData.append('is_best', data.is_best);
      formData.append('slug', data.slug);
      formData.append('position', data.position);
      formData.append('image', data.image);
      formData.append('status', newStatus);


      await api.updateCategory(data.id, formData);

      showToast('Status updated successfully');
      getData(); // refetch table biar updated
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  }

  const handleUpdatePosition = async (newList) => {
    try {
      for (let i = 0; i < newList.length; i++) {
        const item = newList[i];

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('position', i + 1); // misal urutan 1-based

        // Kalau field lain perlu, tambahkan di sini
        formData.append('parent_id', item.parent_id);
        formData.append('page_id', item.page_id);
        formData.append('name', item.name);
        formData.append('is_best', item.is_best);
        formData.append('slug', item.slug);
        formData.append('image', item.image);
        formData.append('status', item.status);

        await api.updateCategory(item.id, formData);
      }

      showToast('Positions updated successfully');
      getData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update positions', 'error');
    }
  };


  const handleCategoryPageModal = async (data) => {
    const res = await api.categoryPage(data.id);
    setModalData({ category_id: data.id, ...res.data })
    togglePage();
  };

  const deleteAction = async () => {
    const categories = await del(`/categories/${deleteId}`);
    setShowDelete(false)
    getData();
  }

  const selectRow = {
    mode: "checkbox",
    hideSelectColumn: true,
    hideSelectAll: true,
  };

  //pagination customization
  const pageOptions = {
    page: 1,
    sizePerPage: 10,
    pageStartIndex: 1,
    totalSize: data?.total,
    custom: true,
  };

  const lastPosition = data?.data?.reduce((max, cat) => {
    const pos = parseInt(cat.position, 10) || 0;
    return pos > max ? pos : max;
  }, 0) || 0;


  const defaultSorted = [
    {
      dataField: "id",
      sort: "desc",
      order: 'desc',
    },
  ];

  const columns = [
    {
      key: "sort"
    },
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (cellContent, row, i) => i + 1
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (cellContent, row, i) => <Link to={`/categories/${row.id}`}>{row.name}</Link>,
    },
    {
      title: 'Background Image',
      dataIndex: 'image',
      key: 'image',
      render: (cellContent, row, i) => {
        if (row.image) {
          return <img src={getImageUrl(row.image)} width={200} />
        }
        return '-'
      },
    },
    {
      title: 'Best Category',
      dataIndex: 'is_best',
      key: 'is_best',
      render: (cellContent, row, i) => <span>{!!row.is_best ? 'Yes' : 'No'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (cellContent, row, i) => (
        row.status == 1 ? (
          <div className="badge badge-soft-success">Active</div>
        ) : (
          <div className="badge badge-soft-danger">Inactive</div>
        )
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (cellContent, row) => (
        <>
          <UncontrolledButtonDropdown direction="start">
            <DropdownToggle caret>
              Action
            </DropdownToggle>
            <DropdownMenu>
              {/* <Link to={`/category-page/${row.id}`}>
                <DropdownItem>
                  Set Page
                </DropdownItem>
              </Link> */}
              <DropdownItem onClick={() => handleActiveCategory(row)}>
                {row.status == 0 ? 'Enabled' : 'Disabled'}
              </DropdownItem>
              <DropdownItem onClick={() => handleUpdateModal(row)}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => {
                setDeleteId(row.id);
                setShowDelete(true);
              }}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </>
      ),
    },
  ]

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = dataSource.findIndex(item => item.id === active.id);
    const newIndex = dataSource.findIndex(item => item.id === over.id);

    const newList = arrayMove(dataSource, oldIndex, newIndex)
      .map((item, index) => ({ ...item, position: index + 1 }));

    setDataSource(newList);

    handleUpdatePosition(newList);
  };

  useEffect(() => {
    if (data?.data) {
      setDataSource(data.data);
    }
  }, [data]);

  console.log(data)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Home" breadcrumbItem="Categories" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <Row className="mb-2">
                    <Col sm="4">
                      <div className="search-box me-2 mb-2 d-inline-block">
                        <div className="position-relative">
                          <input
                            placeholder="Search..."
                            className="form-control"
                            onInput={(e) => {
                              setSearch(e.target.value);
                            }}
                            value={search}
                            type="text"
                          />
                          <i className="bx bx-search-alt search-icon" />
                        </div>
                      </div>
                    </Col>
                    <Col sm="8">
                      <div className="text-sm-end">
                        <Button
                          type="button"
                          color="primary"
                          className="btn-rounded mb-2 me-2"
                          onClick={() => handleCreateModal()}
                        >
                          <i className="mdi mdi-plus me-1" />
                          Add New Category
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  {isLoading ? (
                    <Spinner className="ms-2 spinner-loading" color="success" />
                  ) : (
                    <Row>
                      <Col sm="12">
                        {data && (
                          <>
                            <DndContext onDragEnd={onDragEnd}>
                              <SortableContext
                                items={dataSource.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <Table
                                  components={{
                                    body: {
                                      row: RowDrag
                                    }
                                  }}
                                  rowKey="id"
                                  columns={columns}
                                  dataSource={[...dataSource].sort((a, b) => a.position - b.position)}
                                  pagination={false}
                                />
                              </SortableContext>
                            </DndContext>
                            <div className='mt-2'>
                              <Pagination
                                align='end'
                                current={data?.current_page || 1}
                                pageSize={data?.per_page || 10}
                                total={data?.total || 0}
                                onChange={(newPage) => setPage(newPage)}
                              />
                            </div>
                          </>

                        )}
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {modal && <CreateUpdate modal={modal} toggle={toggle} handleCreateModal={handleCreateModal} data={modalData} refresh={getData} lastPosition={lastPosition} />}
      {modalPage && <SetCategoryPage modal={modalPage} toggle={togglePage} handleCreateModal={togglePage} data={modalData} />}
      <DeleteConfirmation showDelete={showDelete} setShowDelete={() => setShowDelete(false)} deleteAction={deleteAction} />
    </React.Fragment>
  )
}

export default React.memo(Category);