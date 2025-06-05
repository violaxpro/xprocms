import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Pagination } from 'react-laravel-paginex';
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
import { getImageUrl } from 'helpers/utils';

const Category = () => {
  const { id } = useParams()
  const [deleteId, setDeleteId] = useState(null)
  const [modal, setModal] = useState(false);
  const [modalPage, setModalPage] = useState(false);
  const [modalData, setModalData] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showDelete, setShowDelete] = useState(false)

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

  const handleCategoryPageModal = async (data) => {
    const res = await api.categoryPage(data.id);
    setModalData({category_id: data.id, ...res.data})
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

  const defaultSorted = [
    {
      dataField: "id",
      sort: "desc",
      order: 'desc',
    },
  ];

  const CategoryColumns = toggleModal => [
    {
      dataField: "id",
      text: "#",
      sort: true,
      formatter: (cellContent, row, i) => i + 1,
    },
    {
      dataField: "name",
      text: "Name",
      formatter: (cellContent, row, i) => <Link to={`/categories/${row.id}`}>{row.name}</Link>,
    },
    {
      dataField: "image",
      text: "Background Image",
      formatter: (cellContent, row, i) => {
        if (row.image) {
          return <img src={getImageUrl(row.image)} width={200} />
        }
        return '-'
      },
    },
    {
      dataField: "is_best",
      text: "Best Category",
      formatter: (cellContent, row, i) => <span>{!!row.is_best ? 'Yes' : 'No'}</span>,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cellContent, row, i) => (
        row.status == 1 ? (
          <div className="badge badge-soft-success">Active</div>
        ) : (
          <div className="badge badge-soft-danger">Inactive</div>
        )
      ),
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      // eslint-disable-next-line react/display-name
      formatter: (cellContent, row) => (
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
  ];
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
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="id"
                            columns={CategoryColumns()}
                            data={data.data}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="id"
                                data={data.data}
                                columns={CategoryColumns()}
                                bootstrap4
                                // search
                              >
                                {toolkitProps => (
                                  <React.Fragment>
                                    <Row>
                                      <Col xl="12">
                                        <div className="table-responsive">
                                          <BootstrapTable
                                            keyField="id"
                                            responsive
                                            sorted={false}
                                            striped={false}
                                            defaultSorted={defaultSorted}
                                            selectRow={selectRow}
                                            classes={
                                              "table align-middle table-nowrap table-check"
                                            }
                                            headerWrapperClasses={"table-light"}
                                            {...toolkitProps.baseProps}
                                            {...paginationTableProps}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                      <Col className="pagination pagination-rounded justify-content-end mb-2 inner-custom-pagination">
                                        <Pagination changePage={(e) => setPage(e.page)} data={data} />
                                      </Col>
                                    </Row>
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )}
                          </PaginationProvider>
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
      {modal && <CreateUpdate modal={modal} toggle={toggle} handleCreateModal={handleCreateModal} data={modalData} refresh={getData} />}
      {modalPage && <SetCategoryPage modal={modalPage} toggle={togglePage} handleCreateModal={togglePage} data={modalData} />}
      <DeleteConfirmation showDelete={showDelete} setShowDelete={() => setShowDelete(false)} deleteAction={deleteAction} />
    </React.Fragment>
  )
}

export default React.memo(Category);