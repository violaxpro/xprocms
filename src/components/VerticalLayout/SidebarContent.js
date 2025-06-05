import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import { getRole, hasRole } from "helpers/utils";

const SidebarContent = props => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Menu")} </li> */}
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              {/* <ul className="sub-menu">
                <li>
                  <Link to="/dashboard">{props.t("Default")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Saas")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Crypto")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Blog")}</Link>
                </li>
                <li>
                  <Link to="#">
                    <span className="badge rounded-pill text-bg-success float-end" key="t-new">New</span>
                    {props.t("Jobs")}
                  </Link>
                </li>
              </ul> */}
            </li>

            {/* <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link to="#" >
                <i className="bx bx-file"></i>
                <span>{props.t("File Manager")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("Ecommerce")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="#">
                    {props.t("Product Detail")}
                  </Link>
                </li>
              </ul>
            </li> */}

            {hasRole(['Admin', 'Manager']) ? (
              <>
                <li className="menu-title">Pages</li>

                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-layout"></i>
                    <span>Page Setting</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/categories">
                        <span>Category</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/homepage-setting">
                        Homepage Setting
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages">
                        Pages
                      </Link>
                    </li>
                    <li>
                      <Link to="/brands">
                        Brand
                      </Link>
                    </li>
                    <li>
                      <Link to="/testimonials">
                        Testimonial
                      </Link>
                    </li>
                    <li>
                      <Link to="/projects">
                        Projects
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : null}

            {hasRole(['Admin', 'Manager', 'Blogger']) ? (
              <>
                <li className="menu-title">Blog</li>

                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-news"></i>
                    <span>Blog</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/blogs">
                        Post
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog-categories">
                        Category
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : null}

            {hasRole(['Admin', 'Manager']) ? (
              <>
                <li className="menu-title">FAQ</li>

                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-news"></i>
                    <span>FAQ</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/faqs">
                        <span>List</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/faq-categories">
                        <span>Category</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : null}

            {hasRole(['Admin', 'Manager']) ? (
              <>
                <li className="menu-title">Settings</li>

                <li>
                  <Link to="/settings">
                    <i className="bx bx-cog"></i>
                    <span>Page Setting</span>
                  </Link>
                </li>

                <li>
                  <Link to="/settings/footer">
                    <i className="bx bx-cog"></i>
                    <span>Footer</span>
                  </Link>
                </li>

                <li>
                  <Link to="/users">
                    <i className="bx bx-user"></i>
                    <span>User</span>
                  </Link>
                </li>
              </>
            ) : null}

          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
