import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Editor from 'components/Common/Editor';
import ReactSelect from 'react-select';

const CreateUpdate = ({ data, toggle, modal, handleCreateModal, refresh }) => {
  const { id } = useParams();
  const [search, setSearch] = useState('')
  const [errors, setErrors] = useState([])
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();

  const { data: categories, refetch: getData, isLoading: categoryLoading } = useQuery(['faq-categories-select', search], () => api.faqCategoriesSelect({
    params: {
      search: search,
      type: 'select',
    }
  }), {
    refetchOnWindowFocus: false,
  });

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
    return (await data) ? api.updateFaq(data.id, formData) : api.createFaq(formData);
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
          {data ? 'Update Faq' : 'Create Faq'}
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
                <label>Category</label>
                <ReactSelect
                  options={categories?.categories}
                  onInputChange={(val) => setSearch(val)}
                  onChange={(e) => setValue('faq_category_id', e?.value)}
                  isClearable
                  isLoading={categoryLoading}
                  defaultValue={[{ label: data?.category?.name, value: data?.category?.id, }]}
                >
                </ReactSelect>
                {formErrors?.faq_category_id && <small className="text-danger">This field is required</small>}
                {errors.faq_category_id && <span className="form-text text-danger">{errors.faq_category_id[0]}</span>}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="mb-3">
                <label>Question</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Question"
                  {...register('question', { required: true })}
                />
                {formErrors?.question && <small className="text-danger">This field is required</small>}
                {errors.question && <span className="form-text text-danger">{errors.question[0]}</span>}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-3">
                <label>Answer</label>
                <Editor
                  onChange={(event, editor) => {
                    setValue('answer', editor.getData())
                  }}
                  data={data?.answer ?? ''}
                />
                {formErrors?.answer && <small className="text-danger">This field is required</small>}
                {errors.answer && <span className="form-text text-danger">{errors.answer[0]}</span>}
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