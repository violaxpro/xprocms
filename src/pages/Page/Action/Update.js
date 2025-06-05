import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  DropdownToggle,
} from "reactstrap";
import "react-image-lightbox/style.css";
import Editor from 'components/Common/Editor';
import slugify from '@sindresorhus/slugify';
import ReactSelect from 'react-select';
import Lightbox from "react-image-lightbox";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import api from "helpers/api";
import { getImageUrl, showToast } from "helpers/utils";
import { isString } from "lodash";

const SetPage = () => {
  const { register, setValue, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const history = useHistory();
  const { id } = useParams()
  const [brands, setBrands] = useState(null)
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [subCategory2, setSubCategory2] = useState(null)
  const [defaultCategorySelect, setDefaultCategorySelect] = useState([])
  const [defaultSubCategorySelect, setDefaultSubCategorySelect] = useState([])
  const [defaultSubCategory2Select, setDefaultSubCategory2Select] = useState([])
  const [errorRes, setErrorRes] = useState([])
  const [formValues, setFormValues] = useState([])
  const [imagePreview, setImagePreview] = useState('')

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
        title: '',
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

  const removeFormFields = (i, type) => {
    let formFields = [...formValues]
    formFields.splice(i, 1);
    setFormValues(formFields)

    // if (type == 'description') {
    // } else if (type == 'map') {
    //   setValue(`map_title[${i}]`, null)
    //   setValue(`map_description[${i}]`, null)
    //   setValue(`map_url[${i}]`, null)
    // } else {
    // }

    if (type == 'description') {
      formFields.map((value, index) => {
        formFields[index].section_title = value.section_title
        formFields[index].section_description = value.section_description
        document.getElementById(`section_title[${index}]`).value = value.section_title
      })
      setFormValues(formFields)

      setValue(`section_title[${i}]`, null)
      setValue(`section_description[${i}]`, null)
    }
    console.log(formValues)
  }

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
    data[index]['images'].splice(i, 1)
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
    enabled: !!subCategory,
    refetchOnWindowFocus: false,
  });

  const { data, refetch: getData, isLoading } = useQuery(['page-edit'], () => api.editPage(id), {
    onSuccess: ({ data, category, brands }) => {
      setErrorRes([]);
      reset({
        ...data,
      });
      data.order.map((item, i) => {
        if (item.type == 'image') {
          setValue(`page_image_title[${i}]`, item.title)
          if (item.image.length > 0) {
            setFormValues(prev => [...prev, {
              title: item.title,
              type: item.type,
              images: item.image?.map((value, index) => {
                setValue(`page_image[${i}][${index}]`, value.image)
                setValue(`image_title[${i}][${index}]`, value.title)
                setValue(`image_description[${i}][${index}]`, value.description)
                setValue(`image_alt[${i}][${index}]`, value.alt)
                setValue(`image_link[${i}][${index}]`, value.link)
                return {
                  page_image: value.image,
                  image_title: value.title,
                  image_description: value.description,
                  image_alt: value.alt,
                  image_link: value.link,
                }
              })
            }])
          }
        }else{
          if (item.section.length > 0) {
            item.section.map((section, index) => {
              setFormValues(prev => [...prev, {
                title: item.title,
                type: item.type,
                section_title: section.title,
                section_description: section.description
              }])
              setValue(`section_title[${index}]`, section.title)
              setValue(`section_description[${index}]`, section.description)
            })
          }
        }

        item?.maps?.map((item, index) => {
          setFormValues(prev => [...prev, {
            type: 'map',
            map_title: item?.title,
            map_description: item?.description,
            map_url: item?.url,
          }])
          setValue(`map_title[${i}]`, item.title)
          setValue(`map_description[${i}]`, item.description)
          setValue(`map_url[${i}]`, item.url)
        })
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
    const formData = new FormData();
    console.log(params)
    for (const [key, value] of Object.entries(params)) {
      if (!['page_image', 'image_title', 'image_description', 'page_brand_id', 'image_alt', 'image_link'].includes(key)) {
        if (value instanceof Array) {
          value.map((item, i) => {
            if (item) {
              formData.append(`${key}[${i}]`, item)
            }
          })
        } else {
          if (value != null) {
            formData.append(key, value)
          }
        }
      } else if (key == 'page_brand_id') {
        value.map((item, i) => {
          formData.append(`${key}[${i}]`, JSON.stringify(value[i]))
        })
      }
    }
    params?.page_image?.map((item, index) => {
      item?.filter(item => !!item).map((item, i) => {
        formData.append(`page_image[${index}][${i}]`, item)
      })
    })
    params?.image_title?.map((item, index) => {
      item?.filter(item => !!item).map((item, i) => {
        if (item) {
          formData.append(`image_title[${index}][${i}]`, item)
        }
      })
    })
    params?.image_description?.map((item, index) => {
      item?.filter(item => !!item).map((item, i) => {
        if (item) {
          formData.append(`image_description[${index}][${i}]`, item)
        }
      })
    })
    params?.image_alt?.map((item, index) => {
      item?.filter(item => !!item).map((item, i) => {
        if (item) {
          formData.append(`image_alt[${index}][${i}]`, item)
        }
      })
    })
    params?.image_link?.map((item, index) => {
      item?.filter(item => !!item).map((item, i) => {
        if (item) {
          formData.append(`image_link[${index}][${i}]`, item)
        }
      })
    })
    formValues.map((item, i) => {
      formData.append(`section_types[${i}]`, item.type)
    })
    formData.append('_method', 'PUT')
    return api.updatePage(id, formData)
  }, {
    onSuccess: (res) => {
      showToast(res.message, !res.status && 'error')
      if (!res.status) {
        setErrorRes(res.errors)
        return;
      }
      history.push('/pages')
    },
    onError: (err) => {
      setErrorRes(err.response.data.errors)
      showToast('Failed to submit page', 'error')
    }
  })

  useEffect(() => {
    setDefaultCategorySelect(null)
    setDefaultSubCategorySelect(null)
    setDefaultSubCategory2Select(null)
    if (data?.data?.category?.parent?.parent) {
      setCategory(data?.data?.category?.parent?.parent?.id)
      setDefaultCategorySelect([{ label: data?.data?.category?.parent?.parent?.name, value: data?.data?.category?.parent?.parent?.id }])
    } else if (data?.data?.category?.parent) {
      setCategory(data?.data?.category?.parent?.id)
      setDefaultCategorySelect([{ label: data?.data?.category?.parent?.name, value: data?.data?.category?.parent?.id }])
    } else if (data?.data?.category?.name) {
      setDefaultCategorySelect([{ label: data?.data?.category?.name, value: data?.data?.category?.id }])
    }else{
      setDefaultCategorySelect(null)
    }

    if (data?.data?.category?.parent?.parent) {
      setSubCategory(data?.data?.category?.parent?.id)
      setDefaultSubCategorySelect([{ label: data?.data?.category?.parent?.name, value: data?.data?.category?.parent?.id }])
    } else if (data?.data?.category?.parent) {
      setSubCategory(data?.data?.category?.id)
      setDefaultSubCategorySelect([{ label: data?.data?.category?.name, value: data?.data?.category?.id }])
    } else {
      setDefaultSubCategorySelect(null)
    }

    if (data?.data?.category?.parent?.parent) {
      setSubCategory2(data?.data?.category?.id)
      setDefaultSubCategory2Select([{ label: data?.data?.category?.name, value: data?.data?.category?.id }])
    } else {
      setDefaultSubCategory2Select(null)
    }

    if (data?.data?.brands?.length > 0) {
      setValue('page_brand_id', data?.data?.brands.map((item, i) => (
        {
          [item.id]: { index: i }
        }
      )))
    }
  }, [data])

  const selectBrands = (e) => {
    let selectedValues = [];
    if (e?.[0]?.value == 'all') {
      selectedValues = data?.brands;
      setValue('page_brand_id', data?.brands?.map((item, i) => {
        return (
          {
            [item.value]: { index: i }
          }
        )
      }))
    } else {
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


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Home"
            breadcrumbItem="Edit Page"
          />

          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(mutate)}>
                {!isLoading  ? (
                  <>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label>Category</label>
                          <ReactSelect
                            isClearable
                            options={categories?.categories}
                            name="category"
                            onChange={(e) => {
                              setCategory(e?.value)
                              setValue('category_id', e?.value)
                              setDefaultCategorySelect([{ label: e.label, value: e?.value }])
                            }}
                            isLoading={isLoading}
                            value={defaultCategorySelect}
                          >
                          </ReactSelect>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label>Sub Category</label>
                          <ReactSelect
                            isClearable
                            options={subCategories?.categories}
                            name="subcategories"
                            onChange={(e) => {
                              setSubCategory(e?.value)
                              setValue('category_id', e?.value)
                              setDefaultSubCategorySelect([{ label: e.label, value: e?.value }])
                            }}
                            isLoading={isLoading}
                            value={defaultSubCategorySelect}
                          >
                          </ReactSelect>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label>Sub Category 2</label>
                          <ReactSelect
                            isClearable
                            options={subCategories2?.categories}
                            name="subcategories2"
                            onChange={(e) => {
                              setSubCategory2(e?.value)
                              setValue('category_id', e?.value)
                              setDefaultSubCategory2Select([{ label: e.label, value: e?.value }])
                            }}
                            isLoading={isLoading}
                            value={defaultSubCategory2Select}
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
                            {...register('title', { required: true })}
                            onChange={(e) => setValue('slug', slugify(e.target.value))}
                          />
                          {errors?.title && <small className="text-danger">This field is required</small>}
                          {errorRes.title && <span className="form-text text-danger">{errorRes.title[0]}</span>}
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
                          {errorRes.slug && <span className="form-text text-danger">{errorRes.slug[0]}</span>}
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
                          {errorRes.meta_title && <span className="form-text text-danger">{errorRes.meta_title[0]}</span>}
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
                          {errorRes.meta_description && <span className="form-text text-errorRes">{errors.meta_description[0]}</span>}
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
                                    setFormValues(newFormValues);
                                    setValue(`section_description[${index}]`, editor.getData())
                                  }}
                                  name={`section_description[${index}]`}
                                  data={element.section_description ?? ''}
                                />
                              </Col>
                            </Row>
                          </>
                        ) : element.type == 'map' ? (
                          <>
                          {console.log(element)}
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
                                      value={element.map_title}
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
                                      value={element.map_description}
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
                                      value={element.map_url}
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
                                <div className="my-3">
                                  <label>Image Section Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title"
                                    onChange={e => setValue(`page_image_title[${index}]`, e.target.value)}
                                    name={`page_image_title[${index}]`}
                                    id={`page_image_title[${index}]`}
                                    defaultValue={element.title}
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
                                        className="form-control mb-3"
                                        placeholder="Image"
                                        onChange={e => handleChangeImageInput(index, i, e)}
                                        name={`page_image[${index}][${i}]`}
                                        id={`page_image[${i}]`}
                                        // defaultValue={item?.page_image}
                                        // required
                                      />
                                      {item?.page_image && imagePreview == item?.page_image ? (
                                        <>
                                          <Lightbox
                                            mainSrc={getImageUrl(item?.page_image)}
                                            enableZoom={false}
                                            onCloseRequest={() => setImagePreview('abc')}
                                          />
                                        </>
                                      ) : null}
                                      {item?.page_image && isString(item?.page_image) ? (
                                        <div className="d-flex align-items-center">
                                          <img
                                            onClick={() => {
                                              setImagePreview(item?.page_image);
                                            }}
                                            className="img-fluid mt-3"
                                            src={getImageUrl(item?.page_image)}
                                            width="75"
                                            defaultValue={item?.page_image}
                                          />
                                        </div>
                                      ) : null}
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
                                        id={`image_alt[${i}]`}
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
                                        id={`image_link[${i}]`}
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
                                        id={`image_title[${i}]`}
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
                                        id={`image_description[${i}]`}
                                        value={item?.image_description}
                                        required
                                      />
                                    </div>
                                  </Col>
                                </Row>
                                <div className="row justify-content-end">
                                  <button type="button" className="btn btn-sm btn-danger" style={{ width: '15%' }} onClick={() => handleDeleteImage(index, i)}>
                                    Delete <i className="mdi mdi-trash-can font-size-16"></i>
                                  </button>
                                </div>
                                <hr style={{ border: '1px solid #ddd' }} />
                              </div>
                            ))}
                            <button type="button" className="btn btn-outline-primary w-100" style={{ width: '15%' }} onClick={() => addImageFormFields('image', index)}>
                              Add Image
                            </button>
                          </>
                        )}

                        <button type="button" className="btn btn-danger w-md mt-3 d-block w-100" onClick={() => removeFormFields(index, element.type)}>
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

                    {/* <button type="button" className="btn btn-primary w-md mt-3 d-block w-100" onClick={() => addFormFields()}>
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
                          {errorRes.brand_title && <span className="form-text text-danger">{errorRes.brand_title[0]}</span>}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label>Brand</label>
                          <ReactSelect
                            isClearable
                            options={[{ value: 'all', label: 'Select All Brand' }].concat(data?.brands)}
                            isMulti={true}
                            name="page_brand_id"
                            onChange={(e) => selectBrands(e)}
                            value={brands}
                          >
                          </ReactSelect>
                          {errors?.page_brand_id && <small className="text-danger">This field is required</small>}
                          {errorRes.page_brand_id && <span className="form-text text-errorRes">{errors.page_brand_id[0]}</span>}
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
                  </>
                ) : null}
              </form>
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default SetPage;
