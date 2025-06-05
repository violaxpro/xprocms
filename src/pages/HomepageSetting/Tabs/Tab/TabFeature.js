import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import { connect } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';

const Tab = ({ data, name }) => {
  const { register, reset, formState: { errors } } = useFormContext()

  useEffect(() => {
    reset(data);
  }, [data]);
  return (
    <>
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label htmlFor="formrow-email-Input">Tab Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Tab Title"
              {...register(`${name}_title`)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label htmlFor="formrow-password-Input">Description</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              {...register(`${name}_description`)}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label htmlFor="formrow-email-Input">Feature 1</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Feature 1"
              {...register(`${name}_feature_1`)}
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label htmlFor="formrow-password-Input">Feature 2</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Feature 2"
              {...register(`${name}_feature_2`)}
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label htmlFor="formrow-email-Input">Feature 3</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Feature 3"
              {...register(`${name}_feature_3`)}
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label htmlFor="formrow-password-Input">Feature 4</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Feature 4"
              {...register(`${name}_feature_4`)}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(Tab));