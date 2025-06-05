import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Pagination } from 'react-laravel-paginex';
import Breadcrumbs from "components/Common/Breadcrumb";
import { Button, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
// import CreateUpdate from './Action/CreateUpdate';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { getImageUrl } from 'helpers/utils';
import DeleteConfirmation from 'components/Common/DeleteConfirmation';
import { del } from 'helpers/api_helper';

const Blog = () => {
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [showDelete, setShowDelete] = useState(false)

  const { data, refetch: getData, isLoading } = useQuery(['blogs', search, page], () => api.blog({
    params: {
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

  const handleCreateModal = () => {
    setModalData(null)
    toggle();
  };

  const handleUpdateModal = (data) => {
    setModalData(data)
    toggle();
  };

  const deleteAction = async () => {
    const brands = await del(`/blogs/${deleteId}`);
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

  const PostColumns = toggleModal => [
    {
      dataField: "id",
      text: "#",
      sort: true,
      formatter: (cellContent, row, i) => i + 1,
    },
    {
      dataField: "title",
      text: "Title",
    },
    {
      dataField: "thumbnail",
      text: "Thumbnail",
      formatter: (cellContent, row, i) => <img src={getImageUrl(row.thumbnail)} height={50} />,
    },
    {
      dataField: "author",
      text: "Author",
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
              <Link to={`/blogs/${row.id}/edit`}>
                <DropdownItem onClick={() => handleUpdateModal(row)}>
                  Edit
                </DropdownItem>
              </Link>
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
          <Breadcrumbs title="Home" breadcrumbItem="Post" />
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
                        <Link to={`/blogs/create`}>
                          <Button
                            type="button"
                            color="primary"
                            className="btn-rounded mb-2 me-2"
                            onClick={() => handleCreateModal()}
                          >
                            <i className="mdi mdi-plus me-1" />
                            Add New Post
                          </Button>
                        </Link>
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
                            columns={PostColumns()}
                            data={data.data}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="id"
                                data={data.data}
                                columns={PostColumns()}
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
      {/* {modal && <CreateUpdate modal={modal} toggle={toggle} handleCreateModal={handleCreateModal} data={modalData} refresh={getData} />} */}
      <DeleteConfirmation showDelete={showDelete} setShowDelete={() => setShowDelete(false)} deleteAction={deleteAction} />
    </React.Fragment>
  )
}

export default React.memo(Blog);