import React, { useState } from "react";
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import { Pagination } from "react-laravel-paginex";
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap';
import moment from "moment";
import { useQuery } from '@tanstack/react-query';
import api from "helpers/api";

const Visitor = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, refetch: getData, isLoading } = useQuery(['dashboard-visitor', page], () => api.dashboardVisitor({
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
    totalSize: data?.visitors?.total,
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
      dataField: "ip_address",
      text: "Ip Address",
    },
    {
      dataField: "device",
      text: "Device",
    },
    {
      dataField: "browser",
      text: "Browser",
    },
    {
      dataField: "platform",
      text: "Platform",
    },
    {
      dataField: "location",
      text: "Location",
      formatter: (cellContent, row, i) => {
        var json = JSON.parse(row.location);
        return `${json.country}, ${json.region}, ${json.city}, ${json.loc}`
      },
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
    <>
      {!isLoading && (
        <PaginationProvider
          pagination={paginationFactory(pageOptions)}
          keyField="id"
          columns={DashboardColumns()}
          data={data?.visitors?.data}
        >
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              data={data?.visitors?.data}
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
                      <Pagination changePage={(e) => setPage(e.page)} data={data?.visitors} />
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </ToolkitProvider>
          )}
        </PaginationProvider>
      )}
    </>
  )
}

export default React.memo(Visitor);