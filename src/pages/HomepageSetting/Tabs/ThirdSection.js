import { Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import TabFeature from './Tab/TabFeature';
import TabCard from './Tab/TabCard';
import { connect, useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { getSettings } from 'store/actions';

const ThirdSection = ({ data }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const [customActiveTab, setcustomActiveTab] = useState(1);

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const { mutate, isLoading: submitLoading, isSuccess } = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        if (value instanceof FileList) {
          formData.append(key, value[0])
        } else {
          formData.append(key, value)
        }
      }
      await api.updateSettings(formData)
    },
    onSuccess: () => {
      showToast('Successfully saved settings.');
    },
  })

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  useEffect(() => {
    dispatch(getSettings());
  }, [isSuccess]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(mutate)}>
        <h3>
          Third Section
          <i className="fa fa-question-circle ms-2" id="section-3" style={{ fontSize: 16 }}></i>
        </h3>
        <UncontrolledTooltip placement="right" target="section-3">
          <img src="/sections/3.png" alt="" width="100%" />
        </UncontrolledTooltip>

        <Row>
          <Col md={6}>
            <div className="mb-3">
              <Label>Top Title</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Top Title"
                defaultValue={data.third_section_top_title}
                {...methods.register("third_section_top_title", { required: true })}
              />
              {methods.formState.errors.third_section_top_title && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label>Title</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                defaultValue={data.third_section_title}
                {...methods.register("third_section_title", { required: true })}
              />
              {methods.formState.errors.third_section_title && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="mb-3">
              <Label>Photo (600 × 545)</Label>
              <input
                type="file"
                className="form-control"
                {...methods.register("third_section_photo")}
              />
              {methods.formState.errors.third_section_photo && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
        </Row>

        <Nav tabs className="nav-tabs-custom nav-justified" id="test">
          {Array(4).fill().map((v, i) => (
            <NavItem key={i}>
              <NavLink
                style={{ cursor: "pointer" }}
                className={{
                  active: customActiveTab === i + 1,
                }}
                onClick={() => {
                  toggleCustom(i + 1);
                }}
              >
                <span className="d-block d-sm-none">
                  <i className="fas fa-home"></i>
                </span>
                <span className="d-none d-sm-block">Tab {i + 1}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <TabContent
          activeTab={customActiveTab}
          className="p-3 text-muted"
        >
          {Array(4).fill().map((v, i)=> (
            <TabPane tabId={i + 1} key={i}>
              <TabCard id={i + 1} name={`third_section_${i + 1}`} withFeatures />
            </TabPane>
          ))}
        </TabContent>

        <div>
          <button type="submit" className="btn btn-primary w-md">
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(ThirdSection));