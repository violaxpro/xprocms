import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import "react-image-lightbox/style.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "helpers/api";
import { getImageUrl, showToast } from "helpers/utils";
import { useForm } from "react-hook-form";
import Lightbox from "react-image-lightbox";
import { connect, useDispatch } from "react-redux";
import { getSettings } from "store/actions";
import ReactSelect from 'react-select';

const FooterSetting = ({ data }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('')

  const { data: pages, refetch: getData, isLoading } = useQuery(['pages-select'], () => api.pageSelect(), {
    refetchOnWindowFocus: false,
  });

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
      {pages?.pages ? (
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <Label>Terms & Conditions Page</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="terms_conditions_page"
                onChange={(e) => {
                  methods.setValue('terms_conditions_page', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.terms_conditions_page)}
              >
              </ReactSelect>
              {methods.formState.errors.terms_conditions_page && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label>Privacy Policy Page</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="privacy_policy_page"
                onChange={(e) => {
                  methods.setValue('privacy_policy_page', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.privacy_policy_page)}
              >
              </ReactSelect>
              {methods.formState.errors.privacy_policy_page && <small className="text-danger">This field is required</small>}
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <Label>Footer 1</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="footer_1"
                onChange={(e) => {
                  methods.setValue('footer_1', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.footer_1)}
              >
              </ReactSelect>
              {methods.formState.errors.footer_1 && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label>Footer 2</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="footer_2"
                onChange={(e) => {
                  methods.setValue('footer_2', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.footer_2)}
              >
              </ReactSelect>
              {methods.formState.errors.footer_2 && <small className="text-danger">This field is required</small>}
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <Label>Footer 3</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="footer_3"
                onChange={(e) => {
                  methods.setValue('footer_3', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.footer_3)}
              >
              </ReactSelect>
              {methods.formState.errors.footer_3 && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label>Footer 4</Label>
              <ReactSelect
                isClearable
                options={pages?.pages}
                name="footer_4"
                onChange={(e) => {
                  methods.setValue('footer_4', e?.value)
                }}
                defaultValue={pages?.pages?.filter(page => page?.value == data?.footer_4)}
              >
              </ReactSelect>
              {methods.formState.errors.footer_4 && <small className="text-danger">This field is required</small>}
            </div>
          </Col>

        </Row>
      ) : null}

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
}))(React.memo(FooterSetting));
