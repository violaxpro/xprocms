import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Editor from 'components/Common/Editor';
import slugify from '@sindresorhus/slugify';

const CreateUpdate = ({ data, toggle, modal, handleCreateModal, refresh }) => {
  const { id } = useParams();
  const [errors, setErrors] = useState([])
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();

  const { mutate, isLoading: submitLoading } = useMutation((params) => {
    return api.setCategoryPage(params)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrors(res.errors)
        return;
      }
      toggle()
    },
    onError: (err) => {
      setErrors(err.response.data.errors)
      showToast('Failed to submit category', 'error')
    }
  })

  useEffect(() => {
    setErrors([]);
    reset({
      ...data,
    });
  }, [data, modal])

  return (
    <Modal
      size="lg"
      toggle={() => handleCreateModal()}
      isOpen={modal}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">
          Set Category Page
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
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  {...register('title', { required: true })}
                  onChange={(e) => setValue('slug', slugify(e.target.value))}
                />
                {formErrors?.title && <small className="text-danger">This field is required</small>}
                {errors.title && <span className="form-text text-danger">{errors.title[0]}</span>}
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label>Slug URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Slug"
                  {...register('slug', { required: true })}
                />
                {formErrors?.slug && <small className="text-danger">This field is required</small>}
                {errors.slug && <span className="form-text text-danger">{errors.slug[0]}</span>}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-3">
                <label>Meta Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Meta Title"
                  {...register('meta_title', { required: true })}
                />
                {formErrors?.meta_title && <small className="text-danger">This field is required</small>}
                {errors.meta_title && <span className="form-text text-danger">{errors.meta_title[0]}</span>}
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label>Meta Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Meta Description"
                  {...register('meta_description', { required: true })}
                />
                {formErrors?.meta_description && <small className="text-danger">This field is required</small>}
                {errors.meta_description && <span className="form-text text-danger">{errors.meta_description[0]}</span>}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Editor
                onChange={(event, editor) => {
                  setValue('description', editor.getData())
                }}
                data={data?.description}
              />
            </Col>
          </Row>
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