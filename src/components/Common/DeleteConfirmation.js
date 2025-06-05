import React, { useState } from 'react'
import SweetAlert from 'react-bootstrap-sweetalert';

const DeleteConfirmation = ({ showDelete, setShowDelete, deleteAction }) => {
  const [success, setSuccess] = useState(false)

  return (
    <>
      {success && (
        <SweetAlert
          success
          timeout={1500}
          title="Processed"
          onConfirm={() => {
            setSuccess(false)
          }}
        >
          Your request has been processed.
        </SweetAlert>
      )}

      {showDelete && (
        <SweetAlert
          title="Are you sure?"
          warning
          showCancel
          confirmButtonText="Yes, i'm very sure!"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            setShowDelete(false)
            setSuccess(true)
            deleteAction()
          }}
          onCancel={() => setShowDelete(false)}
        >
          You won&apos;t be able to revert this!
        </SweetAlert>
      )}
    </>
  );
}

export default DeleteConfirmation