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

const TestimonialSection = ({ data }) => {
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
          Testimonial Section
          <i className="fa fa-question-circle ms-2" id="section-testimonial" style={{ fontSize: 16 }}></i>
        </h3>
        <UncontrolledTooltip placement="right" target="section-testimonial">
          <img src="/sections/testimonial.png" alt="" width="100%" />
        </UncontrolledTooltip>

        <Row>
          <Col>
            <div className="mb-3">
              <Label>Image (1920 × 547)</Label>
              <input
                type="file"
                className="form-control"
                {...methods.register("testimonial_section_photo")}
              />
              {methods.formState.errors.testimonial_section_photo && <small className="text-danger">This field is required</small>}
              {imagePreview == 'testimonial_section_photo' ? (
                <Lightbox
                  mainSrc={getImageUrl(data.testimonial_section_photo)}
                  enableZoom={false}
                />
              ) : null}
              {data.testimonial_section_photo ? (
                <img
                  onClick={() => {
                    setImagePreview('testimonial_section_photo');
                  }}
                  className="img-fluid mt-3"
                  alt="testimonial_section_photo"
                  src={getImageUrl(data.testimonial_section_photo)}
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
}))(React.memo(TestimonialSection));