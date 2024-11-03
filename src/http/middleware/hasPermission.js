import { usePermission } from "@/stores/useAuthenticateStore"
// Nombre de la ruta de login
const ACCESS_DENIED = "n-access-denied"

const hasPermission = async (to, from, next, required_permissions) => {


  const use_permission = usePermission()
  await use_permission.userPermission() //cargar permisos

  if (use_permission.hasPermission(required_permissions)) {
    next()
  } else {
    next({ name: ACCESS_DENIED })
  }
}
export default hasPermission


