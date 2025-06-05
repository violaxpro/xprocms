import { Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import TabFeature from './Tab/TabFeature';
import TabCard from './Tab/TabCard';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'helpers/api';
import { showToast } from 'helpers/utils';
import { getSettings } from 'store/actions';
import { useDispatch } from 'react-redux';

const SecondSection = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const [customActiveTab, setcustomActiveTab] = useState(1);

  const { mutate, isLoading: submitLoading, isSuccess } = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      console.log(values)
      for (const [key, value] of Object.entries(values)) {
        if (value instanceof FileList) {
          formData.append(key, value[0])
        } else {
          formData.append(key, value)
        }
      }
      await api.updateSettings(formData)
    },
    onSuccess: () => {
      showToast('Successfully saved settings.');
    },
  })

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(getSettings());
  }, [isSuccess]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(mutate)}>
        <h3>
          Second Section
          <i className="fa fa-question-circle ms-2" id="section-2" style={{ fontSize: 16 }}></i>
        </h3>
        <UncontrolledTooltip placement="right" target="section-2">
          <img src="/sections/2.png" alt="" width="100%" />
        </UncontrolledTooltip>

        <Nav tabs className="nav-tabs-custom nav-justified" id="test">
          {Array(3).fill().map((v, i) => (
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
          {Array(3).fill().map((v, i) => (
            <TabPane tabId={i + 1} key={i}>
              <TabCard id={i + 1} name={`second_section_${i+1}`} defaultName="feature" />
            </TabPane>
          ))}
        </TabContent>

        <div>
          <button type="submit" className="btn btn-primary w-md" disabled={submitLoading}>
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default React.memo(SecondSection);