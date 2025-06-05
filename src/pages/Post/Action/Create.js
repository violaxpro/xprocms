import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Modal, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
import { getImageUrl, showToast } from 'helpers/utils';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Editor from 'components/Common/Editor';
import ReactSelect from 'react-select';
import Lightbox from 'react-image-lightbox';
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const Create = () => {
  let history = useHistory();
  const [errors, setErrors] = useState([])
  const [search, setSearch] = useState('')
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();

  const { data: categories, refetch: getData, isLoading } = useQuery(['blog-categories', search], () => api.blogCategories({
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
    return await api.createBlog(formData)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrors(res.errors)
        return;
      }
      history.push('/blogs')
    },
    onError: (err) => {
      showToast('Failed to submit blog', 'error')
    }
  })

  useEffect(() => {
    setErrors([]);
    reset();
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Home"
            breadcrumbItem="Create Blog"
          />

          <Card>
            <CardBody>
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
                      />
                      {formErrors?.title && <small className="text-danger">This field is required</small>}
                      {errors.title && <span className="form-text text-danger">{errors.title[0]}</span>}
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label>Author</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Author"
                        {...register('author', { required: true })}
                      />
                      {formErrors?.author && <small className="text-danger">This field is required</small>}
                      {errors.author && <span className="form-text text-danger">{errors.author[0]}</span>}
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label>Category</label>
                      <ReactSelect
                        options={categories}
                        onInputChange={(val) => setSearch(val)}
                        onChange={(e) => setValue('blog_category_id', e?.value)}
                        isClearable
                      >
                      </ReactSelect>
                      {formErrors?.blog_category_id && <small className="text-danger">This field is required</small>}
                      {errors.blog_category_id && <span className="form-text text-danger">{errors.blog_category_id[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Thumbnail</label>
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Thumbnail"
                        {...register('thumbnail')}
                      />
                      {formErrors?.thumbnail && <small className="text-danger">This field is required</small>}
                      {errors.thumbnail && <span className="form-text text-danger">{errors.thumbnail[0]}</span>}
                    </div>
                    {/* {data ? (
                      <>
                        <img
                          onClick={() => {
                            setImagePreview('thumbnail');
                          }}
                          className="img-fluid my-3"
                          alt="app_logo"
                          src={getImageUrl(data.thumbnail)}
                          height="50"
                        />
                      </>
                    ) : null} */}
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Short Description</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Short Description"
                        {...register('short_description', { required: true })}
                      >
                      </textarea>
                      {formErrors?.short_description && <small className="text-danger">This field is required</small>}
                      {errors.short_description && <span className="form-text text-danger">{errors.short_description[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Description</label>
                      <Editor
                        onChange={(event, editor) => {
                          setValue('description', editor.getData())
                        }}
                        data=""
                      />
                      {formErrors?.description && <small className="text-danger">This field is required</small>}
                      {errors.description && <span className="form-text text-danger">{errors.description[0]}</span>}
                    </div>
                  </Col>
                </Row>
              </form>

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
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default React.memo(Create);