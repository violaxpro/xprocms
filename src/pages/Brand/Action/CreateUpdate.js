import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const CreateUpdate = ({ data, toggle, modal, handleCreateModal, refresh }) => {
  const { id } = useParams();
  const [errors, setErrors] = useState([])
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();

  const { mutate, isLoading: submitLoading } = useMutation(async (params) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value instanceof FileList) {
        formData.append(key, value[0])
      } else {
        formData.append(key, value)
      }
    }
    if (data) {
      formData.append('_method', 'put')
    }
    return (await data) ? api.updateBrand(data.id, formData) : api.createBrand(formData);
  }, {
    onSuccess: (res) => {
      console.log(res)
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrors(res.errors)
        return;
      }
      toggle()
      refresh()
    },
    onError: (err) => {
      showToast('Failed to submit blog', 'error')
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
      size="md"
      toggle={() => handleCreateModal()}
      isOpen={modal}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">
          {data ? 'Update Brand' : 'Create Brand'}
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
                />
                {formErrors?.name && <small className="text-danger">This field is required</small>}
                {errors.name && <span className="form-text text-danger">{errors.name[0]}</span>}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-3">
                <label>Website</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Website"
                  {...register('website')}
                />
                {formErrors?.website && <small className="text-danger">This field is required</small>}
                {errors.website && <span className="form-text text-danger">{errors.website[0]}</span>}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-3">
                <label>Logo</label>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Logo"
                  {...register('logo')}
                />
                {formErrors?.logo && <small className="text-danger">This field is required</small>}
                {errors.logo && <span className="form-text text-danger">{errors.logo[0]}</span>}
              </div>
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