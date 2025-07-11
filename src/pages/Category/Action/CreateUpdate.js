import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { getImageUrl, showToast } from 'helpers/utils';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from "react-image-lightbox";
import slugify from '@sindresorhus/slugify';

const CreateUpdate = ({ data, toggle, modal, handleCreateModal, refresh, lastPosition }) => {
  const { id } = useParams();
  const [errors, setErrors] = useState([])
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();
  const [imagePreview, setImagePreview] = useState('')

  const { mutate, isLoading: submitLoading } = useMutation(async (params) => {
    console.log(params)
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value instanceof FileList) {
        console.log(`${key}: ${value}`)

        formData.append(key, value[0])
      } else {
        if (value) {
          formData.append(key, value)
        }
      }
    }
    if (data) {
      formData.append('_method', 'put')
    }
    return await data ? api.updateCategory(data.id, formData) : api.createCategory(formData)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrors(res.errors)
        return;
      }
      toggle()
      refresh()
    },
    onError: (err) => {
      showToast('Failed to submit category', 'error')
    }
  })

  useEffect(() => {
    setErrors([]);
    reset({
      ...data,
      parent_id: id ? id : data?.parent_id
    });
  }, [data, modal])

  useEffect(() => {
    reset({
      parent_id: id ? id : undefined,
      position: (Number(lastPosition) + 1),
    });
    setErrors([]);
  }, [modal, lastPosition]);

  console.log(lastPosition, data)

  return (
    <Modal
      size="md"
      toggle={() => handleCreateModal()}
      isOpen={modal}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">
          {data ? 'Update Category' : 'Create Category'}
        </h5>
        <button
          onClick={() => handleCreateModal()}
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit(mutate)}>
          <Row>
            <Col>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  {...register('name', { required: true })}
                // onChange={(e) => setValue('slug', slugify(e.target.value))}
                />
                {formErrors?.name && <small className="text-danger">This field is required</small>}
                {errors.name && <span className="form-text text-danger">{errors.name[0]}</span>}
              </div>
            </Col>
          </Row>

          {
            !data &&
            <Row>
              <Col>
                <div className="mb-3">
                  <label>Position</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Position"
                    {...register('position', { required: true })}
                  />
                  {formErrors?.position && <small className="text-danger">This field is required</small>}
                  {errors.position && <span className="form-text text-danger">{errors.position[0]}</span>}
                </div>
              </Col>
            </Row>
          }


          <Row>
            <Col>
              <div className="mb-3">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  {...register("image")}
                />
                {formErrors?.image && <small className="text-danger">This field is required</small>}
                {errors.image && <span className="form-text text-danger">{errors.image[0]}</span>}
                {imagePreview == 'image' ? (
                  <Lightbox
                    mainSrc={getImageUrl(data.image)}
                    enableZoom={false}
                  />
                ) : null}
                {data?.image ? (
                  <img
                    onClick={() => {
                      setImagePreview('image');
                    }}
                    className="img-fluid mt-3"
                    alt="image"
                    src={getImageUrl(data.image)}
                    width="145"
                  />
                ) : null}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <input
                type="checkbox"
                id="is_best"
                value={1}
                defaultChecked={data?.detail?.is_best ? true : false}
                name="is_best"
                className="mx-2"
                placeholder="Has Features?"
                {...register('is_best')}
              />
              <label htmlFor="is_best">Best Category</label>
              {formErrors?.is_best && <small className="text-danger">This field is required</small>}
              {errors.is_best && <span className="form-text text-danger">{errors.is_best[0]}</span>}
            </Col>
          </Row>

          {
            !data && <Row>
              <Col>
                <input
                  type="checkbox"
                  id="status-category"
                  value={1}
                  defaultChecked={data?.status ? true : false}
                  name="status"
                  className="mx-2"
                  {...register('status')}
                />
                <label htmlFor="status-category">Enable Category</label>
                {formErrors?.status && <small className="text-danger">This field is required</small>}
                {errors.status && <span className="form-text text-danger">{errors.status[0]}</span>}
              </Col>
            </Row>
          }


        </form>
      </div>
      <div className="modal-footer">
        <div className="d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary w-md" disabled={submitLoading} onClick={handleSubmit(mutate)}>
            {submitLoading ? (
              <>
                <i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i>
                Loading
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(CreateUpdate);