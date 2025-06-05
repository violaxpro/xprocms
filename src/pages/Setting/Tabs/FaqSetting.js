import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import "react-image-lightbox/style.css";
import { useMutation } from "@tanstack/react-query";
import api from "helpers/api";
import { getImageUrl, showToast } from "helpers/utils";
import { useForm } from "react-hook-form";
import Lightbox from "react-image-lightbox";
import { connect, useDispatch } from "react-redux";
import { getSettings } from "store/actions";

const FaqSetting = ({ data }) => {
  const methods = useForm();
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
      return await api.updateSettings(formData)
    },
    onSuccess: () => {
      showToast('Successfully saved settings.');
    },
  })

  useEffect(() => {
    dispatch(getSettings());
  }, [isSuccess]);

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  return (
    <form onSubmit={methods.handleSubmit(mutate)}>
      <Row>
        <Col>
          <div className="mb-3">
            <Label>Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              {...methods.register("faq_title", { required: true })}
            />
            {methods.formState.errors.faq_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label>Description</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              {...methods.register("faq_description", { required: true })}
            />
            {methods.formState.errors.faq_description && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        {/* <Col>
          <div className="mb-3">
            <Label>Keywords</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Keywords"
              {...methods.register("keywords", { required: true })}
            />
            {methods.formState.errors.keywords && <small className="text-danger">This field is required</small>}
          </div>
        </Col> */}
      </Row>

      {/* <Row>
        <Col>
          <div className="mb-3">
            <Label>Logo</Label>
            <input
              type="file"
              className="form-control"
              {...methods.register("app_logo")}
            />
            {methods.formState.errors.app_logo && <small className="text-danger">This field is required</small>}
            {imagePreview == 'app_logo' ? (
              <Lightbox
                mainSrc={getImageUrl(data.app_logo)}
                enableZoom={false}
              />
            ) : null}
            <img
              onClick={() => {
                setImagePreview('app_logo');
              }}
              className="img-fluid mt-3"
              alt="app_logo"
              src={getImageUrl(data.app_logo)}
              width="145"
            />
          </div>
        </Col>
      </Row> */}

      <div>
        <button type="submit" className="btn btn-primary w-md" disabled={submitLoading}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(FaqSetting));
