import { Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
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

const GetInTouchSection = ({ data }) => {
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
    <Form onSubmit={methods.handleSubmit(mutate)}>
      <FormProvider {...methods}>
        <h3>
          Get In Touch Section
          <i className="fa fa-question-circle ms-2" id="section-getintouch" style={{ fontSize: 16 }}></i>
        </h3>
        <UncontrolledTooltip placement="right" target="section-getintouch">
          <img src="/sections/getintouch.png" alt="" width="100%" />
        </UncontrolledTooltip>

        <Row>
          <Col>
            <div className="mb-3">
              <Label>Image (1600 ×800)</Label>
              <input
                type="file"
                className="form-control"
                {...methods.register("getintouch_section_photo")}
              />
              {methods.formState.errors.getintouch_section_photo && <small className="text-danger">This field is required</small>}
              {imagePreview == 'getintouch_section_photo' ? (
                <Lightbox
                  mainSrc={getImageUrl(data.getintouch_section_photo)}
                  enableZoom={false}
                />
              ) : null}
              {data.getintouch_section_photo ? (
                <img
                  onClick={() => {
                    setImagePreview('getintouch_section_photo');
                  }}
                  className="img-fluid mt-3"
                  alt="getintouch_section_photo"
                  src={getImageUrl(data.getintouch_section_photo)}
                  width="145"
                />
              ) : null}
            </div>
          </Col>
        </Row>

        <div>
          <button type="submit" className="btn btn-primary w-md">
            Submit
          </button>
        </div>
      </FormProvider>
    </Form>
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(GetInTouchSection));