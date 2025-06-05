import React, { useEffect, useState } from 'react'
import { Col, Form, Label, Row, Spinner, UncontrolledTooltip } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import Lightbox from 'react-image-lightbox';
import { getImageUrl, showToast } from 'helpers/utils';
import { connect, useDispatch } from 'react-redux';
import { getSettings } from 'store/actions';

const Top = ({ data }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('')

  const { mutate, isLoading: submitLoading, isSuccess } = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        if (value instanceof FileList) {
          formData.append(key, value[0])
        }else{
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
    reset(data);
  }, [data]);

  useEffect(() => {
    dispatch(getSettings());
  }, [isSuccess]);

  return (
    !data ? (
      <Spinner className="mx-auto" />
    ) : (
    <Form onSubmit={handleSubmit(mutate)}>
      <h3>
        Top Section
        <i className="fa fa-question-circle ms-2" id="section-1" style={{ fontSize: 16 }}></i>
      </h3>
      <UncontrolledTooltip placement="right" target="section-1">
        <img src="/sections/1.png" alt="" width="100%" />
      </UncontrolledTooltip>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label>Top Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Top Title"
              defaultValue={data.top_section_top_title}
              {...register("top_section_top_title", { required: true })}
            />
            {errors.top_section_top_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label>Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              defaultValue={data.top_section_title}
              {...register("top_section_title", { required: true })}
            />
            {errors.top_section_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="mb-3">
            <Label>Photo (900 × 745 px)</Label>
            <input
              type="file"
              className="form-control"
              {...register("top_section_photo")}
            />
            {errors.top_section_photo && <small className="text-danger">This field is required</small>}
            {imagePreview == 'top_section_photo' ? (
              <Lightbox
                mainSrc={getImageUrl(data.top_section_photo)}
                enableZoom={false}
              />
            ) : null}
            <img
              onClick={() => {
                setImagePreview('top_section_photo');
              }}
              className="img-fluid mt-3"
              alt="top_section_photo"
              src={getImageUrl(data.top_section_photo)}
              width="145"
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="mb-3">
            <Label>Description</Label>
            <textarea
              className="form-control"
              placeholder="Description"
              defaultValue={data.top_section_description}
              {...register("top_section_description", { required: true })}
            ></textarea>
            {errors.top_section_description && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <div>
        <button type="submit" className="btn btn-primary w-md" disabled={submitLoading}>
          Submit
        </button>
      </div>
    </Form>
    )
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(Top));