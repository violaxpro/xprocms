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

const GeneralSetting = ({ data }) => {
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
            <Label>Meta Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Meta Title"
              {...methods.register("meta_title", { required: true })}
            />
            {methods.formState.errors.meta_title && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label>Meta Description</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Meta Description"
              {...methods.register("meta_description", { required: true })}
            />
            {methods.formState.errors.meta_description && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col>
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
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label>App Name</Label>
            <input
              type="text"
              className="form-control"
              placeholder="App Name"
              {...methods.register("app_name", { required: true })}
            />
            {methods.formState.errors.app_name && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Email</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              {...methods.register("app_email", { required: true })}
            />
            {methods.formState.errors.app_email && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Phone</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              {...methods.register("app_phone_1", { required: true })}
            />
            {methods.formState.errors.app_phone_1 && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label>Footer Text</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Footer Text"
              {...methods.register("footer_text", { required: true })}
            />
            {methods.formState.errors.footer_text && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Copyright Text</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Copyright Text"
              {...methods.register("copyright_text", { required: true })}
            />
            {methods.formState.errors.copyright_text && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label>Address</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              {...methods.register("address", { required: true })}
            />
            {methods.formState.errors.address && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="mb-3">
            <Label>Facebook Link</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Facebook Link"
              {...methods.register("facebook_link", { required: true })}
            />
            {methods.formState.errors.facebook_link && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label>Twitter Link</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Twitter Link"
              {...methods.register("twitter_link", { required: true })}
            />
            {methods.formState.errors.twitter_link && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label>Instagram Link</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Instagram Link"
              {...methods.register("instagram_link", { required: true })}
            />
            {methods.formState.errors.instagram_link && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
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
      </Row>

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
}))(React.memo(GeneralSetting));
