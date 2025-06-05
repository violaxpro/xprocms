import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container, Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import "react-image-lightbox/style.css";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import classNames from "classnames";
import { getSettings } from "store/settings/actions";
import { useDispatch } from "react-redux";
import FooterSetting from "./Tabs/FooterSetting";

const SettingFooter = () => {
  const dispatch = useDispatch();
  const [customActiveTab, setcustomActiveTab] = useState("1");

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch])


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Home"
            breadcrumbItem="Page Setting"
          />

          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "1",
                    })}
                    onClick={() => {
                      toggleCustom("1");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Footer Setting</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent
                activeTab={customActiveTab}
                className="p-3 text-muted"
              >
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <FooterSetting />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default React.memo(SettingFooter);
