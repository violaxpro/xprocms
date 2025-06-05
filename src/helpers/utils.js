// const BASE_IMAGE_URL = 'http://localhost:8001/storage/uploads/';
const BASE_IMAGE_URL = 'https://api.xprogroup.com.au/storage/uploads/';
import toastr from "toastr";

export function getImageUrl(path) {
  return BASE_IMAGE_URL + path
}

export function showToast(message, type = null) {
  toastr.options = {
    positionClass: 'toast-top-right',
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
    newestOnTop: true,
    showEasing: 'swing',
    showDuration: true,
  };

  // setTimeout(() => toastr.success(`Settings updated `), 300)
  //Toaster Types
  if (type === "info") toastr.info(message, 'Information');
  else if (type === "warning") toastr.warning(message, 'Warning!');
  else if (type === "error") toastr.error(message, 'Error!');
  else toastr.success(message, 'Success!');
}

export function convertArrayToObject(array, key) {
  var result = {};
  array.map((v) => {
    Object.entries(v).map(value => {
      result[value[0]] = value[1];
    })
  });
  return result;
};

export function getRole() {
  return JSON.parse(localStorage.getItem('authUser')).user.role
}

export function hasRole(role) {
  if (role.includes(JSON.parse(localStorage.getItem('authUser')).user.role)) {
    return true
  }
  return false
  return JSON.parse(localStorage.getItem('authUser')).user.role
}