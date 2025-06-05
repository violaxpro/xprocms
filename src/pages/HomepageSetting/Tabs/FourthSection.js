import { Divider } from '@material-ui/core';
import React, { useState } from 'react'
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import TabFeature from './Tab/TabFeature';
import TabCard from './Tab/TabCard';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import Lightbox from 'react-image-lightbox';
import { getImageUrl, showToast } from 'helpers/utils';
import { connect, useDispatch } from 'react-redux';
import { getSettings } from 'store/actions';
import { useEffect } from 'react';

const FourthSection = ({ data }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('')
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
          Fourth Section
          <i className="fa fa-question-circle ms-2" id="section-4" style={{ fontSize: 16 }}></i>
        </h3>
        <UncontrolledTooltip placement="right" target="section-4">
          <img src="/sections/4.png" alt="" width="100%" />
        </UncontrolledTooltip>

        <Row>
          <Col md={6}>
            <div className="mb-3">
              <Label>Top Title</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Top Title"
                {...methods.register("fourth_section_top_title", { required: true })}
              />
              {methods.formState.errors.fourth_section_top_title && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label>Title</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                {...methods.register("fourth_section_title", { required: true })}
              />
              {methods.formState.errors.fourth_section_title && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="mb-3">
              <Label>Background (1920 × 562)</Label>
              <input
                type="file"
                className="form-control"
                {...methods.register("fourth_section_background")}
              />
              {methods.formState.errors.fourth_section_background && <small className="text-danger">This field is required</small>}
              {imagePreview == 'fourth_section_background' ? (
                <Lightbox
                  mainSrc={getImageUrl(data.fourth_section_background)}
                  enableZoom={false}
                />
              ) : null}
              <img
                onClick={() => {
                  setImagePreview('fourth_section_background');
                }}
                className="img-fluid mt-3"
                alt="fourth_section_background"
                src={getImageUrl(data.fourth_section_background)}
                width="145"
              />
            </div>
          </Col>
        </Row>

        <Nav tabs className="nav-tabs-custom nav-justified" id="test">
          {Array(6).fill().map((v, i) => (
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
                <span className="d-none d-sm-block">Card {i + 1}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <TabContent
          activeTab={customActiveTab}
          className="p-3 text-muted"
        >
          {Array(6).fill().map((v, i) => (
            <TabPane tabId={i + 1} key={i}>
              <TabCard id={i + 1} name={`fourth_section_${i + 1}`} />
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
}))(React.memo(FourthSection));