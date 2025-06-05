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
import TopSection from "./Tabs/Top";
import SecondSection from "./Tabs/SecondSection";
import ThirdSection from "./Tabs/ThirdSection";
import FourthSection from "./Tabs/FourthSection";
import FifthSection from "./Tabs/FifthSection";
import SixthSection from "./Tabs/SixthSection";
import SeventhSection from "./Tabs/SeventhSection";
import { getSettings } from "store/settings/actions";
import { useDispatch } from "react-redux";
import GetInTouchSection from "./Tabs/GetInTouchSection";
import TestimonialSection from "./Tabs/TestimonialSection";

const HomepageSetting = () => {
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
                    <span className="d-none d-sm-block">Top Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "2",
                    })}
                    onClick={() => {
                      toggleCustom("2");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Second Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "3",
                    })}
                    onClick={() => {
                      toggleCustom("3");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Third Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "4",
                    })}
                    onClick={() => {
                      toggleCustom("4");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Fourth Section</span>
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "5",
                    })}
                    onClick={() => {
                      toggleCustom("5");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Fifth Section</span>
                  </NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "6",
                    })}
                    onClick={() => {
                      toggleCustom("6");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Fifth Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "7",
                    })}
                    onClick={() => {
                      toggleCustom("7");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Sixth Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "8",
                    })}
                    onClick={() => {
                      toggleCustom("8");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Get In Touch Section</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classNames({
                      active: customActiveTab === "9",
                    })}
                    onClick={() => {
                      toggleCustom("9");
                    }}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Testimonial Section</span>
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
                      <TopSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <SecondSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <ThirdSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <FourthSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <FifthSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="6">
                  <Row>
                    <Col sm="12">
                      <SixthSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="7">
                  <Row>
                    <Col sm="12">
                      <SeventhSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="8">
                  <Row>
                    <Col sm="12">
                      <GetInTouchSection />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="9">
                  <Row>
                    <Col sm="12">
                      <TestimonialSection />
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

export default React.memo(HomepageSetting);
