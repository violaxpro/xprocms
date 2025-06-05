import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Editor from 'components/Common/Editor';

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
    return (await data) ? api.updateFaqCategory(data.id, formData) : api.createFaqCategory(formData);
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
                />
                {formErrors?.name && <small className="text-danger">This field is required</small>}
                {errors.name && <span className="form-text text-danger">{errors.name[0]}</span>}
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