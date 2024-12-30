export function handleAdmin(isAdmin: boolean) {
  return {type: "HANDLE_ADMIN", payload: isAdmin}
}