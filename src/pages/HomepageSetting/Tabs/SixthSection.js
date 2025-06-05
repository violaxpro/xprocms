import { Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import TabFeature from './Tab/TabFeature';
import TabCard from './Tab/TabCard';
import Lightbox from 'react-image-lightbox';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { getImageUrl, showToast } from 'helpers/utils';
import { connect, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getSettings } from 'store/actions';

const SixthSection = ({ data }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('')

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
    dispatch(getSettings());
  }, [isSuccess]);

  useEffect(() => {
    reset(data);
  }, [data]);
  return (
    <form onSubmit={handleSubmit(mutate)}>
      <h3>
        Fifth Section
        <i className="fa fa-question-circle ms-2" id="section-5" style={{ fontSize: 16 }}></i>
      </h3>
      <UncontrolledTooltip placement="right" target="section-5">
        <img src="/sections/5.png" alt="" width="100%" />
      </UncontrolledTooltip>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label>Top Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Top Title"
              {...register("sixth_section_top_title", { required: true })}
            />
            {errors.sixth_section_top_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              {...register("sixth_section_title", { required: true })}
            />
            {errors.sixth_section_top_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Image (700 ×850)</Label>
            <input
              type="file"
              className="form-control"
              {...register("sixth_section_photo")}
            />
            {errors.sixth_section_photo && <small className="text-danger">This field is required</small>}
            {imagePreview == 'sixth_section_photo' ? (
              <Lightbox
                mainSrc={getImageUrl(data.sixth_section_photo)}
                enableZoom={false}
              />
            ) : null}
            <img
              onClick={() => {
                setImagePreview('sixth_section_photo');
              }}
              className="img-fluid mt-3"
              alt="sixth_section_photo"
              src={getImageUrl(data.sixth_section_photo)}
              width="145"
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label>Solution 1</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Solution 1"
              {...register("sixth_section_solution_1", { required: true })}
            />
            {errors.sixth_section_solution_1 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label>Description 1</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              {...register("sixth_section_description_1", { required: true })}
            />
            {errors.sixth_section_description_1 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label>Solution 2</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Solution 2"
              {...register("sixth_section_solution_2", { required: true })}
            />
            {errors.sixth_section_solution_2 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label>Description 2</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              {...register("sixth_section_description_2", { required: true })}
            />
            {errors.sixth_section_description_2 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label>Solution 3</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Solution 3"
              {...register("sixth_section_solution_3", { required: true })}
            />
            {errors.sixth_section_solution_3 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label>Description 3</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              {...register("sixth_section_description_3", { required: true })}
            />
            {errors.sixth_section_description_3 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <div>
        <button type="submit" className="btn btn-primary w-md">
          Submit
        </button>
      </div>
    </form>
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(SixthSection));