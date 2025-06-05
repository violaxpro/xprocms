import { Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import TabFeature from './Tab/TabFeature';
import TabCard from './Tab/TabCard';
import { connect, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { getSettings } from 'store/actions';

const FifthSection = ({ data }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

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
    reset(data);
  }, [data]);

  useEffect(() => {
    dispatch(getSettings());
  }, [isSuccess]);
  return (
    <form onSubmit={handleSubmit(mutate)}>
      <h3>Fifth Section</h3>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label>Top Title</Label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="Top Title"
              {...register("fifth_section_top_title", { required: true })}
            />
            {errors.fifth_section_top_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label>Title</Label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="Title"
              {...register("fifth_section_title", { required: true })}
            />
            {errors.fifth_section_title && <small className="text-danger">This field is required</small>}
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
}))(React.memo(FifthSection));