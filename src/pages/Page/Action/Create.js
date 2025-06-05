import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Label,
  Col,
  Row,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import "react-image-lightbox/style.css";
import Editor from 'components/Common/Editor';
import slugify from '@sindresorhus/slugify';
import ReactSelect from 'react-select';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import api from "helpers/api";
import { showToast } from "helpers/utils";

const PageCreate = () => {
  const { register, setValue, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const history = useHistory();
  const [brands, setBrands] = useState(null)
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [subCategory2, setSubCategory2] = useState(null)
  const [errorRes, setErrorRes] = useState([])
  const [formValues, setFormValues] = useState([])

  // Handle Section

  const handleChange = (i, e) => {
    let fields = [...formValues];
    var name = e.target.name.replace(`[${i}]`, '');
    fields[i][e.target.name] = e.target.value;
    fields[i][name] = e.target.value;

    setFormValues(fields);
    setValue(e.target.name, e.target.value)
  }

  const addFormFields = (type) => {
    if (type == 'description') {
      setFormValues(prev => [...prev, { type, section_title: "", section_description: "" }])
    } else if (type == 'map') {
      setFormValues(prev => [...prev, { type, map_title: "", map_description: "", map_url: '' }])
    } else {
      setFormValues(prev => [...prev, {
        type,
        images: [{
          page_image: "",
          image_title: "",
          image_description: "",
          image_alt: "",
          image_link: "",
        }]
      }])
    }
  }

  const removeFormFields = (i) => {
    let data = [...formValues]
    data.splice(i, 1);
    setFormValues(data)

    // if (type == 'description') {
    // } else if (type == 'map') {
    //   setValue(`map_title[${i}]`, null)
    //   setValue(`map_description[${i}]`, null)
    //   setValue(`map_url[${i}]`, null)
    // } else {
    // }

    if (type == 'description') {
      data.map((value, index) => {
        data[index].section_title = value.section_title
        data[index].section_description = value.section_description
        document.getElementById(`section_title[${index}]`).value = value.section_title
      })
      setFormValues(data)

      document.getElementsByName('meta_title')[0].click()
      setValue(`section_title[${i}]`, null)
      setValue(`section_description[${i}]`, null)
    }

  }
  // End Handle Section

  const handleChangeImageInput = (index, i, e) => {
    let data = [...formValues]
    var name = e.target.name.replace(`[${index}][${i}]`, '');
    if (e.target.files && e.target.files.length > 0) {
      data[index]['images'][i][e.target.name] = e.target.files[0];
      data[index]['images'][i][name] = e.target.files[0];
      setValue(e.target.name, e.target.files[0])
    } else {
      data[index]['images'][i][e.target.name] = e.target.value;
      data[index]['images'][i][name] = e.target.value;
      setValue(e.target.name, e.target.value)
    }
    setFormValues(data);
  }

  const handleDeleteImage = (index, i, e) => {
    let data = [...formValues]
    data[index]['images'].splice(i, 1);
    setFormValues(data);
    setValue(`page_image[${index}][${i}]`, null)
    setValue(`image_alt[${index}][${i}]`, null)
    setValue(`image_link[${index}][${i}]`, null)
    setValue(`image_title[${index}][${i}]`, null)
    setValue(`image_description[${index}][${i}]`, null)
  }

  const addImageFormFields = (type, index) => {
    setFormValues(prev => {
      let images = prev;
      images[index].images[images[index].images.length] = {
        page_image: "",
        image_title: "",
        image_description: "",
        image_alt: "",
        image_link: "",
      }
      return [...images]
    })
  }

  const { data: categories } = useQuery(['categories-select'], () => api.categorySelect(), {
    refetchOnWindowFocus: false,
  });

  const { data: subCategories } = useQuery(['subcategories-select', category], () => api.categorySelect({
    params: { parent_id: category }
  }), {
    enabled: !!category,
    refetchOnWindowFocus: false,
  });

  const { data: subCategories2 } = useQuery(['subcategories2-select', subCategory], () => api.categorySelect({
    params: { parent_id: subCategory }
  }), {
    onSuccess: () => {
      setSubCategory2(null)
    },
    enabled: !!subCategory,
    refetchOnWindowFocus: false,
  });

  const { data, refetch: getData, isLoading } = useQuery(['brand-select'], () => api.brandSelect(), {
    onSuccess: ({ data }) => {
      setErrorRes([]);
      reset();
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
    const formData = new FormData();
    console.log(params)
    for (const [key, value] of Object.entries(params)) {
      if (!['page_image', 'image_title', 'image_description', 'page_brand_id', 'image_alt', 'image_link'].includes(key)) {
        console.log(key)
        if (value instanceof Array) {
          value.map((item, i) => {
            if (item) {
              formData.append(`${key}[${i}]`, item)
            }
          })
        } else {
          formData.append(key, value)
        }
      } else if (key == 'page_brand_id') {
        value.map((item, i) => {
          formData.append(`${key}[${i}]`, JSON.stringify(value[i]))
        })
      }
    }
    params?.page_image?.map((item, index) => {
      item?.filter(item => !!item)?.map((item, i) => {
        formData.append(`page_image[${index}][${i}]`, item)
      })
    })
    params?.image_title?.map((item, index) => {
      item?.filter(item => !!item)?.map((item, i) => {
        formData.append(`image_title[${index}][${i}]`, item)
      })
    })
    params?.image_description?.map((item, index) => {
      item?.filter(item => !!item)?.map((item, i) => {
        formData.append(`image_description[${index}][${i}]`, item)
      })
    })
    params?.image_alt?.map((item, index) => {
      item?.filter(item => !!item)?.map((item, i) => {
        formData.append(`image_alt[${index}][${i}]`, item)
      })
    })
    params?.image_link?.map((item, index) => {
      item?.filter(item => !!item)?.map((item, i) => {
        formData.append(`image_link[${index}][${i}]`, item)
      })
    })
    formValues.map((item, i) => {
      formData.append(`section_types[${i}]`, item.type)
    })
    return api.createPage(formData)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        showToast('Failed to submit page', 'error')
        setErrorRes(res?.errors)
        return;
      }
      history.push('/pages')
    },
    onError: (err) => {
      setErrorRes(err?.response?.data?.errors)
      showToast('Failed to submit page', 'error')
    }
  })

  const selectBrands = (e) => {
    let selectedValues = [];
    if (e?.[0]?.value == 'all') {
      selectedValues = data?.brands;
      setValue('page_brand_id', data?.brands?.map((item, i) => {
        return (
        {
          [item.value]: { index: i }
        }
      )}))
    }else{
      selectedValues = e;
      setValue('page_brand_id', e.map((item, i) => (
        {
          [item.value]: { index: i }
        }
      )))
    }
    setBrands(selectedValues)
    watch('page_brand_id')
  }
  // useEffect(() => {
  //   console.log(formValues)
  // }, [formValues])


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Home"
            breadcrumbItem="Create Page"
          />

          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(mutate)}>
                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Category</label>
                      <ReactSelect
                        options={categories?.categories}
                        name="category"
                        onChange={(e) => {
                          setCategory(e?.value)
                          setValue('category_id', e?.value)
                        }}
                        isClearable
                        // defaultValue={pages?.pages?.filter(page => page?.value == data?.privacy_policy_page)}
                      >
                      </ReactSelect>
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label>Sub Category</label>
                      <ReactSelect
                        options={subCategories?.categories}
                        name="subcategories"
                        onChange={(e) => {
                          setSubCategory(e?.value)
                          setValue('category_id', e?.value)
                        }}
                        isClearable
                      // defaultValue={pages?.pages?.filter(page => page?.value == data?.privacy_policy_page)}
                      >
                      </ReactSelect>
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label>Sub Category 2</label>
                      <ReactSelect
                        options={subCategories2?.categories}
                        name="privacy_policy_page"
                        onChange={(e) => {
                          setSubCategory2(e?.value)
                          setValue('category_id', e?.value)
                        }}
                        isClearable
                      // defaultValue={pages?.pages?.filter(page => page?.value == data?.privacy_policy_page)}
                      >
                      </ReactSelect>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        {...register('title', { required: 'This field is required' })}
                        onChange={(e) => setValue('slug', slugify(e.target.value))}
                      />
                      {errors?.title && <small className="text-danger">This field is required</small>}
                      {errorRes?.title && <span className="form-text text-danger">{errorRes?.title[0]}</span>}
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
                      {errors?.slug && <small className="text-danger">This field is required</small>}
                      {errorRes?.slug && <span className="form-text text-danger">{errorRes?.slug[0]}</span>}
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
                      <small className={watch('meta_title')?.length >= 50 && watch('meta_title')?.length <= 65 ? 'text-success' : 'text-danger'}>Character Count: {watch('meta_title')?.length}</small>
                      {errors?.meta_title && <small className="text-danger">This field is required</small>}
                      {errorRes?.meta_title && <span className="form-text text-danger">{errorRes?.meta_title[0]}</span>}
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
                      <small className={watch('meta_description')?.length >= 65 && watch('meta_description')?.length <= 155 ? 'text-success' : 'text-danger'}>Character Count: {watch('meta_description')?.length}</small>
                      {errors?.meta_description && <small className="text-danger">This field is required</small>}
                      {errorRes?.meta_description && <span className="form-text text-danger">{errorRes?.meta_description[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Editor
                      onChange={(event, editor) => {
                        setValue('description', editor.getData())
                      }}
                      data={''}
                    />
                    {errorRes?.description && <span className="form-text text-danger">{errorRes?.description[0]}</span>}
                  </Col>
                </Row>

                {formValues.map((element, index) => (
                  <div key={index}>
                    <hr />
                    {element.type == 'description' ? (
                      <>
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
                                newFormValues[index][`section_description`] = editor.getData();
                                setFormValues(newFormValues);
                                setValue(`section_description[${index}]`, editor.getData())
                              }}
                              name={`section_description[${index}]`}
                              // data={formValues[index].section_description ?? ''}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : element.type == 'map' ? (
                      <>
                        <Row>
                          <Col>
                            <div className="my-3">
                              <label>Title</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                onChange={e => handleChange(index, e)}
                                name={`map_title[${index}]`}
                                id={`map_title[${index}]`}
                                defaultValue={element.map_title}
                                required
                              />
                            </div>
                          </Col>
                          <Col>
                            <div className="my-3">
                              <label>Description</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                onChange={e => handleChange(index, e)}
                                name={`map_description[${index}]`}
                                id={`map_description[${index}]`}
                                defaultValue={element.map_description}
                                required
                              />
                            </div>
                          </Col>
                          <Col>
                            <div className="my-3">
                              <label>URL</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="URL"
                                onChange={e => handleChange(index, e)}
                                name={`map_url[${index}]`}
                                id={`map_url[${index}]`}
                                defaultValue={element.map_url}
                                required
                              />
                            </div>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                      <Row>
                        <Col>
                          <div className="mb-3">
                            <label>Image Section Title</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                onChange={e => setValue(`page_image_title[${index}]`, e.target.value)}
                                name={`page_image_title[${index}]`}
                                id={`page_image_title[${index}]`}
                                required
                              />
                          </div>
                        </Col>
                      </Row>
                        {element.images.map((item, i) => (
                          <div key={i}>
                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <label>Image</label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      placeholder="Image"
                                      onChange={e => handleChangeImageInput(index, i, e)}
                                      name={`page_image[${index}][${i}]`}
                                      id={`page_image[${index}][${i}]`}
                                      defaultValue={item?.page_image}
                                      required
                                    />
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <label>Alt</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Alt"
                                      onChange={e => handleChangeImageInput(index, i, e)}
                                      name={`image_alt[${index}][${i}]`}
                                      id={`image_alt[${index}][${i}]`}
                                      value={item?.image_alt}
                                      required
                                    />
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <label>Link</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Link"
                                    onChange={e => handleChangeImageInput(index, i, e)}
                                    name={`image_link[${index}][${i}]`}
                                    id={`image_link[${index}][${i}]`}
                                    value={item?.image_link}
                                    required
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <label>Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title"
                                    onChange={e => handleChangeImageInput(index, i, e)}
                                    name={`image_title[${index}][${i}]`}
                                    id={`image_title[${index}][${i}]`}
                                    value={item?.image_title}
                                    required
                                  />
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <label>Description</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    onChange={e => handleChangeImageInput(index, i, e)}
                                    name={`image_description[${index}][${i}]`}
                                    id={`image_description[${index}][${i}]`}
                                    value={item?.image_description}
                                    required
                                  />
                                </div>
                              </Col>
                            </Row>
                            <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => handleDeleteImage(index, i)}>
                              Delete <i className="mdi mdi-trash-can font-size-16"></i>
                            </button>
                            <hr style={{ border: '1px solid #ddd' }} />
                          </div>
                        ))}

                        <button type="button" className="btn btn-outline-primary w-100" onClick={() => addImageFormFields('image', index)}>
                          Add Image
                        </button>
                      </>
                    )}

                    <button type="button" className="btn btn-danger w-md mt-3 d-block w-100" onClick={() => removeFormFields(index)}>
                      Remove
                    </button>
                  </div>
                ))}

                <UncontrolledButtonDropdown direction="down" className="w-100 mt-3">
                  <DropdownToggle caret color="primary">
                    Add Section
                  </DropdownToggle>
                  <DropdownMenu className="w-100">
                    <DropdownItem onClick={() => addFormFields('description')} className="text-center">
                      Add Description Section
                    </DropdownItem>
                    <DropdownItem className="text-center" onClick={() => addFormFields('image')}>
                      Add Image Section
                    </DropdownItem>
                    <DropdownItem onClick={() => addFormFields('map')} className="text-center">
                      Add Map Section
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                {/* <button type="button" className="btn btn-primary " onClick={() => addFormFields()}>
                  Add Section
                </button> */}

                <Row>
                  <Col>
                    <div className="my-3">
                      <label>Brand Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brand Title"
                        {...register('brand_title')}
                      />
                      {errors?.brand_title && <small className="text-danger">This field is required</small>}
                      {errorRes?.brand_title && <span className="form-text text-danger">{errorRes?.brand_title[0]}</span>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="mb-3">
                      <label>Brand</label>
                      <ReactSelect
                        options={[{ value: 'all', label: 'Select All Brand' }].concat(data?.brands)}
                        isMulti={true}
                        name="page_brand_id"
                        onChange={(e) => selectBrands(e)}
                        value={brands}
                      >
                      </ReactSelect>
                      {errors?.page_brand_id && <small className="text-danger">This field is required</small>}
                      {errorRes?.page_brand_id && <span className="form-text text-danger">{errorRes?.page_brand_id[0]}</span>}
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

export default React.memo(PageCreate);
