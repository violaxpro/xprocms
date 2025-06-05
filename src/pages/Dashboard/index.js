import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Container,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap';

//i18n
import { withTranslation } from "react-i18next";
import LineBar from "components/Common/LineBar";
import { useQuery } from '@tanstack/react-query';
import api from "helpers/api";
import { Pagination } from "react-laravel-paginex";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from "moment";
import Visitor from "./Visitor";

//redux

const Dashboard = props => {
  document.title = "Xpro Group Pty Ltd";
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: chart, refetch: getChart, isLoading: chartLoading } = useQuery(['dashboard', [from, to]], () => api.dashboard({
    params: {
      from,
      to,
    }
  }), {
    refetchOnWindowFocus: false,
  });

  const { data, refetch: getData, isLoading } = useQuery(['dashboard-contact', search, page], () => api.dashboardContact({
    params: {
      page: page,
      search: search,
    }
  }), {
    refetchOnWindowFocus: false,
  });

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
    totalSize: data?.contact?.total,
    custom: true,
  };

  const defaultSorted = [
    {
      dataField: "id",
      sort: ["id"],
      order: 'desc',
    },
    {
      dataField: "created_at",
      sort: ["created_at"],
      order: 'desc',
    },
  ];

  const DashboardColumns = toggleModal => [
    {
      dataField: "id",
      text: "#",
      sort: true,
      formatter: (cellContent, row, i) => i + 1,
    },
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "phone",
      text: "Phone",
    },
    {
      dataField: "subject",
      text: "Subject",
    },
    {
      dataField: "created_at",
      text: "Created At",
      formatter: (cellContent, row, i) => moment(row.created_at).format('D MMM Y H:MM'),
    },
    // {
    //   dataField: "action",
    //   isDummyField: true,
    //   text: "Action",
    //   // eslint-disable-next-line react/display-name
    //   formatter: (cellContent, row) => (
    //     <>
    //       <UncontrolledButtonDropdown direction="start">
    //         <DropdownToggle caret>
    //           Action
    //         </DropdownToggle>
    //         <DropdownMenu>
    //           {/* <Link to={`/category-page/${row.id}`}>
    //             <DropdownItem>
    //               Set Page
    //             </DropdownItem>
    //           </Link> */}
    //           <DropdownItem onClick={() => handleUpdateModal(row)}>
    //             Edit
    //           </DropdownItem>
    //           <DropdownItem onClick={() => {
    //             setDeleteId(row.id);
    //             setShowDelete(true);
    //           }}>
    //             Delete
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledButtonDropdown>
    //     </>
    //   ),
    // },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />
          <Card>
            <CardBody>
              <Row>
                <Col md={2}>
                  <label htmlFor="date-from">From</label>
                  <input type="date" className="form-control" onChange={(e) => setFrom(e.target.value)} />
                </Col>
                <Col md={2}>
                  <label htmlFor="date-to">To</label>
                  <input type="date" className="form-control" onChange={(e) => setTo(e.target.value)} />
                </Col>
              </Row>
              {!chartLoading ? (
                <Row>
                  <Col>
                    <div id="mix-line-bar" className="e-chart">
                      <LineBar dataColors='["--bs-success","--bs-primary", "--bs-danger"]' data={chart?.chart} from={from} to={to} />
                    </div>
                  </Col>
                </Row>
              ) : null}
              {isLoading ? (
                <Spinner className="ms-2 spinner-loading" color="success" />
              ) : (
                <>
                  <Row className="mt-5">
                    <Col>
                      <Visitor />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {!isLoading && (
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="id"
                          columns={DashboardColumns()}
                          data={data?.contact?.data}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              data={data?.contact?.data}
                              columns={DashboardColumns()}
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
                                      <Pagination changePage={(e) => setPage(e.page)} data={data?.contact} />
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
                </>
              )}
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
