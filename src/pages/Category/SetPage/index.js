import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Label,
  Col,
  Row,
} from "reactstrap";
import "react-image-lightbox/style.css";
import Editor from 'components/Common/Editor';
import slugify from '@sindresorhus/slugify';
import ReactSelect from 'react-select';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import api from "helpers/api";
import { showToast } from "helpers/utils";

const SetPage = () => {
  const { register, setValue, handleSubmit, reset, formState: { formErrors } } = useForm();
  const { id } = useParams()
  const [brands, setBrands] = useState(null)
  const [errors, setErrors] = useState([])
  const [formValues, setFormValues] = useState([])

  let handleChange = useCallback((i, e) => {
    setFormValues(prev => {
      let data = prev;
      data[i][e.target.name] = e.target.value;
      data[i][e.target.name.replace(`[${i}]`)] = e.target.value;
      console.log(data)
      return data
    });
    setValue(e.target.name, e.target.value)
  }, [setFormValues, formValues])

  let addFormFields = () => {
    setFormValues([...formValues, { section_title: "", section_description: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
    console.log(newFormValues)
    newFormValues.map((value, index) => {
      document.getElementById(`section_title[${index}]`).value = value.section_title
    })
    setValue(`section_title[${i}]`, null)
    setValue(`section_description[${i}]`, null)
  }

  const { data, refetch: getData, isLoading } = useQuery(['category-page'], () => api.categoryPage(id), {
    onSuccess: ({ data, category }) => {
      setErrors([]);
      reset({
        ...data,
      });
      setValue('category_id', category.id)
      data.sections.map((section, index) => {
        setFormValues(prev => [...prev, { section_title: section.title, section_description: section.description }])
        setValue(`section_title[${index}]`, section.title)
        setValue(`section_description[${index}]`, section.description)
      })
      setBrands(
        data?.brands
        ?.map(brand => ({
          label: brand.name,
          value: brand.id,
        }))
      )
    },
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading: submitLoading } = useMutation((params) => {
    console.log(params)
    return api.setCategoryPage(params)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrors(res.errors)
        return;
      }
    },
    onError: (err) => {
      setErrors(err.response.data.errors)
      showToast('Failed to submit category', 'error')
    }
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Home"
            breadcrumbItem="Set Page Category"
          />

          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(mutate)}>
                <h3>{data?.category?.name}</h3>

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
                      data={data?.data?.description ?? ''}
                    />
                  </Col>
                </Row>

                {formValues.map((element, index) => (
                  <div key={index}>
                    <hr />
                    <Row>
                      <Col>
                        <div className="my-3">
                          <label>Title</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={e => handleChange(index, e)}
                            name={`section_title[${index}]`}
                            id={`section_title[${index}]`}
                            defaultValue={element.section_title}
                            required
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label>Description</label>
                        <Editor
                          onChange={(event, editor) => {
                            let newFormValues = [...formValues];
                            newFormValues[index][`section_description[${index}]`] = editor.getData();
                            setFormValues(newFormValues);
                            setValue(`section_description[${index}]`, editor.getData())
                          }}
                          name={`section_description[${index}]`}
                          data={element.section_description ?? ''}
                        />
                      </Col>
                    </Row>

                    <button type="button" className="btn btn-danger w-md mt-3 d-block w-100" onClick={() => removeFormFields(index)}>
                      Remove
                    </button>
                  </div>
                ))}

                <button type="button" className="btn btn-primary w-md mt-3 d-block w-100" onClick={() => addFormFields()}>
                  Add Section
                </button>

                <Row>
                  <Col>
                    <div className="my-3">
                      <label>Brand Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brand Title"
                        {...register('brand_title', { required: true })}
                      />
                      {formErrors?.brand_title && <small className="text-danger">This field is required</small>}
                      {errors.brand_title && <span className="form-text text-danger">{errors.brand_title[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Brand</label>
                      <ReactSelect
                        options={data?.brands}
                        isMulti={true}
                        name="category_page_brand_id"
                        onChange={(e) => {
                          setValue('category_page_brand_id', e.map((item, i) => (
                            {
                              [item.value]: { index: i }
                            }
                          )))
                          setBrands(e)
                        }}
                        value={brands}
                      >
                      </ReactSelect>
                      {formErrors?.category_page_brand_id && <small className="text-danger">This field is required</small>}
                      {errors.category_page_brand_id && <span className="form-text text-danger">{errors.category_page_brand_id[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <div className="form-group">
                  <input
                    id="show_contact_form"
                    type="checkbox"
                    value={1}
                    {...register('show_contact_form')}
                  />
                  {' '}
                  <Label check for="show_contact_form">
                    Show Contact Form
                  </Label>
                </div>

                <div className="d-md-flex justify-content-md-end mt-3">
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
              </form>
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default React.memo(SetPage);
