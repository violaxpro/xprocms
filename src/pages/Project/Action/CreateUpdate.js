import React, { useEffect, useState } from 'react'
import { Col, Modal, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
import { getImageUrl, showToast, convertArrayToObject } from 'helpers/utils';
import Editor from 'components/Common/Editor';
import TabCard from 'pages/HomepageSetting/Tabs/Tab/TabCard';
import { Divider } from '@material-ui/core';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { API_URL } from 'helpers/api_helper';

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const CreateUpdate = ({ data, toggle, modal, handleCreateModal, refresh }) => {
  const [finalData, setFinalData] = useState(null)
  const [errors, setErrors] = useState([])
  const [isHasFeature, setIsHasFeature] = useState(false)
  const [isHasService, setIsHasService] = useState(false)
  const [fileList, setFileList] = useState([])
  const methods = useForm();
  const [customActiveTab, setcustomActiveTab] = useState(1);

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const { mutate, isLoading: submitLoading } = useMutation(async (params) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value instanceof FileList) {
        formData.append(key, value[0])
      } else {
        if (value !== null) {
          formData.set(key, value)
        }
      }
    }
    fileList.map(item => item.filename).map((image, i) => {
      formData.append(`images[${i}]`, image)
    })
    if (data) {
      formData.append('_method', 'put')
    }
    return await data ? api.updateProject(data.id, formData) : api.createProject(formData)
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
      showToast('Failed to submit blog', 'error')
    }
  })

  useEffect(() => {
    setErrors([]);
    if (data) {
      let services = JSON.parse(data?.detail?.services).map((item, i) => {
          let obj = {};
          obj[`services_${i + 1}_image`] = item.image;
          obj[`services_${i + 1}_title`] = item.title;
          obj[`services_${i + 1}_description`] = item.description;
          return obj;
      });

      let features = JSON.parse(data?.detail?.features).map((item, i) => {
          let obj = {};
          obj[`features_${i + 1}_icon`] = item.icon;
          obj[`features_${i + 1}_title`] = item.title;
          obj[`features_${i + 1}_description`] = item.description;
          return obj;
      });
      methods.reset({
        ...data?.detail,
        ...data,
        ...convertArrayToObject(services),
        ...convertArrayToObject(features),
      });
      setFinalData({
        ...data?.detail,
        ...data,
        ...convertArrayToObject(services),
        ...convertArrayToObject(features),
      })
      let images = data.images.map(image => ({
        uid: image.id,
        percent: 100,
        name: image.path,
        status: 'done',
        url: getImageUrl(image.path),
        filename: image.path,
      }))
      setFileList(images)
      setIsHasFeature(data?.detail.is_has_feature)
      setIsHasService(data?.detail.is_has_service)
    }
  }, [data, modal])

  const handleChange = ({ fileList: newFileList }) => {
    newFileList.map(item => {
      item.status == 'done' ? item.filename = item.response.filename : item;
    })
    setFileList(newFileList)
  };

  return (
    <Modal
      size="lg"
      toggle={() => handleCreateModal()}
      isOpen={modal}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">
          {data ? 'Update Blog' : 'Create Blog'}
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
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(mutate)}>
            <Row>
              <Col>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    {...methods.register('name', { required: true })}
                  />
                  {methods.formState.errors?.name && <small className="text-danger">This field is required</small>}
                  {errors?.name && <span className="form-text text-danger">{errors?.name[0]}</span>}
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label>Company</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company"
                    {...methods.register('company', { required: true })}
                  />
                  {methods.formState.errors?.company && <small className="text-danger">This field is required</small>}
                  {errors?.company && <span className="form-text text-danger">{errors?.company[0]}</span>}
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label>Website Url</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Website Url"
                    {...methods.register('url', { required: true })}
                  />
                  {methods.formState.errors?.url && <small className="text-danger">This field is required</small>}
                  {errors?.url && <span className="form-text text-danger">{errors?.url[0]}</span>}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="mb-3">
                  <label>Short Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Short Description"
                    {...methods.register('short_description', { required: true })}
                  />
                  {methods.formState.errors?.short_description && <small className="text-danger">This field is required</small>}
                  {errors?.short_description && <span className="form-text text-danger">{errors?.short_description[0]}</span>}
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label>Thumbnail</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder="Thumbnail"
                    {...methods.register('thumbnail')}
                  />
                  {methods.formState.errors?.thumbnail && <small className="text-danger">This field is required</small>}
                  {errors?.thumbnail && <span className="form-text text-danger">{errors?.thumbnail[0]}</span>}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="mb-3">
                  <label>Description</label>
                  <Editor
                    onChange={(event, editor) => {
                      methods.setValue('description', editor.getData())
                    }}
                    data={data?.detail?.description}
                  />
                  {methods.formState.errors?.description && <small className="text-danger">This field is required</small>}
                  {errors?.description && <span className="form-text text-danger">{errors?.description[0]}</span>}
                </div>
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col>
                <div className="">
                  <label>Has Features?</label>
                  <input
                    type="checkbox"
                    id="is_has_feature"
                    value={true}
                    defaultChecked={data?.detail?.is_has_feature ? true : false}
                    name="is_has_feature"
                    className="mx-2"
                    placeholder="Has Features?"
                    onClick={(e) => {
                      setIsHasFeature(!!e.target.checked)
                      methods.setValue('is_has_feature', !!e.target.checked)
                    }}
                    // {...methods.register('is_has_feature')}
                  />
                  {methods.formState.errors?.is_has_feature && <small className="text-danger">This field is required</small>}
                  {errors?.is_has_feature && <span className="form-text text-danger">{errors?.is_has_feature[0]}</span>}
                </div>
              </Col>
            </Row>

            {isHasFeature ? (
              <>
                <Nav tabs className="nav-tabs-custom nav-justified" id="test">
                  {Array(4).fill().map((v, i) => (
                    <NavItem key={i}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={{
                          active: customActiveTab === i + 1,
                        }}
                        onClick={() => {
                          toggleCustom(i + 1);
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Card {i + 1}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                <TabContent
                  activeTab={customActiveTab}
                  className="p-3 text-muted"
                >
                  {Array(4).fill().map((v, i) => (
                    <TabPane tabId={i + 1} key={i}>
                      <TabCard customData={finalData} id={i + 1} name={`features_${i + 1}`} notRequired />
                    </TabPane>
                  ))}
                </TabContent>
              </>
            ) : null}

            <Divider />

            <Row>
              <Col>
                <div className="">
                  <label>Has Service?</label>
                  <input
                    type="checkbox"
                    id="is_has_service"
                    value={true}
                    defaultChecked={data?.detail?.is_has_service ? true : false}
                    name="is_has_service"
                    className="mx-2"
                    placeholder="Has Service?"
                    onClick={(e) => {
                      setIsHasService(e.target.checked)
                      methods.setValue('is_has_service', e.target.checked)
                    }}
                  />
                  {methods.formState.errors?.is_has_service && <small className="text-danger">This field is required</small>}
                  {errors?.is_has_service && <span className="form-text text-danger">{errors?.is_has_service[0]}</span>}
                </div>
              </Col>
            </Row>

            {isHasService ? (
              <>
                <Nav tabs className="nav-tabs-custom nav-justified" id="test">
                  {Array(4).fill().map((v, i) => (
                    <NavItem key={i}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={{
                          active: customActiveTab === i + 1,
                        }}
                        onClick={() => {
                          toggleCustom(i + 1);
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Card {i + 1}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                <TabContent
                  activeTab={customActiveTab}
                  className="p-3 text-muted"
                >
                  {Array(4).fill().map((v, i) => (
                    <TabPane tabId={i + 1} key={i}>
                      <TabCard customData={finalData} id={i + 1} name={`services_${i + 1}`} withImage notRequired />
                    </TabPane>
                  ))}
                </TabContent>
              </>
            ) : null}

            <Upload
              action={`${API_URL}upload-image`}
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              name="image"
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </form>
        </FormProvider>
      </div>
      <div className="modal-footer">
        <div className="d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary w-md" disabled={submitLoading} onClick={methods.handleSubmit(mutate)}>
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