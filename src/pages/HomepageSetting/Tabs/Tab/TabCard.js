import { getImageUrl } from 'helpers/utils';
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import Lightbox from 'react-image-lightbox';
import { connect, useSelector } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';

const TabCard = ({ data, name, withFeatures, withImage, notRequired, customData, defaultName = 'title' }) => {
  const { register, reset, formState: { errors } } = useFormContext()
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    console.log(data)
    reset(data);
  }, [data]);

  return (
    <>
      {withImage ? (

        <Row>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Image</Label>
              <input
                type="file"
                className="form-control"
                {...register(`${name}_image`)}
              />
              {errors?.[`${name}_image`] && <small className="text-danger">This field is required</small>}
              {imagePreview == `${name}_image` ? (
                <Lightbox
                  mainSrc={getImageUrl(customData ? customData[`${name}_image`] : data[`${name}_image`])}
                  enableZoom={false}
                />
              ) : null}
              <img
                onClick={() => {
                  setImagePreview(`${name}_image`);
                }}
                className="img-fluid mt-3"
                src={getImageUrl(customData ? customData[`${name}_image`] : data[`${name}_image`])}
                width="145"
              />
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Icon</Label>
              <input
                type="text"
                placeholder="Icon"
                className="form-control"
                {...register(`${name}_icon`)}
              />
              {errors?.[`${name}_icon`] && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <div className="mb-3">
            <Label htmlFor="formrow-email-Input">Title</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              defaultValue={data[`${name}_${defaultName}`]}
              {...register(`${name}_${defaultName}`, { required: notRequired ? false : true })}
            />
            {errors?.[`${name}_${defaultName}`] && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="mb-3">
            <Label htmlFor="formrow-email-Input">Description</Label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              defaultValue={data[`${name}_description`]}
              {...register(`${name}_description`, { required: notRequired ? false : true })}
            />
            {errors?.[`${name}_description`] && <small className="text-danger">This field is required</small>}
          </div>
        </Col>
      </Row>

      {withFeatures ? (
        <Row>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Feature 1</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Feature 1"
                defaultValue={data[`${name}_feature_1`]}
                {...register(`${name}_feature_1`, { required: notRequired ? false : true })}
              />
              {errors?.[`${name}_feature_1`] && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Feature 2</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Feature 2"
                defaultValue={data[`${name}_feature_2`]}
                {...register(`${name}_feature_2`, { required: notRequired ? false : true })}
              />
              {errors?.[`${name}_feature_2`] && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Feature 3</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Feature 3"
                defaultValue={data[`${name}_feature_3`]}
                {...register(`${name}_feature_3`, { required: notRequired ? false : true })}
              />
              {errors?.[`${name}_feature_3`] && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <Label htmlFor="formrow-email-Input">Feature 4</Label>
              <input
                type="text"
                className="form-control"
                placeholder="Feature 4"
                defaultValue={data[`${name}_feature_4`]}
                {...register(`${name}_feature_4`, { required: notRequired ? false : true })}
              />
              {errors?.[`${name}_feature_4`] && <small className="text-danger">This field is required</small>}
            </div>
          </Col>
        </Row>
      ) : null}
    </>
  )
}

export default connect((state) => ({
  data: state.settings?.settings
}))(React.memo(TabCard));