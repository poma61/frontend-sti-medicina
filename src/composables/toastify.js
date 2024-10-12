import { toast } from "vue3-toastify";

const options =  {
    position: 'bottom-right',
    autoClose: 5000,
    
}

export const toastSuccess = (detail)=>{
    toast.success(detail,options)
}

export const toastError = (detail) =>{
    toast.error(detail,options)
}

export const toastInfo = (detail) =>{
    toast.info(detail,options)
}

export const toastWarning = (detail) =>{
    toast.warning(detail,options)
}