import { toast } from "vue3-toastify";

const options = {
    position: 'bottom-right',
    autoClose: 2000,
    theme: "colored", 
    hideProgressBar: true,
    closeOnClick: true,
    closeButton: true,
    dangerouslyHTMLString: true,
    transition: "flip",
}

export const toastSuccess = (detail) => {
    try {
        toast.success(detail, options) 
    } catch (error) { 
        console.warning(error + "")
    }
} 

export const toastError = (detail) => {
    try {
        toast.error(detail, options)
    } catch (error) {
        console.warning(error + "")
    }
}

export const toastInfo = (detail) => {
    try {
        toast.info(detail, options)
    } catch (error) {
        console.warning(error + "")
    }
}

export const toastWarning = (detail) => {
    try {
        toast.warning(detail, options)
    } catch (error) {
        console.warning(error + "")
    }
}

// Función para mostrar un toast de carga
export const showLoadingToast = (detail) => {
    try {
        const id = toast.loading(detail, {
            position: 'bottom-right',
        })
        return id
    } catch (error) {
        console.warning(error + "")
    }
} 

// Función para finalizar un toast de carga
export const completeLoadingToast = (id, detail, type = null) => {
    try {
        if (type != null) {
            toast.update(id, {
                render: detail,
                type: type,
                isLoading: false,
                ...options,
            })
            toast.done(id)
        }else{
            toast.remove(id);
        }

      
    } catch (error) {
        console.warning(error + "")
    }
}
